export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { name, company, phone, email, subject, message } = req.body || {};
  if (!name || !phone || !subject || !message) {
    return res.status(400).json({ error: "필수 항목을 입력해주세요." });
  }

  console.log("[문의접수]", {
    name,
    company: company ?? "-",
    phone,
    email: email ?? "-",
    subject,
    message,
    receivedAt: new Date().toLocaleString("ko-KR", { timeZone: "Asia/Seoul" }),
  });

  return res.status(201).json({ message: "문의가 성공적으로 접수되었습니다." });
}
