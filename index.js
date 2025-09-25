//Navegación móvil
const toggle = document.getElementById("menu-toggle");
const mobileMenu = document.getElementById("mobile-menu");

toggle.addEventListener("click", () => {
    mobileMenu.classList.toggle("hidden");
});

// Array de slides
const slides = [
    {
        image: "https://media.minutouno.com/p/3e5e90489ce6690492e48e6ffce25ec4/adjuntos/150/imagenes/040/973/0040973430/pizza-y-empanadas.jpg",
        title: "Las mejores pizzas y empanadas libres de gluten",
        text: "Sabores únicos, 100% sin gluten, 100% deliciosas."
    },
    {
        image: "https://img77.uenicdn.com/image/upload/v1554311472/category/shutterstock_190767974.jpg",
        title: "Dulces irresistibles sin gluten",
        text: "Donas, churros y cuadrados dulces para todos los gustos."
    }
];

let currentSlide = 0;
const hero = document.getElementById("hero");
const heroTitle = document.getElementById("hero-title");
const heroText = document.getElementById("hero-text");

// Función para mostrar el slide
function showSlide(index) {
    const slide = slides[index];
    hero.style.backgroundImage = `url('${slide.image}')`;
    heroTitle.textContent = slide.title;
    heroText.textContent = slide.text;
}

// Inicializar primer slide
showSlide(currentSlide);

setInterval(() => {
    currentSlide = (currentSlide + 1) % slides.length;
    showSlide(currentSlide);
}, 5000);

//Modales y ofertas
const modal = document.getElementById("ofertasModal");
const openModal = document.getElementById("openModal");
const closeModal = document.getElementById("closeModal");

const slider = document.getElementById("slider");
const nextBtn = document.getElementById("next");
const prevBtn = document.getElementById("prev");

let index = 0;

openModal.addEventListener("click", () => modal.classList.remove("hidden"));
closeModal.addEventListener("click", () => modal.classList.add("hidden"));
modal.addEventListener("click", (e) => { if (e.target === modal) modal.classList.add("hidden"); });

nextBtn.addEventListener("click", () => {
    if (index < 2) index++;
    else index = 0;
    slider.style.transform = `translateX(-${index * 100}%)`;
});

prevBtn.addEventListener("click", () => {
    if (index > 0) index--;
    else index = 2;
    slider.style.transform = `translateX(-${index * 100}%)`;
});

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
                            <p class="mt-2 font-bold text-red-700">$${producto.precio}</p>
                          </div>
                        `;

                        catContainer.appendChild(card);
                    });

                    container.appendChild(categoriaSection);
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





//Ver ofertas
window.onload = function () {
    const modal = document.getElementById("modal-ofertas");
    const listaOfertas = document.getElementById("lista-ofertas");
    const contenedor = document.getElementById("contenedor-ofertas");
    const titulo = document.getElementById("titulo-ofertas");
    const btnConsultaWp = document.getElementById("botonConsultaWhatsapp");

    // Array de ofertas por día
    const ofertasPorDia = {
        1: [
            "🍕 Lunes: 20% OFF en Pizza Margarita sin gluten",
            "💳 Descuento del 15% con Visa en empanadas"
        ],
        2: [
            "🥟 Martes: 2x1 en Empanadas de Jamón y Queso sin gluten",
            "📲 Mercado Pago 15% OFF en cualquier docena de empanadas"
        ],
        3: [
            "🍩 Miércoles: 25% OFF en Donas sin gluten",
            "🏦 Santander Río 10% sin interés en combos de churros + café"
        ],
        4: [
            "🥟 Jueves: Empanadas Caprese al 30% pagando en efectivo",
            "💳 15% OFF con tarjetas Visa en pizzas veganas"
        ],
        5: [
            "🍕 Viernes: 2x1 en Pizza Fugazzeta sin gluten",
            "🥐 20% OFF en Medialunas sin gluten (promo exclusiva)"
        ],
        6: [
            "🥐 Sábado: Medialunas + Café 10% OFF en efectivo",
            "🍩 Churros con dulce de leche 5% OFF con débito Visa"
        ]
        // Domingo sin ofertas
    };

    // Obtener el día actual
    const diaHoy = new Date().getDay();

    //  Llenar el MODAL
    if (listaOfertas) {
        if (ofertasPorDia[diaHoy]) {
            ofertasPorDia[diaHoy].forEach(oferta => {
                const li = document.createElement("li");
                li.textContent = oferta;
                listaOfertas.appendChild(li);
            });
        } else {
            const li = document.createElement("li");
            li.textContent = "No tenemos ofertas especiales para hoy, vuelva mañana. Lo esperamos😊";
            listaOfertas.appendChild(li);
            btnConsultaWp.classList.add("hidden");
        }

        // Mostrar modal automáticamente
        modal.classList.remove("hidden");
    }

    // Llenar la SECCIÓN DE OFERTAS
    if (contenedor && titulo) {
        contenedor.innerHTML = "";

        if (ofertasPorDia[diaHoy]) {
            const diasSemana = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
            titulo.textContent = `Ofertas del ${diasSemana[diaHoy]}`;

            ofertasPorDia[diaHoy].forEach((oferta) => {
                const card = document.createElement("div");
                card.className = "relative bg-cover rounded-xl shadow-lg p-6 text-center text-white";

                // Overlay negro
                const overlay = document.createElement("div");
                overlay.className = "absolute inset-0 bg-green-50 rounded-xl my-1";
                card.appendChild(overlay);

                // Texto oferta
                const content = document.createElement("div");
                content.className = "relative z-10 text-black";
                const p = document.createElement("p");
                p.textContent = oferta;
                content.appendChild(p);

                card.appendChild(content);
                contenedor.appendChild(card);
            });
        } else {
            titulo.textContent = "No tenemos ofertas especiales para hoy";
            const msg = document.createElement("p");
            msg.className = "text-center text-gray-600 col-span-3";
            msg.textContent = "Vuelve mañana para ver nuestras promociones 😊";
            contenedor.appendChild(msg);
        }
    }

};
