import alerta from './alerta';
export default function preguntarNombrePerfil(obligatorio = false, mensajeEspecial = "") {
    let nombreDeUsuario;
    alerta(`<span>Nuevo nombre:</span><br><input class="input-alerta" id="inputNombreUsuario" type="text" placeholder="Escriba aquí su nuevo nombre">${mensajeEspecial}<button class="alerta__btn" id="botonCambiarNombre">Enviar</button>`, obligatorio);
    //Al hacer click en la Cambiar luego de escribir el nombre
    document.getElementById("botonCambiarNombre").addEventListener('click', function () {
      let tieneContenido = document.getElementById("inputNombreUsuario").value.replace(/\s+/g, '') !== '';
      let tieneMenosDe12Caracteres = document.getElementById("inputNombreUsuario").value.length <= 12;
      if (tieneContenido && tieneMenosDe12Caracteres) {
        localStorage.setItem("nombreUsuarioLF", document.getElementById("inputNombreUsuario").value);
        nombreDeUsuario = localStorage.getItem("nombreUsuarioLF");
        document.querySelector('.info-usr__nmbr').innerHTML = nombreDeUsuario;
        document.querySelector('.alerta').style.display = "none";
        document.querySelector("#body").className = '';
        document.querySelector(':root').style.setProperty('--color-efectopantalla', 'transparent');
      }
      else if (!tieneMenosDe12Caracteres) {
        preguntarNombrePerfil(obligatorio, `<br><b style="font-size:17px">*El nombre de usuario tiene que tener menos de 12 caracteres</b><br>`);
      }
    });
}