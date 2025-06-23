const cart = JSON.parse(localStorage.getItem('cart')) || [];
const container = document.getElementById('cart-container');
const country = localStorage.getItem('country') || 'UA';

cart.forEach(item => {
  if (!item.quantity || item.quantity < 1) {
    item.quantity = 1;
  }
});
localStorage.setItem('cart', JSON.stringify(cart));

if (cart.length === 0) {
  container.innerHTML = '<p id="empty-p">Ваш кошик порожній.</p>';
  document.getElementById('amountDisplay').textContent = '0';
} else {
  container.innerHTML = cart.map((item, index) => `
    <div class="cart-content">
      <div class="cart-item" data-index="${index}">
        <img class="img-cart" src="${item.image}" alt="${item.name}">
        <div class="cart-item-details">
          <div class="price_button-content">
            <div class="price-content">
              <h2>${item.name}</h2>
              <p class="price"
                data-uah="${item.price}"
                data-czk="${item.price2}">
                ${country === 'UA' ? `${item.price} грн` : `${item.price2} $`}
              </p>
            </div>
            <button class="remove-btn" onclick="removeItem(${index})">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M10 0C15.5228 0 20 4.47715 20 10C20 15.5228 15.5228 20 10 20C4.47715 20 0 15.5228 0 10C3.06032e-07 4.47715 4.47715 3.06022e-07 10 0ZM10 1.53809C5.32682 1.53809 1.53809 5.32682 1.53809 10C1.53809 14.6732 5.32682 18.4619 10 18.4619C14.6732 18.4619 18.4619 14.6732 18.4619 10C18.4619 5.32682 14.6732 1.53809 10 1.53809ZM12.2764 6.37891C12.5767 6.07879 13.0639 6.07877 13.3643 6.37891C13.6646 6.67923 13.6644 7.16638 13.3643 7.4668L10.8311 10L13.3643 12.5332C13.6646 12.8336 13.6646 13.3207 13.3643 13.6211C13.0639 13.9213 12.5767 13.9214 12.2764 13.6211L9.74316 11.0879L7.20996 13.6211C6.90952 13.9211 6.42233 13.9214 6.12207 13.6211C5.822 13.3208 5.82217 12.8336 6.12207 12.5332L8.65527 10L6.12207 7.4668C5.82218 7.16643 5.82203 6.67918 6.12207 6.37891C6.42233 6.07865 6.90952 6.07894 7.20996 6.37891L9.74316 8.91211L12.2764 6.37891Z" fill="#966D50"/>
              </svg>
            </button>
          </div>
          <div class="quantity-control">
            <button class="button-card decrease">
              <svg width="14" height="2" viewBox="0 0 14 2" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="14" height="2" rx="1" fill="#966D50"/>
              </svg>
            </button>
            <span class="quantity">${item.quantity || 1}</span>
            <button class="button-card increase">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M13 8H8V13C8 13.55 7.55 14 7 14C6.45 14 6 13.55 6 13V8H1C0.45 8 0 7.55 0 7C0 6.45 0.45 6 1 6H6V1C6 0.45 6.45 0 7 0C7.55 0 8 0.45 8 1V6H13C13.55 6 14 6.45 14 7C14 7.55 13.55 8 13 8Z" fill="#966D50"/>
              </svg>
            </button>
          </div>
        </div>
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






