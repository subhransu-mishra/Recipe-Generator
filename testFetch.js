const fetch = require("node-fetch"); // Or use the undici fetch

const GEMINI_API_KEY = "AIzaSyAIE0ZafJbG2dYvYdYgwcWVPH55taI3WfU";
const url =
  "https://generativeai.googleapis.com/v1/models/gemini-pro:generateContent"; // Adjust if needed

fetch(url, {
  method: "POST",
  headers: {
    Authorization: `Bearer ${GEMINI_API_KEY}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    prompt: [{ text: "Test prompt" }],
  }),
})
  .then((res) => res.json())
  .then((data) => console.log("Response Data:", data))
  .catch((error) => console.error("Fetch error:", error));
