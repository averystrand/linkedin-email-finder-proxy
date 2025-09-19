// Simple in-memory store of results
let results = {};

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "https://averystrand.github.io");
  res.setHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method === "POST") {
    // Clay HTTP API Action will hit this when enrichment is done
    const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
    const linkedinUrl = body["Linkedin URL"];
    const email = body["Email"];

    if (linkedinUrl) {
      results[linkedinUrl] = email || null;
      console.log("Stored result:", linkedinUrl, "=>", email);
    }

    return res.status(200).json({ ok: true });
  }

  if (req.method === "GET") {
    // Frontend polls this to get the email
    const url = req.query.url;
    const email = results[url] || null;
    return res.status(200).json({ email });
  }

  res.status(405).json({ error: "Method not allowed" });
}
