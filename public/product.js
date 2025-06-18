const burger = document.getElementById('burger');        // кнопка для відкриття меню
const nav = document.getElementById('nav');              // сам контейнер меню
const closeBtn = document.getElementById('nav-div-2');   // кнопка з Х (svg)
const navLinks = document.querySelectorAll('.nav-ul a'); // усі посилання в меню

// Відкрити меню
burger.addEventListener('click', () => {
  nav.classList.add('active');
});

// Закрити меню по кнопці (Х)
closeBtn.addEventListener('click', () => {
  nav.classList.remove('active');
});

// Закрити меню після кліку на будь-яке посилання
navLinks.forEach(link => {
  link.addEventListener('click', () => {
    nav.classList.remove('active');
  });
});


    const country = localStorage.getItem('country') || 'UA';
    const amount = parseFloat(localStorage.getItem('cartTotal')) || 0;
    console.log('Сума для оплати:', amount);
    const params = new URLSearchParams(window.location.search);
    const productId = params.get("id");

// --- Завантаження товару ---
fetch("https://opensheet.elk.sh/19o25EhVW1vjLp6FDSy02vXEGObD506kyyG3qrE1iM_c/prod")
  .then(res => res.json())
  .then(products => {
    const product = products.find(p => p.id === productId);
    if (!product) {
      document.body.innerHTML = "<p>Товар не знайдено</p>";
      return;
    }

    document.getElementById("product-name").textContent = product.name;
    document.getElementById("product-image").src = product.image;

    if (country === 'UA') {
      document.getElementById("product-price").textContent = product.price + " грн";
    } else {
      document.getElementById("product-price").textContent = product.price2 + " $";
    }

    document.getElementById("product-description").textContent = product.description;
    document.getElementById("product-about").textContent = product.about;

    // Прив’язка до кнопки
    const addBtn = document.getElementById("add-to-cart-btn");
    addBtn.addEventListener("click", () => {
      toggleProductInCart(product);
      updateProductButton(product.id);
    });

    // Показати актуальний стан
    updateProductButton(product.id);
  });


// --- Кошик ---
function toggleProductInCart(product) {
  let cart = JSON.parse(localStorage.getItem('cart')) || [];
  const index = cart.findIndex(p => p.id === product.id);
  if (index !== -1) {
    cart.splice(index, 1); // Видалити
  } else {
    cart.push(product); // Додати
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

// Оновлюємо при поверненні на сторінку
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