const cart = [];
const cartItems = document.getElementById("cart-items");
const cartTotal = document.getElementById("cart-total");
const checkoutForm = document.getElementById("checkout-form");
const fechaInput = document.getElementById("fecha");
const productosInput = document.getElementById("productos");
const totalInput = document.getElementById("total");

// Capturar la fecha de hoy
function getToday() {
  const hoy = new Date();
  return hoy.toLocaleDateString("es-EC", { year: "numeric", month: "2-digit", day: "2-digit" });
}

// Agregar producto al carrito
document.querySelectorAll(".add-to-cart").forEach(button => {
  button.addEventListener("click", () => {
    const name = button.getAttribute("data-name");
    const price = parseFloat(button.getAttribute("data-price"));
    const quantity = parseInt(button.previousElementSibling.value);

    const existingItem = cart.find(item => item.name === name);
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.push({ name, price, quantity });
    }

    renderCart();
    mostrarFormulario();
  });
});

// Renderizar carrito
function renderCart() {
  cartItems.innerHTML = "";
  let total = 0;
  cart.forEach(item => {
    const li = document.createElement("li");
    li.className = "list-group-item d-flex justify-content-between align-items-center";
    li.textContent = `${item.name} (x${item.quantity})`;
    const span = document.createElement("span");
    span.textContent = `$${(item.price * item.quantity).toFixed(2)}`;
    li.appendChild(span);
    cartItems.appendChild(li);
    total += item.price * item.quantity;
  });
  cartTotal.textContent = total.toFixed(2);
}

// Mostrar formulario con datos
function mostrarFormulario() {
  if (cart.length > 0) {
    checkoutForm.style.display = "block";
    fechaInput.value = getToday();
    productosInput.value = cart.map(item => `${item.name} x${item.quantity}`).join(", ");
    totalInput.value = `$${cart.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2)}`;
  }
}
