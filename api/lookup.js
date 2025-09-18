export default async function handler(req, res) {
  // CORS headers
  res.setHeader("Access-Control-Allow-Origin", "https://averystrand.github.io");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  try {
    // Parse body
    let body = {};
    body = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
    const linkedinUrl = body.linkedinUrl;

    if (!linkedinUrl) {
      return res.status(400).json({ error: "Missing linkedinUrl" });
    }

    // Step 1. Create a new row in Clay
    const createRowResp = await fetch(`https://api.clay.run/v1/tables/${process.env.CLAY_TABLE_ID}/rows`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.CLAY_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        fields: {
          "Linkedin URL": linkedinUrl   // 👈 this must match your Clay column name exactly
        }
      })
    });

    const newRow = await createRowResp.json();
    if (!createRowResp.ok) {
      return res.status(createRowResp.status).json({ error: "Failed to create row", debug: newRow });
    }

    const rowId = newRow?.id;

    // Step 2. Poll for enrichment (Email field)
    let email = null;
    let attempts = 0;

    while (!email && attempts < 10) {
      attempts++;
      await new Promise(r => setTimeout(r, 3000));

      const rowResp = await fetch(`https://api.clay.run/v1/tables/${process.env.CLAY_TABLE_ID}/rows/${rowId}`, {
        headers: {
          "Authorization": `Bearer ${process.env.CLAY_API_KEY}`
        }
      });

      const rowData = await rowResp.json();
      email = rowData?.fields?.["Email"] || null;
    }

    res.status(200).json({ email, rowId });
  } catch (err) {
    console.error("Server error:", err);
    res.status(500).json({ error: "Server error" });
  }
}
