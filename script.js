const cart = [];

// Botones "Agregar al carrito"
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

    // Mostrar formulario al agregar
    openCheckoutForm();
  });
});

// Función para abrir el modal con info del carrito
function openCheckoutForm() {
  const fecha = new Date().toLocaleString();
  const productos = cart.map(item => `${item.name} (x${item.quantity})`).join(", ");
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2);

  document.getElementById("fecha").value = fecha;
  document.getElementById("productos").value = productos;
  document.getElementById("total").value = `$${total}`;

  const modal = new bootstrap.Modal(document.getElementById("checkoutModal"));
  modal.show();
}

// Manejo de envío del formulario
document.getElementById("checkoutForm").addEventListener("submit", function(e) {
  e.preventDefault();

  const data = {
    fecha: document.getElementById("fecha").value,
    cliente: document.getElementById("cliente").value,
    email: document.getElementById("email").value,
    celular: document.getElementById("celular").value,
    productos: document.getElementById("productos").value,
    total: document.getElementById("total").value
  };

  // Enviar datos a Google Sheets (si ya tienes tu App Script)
  fetch("URL_DE_TU_WEBAPP_DE_GOOGLE_SHEETS", {
    method: "POST",
    body: JSON.stringify(data)
  });

  // Redirigir al banco para pagar
  window.open("https://ahorita.bancodeloja.fin.ec/pay?FC2376178369416F947D7E0BCA9CC7F408C5F41D", "_blank");
});

