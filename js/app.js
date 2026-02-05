let productosGlobal = [];

fetch("data/productos.json")
  .then(res => res.json())
  .then(productos => {
    productosGlobal = productos;
    mostrarProductos(productos);
  });

function mostrarProductos(productos) {
  const contenedor = document.getElementById("lista-productos");
  contenedor.innerHTML = "";

  productos.forEach(producto => {
    const card = document.createElement("div");
    card.classList.add("producto");

    card.innerHTML = `
      <img src="assents/imagenes/${producto.imagenes[0]}" alt="${producto.nombre}">
      <h3>${producto.nombre}</h3>
      <p>$${producto.precio}</p>
    `;

    card.addEventListener("click", () => {
      window.location.href = `detalle-producto.html?id=${producto.id}`;
    });

    contenedor.appendChild(card);
  });
}

document.querySelectorAll("#filtros button").forEach(btn => {
  btn.addEventListener("click", () => {
    const categoria = btn.dataset.categoria;

    if (categoria === "Todos") {
      mostrarProductos(productosGlobal);
    } else {
      mostrarProductos(
        productosGlobal.filter(p => p.categoria === categoria)
      );
    }
  });
});