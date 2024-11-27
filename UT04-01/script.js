document.addEventListener("DOMContentLoaded", () => {
    console.log("DOM fully loaded and parsed");

    // Obtener el campo de fecha y establecer el año máximo
    const currentYear = new Date().getFullYear();
    const dateInput = document.getElementById('date');
    if (dateInput) {
        dateInput.max = currentYear;
    }

    // Obtener el formulario y manejar el envío
    const form = document.getElementById('form');
    if (form) {
        form.addEventListener("submit", (event) => {
            event.preventDefault(); // Evitar el comportamiento por defecto
            if (validateForm(form)) {
                console.log("Formulario válido, enviando...");
                form.submit(); // Enviar el formulario si es válido
            } else {
                console.log("Formulario inválido, por favor corrige los errores.");
            }
        });
    }

    // Configurar el toggle de contraseña
    const togglePasswordCheckbox = document.getElementById('show-password');
    if (togglePasswordCheckbox) {
        togglePasswordCheckbox.addEventListener("click", togglePassword);
    }
});

// Función para mostrar/ocultar la contraseña
function togglePassword() {
    const password = document.getElementById('password');
    if (password) {
        password.type = password.type === 'password' ? 'text' : 'password';
    }
}

// Función para validar el formulario
function validateForm(form) {
    const inputs = form.querySelectorAll("input[required], textarea[required]");
    let isValid = true;

    // Validar cada campo requerido
    inputs.forEach((input) => {
        if (!input.value.trim()) {
            isValid = false;
            input.classList.add("invalid");
            console.error(`El campo ${input.name} es obligatorio.`);
        } else {
            input.classList.remove("invalid");
        }
    });

    return isValid;
}
