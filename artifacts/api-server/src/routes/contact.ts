import { Router, type IRouter } from "express";
import { db, contactsTable } from "@workspace/db";
import { SubmitContactBody, ListContactsResponseItem } from "@workspace/api-zod";
import { desc } from "drizzle-orm";
import nodemailer from "nodemailer";

const router: IRouter = Router();

function createTransporter() {
  return nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASS,
    },
  });
}

async function sendMail(opts: {
  name: string; company: string; phone: string; email: string;
  subject: string; message: string; receivedAt: string;
}) {
  const transporter = createTransporter();
  await transporter.sendMail({
    from: `성림교구 홈페이지 <${process.env.GMAIL_USER}>`,
    to: "7661496@naver.com",
    subject: `[성림교구 문의] ${opts.subject} - ${opts.name}`,
    html: `
      <table style="border-collapse:collapse;width:100%;max-width:600px;font-family:sans-serif;font-size:14px;">
        <tr><td colspan="2" style="background:#1a3a6b;color:#fff;padding:16px 20px;font-size:16px;font-weight:bold;">성림교구 홈페이지 문의 접수</td></tr>
        <tr><td style="padding:10px 20px;background:#f5f5f5;width:100px;font-weight:bold;">이름</td><td style="padding:10px 20px;">${opts.name}</td></tr>
        <tr><td style="padding:10px 20px;background:#f5f5f5;font-weight:bold;">회사/학교</td><td style="padding:10px 20px;">${opts.company}</td></tr>
        <tr><td style="padding:10px 20px;background:#f5f5f5;font-weight:bold;">연락처</td><td style="padding:10px 20px;">${opts.phone}</td></tr>
        <tr><td style="padding:10px 20px;background:#f5f5f5;font-weight:bold;">이메일</td><td style="padding:10px 20px;">${opts.email}</td></tr>
        <tr><td style="padding:10px 20px;background:#f5f5f5;font-weight:bold;">문의유형</td><td style="padding:10px 20px;">${opts.subject}</td></tr>
        <tr><td style="padding:10px 20px;background:#f5f5f5;font-weight:bold;">내용</td><td style="padding:10px 20px;white-space:pre-wrap;">${opts.message}</td></tr>
        <tr><td style="padding:10px 20px;background:#f5f5f5;font-weight:bold;">접수일시</td><td style="padding:10px 20px;">${opts.receivedAt}</td></tr>
      </table>
    `,
  });
}

router.post("/contact", async (req, res) => {
  try {
    const body = SubmitContactBody.parse(req.body);
    const [inserted] = await db.insert(contactsTable).values({
      name: body.name,
      company: body.company ?? null,
      phone: body.phone,
      email: body.email ?? null,
      subject: body.subject,
      message: body.message,
    }).returning();

    const receivedAt = new Date().toLocaleString("ko-KR", { timeZone: "Asia/Seoul" });

    sendMail({
      name: body.name,
      company: body.company ?? "-",
      phone: body.phone,
      email: body.email ?? "-",
      subject: body.subject,
      message: body.message,
      receivedAt,
    })
      .then(() => console.log("[문의접수 완료]", { name: body.name, id: inserted.id }))
      .catch((err) => console.error("[메일발송 오류]", err.message));

    res.status(201).json({ id: inserted.id, message: "문의가 성공적으로 접수되었습니다." });
  } catch (error) {
    console.error("Contact form error:", error);
    res.status(400).json({ error: "입력 내용을 확인해주세요." });
  }
});

router.get("/contact/list", async (_req, res) => {
  try {
    const contacts = await db.select().from(contactsTable).orderBy(desc(contactsTable.createdAt));
    const parsed = contacts.map((c) =>
      ListContactsResponseItem.parse({
        id: c.id,
        name: c.name,
        company: c.company ?? undefined,
        phone: c.phone,
        email: c.email ?? undefined,
        subject: c.subject,
        message: c.message,
        createdAt: c.createdAt,
      })
    );
    res.json(parsed);
  } catch (error) {
    console.error("List contacts error:", error);
    res.status(500).json({ error: "서버 오류가 발생했습니다." });
  }
});

export default router;
