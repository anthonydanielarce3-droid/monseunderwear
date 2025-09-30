const cart = [];
const cartItems = document.getElementById("cart-items");
const cartTotal = document.getElementById("cart-total");
const checkoutForm = document.getElementById("checkout-form");

// Inputs del formulario
const fechaInput = document.getElementById("fecha");
const clienteInput = document.getElementById("cliente");
const emailInput = document.getElementById("email");
const celularInput = document.getElementById("celular");
const productosInput = document.getElementById("productos");
const totalInput = document.getElementById("total");

// Obtener fecha actual en formato dd/mm/yyyy
function getToday() {
  const hoy = new Date();
  const dia = String(hoy.getDate()).padStart(2, "0");
  const mes = String(hoy.getMonth() + 1).padStart(2, "0");
  const anio = hoy.getFullYear();
  return `${dia}/${mes}/${anio}`;
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

// Mostrar formulario con datos del carrito
function mostrarFormulario() {
  if (cart.length > 0) {
    checkoutForm.style.display = "block";

    fechaInput.value = getToday();
    productosInput.value = cart.map(item => `${item.name} x${item.quantity}`).join(", ");
    totalInput.value = `$${cart.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2)}`;
  }
}
