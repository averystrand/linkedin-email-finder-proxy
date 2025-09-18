export default async function handler(req, res) {
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
