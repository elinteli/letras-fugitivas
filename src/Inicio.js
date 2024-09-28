import React from 'react';
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import images from './utils/importImages';
import preguntarNombrePerfil from './preguntarNombrePerfil';
import preguntarFotoPerfil from './preguntarFotoPerfil';
import Configuracion from './config';

export default function Inicio({ alerta, setLocalStorage }) {
  useEffect(() => {
    document.querySelector(".config__input--volumen").checked = JSON.parse(localStorage.getItem("sonidoLF"))

    let fotoPerfil = setLocalStorage("ftPerfilLF", "transparente");
    let nombreDeUsuario = setLocalStorage("nombreUsuarioLF", "Nombre de Usuario");

    if (fotoPerfil == "transparente") {
      document.querySelector(".cont-inicio").classList.add("efectoPantallaColor");
      document.querySelector(':root').style.setProperty('--color-efectopantalla', 'var(--efecto-pantalla-negro)');
      preguntarFotoPerfil(true);
      fotoPerfil = localStorage.getItem("ftPerfilLF");
    } else if (nombreDeUsuario == "Nombre de Usuario") {
      document.querySelector(".cont-inicio").classList.add("efectoPantallaColor");
      document.querySelector(':root').style.setProperty('--color-efectopantalla', 'var(--efecto-pantalla-negro)');
      preguntarNombrePerfil(true);
      nombreDeUsuario = localStorage.getItem("nombreUsuarioLF");
    }
    document.querySelector('.info-usr__ft').src = images[`${fotoPerfil}.png`];
    document.querySelector('.info-usr__nmbr').innerHTML = nombreDeUsuario;
  })
  return (
    <div className="cont-inicio"> {/*CONTENEDOR PRINCIPAL*/}
      <h1 className="cont-inicio__titulo">Letras Fugitivas</h1>
      <Link to="/info" className="cont-inicio__btn--info"></Link>
      <div className="cont-inicio__btn--conf" onClick={
        function () {
          document.querySelector('.config').style.display = 'flex';
          document.querySelector(".cont-inicio").classList.add("efectoPantallaColor");
          document.querySelector(':root').style.setProperty('--color-efectopantalla', 'var(--efecto-pantalla-negro)');
          }
      }></div>

      <div className="info-usr"> {/*INFORMACIÓN DEL USUARIO*/}
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
      <Configuracion perfil cerrarFunc={function(){
        document.querySelector(".cont-inicio").classList.remove("efectoPantallaColor");
        }} />
    </div>
  );
}
