export default async function handler(req, res) {
  // CORS headers
  res.setHeader("Access-Control-Allow-Origin", "https://averystrand.github.io");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  try {
    // Parse body safely
    let body = {};
    try {
      body = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
    } catch (e) {
      console.error("Body parse error:", e);
    }

    const linkedinUrl = body.linkedinUrl;
    console.log("Looking up:", linkedinUrl);

    const response = await fetch(`https://api.clay.run/v1/tables/${process.env.CLAY_TABLE_ID}/query`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.CLAY_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        filters: {
          "Linkedin URL": linkedinUrl   // 👈 EXACT match for your column name
        }
      })
    });

    const data = await response.json();
    console.log("Clay response:", data);

    const email = data?.rows?.[0]?.["Email"];
    res.status(200).json({ email, raw: data });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
}
