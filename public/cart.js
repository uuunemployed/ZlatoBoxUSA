async function pay() {
    const response = await fetch('/create-payment', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    }
    });

    const result = await response.json();
    document.getElementById('data').value = result.data;
    document.getElementById('signature').value = result.signature;
    document.getElementById('liqpay-form').submit();
}


const cart = JSON.parse(localStorage.getItem('cart')) || [];
const container = document.getElementById('cart-container');

if (cart.length === 0) {
    container.innerHTML = '<p>Ваш кошик порожній.</p>';
} else {
    container.innerHTML = cart.map((item, index) => `
    <div class="cart-item">
        <img src="${item.image}" alt="${item.name}">
        <div class="cart-item-details">
        <h2>${item.name}</h2>
        <p class="price">${item.price} $</p>
        <p>${item.description}</p>
        <button onclick="removeItem(${index})">Видалити</button>
        </div>
    </div>
    `).join('');
}

function removeItem(index) {
    cart.splice(index, 1);
    localStorage.setItem('cart', JSON.stringify(cart));
    location.reload();
}

function calculateTotal() {
  const priceElements = document.querySelectorAll('.price');
  let total = 0;
  
  priceElements.forEach(el => {
    const text = el.textContent || '';
    const price = parseFloat(text.replace(/[^\d.]/g, ''));
    if (!isNaN(price)) total += price;
  });
  
  document.getElementById('total').textContent = total.toFixed(2);
}

if (cart.length > 0) {
  calculateTotal();
}

const buttonUa = document.getElementById('radio-div');
const buttonCheh = document.getElementById('Cheh-div');

function toggleBox1() {
      amount = amount = document.getElementById('total').textContent;
  buttonUa.style.display = "none";
  buttonCheh.style.display = (buttonCheh.style.display === "none" || buttonCheh.style.display === "") ? "block" : "none";
  clearLiqpayContainers();
  startPayment('liqpay_checkout_cheh', amount);  
}

function toggleBox2() {
  buttonCheh.style.display = "none";
  buttonUa.style.display = (buttonUa.style.display === "none" || buttonUa.style.display === "") ? "block" : "none";
  clearLiqpayContainers();
}

function clearLiqpayContainers() {
  document.getElementById('liqpay_checkout_ua').innerHTML = '';
  document.getElementById('liqpay_checkout_cheh').innerHTML = '';
}

let amount = document.getElementById('total').textContent;

async function startPayment(containerId, amount) {
  try {
    const response = await fetch('/create-payment', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount })
    });

    const { data, signature } = await response.json();

    const container = document.getElementById(containerId);
    container.innerHTML = ''; // Очищаємо контейнер перед вставкою

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
    console.error('Помилка при запуску оплати:', error);
  }
}


function radio() {
  amount = '5'; 
  startPayment('liqpay_checkout_ua', amount);
}

function radioCart() {
  amount =     amount = document.getElementById('total').textContent;
  startPayment('liqpay_checkout_ua', amount);  
}

// function buttonpay1() {
//   if (!amount) {
//     console.log('Помилка: amount не встановлено');
//     return;
//   }
//   startPayment('liqpay_checkout_ua', amount);
// }

// function buttonpay2() {
//     amount = document.getElementById('total').textContent;
//   startPayment('liqpay_checkout_cheh', amount);
// }