let productosGlobal = [];

fetch("data/productos.json")
  .then(res => res.json())
  .then(productos => {
    productosGlobal = productos;
    aplicarFiltroURL();
  });

function aplicarFiltroURL() {
  const params = new URLSearchParams(window.location.search);
  const categoria = params.get("categoria");

  if (!categoria) {
    renderizar(productosGlobal);
    return;
  }

  const filtrados = productosGlobal.filter(
    p => p.categoria === categoria
  );

  renderizar(filtrados);
}

function renderizar(productos) {
  const contenedor = document.getElementById("lista-productos");
  contenedor.innerHTML = "";

  productos.forEach(p => {
    const card = document.createElement("div");
    card.className = "producto";

    card.innerHTML = `
      <div class="img-box">
        <img src="assents/imagenes/${p.imagenes[0]}">
      </div>
      <h3>${p.nombre}</h3>
      <p>$${p.precio}</p>
    `;

    card.onclick = () => {
      location.href = `detalle-producto.html?id=${p.id}`;
    };

    contenedor.appendChild(card);
  });
}