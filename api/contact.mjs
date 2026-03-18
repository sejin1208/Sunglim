import nodemailer from "nodemailer";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { name, company, phone, email, subject, message } = req.body || {};
  if (!name || !phone || !subject || !message) {
    return res.status(400).json({ error: "필수 항목을 입력해주세요." });
  }

  const user = process.env.NAVER_EMAIL_USER;
  const pass = process.env.NAVER_EMAIL_PASS;

  if (user && pass) {
    try {
      // 네이버 SMTP는 아이디만 사용 (7661496@naver.com → 7661496)
      const smtpUser = user.replace(/@naver\.com$/i, "");
      const transporter = nodemailer.createTransport({
        host: "smtp.naver.com",
        port: 587,
        secure: false,
        auth: { user: smtpUser, pass },
      });

      const emailText = [
        "[온라인 문의 접수]",
        "",
        `이름/담당자: ${name}`,
        `기관/회사명: ${company ?? "-"}`,
        `연락처: ${phone}`,
        `이메일: ${email ?? "-"}`,
        `제목: ${subject}`,
        "",
        "문의 내용:",
        message,
        "",
        `접수 일시: ${new Date().toLocaleString("ko-KR", { timeZone: "Asia/Seoul" })}`,
      ].join("\n");

      await transporter.sendMail({
        from: `"성림교구 홈페이지" <${user}>`,
        to: "7661496@naver.com",
        subject: `[문의접수] ${subject} - ${name}`,
        text: emailText,
      });
    } catch (err) {
      console.error("Email error:", err);
    }
  }

  return res.status(201).json({ message: "문의가 성공적으로 접수되었습니다." });
}
