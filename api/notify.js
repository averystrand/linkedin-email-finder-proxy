export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "https://averystrand.github.io");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();

  try {
    let body = typeof req.body === "string" ? JSON.parse(req.body) : req.body;

    // normalize keys → underscores
    const normalized = {
      Linkedin_URL: body["Linkedin URL"] || body.Linkedin_URL || null,
      Email: body["Email"] || null
    };

    console.log("Normalized payload (notify):", normalized);

    globalThis.latestEmail = normalized;

    res.status(200).json({ ok: true, normalized });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
