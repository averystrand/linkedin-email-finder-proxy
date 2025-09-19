export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "https://averystrand.github.io");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();

  try {
    let body = typeof req.body === "string" ? JSON.parse(req.body) : req.body;

    const normalized = {
      Domain: body["Domain"] || null,
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
    res.status(500).json({ error: err.message });
  }
}
