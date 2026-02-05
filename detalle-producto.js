const WHATSAPP_NEGOCIO = "56912345678";

const params = new URLSearchParams(window.location.search);
const idProducto = parseInt(params.get("id"));

fetch("data/productos.json")
  .then(res => res.json())
  .then(productos => {
    const producto = productos.find(p => p.id === idProducto);
    if (producto) cargarProducto(producto);
  });

function cargarProducto(producto) {
  document.getElementById("nombre").textContent = producto.nombre;
  document.getElementById("precio").textContent = producto.precio;
  document.getElementById("descripcion").textContent = producto.descripcion;
  document.getElementById("medidas").textContent = producto.medidas;

  const imgPrincipal = document.getElementById("imagen-principal");
  imgPrincipal.src = `assents/imagenes/${producto.imagenes[0]}`;

  const miniaturas = document.getElementById("miniaturas");
  miniaturas.innerHTML = "";

  producto.imagenes.forEach(img => {
    const imagen = document.createElement("img");
    imagen.src = `assents/imagenes/${img}`;
    imagen.addEventListener("click", () => {
      imgPrincipal.src = imagen.src;
    });
    miniaturas.appendChild(imagen);
  });

  const mensaje = encodeURIComponent(
    `Hola, quiero cotizar el arriendo de: ${producto.nombre}`
  );

  document.getElementById("btn-whatsapp").href =
    `https://wa.me/${WHATSAPP_NEGOCIO}?text=${mensaje}`;
}