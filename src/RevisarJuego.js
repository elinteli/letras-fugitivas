import React from 'react';
import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import dicJsonClasico from './resources/dicClasico.json';
import dicJsonExperto from './resources/dicExperto.json';
import ciudades from './resources/ciudades.json';
import seriestv from './resources/seriestv.json';
import bopAudio from './sounds/bop.wav';
import gameBonusAudio from './sounds/game-bonus-144751.mp3';
import errorAudio from './sounds/notification-sound-error-sound-effect-203788.mp3';
import Configuracion from './config';

export default function RevisarJuego({ alerta }) {
   const { info } = useParams();
   const seed = info.split("&")[0];
   const rondaMax = info.split("&")[1];

   // const [isBeforeDisabled, setIsBeforeDisabled] = useState(false);
   // const [isNextDisabled, setIsNextDisabled] = useState(true);
   // const [numRonda, setNumRonda] = useState(rondaMax);
   let numRonda = rondaMax;

   let seedrandom = require('seedrandom');
   let generadorNumAleat = seedrandom(seed + "" + numRonda);

   let esRondaEspecial = false;
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

   
   let categoriaEspecial;

   const ciudadToRegion = new Map();

   ciudades.forEach(entry => {
      const [ciudad, pais, , estado] = entry;
      ciudadToRegion.set(ciudad, estado || pais); // Si hay estado, lo usa; si no, usa el país
    });

   const ciudadToState = new Map();

   ciudades.forEach(([ciudad, pais]) => {
      ciudadToState.set(ciudad, pais);
   });

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
            <button className="controles__start" onClick={function () {
                  numRonda = 1;
                  document.querySelector(".controles__num").innerHTML = numRonda;
                  generadorNumAleat = seedrandom(seed + "" + numRonda);
                  if (numRonda < rondaMax) { 
                     document.querySelector(".controles__next").disabled = false;
                     document.querySelector(".controles__end").disabled = false;
                  }
                  if (numRonda <= 1) { 
                     document.querySelector(".controles__before").disabled = true;
                     document.querySelector(".controles__start").disabled = true;
                  }
                  setPalabras();
            }}></button>
            <button className="controles__before" onClick={function () {
               // if (numRonda > 1) {
                  // if (numRonda-1 <= 1) {
                  //    console.log("minimo");
                  //    // setIsBeforeDisabled(true);
                  //    // setIsNextDisabled(false);
                  // }
                  // if (numRonda-1 < rondaMax) {
                  //    // setIsNextDisabled(false);
                  // }

                  // console.log("------------------------------");
                  // console.log("Antes", numRonda);
                  numRonda--;
                  // console.log("Después (-)", numRonda);
                  document.querySelector(".controles__num").innerHTML = numRonda;
                  generadorNumAleat = seedrandom(seed + "" + numRonda);
                  if (numRonda < rondaMax) { 
                     document.querySelector(".controles__next").disabled = false;
                     document.querySelector(".controles__end").disabled = false;
                  }
                  if (numRonda <= 1) { 
                     document.querySelector(".controles__before").disabled = true;
                     document.querySelector(".controles__start").disabled = true;
                  }
                  setPalabras();
               // }
            }
            }></button>
            <div className="controles__num">{numRonda}</div>
            <button className="controles__next" onClick={function () {
               // if (numRonda < rondaMax) {
                  // if (numRonda+1 > 1) {
                  //    // setIsBeforeDisabled(false);
                  // }
                  // if (numRonda+1 >= rondaMax) {
                  //    console.log("maximo");
                  //    // setIsNextDisabled(true);
                  // }
                  // console.log("------------------------------");
                  // console.log("Antes", numRonda);
                  numRonda++;
                  // console.log("Después (+)", numRonda);
                  document.querySelector(".controles__num").innerHTML = numRonda;
                  generadorNumAleat = seedrandom(seed + "" + numRonda);
                  if (numRonda > 1) { 
                     document.querySelector(".controles__before").disabled = false;
                     document.querySelector(".controles__start").disabled = false;
                  }
                  if (numRonda >= rondaMax) { 
                     document.querySelector(".controles__next").disabled = true;
                     document.querySelector(".controles__end").disabled = true;
                  }
                  setPalabras();
               // }
            }
            }></button>
            <button className="controles__end" onClick={function () {
                  numRonda = rondaMax;
                  document.querySelector(".controles__num").innerHTML = numRonda;
                  generadorNumAleat = seedrandom(seed + "" + numRonda);
                  if (numRonda > 1) { 
                     document.querySelector(".controles__before").disabled = false;
                     document.querySelector(".controles__start").disabled = false;
                  }
                  if (numRonda >= rondaMax) { 
                     document.querySelector(".controles__next").disabled = true;
                     document.querySelector(".controles__end").disabled = true;
                  }
                  setPalabras();
            }
            }></button>
         </div>
      );
   }
   function setPalabras() {
      console.log(rondas);
      if (!rondas[numRonda]) {
         rondas[numRonda] = true;
         palabras = getPalabras();
         localStorage.setItem("ronda-" + numRonda, JSON.stringify({
            palabras: palabras,
            letraSolucion: letraSolucion,
            esRondaEspecial: esRondaEspecial
         }))
      }
      else {
         const infoRonda = JSON.parse(localStorage.getItem("ronda-" + numRonda));
         palabras = infoRonda.palabras;
         letraSolucion = infoRonda.letraSolucion;
         esRondaEspecial = infoRonda.esRondaEspecial;
      }
      document.querySelector(".tabla").className = `tabla ${esRondaEspecial ? "tabla__especial" : ""}`;
      console.log(esRondaEspecial);
      for (let i = 0; i < 5; i++) {
         document.querySelectorAll(".tabla__palabra-div")[i].innerHTML = palabras[i].replace(/_/g, `<b>${letraSolucion}</b>`);
      }
   }

   function getPalabras() {
      generadorNumAleat = seedrandom(seed + "" + numRonda);
      if (tiempoPartida > 2) {
         tiempoPartida -= 0.01; //Aumentar la velocidad del tiempo para encontrar la letra
      }
      tiempoRestante = tiempoPartida;
      pausaTimer = false; //Hace que avance el tiempo (pausaTimer = true significa que el tiempo está pausado)
      letraSolucion = letras[elegirNumeroAleatorio(letras.length)];

      esRondaEspecial = (elegirNumeroAleatorio(2) == 0);
      if (esRondaEspecial) { // 1/10 de probabilidad
         return getPalabrasEspeciales(numRonda);
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
      localStorage.setItem("ronda-" + numRonda, JSON.stringify({
         palabras: cincoPalabras,
         letraSolucion: letraSolucion,
         esRondaEspecial: esRondaEspecial
      }))
      return (cincoPalabras);
   }

   function getPalabrasEspeciales() {
      generadorNumAleat = seedrandom(seed + "" + numRonda);
      const categorias = [["ciudades",ciudades], ["series",seriestv]];
      const indiceCat = elegirNumeroAleatorio(categorias.length);
      categoriaEspecial = categorias[indiceCat][0];
      const diccionario = categorias[indiceCat][1];
      let cincoPalabras = [`${categoriaEspecial.charAt(0).toUpperCase() + categoriaEspecial.slice(1)}`]; // primera y ultima palabra es la categoria
      let palabrasElegidas = []; //palabras pero completas, sin letras quitadas
      for (let i = 0; i < 3; i++) { // Encontrar tres palabras
         let solucionPalabra = "";
         let dificultadRenglonActual = "";
         let palabraIncompleta;
         let palabraElegida;
         while (letraSolucion !== solucionPalabra || palabrasElegidas.includes(palabraElegida[0]) || (modoJuegoEsClasico ? dificultadRenglonActual > 4 : dificultadRenglonActual < 7) || (palabraElegida[0].length > 11)) { //Busca una palabra hasta que encuentre una que sea con la letra solucion elegida y no sea repetida
            palabraElegida = diccionario[elegirNumeroAleatorio(diccionario.length)];
            let info = quitarLetra(palabraElegida[0]);
            dificultadRenglonActual = palabraElegida[2];
            palabraIncompleta = info.palabraIncompleta; //Palabra con incognita. Ej: "Com_r"
            solucionPalabra = info.solucion //Ejemplo: solucion es "a", "Pens_r" ---> "Pensar"
         }
         cincoPalabras.push(palabraIncompleta);
         palabrasElegidas.push(palabraElegida[0]);
      }
      cincoPalabras.push(``); // primera y ultima palabra es la categoria
      localStorage.setItem("ronda-" + numRonda, JSON.stringify({
         palabras: cincoPalabras,
         letraSolucion: letraSolucion,
         esRondaEspecial: esRondaEspecial
      }))
      return (cincoPalabras);
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
      palabras = getPalabras(numRonda);
      rondas[numRonda] = true;
      localStorage.setItem("ronda-" + numRonda, JSON.stringify({
         palabras: palabras,
         letraSolucion: letraSolucion,
         esRondaEspecial: esRondaEspecial
      }))
      return (<ul className={`tabla ${esRondaEspecial ? "tabla__especial" : ""}`}>
         <li className="tabla__palabra"><div className="tabla__palabra-div">{palabras[0].split("_")[0]}{palabras[0].includes("_") ? <b>{letraSolucion}</b> : ""}{palabras[0].split("_")[1]}</div> <div className="tabla__btn-info"></div> </li>
         <li className="tabla__palabra"><div className="tabla__palabra-div">{palabras[1].split("_")[0]}<b>{letraSolucion}</b>{palabras[1].split("_")[1]}</div> <div className="tabla__btn-info"></div> </li>
         <li className="tabla__palabra"><div className="tabla__palabra-div">{palabras[2].split("_")[0]}<b>{letraSolucion}</b>{palabras[2].split("_")[1]}</div> <div className="tabla__btn-info"></div> </li>
         <li className="tabla__palabra"><div className="tabla__palabra-div">{palabras[3].split("_")[0]}<b>{letraSolucion}</b>{palabras[3].split("_")[1]}</div> <div className="tabla__btn-info"></div> </li>
         <li className="tabla__palabra"><div className="tabla__palabra-div">{palabras[4].split("_")[0]}{palabras[4].includes("_") ? <b>{letraSolucion}</b>:""}{palabras[4].split("_")[1]}</div> <div className="tabla__btn-info"></div> </li>
      </ul>);
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
         const letras = (conjunto+"").split('');
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

   useEffect(() => {

      document.querySelector(".controles__next").disabled = true;

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
                  const seccionesTexto = texto.split(">.")[0].replace(/<\/span(?!>)/g, "</span>").split('de ');
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
         const palabraNormalizada = esRondaEspecial ? word : await getBaseForm(word);
         try {            
            const url = esRondaEspecial ?
            `https://es.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(word)}`:
            `https://es.wiktionary.org/w/api.php?action=query&titles=${encodeURIComponent(palabraNormalizada)}&prop=extracts&format=json&origin=*`;
            const response = await fetch(url);
            const data = await response.json();

            if (esRondaEspecial) {
               // Si la página es de desambiguación, buscar otra opción
               if (data.description && data.description.toLowerCase().includes("desambiguación")) {
                  const region = ciudadToRegion.get(word); //Pais o estado de eeuu
                  let descripcion = await searchWikipedia(word+", "+region);
                  if (!descripcion) {
                  descripcion = await searchWikipedia(word+" ("+region+")");
                  }
                  const texto = `<ol><li>${descripcion.slice(0,1).toUpperCase()+descripcion.slice(1)}</li></ol>`
               return descripcion ? [palabraNormalizada,texto] : [palabraNormalizada,"no se encontró una definición."];
               }

               const texto = `<ol><li>${data.description.slice(0,1).toUpperCase()+data.description.slice(1)}</li></ol>`
               return [palabraNormalizada,texto];
            }
            const page = Object.values(data.query.pages)[0];

            if (page?.extract) {
               const parser = new DOMParser();
               const htmlDoc = parser.parseFromString(page.extract, "text/html");
               const definition = htmlDoc.querySelector("dl").cloneNode(true).outerHTML.toString();
               const modDef = definition.replace(/<dl>/g, "<ol>").replace(/<\/dl>/g, "</ol>").replace(/<dd>/g, "<li>").replace(/<\/dd>/g, "</li>");
               const texto = normalizeSpaces(decodeHtmlEntities(modDef));
               console.log(texto);
               return texto ? [palabraNormalizada, texto] : [word, "no se encontró una definición."];
            }
         } catch {
            console.error("Error al procesar la solicitud");
            return word;
         }
      }

      async function searchWikipedia(title) {
         try {
             const response = await fetch(`https://es.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`);
     
             const data = await response.json();
     
             return data ? data.description : null;
         } catch (error) {
             console.error("Error en la búsqueda:", error);
             return null;
         }
     }

      for (let i = 0; i < 5; i++) {
         document.querySelectorAll(".tabla__btn-info")[i].addEventListener("click", async function () {
            const palabra = palabras[i].replace(/_/g, letraSolucion);
            const texto = await getDefinition(palabra);
            const palabraNormalizada = texto[0];
            const definicion = texto[1];
            alerta(`${palabra.toUpperCase()} ${palabra != palabraNormalizada ? `(${palabraNormalizada})` : ""}\n ${definicion}`);
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
