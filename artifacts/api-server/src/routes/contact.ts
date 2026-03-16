import { Router, type IRouter } from "express";
import { db, contactsTable } from "@workspace/db";
import { SubmitContactBody, ListContactsResponseItem } from "@workspace/api-zod";
import { desc } from "drizzle-orm";

const router: IRouter = Router();

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
