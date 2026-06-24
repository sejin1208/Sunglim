import { Router, type IRouter } from "express";
import { db, contactsTable } from "@workspace/db";
import { SubmitContactBody, ListContactsResponseItem } from "@workspace/api-zod";
import { desc } from "drizzle-orm";

const router: IRouter = Router();

async function sendViaWeb3Forms(opts: {
  name: string; company: string; phone: string; email: string;
  subject: string; message: string; receivedAt: string;
}) {
  const apiKey = process.env.WEB3FORMS_KEY;
  if (!apiKey) throw new Error("WEB3FORMS_KEY 미설정");

  const response = await fetch("https://api.web3forms.com/submit", {
    method: "POST",
    headers: { "Content-Type": "application/json", "Accept": "application/json" },
    body: JSON.stringify({
      access_key: apiKey,
      subject: `[성림교구 문의] ${opts.subject} - ${opts.name}`,
      from_name: "성림교구 홈페이지",
      이름: opts.name,
      "회사/학교": opts.company,
      연락처: opts.phone,
      이메일: opts.email,
      문의유형: opts.subject,
      내용: opts.message,
      접수일시: opts.receivedAt,
    }),
  });

  const result = await response.json();
  if (!result.success) throw new Error(JSON.stringify(result));
  return result;
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

    sendViaWeb3Forms({
      name: body.name,
      company: body.company ?? "-",
      phone: body.phone,
      email: body.email ?? "-",
      subject: body.subject,
      message: body.message,
      receivedAt,
    })
      .then(() => console.log("[문의접수 완료]", { name: body.name, id: inserted.id }))
      .catch((err) => console.error("[Web3Forms 오류]", err.message));

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
