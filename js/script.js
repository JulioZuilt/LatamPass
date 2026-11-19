document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('latamPassForm');
  const nombreInput = document.getElementById('nombre');
  const rutInput = document.getElementById('rut');
  const correoInput = document.getElementById('correo');
  const telefonoInput = document.getElementById('telefono');
  const modal = document.getElementById('simulationModal');
  const modalIcon = document.getElementById('modalIcon');
  const modalTitle = document.getElementById('modalTitle');
  const modalMessage = document.getElementById('modalMessage');
  const closeModalBtn = document.getElementById('closeModalBtn');

  // 1. Bloquear números y caracteres especiales en el Nombre (solo letras, tildes, ñ y espacios)
  nombreInput.addEventListener('input', (e) => {
    e.target.value = e.target.value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]/g, '');
  });

  // 2. Formateo automático de RUT (máximo 9 caracteres: 8 dígitos + DV)
  rutInput.addEventListener('input', (e) => {
    let value = e.target.value.replace(/[^0-9kK]/g, '').toUpperCase();
    
    if (value.length > 9) {
      value = value.slice(0, 9);
    }

    if (value.length > 1) {
      const dv = value.slice(-1);
      let body = value.slice(0, -1);
      body = body.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
      e.target.value = `${body}-${dv}`;
    } else {
      e.target.value = value;
    }
  });

  // 3. Permitir solo números y máximo 8 dígitos en el Teléfono
  telefonoInput.addEventListener('input', (e) => {
    e.target.value = e.target.value.replace(/\D/g, '').slice(0, 8);
  });

  // Validación de formato y largo de RUT (acepta cualquier RUT de 8 o 9 caracteres)
  function validarRutFormato(rutCompleto) {
    const limpio = rutCompleto.replace(/[^0-9kK]/g, '').toUpperCase();
    return /^[0-9]{7,8}[0-9K]$/.test(limpio);
  }

  // Función de validación de correo con dominio válido
  function validarCorreoValido(correo) {
    const regexCorreo = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return regexCorreo.test(correo);
  }

  // Mostrar modal de confirmación
  function showModal({ title, message, isError = false }) {
    modalTitle.textContent = title;
    modalMessage.innerHTML = message;

    if (isError) {
      modalIcon.textContent = '!';
      modalIcon.classList.add('error');
    } else {
      modalIcon.innerHTML = '&#10003;';
      modalIcon.classList.remove('error');
    }

    modal.classList.add('active');
  }

  // Envío del formulario con validaciones
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const nombre = nombreInput.value.trim();
    const rut = rutInput.value.trim();
    const correo = correoInput.value.trim();
    const telefono = telefonoInput.value.trim();
    const acompanantesSelect = document.getElementById('acompanantes');
    const acompanantesTexto = acompanantesSelect.options[acompanantesSelect.selectedIndex]?.text || '';
    const aceptoBases = document.getElementById('aceptoBases').checked;

    if (!nombre || !rut || !correo || !telefono || !acompanantesSelect.value) {
      showModal({
        title: 'Faltan datos por completar',
        message: 'Por favor completa todos los campos obligatorios marcados con (*) para registrar tu participación.',
        isError: true
      });
      return;
    }

    if (nombre.length < 3 || /\d/.test(nombre)) {
      showModal({
        title: 'Nombre inválido',
        message: 'Por favor ingresa un nombre válido usando solo letras (sin números).',
        isError: true
      });
      return;
    }

    if (!validarRutFormato(rut)) {
      showModal({
        title: 'RUT incompleto',
        message: 'Por favor ingresa un RUT de 8 o 9 dígitos con su dígito verificador (ej: 12.345.678-9).',
        isError: true
      });
      return;
    }

    if (!validarCorreoValido(correo)) {
      showModal({
        title: 'Correo electrónico inválido',
        message: 'Por favor ingresa un correo con un dominio válido (por ejemplo: usuario@gmail.com).',
        isError: true
      });
      return;
    }

    if (!/^\d{8}$/.test(telefono)) {
      showModal({
        title: 'Teléfono inválido',
        message: 'Por favor ingresa un número de teléfono válido de exactamente 8 dígitos (ej: 91234567).',
        isError: true
      });
      return;
    }

    if (!aceptoBases) {
      showModal({
        title: 'Bases y condiciones',
        message: 'Debes aceptar las bases y condiciones del concurso LATAM Pass antes de enviar tu participación.',
        isError: true
      });
      return;
    }

    showModal({
      title: '¡Ya estás participando!',
      message: `Hola <strong>${nombre}</strong> (RUT: ${rut}), hemos registrado tu participación para viajar con <strong>"${acompanantesTexto}"</strong>.<br><br>Enviamos una confirmación a <strong>${correo}</strong>. ¡Mucha suerte por los 10 millones de millas!`,
      isError: false
    });

    form.reset();
  });

  // Cerrar modal
  closeModalBtn.addEventListener('click', () => {
    modal.classList.remove('active');
  });

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.classList.remove('active');
    }
  });
});