// api/notify.js
let results = {}; // simple in-memory store

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "https://averystrand.github.io");
  res.setHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();

  if (req.method === "POST") {
    const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
    const { ["Linkedin URL"]: linkedinUrl, Email } = body;

    if (linkedinUrl && Email) {
      results[linkedinUrl] = Email;
    }

    return res.status(200).json({ ok: true });
  }

  if (req.method === "GET") {
    const url = req.query.url;
    const email = results[url] || null;
    return res.status(200).json({ email });
  }

  res.status(405).json({ error: "Method not allowed" });
}
