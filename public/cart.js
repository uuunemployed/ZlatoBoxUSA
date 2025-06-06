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

function showOptions() {
  document.getElementById('radio-container').style.display = 'block';
}


let amount = 0;
let useFixedAmount = false;

function radioSelected(value) {
  const liqpayBlock = document.getElementById('liqpay_checkout');

  if (value === 'option1') {
    amount = 100;
    useFixedAmount = true;

    // Очищаємо liqpay блок перед новим рендером
    liqpayBlock.innerHTML = '';
    liqpayBlock.style.display = 'block';

    // ініціюємо оплату з 100 грн
    startPayment();

  } else if (value === 'option2') {
    useFixedAmount = false;

    // перерахунок загальної суми
    calculateTotal(); // цей виклик має оновити змінну amount

    liqpayBlock.innerHTML = '';
    liqpayBlock.style.display = 'block';

    // ініціюємо оплату з обрахованою сумою
    startPayment();
  }
}

// Підрахунок суми з кошика
function calculateTotal() {
  if (useFixedAmount) return; // не перераховуємо, якщо фіксована ціна

  const priceElements = document.querySelectorAll('.price');
  let total = 0;

  priceElements.forEach(el => {
    const price = parseFloat(el.textContent.replace(/[^\d.]/g, ''));
    if (!isNaN(price)) total += price;
  });

  amount = total.toFixed(2);
  const totalElements = document.querySelectorAll('.total');
    totalElements.forEach(el => el.textContent = amount);
}

// Викликаємо після виводу товарів
calculateTotal();

// Оплата
async function startPayment() {
  if (amount <= 0) {
    alert("Сума некоректна");
    return;
  }

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
  });
}
