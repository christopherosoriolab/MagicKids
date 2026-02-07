// LOADER - Se oculta siempre después de 300ms
setTimeout(() => {
  const loader = document.getElementById('loader');
  if (loader) loader.classList.add('hidden');
}, 300);

// Variables globales
let productosGlobal = [];
const WHATSAPP = "56912345678";

// Cargar productos al inicio
document.addEventListener('DOMContentLoaded', () => {
  cargarProductos();
  configurarEventos();
});

// Cargar productos desde JSON
function cargarProductos() {
  fetch('data/productos.json')
    .then(res => {
      if (!res.ok) {
        throw new Error('Error al cargar el catálogo');
      }
      return res.json();
    })
    .then(productos => {
      productosGlobal = productos;
      aplicarFiltroURL();
    })
    .catch(error => {
      console.error('Error:', error);
      mostrarError('No se pudieron cargar los productos. Por favor, intenta nuevamente más tarde.');
    });
}

// Configurar eventos de filtros
function configurarEventos() {
  const btnFiltrar = document.getElementById('btn-filtrar');
  const categoria = document.getElementById('categoria');
  const busqueda = document.getElementById('busqueda');
  const precioMin = document.getElementById('precio-min');
  const precioMax = document.getElementById('precio-max');

  if (btnFiltrar) {
    btnFiltrar.addEventListener('click', aplicarFiltrosManuales);
  }

  if (categoria) {
    categoria.addEventListener('change', aplicarFiltrosManuales);
  }

  if (busqueda) {
    busqueda.addEventListener('keyup', (e) => {
      if (e.key === 'Enter') aplicarFiltrosManuales();
    });
  }

  if (precioMin) {
    precioMin.addEventListener('change', aplicarFiltrosManuales);
  }

  if (precioMax) {
    precioMax.addEventListener('change', aplicarFiltrosManuales);
  }
}

// Aplicar filtros desde URL
function aplicarFiltroURL() {
  const params = new URLSearchParams(window.location.search);
  const categoria = params.get("categoria");

  if (!categoria) {
    actualizarTitulo('Todos los Productos', 'Explora nuestra colección completa');
    renderizar(productosGlobal);
    return;
  }

  const nombreCategoria = {
    'inflables': 'Juegos Inflables',
    'mecanicos': 'Juegos Mecánicos',
    'interior': 'Juegos de Salón',
    'carros': 'Carros Gastronómicos'
  }[categoria] || 'Productos';

  const descripcionCategoria = {
    'inflables': 'Toboganes, castillos y juegos inflables para todas las edades',
    'mecanicos': 'Juegos mecánicos emocionantes para tu evento',
    'interior': 'Entretenimiento para espacios cerrados',
    'carros': 'Carros gastronómicos para deleitar a tus invitados'
  }[categoria] || 'Nuestra selección de productos';

  actualizarTitulo(nombreCategoria, descripcionCategoria);

  const filtrados = productosGlobal.filter(p => p.categoria === categoria);
  renderizar(filtrados);
}

// Aplicar filtros manuales
function aplicarFiltrosManuales() {
  const categoria = document.getElementById('categoria')?.value || '';
  const busqueda = document.getElementById('busqueda')?.value.toLowerCase() || '';
  const precioMin = document.getElementById('precio-min')?.value || '';
  const precioMax = document.getElementById('precio-max')?.value || '';

  let filtrados = [...productosGlobal];

  // Filtro por categoría
  if (categoria) {
    filtrados = filtrados.filter(p => p.categoria === categoria);
  }

  // Filtro por búsqueda
  if (busqueda) {
    filtrados = filtrados.filter(p => 
      p.nombre.toLowerCase().includes(busqueda) ||
      p.descripcion.toLowerCase().includes(busqueda)
    );
  }

  // Filtro por precio mínimo
  if (precioMin) {
    filtrados = filtrados.filter(p => p.precio >= parseInt(precioMin));
  }

  // Filtro por precio máximo
  if (precioMax) {
    filtrados = filtrados.filter(p => p.precio <= parseInt(precioMax));
  }

  // Actualizar título
  if (categoria || busqueda || precioMin || precioMax) {
    actualizarTitulo('Resultados de Búsqueda', `${filtrados.length} productos encontrados`);
  } else {
    actualizarTitulo('Todos los Productos', 'Explora nuestra colección completa');
  }

  renderizar(filtrados);
}

// Actualizar título y subtítulo
function actualizarTitulo(titulo, subtitulo) {
  const tituloEl = document.getElementById('titulo-catalogo');
  const subtituloEl = document.getElementById('subtitulo-catalogo');
  
  if (tituloEl) tituloEl.textContent = titulo;
  if (subtituloEl) subtituloEl.textContent = subtitulo;
}

// Renderizar productos
function renderizar(productos) {
  const contenedor = document.getElementById("lista-productos");
  const sinResultados = document.getElementById("sin-resultados");

  if (!contenedor) return;

  // Mostrar u ocultar mensaje de sin resultados
  if (sinResultados) {
    sinResultados.style.display = productos.length === 0 ? 'block' : 'none';
  }

  contenedor.innerHTML = "";

  if (productos.length === 0) {
    contenedor.innerHTML = '<p style="text-align: center; padding: 2rem; color: var(--gray);">No hay productos para mostrar.</p>';
    return;
  }

  productos.forEach(p => {
    // Clases y textos para badges
    const badgeClass = {
      'inflables': 'badge-inflables',
      'mecanicos': 'badge-mecanicos',
      'interior': 'badge-interior',
      'carros': 'badge-carros'
    }[p.categoria] || 'badge-inflables';

    const badgeText = {
      'inflables': '🎈 Inflable',
      'mecanicos': '🎢 Mecánico',
      'interior': '🎮 Interior',
      'carros': '🍔 Gastronómico'
    }[p.categoria] || 'Producto';

    const card = document.createElement("div");
    card.className = "producto";
    card.innerHTML = `
      <div class="img-box">
        <span class="producto-badge ${badgeClass}">${badgeText}</span>
        <img src="assents/imagenes/${p.imagenes[0]}" alt="${p.nombre}">
      </div>
      <div class="producto-info">
        <h3>${p.nombre}</h3>
        <p>$${p.precio.toLocaleString('es-CL')}</p>
      </div>
    `;

    card.onclick = () => {
      window.location.href = `detalle-producto.html?id=${p.id}`;
    };

    contenedor.appendChild(card);
  });
}

// Resetear filtros
function resetearFiltros() {
  if (document.getElementById('categoria')) document.getElementById('categoria').value = '';
  if (document.getElementById('busqueda')) document.getElementById('busqueda').value = '';
  if (document.getElementById('precio-min')) document.getElementById('precio-min').value = '';
  if (document.getElementById('precio-max')) document.getElementById('precio-max').value = '';
  
  // Resetear URL
  window.history.pushState({}, '', 'catalogo.html');
  
  // Volver a cargar todos los productos
  actualizarTitulo('Todos los Productos', 'Explora nuestra colección completa');
  renderizar(productosGlobal);
}

// Mostrar error
function mostrarError(mensaje) {
  const contenedor = document.getElementById("lista-productos");
  if (contenedor) {
    contenedor.innerHTML = `
      <div style="text-align: center; padding: 3rem; background: white; border-radius: 16px; box-shadow: var(--shadow-sm);">
        <div style="font-size: 3rem; margin-bottom: 1rem;">⚠️</div>
        <h3 style="color: var(--danger); margin-bottom: 1rem;">Error</h3>
        <p style="color: var(--gray); margin-bottom: 1.5rem;">${mensaje}</p>
        <button class="btn btn-primary" onclick="location.reload()">Recargar Página</button>
      </div>
    `;
  }
}

// Navbar scroll effect
window.addEventListener('scroll', () => {
  const navbar = document.getElementById('navbar');
  if (navbar) {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }
});

// Mobile menu
document.addEventListener('DOMContentLoaded', () => {
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const navCenter = document.getElementById('nav-center');
  const dropdownToggle = document.querySelector('.dropdown-toggle');

  if (mobileMenuBtn && navCenter) {
    mobileMenuBtn.addEventListener('click', () => {
      navCenter.classList.toggle('active');
      mobileMenuBtn.textContent = navCenter.classList.contains('active') ? '✕' : '☰';
    });
  }

  if (dropdownToggle) {
    dropdownToggle.addEventListener('click', (e) => {
      if (window.innerWidth <= 768) {
        e.preventDefault();
        document.querySelector('.dropdown').classList.toggle('active');
      }
    });
  }
});