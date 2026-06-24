export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { name, company, phone, email, subject, message } = req.body || {};
  if (!name || !phone || !subject || !message) {
    return res.status(400).json({ error: "필수 항목을 입력해주세요." });
  }

  const apiKey = process.env.WEB3FORMS_KEY;
  if (!apiKey) {
    console.error("WEB3FORMS_KEY 환경변수가 설정되지 않았습니다.");
    return res.status(500).json({ error: "서버 설정 오류입니다." });
  }

  const receivedAt = new Date().toLocaleString("ko-KR", { timeZone: "Asia/Seoul" });

  try {
    const response = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json", "Accept": "application/json" },
      body: JSON.stringify({
        access_key: apiKey,
        subject: `[성림교구 문의] ${subject} - ${name}`,
        from_name: "성림교구 홈페이지",
        이름: name,
        "회사/학교": company || "-",
        연락처: phone,
        이메일: email || "-",
        문의유형: subject,
        내용: message,
        접수일시: receivedAt,
      }),
    });

    const result = await response.json();
    if (!result.success) {
      console.error("[Web3Forms 오류]", result);
      return res.status(500).json({ error: "메일 발송 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요." });
    }

    console.log("[문의접수 완료]", { name, phone, subject });
    return res.status(201).json({ message: "문의가 성공적으로 접수되었습니다." });
  } catch (err) {
    console.error("[네트워크 오류]", err.message);
    return res.status(500).json({ error: "메일 발송 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요." });
  }
}
