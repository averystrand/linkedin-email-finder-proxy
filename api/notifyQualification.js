let qualificationResults = {};

function normalizeDomain(domain) {
  return domain ? domain.trim().toLowerCase().replace(/\/$/, "") : null;
}

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "https://averystrand.github.io");
  res.setHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();

  try {
    if (req.method === "POST") {
      let body = typeof req.body === "string" ? JSON.parse(req.body) : req.body;

      const domain = normalizeDomain(body["Domain"]);
      if (!domain) {
        return res.status(400).json({ error: "Missing Domain", body });
      }

      qualificationResults[domain] = {
        Industry: body["Industry"] || null,
        EmployeeCount: body["Employee Count"] || null,
        SwaggerSoapPostmanOpenAPI: body["Swagger_Soap_Postman_OpenAPI"] || null,
        Gateways: body["Gateways"] || null,
        API_URL: body["API_URL"] || null,
        API_SDK_Presence: body["API_SDK_Presence"] || null
      };

      console.log("Stored qualification result:", domain, qualificationResults[domain]);
      return res.status(200).json({ ok: true });
    }

    if (req.method === "GET") {
      const domain = normalizeDomain(req.query.domain);
      const results = qualificationResults[domain] || null;
      return res.status(200).json({ results });
    }

    res.status(405).json({ error: "Method not allowed" });
  } catch (err) {
    console.error("Server error:", err);
    res.status(500).json({ error: "Server error", details: err.message });
  }
}
