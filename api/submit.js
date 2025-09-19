export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "https://averystrand.github.io");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();

  try {
    let body = typeof req.body === "string" ? JSON.parse(req.body) : req.body;

    const webhookUrl = process.env.CLAY_WEBHOOK_URL; // store Clay webhook URL in Vercel env

    const forward = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });

    const result = await forward.text(); // Clay returns no JSON, just text
    res.status(200).json({ ok: true, result });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
