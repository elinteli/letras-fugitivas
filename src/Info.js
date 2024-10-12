import React from 'react';
import { Link } from 'react-router-dom';

export default function Info({ alerta }) {
        function Credit({ name, author, source, license }) {
                let nombre = name;
                let autor = author;
                let licencia = license;
                let fuente = source;
                let parametros = [nombre, autor, licencia, fuente];
                for (let i = 0; i < 4; i++) {
                        if (typeof parametros[i] == "object") {
                                parametros[i] = <a className="cont-cred__enlace"
                                        href={parametros[i][1]} target="_blank"
                                        rel="noopener noreferrer">{parametros[i][0]}</a>
                        }
                }
                [nombre, autor, licencia, fuente] = parametros;
                if (fuente) fuente = <> obtenido de {fuente},</>;
                return <span className="cont-cred__sec">{nombre} por {autor},{fuente} bajo la licencia {licencia}.</span>
        }
        return (
                <div className="cont-info">
                        <Link to="menu/inicio" className="cont-info__btn"></Link>
                        <div className="cont-cred">
                                <h3 className="cont-cred__titulo">CREDITOS</h3>
                                <span className="cont-cred__ppal--1ero">Estudio de Desarrollo: Inteli Games</span>
                                <span className="cont-cred__ppal--ult">Programación y Diseño: Eli Fainerman</span>
                                <Credit name="Fotografias de fondos personalizados" 
                                        author="Eli Fainerman" 
                                        license={["CC BY-NC 4.0", "https://creativecommons.org/licenses/by-nc/4.0/"]} 
                                />
                                <Credit name='"Icono de ayuda Pista"'
                                        author={["Oxygen Team", "https://www.iconarchive.com/icons/oxygen-icons.org/oxygen/authors.txt"]}
                                        source={["Icon Archive", "https://www.iconarchive.com/show/oxygen-icons-by-oxygen-icons.org/Actions-help-hint-icon.html"]}
                                        license={["LGPL (Open Source)", "https://www.gnu.org/licenses/lgpl-3.0.html"]}
                                />
                                <Credit name='"Icono de Monedas"'
                                        author={["VisualPharm", "https://visualpharm.com/"]}
                                        source={["Icon Archive", "https://www.iconarchive.com/show/finance-icons-by-visualpharm/coins-icon.html"]}
                                        license={["CC BY-ND 3.0", "https://creativecommons.org/licenses/by-nd/3.0/"]}
                                />
                                <Credit name='"Sonido Cmaj(Direct).wav"'
                                        author={["Everdream", "https://freesound.org/people/Everdream/"]}
                                        source={["FreeSound", "https://freesound.org/people/Everdream/sounds/80488/"]}
                                        license={["CC SAMPLING+ 1.0", "https://creativecommons.org/licenses/sampling+/1.0/"]}
                                />
                                <Credit name='"Textura de papel rayado"'
                                        author={["Are Sundnes", "http://www.paranaiv.no/"]}
                                        source={["Toptal Subtle Patterns", "https://www.toptal.com/designers/subtlepatterns/lined-paper/"]}
                                        license={["CC BY-SA 3.0", "https://creativecommons.org/licenses/by-sa/3.0/"]}
                                />
                                <Credit name='"Patrón de madera hermosa"'
                                        author={["Richard Tabor", "http://www.purtypixels.com/"]}
                                        source={["Toptal Subtle Patterns", "https://www.toptal.com/designers/subtlepatterns/purty-wood/"]}
                                        license={["CC BY-SA 3.0", "https://creativecommons.org/licenses/by-sa/3.0/"]}
                                />
                                <Credit name='"Patrón de madera"'
                                        author="Alexey Usoltsev"
                                        source={["Toptal Subtle Patterns", "https://www.toptal.com/designers/subtlepatterns/wood-pattern/"]}
                                        license={["CC BY-SA 3.0", "https://creativecommons.org/licenses/by-sa/3.0/"]}
                                />
                        </div>
                        <br />
                </div>
        );
}
