// DOM Static Selectors
const DOM = {
  form: document.querySelector("#form"),
  nombreUsuario: document.querySelector("#NombreUsuario"),

  contrasena: document.getElementById("Contrasena"),
  mostrarContrasena: document.getElementById("MostrarContrasena"),
  nombre: document.getElementById("Nombre"),
  apellidos: document.getElementById("Apellidos"),
  telefono: document.getElementById("Telefono"),
  codigoPostal: document.getElementById("CodigoPostal"),
  dniNie: document.getElementById("DniNie"),
  documentType: document.getElementById("documentType"),
  cuentaComo: document.getElementsByName("CuentaComo"),
  anioNacimiento: document.getElementById("AnioNacimiento"),

  aficiones: document.querySelectorAll(".checkbox-item input[type=checkbox]"),

  publicacionTitulo: document.getElementById("PublicacionTitulo"),
  publicacionDescripcion: document.getElementById("PublicacionDescripcion"),

  contadorTitulo: document.getElementById("title-word-count"),
  contadorDescripcion: document.getElementById("description-word-count"),

  errorsContainer: document.querySelector(".errors-container"),
};

export function initializeForm() {
  generateDropdownYears(1920, 2010, "AnioNacimiento");
  showCountChars();
  togglePasswordVisibility();
  createSubmitEvent();
}

export function createSubmitEvent() {
  const form = document.querySelector("form");
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    if (validateForm()) {
      console.log("Formulario válido, procesando...");
    } else {
      console.log("Formulario inválido, mostrando errores...");
    }
  });
}

// Mostrar/ocultar la contraseña
export function togglePasswordVisibility() {
  const togglePasswordCheckbox = document.getElementById("show-passwd");
  const passwordInput = document.getElementById("Contrasena");

  if (togglePasswordCheckbox && passwordInput) {
    togglePasswordCheckbox.addEventListener("change", () => {
      passwordInput.type = togglePasswordCheckbox.checked ? "text" : "password";
    });
  }
}

// Función que muestra el contador de caracteres en los campos de texto
export function showCountChars() {
  if (DOM.contadorTitulo) {
    DOM.publicacionTitulo.addEventListener("input", () => {
      const count = DOM.publicacionTitulo.value.length;
      DOM.contadorTitulo.textContent = `${count}/15`;
    });
  }

  if (DOM.contadorDescripcion) {
    DOM.publicacionDescripcion.addEventListener("input", () => {
      const count = DOM.publicacionDescripcion.value.length;
      DOM.contadorDescripcion.textContent = `${count}/150`;
    });
  }
}

// Función que añade un mensaje de error personalizado en los campos del formulario
export function showErrorMessage(message, element) {
  // añade clase al elemento, para cambiar borde a rojo
  element.classList.add("input-text-error");

  // creo elemento span con error personalizado
  const span = document.createElement("span");
  span.classList.add("error-message");

  // crea un elemento de nodo de texto
  // span.innerHTML(message)
  const textNode = document.createTextNode(message);
  span.appendChild(textNode);

  element.after(span);
}

// Función que genera un dropdown de años en un elemento select
export function generateDropdownYears(min, max, selectId) {
  const selectElement = document.getElementById(selectId);

  if (!selectElement) {
    console.error(`No se encontró el elemento con ID: ${selectId}`);
    return;
  }

  for (let year = min; year <= max; year++) {
    const option = document.createElement("option");
    option.value = year;
    option.textContent = year;
    selectElement.appendChild(option);
  }
}

// Función para mostrar los mensajes de errores de validación genéricos
export function showGenericValidationErrorMessage() {
  DOM.errorsContainer.innerHTML = ""; // Limpiar los mensajes previos

  console.log("entrando en showGenericValidationErrorMessage");

  const validationElements = document.querySelectorAll(
    "input:required, textarea:required"
  );

  // Iterar sobre cada campo de entrada o textarea requerido
  validationElements.forEach((elemento) => {
    const inputValidationMessage = elemento.validationMessage;
    if (inputValidationMessage) {
      const nombreElemento =
        elemento.getAttribute("id") || elemento.getAttribute("name");
      const mensajeHTML = `<p><strong>${nombreElemento}:</strong> ${inputValidationMessage}</p>`;
      DOM.errorsContainer.innerHTML += mensajeHTML;
    }
  });
}

// Función para validar el DNI o NIE, devuelve un booleano
export function validateDocument(numDniNie, documentType) {
  const letter = "TRWAGMYFPDXBNJZSQVHLCKE";

  const validarDNI = (dni) => {
    if (/^\d{8}[A-Za-z]$/.test(dni)) {
      const nums = parseInt(dni.slice(0, -1), 10);
      const letter = dni.slice(-1).toUpperCase();
      return letter[nums % 23] === letter;
    }
    return false;
  };

  const validarNIE = (nie) => {
    if (/^[XYZ]\d{7}[A-Za-z]$/.test(nie)) {
      const prefijo = { X: 0, Y: 1, Z: 2 }[nie[0]];
      const nums = parseInt(prefijo + nie.slice(1, -1), 10);
      const letter = nie.slice(-1).toUpperCase();
      return letter[nums % 23] === letter;
    }
    return false;
  };

  if (documentType === "DNI") {
    return validarDNI(numDniNie);
  } else if (documentType === "NIE") {
    return validarNIE(numDniNie);
  }
  return false;
}

// Función para validar si hay más de 2 aficiones seleccionadas
export function validateHobbies() {
  const aficiones = document.querySelectorAll(
    'input[name="aficiones"]:checked'
  );
  if (aficiones.length < 2) {
    document.getElementById("error-aficiones").textContent =
      "Debes seleccionar al menos 2 aficiones.";
  } else {
    document.getElementById("error-aficiones").textContent = "";
  }
}

// Función para validar los campos de texto
// export function validateBaseInputText(value) {
//   return value != "";
// }

export function validateForm() {
  const form = document.querySelector("form");
  const fields = form.querySelectorAll(".field");
  const arrayErrors = [
    "Nombre de usuario obligatorio.",
    "Contraseña obligatoria.",
    "Nombre es obligatorio.",
    "Apellidos obligatorios.",
    "Teléfono incorrecto, formato (+34)XXXXXXXXX.",
    "Código postal debe tener 5 dígitos y comenzar por 38.",
    "Documento es inválido.",
    "Tipo de cuenta obligatoria.",
    "Año de nacimiento obligatorio.",
    "Aficiones mínimas 2.",
    "Título mínimo de 4 caracteres.",
    "Descripción mínima de 4 caracteres.",
  ];

  let isValid = true;

  // Limpiar mensajes de error anteriores
  fields.forEach((field) => {
    const errorMessage = field.querySelector(".error-message");
    if (errorMessage) {
      errorMessage.remove();
    }
  });

  // Validar cada campo y agregar mensajes de error si es necesario
  fields.forEach((field, index) => {
    const input = field.querySelector("input, textarea");
    let error = "";

    switch (index) {
      case 0: // Nombre de usuario
        if (!input || !input.value.trim()) {
          error = arrayErrors[index];
        }
        break;
      case 1: // Contraseña
        if (!input || !input.value.trim()) {
          error = arrayErrors[index];
        }
        break;
      case 2: // Nombre
        if (!input || !input.value.trim()) {
          error = arrayErrors[index];
        }
        break;
      case 3: // Apellidos
        if (!input || !input.value.trim()) {
          error = arrayErrors[index];
        }
        break;
      case 4: // Teléfono
        const phonePattern = /^\(\+34\)\d{9}$/;
        if (!input || !phonePattern.test(input.value.trim())) {
          error = arrayErrors[index];
        }
        break;
      case 5: // Código postal
        const postalPattern = /^38\d{3}$/;
        if (!input || !postalPattern.test(input.value.trim())) {
          error = arrayErrors[index];
        }
        break;
      case 6: // Documento
        if (!input || !validateDocument(input.value.trim(), "DNI")) {
          error = arrayErrors[index];
        }
        break;
      case 7: // Tipo de cuenta
        const cuentaSeleccionada = document.querySelector(
          'input[name="CuentaComo"]:checked'
        );
        if (!cuentaSeleccionada) {
          error = arrayErrors[index];
        }
        break;
      case 8: // Año de nacimiento
        if (!DOM.anioNacimiento || !DOM.anioNacimiento.value) {
          error = arrayErrors[index];
        }
        break;
      case 9: // Aficiones
        const aficiones = document.querySelectorAll(
          "input.hobby-checkbox:checked"
        );
        if (aficiones.length < 2) {
          error = arrayErrors[index];
        }
        break;
      case 10: // Título
        if (!input || input.value.trim().length < 4) {
          error = arrayErrors[index];
        }
        break;
      case 11: // Descripción
        if (!input || input.value.trim().length < 4) {
          error = arrayErrors[index];
        }
        break;
      default:
        break;
    }

    if (error) {
      const span = document.createElement("span");
      span.className = "error-message";
      span.textContent = error;
      field.appendChild(span);
      isValid = false;
    }
  });

  return isValid;
}

// Función que procesa el formulario
export const processForm = function (event) {
  event.preventDefault();

  if (validateForm()) {
    // Aquí puedes agregar el código para procesar el formulario si es válido
    console.log("Formulario válido, procesando...");
  } else {
    console.log("Formulario inválido, mostrando errores...");
  }
};

/*
// Función que procesa el formulario
export function createSubmitEvent() {
  DOM.form.addEventListener("submit", processForm);
}

export function handleFormSubmit() {
  const form = document.querySelector("form");
  form.addEventListener("submit", (event) => {
    event.preventDefault();

    if (utils.validateForm()) {
      form.submit();
    }
  });
}

export function initializeForm() {
  generateDropdownYears(1920, 2010, "AnioNacimiento");
  showCountChars();
  togglePasswordVisibility();
  showGenericValidationErrorMessage();
  validateForm();
  createSubmitEvent();
  handleFormSubmit();
}
*/

