const express = require("express");
const cors = require("cors");
const fetch = require("node-fetch");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "Сервер работает" });
});

app.post("/send-sms", async (req, res) => {
  const { phone, code } = req.body;
  const url = `https://smsc.kz/sys/send.php?login=LOGIN&psw=PASSWORD&phones=${phone}&mes=Код подтверждения: ${code}&fmt=1`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    console.log("📨 SMS отправлено:", phone, code);
    res.json({ success: true, data });
  } catch (err) {
    console.error("❌ Ошибка отправки:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Сервер запущен на порту ${PORT}`);
});