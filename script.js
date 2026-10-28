
/* ==========================================
   JAE NAIL HOUSE — JAVASCRIPT
========================================== */

// ==========================================
// CONFIGURACIÓN
// ==========================================

const WHATSAPP_NUMBER = "525516383938";
const PHOTO_INTERVAL = 5000;

const form = document.getElementById("booking-form");
const service = document.getElementById("service");
const designInput = document.getElementById("design");
const dateInput = document.getElementById("date");
const timeInput = document.getElementById("time");
const bookingStatus = document.getElementById("booking-status");
const clientName = document.getElementById("client-name");
const phone = document.getElementById("phone");

// ==========================================
// CATÁLOGO DE DISEÑOS
// ==========================================

// Todos los archivos están dentro de assets/.
// Las categorías se muestran en este mismo orden.
//
// Para agregar fotografías nuevas, solo tienes
// que añadir el nombre de la imagen a "photos".

const nailCategories = [
  {
    title: "Acrílico",
    description:
      "Extensiones resistentes con forma, longitud y diseño personalizados.",
    price: 700,
    bookingService: "Acrílico y Soft Gel",
    photos: [
      "acrílico.png",
      "acrílico2.png"
    ]
  },

  {
    title: "Baby Boomer",
    description:
      "Degradado delicado entre tonos nude y blanco para un acabado elegante.",
    bookingService: "Nail Art",
    photos: [
      "babyboomer.png",
      "babyboomer2.png"
    ]
  },

  {
    title: "Acetato",
    description:
      "Efectos brillantes y diseños con reflejos únicos.",
    bookingService: "Nail Art",
    photos: [
      "acetato.png",
      "acetato2.png"
    ]
  },

  {
    title: "Aurora",
    description:
      "Acabado luminoso con reflejos perlados y efecto tornasol.",
    bookingService: "Nail Art",
    photos: [
      "aurora.png"
    ]
  },

  {
    title: "Tintas de alcohol",
    description:
      "Diseños artísticos con colores y efectos fluidos.",
    bookingService: "Nail Art",
    photos: [
      "tintas de alcohol.png",
      "tintas de alcohol2.png"
    ]
  },

  {
    title: "Carey",
    description:
      "Diseño inspirado en el efecto carey, sofisticado y atemporal.",
    bookingService: "Nail Art",
    photos: [
      "carey.png",
      "carey2.png"
    ]
  },

  {
    title: "Brillitos",
    description:
      "Detalles brillantes que aportan luz y elegancia a tus uñas.",
    bookingService: "Nail Art",
    photos: [
      "brillitos.png"
    ]
  },

  {
    title: "Shining",
    description:
      "Efecto luminoso para unas uñas delicadas y sofisticadas.",
    bookingService: "Nail Art",
    photos: [
      "shining.png"
    ]
  },

  {
    title: "Puntitos",
    description:
      "Diseño minimalista con pequeños detalles personalizados.",
    bookingService: "Nail Art",
    photos: [
      "puntitos.png",
      "puntitos2.png"
    ]
  },

  {
    title: "Relieve",
    description:
      "Diseños con textura y detalles tridimensionales.",
    bookingService: "Nail Art",
    photos: [
      "relieve.png",
      "relieve2.png",
      "relieve3.png"
    ]
  },

  {
    title: "Stickers",
    description:
      "Decoraciones creativas para personalizar tu manicura.",
    bookingService: "Nail Art",
    photos: [
      "stickers.png",
      "stickers2.png",
      "stickers3.png"
    ]
  },

  {
    title: "Soft Gel",
    description:
      "Extensiones ligeras con un acabado natural y elegante.",
    price: 700,
    bookingService: "Acrílico y Soft Gel",
    photos: [
      "softgel.png",
      "softgel2.png"
    ]
  },

  {
    title: "Vitamina",
    description:
      "Tratamiento enfocado en el cuidado de tus uñas.",
    price: 100,
    bookingService: "Vitamina",
    photos: [
      "vitamina.png",
      "vitamina2.png"
    ]
  },

  {
    title: "Polygel",
    description:
      "Estructura ligera y resistente para un set personalizado.",
    price: 750,
    bookingService: "Polygel",
    photos: [
      "poligel2.png"
    ]
  }
];

// ==========================================
// RUTAS DE FOTOGRAFÍAS
// ==========================================

function photoPath(filename) {
  return "assets/" + encodeURIComponent(filename);
}

// Compatibilidad con archivos con acentos.
// Si no carga la primera versión, intenta
// la normalización alternativa del nombre.

function setPhotoWithFallback(image, filename) {
  const variants = [
    filename,
    filename.normalize("NFD"),
    filename.normalize("NFC")
  ];

  const uniqueVariants = [...new Set(variants)];
  let attempt = 0;

  image.onerror = function () {
    attempt++;

    if (attempt < uniqueVariants.length) {
      image.src = photoPath(uniqueVariants[attempt]);
    } else {
      image.onerror = null;
      image.alt = "Fotografía pendiente: " + filename;
      image.style.display = "none";
    }
  };

  image.style.display = "block";
  image.src = photoPath(uniqueVariants[0]);
}

// ==========================================
// WHATSAPP
// ==========================================

function whatsappURL(message) {
  return (
    "https://wa.me/" +
    WHATSAPP_NUMBER +
    "?text=" +
    encodeURIComponent(message)
  );
}

// ==========================================
// CARRUSEL ÚNICO DE SERVICIOS
// ==========================================

function createNailGalleries() {
  const container =
    document.getElementById("nail-collections");

  if (!container) return;

  container.replaceChildren();

  const wrapper = document.createElement("div");
  wrapper.className = "nail-carousel";

  const track = document.createElement("div");
  track.className = "nail-track";
  track.tabIndex = 0;
  track.setAttribute(
    "aria-label",
    "Carrusel de servicios y diseños de JAE"
  );

  const prev = document.createElement("button");
  prev.type = "button";
  prev.className = "nail-arrow";
  prev.textContent = "←";
  prev.setAttribute(
    "aria-label",
    "Ver servicios anteriores"
  );

  const next = document.createElement("button");
  next.type = "button";
  next.className = "nail-arrow";
  next.textContent = "→";
  next.setAttribute(
    "aria-label",
    "Ver siguientes servicios"
  );

  nailCategories.forEach(category => {

    // TARJETA

    const card = document.createElement("article");
    card.className = "nail-category-card";

    // CONTENEDOR DE IMAGEN

    const imageBox = document.createElement("div");
    imageBox.className = "nail-image";

    const image = document.createElement("img");
    image.alt = "Diseño " + category.title;
    image.loading = "lazy";
    image.decoding = "async";

    let currentImage = 0;

    // INDICADORES

    const indicators = document.createElement("div");
    indicators.className = "nail-indicators";

    const dots = category.photos.map(() => {
      const dot = document.createElement("span");
      dot.className = "nail-dot";
      indicators.appendChild(dot);
      return dot;
    });

    // CAMBIAR FOTOGRAFÍA

    function updateImage() {
      const filename = category.photos[currentImage];

      image.alt =
        category.title +
        " - fotografía " +
        (currentImage + 1);

      setPhotoWithFallback(image, filename);

      dots.forEach((dot, index) => {
        dot.classList.toggle(
          "active",
          index === currentImage
        );
      });
    }

    updateImage();

    // CAMBIO AUTOMÁTICO CADA 5 SEGUNDOS
    // ÚNICAMENTE SI HAY MÁS DE UNA FOTO

    if (category.photos.length > 1) {
      setInterval(() => {
        if (document.hidden) return;

        currentImage =
          (currentImage + 1) %
          category.photos.length;

        updateImage();

      }, PHOTO_INTERVAL);
    }

    imageBox.appendChild(image);

    // TÍTULO

    const title = document.createElement("h3");
    title.textContent = category.title;

    // DESCRIPCIÓN

    const description = document.createElement("p");
    description.className = "nail-description";
    description.textContent = category.description;

    // PRECIO, SOLO SI ESTÁ DEFINIDO

    let priceElement = null;

    if (category.price !== undefined) {
      priceElement = document.createElement("p");
      priceElement.className = "nail-price";

      const priceLabel = document.createTextNode(
        "Desde "
      );

      const priceValue = document.createElement("strong");

      priceValue.textContent =
        "$" + category.price.toLocaleString("es-MX");

      priceElement.append(priceLabel, priceValue);
    } else {
      priceElement = document.createElement("p");
      priceElement.className = "nail-price";
      priceElement.textContent = "Cotiza tu diseño";
    }

    // BOTÓN DE RESERVACIÓN WHATSAPP

    const reserve = document.createElement("a");

    reserve.className = "nail-reserve";
    reserve.textContent = "Reservar";
    reserve.target = "_blank";
    reserve.rel = "noopener noreferrer";

    const message =
`Hola JAE ✨

Me gustaría solicitar una cita.

Diseño que me interesa: ${category.title}

¿Me podrían confirmar el precio y los horarios disponibles?

Muchas gracias.`;

    reserve.href = whatsappURL(message);

    // CONSTRUIR TARJETA

    card.append(
      imageBox,
      title,
      indicators,
      description,
      priceElement,
      reserve
    );

    track.appendChild(card);
  });

  // ========================================
  // FLECHAS DEL CARRUSEL
  // ========================================

  function getStep() {
    const card = track.querySelector(
      ".nail-category-card"
    );

    if (!card) return track.clientWidth;

    const gap =
      parseFloat(
        getComputedStyle(track).columnGap
      ) || 0;

    return (
      card.getBoundingClientRect().width + gap
    );
  }

  function scrollCarousel(direction) {
    track.scrollBy({
      left: getStep() * direction,
      behavior: "smooth"
    });
  }

  prev.addEventListener("click", () => {
    scrollCarousel(-1);
  });

  next.addEventListener("click", () => {
    scrollCarousel(1);
  });

  // ACTIVAR O DESACTIVAR FLECHAS

  function updateArrows() {
    const maxScroll =
      track.scrollWidth - track.clientWidth;

    prev.disabled = track.scrollLeft <= 2;

    next.disabled =
      track.scrollLeft >= maxScroll - 2;
  }

  track.addEventListener(
    "scroll",
    updateArrows,
    { passive: true }
  );

  window.addEventListener("resize", updateArrows);

  wrapper.append(prev, track, next);
  container.appendChild(wrapper);

  requestAnimationFrame(updateArrows);
}

// ==========================================
// FECHA ACTUAL EN MÉXICO
// ==========================================

function todayInMexico() {
  const parts = new Intl.DateTimeFormat(
    "en-US",
    {
      timeZone: "America/Mexico_City",
      year: "numeric",
      month: "2-digit",
      day: "2-digit"
    }
  ).formatToParts(new Date());

  const getPart = type =>
    parts.find(part => part.type === type).value;

  return (
    getPart("year") +
    "-" +
    getPart("month") +
    "-" +
    getPart("day")
  );
}

// ==========================================
// MENSAJES DEL FORMULARIO
// ==========================================

function setStatus(message, error = false) {
  if (!bookingStatus) return;

  bookingStatus.textContent = message;

  bookingStatus.style.color = error
    ? "#9a3830"
    : "#947044";
}

// ==========================================
// ACTUALIZAR HORARIOS
// ==========================================

function updateTimes() {
  if (!dateInput || !timeInput) return;

  timeInput.replaceChildren();

  timeInput.add(
    new Option("Selecciona un horario", "")
  );

  timeInput.disabled = true;

  if (!dateInput.value) {
    setStatus("");
    return;
  }

  // EVITAR FECHAS PASADAS

  if (dateInput.value < todayInMexico()) {
    setStatus(
      "Selecciona una fecha de hoy en adelante.",
      true
    );
    return;
  }

  const [year, month, day] =
    dateInput.value.split("-").map(Number);

  const weekday = new Date(
    Date.UTC(year, month - 1, day)
  ).getUTCDay();

  // NO SE TRABAJA LOS DOMINGOS

  if (weekday === 0) {
    setStatus(
      "Los domingos no hay atención. Elige otro día.",
      true
    );
    return;
  }

  // LUNES A VIERNES 10:00 - 19:00
  // SÁBADO 09:00 - 15:00

  const first = weekday === 6 ? 9 : 10;
  const last = weekday === 6 ? 14 : 18;

  for (let hour = first; hour <= last; hour++) {
    const label =
      String(hour).padStart(2, "0") + ":00";

    timeInput.add(new Option(label, label));
  }

  timeInput.disabled = false;
  setStatus("");
}

// ==========================================
// FORMULARIO DE RESERVACIONES
// ==========================================

function initBookingForm() {
  if (
    !form ||
    !service ||
    !dateInput ||
    !timeInput ||
    !clientName ||
    !phone
  ) {
    return;
  }

  dateInput.min = todayInMexico();

  dateInput.addEventListener(
    "change",
    updateTimes
  );

  form.addEventListener("submit", event => {
    event.preventDefault();

    dateInput.min = todayInMexico();

    if (!form.reportValidity()) return;

    // VALIDAR HORARIOS

    if (
      dateInput.value < todayInMexico() ||
      timeInput.disabled ||
      !timeInput.value
    ) {
      setStatus(
        "Selecciona una fecha y un horario válidos.",
        true
      );
      return;
    }

    // FORMATO DE FECHA LEGIBLE

    const formattedDate = new Date(
      dateInput.value + "T12:00:00"
    ).toLocaleDateString("es-MX", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric"
    });

    // DISEÑO OPCIONAL

    const selectedDesign =
      designInput?.value.trim() || "Sin especificar";

    // MENSAJE DE WHATSAPP

    const message =
`Hola JAE ✨

Quisiera solicitar una cita.

Servicio: ${service.value}
Diseño de inspiración: ${selectedDesign}

Fecha: ${formattedDate}
Horario: ${timeInput.value}

Nombre: ${clientName.value.trim()}
Teléfono: ${phone.value.trim()}

Quedo pendiente de la confirmación de disponibilidad.

¡Gracias!`;

    const url = whatsappURL(message);

    // ABRIR WHATSAPP

    window.open(
      url,
      "_blank",
      "noopener,noreferrer"
    );

    setStatus(
      "Se abrió WhatsApp. Envía el mensaje para solicitar tu cita."
    );
  });
}

// ==========================================
// INICIALIZAR PÁGINA
// ==========================================

document.addEventListener(
  "DOMContentLoaded",
  () => {
    createNailGalleries();
    initBookingForm();
  }
);
