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

  // actualizar link del botón (opcional, solo informativo)
  const bancoBtn = document.getElementById("banco-btn");
  bancoBtn.href = "https://ahorita.bancodeloja.fin.ec/pay?FC2376178369416F947D7E0BCA9CC7F408C5F41D";
}
