const express = require('express');
const cors = require('cors');
const crypto = require('crypto');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Віддавати статичні файли з public
app.use(express.static(path.join(__dirname, 'public')));

const merchantAccount = "zlatoboxusa_onrender_com1";
const secretKey = "8ffa0bff3577664381b4695a876d70d5009fc1db";
const merchantDomainName = "zlatoboxusa.onrender.com";

app.post('/api/payment', (req, res) => {
  let { amount, currency, productName, productCount, productPrice } = req.body;

  amount = amount ? Number(amount).toFixed(2) : "1000.00";
  currency = currency || "UAH";

  if (!Array.isArray(productName)) productName = ["Товар"];
  if (!Array.isArray(productCount)) productCount = [1];
  if (!Array.isArray(productPrice)) productPrice = [amount];

  const maxLength = Math.max(productName.length, productCount.length, productPrice.length);
  productName = productName.slice(0, maxLength);
  productCount = productCount.slice(0, maxLength);
  productPrice = productPrice.slice(0, maxLength);

  const orderReference = "ORDER_" + Date.now();
  const orderDate = Math.floor(Date.now() / 1000);

  const signatureString = [
    merchantAccount,
    merchantDomainName,
    orderReference,
    orderDate.toString(),
    amount,
    currency,
    ...productName,
    ...productCount,
    ...productPrice
  ].join(";");

  const merchantSignature = crypto.createHmac("md5", secretKey)
    .update(signatureString)
    .digest("hex");

  res.json({
    merchantAccount,
    merchantDomainName,
    authorizationType: "SimpleSignature",
    merchantSignature,
    orderReference,
    orderDate,
    amount,
    currency,
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

// Обробка всіх інших маршрутів — повертаємо index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
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
  console.log(`✅ Сервер запущено на http://localhost:${PORT}`);
});


