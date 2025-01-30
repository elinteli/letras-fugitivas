import React from 'react';
import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import dicJsonClasico from './resources/dicClasico.json';
import dicJsonExperto from './resources/dicExperto.json';
import dicJsonRae from './resources/dicRAE.json';
import ciudades from './resources/ciudades.json';
import bopAudio from './sounds/bop.wav';
import gameBonusAudio from './sounds/game-bonus-144751.mp3';
import errorAudio from './sounds/notification-sound-error-sound-effect-203788.mp3';
import Configuracion from './config';

export default function Juego({ alerta }) {
   const { modoJuego } = useParams();
   const modoJuegoEsClasico = modoJuego == "clasico";
   const seed = Number(modoJuegoEsClasico) + new Date().getTime().toString() + Math.random().toString();
   console.log(seed);
   let seedrandom = require('seedrandom');
   let numRonda = 0;
   let generadorNumAleat = seedrandom(seed + "" + numRonda);

   let esRondaEspecial = false;
   const qwerty = ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p", "br", "a", "s", "d", "f", "g", "h", "j", "k", "l", "br", "z", "x", "c", "v", "b", "n", "m"];
   const letras = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "l", "m", "n", "o", "p", "r", "s", "t"];
   let tiempoPartida = modoJuegoEsClasico ? 7 : 10;
   let tiempoRestante = tiempoPartida;
   const bopEfectoSonido = new Audio(bopAudio);
   const acertarEfectoSonido = new Audio(gameBonusAudio);
   const acaboTiempoSonido = new Audio(errorAudio);
   let listaLetrasSelec = []; //Lista de las letras que se seleccionaron
   let pausaTimer = false;
   let puntos = 0;
   let letraSolucion;
   let palabras;
   let puntosHistoricos = Number(localStorage.getItem(modoJuego + "LF"));
   let aciertos = 0;
   let recompenzaAcertar;
   let timerJuego;
   let configAbierto = false;
   let vidas = 3;
   const reiniciar = function () {
      if (!configAbierto) {
         timerJuego = setInterval(updateTime, 100);
      }
      document.querySelector(".vida-3").className = "vida-3";
      document.querySelector(".vida-2").className = "vida-2";
      document.querySelector(".vida-1").className = "vida-1";
      vidas = 3;
      document.querySelector('.config').style.display = 'none';
      document.querySelector(':root').style.setProperty('--color-efectopantalla', 'transparent');
      ocultarEfectoPantallaColor();
      document.querySelector("#body").className = '';
      pausaTimer = false;
      configAbierto = false;

      tiempoPartida = modoJuegoEsClasico ? 7 : 10;
      tiempoRestante = tiempoPartida;
      listaLetrasSelec = []; //Lista de las letras que se seleccionaron
      puntos = 0;
      document.querySelector(".tablero-info__pts").innerHTML = puntos;
      aciertos = 0;
      setPalabras();
   }
   const updateTime = () => {
      const fondoReloj = document.querySelector(".fondo-reloj");
      const TableroPts = document.querySelector(".tablero-info__pts");
      if (!pausaTimer && !configAbierto) {
         tiempoRestante -= 0.1;
      }
      fondoReloj.style.height = tiempoRestante / tiempoPartida * 100 + "%";
      if (tiempoRestante <= 0 && !pausaTimer) {
         //Sonido se acabo el tiempo
         acaboTiempoSonido.currentTime = 0;
         acaboTiempoSonido.play();
         acaboTiempoSonido.volume = JSON.parse(localStorage.getItem("sonidoLF"));

         if (vidas <= 1) {
            pausaTimer = true;
            mostrarEfectoPantallaColor("negro");
            alerta(`Ya no tienes más vidas disponibles<br />
               <div className="alerta__cont-btns"><div class='alerta__btn' id="reiniciar-btn-alerta">Reiniciar</div><a href="/menu/inicio" class="alerta__btn">Inicio</a><a href="/revisar-juego/${seed + "&" + numRonda}" class="alerta__btn">Revisar Juego</a><div/>`, true)
            document.querySelector('#reiniciar-btn-alerta').addEventListener('click', function () {
               document.querySelector(".alerta").style.display = "none";
               ocultarEfectoPantallaColor();
               reiniciar();
            });
            clearInterval(timerJuego);
            return;
         } else {
            document.querySelector(".vida-" + vidas).classList.add("vida-usada");
            vidas--;
         }

         puntos -= 400;
         TableroPts.innerHTML = puntos;
         setTxtPuntosAlerta("-400");

         if (aciertos - 1 < 0) {
            aciertos = 0;
         } else {
            aciertos--;
         }

         mostrarSolucion(letraSolucion);
         pausaTimer = true;
         mostrarEfectoPantallaColor("rojo");
         setTimeout(setPalabras, 2000);
         setTimeout(ocultarEfectoPantallaColor, 300);
      }
   }
   const cerrarConfig = function () {
      ocultarEfectoPantallaColor();
      pausaTimer = false;
      configAbierto = false;
   }
   function onClickBtnConfig() {
      pausaTimer = true;
      configAbierto = true;
      document.querySelector('.config').style.display = 'flex';
      mostrarEfectoPantallaColor("negro");
   }
   function AccionEspecial({ name }) {
      let objetosDisponsibles = Number(localStorage.getItem(`${name}LF`));
      document.querySelector(":root").style.setProperty(`--cantidad-${name}s`, `"${objetosDisponsibles}"`);
      const alApretarBtn = () => {
         if (objetosDisponsibles > 0 && !pausaTimer) {
            //General
            objetosDisponsibles--;
            localStorage.setItem(`${name}LF`, objetosDisponsibles);
            document.querySelector(":root").style.setProperty(`--cantidad-${name}s`, `"${objetosDisponsibles}"`);

            //Cambios
            if (name == "cambio") {
               setPalabras();
            }

            //Helantes
            if (name == "helante") {
               mostrarEfectoPantallaColor("azul");
               pausaTimer = true;
               document.querySelector(".tablero-info__helante").disabled = true;
               setTimeout(function () {
                  pausaTimer = false;
                  document.querySelector(".tablero-info__helante").disabled = objetosDisponsibles <= 0;
                  ocultarEfectoPantallaColor();
               }, 3000);
            }
         }
         document.querySelector(`.tablero-info__${name}`).disabled = objetosDisponsibles <= 0;
      }
      return (<button onClick={alApretarBtn} className={`tablero-info__${name}`} disabled={objetosDisponsibles <= 0}></button>);
   }
   function Teclado() {
      const alApretarTeclado = (e) => {
         let letraClicada = e.target.closest(".teclado__letra");
         if (letraClicada) {
            listaLetrasSelec.push(letraClicada);
            verificarRespuesta(letraClicada.innerHTML);
         }
      }
      return (<div className="teclado" onClick={alApretarTeclado}>
         {qwerty.map((letra, index) => {
            if (letra !== "br") {
               return <div key={index} className="teclado__letra">{letra}</div>;
            } else {
               return <br key={index} />;
            }
         })}
      </div>);
   }
   function setPalabras() {
      palabras = getPalabras();
      document.querySelector(".tabla").className = `tabla ${esRondaEspecial ? "tabla__especial" : ""}`;
      for (let i = 0; i < 5; i++) {
         document.querySelectorAll(".tabla__palabra")[i].innerHTML = palabras[i];
      }
   }
   function getPalabras() {
      numRonda++;
      generadorNumAleat = seedrandom(seed + "" + numRonda);
      if (tiempoPartida > 2) {
         tiempoPartida -= 0.01; //Aumentar la velocidad del tiempo para encontrar la letra
      }
      tiempoRestante = tiempoPartida;
      pausaTimer = false; //Hace que avance el tiempo (pausaTimer = true significa que el tiempo está pausado)
      restablecerColoresLetras();
      letraSolucion = letras[elegirNumeroAleatorio(letras.length)];

      esRondaEspecial = (elegirNumeroAleatorio(10) == 0);
      if (esRondaEspecial) { // 1/10 de probabilidad
         return getPalabrasEspeciales();
      }

      let cincoPalabras = []; //Array con las palabras que se van a mostrar
      for (let i = 0; i < 5; i++) { //Encuentra cinco palabras
         let solucionPalabra = "";
         let palabraIncompleta;
         let diccionario = modoJuegoEsClasico ? dicJsonClasico : ((elegirNumeroAleatorio(2)) ? dicJsonClasico : dicJsonExperto);
         //Diccionario en clasico es facil y en experto hay 50/50 de que sea facil/dificil
         while ((letraSolucion !== solucionPalabra[0] && letraSolucion !== solucionPalabra[1]) || cincoPalabras.includes(palabraIncompleta)) { //Busca una palabra hasta que encuentre una que se pueda resolver con la letra solucion elegida y no sea repetida
            let conjuntoElegido = diccionario[elegirNumeroAleatorio(diccionario.length)];
            let info = quitarLetra(conjuntoElegido);
            palabraIncompleta = info.palabraIncompleta; //Palabra con incognita. Ej: "Com_r"
            solucionPalabra = info.solucion //Ejemplo: solucion es "a", "Pens_r" ---> "Pensar"
         }
         cincoPalabras.push(palabraIncompleta);
      }
      return (cincoPalabras);
   }

   function getPalabrasEspeciales() {
      console.log(numRonda);
      generadorNumAleat = seedrandom(seed + "" + numRonda);
      const categoriaEspecial = "ciudades";
      let cincoPalabras = [`-${categoriaEspecial}-`]; // primera y ultima palabra es la categoria
      let palabrasElegidas = []; //palabras pero completas, sin letras quitadas
      for (let i = 0; i < 3; i++) { // Encontrar tres palabras
         let solucionPalabra = "";
         let dificultadRenglonActual = "";
         let palabraIncompleta;
         let palabraElegida;
         const diccionario = ciudades;
         while (letraSolucion !== solucionPalabra || palabrasElegidas.includes(palabraElegida[0]) || (modoJuegoEsClasico ? dificultadRenglonActual > 4 : dificultadRenglonActual < 7)) { //Busca una palabra hasta que encuentre una que sea con la letra solucion elegida y no sea repetida
            palabraElegida = diccionario[elegirNumeroAleatorio(diccionario.length)];
            let info = quitarLetra(palabraElegida[0]);
            dificultadRenglonActual = palabraElegida[2];
            palabraIncompleta = info.palabraIncompleta; //Palabra con incognita. Ej: "Com_r"
            solucionPalabra = info.solucion //Ejemplo: solucion es "a", "Pens_r" ---> "Pensar"
         }
         cincoPalabras.push(palabraIncompleta);
         palabrasElegidas.push(palabraElegida[0]);
      }
      cincoPalabras.push(`-${categoriaEspecial}-`); // primera y ultima palabra es la categoria
      return (cincoPalabras);
   }

   function mostrarSolucion(letraCorrecta) {
      for (let i = 0; i < 5; i++) {
         document.querySelectorAll(".tabla__palabra")[i].innerHTML = palabras[i].replace(/_/g, `<b>${letraCorrecta}</b>`);
      }
   }
   function ocultarEfectoPantallaColor() {
      document.querySelector(".cont-juego").classList.remove("efectoPantallaColor");
      document.querySelector(":root").style.setProperty("--color-efectopantalla", "transparent");
   }

   function mostrarEfectoPantallaColor(clr) {
      document.querySelector(".cont-juego").classList.add("efectoPantallaColor");
      document.querySelector(":root").style.setProperty("--color-efectopantalla", `var(--efecto-pantalla-${clr})`);
   }

   function Tabla() {
      palabras = getPalabras();
      return (<ul className={`tabla ${esRondaEspecial ? "tabla__especial" : ""}`}>
         <li className="tabla__palabra">{palabras[0]}</li>
         <li className="tabla__palabra">{palabras[1]}</li>
         <li className="tabla__palabra">{palabras[2]}</li>
         <li className="tabla__palabra">{palabras[3]}</li>
         <li className="tabla__palabra">{palabras[4]}</li>
      </ul>);
   }

   function verificarRespuesta(letra) {
      //Si no está pausado
      if (!pausaTimer) {

         // RESPUESTA CORRECTA
         if (letra === letraSolucion) {
            respuestaCorrecta(letra);
         }
         // RESPUESTA INCORRECTA
         else {
            respuestaIncorrecta(letra);
         }

         //Actualizar historico si hay un nuevo record
         if (puntosHistoricos < puntos) {
            puntosHistoricos = puntos;
            localStorage.setItem(modoJuego + "LF", puntos);
            document.querySelector("#puntos-historicos").innerHTML = puntosHistoricos;
         }

         setTimeout(ocultarEfectoPantallaColor, 300);
         document.querySelector(".tablero-info__pts").innerHTML = puntos;
      }
   }

   function elegirNumeroAleatorio(numeroMaximo) {
      return Math.floor(generadorNumAleat() * numeroMaximo);
   }

   function quitarLetra(conjunto) {
      //CASO A: DOS PALABRAS
      if (Array.isArray(conjunto)) {
         const [primeraPalabra, segundaPalabra] = conjunto;
         for (let i = 0; i < primeraPalabra.length; i++) { //Recorrer cada letra de las palabras
         
            if (primeraPalabra[i] !== segundaPalabra[i]) { //Si no coinciden las letras
               const palabraIncompleta = primeraPalabra.slice(0, i) + "_" + primeraPalabra.slice(i + 1);
               const solucion = [primeraPalabra[i], segundaPalabra[i]];
               
               return {
                  palabraIncompleta: palabraIncompleta,
                  solucion: solucion
               };
            }

         }
      }
      //CASO B: UNA PALABRA
      else {
         const letrasPermitidas = new Set(["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "l", "m", "n", "o", "p", "r", "s", "t"]);
         const letras = conjunto.split('');
         const indicesPermitidos = letras
            .map((letra, i) => letrasPermitidas.has(letra.toLowerCase()) ? i : -1)
            .filter(i => i !== -1); //Indices en la palabra donde estan las letras permitidas

         if (indicesPermitidos.length === 0) {
            return { palabraIncompleta: conjunto, solucion: null };
         }

         const indiceAleatorio = indicesPermitidos[elegirNumeroAleatorio(indicesPermitidos.length)];
         const letraQuitada = letras[indiceAleatorio];
         letras[indiceAleatorio] = '_';

         return {
            palabraIncompleta: letras.join(''),
            solucion: letraQuitada
         };
      }
   }

   function setTxtPuntosAlerta(texto) {
      const textoPuntosDiv = document.querySelector(".texto-puntos");
      const ocultarTextoPuntos = setTimeout(() => {
         textoPuntosDiv.innerHTML = ""; // Limpiar contenido
      }, 5000);
      clearTimeout(ocultarTextoPuntos);
      textoPuntosDiv.innerHTML = texto;
      textoPuntosDiv.classList.remove("animacion-aparecerElementoAgrandar");
      void textoPuntosDiv.offsetWidth; // Trigger reflow
      textoPuntosDiv.classList.add("animacion-aparecerElementoAgrandar");
      const posY = elegirNumeroAleatorio(45) + 10;
      const posX = elegirNumeroAleatorio(50) + 15;
      document.querySelector(":root").style.setProperty("--posicion-texto-puntos-y", `${posY}vh`);
      document.querySelector(":root").style.setProperty("--posicion-texto-puntos-x", `${posX}vw`);
   }
   function restablecerColoresLetras() {
      for (let i = 0; i < listaLetrasSelec.length; i++) {
         listaLetrasSelec[i].style.color = "#45200e";
      }
      listaLetrasSelec = [];
   }

   useEffect(() => {
      document.querySelector(".config__input--volumen").checked = JSON.parse(localStorage.getItem("sonidoLF"))

      setTxtPuntosAlerta("");
      timerJuego = setInterval(updateTime, 100);
      document.addEventListener("keydown", (ev) => {
         const letraApretada = ev.key + "";
         if (qwerty.includes(letraApretada)) {
            const letraClicada = Array.from(document.querySelectorAll(".teclado__letra"))
               .filter(element => element.innerHTML == letraApretada);
            listaLetrasSelec.push(letraClicada[0]);
            verificarRespuesta(letraApretada);
         }
      });
   });

   function respuestaCorrecta(letra) {
      mostrarEfectoPantallaColor("verde");
      acertarEfectoSonido.currentTime = 0;
      acertarEfectoSonido.play();
      acertarEfectoSonido.volume = JSON.parse(localStorage.getItem("sonidoLF"));
      aciertos++;
      recompenzaAcertar = 0.99 * (aciertos ** 2) + 27.03 * aciertos + 371.98;
      recompenzaAcertar = (recompenzaAcertar / 10).toFixed() * 10;
      puntos += recompenzaAcertar;
      if (tiempoRestante < (tiempoPartida * 0.5)) { // Si ya paso mas de la mitad del tiempo
         setTxtPuntosAlerta(`¡Correcto!\n+${recompenzaAcertar}`);
      } else {
         setTxtPuntosAlerta(`¡Veloz!\n+${recompenzaAcertar}`);
      }
      setTimeout(setPalabras, 2000);
      mostrarSolucion(letra);
      pausaTimer = true;
   }

   function respuestaIncorrecta(letra) {
      const esSolucionAlternativa = palabras.every(palabra =>
         dicJsonRae.includes(palabra.replace(/_/g, letra))
      );
      if (esSolucionAlternativa) {
         respuestaCorrecta(letra);
         return;
      }
      mostrarEfectoPantallaColor("rojo");
      listaLetrasSelec[listaLetrasSelec.length - 1].style.color = "#840109";
      bopEfectoSonido.currentTime = 0;
      bopEfectoSonido.play();
      bopEfectoSonido.volume = JSON.parse(localStorage.getItem("sonidoLF"));
      if (aciertos - 0.5 < 0) {
         aciertos = 0;
      }
      else {
         aciertos -= 0.5;
      }
      const cantidadPuntosRestar = modoJuegoEsClasico ? 110 : 80;
      puntos -= cantidadPuntosRestar;
      setTxtPuntosAlerta(`-${cantidadPuntosRestar}`);
   }
   return (
      <div className={`cont-juego modo${modoJuego}`}>
         <div className='texto-puntos'></div>
         <div className="tablero-info">
            <Link to="/menu/inicio" className="tablero-info__btn-inicio" onClick={function () { clearInterval(timerJuego) }}></Link>
            <div style={{ backgroundImage: !modoJuegoEsClasico ? "" : "linear-gradient(171deg,#fff4cb 0%, #dcd4bb 20%, #635d51 80%, #635d51 100%)" }} className="tablero-info__pts-hist"><span className="fa-solid fa-crown"></span><span id="puntos-historicos">{puntosHistoricos}</span></div>
            <button className="tablero-info__config" onClick={onClickBtnConfig}></button>
            <AccionEspecial name="helante" />
            <div className="tablero-info__pts">0</div>
            <AccionEspecial name="cambio" />
         </div>
         <div className='corazones-vidas'><div className='vida-1'></div> <div className='vida-2'></div> <div className='vida-3'></div></div>
         <Tabla />
         <br /><br />
         <Teclado />
         <div className="fondo-reloj"></div>
         <Configuracion reiniciar reiniciarFunc={reiniciar} cerrarFunc={cerrarConfig} />
      </div>
   );
}
