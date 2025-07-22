const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "Сервер работает" });
});

app.post("/send-sms", async (req, res) => {
  try {
    const { phone, code } = req.body;

    if (!phone || !code) {
      return res.status(400).json({ success: false, error: "Номер и код обязательны" });
    }

    const cleanedPhone = phone.replace(/\D/g, '');
    const message = `Код подтверждения: ${code}`;
    const login = process.env.SMSC_LOGIN;
    const psw = process.env.SMSC_PASSWORD;
    const sender = process.env.SMSC_SENDER || '';

    const url = `https://smsc.kz/sys/send.php?login=${login}&psw=${psw}&phones=${cleanedPhone}&mes=${encodeURIComponent(message)}&sender=${sender}&fmt=1`;

    const response = await fetch(url);
    const text = await response.text();

console.log("📨 Ответ от SMSC (raw):", text);
res.json({ success: true, response: text });

    console.log("📨 Результат отправки SMS:", data);
    res.json({ success: true, data });
  } catch (err) {
    console.error("❌ Ошибка на /send-sms:", err.message);
    res.status(500).json({ success: false, error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Сервер запущен на порту ${PORT}`);
});