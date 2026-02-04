const WHATSAPP_NEGOCIO = "56912345678";


fetch("data/productos.json")
  .then(res => res.json())
  .then(productos => {
    const contenedor = document.getElementById("lista-productos");

    productos.forEach(producto => {
      const mensaje = encodeURIComponent(
        `Hola, quiero cotizar el arriendo de: ${producto.nombre}`
      );

      const card = document.createElement("div");
      card.classList.add("producto");

      card.innerHTML = `
        <img src="assents/imagenes/${producto.imagen}" alt="${producto.nombre}">
        <h3>${producto.nombre}</h3>
        <p>${producto.descripcion}</p>
        <strong>$${producto.precio}</strong>
        <a 
          href="https://wa.me/${WHATSAPP_NEGOCIO}?text=${mensaje}"
          target="_blank"
          class="btn-whatsapp"
        >
          Cotizar por WhatsApp
        </a>
      `;

      contenedor.appendChild(card);
    });
  });


  