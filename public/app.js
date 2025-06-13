  const burger = document.getElementById('burger');
  const nav = document.getElementById('nav');
  const closeBtn = document.getElementById('nav-div-2');

  burger.addEventListener('click', () => {
    nav.classList.toggle('active');
  });

    closeBtn.addEventListener('click', () => {
    nav.classList.remove('active');
  }); 
  
function updatePrices(country) {
  const prices = document.querySelectorAll('.price');
  prices.forEach(priceEl => {
    if (country === 'UA') {
      priceEl.textContent = `${priceEl.dataset.uah} грн`;
    } else if (country === 'CZ') {
      priceEl.textContent = `${priceEl.dataset.czk} Kč`;
      let countryPay = 'UAH';
    }
  });
}


function selectCountry(country) {
  localStorage.setItem('country', country);
  updatePrices(country);
  document.getElementById('country-modal').style.display = 'none';
}

// --- Завантаження сторінки ---
window.addEventListener('DOMContentLoaded', () => {
  const country = localStorage.getItem('country');
  if (!country) {
    document.getElementById('country-modal').style.display = 'flex';
  }

  // Завантажуємо продукти
  fetch("https://opensheet.elk.sh/19o25EhVW1vjLp6FDSy02vXEGObD506kyyG3qrE1iM_c/prod")
    .then(res => res.json())
    .then(products => {
      const productList = document.getElementById('product-list');
      productList.innerHTML = products.map(p => `
          <article class="card">
            <div class="img-card">
              <img onclick="window.location.href='product.html?id=${p.id}'" src="${p.image}" />
            </div>
            <div class="card-content">
              <h2 onclick="window.location.href='product.html?id=${p.id}'">${p.name}</h2>
              <p class="description" onclick="window.location.href='product.html?id=${p.id}'">${p.description}</p>
              <div class="price-botton">
                <p class="price" data-uah="${p.price}" data-czk="${p.price2}"></p>
                <button class="add-to-cart" onclick='addToCart(${JSON.stringify(p)})'>Додати в кошик</button>
              </div>
            </div>
          </article>
      `).join('');
      if (country) updatePrices(country);
    });

  // Оновлення кнопки кошика
  updateCartButton();
});

// --- Функції роботи з кошиком ---
const cart = JSON.parse(localStorage.getItem('cart')) || [];

function addToCart(product) {
  const cart = JSON.parse(localStorage.getItem('cart')) || []; // 🔄 актуальне значення
  cart.push(product);
  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartButton();
}
function updateCartButton() {
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  const count = cart.length;
  const btn = document.getElementById('cart-button');

  if (btn) {
    if (count >= 1) {
      btn.style.display = 'flex';
      btn.innerText = `${count}`;
    } else {
      btn.style.display = 'none';
    }
  }
}

  window.addEventListener('pageshow', updateCartButton);




