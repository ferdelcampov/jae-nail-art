const form =
  document.getElementById('booking-form');

const service =
  document.getElementById('service');

const dateInput =
  document.getElementById('date');

const timeInput =
  document.getElementById('time');

const status =
  document.getElementById('booking-status');

const clientName =
  document.getElementById('client-name');

const phone =
  document.getElementById('phone');


function todayInMexico() {

  return new Intl.DateTimeFormat(
    'en-CA',
    {
      timeZone:
        'America/Mexico_City',

      year:
        'numeric',

      month:
        '2-digit',

      day:
        '2-digit'
    }
  ).format(
    new Date()
  );

}



function setStatus(
  message,
  error = false
) {

  status.textContent =
    message;

  status.style.color =
    error
      ? '#9a3830'
      : '#947044';

}



function updateTimes() {

  timeInput.replaceChildren();

  timeInput.add(
    new Option(
      'Selecciona un horario',
      ''
    )
  );

  timeInput.disabled =
    true;


  if (!dateInput.value) {
    return;
  }


  if (
    dateInput.value <
    todayInMexico()
  ) {

    setStatus(
      'Selecciona una fecha de hoy en adelante.',
      true
    );

    return;

  }


  const [
    year,
    month,
    day
  ] =
    dateInput.value
      .split('-')
      .map(Number);


  const weekday =
    new Date(
      Date.UTC(
        year,
        month - 1,
        day
      )
    ).getUTCDay();


  if (weekday === 0) {

    setStatus(
      'Los domingos no hay atención. Elige otro día.',
      true
    );

    return;

  }


  const first =
    weekday === 6
      ? 9
      : 10;


  const last =
    weekday === 6
      ? 15
      : 18;


  for (
    let hour = first;
    hour <= last;
    hour++
  ) {

    const label =
      String(hour)
        .padStart(
          2,
          '0'
        )
      +
      ':00';


    timeInput.add(
      new Option(
        label,
        label
      )
    );

  }


  timeInput.disabled =
    false;

  setStatus('');

}



dateInput.min =
  todayInMexico();


dateInput.addEventListener(
  'change',
  updateTimes
);



document
  .querySelectorAll(
    '[data-service]'
  )
  .forEach(
    button => {

      button.addEventListener(
        'click',
        () => {

          service.value =
            button.dataset.service;


          document
            .getElementById(
              'reservar'
            )
            .scrollIntoView({
              behavior:
                'smooth'
            });

        }
      );

    }
  );



form.addEventListener(
  'submit',
  event => {

    event.preventDefault();


    if (
      !form.reportValidity()
    ) {

      return;

    }


    if (
      dateInput.value <
        todayInMexico()
      ||
      timeInput.disabled
      ||
      !timeInput.value
    ) {

      setStatus(
        'Selecciona una fecha y un horario disponibles.',
        true
      );

      return;

    }



    /*
      CAMBIA AQUÍ EL NÚMERO DE JAE.

      Ejemplo:
      México +52
      número: 55 1234 5678

      quedaría:
      5215512345678
    */

    const whatsappNumber =
      '521XXXXXXXXXX';



    const formattedDate =

      new Date(
        dateInput.value +
        'T12:00:00'
      )
      .toLocaleDateString(
        'es-MX',
        {

          weekday:
            'long',

          day:
            'numeric',

          month:
            'long',

          year:
            'numeric'

        }
      );



    const message =
`Hola JAE ✨

Quisiera solicitar una cita.

Servicio: ${service.value}
Fecha: ${formattedDate}
Horario: ${timeInput.value}

Nombre: ${clientName.value}
Teléfono: ${phone.value}

Quedo pendiente de la confirmación de disponibilidad.`;



    const whatsappURL =

      `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;



    window.open(
      whatsappURL,
      '_blank'
    );

  }
);
