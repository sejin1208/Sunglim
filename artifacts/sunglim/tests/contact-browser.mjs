// Run against the managed preview: node artifacts/sunglim/tests/contact-browser.mjs
// Uses Chromium's debugging protocol without an additional browser-test dependency.
import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { setTimeout as delay } from "node:timers/promises";

const profile = await mkdtemp(join(tmpdir(), "contact-validation-"));
const chromium = spawn(process.env.CHROMIUM_PATH || "chromium", [
  "--headless", "--no-sandbox", "--disable-dev-shm-usage",
  "--remote-debugging-port=0", `--user-data-dir=${profile}`, "about:blank",
], { stdio: ["ignore", "ignore", "pipe"] });
let socket;
try {
  const endpoint = await new Promise((resolve, reject) => {
    let output = "";
    const timeout = setTimeout(() => reject(new Error("Chromium startup timed out")), 15000);
    chromium.stderr.on("data", chunk => {
      output += chunk;
      const match = output.match(/DevTools listening on (ws:\/\/[^\s]+)/);
      if (match) { clearTimeout(timeout); resolve(match[1]); }
    });
    chromium.once("error", reject);
  });
  const port = new URL(endpoint).port;
  const pages = await (await fetch(`http://127.0.0.1:${port}/json/list`)).json();
  socket = new WebSocket(pages.find(page => page.type === "page").webSocketDebuggerUrl);
  await new Promise((resolve, reject) => {
    socket.addEventListener("open", resolve, { once: true });
    socket.addEventListener("error", reject, { once: true });
  });
  let id = 0;
  const pending = new Map();
  const exceptions = [];
  const submissions = [];
  const send = (method, params = {}) => new Promise((resolve, reject) => {
    const requestId = ++id;
    pending.set(requestId, { resolve, reject });
    socket.send(JSON.stringify({ id: requestId, method, params }));
  });
  socket.addEventListener("message", ({ data }) => {
    const message = JSON.parse(data);
    if (message.id) {
      const request = pending.get(message.id);
      pending.delete(message.id);
      if (message.error) request?.reject(new Error(JSON.stringify(message.error)));
      else request?.resolve(message.result);
    }
    if (message.method === "Runtime.exceptionThrown") exceptions.push(message.params.exceptionDetails);
    if (message.method === "Fetch.requestPaused") {
      const { requestId, request } = message.params;
      submissions.push(JSON.parse(request.postData));
      // Fulfill locally: never send a customer inquiry or trigger real email.
      void send("Fetch.fulfillRequest", {
        requestId, responseCode: 201,
        responseHeaders: [{ name: "Content-Type", value: "application/json" }],
        body: Buffer.from(JSON.stringify({ id: 1, message: "test" })).toString("base64"),
      });
    }
  });
  const evaluate = async expression => {
    const result = await send("Runtime.evaluate", { expression, returnByValue: true, awaitPromise: true });
    if (result.exceptionDetails) throw new Error(JSON.stringify(result.exceptionDetails));
    return result.result.value;
  };
  const waitFor = async expression => {
    for (let attempt = 0; attempt < 100; attempt++) {
      if (await evaluate(expression)) return;
      await delay(100);
    }
    throw new Error(`Browser assertion timed out: ${expression}; form: ${await evaluate("document.querySelector('form')?.innerText")}; intercepted submissions: ${submissions.length}`);
  };
  const fill = values => evaluate(`(() => {
    for (const [name, value] of Object.entries(${JSON.stringify(values)})) {
      const element = document.querySelector('[name="' + name + '"]');
      const prototype = element.tagName === 'TEXTAREA' ? HTMLTextAreaElement.prototype : HTMLInputElement.prototype;
      // Clear first so React observes a change even after a native form reset.
      Object.getOwnPropertyDescriptor(prototype, 'value').set.call(element, '');
      element.dispatchEvent(new Event('input', { bubbles: true }));
      Object.getOwnPropertyDescriptor(prototype, 'value').set.call(element, value);
      element.dispatchEvent(new Event('input', { bubbles: true }));
      element.dispatchEvent(new Event('change', { bubbles: true }));
    }
  })()`);
  const submit = () => evaluate("document.querySelector('form').requestSubmit()");
  await send("Runtime.enable");
  await send("Page.enable");
  await send("Fetch.enable", { patterns: [{ urlPattern: "*/api/contact", requestStage: "Request" }] });
  await send("Page.navigate", { url: `${process.env.PREVIEW_URL || "http://localhost:80"}/contact` });
  await waitFor("Boolean(document.querySelector('form [name=\"message\"]'))");

  await submit();
  for (const message of ["이름을 입력해주세요", "연락처를 입력해주세요", "제목을 입력해주세요", "내용을 10자 이상 입력해주세요"]) {
    await waitFor(`document.querySelector('form').innerText.includes(${JSON.stringify(message)})`);
  }
  assert.equal(submissions.length, 0);
  await fill({ name: "테스트 학교", phone: "000-0000-0000", subject: "교구 문의", message: "짧음", email: "" });
  await submit();
  await waitFor("document.querySelector('form').innerText.includes('내용을 10자 이상 입력해주세요')");
  await fill({ message: "학교 책상과 의자 견적을 문의합니다.", email: "not-an-email" });
  await submit();
  await waitFor("document.querySelector('form').innerText.includes('올바른 이메일 형식이어야 합니다')");
  assert.equal(submissions.length, 0);

  await fill({ email: "school@example.invalid" });
  await submit();
  await waitFor("document.body.innerText.includes('문의가 접수되었습니다.')");
  await waitFor("document.querySelector('[name=\"name\"]').value === ''");
  assert.equal(submissions.length, 1);
  assert.equal(submissions[0].email, "school@example.invalid");

  // Allow React Hook Form to finish re-registering fields after reset.
  await delay(200);
  await fill({ name: "테스트 학교", phone: "000-0000-0000", subject: "교구 문의", message: "학교 책상과 의자 견적을 문의합니다.", email: "" });
  await submit();
  await waitFor("document.querySelector('[name=\"name\"]').value === ''");
  assert.equal(submissions.length, 2);
  assert.equal(submissions[1].email, "");
  assert.deepEqual(exceptions, []);
  console.log("PASS: inline errors for empty/short/invalid-email input; valid and blank-email submissions, success toast, reset; no uncaught browser errors. Both POSTs intercepted; no data or email sent.");
} finally {
  socket?.close();
  const exited = new Promise(resolve => chromium.once("exit", resolve));
  chromium.kill("SIGTERM");
  await Promise.race([exited, delay(3000)]);
  await rm(profile, { recursive: true, force: true, maxRetries: 10, retryDelay: 100 }).catch(error => {
    console.warn(`Temporary Chromium profile cleanup: ${error.code}`);
  });
}
