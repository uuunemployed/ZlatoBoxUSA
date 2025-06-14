    const burger = document.getElementById('burger');
    const nav = document.getElementById('nav');
    const closeBtn = document.getElementById('nav-div-2');

      burger.addEventListener('click', () => {
    nav.classList.toggle('active');
  });

    closeBtn.addEventListener('click', () => {
    nav.classList.remove('active');
  }); 


    const country = localStorage.getItem('country') || 'UA';
    const amount = parseFloat(localStorage.getItem('cartTotal')) || 0;
    console.log('Сума для оплати:', amount);
    const params = new URLSearchParams(window.location.search);
    const productId = params.get("id");

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
    if(country === 'UA'){
      document.getElementById("product-price").textContent = product.price + " грн";
    } else{
      document.getElementById("product-price").textContent = product.price2 + " $";
    }
    document.getElementById("product-description").textContent = product.description;
  });



const cart = JSON.parse(localStorage.getItem('cart')) || [];

function addToCart(product) {
  const cart = JSON.parse(localStorage.getItem('cart')) || []; // 🔄 актуальне значення
  cart.push(product);
  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartButton();

}
document.getElementById("add-to-cart-btn").addEventListener("click", () => {
  fetch("https://opensheet.elk.sh/19o25EhVW1vjLp6FDSy02vXEGObD506kyyG3qrE1iM_c/prod")
    .then(res => res.json())
    .then(products => {
      const product = products.find(p => p.id === productId);
      if (product) {
        addToCart(product);
      }
    });
});
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

document.querySelectorAll('.faq-question').forEach(button => {
  button.addEventListener('click', () => {
    const faqItem = button.closest('.faq-item-content');
    faqItem.classList.toggle('active');
  });
});