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

function calculateCartTotal() {
  const prices = document.querySelectorAll('.price');
  let total = 0;

  prices.forEach(el => {
    const number = parseFloat(el.textContent.replace(/[^\d.]/g, ''));
    if (!isNaN(number)) total += number;
  });

  return total;
}

// Рахуємо і зберігаємо
const total = calculateCartTotal();
localStorage.setItem('cartTotal', total.toFixed(2));
console.log('Сума в кошику:', total.toFixed(2));
document.getElementById('amountDisplay').textContent = total.toFixed(2);




