const cart = JSON.parse(localStorage.getItem('cart')) || [];
updateCartButton();

fetch("https://opensheet.elk.sh/19o25EhVW1vjLp6FDSy02vXEGObD506kyyG3qrE1iM_c/prod")
  .then(response => response.json())
  .then(products => {
    console.log(products[0]);
    renderProducts(products);
  })
  .catch(err => {
    console.error('Помилка завантаження даних:', err);
    document.getElementById("product-list").innerHTML = '<p>Не вдалося завантажити товари.</p>';
  });

function renderProducts(products) {
  const list = document.getElementById("product-list");
  list.innerHTML = products.map((p, i) => `
    <article class="card">
      <img src="${p.image}"/>
      <div class="card-content">
        <h2>${p.name}</h2>
        <p class="price">${p.price} ₴</p>
        <p>${p.description}</p>
        <button class="add-to-cart" onclick='addToCart(${JSON.stringify(p)})'>Додати в кошик</button>
      </div>
    </article>
  `).join('');
}

function addToCart(product) {
  cart.push(product);
  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartButton();
}

function updateCartButton() {
  const count = cart.length;
  document.getElementById('cart-button').innerText = `Кошики (${count})`;
} 
