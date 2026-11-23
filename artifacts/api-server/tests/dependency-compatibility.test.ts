import assert from "node:assert/strict";
import { once } from "node:events";
import { createServer } from "node:http";
import test from "node:test";
import express from "express";
import multer from "multer";
import nodemailer from "nodemailer";
import sharp from "sharp";
import { google } from "googleapis";
import { SubmitContactBody } from "@workspace/api-zod";
import { insertContactSchema } from "@workspace/db/schema";

const contact = {
  name: "테스트 학교",
  phone: "000-0000-0000",
  subject: "교구 문의",
  message: "의자와 책상 문의입니다.",
};

test("Zod 4 validates both generated API and Drizzle insert schemas", () => {
  assert.deepEqual(SubmitContactBody.parse(contact), contact);
  assert.deepEqual(insertContactSchema.parse(contact), contact);
  assert.equal(
    SubmitContactBody.safeParse({ ...contact, name: 123 }).success,
    false,
  );
  assert.equal(
    insertContactSchema.safeParse({ ...contact, phone: null }).success,
    false,
  );
});

test("Nodemailer composes Korean inquiry mail without sending it", async () => {
  const transport = nodemailer.createTransport({
    streamTransport: true,
    buffer: true,
    newline: "unix",
  });
  const result = await transport.sendMail({
    from: "website@example.invalid",
    to: "inbox@example.invalid",
    subject: "[성림교구 문의] 교구 문의",
    html: "<p>학교 책상과 의자 문의입니다.</p>",
  });
  assert.deepEqual(result.envelope.to, ["inbox@example.invalid"]);
  const message = result.message.toString();
  assert.match(message, /Content-Type: text\/html/);
  assert.match(message, /Subject: =\?UTF-8\?B\?/i);
  transport.close();
});

test("Google API client remains compatible with the patched UUID dependency", () => {
  const auth = new google.auth.OAuth2(
    "test-client",
    undefined,
    "https://example.invalid/callback",
  );
  const url = new URL(
    auth.generateAuthUrl({
      scope: ["https://www.googleapis.com/auth/gmail.send"],
    }),
  );
  assert.equal(url.searchParams.get("client_id"), "test-client");
  assert.ok(google.gmail({ version: "v1", auth }).users.messages.send);
});

test("Express and Multer parse image uploads; Sharp crops and optimizes them", async () => {
  const app = express();
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.post("/body", (req, res) => res.json(req.body));
  const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 1024 * 1024 },
  });
  app.post("/upload", upload.single("image"), async (req, res) => {
    if (!req.file) {
      res.status(400).json({ error: "Missing image" });
      return;
    }
    const image = await sharp(req.file.buffer)
      .extract({ left: 0, top: 10, width: 100, height: 80 })
      .resize({ width: 50 })
      .jpeg({ quality: 80, mozjpeg: true })
      .toBuffer();
    const metadata = await sharp(image).metadata();
    res.json({
      schoolName: req.body.schoolName,
      format: metadata.format,
      width: metadata.width,
      height: metadata.height,
    });
  });
  const server = createServer(app);
  server.listen(0, "127.0.0.1");
  await once(server, "listening");
  try {
    const address = server.address();
    assert.ok(address && typeof address !== "string");
    const base = `http://127.0.0.1:${address.port}`;
    for (const [type, body] of [
      ["application/json", JSON.stringify({ name: "school" })],
      ["application/x-www-form-urlencoded", "name=school"],
    ]) {
      const response = await fetch(`${base}/body`, {
        method: "POST",
        headers: { "Content-Type": type! },
        body,
      });
      assert.equal(response.status, 200);
      assert.deepEqual(await response.json(), { name: "school" });
    }
    const png = await sharp({
      create: { width: 100, height: 100, channels: 3, background: "#abcdef" },
    })
      .png()
      .toBuffer();
    const form = new FormData();
    form.set("schoolName", "테스트 학교");
    form.set("image", new Blob([png], { type: "image/png" }), "classroom.png");
    const response = await fetch(`${base}/upload`, {
      method: "POST",
      body: form,
    });
    assert.equal(response.status, 200);
    assert.deepEqual(await response.json(), {
      schoolName: "테스트 학교",
      format: "jpeg",
      width: 50,
      height: 40,
    });
    const missing = await fetch(`${base}/upload`, {
      method: "POST",
      body: new FormData(),
    });
    assert.equal(missing.status, 400);
  } finally {
    await new Promise<void>((resolve, reject) =>
      server.close((error) => (error ? reject(error) : resolve())),
    );
  }
});
