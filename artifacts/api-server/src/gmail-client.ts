import { google } from "googleapis";

let cachedToken: { token: string; expiresAt: number } | null = null;

async function getAccessToken(): Promise<string> {
  if (cachedToken && cachedToken.expiresAt > Date.now() + 60_000) {
    return cachedToken.token;
  }

  const hostname = process.env.REPLIT_CONNECTORS_HOSTNAME;
  const xReplitToken = process.env.REPL_IDENTITY
    ? "repl " + process.env.REPL_IDENTITY
    : process.env.WEB_REPL_RENEWAL
    ? "depl " + process.env.WEB_REPL_RENEWAL
    : null;

  if (!hostname || !xReplitToken) {
    throw new Error("Gmail connector env vars not available");
  }

  const data = await fetch(
    "https://" + hostname + "/api/v2/connection?include_secrets=true&connector_names=google-mail",
    { headers: { Accept: "application/json", "X-Replit-Token": xReplitToken } }
  ).then((r) => r.json());

  const settings = data.items?.[0]?.settings;
  const accessToken =
    settings?.access_token ||
    settings?.oauth?.credentials?.access_token;

  if (!accessToken) throw new Error("Gmail connector: no access_token");

  cachedToken = { token: accessToken, expiresAt: Date.now() + 3_500_000 };
  return accessToken;
}

export async function sendEmail(opts: {
  to: string;
  subject: string;
  text: string;
  html?: string;
}) {
  const accessToken = await getAccessToken();
  const oauth2Client = new google.auth.OAuth2();
  oauth2Client.setCredentials({ access_token: accessToken });
  const gmail = google.gmail({ version: "v1", auth: oauth2Client });

  const body = opts.html ?? opts.text;
  const isHtml = !!opts.html;
  const contentType = isHtml ? "text/html" : "text/plain";

  const messageParts = [
    `To: ${opts.to}`,
    `Subject: =?UTF-8?B?${Buffer.from(opts.subject).toString("base64")}?=`,
    "MIME-Version: 1.0",
    `Content-Type: ${contentType}; charset=UTF-8`,
    "Content-Transfer-Encoding: base64",
    "",
    Buffer.from(body).toString("base64"),
  ];

  const raw = Buffer.from(messageParts.join("\r\n"))
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");

  await gmail.users.messages.send({ userId: "me", requestBody: { raw } });
}
