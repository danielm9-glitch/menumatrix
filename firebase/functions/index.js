"use strict";

const { onRequest } = require("firebase-functions/v2/https");
const vision = require("@google-cloud/vision");

const client = new vision.ImageAnnotatorClient();

exports.scanMenuPhoto = onRequest(
  {
    cors: true,
    maxInstances: 10,
    memory: "512MiB",
    timeoutSeconds: 60
  },
  async (request, response) => {
    if (request.method !== "POST") {
      response.status(405).json({ error: "Use POST." });
      return;
    }

    const { imageData, category = "mains" } = request.body || {};
    if (!imageData || typeof imageData !== "string") {
      response.status(400).json({ error: "Missing imageData." });
      return;
    }

    try {
      const content = imageData.replace(/^data:image\/[a-zA-Z0-9.+-]+;base64,/, "");
      const [result] = await client.textDetection({
        image: { content }
      });

      const rawText = result.fullTextAnnotation?.text || "";
      const cleanText = cleanOcrText(rawText);
      const draft = parseMenuItem(cleanText, category);

      response.json({
        text: cleanText,
        draft
      });
    } catch (error) {
      console.error(error);
      response.status(500).json({ error: "Could not scan menu photo." });
    }
  }
);

function cleanOcrText(text) {
  return String(text)
    .split(/\r?\n/)
    .map((line) => line.replace(/[^A-Za-z0-9$.,&'()\-\/ ]+/g, " ").replace(/\s+/g, " ").trim())
    .filter((line) => line.length > 2)
    .filter((line) => /[A-Za-z]{3,}/.test(line) || /\$\s*\d+/.test(line))
    .slice(0, 10)
    .join("\n");
}

function parseMenuItem(text, category) {
  const lines = text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
  const meaningfulLines = lines.filter((line) => /[A-Za-z]{3,}/.test(line));
  const fullText = meaningfulLines.join(" ");
  const priceMatch = fullText.match(/\$\s*(\d+(?:\.\d{1,2})?)/) || fullText.match(/\b(\d{1,3}(?:\.\d{2})?)\s*$/);
  const price = priceMatch ? Number(priceMatch[1]) : 0;
  const name = cleanScannedLine(meaningfulLines[0] || "New Menu Item");
  const description =
    cleanScannedLine(meaningfulLines.slice(1).join(" ").replace(priceMatch?.[0] || "", "")) ||
    "Review scanned menu text and update this description.";

  return {
    name,
    description,
    category,
    diet: "NA",
    heat: 0,
    price: Number.isFinite(price) ? price : 0,
    allergens: [],
    details: description
  };
}

function cleanScannedLine(line) {
  return String(line).replace(/\s+/g, " ").replace(/\$\s*\d+(?:\.\d{1,2})?/g, "").trim();
}
