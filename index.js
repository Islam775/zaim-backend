const express = require("express");
const cors = require("cors");
const fetch = require("node-fetch");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Zaim backend is running");
});

app.post("/send-sms", async (req, res) => {
  try {
    const { phone, code } = req.body;

    if (!phone || !code) {
      return res.status(400).json({ success: false, error: "Номер и код обязательны" });
    }

    const cleanedPhone = phone.replace(/\D/g, "");
    const message = `Код подтверждения: ${code}`;
    const login = process.env.SMSC_LOGIN;
    const psw = process.env.SMSC_PASSWORD;
    const sender = process.env.SMSC_SENDER || "";
    const url = `https://smsc.kz/sys/send.php?login=${login}&psw=${psw}&phones=${cleanedPhone}&mes=${encodeURIComponent(message)}&sender=${sender}&fmt=1`;

    const response = await fetch(url);
    const text = await response.text();

    if (!text || text.toLowerCase().includes("error")) {
      console.error("❌ Ошибка от SMSC:", text);
      return res.status(500).json({ success: false, error: "Ошибка от SMSC" });
    }

    console.log("📨 SMS отправлена успешно:", text);
    return res.json({ success: true, response: text });

  } catch (err) {
    console.error("❌ Ошибка в /send-sms:", err.message);
    if (!res.headersSent) {
      return res.status(500).json({ success: false, error: "Внутренняя ошибка сервера" });
    }
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Сервер запущен на порту ${PORT}`);
});