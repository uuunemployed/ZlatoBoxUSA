const burger = document.getElementById('burger');       
const nav = document.getElementById('nav');             
const closeBtn = document.getElementById('nav-div-2');  
const navLinks = document.querySelectorAll('.nav-ul-button'); 


burger.addEventListener('click', () => {
  nav.classList.add('active');
});


closeBtn.addEventListener('click', () => {
  nav.classList.remove('active');
});

navLinks.forEach(link => {
  link.addEventListener('click', () => {
    nav.classList.remove('active');
  });
});

const country = localStorage.getItem('country') || 'UA';
const amount = parseFloat(localStorage.getItem('cartTotal')) || 0;
const params = new URLSearchParams(window.location.search);
const productId = params.get("id");

console.log('Сума для оплати:', amount);

// Завантаження товарів з Google Sheets
fetch("https://opensheet.elk.sh/19o25EhVW1vjLp6FDSy02vXEGObD506kyyG3qrE1iM_c/prod")
  .then(res => res.json())
  .then(products => {
    const product = products.find(p => p.id === productId);

    if (!product) {
      document.body.innerHTML = "<p>❌ Товар не знайдено</p>";
      return;
    }

    renderProduct(product);
  })
  .catch(err => {
    console.error("❌ Помилка завантаження товару:", err);
    document.body.innerHTML = "<p>⚠️ Не вдалося завантажити товар</p>";
  });

// Функція для відображення товару
function renderProduct(product) {
  const images = [
    product.image || '',
    product.image2 || '',
    product.image3 || ''
  ];

  const mainImage = document.getElementById('product-image');
  const dotsContainer = document.getElementById('slider-dots');

  let currentIndex = 0;

  function showImage(index) {
    if (index < 0) index = images.length - 1;
    if (index >= images.length) index = 0;

    currentIndex = index;
    mainImage.src = images[currentIndex] || 'placeholder.jpg';

    dotsContainer.querySelectorAll('.dot').forEach((dot, i) => {
      dot.classList.toggle('active', i === currentIndex);
    });
  }

  // Створюємо 3 дота з різною формою
  dotsContainer.innerHTML = '';

  const shapes = ['circle', 'square', 'triangle'];

  shapes.forEach((shape, i) => {
    const dot = document.createElement('div');
    dot.classList.add('dot', shape);
    if (i === 0) dot.classList.add('active');

    dot.addEventListener('click', () => {
      showImage(i);
    });

    dotsContainer.appendChild(dot);
  });

  showImage(0);

  // Підтримка свайпу для мобільних
  let touchStartX = 0;
  let touchEndX = 0;

  const slider = document.querySelector('.slider');

  slider.addEventListener('touchstart', e => {
    touchStartX = e.changedTouches[0].screenX;
  });

  slider.addEventListener('touchend', e => {
    touchEndX = e.changedTouches[0].screenX;
    handleGesture();
  });

  function handleGesture() {
    if (touchEndX < touchStartX - 30) {
      showImage(currentIndex + 1);
    } else if (touchEndX > touchStartX + 30) {
      showImage(currentIndex - 1);
    }
  }

  // Відображення ціни, опису, кнопки
  const priceEl = document.getElementById("product-price");
  priceEl.textContent = (country === 'UA')
    ? `${product.price} грн`
    : `${product.price2} Kc`;

  document.getElementById("product-description").textContent = product.description || "";
  document.getElementById("product-about").textContent = product.about || "";
  document.getElementById("product-name").textContent = product.name || "";

  const addBtn = document.getElementById("add-to-cart-btn");
  addBtn.onclick = () => {
    toggleProductInCart(product);
    updateProductButton(product.id);
  };

  updateProductButton(product.id);
}


// --- Кошик ---
function toggleProductInCart(product) {
  let cart = JSON.parse(localStorage.getItem('cart')) || [];
  const index = cart.findIndex(p => p.id === product.id);
  if (index !== -1) {
    cart.splice(index, 1); 
  } else {
    cart.push(product); 
  }
  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartButton();
}

function updateProductButton(productId) {
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  const addBtn = document.getElementById("add-to-cart-btn");
  const inCart = cart.some(p => p.id === productId);

  if (inCart) {
    addBtn.classList.add("added");
    addBtn.textContent = "У кошику";
  } else {
    addBtn.classList.remove("added");
    addBtn.textContent = "до корзини";
  }
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

window.addEventListener("pageshow", () => {
  updateCartButton();
  updateProductButton(productId);
});
window.addEventListener('pageshow', updateCartButton);

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

const homeBtn = document.getElementById('home-btn');

homeBtn.addEventListener('click', () => {
  window.location.href = 'index.html';  
});