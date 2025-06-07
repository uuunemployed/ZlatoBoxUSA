const express = require('express');
const bodyParser = require('body-parser');
const crypto = require('crypto');
const path = require('path');

const app = express();
app.use(bodyParser.json());

// Підключаємо статичні файли з папки public
app.use(express.static(path.join(__dirname, 'public')));

const PUBLIC_KEY = 'sandbox_i41743276606';
const PRIVATE_KEY = 'sandbox_gerMEZuMEEohyfuwZuSfviXO6ClNPKkRNWPby83S';

function base64(data) {
  return Buffer.from(data).toString('base64');
}

function sha1(string) {
  return crypto.createHash('sha1').update(string).digest('base64');
}

app.post('/create-payment', (req, res) => {
    const { amount } = req.body;
    const paymentData = {
    public_key: PUBLIC_KEY,
    version: '3',
    action: 'pay',
    amount: amount.toString(),
    currency: 'USD',
    description: 'Тестова оплата',
    order_id: 'order_' + Date.now(),
    result_url: 'https://yourdomain.com/thank-you'
  };

  const data = base64(JSON.stringify(paymentData));
  const signature = sha1(PRIVATE_KEY + data + PRIVATE_KEY);

  res.json({ data, signature });
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
  console.log('Open http://localhost:3000 in your browser');
});

app.use(express.static('public'));