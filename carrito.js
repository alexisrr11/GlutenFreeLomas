//Modal cart
const btnCarrito = document.getElementById("boton-carrito");
const carrito = document.getElementById("carrito");
const contadorCarrito = document.getElementById("cart-count");
const btnWhatsapp = document.getElementById("btn-whatsapp");

btnCarrito.addEventListener("click", () => {
  carrito.classList.toggle("hidden")
});

// Renderizar carrito
export function renderCart() {
  const carritoContainer = document.getElementById("en-carrito");
  const totalContainer = document.getElementById("total");
  carritoContainer.innerHTML = "";
  totalContainer.innerHTML = "";

  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  contadorCarrito.textContent = cart.length;

  // ✅ Mostrar u ocultar el botón según el carrito
  if (cart.length > 0) {
    btnWhatsapp.classList.remove("hidden");
  } else {
    btnWhatsapp.classList.add("hidden");
  }

  if (cart.length === 0) {
    carritoContainer.innerHTML = "<p>Tu carrito está vacío</p>";
    totalContainer.innerHTML = "";
    updateWhatsAppButton(); 
    return;
  }
  let total = 0;

  cart.forEach((producto, index) => {
    total += (producto.precio * (producto.cantidad || 1));

    const item = document.createElement("div");
    item.className = "flex justify-around items-center gap-4 py-3 border-b-2 border-red-900 m-2";

    item.innerHTML = `
          <img class="h-16 w-16 rounded-xl m-2" src="${producto.imagen}" alt="${producto.nombre}">
          <div>
            <h3 class="font-semibold">${producto.nombre}</h3>
            <p>$${producto.precio} c/u</p>
          </div>
          <div class="flex gap-2 items-center">
            <button class="bg-gray-200 px-2 rounded" data-action="minus" data-index="${index}">-</button>
            <span>${producto.cantidad || 1}</span>
            <button class="bg-gray-200 px-2 rounded" data-action="plus" data-index="${index}">+</button>
          </div>
          <button class="text-2xl text-red-700" data-action="remove" data-index="${index}">
            <i class='bx bxs-trash'></i>
          </button>
        `;

    carritoContainer.appendChild(item);
  });

  totalContainer.innerHTML = `<h3 class="text-xl font-bold mb-3">Total: $${total}</h3>`;


  // Eventos para los botones
  carritoContainer.querySelectorAll("button").forEach(btn => {
    const index = btn.dataset.index;
    const action = btn.dataset.action;

    btn.addEventListener("click", () => {
      if (action === "remove") removeFromCart(index);
      if (action === "plus") changeQuantity(index, 1);
      if (action === "minus") changeQuantity(index, -1);
    });
  });
  updateWhatsAppButton();
}

// Cambiar cantidad
function changeQuantity(index, delta) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  cart[index].cantidad = (cart[index].cantidad || 1) + delta;
  if (cart[index].cantidad < 1) cart[index].cantidad = 1;

  localStorage.setItem("cart", JSON.stringify(cart));
  renderCart();
}


// Eliminar producto
function removeFromCart(index) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  cart.splice(index, 1);
  localStorage.setItem("cart", JSON.stringify(cart));
  renderCart();
}

export function updateWhatsAppButton() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  if (cart.length === 0) return;

  let total = 0;
  let message = "¡Hola! Quisiera hacer el siguiente pedido:%0A";

  cart.forEach(producto => {
    const cantidad = producto.cantidad || 1;
    const subtotal = producto.precio * cantidad;
    total += subtotal;
    message += `- ${producto.nombre} x${cantidad} = $${subtotal}%0A`;
  });

  message += `Total: $${total}`;

  const whatsappNumber = "5491112345678"; // Tu número de WhatsApp
  const url = `https://wa.me/${whatsappNumber}?text=${message}`;

  btnWhatsapp.href = url;
}


// Inicializar carrito
document.addEventListener("DOMContentLoaded", renderCart);
updateWhatsAppButton();