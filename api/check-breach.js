// /api/check-breach.js

import express from "express";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Enable CORS for all routes
app.use(cors());

// For JSON body parsing (if needed)
app.use(express.json());

// Example route
app.get("/", (req, res) => {
  res.send("Server is running. Use /scan?email=example@example.com");
});

// Actual breach scanning route
app.get("/scan", async (req, res) => {
  const email = req.query.email;
  const apiKey = process.env.API_KEY;

  if (!email) return res.status(400).json({ error: "Missing email parameter" });

  try {
    const response = await fetch(
      `https://haveibeenpwned.com/api/v3/breachedaccount/${encodeURIComponent(
        email
      )}?truncateResponse=false`,
      {
        headers: {
          "hibp-api-key": process.env.API_KEY,
          "user-agent": "ZeroPrivacyApp (sponsor@whynotprivacy.com)",
        },
      }
    );

    if (response.status === 404) {
      // No breaches found
      return res.json({ email, data: [] });
    }

    if (!response.ok) {
      // Some other error from HIBP
      return res
        .status(response.status)
        .json({ error: "Failed to fetch data" });
    }

    const data = await response.json();
    res.json({ email, data });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch data" });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
