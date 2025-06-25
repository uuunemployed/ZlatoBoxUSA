const express = require('express');
const bodyParser = require('body-parser');
const crypto = require('crypto');
const path = require('path');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Telegram
const BOT_TOKEN = '7987722166:AAEscpJFr4z5oOsVQi8d-_JF7vxg5kFVGB8';
const CHAT_ID = '1149871757';

// LiqPay
const PUBLIC_KEY = 'sandbox_i10822128511';
const PRIVATE_KEY = 'sandbox_qECwRS3ZH91wXEXVBHilk2w5UicL8CpJxXARlBDt';

function base64(data) {
  return Buffer.from(data).toString('base64');
}

function sha1(string) {
  return crypto.createHash('sha1').update(string).digest('base64');
}

// 💳 Створення платежу
app.post('/create-payment', (req, res) => {
  const { amount, country } = req.body;

  const paymentData = {
    public_key: PUBLIC_KEY,
    version: '3',
    action: 'pay',
    amount: amount.toString(),
    currency: country,
    description: 'Тестова оплата',
    order_id: 'order_' + Date.now(),
    result_url: 'https://yourdomain.com/thank-you'
  };

  const data = base64(JSON.stringify(paymentData));
  const signature = sha1(PRIVATE_KEY + data + PRIVATE_KEY);

  res.json({ data, signature });
});

// 📦 Надсилання замовлення в Telegram
app.post('/send-order', async (req, res) => {
  const data = req.body;

  const message = `
📦 НОВЕ ЗАМОВЛЕННЯ:
👤 Ім'я: ${data.firstName || 'немає'}
👤 Прізвище: ${data.lastName || 'немає'}
📧 Email: ${data.email || 'немає'}
📍 Область: ${data.region || 'немає'}
🏙️ Місто: ${data.city || 'немає'}
🏤 Відділення: ${data.postOffice || 'немає'}
🇨🇿 Чехія: ${data.czBranch || 'не обрано'}
💳 Оплата: ${data.paymentType || 'не вибрано'}
  `;

  try {
    await axios.post(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      chat_id: CHAT_ID,
      text: message
    });
    res.status(200).send('OK');
  } catch (err) {
    console.error('❌ Telegram error:', err.response?.data || err.message);
    res.status(500).send('❌ Telegram error');
  }
});

// 🧾 Надсилання зведення кошика
app.post('/send-cart-summary', async (req, res) => {
  const { message } = req.body;

  try {
    await axios.post(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      chat_id: CHAT_ID,
      text: message
    });
    res.sendStatus(200);
  } catch (err) {
    console.error('❌ Summary error:', err);
    res.sendStatus(500);
  }
});

// 🔥 Запуск сервера

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});


