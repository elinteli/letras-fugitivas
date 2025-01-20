import React from 'react';
import { useEffect } from 'react';
import { Route, BrowserRouter, Routes } from 'react-router-dom';
import './App.css';
import Menu from './Menu';
import Juego from './Juego';
import RevisarJuego from './RevisarJuego';
import Info from './Info';
import images from './utils/importImages';
import alerta from './alerta';

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
    const diarioLF = localStorage.getItem("diarioLF");
    const fechaActual = (new Date()).toLocaleDateString();
    if (!diarioLF || (JSON.parse(diarioLF)[0] != fechaActual)) {
      localStorage.setItem("diarioLF", JSON.stringify([fechaActual, false]));
    }
  }
  function setLocalStorage(nombre, defaultValue) {
    let valor = getLocalStorage(nombre, defaultValue);
    localStorage.setItem(nombre, valor);
    return valor;
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
          <Route path="/menu/:pagina" element={<Menu alerta={alerta} cambiarFondo={cambiarFondo} setLocalStorage={setLocalStorage}/>} />
          <Route path="/juego/:modoJuego" element={<Juego alerta={alerta} />} />
          <Route path="/revisar-juego/:info" element={<RevisarJuego alerta={alerta} />} />
          <Route path="/info" element={<Info alerta={alerta} />} />
          <Route path="*" element={<Menu alerta={alerta} cambiarFondo={cambiarFondo} setLocalStorage={setLocalStorage}/>} />
        </Routes>
      </BrowserRouter>

      <div className="alerta">
        <span className='alerta__cerrar' onClick={(event) => { event.target.parentElement.style.display = "none"; }}>
          &#215;
        </span>
        <span className="alerta__mensaje"></span>
      </div>
    </div>
  );
}
