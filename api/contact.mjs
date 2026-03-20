import nodemailer from "nodemailer";
import { google } from "googleapis";

async function sendViaGmailConnector({ to, subject, html }) {
  const hostname = process.env.REPLIT_CONNECTORS_HOSTNAME;
  const xReplitToken = process.env.REPL_IDENTITY
    ? "repl " + process.env.REPL_IDENTITY
    : process.env.WEB_REPL_RENEWAL
    ? "depl " + process.env.WEB_REPL_RENEWAL
    : null;

  if (!hostname || !xReplitToken) throw new Error("No connector env");

  const data = await fetch(
    "https://" + hostname + "/api/v2/connection?include_secrets=true&connector_names=google-mail",
    { headers: { Accept: "application/json", "X-Replit-Token": xReplitToken } }
  ).then((r) => r.json());

  const settings = data.items?.[0]?.settings;
  const accessToken = settings?.access_token || settings?.oauth?.credentials?.access_token;
  if (!accessToken) throw new Error("No access_token");

  const oauth2Client = new google.auth.OAuth2();
  oauth2Client.setCredentials({ access_token: accessToken });
  const gmail = google.gmail({ version: "v1", auth: oauth2Client });

  const boundary = "boundary_sunglim";
  const parts = [
    `To: ${to}`,
    `Subject: =?UTF-8?B?${Buffer.from(subject).toString("base64")}?=`,
    "MIME-Version: 1.0",
    `Content-Type: multipart/alternative; boundary="${boundary}"`,
    "",
    `--${boundary}`,
    "Content-Type: text/html; charset=UTF-8",
    "Content-Transfer-Encoding: base64",
    "",
    Buffer.from(html).toString("base64"),
    `--${boundary}--`,
  ];

  const raw = Buffer.from(parts.join("\r\n"))
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");

  await gmail.users.messages.send({ userId: "me", requestBody: { raw } });
}

async function sendViaGmailSMTP({ to, subject, html }) {
  if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASS) {
    throw new Error("GMAIL_USER / GMAIL_APP_PASS not set");
  }
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASS,
    },
  });
  await transporter.sendMail({
    from: process.env.GMAIL_USER,
    to,
    subject,
    html,
  });
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { name, company, phone, email, subject, message } = req.body || {};
  if (!name || !phone || !subject || !message) {
    return res.status(400).json({ error: "필수 항목을 입력해주세요." });
  }

  const receivedAt = new Date().toLocaleString("ko-KR", { timeZone: "Asia/Seoul" });

  const htmlBody = `
<table style="width:100%;max-width:600px;border-collapse:collapse;font-family:sans-serif;font-size:15px;">
  <tr><td colspan="2" style="background:#1a3a6b;color:#fff;padding:16px 20px;font-size:18px;font-weight:bold;">
    성림교구 홈페이지 문의 접수
  </td></tr>
  <tr><td style="padding:10px 20px;background:#f5f5f5;width:120px;font-weight:bold;">이름</td><td style="padding:10px 20px;">${name}</td></tr>
  <tr><td style="padding:10px 20px;background:#f5f5f5;font-weight:bold;">회사/학교</td><td style="padding:10px 20px;">${company || "-"}</td></tr>
  <tr><td style="padding:10px 20px;background:#f5f5f5;font-weight:bold;">연락처</td><td style="padding:10px 20px;">${phone}</td></tr>
  <tr><td style="padding:10px 20px;background:#f5f5f5;font-weight:bold;">이메일</td><td style="padding:10px 20px;">${email || "-"}</td></tr>
  <tr><td style="padding:10px 20px;background:#f5f5f5;font-weight:bold;">문의유형</td><td style="padding:10px 20px;">${subject}</td></tr>
  <tr><td style="padding:10px 20px;background:#f5f5f5;font-weight:bold;">내용</td><td style="padding:10px 20px;white-space:pre-wrap;">${message}</td></tr>
  <tr><td style="padding:10px 20px;background:#f5f5f5;font-weight:bold;">접수일시</td><td style="padding:10px 20px;">${receivedAt}</td></tr>
</table>
`;

  const mailOpts = {
    to: "7661496@naver.com",
    subject: `[성림교구 문의] ${subject} - ${name}`,
    html: htmlBody,
  };

  try {
    try {
      await sendViaGmailConnector(mailOpts);
      console.log("[문의접수 - 커넥터]", { name, phone, subject });
    } catch (connErr) {
      console.log("[커넥터 불가, SMTP 시도]", connErr.message);
      await sendViaGmailSMTP(mailOpts);
      console.log("[문의접수 - SMTP]", { name, phone, subject });
    }
    return res.status(201).json({ message: "문의가 성공적으로 접수되었습니다." });
  } catch (err) {
    console.error("[메일 발송 실패]", err.message);
    return res.status(500).json({ error: "메일 발송 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요." });
  }
}
