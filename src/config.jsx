import alerta from './alerta';
import preguntarNombrePerfil from './preguntarNombrePerfil';
import preguntarFotoPerfil from './preguntarFotoPerfil';
export default function Configuracion({ reiniciar, perfil, reiniciarFunc = function () {}, cerrarFunc = function () {} }) {
    const Seccion = ({ nombre }) => {
        switch (nombre) {
            case "sonido":
                return (<div className="config__seccion">
                    <span className="config__icono--volumen"></span>
                    <span className="config__nmbr">Sonidos</span>
                    <label className="config__marcar">
                        <input className="config__input--volumen" type="checkbox" title="volumen"
                            onChange={function () {
                                localStorage.setItem("sonidoLF", document.querySelector('.config__input--volumen').checked)
                            }} />
                        <div></div>
                    </label>
                </div>);
            case "reiniciar":
                if (!reiniciar) {
                    break;
                }
                return (<div className="config__seccion" id="seccion-config-reiniciar">
                    <span className="config__icono--change"></span>
                    <span className="config__nmbr">Reiniciar</span>
                    <button className="config__btn config__btn--reiniciar" onClick={reiniciarFunc} >Reiniciar</button>
                </div>);
            case "perfil":
                if (!perfil) {
                    break;
                }
                return (<div className="config__seccion" id="seccion-config-prfl">
                    <span className="config__icono--usr"></span>
                    <span className="config__nmbr">Perfil</span>
                    <div className="config__cont-btn">
                        <button className="config__btn config__btn--nmbr-prfl" onClick={preguntarNombrePerfil}>Cambiar Nombre</button>
                        <button className="config__btn config__btn--ft-prfl" onClick={preguntarFotoPerfil}>Cambiar Foto</button>
                    </div>
                </div>);
            case "borrar":
                return (<div className="config__seccion" id="seccion-config-borrar-dts">
                    <span className="config__icono--basura"></span>
                    <span className="config__nmbr">Borrar Datos</span>
                    <button className="config__btn config__btn--borr-dts" onClick={
                        function () {
                            alerta(`<span>¿Está seguro que desea eliminar definitivamente todo su progreso?</span><br><div id="btnAceptarAdvertenciaBorrarDatos" class="alerta__btn" >SÍ</div><div id="btnNOAceptarAdvertenciaBorrarDatos" class="alerta__btn" >NO</div>`)
                            //Al hacer click en NO
                            document.getElementById('btnNOAceptarAdvertenciaBorrarDatos').addEventListener('click', function () {
                                document.querySelector('.alerta').style.display = "none";
                            });
                            //Al hacer click en SI
                            document.getElementById('btnAceptarAdvertenciaBorrarDatos').addEventListener('click', function () {
                                alerta(`<div id="borrarDatosDefinitivo" class="alerta__btn" >Borrar todos los datos</div><div id="cancelarBorrarDatos" class="alerta__btn" >Cancelar</div>`);
                                //Al hacer click en Cancelar
                                document.getElementById('cancelarBorrarDatos').addEventListener('click', function () {
                                    document.querySelector('.alerta').style.display = "none";
                                });
                                //Al hacer click en Borrar Todos los Datos
                                document.getElementById('borrarDatosDefinitivo').addEventListener('click', function () {
                                    localStorage.clear();
                                    window.location.reload();
                                });
                            });
                        }
                    }>BORRAR</button>
                </div>);
            default:
                break;
        }
    }
    return (<div className="config"> {/*MENÚ DE CONFIGURACIÓN*/}
        <div className="config__btn-cerrar" onClick={
            function () {
                document.querySelector('.config').style.display = 'none';
                document.querySelector(':root').style.setProperty('--color-efectopantalla', 'transparent');
                cerrarFunc();
            }
        }></div>
        <span className="config__titulo">Ajustes</span>
        <Seccion nombre="sonido" />
        <Seccion nombre="reiniciar" />
        <Seccion nombre="perfil" />
        <Seccion nombre="borrar" />
    </div>);
}