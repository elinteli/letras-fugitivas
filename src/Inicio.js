import React from 'react';
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import images from './utils/importImages';

export default function Inicio({ alerta, setLocalStorage }) {
  useEffect(() => {
    let fotoPerfil = setLocalStorage("ftPerfilLF", "transparente");
    let nombreDeUsuario = setLocalStorage("nombreUsuarioLF", "Nombre de Usuario");
    const selectorFtPrfl = `<div class="selectorFotoPerfil" id="selectorFotoPerfil"> <label> <input checked class="radioInputFtPrfl" type="radio" name="selectorFotoPerfil" value="pinguino"> <img class="imgSelectorFtPrfl" src=${images["pinguino.png"]} alt="pinguino"> </label> <label> <input class="radioInputFtPrfl" type="radio" name="selectorFotoPerfil" value="leon"> <img class="imgSelectorFtPrfl" src=${images["leon.png"]} alt="león"> </label> <label> <input class="radioInputFtPrfl" type="radio" name="selectorFotoPerfil" value="tortuga"> <img class="imgSelectorFtPrfl" src=${images["tortuga.png"]} alt="tortuga"> </label> <br> <label> <input class="radioInputFtPrfl" type="radio" name="selectorFotoPerfil" value="ballena"> <img class="imgSelectorFtPrfl" src=${images["ballena.png"]} alt="ballena"> </label> <label> <input class="radioInputFtPrfl" type="radio" name="selectorFotoPerfil" value="buho"> <img class="imgSelectorFtPrfl" src=${images["buho.png"]} alt="buho"> </label> <label> <input class="radioInputFtPrfl" type="radio" name="selectorFotoPerfil" value="abeja"> <img class="imgSelectorFtPrfl" src=${images["abeja.png"]} alt="abeja"> </label> </div>`;

    if (fotoPerfil == "transparente") {
      document.querySelector("#body").className = 'efectoPantallaColor';
      document.querySelector(':root').style.setProperty('--color-efectopantalla', 'var(--efecto-pantalla-negro)');
      preguntarFotoPerfil(true);
    } else if (nombreDeUsuario == "Nombre de Usuario") {
      document.querySelector("#body").className = 'efectoPantallaColor';
      document.querySelector(':root').style.setProperty('--color-efectopantalla', 'var(--efecto-pantalla-negro)');
      preguntarNombrePerfil(true);
    }
    document.querySelector('.info-usr__ft').src = images[`${fotoPerfil}.png`];
    document.querySelector('.info-usr__nmbr').innerHTML = nombreDeUsuario;

    configurarBotonConfig();

    function configurarBotonConfig() {
      //Al hacer click en el boton de configuracion
      document.querySelector('.config__input--volumen').checked = JSON.parse(localStorage.getItem("sonidoLF"));
      document.querySelector("#seccion-config-prfl").style.display = "flex";
      document.querySelector('#seccion-config-reiniciar').style.display = "none";
      document.querySelector('.cont-inicio__btn--conf').addEventListener('click', function () {
        document.querySelector('.config').style.display = 'flex';
        document.querySelector("#body").className = 'efectoPantallaColor';
        document.querySelector(':root').style.setProperty('--color-efectopantalla', 'var(--efecto-pantalla-negro)');

        document.querySelector('.config__input--volumen').addEventListener('change', function () {
          localStorage.setItem("sonidoLF", document.querySelector('.config__input--volumen').checked);
        });

        //Al hacer click en la X
        document.querySelector('.config__btn-cerrar').addEventListener('click', function () {
          document.querySelector('.config').style.display = 'none';
          document.querySelector("#body").className = '';
          document.querySelector(':root').style.setProperty('--color-efectopantalla', 'transparent');
        });

        //Al hacer click en la Borrar
        document.querySelector('.config__btn--borr-dts').addEventListener('click', function () {
          alerta(`<span>¿Está seguro que desea eliminar definitivamente todo su progreso?</span><br><div id="btnAceptarAdvertenciaBorrarDatos" class="alerta__btn" >SÍ</div><div id="btnNOAceptarAdvertenciaBorrarDatos" class="alerta__btn" >NO</div>`)
          //Al hacer click en NO
          document.getElementById('btnNOAceptarAdvertenciaBorrarDatos').addEventListener('click', function () {
            document.querySelector('.alerta').style.display = "none";
          });
          //Al hacer click en SI
          document.getElementById('btnAceptarAdvertenciaBorrarDatos').addEventListener('click', function () {
            alerta(`<div id="borrarDatosDefinitivo" class="alerta__btn" >Borrar todos los datos</div><div id="cancelarBorrarDatos" class="alerta__btn" >Cancelar</div>`);
            //Al hacer click en Cancelar
            document.getElementById('cancelarBorrarDatos').addEventListener('click', function () {
              document.querySelector('.alerta').style.display = "none";
            });
            //Al hacer click en Borrar Todos los Datos
            document.getElementById('borrarDatosDefinitivo').addEventListener('click', function () {
              localStorage.clear();
              window.location.reload();
            });
          });
        });

        //Al hacer click en la Cambiar Nombre
        document.querySelector('.config__btn--nmbr-prfl').addEventListener('click', function () {
          preguntarNombrePerfil();
        });

        //Al hacer click en la Cambiar Foto
        document.querySelector('.config__btn--ft-prfl').addEventListener('click', function () {
          preguntarFotoPerfil();
        });
      });
    }

    function preguntarFotoPerfil(obligatorio = false) {
      alerta(`<span>Selecciona una nueva foto de perfil</span>` + selectorFtPrfl + `<button id="enviarFtPrfl" class="alerta__btn">Enviar</button>`, obligatorio);
      document.getElementById("enviarFtPrfl").addEventListener('click', function () {
        let radios = document.getElementsByName('selectorFotoPerfil');
        const selectedRadio = Array.from(radios).find(radio => radio.checked); //Foto de perfil seleccionada

        if (selectedRadio) {
          fotoPerfil = selectedRadio.value;
          localStorage.setItem("ftPerfilLF", fotoPerfil);
          document.querySelector('.info-usr__ft').src = images[`${fotoPerfil}.png`];
          document.querySelector('.alerta').style.display = "none";
        }

        document.querySelector("#body").className = '';
        document.querySelector(':root').style.setProperty('--color-efectopantalla', 'transparent');

        if (localStorage.getItem("nombreUsuarioLF") == "Nombre de Usuario") { //Luego de terminar de elegir la foto de perfil si no hay nombre de usuario solicitarlo
          document.querySelector("#body").className = 'efectoPantallaColor';
          document.querySelector(':root').style.setProperty('--color-efectopantalla', 'var(--efecto-pantalla-negro)');
          preguntarNombrePerfil(true);
        }
      });
    }

    function preguntarNombrePerfil(obligatorio = false, mensajeEspecial = "") {
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
  })
  return (
    <div className="cont-inicio"> {/*CONTENEDOR PRINCIPAL*/}
      <h1 className="cont-inicio__titulo">Letras<br />Fugitivas</h1>
      <Link to="/info" className="cont-inicio__btn--info"></Link>
      <div className="cont-inicio__btn--conf"></div>

      <div className="info-usr"> {/*INFORMACIÓN DEL USUARIO*/}
        <br /><br /><br />
        <img className="info-usr__ft" src={images["transparente.png"]} alt="foto de perfil"/>
        <p className="info-usr__nmbr">Jugador</p>
        <p className="info-usr__record--clasico">Récord Clásico:<br />{localStorage.getItem("clasicoLF")}</p>
        <p className="info-usr__record--experto">Récord Experto:<br />{localStorage.getItem("expertoLF")}</p>
      </div>

      <div className="cont-botones"> {/*BOTONES PARA JUGAR*/}
        <div className="cont-botones__deco"></div>
        <Link to="/juego/clasico" className="cont-botones__btn--clasico"></Link>
        <Link to="/juego/experto" className="cont-botones__btn--experto"></Link>
      </div>
    </div>
  );
}
