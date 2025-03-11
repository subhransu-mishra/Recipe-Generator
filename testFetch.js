const fetch = require("node-fetch");
require("dotenv").config();
const GEMINI_API_KEY = process.env.API_KEY;
console.log("GEMINI_API_KEY:", GEMINI_API_KEY);
const url = 
  "https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=" + GEMINI_API_KEY;

fetch(url, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    contents: [
      {
        parts: [
          { text: "Test prompt" }
        ]
      }
    ]
  }),
})
  .then((res) => res.json())
  .then((data) => console.log("Response Data:", data))
  .catch((error) => console.error("Fetch error:", error));