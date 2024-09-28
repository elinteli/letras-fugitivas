import React from 'react';
import { useParams, Link } from 'react-router-dom';
import Inicio from './Inicio';
import Tienda from './Tienda';
import DesafioDiario from './DesafioDiario';

export default function Menu({ alerta, cambiarFondo, setLocalStorage }) {
  let { pagina } = useParams();

  function Pagina() {
    if (pagina === "diario") {
      return <DesafioDiario  />;
    } else if (pagina === "tienda") {
      return <Tienda  cambiarFondo={cambiarFondo} />;
    }
    return <Inicio  setLocalStorage={setLocalStorage} />;
  }

  return (
    <div>
        <Pagina />
        <div className="menu-inf--inicio"> {/* MENÚ INFERIOR MENU*/}
          <Link to="/menu/diario" className={pagina == "diario" ? "menu-inf__diario--activo" : "menu-inf__diario"} onClick={function () {
            document.querySelector(".menu-inf--inicio").children[0].className = "menu-inf__diario--activo";
            document.querySelector(".menu-inf--inicio").children[1].className = "menu-inf__inicio";
            document.querySelector(".menu-inf--inicio").children[2].className = "menu-inf__tienda";
          }}></Link>
          <Link to="/menu/inicio" className={(pagina != "diario" && pagina != "tienda") ? "menu-inf__inicio--activo" : "menu-inf__inicio"} onClick={function () {
            document.querySelector(".menu-inf--inicio").children[0].className = "menu-inf__diario";
            document.querySelector(".menu-inf--inicio").children[1].className = "menu-inf__inicio--activo";
            document.querySelector(".menu-inf--inicio").children[2].className = "menu-inf__tienda";
          }}></Link>
          <Link to="/menu/tienda" className={pagina == "tienda" ? "menu-inf__tienda--activo" : "menu-inf__tienda"} onClick={function () {
            document.querySelector(".menu-inf--inicio").children[0].className = "menu-inf__diario";
            document.querySelector(".menu-inf--inicio").children[1].className = "menu-inf__inicio";
            document.querySelector(".menu-inf--inicio").children[2].className = "menu-inf__tienda--activo";
          }}></Link>
        </div>
    </div>
  );
}
