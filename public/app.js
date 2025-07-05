const burger = document.getElementById('burger');        // кнопка для відкриття меню
const nav = document.getElementById('nav');              // контейнер меню
const closeBtn = document.getElementById('nav-div-2');   // кнопка закриття (svg)
const navLinks = document.querySelectorAll('.nav-ul-button'); // усі кнопки в меню

// Відкрити меню
burger?.addEventListener('click', () => {
  nav.classList.add('active');
});

// Закрити меню по кнопці (Х)
closeBtn?.addEventListener('click', () => {
  nav.classList.remove('active');
});

// Закрити меню після кліку на будь-яке посилання
navLinks.forEach(link => {
  link.addEventListener('click', () => {
    nav.classList.remove('active');
  });
});

function updatePrices(country) {
  const prices = document.querySelectorAll('.price');
  prices.forEach(priceEl => {
    if (country === 'UA') {
      localStorage.setItem('country', country);
      priceEl.textContent = `${priceEl.dataset.uah} грн`;
    } else if (country === 'CZ') {
      localStorage.setItem('country', country);
      priceEl.textContent = `${priceEl.dataset.czk} Kč`;
    }
  });
}

window.addEventListener('DOMContentLoaded', () => {
  let country = sessionStorage.getItem('country');
  console.log(country);


  if (!country) {
    console.log(country);
    document.getElementById('country-modal').style.display = 'flex';
  } 

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
              <button class="add-to-cart" data-id="${p.id}">до корзини</button>
            </div>
          </div>
        </article>
      `).join('');

      document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', () => {
          const productId = parseInt(button.dataset.id);
          const product = products.find(p => parseInt(p.id) === productId);
          if (product) addToCart(product);
        });
      });

      if (country) updatePrices(country);
      updateAddToCartButtons();
    });

  updateCartButton();
});

function selectCountry(country) {
  sessionStorage.setItem('country', country);
  updatePrices(country);
  document.getElementById('country-modal').style.display = 'none';
}

function addToCart(product) {
  let cart = JSON.parse(localStorage.getItem('cart')) || [];
  const index = cart.findIndex(p => parseInt(p.id) === parseInt(product.id));

  if (index !== -1) {
    cart.splice(index, 1);
  } else {
    cart.push(product);
  }

  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartButton();
  updateAddToCartButtons();
}

function updateCartButton() {
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  const count = cart.length;
  const btn = document.getElementById('cart-button');

  if (btn) {
    btn.style.display = count > 0 ? 'flex' : 'none';
    btn.innerText = `${count}`;
  }
}

function updateAddToCartButtons() {
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  const buttons = document.querySelectorAll('.add-to-cart');

  buttons.forEach(button => {
    const productId = parseInt(button.dataset.id);
    const inCart = cart.some(p => parseInt(p.id) === productId);

    if (inCart) {
      button.classList.add('added');
      button.textContent = 'у кошику';
    } else {
      button.classList.remove('added');
      button.textContent = 'до корзини';
    }
  });
}

window.addEventListener('pageshow', () => {
  updateCartButton();
  updateAddToCartButtons();
});

document.querySelectorAll('.faq-question').forEach(button => {
  button.addEventListener('click', () => {
    const faqItem = button.closest('.faq-item-content');
    faqItem.classList.toggle('active');
  });
});

function scrollToSection(id) {
  const section = document.getElementById(id);
  if (section) {
    section.scrollIntoView({ behavior: 'smooth' });
  }
}



