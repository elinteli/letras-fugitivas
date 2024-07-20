import React from 'react';
import { useEffect } from 'react';
import dicJsonClasico from './resources/dicClasico.json';
import dicJsonExperto from './resources/dicExperto.json';
import dicJsonRae from './resources/dicRAE.json';
import bopAudio from './sounds/bop.wav';
import gameBonusAudio from './sounds/game-bonus-144751.mp3';

export default function DesafioDiario({ alerta }) {
    let seedrandom = require('seedrandom');
    const modoJuego = "clasico";
    let diario = JSON.parse(localStorage.getItem("diarioLF"));
    const generadorNumAleat = seedrandom(diario[0]);
    document.querySelector(":root").style.setProperty("--content-fecha-checkbox", `var(--caracter-checkbox-${diario[1]})`);
    const qwerty = ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p", "a", "s", "d", "f", "g", "h", "j", "k", "l", "z", "x", "c", "v", "b", "n", "m"];
    const letras = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "l", "m", "n", "o", "p", "r", "s", "t"];
    const modoJuegoEsClasico = false;
    let volumenSnd = JSON.parse(localStorage.getItem("sonidoLF"));
    const bopEfectoSonido = new Audio(bopAudio);
    const acertarEfectoSonido = new Audio(gameBonusAudio);
    let listaLetrasSelec = []; //Lista de las letras que se seleccionaron
    let letraSolucion;
    let palabras;

    function Teclado() {
       const alApretarTeclado = (e) => {
          let letraClicada = e.target.closest(".teclado__letra");
          if (letraClicada) {
             listaLetrasSelec.push(letraClicada);
             verificarRespuesta(letraClicada.innerHTML);
          }
       }
       return (<div className="teclado" onClick={alApretarTeclado}>
          {qwerty.map((letra, index) => (
             <div key={index} className="teclado__letra">{letra}</div>
          ))}
       </div>);
    }
    function setPalabras() {
       palabras = getPalabras();
       for (let i = 0; i < 5; i++) {
          document.querySelectorAll(".tabla__palabra")[i].innerHTML = palabras[i];
       }
    }
    function getPalabras() {
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
          document.querySelectorAll(".tabla__palabra")[i].innerHTML = palabras[i].replace(/_/g, `<b>${letraCorrecta}</b>`);
       }
    }
    function ocultarEfectoPantallaColor() {
       document.body.classList.remove("efectoPantallaColor");
       document.querySelector(":root").style.setProperty("--color-efectopantalla", "transparent");
    }
 
    function mostrarEfectoPantallaColor(clr) {
       document.body.classList.add("efectoPantallaColor");
       document.querySelector(":root").style.setProperty("--color-efectopantalla", `var(--efecto-pantalla-${clr})`);
    }
 
    function Tabla() {
       palabras = getPalabras();
       return (<ul className="tabla">
          <li className="tabla__palabra">{palabras[0]}</li>
          <li className="tabla__palabra">{palabras[1]}</li>
          <li className="tabla__palabra">{palabras[2]}</li>
          <li className="tabla__palabra">{palabras[3]}</li>
          <li className="tabla__palabra">{palabras[4]}</li>
       </ul>);
    }
 
    function verificarRespuesta(letra) {
       //Si no está pausado
          // RESPUESTA CORRECTA
          if (letra === letraSolucion) {
             respuestaCorrecta(letra);
          }
          // RESPUESTA INCORRECTA
          else {
             respuestaIncorrecta(letra);
          }
 
          setTimeout(ocultarEfectoPantallaColor, 300);
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
 
    function respuestaCorrecta(letra) {
       mostrarEfectoPantallaColor("verde");
       acertarEfectoSonido.currentTime = 0;
       acertarEfectoSonido.play();
       acertarEfectoSonido.volume = volumenSnd;
       mostrarSolucion(letra);
       diario[1] = true;
       localStorage.setItem("diarioLF", JSON.stringify(diario));
       document.querySelector(":root").style.setProperty("--content-fecha-checkbox", `var(--caracter-checkbox-${diario[1]})`);
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
       bopEfectoSonido.volume = volumenSnd;
    }

    useEffect(() => { 
        if (JSON.parse(diario[1])) {
            mostrarSolucion(letraSolucion);
            }
      })
  return (
        <div className="cont-juego--diario"> {/*CONTENEDOR PRINCIPAL*/}
        <div className="cont-juego__contenido">      
            <div className="cont-juego__titulo">Desafio Diario</div> {/*TÍTULO*/}
            <div className="cont-juego__fecha">{diario[0]}</div> {/*FECHA*/}
            <br />
            <Tabla />
            <br /><br />
            <Teclado />
        </div>
    </div>
  );
}
