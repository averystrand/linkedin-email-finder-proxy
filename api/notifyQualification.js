export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "https://averystrand.github.io");
  res.setHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();

  try {
    // Handle GET (polling from the webpage)
    if (req.method === "GET") {
      const domain = req.query.domain;
      if (!domain) {
        return res.status(400).json({ error: "Missing domain parameter" });
      }
      return res.status(200).json(globalThis.latestQualification || {});
    }

    // Handle POST (Clay posting data back)
    let body = req.body;
    if (typeof body === "string") {
      try {
        body = JSON.parse(body);
      } catch {
        body = {};
      }
    }

    const normalized = {
      Domain: body["Domain"] || body.Domain || null,
      Industry: body["Industry"] || null,
      Employee_Count: body["Employee Count"] || body.Employee_Count || null,
      Swagger_Soap_Postman_OpenAPI: body["Swagger, Soap, Postman, OpenAPI"] || body.Swagger_Soap_Postman_OpenAPI || null,
      Gateways: body["Gateways"] || null,
      API_URL: body["API URL"] || body.API_URL || null,
      API_SDK_Presence: body["API/SDK Presence"] || body.API_SDK_Presence || null
    };

    console.log("Normalized payload (notifyQualification):", normalized);

    globalThis.latestQualification = normalized;

    res.status(200).json({ ok: true, normalized });
  } catch (err) {
    console.error("notifyQualification error:", err);
    res.status(500).json({ error: err.message });
  }
}
