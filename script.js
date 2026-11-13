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
    description: "Extensiones resistentes con forma y longitud personalizadas.",
    price: 700,
    bookingService: "Acrílico y Soft Gel",
    photos: ["soft gel.png"]
  },
  {
    title: "Aurora",
    description: "Reflejos nacarados y cromados con acabados luminosos.",
    bookingService: "Nail Art",
    photos: [
      "acetato.png", "aurora.png",
      ["aurota.png]
    ]
  },
  {
    title: "Baby Boomer",
    description: "Degradados suaves y elegantes, desde tonos nude hasta vino.",
    bookingService: "Nail Art",
    photos: [
      ["babyboomer..png", "babyboomer (1).png"],
    ]
  },
  {
    title: "Carey",
    description: "Un efecto clásico en tonos cálidos y sofisticados.",
    bookingService: "Nail Art",
    photos: ["carey.png", "carey2.png"]
  },
  {
    title: "Cat Eye",
    description: "Efecto magnético con reflejos que cambian con la luz.",
    bookingService: "Nail Art",
    photos: ["cat eye.png"]
  },
  {
    title: "Cristales",
    description: "Pequeños cristales que aportan luz y elegancia a tus uñas.",
    bookingService: "Nail Art",
    photos: [["cristales.png"]]
  },
  {
    title: "Francés corto",
    description: "La manicura francesa clásica para uñas cortas.",
    bookingService: "Nail Art",
    photos: ["francés corto.png"]
  },
  {
    title: "Francés",
    description: "Líneas limpias y un diseño clásico y atemporal.",
    bookingService: "Nail Art",
    photos: ["francés.png"]
  },
  {
    title: "Matching",
    description: "Diseños coordinados que combinan estilo y detalle.",
    bookingService: "Nail Art",
    photos: ["matching.m.png"]
  },
  {
    title: "Polygel",
    description: "Aplicación de material ligero y resistente para extensiones personalizadas.",
    price: 750,
    bookingService: "Polygel",
    photos: [
      ["poligel2.png"],
    ]
  },
  {
    title: "Polka Dots",
    description: "Diseños delicados con puntos y detalles minimalistas.",
    bookingService: "Nail Art",
    photos: ["polkadots..png"]
  },
  {
    title: "Relieve",
    description: "Detalles tridimensionales que dan volumen y textura.",
    bookingService: "Nail Art",
    photos: ["relieve (1).png"]
  },
  {
    title: "Gel semipermanente",
    description: "Color de larga duración con acabado brillante, natural y uniforme.",
    price: 350,
    bookingService: "Gel semipermanente",
    photos: [
      ["gelsemipermanente.png"]
    ]
  },
  {
    title: "Glitter",
    description: "Destellos y acabados brillantes para un diseño especial.",
    bookingService: "Nail Art",
    photos: [
      ["glitter.png"],
    ]
  },
  {
    title: "Nail Art",
    description: "Diseños creativos con detalles decorativos y accesorios únicos.",
    bookingService: "Nail Art",
    photos: [
      ["charms.png"],
    ]
  },
  {
    title: "Texturas",
    description: "Decoraciones con volumen y detalles dorados en relieve.",
    bookingService: "Nail Art",
    photos: [
      ["texturas.png"],
    ]
  },
  {
    title: "Tintas de alcohol",
    description: "Efectos artísticos de color. Nombre comercial por confirmar.",
    bookingService: "Nail Art",
    photos: ["tintas de alcohol (cambiará el nombre).png"]
  },
  {
    title: "Vitamina",
    description: "Tratamiento para el cuidado de las uñas.",
    price: 100,
    bookingService: "Vitamina",
    photos: [
      ["vitamina.png"]
    ]
  }
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

// Devuelve el primer archivo disponible del grupo (sin repetir la misma foto).
function checkPhotoExists(filename) {
  return new Promise(resolve => {
    const tester = new Image();
    tester.onload = () => resolve(true);
    tester.onerror = () => resolve(false);
    tester.src = photoPath(filename);
  });
}

async function firstAvailablePhoto(option) {
  const choices = Array.isArray(option) ? option : [option];
  for (const name of choices) {
    const normalized = [...new Set([name, name.normalize("NFD"), name.normalize("NFC")])];
    for (const filename of normalized) {
      if (await checkPhotoExists(filename)) return filename;
    }
  }
  return null;
}

async function validPhotos(photoOptions) {
  const selected = await Promise.all(photoOptions.map(firstAvailablePhoto));
  return [...new Set(selected.filter(Boolean))];
}

async function createNailGalleries() {

  const container =
    document.getElementById("nail-collections");

  if (!container) return;

  container.textContent = "Cargando diseños...";

  // Revisa las rutas reales de GitHub. Las fotos faltantes no dejan cuadros vacíos.
  const categoriesWithPhotos = (await Promise.all(nailCategories.map(async category => {
    const photos = await validPhotos(category.photos);
    return photos.length ? {...category, photos} : null;
  }))).filter(Boolean);

  container.replaceChildren();
  if (!categoriesWithPhotos.length) {
    container.textContent = "No se encontraron fotografías en assets. Revisa sus nombres.";
    return;
  }

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

  categoriesWithPhotos.forEach(category => {

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
// CARRUSEL MEN CARE — FOTOS CADA 5 SEGUNDOS
// ==========================================

async function initMenCarousel() {
  const root = document.querySelector("[data-men-carousel]");
  if (!root) return;

  const track = root.querySelector(".men-care-track");
  const prev = root.querySelector("[data-men-prev]");
  const next = root.querySelector("[data-men-next]");
  const count = root.querySelector(".men-care-count");
  if (!track || !prev || !next || !count) return;

  const options = [
    { label: "Manicura Men Care", files: ["men-care-manicura.webp", "Imagen de ChatGPT 12 nov 2026, 03_47_11 p.m-2.png"] },
    { label: "Pedicura Men Care", files: ["men-care-pedicura.webp", "Imagen de ChatGPT 12 nov 2026, 03_47_10 p.m-1.png"] },
    { label: "Bienestar Men Care", files: ["men-care-bienestar.webp", "man-doing-his-self-care-ritual.jpg"] }
  ];

  const available = (await Promise.all(options.map(async entry => {
    const photo = await firstAvailablePhoto(entry.files);
    return photo ? {...entry, photo} : null;
  }))).filter(Boolean);

  track.replaceChildren();
  if (!available.length) {
    const message = document.createElement("p");
    message.className = "men-care-no-photos";
    message.textContent = "Fotografías de Men Care próximamente";
    track.appendChild(message);
    root.querySelector(".men-care-controls").hidden = true;
    return;
  }

  available.forEach((entry) => {
    const figure = document.createElement("figure");
    figure.className = "men-care-slide";
    const image = document.createElement("img");
    image.src = photoPath(entry.photo);
    image.alt = entry.label;
    image.loading = "lazy";
    const caption = document.createElement("figcaption");
    caption.textContent = entry.label;
    figure.append(image, caption);
    track.appendChild(figure);
  });

  const slides = [...track.querySelectorAll(".men-care-slide")];
  let current = 0;
  const controls = root.querySelector(".men-care-controls");
  controls.hidden = slides.length < 2;

  function show(index, smooth = true) {
    current = (index + slides.length) % slides.length;
    track.scrollTo({
      left: slides[current].offsetLeft - slides[0].offsetLeft,
      behavior: smooth ? "smooth" : "auto"
    });
    count.textContent = `${current + 1} / ${slides.length}`;
  }

  show(0, false);
  prev.addEventListener("click", () => show(current - 1));
  next.addEventListener("click", () => show(current + 1));
  track.addEventListener("scroll", () => {
    let closest = 0;
    let smallest = Infinity;
    slides.forEach((slide, i) => {
      const distance = Math.abs(track.scrollLeft - (slide.offsetLeft - slides[0].offsetLeft));
      if (distance < smallest) { smallest = distance; closest = i; }
    });
    current = closest;
    count.textContent = `${current + 1} / ${slides.length}`;
  }, {passive: true});
  window.addEventListener("resize", () => show(current, false));

  if (slides.length > 1 && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    setInterval(() => {
      if (!document.hidden && !root.matches(":hover") && !root.matches(":focus-within")) {
        show(current + 1);
      }
    }, PHOTO_INTERVAL);
  }
}

// ==========================================
// INICIALIZAR PÁGINA
// ==========================================

document.addEventListener(
  "DOMContentLoaded",
  () => {

    createNailGalleries();

    initSterileCarousel();

    initMenCarousel();

    initBookingForm();

  }
);
