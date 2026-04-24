import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

function buildPrompt(code, action, customInstruction = "") {
  const base = customInstruction ? `Additional instruction: ${customInstruction}\n` : "";
  switch (action) {
    case "fix":
      return `Fix all errors. Return only the corrected code in a markdown block.\n${base}\n\`\`\`\n${code}\n\`\`\``;
    case "explain":
      return `Explain in detail:\n${base}\n\`\`\`\n${code}\n\`\`\``;
    case "generate":
      return `Generate code based on this description. Return only code in markdown block.\nDescription: "${code}"\n${base}`;
    case "optimize":
      return `Optimize. Return only optimized code in markdown block.\n${base}\n\`\`\`\n${code}\n\`\`\``;
    default:
      return `Help with this code.\n${base}\n\`\`\`\n${code}\n\`\`\``;
  }
}

function extractCodeBlock(content) {
  const match = content.match(/```(?:\w+)?\n([\s\S]*?)```/);
  return match ? match[1].trim() : content.trim();
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }
  try {
    const { code, action, customInstruction } = req.body;
    if (!code || !action) {
      return res.status(400).json({ error: "code and action required" });
    }
    const valid = ["fix", "explain", "generate", "optimize"];
    if (!valid.includes(action)) {
      return res.status(400).json({ error: "Invalid action" });
    }

    const prompt = buildPrompt(code, action, customInstruction);
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "You are an expert coding assistant." },
        { role: "user", content: prompt },
      ],
      temperature: 0.2,
      max_tokens: 2000,
    });

    const fullResponse = completion.choices[0].message.content;
    if (["fix", "generate", "optimize"].includes(action)) {
      const clean = extractCodeBlock(fullResponse);
      res.json({ success: true, action, cleanCode: clean, fullResponse });
    } else {
      res.json({ success: true, action, explanation: fullResponse, fullResponse });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "AI request failed" });
  }
}