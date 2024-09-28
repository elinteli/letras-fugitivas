import alerta from './alerta';
import preguntarNombrePerfil from './preguntarNombrePerfil';
import images from './utils/importImages';
export default function preguntarFotoPerfil(obligatorio = false) {
    let fotoPerfil;
    const selectorFtPrfl = `<div class="selectorFotoPerfil" id="selectorFotoPerfil"> <label> <input checked class="radioInputFtPrfl" type="radio" name="selectorFotoPerfil" value="pinguino"> <img class="imgSelectorFtPrfl" src=${images["pinguino.png"]} alt="pinguino"> </label> <label> <input class="radioInputFtPrfl" type="radio" name="selectorFotoPerfil" value="leon"> <img class="imgSelectorFtPrfl" src=${images["leon.png"]} alt="león"> </label> <label> <input class="radioInputFtPrfl" type="radio" name="selectorFotoPerfil" value="tortuga"> <img class="imgSelectorFtPrfl" src=${images["tortuga.png"]} alt="tortuga"> </label> <br> <label> <input class="radioInputFtPrfl" type="radio" name="selectorFotoPerfil" value="ballena"> <img class="imgSelectorFtPrfl" src=${images["ballena.png"]} alt="ballena"> </label> <label> <input class="radioInputFtPrfl" type="radio" name="selectorFotoPerfil" value="buho"> <img class="imgSelectorFtPrfl" src=${images["buho.png"]} alt="buho"> </label> <label> <input class="radioInputFtPrfl" type="radio" name="selectorFotoPerfil" value="abeja"> <img class="imgSelectorFtPrfl" src=${images["abeja.png"]} alt="abeja"> </label> </div>`;
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