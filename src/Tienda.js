import React from 'react';
import { useEffect } from 'react';
import images from './utils/importImages';

export default function Tienda({ alerta, cambiarFondo }) {
    let monedasValor;
    let fondoSeleccionado;
    function PurchaseCard({ item, price, amount, imageName, currency = "moneda" }) {
        const nameInUpperCase = item.toUpperCase();
        const mostrarIconoMoneda = currency == "moneda" ? "--money-icon" : "";
        const alApretarBtn = () => {
            if (price == "Anuncio") {
                return alerta('No tenemos anuncios disponibles para ofrecerte.');
            }
            const alApretarBtnComprar = () => {
                let precio = price;
                precio = Number(precio.replace("$", "").replace(".", "#")); //Cambio el punto por la almoadilla para que de que hubo un error, cuando funcione la compra con plata de verdad lo tengo que arreglar
                if (!precio) {
                    return alerta('Hubo un error durante la compra.');
                }
                comprarObjecto(precio, function () {
                    const nuevoValor = Number(localStorage.getItem(item + "LF")) + Number(amount);
                    localStorage.setItem(item + "LF", nuevoValor);
                    const abrevItem = item.substring(0, 3); //monedas ---> mon    cambios ----> cam
                    document.querySelector('.menu-sup__valor--' + abrevItem).innerHTML = nuevoValor;
                });
            }
            const mensaje = (
                `¿Querés comprar ${amount} ${item}s?<br />
                <div class='alerta__btn'>
                    ${price} <div class="alerta__${currency}"></div>
                </div>`
            );
            alerta(mensaje, false, alApretarBtnComprar);
        }
        return (
            <div className="purchase-card" onClick={alApretarBtn}>
                <img className="purchase-card__img" src={images[imageName]} alt="imagen con objeto/s adquirible/s"/>
                <span className="purchase-card__info">{amount} {nameInUpperCase}S</span>
                <div className={`purchase-card__btn${mostrarIconoMoneda}`}>{price}</div>
            </div>
        );
    }

    function ButtonBackground({ id, price }) {
        const identificadorFondo = id;
        let fondoBloqueado = JSON.parse(localStorage.getItem("fondoBloq"+identificadorFondo+"LF"));
        let fondoSeleccionado = localStorage.getItem("fondoLF");
        let bgStatus = fondoBloqueado;
        let cssModifier = bgStatus 
        ? (identificadorFondo == fondoSeleccionado ? "--selcc" : "") 
        : "--blkdo";
        if (fondoSeleccionado == identificadorFondo && !bgStatus) {
            cambiarFondo("0");
            fondoSeleccionado = 0;
        }
        const alApretarBtnFondo = () => {
            if (!bgStatus) { //Si esta bloqueado
                const mensaje = (
                    `¿Querés comprar este fondo?<br/>
                    <img class="alerta__img" src=${images[identificadorFondo + ".jpg"]} alt="imagen de fondo"/><br/>
                    <div class="alerta__cont-btns">
                        <div id='comprar-fondo-alerta' class='alerta__btn'>
                            ${price}
                            <div class="alerta__moneda"></div>
                        </div>
                        <div id='probar-fondo-alerta' class='alerta__btn'>Probar</div>
                    </div>`
                );
                alerta(mensaje);
                //Al apretar probar fondo
                document.querySelector('#probar-fondo-alerta').addEventListener('pointerdown', function () {
                    cambiarFondo(identificadorFondo, false); //cambiar el fondo al que seleccione para probar, no guardarlo como definitivo
                });
                //Al dejar de apretar el boton probar fondo
                document.querySelector('#probar-fondo-alerta').addEventListener('pointerup', function () {
                    cambiarFondo(localStorage.getItem("fondoLF"));
                });
                //Al apretar comprar fondo
                document.querySelector('#comprar-fondo-alerta').addEventListener('click', function () {
                    const precio = Number(price.replace("$", ""));
                    if (!precio) {
                        return alerta('Hubo un error durante la compra.');
                    }
                    comprarObjecto(precio, function () {
                        document.querySelector('.cont-fondos__fondo--selcc').className = 'cont-fondos__fondo'; //Sacar el seleccionado al fondo anterior
                        document.querySelector("#btn-fondo-"+identificadorFondo).className = 'cont-fondos__fondo--selcc';// saco el bloqueo del fondo
                        cambiarFondo(identificadorFondo);
                        fondoBloqueado = true;
                        fondoSeleccionado = identificadorFondo;
                        bgStatus = true;
                        localStorage.setItem("fondoBloq"+identificadorFondo+"LF", fondoBloqueado);
                    });
                });
            }
            else { //Si esta desbloqueado
                document.querySelector('.cont-fondos__fondo--selcc').className = 'cont-fondos__fondo'; //Sacar el seleccionado al fondo anterior
                document.querySelector("#btn-fondo-"+identificadorFondo).classList.add('cont-fondos__fondo--selcc'); // seleccionar el fondo
                cambiarFondo(identificadorFondo); //cambio el fondo
                fondoSeleccionado = identificadorFondo;
            }
        }
        return (
            <div id={"btn-fondo-"+identificadorFondo} className={`cont-fondos__fondo${cssModifier}`} onClick={alApretarBtnFondo}>
                <picture className="cont-fondos__cont-img">
                    <img className="cont-fondos__img" src={images[identificadorFondo + ".jpg"]} alt="imagen de fondo"/>
                </picture>
                <div className="cont-fondos__info">{price}</div>
            </div>
        );
    }

    function comprarObjecto(valor, ejecutarCodigo = function () { }) {
        if (monedasValor - valor >= 0) {
            alerta('Se compró exitosamente');
            monedasValor -= valor;
            ejecutarCodigo();
        } else {
            alerta('No tienes monedas suficientes');
        }
        document.querySelector('.menu-sup__valor--mon').innerHTML = monedasValor;
        localStorage.setItem("plataLF", monedasValor);
    }
    useEffect(() => {
        monedasValor = Number(localStorage.getItem("plataLF"));

        //Mostrar Valores de monedas, cambios y helantes
        document.querySelector('.menu-sup__valor--cam').innerHTML = localStorage.getItem("cambioLF");
        document.querySelector('.menu-sup__valor--hel').innerHTML = localStorage.getItem("helanteLF");
        document.querySelector('.menu-sup__valor--mon').innerHTML = monedasValor;

        for (let i = 0; i < 4; i++) { //Configurar los botones de informacion sobre los productos
            let botonInfoActual = '.titulo__btn--' + (["monedas", "cambios", "helantes", "fondos"])[i];
            document.querySelector(botonInfoActual).addEventListener('click', function () { //Si clickeo un boton de info
                let textosInfo = [`Las monedas te permite adquirir objetos dentro del juego. Puedes obtenerlas mediante compras, pero también mediante logros y actividades dentro de la experiencia de juego.`, `Los "Cambios" son objetos especiales adquirible que  te posibilitan intercambiar una ronda de palabras que resulte difícil de descifrar para ti.`, `Los "Helantes" son objetos especiales adquiribles que te dan 3 segundos extra para poder encontrar la letra correcta.`, `Adquiere fondos personalizados para modificar la apariencia del juego.`]
                alerta(textosInfo[i]);
            });
        }
    });
    return (
        <div>
            <div className="cont-inicio--tienda"> {/*CONTENEDOR PRINCIPAL*/}
                <div className="cont-inicio__contenido">
                    <div className="titulo"> {/*TÍTULO MONEDAS*/}
                        <h3 className="titulo__h3">Monedas</h3>
                        <div className="titulo__btn--monedas"></div>
                    </div>
                    <div className="cont-monedas"> {/*MONEDAS*/}
                        <PurchaseCard item="moneda" price="$0.99" amount="40" imageName={"monedas-pila.png"} currency='usd' />
                        <PurchaseCard item="moneda" price="$1.99" amount="100" imageName={"monedas-jarron.png"} currency='usd' />
                        <PurchaseCard item="moneda" price="$2.49" amount="180" imageName={"monedas-cofre.png"} currency='usd' />
                        <PurchaseCard item="moneda" price="Anuncio" amount="3" imageName={"monedas-pila.png"} currency='usd' onClick={function () {
                            monedasValor += 3;
                            document.querySelector('.menu-sup__valor--mon').innerHTML = monedasValor;
                            localStorage.setItem('plataLF', monedasValor);
                        }} />
                    </div>

                    <div className="titulo"> {/*TÍTULO CAMBIOS*/}
                        <h3 className="titulo__h3">Cambios</h3>
                        <div className="titulo__btn--cambios"></div>
                    </div>

                    <div className="cont-cambios"> {/*CAMBIOS*/}
                        <PurchaseCard item="cambio" price="$15" amount="5" imageName={"cambios-caja.png"} />
                        <PurchaseCard item="cambio" price="$40" amount="20" imageName={"cambios-sobre-madera.png"} />
                    </div>

                    <div className="titulo"> {/*TÍTULO HELANTES*/}
                        <h3 className="titulo__h3">Helantes</h3>
                        <div className="titulo__btn--helantes"></div>
                    </div>

                    <div className="cont-helantes"> {/*HELANTES*/}
                        <PurchaseCard item="helante" price="$25" amount="10" imageName={"helantes-muchos.png"} />
                        <PurchaseCard item="helante" price="$40" amount="20" imageName={"helantes-barco.png"} />
                        <PurchaseCard item="helante" price="$70" amount="40" imageName={"helantes-piramide.png"} />
                        <PurchaseCard item="helante" price="Anuncio" amount="1" imageName={"helantes-pocos.png"} />
                    </div>

                    <div className="titulo"> {/*TÍTULO FONDOS*/}
                        <h3 className="titulo__h3">Fondos</h3>
                        <div className="titulo__btn--fondos"></div>
                    </div>

                    <div className="cont-fondos"> {/*FONDOS*/}
                        <ButtonBackground id={0} price="$0" />
                        <ButtonBackground id={1} price="$0" />
                        <ButtonBackground id={2} price="$0" />
                        <ButtonBackground id={3} price="$0" />
                        <ButtonBackground id={4} price="$15" />
                        <ButtonBackground id={5} price="$20" />
                        <ButtonBackground id={6} price="$30" />
                        <ButtonBackground id={7} price="$75" />
                        <ButtonBackground id={8} price="$75" />
                        <ButtonBackground id={9} price="$85" />
                    </div>
                </div>
                <div className="menu-sup"> {/*MENÚ SUPERIOR*/}
                    <div className="menu-sup__moneda">
                        <span className="menu-sup__valor--mon">{localStorage.getItem("plataLF")}</span> {/*VALOR CANTIDAD DE MONEDAS*/}
                        <div className="menu-sup__icon--mon"></div>
                    </div>
                    <div className="menu-sup__moneda">
                        <span className="menu-sup__valor--cam">{localStorage.getItem("cambioLF")}</span> {/*VALOR CANTIDAD DE CAMBIOS*/}
                        <div className="menu-sup__icon--cam"></div>
                    </div>
                    <div className="menu-sup__moneda">
                        <span className="menu-sup__valor--hel">{localStorage.getItem("helanteLF")}</span> {/*VALOR CANTIDAD DE HELANTES*/}
                        <div className="menu-sup__icon--hel"></div>
                    </div>
                </div>
            </div>
        </div>
    );
}
