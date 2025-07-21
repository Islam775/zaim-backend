const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');

const app = express();
app.use(cors({
  origin: 'https://zaim-market.onrender.com'
}));
app.use(express.json());

app.post('/send-sms', async (req, res) => {
  const { phone, code } = req.body;

  console.log("📨 Новая заявка получена с сайта:", { phone, code });

  const smsUrl = `https://smsc.kz/sys/send.php?login=islam775&psw=egieV0695&phones=${phone.replace(/\D/g, '')}&mes=Код подтверждения: ${code}&fmt=1`;

  try {
    const response = await fetch(smsUrl);
    const data = await response.text();
    console.log("📲 Ответ от SMSC:", data);
    res.status(200).send("OK");
  } catch (err) {
    console.error("❌ Ошибка отправки SMS:", err);
    res.status(500).send("Ошибка");
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`✅ Сервер запущен на порту ${PORT}`);
});