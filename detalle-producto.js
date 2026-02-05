const WHATSAPP = "56912345678";
const id = parseInt(new URLSearchParams(window.location.search).get("id"));

fetch("data/productos.json")
  .then(res => res.json())
  .then(productos => {
    const p = productos.find(p => p.id === id);
    if (p) cargar(p);
  });

function cargar(p) {
  document.getElementById("nombre").textContent = p.nombre;
  document.getElementById("precio").textContent = p.precio;
  document.getElementById("descripcion").textContent = p.descripcion;

  const medidas = document.getElementById("medidas-container");
  if (p.categoria === "Carritos") {
    medidas.style.display = "none";
  } else {
    document.getElementById("medidas").textContent = p.medidas;
  }

  const principal = document.getElementById("imagen-principal");
  principal.src = `assents/imagenes/${p.imagenes[0]}`;

  const mini = document.getElementById("miniaturas");
  mini.innerHTML = "";

  p.imagenes.forEach(img => {
    const i = document.createElement("img");
    i.src = `assents/imagenes/${img}`;
    i.onclick = () => principal.src = i.src;
    mini.appendChild(i);
  });

  document.getElementById("btn-whatsapp").href =
    `https://wa.me/${WHATSAPP}?text=${encodeURIComponent("Hola, quiero cotizar: " + p.nombre)}`;
}
