const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();

const app = express();
app.use(
  cors({
    origin: "https://content-quality-analyzer-git-main-kushs-projects-61428590.vercel.app",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true, 
  })
);
app.use(bodyParser.json());  

const PORT = 5000;

// Initialize Gemini API
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.post("/analyze", async (req, res) => {
  try {
    const { content } = req.body;

    if (!content) {
      return res.status(400).json({ error: "Content is required" });
    }

    // Prompt Gemini for structured analysis
const prompt = `
Analyze the following content based on:
1. Readability (1–100)
2. SEO-friendliness (1–100)
3. Grammar (1–100)
4. Tone & Engagement (descriptive string)

Then give:
- An overall rating: "Good", "Average", or "Bad"
- A ready-to-use "improvementPrompt" (a direct copy-paste prompt that will make the content 2x better in terms of SEO, readability, and tone while keeping the magical/wondrous feel).

Return ONLY valid JSON in this format:
{
  "readability": number,
  "seo": number,
  "grammar": number,
  "tone": string,
  "overall": "Good" | "Average" | "Bad",
  "suggestion": "string"
}

Content:
"""${content}"""
`;


    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(prompt);

    const text = result.response.text();
      console.log("🔎 Gemini raw output:", text);

    // Try parsing Gemini's response as JSON
  let cleanText = text
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    // Try parsing Gemini's response as JSON
    let analysis;
    try {
      analysis = JSON.parse(cleanText);
    } catch (err) {
      return res.status(500).json({
        error: "Failed to parse Gemini response",
        raw: text
      });
    }


    res.json(analysis);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
