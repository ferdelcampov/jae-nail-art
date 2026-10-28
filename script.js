
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

  container.innerHTML = "";

  const track = document.createElement("div");
  track.className = "nail-track";

  const timers = [];

  nailCategories.forEach((category) => {
    const card = document.createElement("article");
    card.className = "nail-category-card";

    const imageBox = document.createElement("div");
    imageBox.className = "nail-image";

    const img = document.createElement("img");
    img.alt = `Diseño de uñas ${category.title}`;
    img.loading = "lazy";

    const title = document.createElement("h3");
    title.textContent = category.title;

    const indicators = document.createElement("div");
    indicators.className = "nail-indicators";

    let currentImage = 0;

    const dots = category.photos.map((photo) => {
      const dot = document.createElement("span");
      dot.className = "nail-dot";
      indicators.appendChild(dot);
      return dot;
    });

    function updateImage() {
      const file = category.photos[currentImage];

      img.src = "assets/" + encodeURIComponent(file);
      img.alt = `${category.title} - fotografía ${currentImage + 1}`;

      dots.forEach((dot, index) => {
        dot.classList.toggle("active", index === currentImage);
      });
    }

    img.onerror = function () {
      this.onerror = null;
      this.src = "assets/foto-pendiente.svg";
    };

    updateImage();

    // Solo rotar si hay más de una fotografía
    if (category.photos.length > 1) {
      const timer = setInterval(() => {
        currentImage = (currentImage + 1) % category.photos.length;
        updateImage();
      }, 5000);

      timers.push(timer);
    }

    imageBox.appendChild(img);
    card.append(imageBox, title, indicators);
    track.appendChild(card);
  });

  const wrapper = document.createElement("div");
  wrapper.className = "nail-carousel";

  const prev = document.createElement("button");
  prev.className = "nail-arrow";
  prev.type = "button";
  prev.textContent = "←";
  prev.setAttribute("aria-label", "Categorías anteriores");

  const next = document.createElement("button");
  next.className = "nail-arrow";
  next.type = "button";
  next.textContent = "→";
  next.setAttribute("aria-label", "Siguientes categorías");

  function scrollOne(direction) {
    const card = track.querySelector(".nail-category-card");
    if (!card) return;

    const gap = parseFloat(getComputedStyle(track).gap) || 0;
    const step = card.getBoundingClientRect().width + gap;

    track.scrollBy({
      left: step * direction,
      behavior: "smooth"
    });
  }

  prev.addEventListener("click", () => scrollOne(-1));
  next.addEventListener("click", () => scrollOne(1));

  wrapper.append(prev, track, next);
  container.appendChild(wrapper);

  // Pausar los cambios automáticos cuando la pestaña no está visible
  document.addEventListener("visibilitychange", () => {
    if (!document.hidden) return;
    // Los intervalos continúan su cuenta; al volver se ven las imágenes actuales.
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
