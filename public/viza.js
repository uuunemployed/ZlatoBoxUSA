const buttonUa = document.getElementById('radio-div');
const buttonCheh = document.getElementById('Cheh-div');

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
    amount = 5;
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
