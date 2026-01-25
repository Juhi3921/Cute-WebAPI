import express from "express";
import dotenv from "dotenv";
import fetch from "node-fetch";

/* 🔐 Load env variables FIRST */
dotenv.config({ quiet: true });

const app = express();

/* 🌍 Use PORT from env (Render needs this) */
const PORT = process.env.PORT || 3000;

/* 📁 Serve frontend */
app.use(express.static("public"));

/* 💬 QUOTE API */
app.get("/api/quote", async (req, res) => {
  try {
    const r = await fetch("https://api.quotable.io/random", { timeout: 5000 });
    const data = await r.json();
    res.json({ content: data.content, author: data.author });
  } catch {
    const fallbackQuotes = [
      { content: "Believe in yourself 💖", author: "Unknown" },
      { content: "Small steps every day 🌱", author: "Anonymous" },
      { content: "You are doing better than you think ✨", author: "Friendly Cat" },
      { content: "Consistency beats motivation 🐾", author: "Mood Cat" }
    ];
    const q = fallbackQuotes[Math.floor(Math.random() * fallbackQuotes.length)];
    res.json(q);
  }
});

/* 🐱 CAT API */
app.get("/api/cat", async (req, res) => {
  try {
    const r = await fetch(
      "https://api.thecatapi.com/v1/images/search",
      {
        headers: {
          "x-api-key": process.env.CAT_API_KEY
        }
      }
    );
    const data = await r.json();
    res.json(data[0]);
  } catch (err) {
    res.status(500).json({ error: "Cat unavailable 😿" });
  }
});

/* 🌤️ WEATHER API */
app.get("/api/weather", async (req, res) => {
  try {
    const { lat, lon } = req.query;
    const r = await fetch(
      `https://api.weatherapi.com/v1/current.json?key=${process.env.WEATHER_API_KEY}&q=${lat},${lon}`
    );
    const data = await r.json();
    res.json(data);
  } catch {
    res.status(500).json({ error: "Weather unavailable 🌧️" });
  }
});

/* 🚀 START SERVER (LAST LINE ALWAYS) */
app.listen(PORT, () => {
  console.log(`✅ Server running → http://localhost:${PORT}`);
});
