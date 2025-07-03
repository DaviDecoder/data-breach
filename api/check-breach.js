// api/check-breach.js
export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Only POST allowed" });
  }

  const { email } = req.body;
  const API_KEY = process.env.HIBP_API_KEY;

  try {
    const hibpRes = await fetch(
      `https://haveibeenpwned.com/api/v3/breachedaccount/${encodeURIComponent(
        email
      )}?truncateResponse=false`,
      {
        headers: {
          "hibp-api-key": API_KEY,
          "user-agent": "ZeroPrivacyApp (support@whynotprivacy.com)",
        },
      }
    );

    if (hibpRes.status === 404) {
      return res.json({ breached: false, breaches: [] });
    }

    const data = await hibpRes.json();
    return res.json({ breached: true, breaches: data });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
