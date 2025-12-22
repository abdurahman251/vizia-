import express from 'express';
import { GoogleGenerativeAI } from "@google/generative-ai";

const router = express.Router();

router.post('/chat', async (req, res) => {
    try {
        const { messages } = req.body;
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

        // ⭐ İŞTE O MUCİZE KELİME:
        // Ekran görüntünde gördüğümüz ismin birebir aynısını yazıyoruz.
        const model = genAI.getGenerativeModel({ 
            model: "gemini-3-flash-preview" 
        });

        const chat = model.startChat({
            history: messages.slice(0, -1)
        });

        const lastMsg = messages[messages.length - 1].parts[0].text;
        const result = await chat.sendMessage(lastMsg);
        const response = await result.response;
        
        res.json({ reply: response.text() });
        
    } catch (error) {
        console.error("🔥 AI Rota Hatası:", error);
        res.status(500).json({ 
            hata: "Bağlantı hatası kanka.", 
            detay: error.message 
        });
    }
});

export default router;