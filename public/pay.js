const amount = parseFloat(localStorage.getItem('cartTotal')) || 0;
let country = localStorage.getItem('country') || 'UA';
if (country === 'UA') {
  country = 'UAH';
} else {
  country = 'USD';
}

const wayforpay = new Wayforpay();

function isArrayOfStrings(arr) {
  return Array.isArray(arr) && arr.every(item => typeof item === 'string');
}

function startPayment() {
  fetch("/api/payment", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ amount, currency: country })
  })
  .then(res => res.json())
  .then(data => {
    console.log("Отримані дані з бекенду:", data);

    const productName = isArrayOfStrings(data.productName) ? data.productName : [String(data.productName)];
    const productPrice = isArrayOfStrings(data.productPrice) ? data.productPrice : [String(data.productPrice)];
    const productCount = isArrayOfStrings(data.productCount) ? data.productCount : [String(data.productCount)];

    const amount = Number(data.amount).toFixed(2);
    const orderDate = String(data.orderDate);

    wayforpay.run({
      merchantAccount: data.merchantAccount,
      merchantDomainName: data.merchantDomainName,
      authorizationType: "SimpleSignature",
      merchantSignature: data.merchantSignature,
      orderReference: data.orderReference,
      orderDate,
      amount,
      currency: data.currency,
      productName,
      productPrice,
      productCount,
      clientFirstName: data.clientFirstName,
      clientLastName: data.clientLastName,
      clientEmail: data.clientEmail,
      clientPhone: data.clientPhone,
      language: data.language,
    },
    (response) => { console.log("Оплата успішна", response); },
    (response) => { console.log("Оплата відхилена", response); },
    (response) => { console.log("Оплата в обробці", response); });
  })
  .catch(err => console.error("Помилка отримання даних з бекенду:", err));
}

// Запускаємо оплату одразу після завантаження сторінки
window.addEventListener('DOMContentLoaded', startPayment);








function getCartSummary() {
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  let total = 0;

  if (cart.length === 0) return 'Кошик порожній.';

  const lines = cart.map(item => {
    const quantity = item.quantity || 1;
    const price = parseFloat(item.price);
    total += price * quantity;
    return `🛍 ${item.name} — ${quantity} шт × ${price} грн`;
  });

  lines.push(`\n💰 Загальна сума: ${total.toFixed(2)} грн`);
  return lines.join('\n');
}
