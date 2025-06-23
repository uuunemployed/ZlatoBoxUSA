const amount = parseFloat(localStorage.getItem('cartTotal')) || 0;
let country = localStorage.getItem('country') || 'UA';
if (country === 'UA') {
  country = 'UAH';
} else {
  country = 'USD';
}
console.log('Сума для оплати:', amount);

async function startPayment() {
  const containerId = 'liqpay_checkout';

  try {
    const response = await fetch('/create-payment', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount, country })
    });

    // Перевірка статусу відповіді
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`❌ HTTP ${response.status}: ${errorText}`);
    }

    const { data, signature } = await response.json();

    const container = document.getElementById(containerId);
    container.innerHTML = '';

    LiqPayCheckout.init({
      data,
      signature,
      embedTo: `#${containerId}`,
      mode: "embed"
    })
    .on("liqpay.callback", async function (data) {
      console.log("📦 CALLBACK DATA:", data);

      if (data.status === 'success' || data.status === 'sandbox') {
        const formData = JSON.parse(localStorage.getItem('formData'));
        console.log("📬 Надсилаємо форму:", formData);
        const summary = getCartSummary();

        // Надсилання зведення кошика
        await fetch('/send-cart-summary', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: summary })
        });

        // Надсилання форми до Telegram
        try {
          const tgRes = await fetch('/send-order', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
          });

          if (tgRes.ok) {
            console.log("✅ Дані успішно надіслано в Telegram");
          } else {
            console.error("❌ Помилка при надсиланні в Telegram");
          }
        } catch (err) {
          console.error("❌ Виняток при Telegram:", err);
        }
      } else {
        console.warn("⚠️ Оплата неуспішна:", data.status);
      }
    })
    .on("liqpay.ready", function (data) {
      console.log("🟢 LiqPay готовий", data);
    })
    .on("liqpay.close", function (data) {
      console.log("🔴 LiqPay закритий", data);
    });

  } catch (error) {
    console.error('❌ Помилка під час ініціалізації оплати:', error.message);
  }
}

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

window.addEventListener('DOMContentLoaded', startPayment);