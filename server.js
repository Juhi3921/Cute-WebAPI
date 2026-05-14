import express from "express";
import dotenv from "dotenv";
import fetch from "node-fetch";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const app = express();


// -------------------------
// PATH CONFIG
// -------------------------

const __filename =
  fileURLToPath(import.meta.url);

const __dirname =
  path.dirname(__filename);


// -------------------------
// MIDDLEWARE
// -------------------------

app.use(cors());

app.use(
  express.static(
    path.join(
      __dirname,
      "public"
    )
  )
);

app.use(express.json());


// -------------------------
// HOME ROUTE
// -------------------------

app.get("/", (req, res) => {

  res.sendFile(
    path.join(
      __dirname,
      "public",
      "index.html"
    )
  );
});

const PORT =
  process.env.PORT || 3000;


// -------------------------
// QUOTE API
// -------------------------

app.get("/api/quote", async (req, res) => {

  try {

    const response = await fetch(
      "https://api.quotable.io/random"
    );

    if (!response.ok) {

      throw new Error(
        "Unable to fetch quote"
      );
    }

    const quoteData =
      await response.json();

    res.json({
      content: quoteData.content,
      author: quoteData.author
    });

  } catch (error) {

    // fallback quotes
    const quotes = [

      {
        content:
          "Believe in yourself",

        author:
          "Unknown"
      },

      {
        content:
          "Small steps every day",

        author:
          "Anonymous"
      },

      {
        content:
          "You are doing better than you think",

        author:
          "Friendly Cat"
      },

      {
        content:
          "Consistency beats motivation",

        author:
          "Mood Cat"
      },

      {
        content:
          "Rest is productive too",

        author:
          "LoFi Kitty"
      }

    ];

    const randomIndex =
      Math.floor(
        Math.random() *
        quotes.length
      );

    res.json(
      quotes[randomIndex]
    );
  }
});


// -------------------------
// CAT IMAGE API
// -------------------------

app.get("/api/cat", async (req, res) => {

  try {

    const response = await fetch(
      "https://api.thecatapi.com/v1/images/search",
      {
        headers: {
          "x-api-key":
            process.env.CAT_API_KEY
        }
      }
    );

    if (!response.ok) {

      throw new Error(
        "Unable to fetch cat image"
      );
    }

    const catData =
      await response.json();

    res.json(catData[0]);

  } catch (error) {

    res.status(500).json({

      error:
        "Cat image unavailable"
    });
  }
});


// -------------------------
// WEATHER API
// -------------------------

app.get("/api/weather", async (req, res) => {

  try {

    const latitude =
      req.query.lat;

    const longitude =
      req.query.lon;

    if (!latitude || !longitude) {

      return res.status(400).json({

        error:
          "Location is required"
      });
    }

    const weatherUrl =
      `https://api.weatherapi.com/v1/current.json?key=${process.env.WEATHER_API_KEY}&q=${latitude},${longitude}`;

    const response =
      await fetch(weatherUrl);

    if (!response.ok) {

      throw new Error(
        "Unable to fetch weather"
      );
    }

    const weatherData =
      await response.json();

    res.json(weatherData);

  } catch (error) {

    res.status(500).json({

      error:
        "Weather unavailable"
    });
  }
});


// -------------------------
// MOOD API
// -------------------------

app.get("/api/mood", (req, res) => {

  const moods = [

    {
      mood: "Happy",
      message:
        "Keep smiling today"
    },

    {
      mood: "Sleepy",
      message:
        "Take some rest when needed"
    },

    {
      mood: "Focused",
      message:
        "Stay consistent with your work"
    },

    {
      mood: "Relaxed",
      message:
        "Slow moments are important too"
    }

  ];

  const randomMood =
    moods[
      Math.floor(
        Math.random() *
        moods.length
      )
    ];

  res.json(randomMood);
});


// -------------------------
// CAT FACT API
// -------------------------

app.get("/api/catfact", (req, res) => {

  const facts = [

    "Cats sleep for most of the day",

    "Cats can jump several times their height",

    "Cats use whiskers to sense space",

    "Cats communicate through body language",

    "Cats enjoy routine and quiet places"
  ];

  const randomFact =
    facts[
      Math.floor(
        Math.random() *
        facts.length
      )
    ];

  res.json({
    fact: randomFact
  });
});


// -------------------------
// SERVER START
// -------------------------

app.listen(PORT, () => {

  console.log(`
--------------------------------
Cute Dashboard Running
http://localhost:${PORT}
--------------------------------
  `);
});