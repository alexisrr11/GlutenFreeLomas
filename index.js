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
