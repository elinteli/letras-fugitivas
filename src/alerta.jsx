export default function alerta(mensaje, required = false, onClick) {
    const alert = document.querySelector('.alerta');
    const cerrarAlert = document.querySelector(".alerta__cerrar");
    const mensajeAlert = document.querySelector(".alerta__mensaje");
    alert.style.display = "inline-block";
    cerrarAlert.style.display = !required ? "inline-block" : "none";//&#215 es la cruz
    mensajeAlert.innerHTML = mensaje;
    if (document.querySelector(".alerta__btn") && onClick) {
      document.querySelector(".alerta__btn").addEventListener("click", onClick)
    }
  }