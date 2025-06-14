const buttonUa = document.getElementById('radio-div');
const buttonCheh = document.getElementById('Cheh-div');

const country = localStorage.getItem('country') || 'UA';

if(country == 'UA'){
  toggleBox2()
} else if (country == 'CZ'){
  toggleBox1()
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


