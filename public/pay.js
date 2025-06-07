const amount = parseFloat(localStorage.getItem('cartTotal')) || 0;
console.log('Сума для оплати:', amount);


async function startPayment() {
  const containerId = 'liqpay_checkout';

  try {
    const response = await fetch('/create-payment', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount })
    });

    const { data, signature } = await response.json();

    const container = document.getElementById(containerId);
    container.innerHTML = '';

    LiqPayCheckout.init({
      data,
      signature,
      embedTo: `#${containerId}`,
      mode: "embed"
    }).on("liqpay.callback", function (data) {
      console.log("callback", data);
    }).on("liqpay.ready", function (data) {
      console.log("ready", data);
    }).on("liqpay.close", function (data) {
      console.log("close", data);
    });

  } catch (error) {
    console.error('Помилка оплати:', error);
  }
}

window.addEventListener('DOMContentLoaded', startPayment);