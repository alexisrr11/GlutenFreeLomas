import { renderCart, updateWhatsAppButton } from "./carrito.js";
// Cargar productos desde productos.json
fetch("/productos.json")
    .then(response => response.json())
    .then(data => {
        const saladoContainer = document.getElementById("menu-salado");
        const dulceContainer = document.getElementById("menu-dulce");
        const saladoTitle = document.getElementById("salado");
        const dulceTitle = document.getElementById("dulce");

        // Agrupar por id y luego por categoria
        const grupos = {
            Salados: {},
            Dulces: {}
        };

        data.forEach(producto => {
            const group = producto.id;
            const categoria = producto.categoria;

            if (!grupos[group][categoria]) {
                grupos[group][categoria] = [];
            }
            grupos[group][categoria].push(producto);
        });

        function renderGrupo(container, titleContainer, grupo, titulo, filtro = "Todos") {
            container.innerHTML = ""; // limpiar antes de renderizar
            titleContainer.innerHTML = ""; // limpiar título

            let hayContenido = false;

            Object.keys(grupo).forEach(categoria => {
                if (filtro !== "Todos" && categoria !== filtro) return;

                // Solo si hay productos de esta categoría
                if (grupo[categoria].length > 0) {
                    hayContenido = true;

                    // Título general del grupo
                    if (!titleContainer.innerHTML) {
                        titleContainer.innerHTML = `
                          <h4 class="text-2xl md:text-3xl font-bold text-red-700 mb-8 border-b-4 border-red-600 pb-2">${titulo}</h4>
                        `;
                    }

                    // Contenedor de categoría
                    const categoriaSection = document.createElement("div");
                    categoriaSection.className = "mb-12";

                    // Título de categoría
                    const categoriaTitle = document.createElement("h5");
                    categoriaTitle.className = "text-xl md:text-2xl font-semibold text-gray-700 mb-6";
                    categoriaTitle.textContent = categoria;
                    categoriaSection.appendChild(categoriaTitle);

                    // Grid de productos
                    const catContainer = document.createElement("div");
                    catContainer.className = "grid md:grid-cols-3 gap-8";
                    categoriaSection.appendChild(catContainer);

                    // Agregar productos
                    grupo[categoria].forEach(producto => {
                        const card = document.createElement("div");
                        card.className = "bg-white shadow-lg rounded-xl overflow-hidden hover:scale-105 transform transition-all duration-300";

                        card.innerHTML = `
                          <img src="${producto.imagen}" alt="${producto.nombre}" class="w-full h-48 object-cover">
                          <div class="p-4">
                            <h4 class="text-lg md:text-xl font-semibold">${producto.nombre}</h4>
                            <p class="text-gray-600">${producto.descripcion}</p>
                            <div class="flex justify-around pt-5">
                                <p class="mt-2 font-bold text-red-700">$${producto.precio}</p>
                                <button id="btn-${producto.N}" 
                                  class="bg-red-700 text-white rounded-xl p-2 focus:outline-none">
                                  Agregar al pedido
                                </button>
                            </div>
                          </div>
                        `;

                        catContainer.appendChild(card);
                        // 👉 Capturamos el botón
                        const btn = card.querySelector(`#btn-${producto.N}`);
                        btn.addEventListener("click", () => {
                            addToCart(producto);
                        });
                    });

                    container.appendChild(categoriaSection);

                    function addToCart(producto) {
                        let cart = JSON.parse(localStorage.getItem("cart")) || [];
                        // Buscar si el producto ya existe en el carrito
                        const existingProduct = cart.find(item => item.N === producto.N);
                        if (existingProduct) {
                            // Si ya está, aumenta su cantidad
                            existingProduct.cantidad = (existingProduct.cantidad || 1) + 1;
                        } else {
                            // Si no está, lo agrega con cantidad = 1
                            producto.cantidad = 1;
                            cart.push(producto);
                        }
                        // Guardar carrito actualizado
                        localStorage.setItem("cart", JSON.stringify(cart));
                        alert(`✅ ${producto.nombre} agregado al carrito`);
                        renderCart();
                        updateWhatsAppButton();
                    }

                }
            });

            // Si no hay contenido, oculta el título
            if (!hayContenido) {
                titleContainer.innerHTML = "";
            }
        }

        // Escuchar clicks en los botones de filtro
        document.querySelectorAll(".filtro").forEach(btn => {
            btn.addEventListener("click", () => {
                const filtro = btn.getAttribute("data-filtro");

                if (filtro === "Todos") {
                    // Renderizar ambos grupos completos
                    renderGrupo(saladoContainer, saladoTitle, grupos.Salados, "Salados");
                    renderGrupo(dulceContainer, dulceTitle, grupos.Dulces, "Dulces");
                } else {
                    // Verificar si el filtro pertenece a Salados o a Dulces
                    if (grupos.Salados[filtro]) {
                        renderGrupo(saladoContainer, saladoTitle, grupos.Salados, "Salados", filtro);
                        dulceContainer.innerHTML = "";
                        dulceTitle.innerHTML = "";
                    } else if (grupos.Dulces[filtro]) {
                        renderGrupo(dulceContainer, dulceTitle, grupos.Dulces, "Dulces", filtro);
                        saladoContainer.innerHTML = "";
                        saladoTitle.innerHTML = "";
                    }
                }
            });
        });

        // Render inicial → mostrar todo
        renderGrupo(saladoContainer, saladoTitle, grupos.Salados, "Salados");
        renderGrupo(dulceContainer, dulceTitle, grupos.Dulces, "Dulces");
    })
    .catch(error => console.error("Error al cargar el menú:", error));


