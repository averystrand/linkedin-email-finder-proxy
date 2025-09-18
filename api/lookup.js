export default async function handler(req, res) {
  // Allow GitHub Pages frontend
  res.setHeader("Access-Control-Allow-Origin", "https://averystrand.github.io");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // Handle preflight (OPTIONS request)
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  try {
    const { linkedinUrl } = req.body;

    const response = await fetch(`https://api.clay.run/v1/tables/${process.env.CLAY_TABLE_ID}/query`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.CLAY_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        filters: { "Linkedin URL": linkedinUrl }
      })
    });

    const data = await response.json();
    const email = data?.rows?.[0]?.["Email"];

    res.status(200).json({ email });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
}
