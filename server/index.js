const express = require("express");
const cors = require("cors");
const genAI = require("@google/generative-ai"); // Correct import

const app = express();
const PORT = 3001;
app.use(cors());

const GEMINI_API_KEY = "AIzaSyAIE0ZafJbG2dYvYdYgwcWVPH55taI3WfU";
const googleAI = new genAI.GoogleGenerativeAI(GEMINI_API_KEY); // Correct initialization

app.get("/recipeStream", async (req, res) => {
  const { ingredients, mealType, cuisine, complexity, cookingTime, type } =
    req.query;

  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  // Set up a ping (heartbeat) to keep the connection alive.
  const pingInterval = setInterval(() => {
    res.write(":\n\n"); // SSE comment as a heartbeat
  }, 15000);

  const prompt = `
    Generate a recipe with the following details:
    Ingredients: ${ingredients}
    Meal Type: ${mealType}
    Cuisine: ${cuisine}
    Cooking Time: ${cookingTime}
    Complexity: ${complexity}
    type: ${type}
    Include detailed preparation and cooking steps, highlighting vibrant flavors.
    Name the recipe in the local language based on the cuisine.
  `;

  try {
    const model = googleAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    // Pass prompt as an array directly (required to be iterable)
    const result = await model.generateContentStream([{ text: prompt }]);

    // Iterate over the streaming chunks
    for await (const chunk of result.stream) {
      console.log("DEBUG - Received chunk:", JSON.stringify(chunk));

      let receivedText = "";
      if (typeof chunk === "string") {
        receivedText = chunk;
      } else if (chunk && typeof chunk === "object") {
        // Try a direct text property first.
        if (chunk.text) {
          receivedText =
            typeof chunk.text === "function" ? chunk.text() : chunk.text;
        }
        // Then try looking inside candidates array.
        else if (
          chunk.candidates &&
          Array.isArray(chunk.candidates) &&
          chunk.candidates.length > 0
        ) {
          const candidate = chunk.candidates[0];
          console.log("DEBUG - Candidate object:", JSON.stringify(candidate));

          // Option 1: Check if candidate.content.parts exists.
          if (
            candidate.content &&
            candidate.content.parts &&
            Array.isArray(candidate.content.parts) &&
            candidate.content.parts.length > 0 &&
            candidate.content.parts[0].text
          ) {
            receivedText = candidate.content.parts
              .map((part) =>
                typeof part.text === "function" ? part.text() : part.text
              )
              .join(" ");
          }
          // Option 2: If candidate has parts directly
          else if (
            candidate.parts &&
            Array.isArray(candidate.parts) &&
            candidate.parts.length > 0 &&
            candidate.parts[0].text
          ) {
            receivedText = candidate.parts
              .map((part) =>
                typeof part.text === "function" ? part.text() : part.text
              )
              .join(" ");
          }
          // Option 3: Fallback if candidate.text exists directly
          else if (candidate.text) {
            receivedText =
              typeof candidate.text === "function"
                ? candidate.text()
                : candidate.text;
          }
        }
      } else {
        console.log("DEBUG - Unexpected chunk type:", typeof chunk, chunk);
      }

      if (!receivedText) {
        console.log(
          "DEBUG - No text extracted from chunk:",
          JSON.stringify(chunk)
        );
      } else {
        console.log("DEBUG - Extracted text:", receivedText);
        const chunkResponse = {
          action: "chunk",
          chunk: receivedText,
        };
        res.write(`data: ${JSON.stringify(chunkResponse)}\n\n`);
      }
    }

    // Signal the end of data
    res.write(`data: ${JSON.stringify({ action: "close" })}\n\n`);
    clearInterval(pingInterval);
    res.end();
  } catch (error) {
    console.error("Gemini API Error:", error);
    res.write(
      `data: ${JSON.stringify({ action: "error", message: error.message })}\n\n`
    );
    clearInterval(pingInterval);
    res.end();
  }

  // Ensure that when the request is closed, the response is ended.
  req.on("close", () => {
    clearInterval(pingInterval);
    res.end();
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
