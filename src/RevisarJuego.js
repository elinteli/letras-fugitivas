import React from 'react';
import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import dicJsonClasico from './resources/dicClasico.json';
import dicJsonExperto from './resources/dicExperto.json';
import dicJsonRae from './resources/dicRAE.json';
import dicAi from './resources/SpanishBFF_0_2.json';
import bopAudio from './sounds/bop.wav';
import gameBonusAudio from './sounds/game-bonus-144751.mp3';
import errorAudio from './sounds/notification-sound-error-sound-effect-203788.mp3';
import Configuracion from './config';

export default function RevisarJuego({ alerta }) {
   const { info } = useParams();
   const seed = info.split("&")[0];
   const rondaMax = info.split("&")[1];

   const [isBeforeDisabled, setIsBeforeDisabled] = useState(false);
   const [isNextDisabled, setIsNextDisabled] = useState(true);
   const [numRonda, setNumRonda] = useState(rondaMax);

   let seedrandom = require('seedrandom');
   let generadorNumAleat = seedrandom(seed+""+numRonda);

   let rondas = [];
   const modoJuego = Number(seed[0]) ? "clasico" : "experto";
   const qwerty = ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p", "br", "a", "s", "d", "f", "g", "h", "j", "k", "l", "br", "z", "x", "c", "v", "b", "n", "m"];
   const letras = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "l", "m", "n", "o", "p", "r", "s", "t"];
   const modoJuegoEsClasico = modoJuego == "clasico";
   let tiempoPartida = modoJuegoEsClasico ? 7 : 10;
   let tiempoRestante = tiempoPartida;
   const bopEfectoSonido = new Audio(bopAudio);
   const acertarEfectoSonido = new Audio(gameBonusAudio);
   const acaboTiempoSonido = new Audio(errorAudio);
   let listaLetrasSelec = []; //Lista de las letras que se seleccionaron
   let pausaTimer = true;
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
      document.querySelector(".vida-3").className = "vida-3";
      document.querySelector(".vida-2").className = "vida-2";
      document.querySelector(".vida-1").className = "vida-1";
      vidas = 3;
      document.querySelector('.config').style.display = 'none';
      document.querySelector(':root').style.setProperty('--color-efectopantalla', 'transparent');
      ocultarEfectoPantallaColor();
      document.querySelector("#body").className = '';
      pausaTimer = true;
      configAbierto = false;

      tiempoPartida = modoJuegoEsClasico ? 7 : 10;
      tiempoRestante = tiempoPartida;
      listaLetrasSelec = []; //Lista de las letras que se seleccionaron
      puntos = 0;
      document.querySelector(".tablero-info__pts").innerHTML = puntos;
      aciertos = 0;
      setPalabras();
   }
   const cerrarConfig = function () {
      ocultarEfectoPantallaColor();
      pausaTimer = true;
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
                  pausaTimer = true;
                  document.querySelector(".tablero-info__helante").disabled = objetosDisponsibles <= 0;
                  ocultarEfectoPantallaColor();
               }, 3000);
            }
         }
         document.querySelector(`.tablero-info__${name}`).disabled = objetosDisponsibles <= 0;
      }
      return (<button onClick={alApretarBtn} className={`tablero-info__${name}`} disabled={objetosDisponsibles <= 0}></button>);
   }
   function Controles() {
      return (
      <div className="controles">
         <button class="controles__before" onClick={function () {
            generadorNumAleat = seedrandom(seed+""+numRonda)
            document.querySelector(".controles__num").innerHTML = numRonda;
            setPalabras();
            if (numRonda-1 <= 1) {
               console.log("minimo");
               setIsBeforeDisabled(true);
               setIsNextDisabled(false);
            }
            if (numRonda-1 < rondaMax) {
               setIsNextDisabled(false);
            }
            
            console.log("ronda: ",numRonda-1);
            setNumRonda(numRonda - 1);
            }
            } disabled={isBeforeDisabled}></button>
         <div class="controles__num">{numRonda}</div>
         <button class="controles__next" onClick={function () {
            generadorNumAleat = seedrandom(seed+""+numRonda)
            document.querySelector(".controles__num").innerHTML = numRonda;
            setPalabras();            
            
            console.log("ronda: ",numRonda+1);
            if (numRonda+1 > 1) {
               setIsBeforeDisabled(false);
            }
            if (numRonda+1 >= rondaMax) {
               console.log("maximo");
               setIsNextDisabled(true);
            }
            
            setNumRonda(numRonda + 1);
            }
            } disabled={isNextDisabled}></button>
      </div>
      );
   }
   function setPalabras() {
      if (!rondas[numRonda]) {
         palabras = getPalabras();
         rondas[numRonda] = {
            palabras: palabras,
            letraSolucion:letraSolucion
         };
      }
      else {
         palabras = rondas[numRonda].palabras;
         letraSolucion = rondas[numRonda].letraSolucion;
      }
      for (let i = 0; i < 5; i++) {
         document.querySelectorAll(".tabla__palabra-div")[i].innerHTML = palabras[i].replace(/_/g, `<b>${letraSolucion}</b>`);
      }
      console.log(rondas)
   }
   function getPalabras() {
      generadorNumAleat = seedrandom(seed+""+numRonda)
      if (tiempoPartida > 2) {
         tiempoPartida -= 0.01; //Aumentar la velocidad del tiempo para encontrar la letra
      }
      tiempoRestante = tiempoPartida;
      pausaTimer = true; //Hace que avance el tiempo (pausaTimer = true significa que el tiempo está pausado)
      restablecerColoresLetras();
      letraSolucion = letras[elegirNumeroAleatorio(letras.length)];
      let palabrasNvlActual = [];
      for (let i = 0; i < 5; i++) {
         let solucionRenglonActual = "";
         let palabraRenglonActual;
         let diccionario = modoJuegoEsClasico
            ? dicJsonClasico /*Si es clasico: palabra facil*/
            : ((elegirNumeroAleatorio(2)) ? dicJsonClasico : dicJsonExperto); //Si es experto: 50% probabilidad de palabra dificil, 50% probabilidad palabra facil
         while (letraSolucion !== solucionRenglonActual || palabrasNvlActual.includes(palabraRenglonActual)) { //Busca una palabra hasta que encuentre una que sea con la letra solucion elegida y no sea repetida
            let parMinimoElegido = diccionario[elegirNumeroAleatorio(diccionario.length)];
            let info = unirPalabras(parMinimoElegido[0], parMinimoElegido[1]);
            palabraRenglonActual = info.palabraIncompleta; //Palabra con incognita. Ej: "Com_r"
            solucionRenglonActual = info.solucion //Ejemplo: solucion es "a", "Pens_r" ---> "Pensar"
         }
         palabrasNvlActual.push(palabraRenglonActual);
      }
      return (palabrasNvlActual);
   }
   function mostrarSolucion(letraCorrecta) {
      for (let i = 0; i < 5; i++) {
         document.querySelectorAll(".tabla__palabra-div")[i].innerHTML = palabras[i].replace(/_/g, `<b>${letraCorrecta}</b>`);
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
      rondas[numRonda] = {
         palabras: palabras,
         letraSolucion:letraSolucion
      };
      return (<ul className="tabla">
         <li className="tabla__palabra"><div className="tabla__palabra-div">{palabras[0].split("_")[0]}<b>{letraSolucion}</b>{palabras[0].split("_")[1]}</div> <div className="tabla__btn-info"></div> </li>
         <li className="tabla__palabra"><div className="tabla__palabra-div">{palabras[1].split("_")[0]}<b>{letraSolucion}</b>{palabras[1].split("_")[1]}</div> <div className="tabla__btn-info"></div> </li>
         <li className="tabla__palabra"><div className="tabla__palabra-div">{palabras[2].split("_")[0]}<b>{letraSolucion}</b>{palabras[2].split("_")[1]}</div> <div className="tabla__btn-info"></div> </li>
         <li className="tabla__palabra"><div className="tabla__palabra-div">{palabras[3].split("_")[0]}<b>{letraSolucion}</b>{palabras[3].split("_")[1]}</div> <div className="tabla__btn-info"></div> </li>
         <li className="tabla__palabra"><div className="tabla__palabra-div">{palabras[4].split("_")[0]}<b>{letraSolucion}</b>{palabras[4].split("_")[1]}</div> <div className="tabla__btn-info"></div> </li>
      </ul>);
   }

   function elegirNumeroAleatorio(numeroMaximo) {
      return Math.floor(generadorNumAleat() * numeroMaximo);
   }
   function unirPalabras(palabra1, palabra2) {
      let resultado = palabra1.split("");
      let letraQuitada;
      for (let i = 0; i < palabra1.length; i++) { //Recorrer cada letra de las palabras
         if (palabra1[i] === palabra2[i]) { //Si tienen la misma letra
            continue;
         } else { //Si esa letra es diferente
            resultado[i] = "_"; //Agregar un guion en vez de la letra al resultado
            resultado = resultado.join("");
            //50% solucion es letra 1, 50% solucion es letra 2
            letraQuitada = (elegirNumeroAleatorio(2)) ? palabra1[i] : palabra2[i];
            break;
         }
      }

      return {
         palabraIncompleta: resultado,
         solucion: letraQuitada
      };
   }

   function restablecerColoresLetras() {
      for (let i = 0; i < listaLetrasSelec.length; i++) {
         listaLetrasSelec[i].style.color = "#45200e";
      }
      listaLetrasSelec = [];
   }

   useEffect(() => {
      function decodeHtmlEntities(input) {
         // Crear un elemento temporal para decodificar las entidades HTML
         //&quot; ----> "
         const tempElement = document.createElement("textarea");
         tempElement.innerHTML = input;
         return tempElement.value;
      }

      function normalizeSpaces(input) {
         // Reemplazar cualquier espacio no estándar por espacios normales
         return input.replace(/\s+/g, " ");
      }

      const getBaseForm = async (word) => {
         if (!word || word.trim() === "") {
            console.log("No se ingresó una palabra válida.");
            return;
         }
         try {
            const response = await fetch(
               `https://es.wiktionary.org/w/api.php?action=query&titles=${word}&prop=extracts&format=json&origin=*`
            );
            const data = await response.json();
            const page = Object.values(data.query.pages)[0];

            if (page?.extract) {
               const parser = new DOMParser();
               const htmlDoc = parser.parseFromString(page.extract, "text/html");
               const definition = htmlDoc.querySelector("dl").cloneNode(true).outerHTML.toString();

               const texto = normalizeSpaces(decodeHtmlEntities(definition));
               //Si el texto contiene alguna de estas palabras
               if (['Forma', 'persona del', 'femenino', 'masculino', 'singular', 'plural'].some(palabra => texto.includes(palabra))) {
                  const seccionesTexto = texto.split(">.")[0].replace(/<\/span(?!>)/g,"</span>").split('de ');
                  let elementoCorrecto = seccionesTexto.find(elemento =>
                     elemento.includes("ar</span>") || elemento.endsWith("er</span>") || elemento.endsWith("ir</span>") && seccionesTexto.indexOf(elemento) != 0
                  );
                  console.log(definition);
                  if (!elementoCorrecto) {
                     elementoCorrecto = seccionesTexto.find(elemento =>
                        elemento.includes("<span>") && elemento.endsWith("</span>")
                     );
                  }
                  let palabras = elementoCorrecto.replace(/<\/span>/g, "<span>").split("<span>");
                  palabras = palabras.filter(palabra => palabra.trim() !== "");
                  let palabraEncontrada = palabras.find(palabra =>
                     palabra.endsWith("ar") || palabra.endsWith("er") || palabra.endsWith("ir")
                  );
                  return palabraEncontrada ? palabraEncontrada : palabras[0];
               }
               else {
                  return word;
               }
            }
         } catch {
            console.error("Error al procesar la solicitud");
            return word;
         }
      };

      async function getDefinition(word) {
         const palabraNormalizada = await getBaseForm(word);
         try {
            const response = await fetch(
               `https://es.wiktionary.org/w/api.php?action=query&titles=${palabraNormalizada}&prop=extracts&format=json&origin=*`
            );
            const data = await response.json();
            const page = Object.values(data.query.pages)[0];

            if (page?.extract) {
               const parser = new DOMParser();
               const htmlDoc = parser.parseFromString(page.extract, "text/html");
               const definition = htmlDoc.querySelector("dl").cloneNode(true).outerHTML.toString();
               const modDef = definition.replace(/<dl>/g,"<ol>").replace(/<\/dl>/g,"</ol>").replace(/<dd>/g,"<li>").replace(/<\/dd>/g,"</li>");
               const texto = normalizeSpaces(decodeHtmlEntities(modDef));
               return texto ? [palabraNormalizada,texto] : [word,"no se encontró una definición."];
            }
         } catch {
            console.error("Error al procesar la solicitud");
            return word;
         }
      }

      for (let i = 0; i < 5; i++) {
         document.querySelectorAll(".tabla__btn-info")[i].addEventListener("click", async function () {
            const palabra = palabras[i].replace(/_/g, letraSolucion);
            const texto = await getDefinition(palabra);
            const palabraNormalizada = texto[0];
            const definicion = texto[1];
            alerta(`${palabra.toUpperCase()} ${palabra != palabraNormalizada ? `(${palabraNormalizada})`:""}\n ${definicion}`);
         });
      }

      document.querySelector(".vida-3").style.opacity = 0;
      document.querySelector(".vida-2").style.opacity = 0;
      document.querySelector(".vida-1").style.opacity = 0;

      document.querySelector(".config__input--volumen").checked = JSON.parse(localStorage.getItem("sonidoLF"))

   });

   return (
      <div className={`cont-juego modo${modoJuego}`}>
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
         <Controles />
         <Configuracion reiniciar reiniciarFunc={reiniciar} cerrarFunc={cerrarConfig} />
      </div>
   );
}
