
/* =====================================
   JAE NAIL HOUSE — JAVASCRIPT
===================================== */

// DATOS GENERALES
const WHATSAPP_NUMBER = "525516383938";

const form = document.getElementById("booking-form");
const service = document.getElementById("service");
const dateInput = document.getElementById("date");
const timeInput = document.getElementById("time");
const bookingStatus = document.getElementById("booking-status");
const clientName = document.getElementById("client-name");
const phone = document.getElementById("phone");

// =====================================
// GALERÍA DE UÑAS POR CATEGORÍAS
// =====================================

// Para agregar otra foto a una categoría,
// solamente agrega su nombre en la lista
// correspondiente. Todas están en assets/.

const nailCategories = [
  {
    title: "Acrílico",
    photos: [
      "acrílico.png",
      "acrílico2.png"
    ]
  },
  {
    title: "Baby Boomer",
    photos: [
      "babyboomer.png",
      "babyboomer2.png"
    ]
  },
  {
    title: "Acetato",
    photos: [
      "acetato.png",
      "acetato2.png"
    ]
  },
  {
    title: "Aurora",
    photos: [
      "aurora.png"
    ]
  },
  {
    title: "Tintas de alcohol",
    photos: [
      "tintas de alcohol.png",
      "tintas de alcohol2.png"
    ]
  },
  {
    title: "Carey",
    photos: [
      "carey.png",
      "carey2.png"
    ]
  },
  {
    title: "Brillitos",
    photos: [
      "brillitos.png"
    ]
  },
  {
    title: "Shining",
    photos: [
      "shining.png"
    ]
  },
  {
    title: "Puntitos",
    photos: [
      "puntitos.png",
      "puntitos2.png"
    ]
  },
  {
    title: "Relieve",
    photos: [
      "relieve.png",
      "relieve2.png",
      "relieve3.png"
    ]
  },
  {
    title: "Stickers",
    photos: [
      "stickers.png",
      "stickers2.png",
      "stickers3.png"
    ]
  },
  {
    title: "Soft Gel",
    photos: [
      "softgel.png",
      "softgel2.png"
    ]
  },
  {
    title: "Vitamina",
    photos: [
      "vitamina.png",
      "vitamina2.png"
    ]
  },
  {
    title: "Polygel",
    photos: [
      "poligel2.png"
    ]
  }
];

// =====================================
// GENERAR CARRUSELES DE INSPIRACIÓN
// =====================================

function createNailGalleries() {
  const container = document.getElementById("nail-collections");
  if (!container) return;

  const fallback = "assets/foto-pendiente.svg";

  nailCategories.forEach(category => {
    const section = document.createElement("section");
    section.className = "nail-collection";
    section.setAttribute("aria-label", `Galería de ${category.title}`);

    const heading = document.createElement("div");
    heading.className = "nail-collection-heading";

    const title = document.createElement("h3");
    title.textContent = category.title;

    const controls = document.createElement("div");
    controls.className = "nail-collection-controls";

    const prev = document.createElement("button");
    prev.type = "button";
    prev.className = "nail-arrow nail-prev";
    prev.textContent = "←";
    prev.setAttribute("aria-label", `Anterior en ${category.title}`);

    const next = document.createElement("button");
    next.type = "button";
    next.className = "nail-arrow nail-next";
    next.textContent = "→";
    next.setAttribute("aria-label", `Siguiente en ${category.title}`);

    controls.append(prev, next);
    heading.append(title, controls);

    const track = document.createElement("div");
    track.className = "nail-track";
    track.tabIndex = 0;
    track.setAttribute("aria-label", `Fotos de ${category.title}`);

    category.photos.forEach((filename, index) => {
      const figure = document.createElement("figure");
      figure.className = "nail-item";

      const imageWrap = document.createElement("div");
      imageWrap.className = "nail-image";

      const img = document.createElement("img");
      img.src = "assets/" + encodeURIComponent(filename);
      img.alt = `${category.title}, diseño ${index + 1}`;
      img.loading = "lazy";
      img.decoding = "async";

      img.onerror = function () {
        this.onerror = null;
        this.src = fallback;
      };

      const caption = document.createElement("figcaption");
      caption.textContent =
        category.title + " · " +
        String(index + 1).padStart(2, "0");

      imageWrap.appendChild(img);
      figure.append(imageWrap, caption);
      track.appendChild(figure);
    });

    const counter = document.createElement("p");
    counter.className = "nail-count";
    counter.setAttribute("aria-live", "polite");

    function step() {
      const item = track.querySelector(".nail-item");
      if (!item) return track.clientWidth;
      const gap = parseFloat(getComputedStyle(track).columnGap) || 0;
      return item.getBoundingClientRect().width + gap;
    }

    function updateControls() {
      const maxScroll = track.scrollWidth - track.clientWidth;
      prev.disabled = track.scrollLeft <= 2;
      next.disabled = track.scrollLeft >= maxScroll - 2;

      const current = Math.min(
        category.photos.length,
        Math.round(track.scrollLeft / step()) + 1
      );

      counter.textContent =
        String(current).padStart(2, "0") +
        " / " +
        String(category.photos.length).padStart(2, "0");
    }

    prev.addEventListener("click", () => {
      track.scrollBy({ left: -step(), behavior: "smooth" });
    });

    next.addEventListener("click", () => {
      track.scrollBy({ left: step(), behavior: "smooth" });
    });

    track.addEventListener("scroll", updateControls, { passive: true });
    window.addEventListener("resize", updateControls);

    section.append(heading, track, counter);
    container.appendChild(section);

    requestAnimationFrame(updateControls);
  });
}

// =====================================
// CARRUSEL DE SERVICIOS
// =====================================

function initServiceCarousel() {
  const root = document.querySelector("[data-services]");
  if (!root) return;

  const track = root.querySelector(".svc-track");
  const prev = root.querySelector(".svc-prev");
  const next = root.querySelector(".svc-next");

  function getStep() {
    const card = track.querySelector(".svc-card");
    if (!card) return track.clientWidth;

    const gap = parseFloat(getComputedStyle(track).columnGap) || 0;
    return card.getBoundingClientRect().width + gap;
  }

  prev.addEventListener("click", () => {
    track.scrollBy({ left: -getStep(), behavior: "smooth" });
  });

  next.addEventListener("click", () => {
    track.scrollBy({ left: getStep(), behavior: "smooth" });
  });
}

// =====================================
// BOTONES DE RESERVAR SERVICIO
// =====================================

function initServiceButtons() {
  document.querySelectorAll("[data-service]").forEach(button => {
    button.addEventListener("click", () => {
      if (service) {
        service.value = button.dataset.service;
      }

      document.getElementById("reservar").scrollIntoView({
        behavior: "smooth"
      });
    });
  });
}

// =====================================
// FECHA ACTUAL DE MÉXICO
// =====================================

function todayInMexico() {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Mexico_City",
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  }).formatToParts(new Date());

  const part = type => parts.find(p => p.type === type).value;
  return `${part("year")}-${part("month")}-${part("day")}`;
}

function setStatus(message, error = false) {
  if (!bookingStatus) return;

  bookingStatus.textContent = message;
  bookingStatus.style.color = error ? "#9a3830" : "#947044";
}

// =====================================
// HORARIOS DISPONIBLES PARA SOLICITUD
// =====================================

function updateTimes() {
  timeInput.replaceChildren();
  timeInput.add(new Option("Selecciona un horario", ""));
  timeInput.disabled = true;

  if (!dateInput.value) {
    setStatus("");
    return;
  }

  if (dateInput.value < todayInMexico()) {
    setStatus("Selecciona una fecha de hoy en adelante.", true);
    return;
  }

  const [year, month, day] = dateInput.value.split("-").map(Number);

  const weekday = new Date(
    Date.UTC(year, month - 1, day)
  ).getUTCDay();

  if (weekday === 0) {
    setStatus("Los domingos no hay atención. Elige otro día.", true);
    return;
  }

  // Lunes a viernes: 10:00 a 19:00
  // Sábado: 09:00 a 15:00
  // Se ofrecen citas por hora.

  const first = weekday === 6 ? 9 : 10;
  const last = weekday === 6 ? 14 : 18;

  for (let hour = first; hour <= last; hour++) {
    const label = String(hour).padStart(2, "0") + ":00";
    timeInput.add(new Option(label, label));
  }

  timeInput.disabled = false;
  setStatus("");
}

// =====================================
// FORMULARIO A WHATSAPP
// =====================================

function initBookingForm() {
  if (!form) return;

  dateInput.min = todayInMexico();
  dateInput.addEventListener("change", updateTimes);

  form.addEventListener("submit", event => {
    event.preventDefault();

    dateInput.min = todayInMexico();

    if (!form.reportValidity()) return;

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

    const formattedDate = new Date(
      dateInput.value + "T12:00:00"
    ).toLocaleDateString("es-MX", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric"
    });

    const message =
`Hola JAE ✨

Quisiera solicitar una cita.

Servicio: ${service.value}
Fecha: ${formattedDate}
Horario: ${timeInput.value}

Nombre: ${clientName.value.trim()}
Teléfono: ${phone.value.trim()}

Quedo pendiente de la confirmación de disponibilidad.`;

    const whatsappURL =
      `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;

    const popup = window.open(whatsappURL, "_blank", "noopener,noreferrer");

    if (!popup) {
      window.location.href = whatsappURL;
    }

    setStatus(
      "Se abrió WhatsApp. Envía el mensaje para solicitar tu cita."
    );
  });
}

// =====================================
// INICIALIZACIÓN
// =====================================

document.addEventListener("DOMContentLoaded", () => {
  createNailGalleries();
  initServiceCarousel();
  initServiceButtons();
  initBookingForm();
});
