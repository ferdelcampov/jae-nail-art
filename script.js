/* ==========================================
   JAE NAIL HOUSE — JAVASCRIPT
========================================== */

// ==========================================
// CONFIGURACIÓN
// ==========================================

const WHATSAPP_NUMBER = "525516383938";

const form = document.getElementById("booking-form");
const service = document.getElementById("service");
const designInput = document.getElementById("design");
const dateInput = document.getElementById("date");
const timeInput = document.getElementById("time");
const bookingStatus = document.getElementById("booking-status");
const clientName = document.getElementById("client-name");
const phone = document.getElementById("phone");

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
// CARRUSEL DE ESTERILIZACIÓN
// ==========================================

function initSterileCarousel() {
  const root = document.querySelector("[data-sterile]");

  if (!root) return;

  const track = root.querySelector(".sterile-track");
  const prev = root.querySelector("[data-sprev]");
  const next = root.querySelector("[data-snext]");

  function getStep() {
    const slide = track.querySelector(".sterile-slide");
    if (!slide) return track.clientWidth;

    const gap =
      parseFloat(getComputedStyle(track).columnGap) || 0;

    return slide.getBoundingClientRect().width + gap;
  }

  prev.addEventListener("click", () => {
    track.scrollBy({ left: -getStep(), behavior: "smooth" });
  });

  next.addEventListener("click", () => {
    track.scrollBy({ left: getStep(), behavior: "smooth" });
  });
}

// ==========================================
// INICIALIZAR PÁGINA
// ==========================================

document.addEventListener(
  "DOMContentLoaded",
  () => {
    initSterileCarousel();
    initBookingForm();
  }
);
