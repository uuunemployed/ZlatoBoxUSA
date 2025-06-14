const cart = JSON.parse(localStorage.getItem('cart')) || [];
const container = document.getElementById('cart-container');
const country = localStorage.getItem('country') || 'UA';

if (cart.length === 0) {
  container.innerHTML = '<p>Ваш кошик порожній.</p>';
  document.getElementById('amountDisplay').textContent = '0';
} else {
  container.innerHTML = cart.map((item, index) => `
    <div class="cart-item">
      <img src="${item.image}" alt="${item.name}">
      <div class="cart-item-details">
        <h2>${item.name}</h2>
        <p class="price"
           data-uah="${item.price}"
           data-czk="${item.price2}">
           ${country === 'UA' ? `${item.price} грн` : `${item.price2} $`}
        </p>
        <p>${item.description}</p>
        <button onclick="removeItem(${index})">Видалити</button>
      </div>
    </div>
  `).join('');

  updateTotal();
}

function removeItem(index) {
  cart.splice(index, 1);
  localStorage.setItem('cart', JSON.stringify(cart));
  location.reload();
}

function calculateCartTotal() {
  const prices = document.querySelectorAll('.price');
  let total = 0;
  const country = localStorage.getItem('country') || 'UA';

  prices.forEach(el => {
    const priceStr = country === 'UA' ? el.dataset.uah : el.dataset.czk;
    const number = parseFloat(priceStr);
    if (!isNaN(number)) {
      total += number;
    }
  });

  return total; // тільки число
}

function updateTotal() {
  const total = calculateCartTotal();
  document.getElementById('amountDisplay').textContent = total;
}

// Рахуємо і зберігаємо
const total = calculateCartTotal();
localStorage.setItem('cartTotal', total.toFixed(2));
console.log('Сума в кошику:', total.toFixed(2));

if(country == 'UA'){
  document.getElementById('amountDisplay').textContent = total.toFixed(2) + " грн";
} else if (country == 'CZ'){
  document.getElementById('amountDisplay').textContent = total.toFixed(2) + " $";
}





