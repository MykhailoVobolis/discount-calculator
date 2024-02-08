const calculateForm = document.querySelector("form");
const cleanForm = document.querySelector("[data-destroy]");
const title = document.querySelector(".discount-value");
const localStorageKey = "discount-form-state";

const savedLocalStorageKey = localStorage.getItem(localStorageKey);
const discount = JSON.parse(savedLocalStorageKey) ?? {};

const clientSumOrders = calculateForm.elements.sumorders;
const clientCurrentOrder = calculateForm.elements.currentorder;
const clientPayment = calculateForm.elements.payment;
const clientDelyvery = calculateForm.elements.delivery;
const clientQuantity = calculateForm.elements.quantity;

// Підставлення даних з локального сховища при оновлені сторінки
clientSumOrders.value = discount.sumorders ?? "";
clientCurrentOrder.value = discount.currentorder ?? "";
clientPayment.value = discount.payment ?? "";
clientDelyvery.value = discount.delivery ?? "";
clientQuantity.value = discount.quantity ?? "";

// Запис введених даних у локальне сховище
calculateForm.addEventListener("input", recordLocalStorage);
function recordLocalStorage(event) {
  discount.sumorders = calculateForm.elements.sumorders.value;
  discount.currentorder = calculateForm.elements.currentorder.value;
  discount.payment = calculateForm.elements.payment.value;
  discount.delivery = calculateForm.elements.delivery.value;
  discount.quantity = calculateForm.elements.quantity.value;

  // Автоматичне встановлення нуль днів відтермінування при попередній оплаті
  if (clientPayment.value === "передоплата") {
    calculateForm.elements.quantity.value = 0;
  }
  localStorage.setItem(localStorageKey, JSON.stringify(discount));
}

// Дія при натисканні кнопки submit
calculateForm.addEventListener("submit", onClick);

function onClick(event) {
  event.preventDefault();
  let discountSize = 0;

  // Порівняння сумм обсягу замовлень за попередній місяць та поточного замовлення
  let totalOrder = 0;

  if (Number(clientSumOrders.value) > Number(clientCurrentOrder.value)) {
    totalOrder = clientSumOrders.value;
  } else {
    totalOrder = clientCurrentOrder.value;
  }

  // Знижка за обсяг замовлень попереднього місяця або поточного замовлення
  if (totalOrder >= 10000 && totalOrder < 30000) {
    discountSize += 3;
  } else if (totalOrder >= 30000 && totalOrder < 50000) {
    discountSize += 5;
  } else if (totalOrder >= 50000 && totalOrder < 70000) {
    discountSize += 7;
  } else if (totalOrder >= 70000) {
    discountSize += 9;
  }

  // Знижка за передоплату
  if (clientPayment.value === "передоплата") {
    discountSize += 1;
    // calculateForm.elements.quantity.value = "0";
    // quantityDays.value = 0;
  }

  // Знижка за самовивоз товару зі складу
  if (clientDelyvery.value === "самовивіз") {
    discountSize += 3;
  }

  // Антизнижка за подовження строку сплати за товар
  if (clientQuantity.value <= 14) {
    discountSize += 0;
  } else if (clientQuantity.value > 14 && clientQuantity.value <= 21) {
    discountSize -= 1;
  } else if (clientQuantity.value > 21 && clientQuantity.value <= 30) {
    discountSize -= 2;
  } else {
    return alert("Будь ласка, введіть коректне значення. Максимальний строк відтермінування сплати за товар 30 днів");
  }

  title.innerHTML = `${discountSize}`;
}

// Очищення форми, localStorage та результату
cleanForm.addEventListener("click", cleanClick);
function cleanClick(event) {
  title.innerHTML = ``;
  localStorage.removeItem(localStorageKey);
  calculateForm.reset();
}
