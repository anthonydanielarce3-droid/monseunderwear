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

// URL de tu Google Apps Script
const GOOGLE_SHEETS_URL = "https://script.google.com/macros/s/AKfycbyNImy9OHnr2uWJ_LZGYKFTL6VjsZDZIJYDtyuupZIgANnkslBcK7s84A1BopAmHxRf1Q/exec";

// Obtener fecha actual
function getToday() {
  const hoy = new Date();
  return hoy.toLocaleDateString("es-EC");
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

// Renderizar carrito con botón de quitar ❌
function renderCart() {
  cartItems.innerHTML = "";
  let total = 0;

  cart.forEach((item, index) => {
    const li = document.createElement("li");
    li.className = "list-group-item d-flex justify-content-between align-items-center";

    // Texto del producto
    const text = document.createElement("span");
    text.textContent = `${item.name} (x${item.quantity})`;

    // Contenedor derecho: precio + botón ❌
    const right = document.createElement("div");
    right.className = "d-flex align-items-center";

    const price = document.createElement("span");
    price.textContent = `$${(item.price * item.quantity).toFixed(2)}`;

    const removeBtn = document.createElement("button");
    removeBtn.textContent = "❌";
    removeBtn.className = "btn btn-sm btn-danger ms-2";
    removeBtn.addEventListener("click", () => {
      cart.splice(index, 1);   // quitar del array
      renderCart();            // refrescar carrito
      mostrarFormulario();     // refrescar formulario
    });

    right.appendChild(price);
    right.appendChild(removeBtn);

    li.appendChild(text);
    li.appendChild(right);
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
  } else {
    checkoutForm.style.display = "none"; // ocultar si ya no hay productos
  }
}

// Guardar en Google Sheets al pagar
document.getElementById("banco-btn").addEventListener("click", function(e) {
  e.preventDefault(); // Evitar abrir el banco inmediatamente

  if (cart.length === 0) {
    alert("⚠️ El carrito está vacío.");
    return;
  }

  const datos = {
    fecha: fechaInput.value,
    cliente: clienteInput.value,
    email: emailInput.value,
    celular: celularInput.value,
    productos: productosInput.value,
    total: totalInput.value
  };

  fetch(GOOGLE_SHEETS_URL, {
    method: "POST",
    body: JSON.stringify(datos)
  })
  .then(res => res.json())
  .then(data => {
    console.log("Guardado en Google Sheets:", data);
    // abrir el banco en una nueva pestaña
    window.open("https://ahorita.bancodeloja.fin.ec/pay?FC2376178369416F947D7E0BCA9CC7F408C5F41D", "_blank");
  })
  .catch(err => console.error("Error:", err));
});
