import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Route to generate holiday-themed posts
  app.post("/api/generate-post", async (req, res) => {
    try {
      const { holiday, details, style, tone, language = "pl" } = req.body;

      if (!holiday) {
        return res.status(400).json({ error: "Nazwa święta / okazji jest wymagana." });
      }

      const prompt = `Jesteś ekspertem ds. marketingu w mediach społecznościowych. Twój cel to napisać kreatywne, angażujące i profesjonalne posty dotyczące nadchodzącego wydarzenia lub święta.
Użytkownik podał następujące parametry:
- Święto / Wydarzenie: ${holiday}
- Szczegóły / Oferta / Informacje dodatkowe: ${details || "brak dodatkowych instrukcji"}
- Styl odbiorców (Styl grupy docelowej): ${style || "Festive/Radosny"}
- Ton wypowiedzi: ${tone || "Inspirujący/Ciepły"}
- Język: ${language === "pl" ? "polski" : "angielski"}

Stwórz dokładnie 3 unikalne warianty postów społecznościowych. 
Każdy wariant powinien zawierać:
1. Krótki, chwytliwy tytuł/podgląd (np. "Wariant 1: Radosny i rodzinny")
2. Tekst posta z odpowiednimi marginesami, emotikonami (emoji) oraz trafnymi hasztagami (od 3 do 6 hasztagów na końcu posta)
3. Sugestię wizualną ("suggestedVisualTip") - krótką radę dla projektanta graficznego, jak przygotować baner kryjący tę treść.

Format odpowiedzi musi być zgodny z dostarczonym schematem JSON.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              posts: {
                type: Type.ARRAY,
                description: "Array of 3 social media post variations.",
                items: {
                  type: Type.OBJECT,
                  properties: {
                    title: {
                      type: Type.STRING,
                      description: "Short title or theme of this post option.",
                    },
                    content: {
                      type: Type.STRING,
                      description: "The complete social media post copy, with spacing, emojis, and hashtags.",
                    },
                    suggestedVisualTip: {
                      type: Type.STRING,
                      description: "Visual composition advice for designing a background card or graphic for this post copy.",
                    },
                  },
                  required: ["title", "content", "suggestedVisualTip"],
                },
              },
            },
            required: ["posts"],
          },
        },
      });

      const text = response.text || "{}";
      res.json(JSON.parse(text));
    } catch (error: any) {
      console.error("Gemini Generation Error:", error);
      res.status(500).json({
        error: "Błąd podczas generowania tekstu przez AI. Upewnij się, że klucz GEMINI_API_KEY jest odpowiednio skonfigurowany w Secrets.",
        details: error.message,
      });
    }
  });

  // Serve static files and handle Vite logic
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
