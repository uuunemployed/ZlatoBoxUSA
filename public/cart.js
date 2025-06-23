const cart = JSON.parse(localStorage.getItem('cart')) || [];
const container = document.getElementById('cart-container');
const country = localStorage.getItem('country') || 'UA';

if (cart.length === 0) {
  container.innerHTML = '<p>Ваш кошик порожній.</p>';
  document.getElementById('amountDisplay').textContent = '0';
} else {
  container.innerHTML = cart.map((item, index) => `
    <div class="cart-item" data-index="${index}">
      <img src="${item.image}" alt="${item.name}">
      <div class="cart-item-details">
        <h2>${item.name}</h2>
        <p class="price"
          data-uah="${item.price}"
          data-czk="${item.price2}">
          ${country === 'UA' ? `${item.price} грн` : `${item.price2} $`}
        </p>
        <p>${item.description}</p>

        <div class="quantity-control">
          <button class="decrease">-</button>
          <span class="quantity">${item.quantity || 1}</span>
          <button class="increase">+</button>
        </div>

        <button onclick="removeItem(${index})">Видалити</button>
      </div>
    </div>
  `).join('');

  addQuantityListeners();
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

  prices.forEach(el => {
    const priceStr = country === 'UA' ? el.dataset.uah : el.dataset.czk;
    const number = parseFloat(priceStr);
    const quantity = parseInt(el.closest('.cart-item').querySelector('.quantity').textContent) || 1;

    if (!isNaN(number)) {
      total += number * quantity;
    }
  });

  return total;
}

function updateTotal() {
  const total = calculateCartTotal();
  localStorage.setItem('cartTotal', total.toFixed(2));

  const display = document.getElementById('amountDisplay');
  if (country === 'UA') {
    display.textContent = total.toFixed(2) + ' грн';
  } else {
    display.textContent = total.toFixed(2) + ' $';
  }
}

function addQuantityListeners() {
  document.querySelectorAll('.cart-item').forEach(item => {
    const quantitySpan = item.querySelector('.quantity');
    const increaseBtn = item.querySelector('.increase');
    const decreaseBtn = item.querySelector('.decrease');

    increaseBtn.addEventListener('click', () => {
      let quantity = parseInt(quantitySpan.textContent);
      quantity++;
      quantitySpan.textContent = quantity;
      updateCart(item, quantity);
    });

    decreaseBtn.addEventListener('click', () => {
      let quantity = parseInt(quantitySpan.textContent);
      if (quantity > 1) {
        quantity--;
        quantitySpan.textContent = quantity;
        updateCart(item, quantity);
      }
    });
  });
}

function updateCart(itemElement, newQuantity) {
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  const index = parseInt(itemElement.dataset.index);

  if (cart[index]) {
    cart[index].quantity = newQuantity;
    localStorage.setItem('cart', JSON.stringify(cart));
    updateTotal();
  }
}






