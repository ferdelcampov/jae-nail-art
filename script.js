
/* ==========================================
   JAE NAIL HOUSE — JAVASCRIPT COMPLETO
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

// Las imágenes están dentro de assets/.
// Para agregar una nueva fotografía,
// solamente agrega su nombre en "photos".

const nailCategories = [
  {
    title: "Acrílico",
    description:
      "Extensiones resistentes con forma y longitud personalizadas.",
    price: 700,
    bookingService: "Acrílico y Soft Gel",
    photos: [
      "acrílico2.png"
    ]
  },

  {
    title: "Aurora",
    description:
      "Reflejos nacarados y efectos luminosos con acabado tornasol.",
    bookingService: "Nail Art",
    photos: [
      "acetato.png",
      "aurora.png",
      "cromados.png"
    ]
  },

  {
    title: "Baby Boomer",
    description:
      "Degradados delicados y difuminados en tonos suaves.",
    bookingService: "Nail Art",
    photos: [
      "babyboomer.png",
      "difuminado.png"
    ]
  },

  {
    title: "Carey",
    description:
      "Un efecto clásico de tonos cálidos y detalles sofisticados.",
    bookingService: "Nail Art",
    photos: [
      "carey.png"
    ]
  },

  {
    title: "Cat Eye",
    description:
      "Efecto magnético con reflejos que cambian con la luz.",
    bookingService: "Nail Art",
    photos: [
      "cateye2.png"
    ]
  },

  {
    title: "Cristales",
    description:
      "Aplicaciones brillantes para diseños con personalidad.",
    bookingService: "Nail Art",
    photos: [
      "cristales.png"
    ]
  },

  {
    title: "Francés corto",
    description:
      "La manicura francesa clásica en uñas cortas.",
    bookingService: "Nail Art",
    photos: [
      "francescorto.png"
    ]
  },

  {
    title: "Francés",
    description:
      "Líneas limpias y una manicura elegante y atemporal.",
    bookingService: "Nail Art",
    photos: [
      "frances.png"
    ]
  },

  {
    title: "Matching",
    description:
      "Diseños coordinados que combinan estilo y detalle.",
    bookingService: "Nail Art",
    photos: [
      "matching.png"
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
  },

  {
    title: "Polka Dots",
    description:
      "Diseños minimalistas con puntos y detalles delicados.",
    bookingService: "Nail Art",
    photos: [
      "puntitos.png"
    ]
  },

  {
    title: "Relieve",
    description:
      "Texturas y detalles tridimensionales.",
    bookingService: "Nail Art",
    photos: [
      "relieve.png"
    ]
  },

  {
    title: "Gel semipermanente",
    description:
      "Un solo tono de color con brillo y acabado uniforme.",
    price: 350,
    bookingService: "Gel semipermanente",
    photos: [
      "softgel2.png",
      "gelsemipermanente.png"
    ]
  },

  {
    title: "Glitter",
    description:
      "Destellos y acabados brillantes para un set especial.",
    bookingService: "Nail Art",
    photos: [
      "brillitos.png"
    ]
  },

  {
    title: "Nail Art",
    description:
      "Detalles decorativos y accesorios para diseños únicos.",
    bookingService: "Nail Art",
    photos: [
      "charms.png"
    ]
  },

  {
    title: "Texturas",
    description:
      "Detalles con volumen y carácter para un acabado creativo.",
    bookingService: "Nail Art",
    photos: [
      "charms2.png"
    ]
  },

  {
    title: "Tintas de alcohol",
    description:
      "Efectos artísticos de color. Nombre comercial por confirmar.",
    bookingService: "Nail Art",
    photos: [
      "tintas de alcohol.png"
    ]
  },

  {
    title: "Vitamina",
    description:
      "Tratamiento enfocado en el cuidado de las uñas.",
    price: 100,
    bookingService: "Vitamina",
    photos: [
      "vitamina.png"
    ]
  }

  // PENDIENTE:
  // acetato2.png todavía no tiene
  // nombre de efecto aprobado.
];

// ==========================================
// RUTAS DE LAS FOTOGRAFÍAS
// ==========================================

function photoPath(filename) {
  return "assets/" + encodeURIComponent(filename);
}

// Compatibilidad con archivos que tienen
// acentos en sus nombres.

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

      image.src = photoPath(
        uniqueVariants[attempt]
      );

    } else {

      image.onerror = null;

      image.alt =
        "Fotografía pendiente: " + filename;

      image.style.display = "none";

      if (image.parentElement) {
        image.parentElement.dataset.pending =
          "Foto pendiente";
      }
    }
  };

  image.style.display = "block";

  if (image.parentElement) {
    delete image.parentElement.dataset.pending;
  }

  image.src = photoPath(uniqueVariants[0]);
}

// ==========================================
// ENLACES DE WHATSAPP
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
// CARRUSEL DE SERVICIOS
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

  // FLECHA ANTERIOR

  const prev = document.createElement("button");

  prev.type = "button";
  prev.className = "nail-arrow";
  prev.textContent = "←";

  prev.setAttribute(
    "aria-label",
    "Ver servicios anteriores"
  );

  // FLECHA SIGUIENTE

  const next = document.createElement("button");

  next.type = "button";
  next.className = "nail-arrow";
  next.textContent = "→";

  next.setAttribute(
    "aria-label",
    "Ver siguientes servicios"
  );

  // ========================================
  // CREAR TARJETAS AUTOMÁTICAMENTE
  // ========================================

  nailCategories.forEach(category => {

    const card = document.createElement("article");
    card.className = "nail-category-card";

    // CONTENEDOR DE FOTOGRAFÍA

    const imageBox = document.createElement("div");
    imageBox.className = "nail-image";

    const image = document.createElement("img");

    image.alt = "Diseño " + category.title;
    image.loading = "lazy";
    image.decoding = "async";

    let currentImage = 0;

    // INDICADORES DE FOTOGRAFÍAS

    const indicators = document.createElement("div");
    indicators.className = "nail-indicators";

    const dots = category.photos.map(() => {

      const dot = document.createElement("span");

      dot.className = "nail-dot";

      indicators.appendChild(dot);

      return dot;

    });

    // ACTUALIZAR FOTOGRAFÍA

    function updateImage() {

      const filename =
        category.photos[currentImage];

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

    // ========================================
    // CAMBIO AUTOMÁTICO CADA 5 SEGUNDOS
    // ========================================

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

    // ========================================
    // NOMBRE DE LA CATEGORÍA
    // ========================================

    const title = document.createElement("h3");

    title.textContent = category.title;

    // ========================================
    // DESCRIPCIÓN
    // ========================================

    const description = document.createElement("p");

    description.className = "nail-description";

    description.textContent = category.description;

    // ========================================
    // PRECIO
    // ========================================

    let priceElement = document.createElement("p");

    priceElement.className = "nail-price";

    if (category.price !== undefined) {

      const priceLabel =
        document.createTextNode("Desde ");

      const priceValue =
        document.createElement("strong");

      priceValue.textContent =
        "$" +
        category.price.toLocaleString("es-MX");

      priceElement.append(
        priceLabel,
        priceValue
      );

    } else {

      priceElement.textContent =
        "Cotiza tu diseño";

    }

    // ========================================
    // BOTÓN DE RESERVACIÓN POR WHATSAPP
    // ========================================

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

    // ========================================
    // AGREGAR ELEMENTOS A LA TARJETA
    // ========================================

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
  // MOVIMIENTO DEL CARRUSEL
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

  // BOTONES DE NAVEGACIÓN

  prev.addEventListener("click", () => {
    scrollCarousel(-1);
  });

  next.addEventListener("click", () => {
    scrollCarousel(1);
  });

  // ACTIVAR Y DESACTIVAR FLECHAS

  function updateArrows() {

    const maxScroll =
      track.scrollWidth - track.clientWidth;

    prev.disabled =
      track.scrollLeft <= 2;

    next.disabled =
      track.scrollLeft >= maxScroll - 2;

  }

  track.addEventListener(
    "scroll",
    updateArrows,
    { passive: true }
  );

  window.addEventListener(
    "resize",
    updateArrows
  );

  wrapper.append(
    prev,
    track,
    next
  );

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
    dateInput.value
      .split("-")
      .map(Number);

  const weekday = new Date(
    Date.UTC(year, month - 1, day)
  ).getUTCDay();

  // ========================================
  // DOMINGOS CERRADOS
  // ========================================

  if (weekday === 0) {

    setStatus(
      "Los domingos no hay atención. Elige otro día.",
      true
    );

    return;

  }

  // ========================================
  // HORARIOS
  //
  // LUNES: SOLO CON CITA PREVIA
  // MARTES A VIERNES: 10:00 - 19:00
  // SÁBADO: 09:00 - 15:00
  // ========================================

  const first =
    weekday === 6 ? 9 : 10;

  const last =
    weekday === 6 ? 14 : 18;

  for (
    let hour = first;
    hour <= last;
    hour++
  ) {

    const label =
      String(hour).padStart(2, "0") + ":00";

    timeInput.add(
      new Option(label, label)
    );

  }

  timeInput.disabled = false;

  if (weekday === 1) {

    setStatus(
      "Los lunes se atiende únicamente con cita previa. JAE confirmará tu solicitud por WhatsApp."
    );

  } else {

    setStatus("");

  }

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

    // VALIDAR FECHA Y HORARIO

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

    // ========================================
    // FORMATEAR FECHA
    // ========================================

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
      designInput?.value.trim() ||
      "Sin especificar";

    // DETECTAR SI ES LUNES

    const isMonday =
      new Date(
        dateInput.value + "T12:00:00"
      ).getDay() === 1;

    const mondayNote = isMonday
      ? "\nNota: sé que los lunes se atiende solo con cita previa."
      : "";

    // ========================================
    // MENSAJE DE WHATSAPP
    // ========================================

    const message =
`Hola JAE ✨

Quisiera solicitar una cita.

Servicio: ${service.value}
Diseño de inspiración: ${selectedDesign}

Fecha: ${formattedDate}
Horario: ${timeInput.value}

Nombre: ${clientName.value.trim()}
Teléfono: ${phone.value.trim()}

Quedo pendiente de la confirmación de disponibilidad.${mondayNote}

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
// CARRUSEL DE ESTERILIZACIÓN
// ==========================================

function initSterileCarousel() {

  const root =
    document.querySelector("[data-sterile]");

  if (!root) return;

  const track =
    root.querySelector(".sterile-track");

  const prev =
    root.querySelector("[data-sprev]");

  const next =
    root.querySelector("[data-snext]");

  if (!track || !prev || !next) return;

  function getStep() {

    const slide =
      track.querySelector(".sterile-slide");

    if (!slide) return track.clientWidth;

    const gap =
      parseFloat(
        getComputedStyle(track).columnGap
      ) || 0;

    return (
      slide.getBoundingClientRect().width +
      gap
    );

  }

  prev.addEventListener("click", () => {

    track.scrollBy({
      left: -getStep(),
      behavior: "smooth"
    });

  });

  next.addEventListener("click", () => {

    track.scrollBy({
      left: getStep(),
      behavior: "smooth"
    });

  });

}

// ==========================================
// INICIALIZAR PÁGINA
// ==========================================

document.addEventListener(
  "DOMContentLoaded",
  () => {

    createNailGalleries();

    initSterileCarousel();

    initBookingForm();

  }
);
