// /api/check-breach.js

import express from "express";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

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
      `https://thirdparty.com/api/search?email=${email}`,
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
        },
      }
    );

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
