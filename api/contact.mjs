import nodemailer from "nodemailer";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { name, company, phone, email, subject, message } = req.body || {};
  if (!name || !phone || !subject || !message) {
    return res.status(400).json({ error: "필수 항목을 입력해주세요." });
  }

  const gmailUser = process.env.GMAIL_USER;
  const gmailPass = process.env.GMAIL_APP_PASS;
  if (!gmailUser || !gmailPass) {
    console.error("GMAIL_USER 또는 GMAIL_APP_PASS 환경변수가 설정되지 않았습니다.");
    return res.status(500).json({ error: "서버 설정 오류입니다." });
  }

  const receivedAt = new Date().toLocaleString("ko-KR", { timeZone: "Asia/Seoul" });

  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: { user: gmailUser, pass: gmailPass },
  });

  try {
    await transporter.sendMail({
      from: `성림교구 홈페이지 <${gmailUser}>`,
      to: "7661496@naver.com",
      subject: `[성림교구 문의] ${subject} - ${name}`,
      html: `
        <table style="border-collapse:collapse;width:100%;max-width:600px;font-family:sans-serif;font-size:14px;">
          <tr><td colspan="2" style="background:#1a3a6b;color:#fff;padding:16px 20px;font-size:16px;font-weight:bold;">성림교구 홈페이지 문의 접수</td></tr>
          <tr><td style="padding:10px 20px;background:#f5f5f5;width:100px;font-weight:bold;">이름</td><td style="padding:10px 20px;">${name}</td></tr>
          <tr><td style="padding:10px 20px;background:#f5f5f5;font-weight:bold;">회사/학교</td><td style="padding:10px 20px;">${company || "-"}</td></tr>
          <tr><td style="padding:10px 20px;background:#f5f5f5;font-weight:bold;">연락처</td><td style="padding:10px 20px;">${phone}</td></tr>
          <tr><td style="padding:10px 20px;background:#f5f5f5;font-weight:bold;">이메일</td><td style="padding:10px 20px;">${email || "-"}</td></tr>
          <tr><td style="padding:10px 20px;background:#f5f5f5;font-weight:bold;">문의유형</td><td style="padding:10px 20px;">${subject}</td></tr>
          <tr><td style="padding:10px 20px;background:#f5f5f5;font-weight:bold;">내용</td><td style="padding:10px 20px;white-space:pre-wrap;">${message}</td></tr>
          <tr><td style="padding:10px 20px;background:#f5f5f5;font-weight:bold;">접수일시</td><td style="padding:10px 20px;">${receivedAt}</td></tr>
        </table>
      `,
    });

    console.log("[문의접수 완료]", { name, phone, subject });
    return res.status(201).json({ message: "문의가 성공적으로 접수되었습니다." });
  } catch (err) {
    console.error("[메일발송 오류]", err.message);
    return res.status(500).json({ error: "메일 발송 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요." });
  }
}
