import express from "express";

const app = express();
const PORT = process.env.PORT || 3000;

app.get("/api/check-breach", async (req, res) => {
  const email = req.query.email;
  if (!email) return res.status(400).json({ error: "Email is required" });

  try {
    const response = await fetch(
      `https://haveibeenpwned.com/api/v3/breachedaccount/${encodeURIComponent(
        email
      )}?truncateResponse=false`,
      {
        headers: {
          "hibp-api-key": process.env.HIBP_API_KEY,
          "user-agent": "ZeroPrivacyApp (sponsor@whynotprivacy.com)",
        },
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      return res.status(response.status).json({ error: errorText });
    }

    const data = await response.json();
    res.json(data);
  } catch (err) {
    res
      .status(500)
      .json({ error: "Internal Server Error", details: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
