const express = require('express');
const cors = require('cors');       // <-- додай цей рядок
const bodyParser = require('body-parser');
const crypto = require('crypto');
const path = require('path');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Дані мерчанта (тестові)
const merchantAccount = "test_merch_n1";
const secretKey = "flk3409refn54t54t*FNJRET";
const merchantDomainName = "zlatoboxusa.onrender.com";

app.post('/api/payment', (req, res) => {
  const { amount, currency } = req.body;

  // Якщо не передали - ставимо дефолти
  const orderAmount = amount ? amount.toFixed(2) : "1000.00";
  const orderCurrency = currency || "UAH";

  const orderReference = "ORDER_" + Date.now();
  const orderDate = Math.floor(Date.now() / 1000);

  const productName = ["a"];
  const productCount = ["1"];
  const productPrice = [orderAmount];

  // Формуємо рядок для підпису
  const signatureString = [
    merchantAccount,
    merchantDomainName,
    orderReference,
    orderDate.toString(),
    orderAmount,
    orderCurrency,
    ...productName,
    ...productCount,
    ...productPrice
  ].join(";");

  const merchantSignature = crypto.createHmac("md5", secretKey)
    .update(signatureString)
    .digest("hex");

  console.log("Signature string →", signatureString);
  console.log("Generated Signature →", merchantSignature);

  res.json({
    merchantAccount,
    merchantDomainName,
    authorizationType: "SimpleSignature",
    merchantSignature,
    orderReference,
    orderDate,
    amount: orderAmount,
    currency: orderCurrency,
    productName,
    productCount,
    productPrice,
    clientFirstName: "Іван",
    clientLastName: "Денис",
    clientEmail: "denisivan06007@gmail.com",
    clientPhone: "380668136150",
    language: "UA",
  });
});







// Telegram
const BOT_TOKEN = '7987722166:AAEscpJFr4z5oOsVQi8d-_JF7vxg5kFVGB8';
const CHAT_ID = '1149871757';

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


