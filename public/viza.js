const buttonUa = document.getElementById('radio-div');
const buttonCheh = document.getElementById('Cheh-div');

const country = localStorage.getItem('country') || 'UA';
console.log(country);

function isArrayOfStrings(arr) {
  return Array.isArray(arr) && arr.every(item => typeof item === 'string');
}


let currency = "UAH";  // дефолт

if(country == 'UA'){
  toggleBox2();
  currency = "UAH";
} else if (country == 'CZ'){
  toggleBox1();
  currency = "CZK";
}

function toggleBox1() {
  buttonUa.style.display = "none";
  buttonCheh.style.display = (buttonCheh.style.display === "none" || buttonCheh.style.display === "") ? "block" : "none"; 
}

function toggleBox2() {
  buttonCheh.style.display = "none";
  buttonUa.style.display = (buttonUa.style.display === "none" || buttonUa.style.display === "") ? "block" : "none";
}

const button = document.getElementById('btn1');


let initialAmount = parseFloat(localStorage.getItem('cartTotal')) || 0;
let amount = initialAmount;
console.log('Початкова сума для оплати:', amount);

const elem = document.getElementById('radio-p');
const elem2 = document.getElementById('radio-p2');

function radio1() {
    amount = 200;
    localStorage.setItem('cartTotal', amount);
    console.log('radio1 amount =', amount);
    elem.style.display = 'block';
    elem2.style.display = 'none';
}

function radio2() {
    amount = initialAmount; 
    localStorage.setItem('cartTotal', amount);
    console.log('radio2 amount =', amount);
    elem2.style.display = 'block';
    elem.style.display = 'none';
}

const API_KEY = '477c3d7e4d1012b246f9f7039c756e64'; // 🔑 встав свій ключ

const regionSelect = document.getElementById('region');
const citySelect = document.getElementById('city');
const warehouseSelect = document.getElementById('warehouse');

let cityRef = ''; // збереження Ref міста

// 1. Завантаження областей
async function loadRegions() {
  const response = await fetch("https://api.novaposhta.ua/v2.0/json/", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      apiKey: API_KEY,
      modelName: "Address",
      calledMethod: "getAreas",
      methodProperties: {}
    })
  });

  const data = await response.json();

  if (data.success) {
    data.data.forEach(area => {
      const option = document.createElement("option");
      option.value = area.Ref;
      option.textContent = area.Description;
      regionSelect.appendChild(option);
    });
  }
}

// 2. Завантаження міст по області
regionSelect.addEventListener('change', async () => {
  const areaRef = regionSelect.value;
  citySelect.disabled = true;
  warehouseSelect.disabled = true;
  citySelect.innerHTML = '<option>Завантаження міст...</option>';
  warehouseSelect.innerHTML = '<option>Оберіть місто</option>';

  const response = await fetch("https://api.novaposhta.ua/v2.0/json/", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      apiKey: API_KEY,
      modelName: "Address",
      calledMethod: "getCities",
      methodProperties: {
        AreaRef: areaRef
      }
    })
  });

  const data = await response.json();

  citySelect.innerHTML = '<option value="">Оберіть місто</option>';
  if (data.success) {
    data.data.forEach(city => {
      const option = document.createElement("option");
      option.value = city.Ref;
      option.textContent = city.Description;
      citySelect.appendChild(option);
    });
    citySelect.disabled = false;
  }
});

// 3. Завантаження відділень по місту
citySelect.addEventListener('change', async () => {
  const cityRef = citySelect.value;
  warehouseSelect.disabled = true;
  warehouseSelect.innerHTML = '<option>Завантаження відділень...</option>';

  const response = await fetch("https://api.novaposhta.ua/v2.0/json/", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      apiKey: API_KEY,
      modelName: "AddressGeneral",
      calledMethod: "getWarehouses",
      methodProperties: {
        CityRef: cityRef
      }
    })
  });

  const data = await response.json();

  warehouseSelect.innerHTML = '<option value="">Оберіть відділення</option>';
  if (data.success) {
    data.data.forEach(wh => {
      const option = document.createElement("option");
      option.value = wh.SiteKey;
      option.textContent = wh.Description;
      warehouseSelect.appendChild(option);
    });
    warehouseSelect.disabled = false;
  }
});

loadRegions();

const form = document.getElementById('shippingForm');

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const formData = {
    firstName: document.getElementById('name').value.trim(),
    lastName: document.getElementById('surname').value.trim(),
    email: document.getElementById('email').value.trim(),
  };

  const uaBlock = document.getElementById('radio-div');
  const czBlock = document.getElementById('Cheh-div');

  if (uaBlock.style.display === 'block') {
    formData.region = regionSelect.selectedOptions[0]?.textContent || '';
formData.city = citySelect.selectedOptions[0]?.textContent || '';
formData.postOffice = warehouseSelect.selectedOptions[0]?.textContent || '';


    const radioOption = document.querySelector('input[name="group1"]:checked');
    formData.paymentType = radioOption ? radioOption.parentElement.textContent.trim() : 'не вибрано';
  }

  if (czBlock.style.display === 'block') {
    formData.czBranch = document.getElementById('zasilkovna-branch-id').textContent.trim();
  }

  console.log('✅ Дані для localStorage:', formData);

  localStorage.setItem('formData', JSON.stringify(formData)); // важливо!
});

const wayforpay = new Wayforpay();

function startPayment() {
  const cart = JSON.parse(localStorage.getItem('cart')) || [];

  if (cart.length === 0) {
    alert("Кошик порожній!");
    return;
  }

  const productName = cart.map(item => item.name);
  const productCount = cart.map(item => item.quantity || 1);
  const productPrice = cart.map(item => {
    if (country === 'UA') return parseFloat(item.price);
    else if (country === 'CZ') return parseFloat(item.price2);
    else return parseFloat(item.price);  // дефолтна ціна
  });

  fetch("/api/payment", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      amount,
      currency,
      productName,
      productCount,
      productPrice
    })
  })
  .then(res => res.json())
  .then(data => {
    const productName = Array.isArray(data.productName) ? data.productName : [String(data.productName)];
    const productPrice = Array.isArray(data.productPrice) ? data.productPrice : [String(data.productPrice)];
    const productCount = Array.isArray(data.productCount) ? data.productCount : [String(data.productCount)];

    const amount = Number(data.amount).toFixed(2);
    const orderDate = String(data.orderDate);

    wayforpay.run({
      merchantAccount: data.merchantAccount,
      merchantDomainName: data.merchantDomainName,
      authorizationType: "SimpleSignature",
      merchantSignature: data.merchantSignature,
      orderReference: data.orderReference,
      orderDate,
      amount,
      currency: data.currency,
      productName,
      productPrice,
      productCount,
      clientFirstName: data.clientFirstName,
      clientLastName: data.clientLastName,
      clientEmail: data.clientEmail,
      clientPhone: data.clientPhone,
      language: data.language,
    },
    (response) => { console.log("Оплата успішна", response); },
    (response) => { console.log("Оплата відхилена", response); },
    (response) => { console.log("Оплата в обробці", response); });
  })
  .catch(err => console.error("Помилка отримання даних з бекенду:", err));
}








function getCartSummary() {
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  let total = 0;

  if (cart.length === 0) return 'Кошик порожній.';

  const lines = cart.map(item => {
    const quantity = item.quantity || 1;
    const price = parseFloat(item.price);
    total += price * quantity;
    return `🛍 ${item.name} — ${quantity} шт × ${price} грн`;
  });

  lines.push(`\n💰 Загальна сума: ${total.toFixed(2)} грн`);
  return lines.join('\n');
}












