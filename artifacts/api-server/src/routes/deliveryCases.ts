import { Router, type IRouter } from "express";
import { db, deliveryCasesTable } from "@workspace/db";
import { desc, eq } from "drizzle-orm";
import multer from "multer";
import path from "path";
import fs from "fs";

const router: IRouter = Router();

const uploadDir = path.resolve(process.cwd(), "../sunglim/public/images/delivery");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename: (_req, file, cb) => {
    const unique = Date.now() + "-" + Math.round(Math.random() * 1e6);
    cb(null, unique + path.extname(file.originalname));
  },
});
const upload = multer({ storage, limits: { fileSize: 10 * 1024 * 1024 } });

router.get("/delivery-cases", async (_req, res) => {
  try {
    const cases = await db.select().from(deliveryCasesTable).orderBy(desc(deliveryCasesTable.deliveryDate));
    res.json(cases);
  } catch (error) {
    console.error("List delivery cases error:", error);
    res.status(500).json({ error: "서버 오류가 발생했습니다." });
  }
});

router.post("/delivery-cases", upload.single("image"), async (req, res) => {
  try {
    const { schoolName, deliveryDate, modelNames, note } = req.body;
    if (!schoolName || !deliveryDate || !modelNames) {
      return res.status(400).json({ error: "학교명, 납품일자, 모델명은 필수입니다." });
    }
    let imageUrl: string | null = null;
    if (req.file) {
      imageUrl = `/images/delivery/${req.file.filename}`;
    }
    const [inserted] = await db.insert(deliveryCasesTable).values({
      schoolName,
      deliveryDate,
      modelNames,
      imageUrl,
      note: note ?? null,
    }).returning();
    res.status(201).json(inserted);
  } catch (error) {
    console.error("Create delivery case error:", error);
    res.status(400).json({ error: "입력 내용을 확인해주세요." });
  }
});

router.delete("/delivery-cases/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const [deleted] = await db.delete(deliveryCasesTable).where(eq(deliveryCasesTable.id, id)).returning();
    if (!deleted) return res.status(404).json({ error: "찾을 수 없습니다." });
    if (deleted.imageUrl) {
      const filePath = path.resolve(process.cwd(), "../sunglim/public" + deleted.imageUrl);
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    }
    res.json({ ok: true });
  } catch (error) {
    console.error("Delete delivery case error:", error);
    res.status(500).json({ error: "서버 오류가 발생했습니다." });
  }
});

export default router;
