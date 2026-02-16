// ======================
// CONFIGURACIÓN INICIAL
// ======================
const WHATSAPP = "56963160639";
const URL_PARAMS = new URLSearchParams(window.location.search);
const PRODUCTO_ID = parseInt(URL_PARAMS.get("id"));

// Elementos del DOM
const loader = document.getElementById('loader');
const detalleContainer = document.getElementById('detalle-container');
const errorContainer = document.getElementById('error-container');
const nombreHero = document.getElementById('nombre-hero');

// ======================
// FUNCIONES AUXILIARES
// ======================

function ocultarLoader() {
  if (loader) setTimeout(() => loader.classList.add('hidden'), 200);
}

function mostrarError(mensaje = 'Producto no encontrado') {
  ocultarLoader();
  
  if (nombreHero) nombreHero.textContent = 'Error';
  if (errorContainer) errorContainer.style.display = 'block';
  
  console.error('Error:', mensaje);
}

function formatearPrecio(precio) {
  return new Intl.NumberFormat('es-CL', { 
    style: 'currency', 
    currency: 'CLP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(precio);
}

function getCategoriaTexto(categoria) {
  const categorias = {
    'inflables': '🎈 Juego Inflable',
    'mecanicos': '🎢 Juego Mecánico',
    'interior': '🎮 Juego de Salón',
    'carros': '🍔 Carro Gastronómico'
  };
  return categorias[categoria] || categoria;
}

function getCategoriaColor(categoria) {
  const colores = {
    'inflables': '#2563eb',
    'mecanicos': '#f97316',
    'interior': '#10b981',
    'carros': '#f59e0b'
  };
  return colores[categoria] || '#2563eb';
}

// ======================
// CARGAR PRODUCTO
// ======================

function cargarProducto(producto) {
  // Actualizar título de la página
  document.title = `${producto.nombre} | MagicKids`;
  
  // Actualizar hero
  if (nombreHero) nombreHero.textContent = producto.nombre;
  
  // Actualizar contenido principal
  document.getElementById('nombre').textContent = producto.nombre;
  document.getElementById('precio').textContent = formatearPrecio(producto.precio);
  document.getElementById('precio-detalle').textContent = formatearPrecio(producto.precio);
  document.getElementById('descripcion').textContent = producto.descripcion || 'Descripción no disponible.';
  
  // Categoría
  const categoriaTexto = getCategoriaTexto(producto.categoria);
  const categoriaColor = getCategoriaColor(producto.categoria);
  document.getElementById('categoria-texto').textContent = categoriaTexto;
  
  // Medidas (ocultar para carros)
  const medidasContainer = document.getElementById('medidas-container');
  const medidasEl = document.getElementById('medidas');
  
  if (producto.categoria === 'carros' || !producto.medidas) {
    if (medidasContainer) medidasContainer.style.display = 'none';
  } else {
    if (medidasEl) medidasEl.textContent = producto.medidas;
  }
  
  // Imagen principal
  const imgPrincipal = document.getElementById('imagen-principal');
  if (imgPrincipal && producto.imagenes && producto.imagenes[0]) {
    imgPrincipal.src = `assents/imagenes/${producto.imagenes[0]}`;
    imgPrincipal.alt = producto.nombre;
  }
  
  // Miniaturas
  const miniaturasContainer = document.getElementById('miniaturas');
  if (miniaturasContainer && producto.imagenes) {
    miniaturasContainer.innerHTML = '';
    
    producto.imagenes.forEach((imgSrc, index) => {
      const img = document.createElement('img');
      img.src = `assents/imagenes/${imgSrc}`;
      img.alt = `${producto.nombre} - Imagen ${index + 1}`;
      img.className = index === 0 ? 'active' : '';
      
      img.addEventListener('click', () => {
        if (imgPrincipal) {
          imgPrincipal.src = img.src;
          imgPrincipal.alt = `${producto.nombre} - Imagen ${index + 1}`;
        }
        
        // Actualizar clase active
        document.querySelectorAll('.miniaturas img').forEach(i => i.classList.remove('active'));
        img.classList.add('active');
      });
      
      miniaturasContainer.appendChild(img);
    });
  }
  
  // Botón WhatsApp
  const btnCotizar = document.getElementById('btn-cotizar');
  if (btnCotizar) {
    const mensaje = `Hola! Quiero cotizar el siguiente producto:\n\n` +
                    `🎮 Producto: ${producto.nombre}\n` +
                    `💰 Precio: ${formatearPrecio(producto.precio)}\n` +
                    `🏷️ Categoría: ${categoriaTexto}\n\n` +
                    `¿Tienen disponibilidad para mi evento?`;
    
    btnCotizar.href = `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(mensaje)}`;
  }
  
  // Mostrar contenedor principal
  if (detalleContainer) {
    detalleContainer.style.display = 'block';
    ocultarLoader();
  }
  
  // Cargar productos relacionados
  cargarProductosRelacionados(producto.categoria, producto.id);
}

function cargarProductosRelacionados(categoria, excludeId) {
  fetch('data/productos.json')
    .then(res => {
      if (!res.ok) throw new Error('Error al cargar productos relacionados');
      return res.json();
    })
    .then(productos => {
      const relacionados = productos
        .filter(p => p.categoria === categoria && p.id !== excludeId)
        .slice(0, 4);
      
      const contenedor = document.getElementById('productos-relacionados');
      if (!contenedor) return;
      
      if (relacionados.length === 0) {
        contenedor.innerHTML = '<p style="text-align: center; padding: 1.5rem; color: var(--gray); grid-column: 1 / -1;">No hay productos relacionados disponibles.</p>';
        return;
      }
      
      contenedor.innerHTML = '';
      
      relacionados.forEach(p => {
        const badgeClass = {
          'inflables': 'badge-inflables',
          'mecanicos': 'badge-mecanicos',
          'interior': 'badge-interior',
          'carros': 'badge-carros'
        }[p.categoria] || 'badge-inflables';
        
        const badgeText = {
          'inflables': '🎈',
          'mecanicos': '🎢',
          'interior': '🎮',
          'carros': '🍔'
        }[p.categoria] || '⭐';
        
        const card = document.createElement('div');
        card.className = 'producto';
        card.innerHTML = `
          <div class="img-box">
            <span class="producto-badge ${badgeClass}">${badgeText}</span>
            <img src="assents/imagenes/${p.imagenes[0]}" alt="${p.nombre}">
          </div>
          <div class="producto-info">
            <h3>${p.nombre}</h3>
            <p>${formatearPrecio(p.precio)}</p>
          </div>
        `;
        
        card.addEventListener('click', () => {
          window.location.href = `detalle-producto.html?id=${p.id}`;
        });
        
        contenedor.appendChild(card);
      });
    })
    .catch(error => {
      console.error('Error relacionados:', error);
      const contenedor = document.getElementById('productos-relacionados');
      if (contenedor) {
        contenedor.innerHTML = '<p style="text-align: center; padding: 1.5rem; color: var(--gray); grid-column: 1 / -1;">Error al cargar productos relacionados.</p>';
      }
    });
}

// ======================
// INICIO DE LA APLICACIÓN
// ======================

document.addEventListener('DOMContentLoaded', () => {
  // Validar ID
  if (!PRODUCTO_ID || isNaN(PRODUCTO_ID)) {
    mostrarError('ID de producto inválido');
    return;
  }
  
  // Cargar producto desde JSON
  fetch('data/productos.json')
    .then(res => {
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      return res.json();
    })
    .then(productos => {
      const producto = productos.find(p => p.id === PRODUCTO_ID);
      
      if (!producto) {
        mostrarError('Producto no encontrado en nuestro catálogo');
        return;
      }
      
      cargarProducto(producto);
    })
    .catch(error => {
      console.error('Error fatal:', error);
      mostrarError('Error al cargar el producto. Por favor, intenta nuevamente más tarde.');
    });
  
  // Navbar scroll effect
  window.addEventListener('scroll', () => {
    const navbar = document.getElementById('navbar');
    if (navbar) {
      navbar.classList.toggle('scrolled', window.scrollY > 50);
    }
  });
  
  // Mobile menu
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const navCenter = document.getElementById('nav-center');
  
  if (mobileMenuBtn && navCenter) {
    mobileMenuBtn.addEventListener('click', () => {
      navCenter.classList.toggle('active');
      mobileMenuBtn.textContent = navCenter.classList.contains('active') ? '✕' : '☰';
    });
  }
  
  // Timeout de seguridad para loader (3 segundos máximo)
  setTimeout(() => {
    if (loader && !loader.classList.contains('hidden')) {
      loader.classList.add('hidden');
      console.warn('Loader forzado a ocultar después de 3 segundos');
    }
  }, 3000);
});