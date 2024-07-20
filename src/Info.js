import React from 'react';
import { Link } from 'react-router-dom';

export default function Info({ alerta }) {
  return (
<div className="cont-info">
        <Link to="menu/inicio" className="cont-info__btn"></Link>
        <br /><br /><br /><br />
        <div className="cont-cred">
            <h3 className="cont-cred__titulo">CREDITOS</h3>
            <span className="cont-cred__ppal--1ero">Estudio de Desarrollo: Inteli Games</span><br />
            <span className="cont-cred__ppal--ult">Programación y Diseño: Eli Fainerman</span>
            <span className="cont-cred__sec">Fotografias de fondos personalizados por Eli Fainerman.</span><br />
            <span className="cont-cred__sec">"Icono de ayuda Pista" por <a className="cont-cred__enlace"
                    href="https://www.iconarchive.com/icons/oxygen-icons.org/oxygen/authors.txt" target="_blank"
                    rel="noopener noreferrer">Oxygen Team</a>, obtenido de <a className="cont-cred__enlace"
                    href="https://www.iconarchive.com/show/oxygen-icons-by-oxygen-icons.org/Actions-help-hint-icon.html"
                    target="_blank" rel="noopener noreferrer">Icon Archive</a>, bajo la licencia <a
                    className="cont-cred__enlace" href="https://www.gnu.org/licenses/lgpl-3.0.html" target="_blank"
                    rel="noopener noreferrer">LGPL (Open Source)</a>.</span><br />
            <span className="cont-cred__sec">"Icono de Monedas" por <a className="cont-cred__enlace"
                    href="https://visualpharm.com/" target="_blank" rel="noopener noreferrer">VisualPharm</a>, obtenido
                de <a className="cont-cred__enlace"
                    href="https://www.iconarchive.com/show/finance-icons-by-visualpharm/coins-icon.html" target="_blank"
                    rel="noopener noreferrer">Icon Archive</a>, bajo la licencia <a className="cont-cred__enlace"
                    href="https://creativecommons.org/licenses/by-nd/3.0/" target="_blank" rel="noopener noreferrer">CC
                    BY-ND 3.0</a>.</span><br />
            <span className="cont-cred__sec">"Sonido Cmaj(Direct).wav" por <a className="cont-cred__enlace"
                    href="https://freesound.org/people/Everdream/" target="_blank"
                    rel="noopener noreferrer">Everdream</a>, obtenido de <a className="cont-cred__enlace"
                    href="https://freesound.org/people/Everdream/sounds/80488/" target="_blank"
                    rel="noopener noreferrer">FreeSound</a>, bajo la licencia <a className="cont-cred__enlace"
                    href="https://creativecommons.org/licenses/sampling+/1.0/" target="_blank"
                    rel="noopener noreferrer">CC SAMPLING+ 1.0</a>.</span><br />
            <span className="cont-cred__sec">"Textura de papel rayado" por <a className="cont-cred__enlace"
                    href="http://www.paranaiv.no/" target="_blank" rel="noopener noreferrer">Are Sundnes</a>, obtenida
                de <a className="cont-cred__enlace" href="https://www.toptal.com/designers/subtlepatterns/lined-paper/"
                    target="_blank" rel="noopener noreferrer">Toptal Subtle Patterns</a>, bajo la licencia <a
                    className="cont-cred__enlace" href="https://creativecommons.org/licenses/by-sa/3.0/" target="_blank"
                    rel="noopener noreferrer">CC BY-SA 3.0.</a> Sin modificaciones realizadas.</span><br />
            <span className="cont-cred__sec">"Patrón de madera hermosa" por <a className="cont-cred__enlace"
                    href="http://www.purtypixels.com/" target="_blank" rel="noopener noreferrer">Richard Tabor</a>,
                obtenido de <a className="cont-cred__enlace"
                    href="https://www.toptal.com/designers/subtlepatterns/purty-wood/" target="_blank"
                    rel="noopener noreferrer">Toptal Subtle Patterns</a>, bajo la licencia <a className="cont-cred__enlace"
                    href="https://creativecommons.org/licenses/by-sa/3.0/" target="_blank" rel="noopener noreferrer">CC
                    BY-SA 3.0.</a> Modificaciones realizadas para adaptar el patrón.</span><br />
            <span className="cont-cred__sec">"Patrón de madera" por Alexey Usoltsev, obtenido de <a
                    className="cont-cred__enlace" href="https://www.toptal.com/designers/subtlepatterns/wood-pattern/"
                    target="_blank" rel="noopener noreferrer">Toptal Subtle Patterns</a>, bajo la licencia <a
                    className="cont-cred__enlace" href="https://creativecommons.org/licenses/by-sa/3.0/" target="_blank"
                    rel="noopener noreferrer">CC BY-SA 3.0.</a> Modificaciones realizadas para adaptar el
                patrón.</span><br />
        </div>
        <br />
    </div>
  );
}
