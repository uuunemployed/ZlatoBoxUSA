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
        <p class="price">${item.price} ₴</p>
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

async function startPayment() {
    let amount = document.getElementById('total').textContent

    const response = await fetch('/create-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount })
    });

    const { data, signature } = await response.json();

    LiqPayCheckout.init({
        data,
        signature,
        embedTo: "#liqpay_checkout",
        mode: "embed"
    }).on("liqpay.callback", function (data) {
        console.log("callback", data);
    }).on("liqpay.ready", function (data) {
        console.log("ready", data);
    }).on("liqpay.close", function (data) {
        console.log("close", data);
    });
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

// Викликаємо після виводу товарів
if (cart.length > 0) {
  calculateTotal();
}