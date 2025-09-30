const cart = [];
const cartItems = document.getElementById("cart-items");
const cartTotal = document.getElementById("cart-total");

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
  });
});

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

// PayPal Checkout
paypal.Buttons({
  createOrder: function(data, actions) {
    const total = document.getElementById("cart-total").textContent;
    return actions.order.create({
      purchase_units: [{
        amount: {
          value: total
        }
      }]
    });
  },
  onApprove: function(data, actions) {
    return actions.order.capture().then(function(details) {
      alert("✅ Gracias " + details.payer.name.given_name + ", tu compra fue exitosa!");

      // Enviar pedido a Google Sheets
      const productos = cart.map(item => `${item.name} x${item.quantity}`).join(", ");
      const total = document.getElementById("cart-total").textContent;

      fetch("URL_DE_TU_WEBAPP_DE_GOOGLE_SHEETS", {
        method: "POST",
        body: JSON.stringify({
          cliente: details.payer.name.given_name + " " + details.payer.name.surname,
          email: details.payer.email_address,
          productos: productos,
          total: total
        })
      });

      // Vaciar carrito después de la compra
      cart.length = 0;
      renderCart();
    });
  }
}).render('#paypal-button-container');