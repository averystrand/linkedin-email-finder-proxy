let results = {}; // in-memory store

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "https://averystrand.github.io");
  res.setHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();

  try {
    if (req.method === "POST") {
      // Safely parse body
      let body = {};
      try {
        body = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
      } catch (e) {
        console.error("Parse error:", e, "Raw body:", req.body);
        return res.status(400).json({ error: "Invalid JSON", raw: req.body });
      }

      console.log("Clay sent:", body);

      const linkedinUrl = body["Linkedin URL"];
      const email = body["Email"];

      if (!linkedinUrl) {
        return res.status(400).json({ error: "Missing Linkedin URL", body });
      }

      results[linkedinUrl] = email || null;
      console.log("Stored:", linkedinUrl, "=>", email);

      return res.status(200).json({ ok: true });
    }

    if (req.method === "GET") {
      const url = req.query.url;
      const email = results[url] || null;
      return res.status(200).json({ email });
    }

    res.status(405).json({ error: "Method not allowed" });
  } catch (err) {
    console.error("Server error:", err);
    res.status(500).json({ error: "Server error", details: err.message });
  }
}
