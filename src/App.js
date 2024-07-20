import React from 'react';
import { useEffect } from 'react';
import { Route, BrowserRouter, Routes } from 'react-router-dom';
import './App.css';
import Menu from './Menu';
import Juego from './Juego';
import Info from './Info';
import images from './utils/importImages';

export default function App() {
  useEffect(() => {
    setLocalStorageValues();
    cambiarFondo(localStorage.getItem("fondoLF"));
  })

  function cambiarFondo(fondoNum, guardarFondoLocStor = true) {
    document.body.style.background = `url(${images[`${fondoNum}.jpg`]}) 0% 0% / auto 100vh fixed`;
    document.querySelector("#body").style.backdropFilter = (fondoNum == 0 ? 'none' : "blur(3px)");
    document.body.style.backgroundSize = (fondoNum == 0 ? '60px' : "auto 100vh");
    if (guardarFondoLocStor) {
      localStorage.setItem("fondoLF", fondoNum);
    }
  }

  function alerta(mensaje, required = false, onClick) {
    const alert = document.querySelector('.alerta');
    const cerrarAlert = document.querySelector(".alerta__cerrar");
    const mensajeAlert = document.querySelector(".alerta__mensaje");
    alert.style.display = "inline-block";
    cerrarAlert.style.display = !required ? "inline-block" : "none";//&#215 es la cruz
    mensajeAlert.innerHTML = mensaje;
    if (document.querySelector(".alerta__btn") && onClick) {
      document.querySelector(".alerta__btn").addEventListener("click", function () {
        onClick();
      })
    }
  }

  function setLocalStorageValues() {
    setLocalStorage("plataLF", 10);
    for (let i = 0; i < 10; i++) {
      setLocalStorage(`fondoBloq${i}LF`, i < 4); //Solo poner como comprados los 4 primeros
    }
    setLocalStorage("sonidoLF", true);
    setLocalStorage("cambioLF", 5);
    setLocalStorage("fondoLF", 0);
    setLocalStorage("clasicoLF", 0);
    setLocalStorage("expertoLF", 0);
    setLocalStorage("helanteLF", 5);
    setLocalStorage("ftPerfilLF", "transparente");
    setLocalStorage("nombreUsuarioLF", "Nombre de Usuario");
    const diarioLF = localStorage.getItem("diarioLF");
    const fechaActual = (new Date()).toLocaleDateString();
    if (!diarioLF || (JSON.parse(diarioLF)[0] != fechaActual)) {
      setLocalStorage("diarioLF", JSON.stringify([fechaActual, false]));
    }
  }
  function setLocalStorage(nombre, defaultValue) {
    localStorage.setItem(nombre, getLocalStorage(nombre, defaultValue));
    /*Recupera el valor del item solicitado y si este no existe asigna el valor por defecto*/
  }
  function getLocalStorage(nombre, valorPorDefecto) {
    /*Si existe: devolver su valor
    Si no existe: devolver el valor por defecto*/
    return localStorage.getItem(nombre) ? localStorage.getItem(nombre) : valorPorDefecto;
  }

  return (
    <div id='body'>
      <BrowserRouter>
        <Routes>
          <Route path="/menu/:pagina" element={<Menu alerta={alerta} cambiarFondo={cambiarFondo} />} />
          <Route path="/juego/:modoJuego" element={<Juego alerta={alerta} />} />
          <Route path="/info" element={<Info alerta={alerta} />} />
          <Route path="*" element={<Menu alerta={alerta} cambiarFondo={cambiarFondo} />} />
        </Routes>
      </BrowserRouter>

      <div className="alerta">
        <span className='alerta__cerrar' onClick={(event) => { event.target.parentElement.style.display = "none"; }}>
          &#215;
        </span>
        <span className="alerta__mensaje"></span>
      </div> {/*ALERTAS / NOTIFICACIONES*/}

      <div className="config"> {/*MENÚ DE CONFIGURACIÓN*/}
        <div className="config__btn-cerrar"></div>
        <span className="config__titulo">Ajustes</span>
        <div className="config__seccion">
          <span className="config__icono--volumen"></span>
          <span className="config__nmbr">Sonidos</span>
          <label className="config__marcar">
            <input className="config__input--volumen" type="checkbox" title="volumen" />
            <div></div>
          </label>
        </div>
        <div className="config__seccion" id="seccion-config-reiniciar">
          <span className="config__icono--change"></span>
          <span className="config__nmbr">Reiniciar</span>
          <button className="config__btn config__btn--reiniciar">Reiniciar</button>
        </div>
        <div className="config__seccion" id="seccion-config-prfl">
          <span className="config__icono--usr"></span>
          <span className="config__nmbr">Perfil</span>
          <button className="config__btn config__btn--nmbr-prfl">Cambiar Nombre</button>
          <button className="config__btn config__btn--ft-prfl">Cambiar Foto</button>
        </div>
        <div className="config__seccion" id="seccion-config-borrar-dts">
          <span className="config__icono--basura"></span>
          <span className="config__nmbr">Borrar Datos</span>
          <button className="config__btn config__btn--borr-dts">BORRAR</button>
        </div>
      </div>
    </div>
  );
}
