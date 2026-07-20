/* ============================================================
   CASMA SSOMA — app.js
   Mobile-first Portal + Campañas + Juego IPERC
   ============================================================ */

/* ============================================================
   🎬 INTRO CINEMÁTICO — Netflix Style
   ============================================================ */

const INTRO_SLIDES = [
  {
    img: 'flyers/BT10F.jpg',
    headline: 'PROTEGE TU VISIÓN',
    sub: 'Con tus ojos ves la sonrisa de tu familia.\nNo pongas en riesgo ese privilegio.',
    accent: '#f59e0b',
    duration: 5000,
  },
  {
    img: 'flyers/I2bHL.jpg',
    headline: 'TU FAMILIA TE ESPERA',
    sub: 'Usa siempre tus lentes de seguridad.\nUn pequeño acto de prevención protege toda una vida.',
    accent: '#f59e0b',
    duration: 5000,
  },
  {
    img: 'flyers/ChatGPT Image 19 jul 2026, 21_41_22.png',
    headline: 'SEGURIDAD PRIMERO',
    sub: 'Compañía Minera Casma SAC\nSistema de Gestión SSOMA',
    accent: '#f59e0b',
    duration: 4500,
  },
];

let introCurrentSlide = -1;
let introTimer = null;
let introProgressTimer = null;
let introProgressStart = null;
let introProgressDuration = 0;
let introRunning = false;

function iniciarIntro() {
  introRunning = true;
  document.body.classList.add('intro-active');

  const slidesEl = document.getElementById('intro-slides');
  const dotsEl   = document.getElementById('intro-dots');

  // Build slides HTML
  slidesEl.innerHTML = INTRO_SLIDES.map((sl, i) => `
    <div class="intro-slide" id="intro-slide-${i}" data-index="${i}">
      <div class="intro-slide-bg"
           style="background-image:url('${sl.img}');--slide-duration:${sl.duration}ms"></div>
      <div class="intro-slide-content">
        <div class="intro-logo-stamp">
          <img src="images__1_-removebg-preview.png" alt="Logo">
          <span>Cia. Minera Casma SAC</span>
        </div>
        <h2 class="intro-headline">${sl.headline}</h2>
        <div class="intro-divider"></div>
        <p class="intro-subtext">${sl.sub.replace(/\n/g,'<br>')}</p>
      </div>
      <div class="intro-slide-num">${i + 1} / ${INTRO_SLIDES.length}</div>
    </div>
  `).join('');

  // Build dots
  dotsEl.innerHTML = INTRO_SLIDES.map((_, i) => `
    <button class="intro-dot" data-index="${i}" onclick="irAIntroSlide(${i})" aria-label="Slide ${i+1}"></button>
  `).join('');

  // Generate particles
  generarParticulas();

  // Wait for title card animation (2.2s) then start slides
  setTimeout(() => {
    const titleCard = document.getElementById('intro-title-card');
    if (titleCard) titleCard.style.display = 'none';
    irAIntroSlide(0);
  }, 2200);
}

function generarParticulas() {
  const container = document.getElementById('intro-particles');
  if (!container) return;
  for (let i = 0; i < 25; i++) {
    const p = document.createElement('div');
    p.className = 'intro-particle';
    p.style.cssText = `
      left: ${Math.random() * 100}%;
      bottom: ${Math.random() * 20}%;
      width: ${Math.random() * 3 + 1}px;
      height: ${Math.random() * 3 + 1}px;
      animation-duration: ${Math.random() * 6 + 4}s;
      animation-delay: ${Math.random() * 4}s;
      opacity: 0;
    `;
    container.appendChild(p);
  }
}

function irAIntroSlide(index) {
  if (index >= INTRO_SLIDES.length) {
    cerrarIntro();
    return;
  }

  // Clear any running timer
  clearTimeout(introTimer);
  cancelAnimationFrame(introProgressTimer);

  const slide = INTRO_SLIDES[index];

  // Flash transition (not on first slide)
  if (introCurrentSlide >= 0) {
    triggerFlash();
  }

  // Deactivate old slide
  if (introCurrentSlide >= 0) {
    document.getElementById(`intro-slide-${introCurrentSlide}`)?.classList.remove('active');
  }

  // Activate new slide
  introCurrentSlide = index;
  const el = document.getElementById(`intro-slide-${index}`);
  if (el) {
    el.classList.add('active');
    // Force re-trigger CSS animations by removing and re-adding class
    el.querySelectorAll('.intro-slide-bg, .intro-logo-stamp, .intro-headline, .intro-divider, .intro-subtext').forEach(child => {
      child.style.animationName = 'none';
      requestAnimationFrame(() => {
        child.style.animationName = '';
      });
    });
  }

  // Update dots
  document.querySelectorAll('.intro-dot').forEach((dot, i) => {
    dot.classList.toggle('active', i === index);
  });

  // Animate progress bar
  animateIntroProgress(slide.duration);

  // Auto advance
  introTimer = setTimeout(() => {
    irAIntroSlide(index + 1);
  }, slide.duration);
}

function triggerFlash() {
  const flash = document.getElementById('intro-flash');
  if (!flash) return;
  flash.classList.remove('flash');
  void flash.offsetWidth; // reflow
  flash.classList.add('flash');
}

function animateIntroProgress(duration) {
  const fill = document.getElementById('intro-progress-fill');
  if (!fill) return;

  cancelAnimationFrame(introProgressTimer);
  fill.style.transition = 'none';
  fill.style.width = '0%';

  introProgressStart = performance.now();
  introProgressDuration = duration;

  function step(now) {
    const elapsed = now - introProgressStart;
    const pct = Math.min((elapsed / introProgressDuration) * 100, 100);
    fill.style.width = pct + '%';
    if (pct < 100) {
      introProgressTimer = requestAnimationFrame(step);
    }
  }
  requestAnimationFrame(step);
}

function cerrarIntro() {
  if (!introRunning) return;
  introRunning = false;
  clearTimeout(introTimer);
  cancelAnimationFrame(introProgressTimer);

  const overlay = document.getElementById('intro-overlay');
  overlay.classList.add('fade-out');
  document.body.classList.remove('intro-active');

  setTimeout(() => {
    overlay.style.display = 'none';
  }, 900);
}

// Also allow clicking/tapping intro to advance slide on mobile
document.addEventListener('DOMContentLoaded', () => {
  const overlay = document.getElementById('intro-overlay');
  if (overlay) {
    overlay.addEventListener('click', (e) => {
      if (e.target.closest('.intro-skip-btn') || e.target.closest('.intro-dot')) return;
      if (introCurrentSlide >= 0 && introRunning) {
        irAIntroSlide(introCurrentSlide + 1);
      }
    });
  }
});

let catalogo = null;
let capacitaciones = null;
let progreso = JSON.parse(localStorage.getItem('casma_ssoma_progreso') || '{}');
let filtroActual = 'todos';
let categoriaActual = null;
let carouselIndex = 0;
let carouselDocs = [];
let carouselInicializado = false;

const ICONOS = {
  shield: '🛡️', scale: '⚖️', book: '📖', 'check-circle': '✅',
  pickaxe: '⛏️', wind: '💨', chart: '📊', zap: '⚡', wrench: '🔧', folder: '📁'
};

/* Flyers / Campañas disponibles */
const FLYERS = [
  { archivo: 'flyers/BT10F.jpg', titulo: 'Campaña de Seguridad', badge: '📢 Campaña' },
  { archivo: 'flyers/ChatGPT Image 19 jul 2026, 21_41_22.png', titulo: 'Difusión SSOMA', badge: '🛡️ SSOMA' },
  { archivo: 'flyers/I2bHL.jpg', titulo: 'Seguridad en la Mina', badge: '⛏️ Mina' },
];

/* Documentos principales (políticas, normativa, reglamentos raíz) */
const DOCS_PRINCIPALES = [
  { nombre: 'Política Integrada — Cía Minera Casma 2026', archivo: 'POLITICA INTEGRADA- CIA MINERA CASMA- 2026.pdf', icono: '🛡️', badge: 'Política' },
  { nombre: 'Política: Derecho a Decir NO al Trabajo Inseguro', archivo: 'POLITICA DERECHO A DECIR NO AL TRABAJO INSEGURO 2026 .pdf', icono: '🚫', badge: 'Política' },
  { nombre: 'Reglamento Interno de SST — RGL.SIG.001', archivo: 'RGL.SIG.001 REGLAMENTO INTERNO DE SEGURIDAD Y SALUD EN EL TRABAJO.pdf', icono: '📖', badge: 'Reglamento' },
  { nombre: 'Reglamento Interno de Tránsito — RGL.SIG.002', archivo: 'RGL.SIG.002 REGLAMENTO INTERNO DE TRANSITO.pdf', icono: '🚗', badge: 'Reglamento' },
  { nombre: 'D.S. N° 024-2026-EM — Seguridad Minera', archivo: 'D.S. N° 024-2026-EM.pdf', icono: '⚖️', badge: 'Normativa' },
  { nombre: 'D.S. N° 023-2017-EM', archivo: 'DS N° 023-2017-EM.pdf', icono: '⚖️', badge: 'Normativa' },
  { nombre: 'D.S. N° 034-2023-EM', archivo: 'DS Nº 034-2023-EM.pdf', icono: '⚖️', badge: 'Normativa' },
  { nombre: 'RIT Minera Casma SAC', archivo: 'RIT MINERA CASMA SAC (2).pdf', icono: '📋', badge: 'Reglamento' },
];

/* ============================================================
   INIT
   ============================================================ */
async function init() {
  try {
    const [catRes, capRes] = await Promise.all([
      fetch('data/catalogo.json'),
      fetch('data/capacitaciones.json')
    ]);
    catalogo = await catRes.json();
    capacitaciones = await capRes.json();

    renderDashboard();
    renderDocsFundamentales();
    renderCategorias();
    renderDocumentos();
    renderArbol();
    renderCapacitaciones();
    renderCampanas();
    renderDocsPrincipales();
    setupNavegacion();
    setupBusqueda();
    iniciarJuegoIperc('easy');
  } catch (e) {
    console.error('Error cargando datos:', e);
  }
}

/* ============================================================
   NAV
   ============================================================ */
function setupNavegacion() {
  document.querySelectorAll('.nav-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.nav-tab').forEach(t => t.classList.remove('active'));
      document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
      tab.classList.add('active');
      document.getElementById(tab.dataset.section)?.classList.add('active');
    });
  });
}

function setupBusqueda() {
  document.getElementById('search-input')?.addEventListener('input', e =>
    renderDocumentos(e.target.value.trim()));
  document.getElementById('search-training')?.addEventListener('input', e =>
    renderCapacitaciones(e.target.value.trim()));
}

function irASeccion(id) {
  document.querySelectorAll('.nav-tab').forEach(t => {
    t.classList.toggle('active', t.dataset.section === id);
  });
  document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
  document.getElementById(id)?.classList.add('active');
}

/* ============================================================
   DASHBOARD STATS
   ============================================================ */
function renderDashboard() {
  const docs = catalogo.documentos;
  const capacitables = docs.filter(d => d.capacitacion).length;
  document.getElementById('stat-total').textContent = docs.length;
  document.getElementById('stat-categorias').textContent = catalogo.categorias.length;
  document.getElementById('stat-capacitaciones').textContent = capacitables;
  document.getElementById('stat-completadas').textContent =
    Object.values(progreso).filter(p => p.completado).length;
}

/* ============================================================
   CAMPAÑAS & FLYERS
   ============================================================ */
function renderCampanas() {
  const grid = document.getElementById('campaigns-grid');
  if (!grid) return;
  grid.innerHTML = FLYERS.map((f, i) => `
    <div class="campaign-card" onclick="abrirFlyer('${esc(f.archivo)}', '${esc(f.titulo)}')" 
         role="button" tabindex="0" aria-label="Ver ${esc(f.titulo)}">
      <img src="${esc(f.archivo)}" alt="${esc(f.titulo)}" loading="lazy"
           onerror="this.parentElement.innerHTML='<div style=\'display:flex;align-items:center;justify-content:center;height:100%;background:#f1f5f9;font-size:2rem\'>📢</div>'">
      <div class="campaign-card-overlay">
        <span class="campaign-card-badge">${esc(f.badge)}</span>
        <span class="campaign-card-label">${esc(f.titulo)}</span>
      </div>
      <button class="campaign-zoom-btn" onclick="event.stopPropagation();abrirFlyer('${esc(f.archivo)}','${esc(f.titulo)}')" aria-label="Ampliar imagen">🔍</button>
    </div>
  `).join('');
}

function abrirFlyer(archivo, titulo) {
  const modal = document.getElementById('modal-flyer');
  const img = document.getElementById('modal-flyer-img');
  img.src = archivo;
  img.alt = titulo;
  modal.classList.add('active');
}

function cerrarModalFlyer() {
  document.getElementById('modal-flyer').classList.remove('active');
  document.getElementById('modal-flyer-img').src = '';
}

/* ============================================================
   DOCUMENTOS PRINCIPALES (Campañas tab)
   ============================================================ */
function renderDocsPrincipales() {
  const lista = document.getElementById('docs-principales');
  if (!lista) return;
  lista.innerHTML = DOCS_PRINCIPALES.map(d => `
    <div class="doc-item">
      <div class="doc-icon">${d.icono}</div>
      <div class="doc-info">
        <h4>${esc(d.nombre)}</h4>
        <div class="doc-meta">
          <span class="doc-badge">${esc(d.badge)}</span>
        </div>
      </div>
      <div class="doc-actions">
        <button class="btn btn-primary" onclick="verDocumentoDireto('documentos/${encodeURIComponent(d.archivo)}','${esc(d.nombre)}')">
          📄 Ver PDF
        </button>
      </div>
    </div>
  `).join('');
}

function verDocumentoDireto(ruta, nombre) {
  const modal = document.getElementById('modal-pdf');
  document.getElementById('modal-pdf-title').textContent = nombre;
  document.getElementById('pdf-frame').src = ruta;
  modal.classList.add('active');
}

/* ============================================================
   CAROUSEL — Políticas y Reglamentos
   ============================================================ */
function renderDocsFundamentales() {
  const track = document.getElementById('carousel-track');
  const dots = document.getElementById('carousel-dots');
  if (!track || !dots) return;

  const ordenCategorias = ['politicas', 'reglamentos'];
  carouselDocs = catalogo.documentos
    .filter(d => ordenCategorias.includes(d.categoria_id))
    .sort((a, b) => {
      const catOrder = ordenCategorias.indexOf(a.categoria_id) - ordenCategorias.indexOf(b.categoria_id);
      return catOrder !== 0 ? catOrder : a.id - b.id;
    });

  if (!carouselDocs.length) {
    // Fallback: show from DOCS_PRINCIPALES if no filtered docs
    track.innerHTML = `<div class="carousel-slide">
      <div class="carousel-slide-header" style="padding:1rem">
        <p style="color:var(--text-secondary);font-size:0.85rem">Los documentos de Políticas y Reglamentos se encuentran en la sección <strong>Campañas</strong>.</p>
      </div>
    </div>`;
    return;
  }

  track.innerHTML = carouselDocs.map((doc, i) => `
    <div class="carousel-slide" data-index="${i}">
      <div class="carousel-slide-header">
        <div class="carousel-slide-info">
          <h4>${esc(doc.nombre)}</h4>
          <div class="carousel-slide-meta">
            <span class="carousel-badge ${doc.categoria_id}">${esc(doc.categoria)}</span>
            ${doc.codigo ? `<span>${esc(doc.codigo)}</span>` : ''}
          </div>
        </div>
        <span class="carousel-slide-order">${i + 1} / ${carouselDocs.length}</span>
      </div>
      <div class="carousel-pdf-preview">
        <iframe class="carousel-iframe" data-archivo="${esc(doc.archivo)}" title="${esc(doc.nombre)}"></iframe>
      </div>
    </div>
  `).join('');

  dots.innerHTML = carouselDocs.map((_, i) => `
    <button type="button" class="carousel-dot${i === 0 ? ' active' : ''}"
            data-index="${i}" aria-label="Ir al documento ${i + 1}"></button>
  `).join('');

  carouselIndex = 0;
  setupCarousel();
  irACarrusel(0);
}

function setupCarousel() {
  if (carouselInicializado) return;
  carouselInicializado = true;

  document.getElementById('carousel-prev')?.addEventListener('click', () => irACarrusel(carouselIndex - 1));
  document.getElementById('carousel-next')?.addEventListener('click', () => irACarrusel(carouselIndex + 1));

  document.getElementById('carousel-dots')?.addEventListener('click', e => {
    const dot = e.target.closest('.carousel-dot');
    if (dot) irACarrusel(Number(dot.dataset.index));
  });

  const viewport = document.querySelector('.carousel-viewport');
  if (!viewport) return;
  let touchStartX = 0;
  let touchEnPdf = false;
  viewport.addEventListener('touchstart', e => {
    touchEnPdf = !!e.target.closest('.carousel-pdf-preview');
    if (!touchEnPdf) touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });
  viewport.addEventListener('touchend', e => {
    if (touchEnPdf) return;
    const diff = touchStartX - e.changedTouches[0].screenX;
    if (Math.abs(diff) > 50) irACarrusel(carouselIndex + (diff > 0 ? 1 : -1));
  }, { passive: true });
}

function irACarrusel(index) {
  if (!carouselDocs.length) return;
  carouselIndex = Math.max(0, Math.min(index, carouselDocs.length - 1));
  const track = document.getElementById('carousel-track');
  if (track) track.style.transform = `translateX(-${carouselIndex * 100}%)`;
  document.querySelectorAll('.carousel-dot').forEach((dot, i) =>
    dot.classList.toggle('active', i === carouselIndex));
  const prev = document.getElementById('carousel-prev');
  const next = document.getElementById('carousel-next');
  if (prev) prev.disabled = carouselIndex === 0;
  if (next) next.disabled = carouselIndex === carouselDocs.length - 1;
  cargarPreviewCarrusel(carouselIndex);
  if (carouselIndex > 0) cargarPreviewCarrusel(carouselIndex - 1);
  if (carouselIndex < carouselDocs.length - 1) cargarPreviewCarrusel(carouselIndex + 1);
}

function rutaPdf(archivo) { return 'documentos/' + encodeURI(archivo); }

function cargarPreviewCarrusel(index) {
  const slide = document.querySelector(`.carousel-slide[data-index="${index}"]`);
  const iframe = slide?.querySelector('.carousel-iframe');
  if (!iframe || iframe.dataset.loaded) return;
  iframe.src = rutaPdf(iframe.dataset.archivo);
  iframe.dataset.loaded = '1';
}

/* ============================================================
   CATEGORÍAS
   ============================================================ */
function renderCategorias() {
  const grid = document.getElementById('categories-grid');
  const counts = {};
  catalogo.documentos.forEach(d => { counts[d.categoria_id] = (counts[d.categoria_id] || 0) + 1; });
  grid.innerHTML = catalogo.categorias.map(cat => `
    <div class="category-card" style="--cat-color:${cat.color}"
         onclick="filtrarCategoria('${cat.id}')" role="button" tabindex="0">
      <div class="cat-icon">${ICONOS[cat.icono] || '📄'}</div>
      <h3>${esc(cat.nombre)}</h3>
      <p class="count">${counts[cat.id] || 0} documentos</p>
    </div>
  `).join('');
}

function filtrarCategoria(catId) {
  categoriaActual = catId;
  filtroActual = catId;
  document.querySelectorAll('.chip').forEach(c => c.classList.toggle('active', c.dataset.filter === catId));
  irASeccion('documentos');
  renderDocumentos(document.getElementById('search-input')?.value.trim() || '');
}

/* ============================================================
   DOCUMENTOS
   ============================================================ */
function renderDocumentos(busqueda = '') {
  const lista = document.getElementById('docs-list');
  let docs = [...catalogo.documentos];
  if (filtroActual !== 'todos') docs = docs.filter(d => d.categoria_id === filtroActual);
  if (busqueda) {
    const q = busqueda.toLowerCase();
    docs = docs.filter(d =>
      d.nombre.toLowerCase().includes(q) ||
      (d.codigo && d.codigo.toLowerCase().includes(q)) ||
      d.categoria.toLowerCase().includes(q) ||
      d.subcategoria.toLowerCase().includes(q)
    );
  }
  const subtitle = document.getElementById('docs-subtitle');
  if (subtitle) subtitle.textContent = `${docs.length} documentos encontrados`;
  if (!docs.length) {
    lista.innerHTML = `<div class="empty-state"><div class="icon">📭</div><p>No se encontraron documentos</p></div>`;
    return;
  }
  lista.innerHTML = docs.map(doc => `
    <div class="doc-item">
      <div style="display:flex;align-items:center;gap:0.75rem;flex:1;min-width:0">
        <div class="doc-icon">📕</div>
        <div class="doc-info">
          <h4 title="${esc(doc.nombre)}">${esc(doc.nombre)}</h4>
          <div class="doc-meta">
            ${doc.codigo ? `<span class="doc-badge">${esc(doc.codigo)}</span>` : ''}
            <span>${esc(doc.categoria)}</span>
            ${doc.subcategoria ? `<span>› ${esc(doc.subcategoria)}</span>` : ''}
          </div>
        </div>
      </div>
      <div class="doc-actions">
        <button class="btn btn-primary" onclick="verDocumento('${esc(doc.archivo)}','${esc(doc.nombre)}')">📄 Ver</button>
        ${doc.capacitacion ? `<button class="btn btn-secondary" onclick="iniciarCapacitacion(${doc.id})">🎓</button>` : ''}
      </div>
    </div>
  `).join('');
}

/* ============================================================
   ÁRBOL DOCUMENTAL
   ============================================================ */
function renderArbol() {
  const tree = document.getElementById('tree-view');
  const grupos = {};
  catalogo.documentos.forEach(doc => {
    const key = doc.categoria;
    if (!grupos[key]) grupos[key] = {};
    const sub = doc.subcategoria || 'General';
    if (!grupos[key][sub]) grupos[key][sub] = [];
    grupos[key][sub].push(doc);
  });
  tree.innerHTML = Object.entries(grupos).map(([cat, subs]) => `
    <div class="tree-group">
      <div class="tree-group-title">${esc(cat)}</div>
      ${Object.entries(subs).map(([sub, docs]) => `
        <div class="tree-subgroup">
          ${sub !== 'General' ? `<div class="tree-subgroup-title">${esc(sub)}</div>` : ''}
          <div class="docs-list">
            ${docs.map(doc => `
              <div class="doc-item" style="padding:0.55rem 0.85rem">
                <div class="doc-info">
                  <h4 style="font-size:0.82rem">
                    ${doc.codigo ? `<span class="doc-badge">${esc(doc.codigo)}</span> ` : ''}${esc(doc.nombre)}
                  </h4>
                </div>
                <div class="doc-actions">
                  <button class="btn btn-primary" style="padding:0.3rem 0.65rem;font-size:0.72rem"
                    onclick="verDocumento('${esc(doc.archivo)}','${esc(doc.nombre)}')">Ver</button>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      `).join('')}
    </div>
  `).join('');
}

/* ============================================================
   CAPACITACIONES
   ============================================================ */
function getRiesgos(categoriaId) {
  const mapa = capacitaciones.plantilla_pets.riesgos_por_area;
  return mapa[categoriaId] || mapa.pets_mina;
}
function getNivel(categoriaId) {
  if (categoriaId === 'estandares') return 'Intermedio';
  if (categoriaId.includes('mant')) return 'Avanzado';
  return 'Básico';
}

function renderCapacitaciones(busqueda = '') {
  const grid = document.getElementById('training-grid');
  let docs = catalogo.documentos.filter(d => d.capacitacion);
  if (busqueda) {
    const q = busqueda.toLowerCase();
    docs = docs.filter(d => d.nombre.toLowerCase().includes(q) || (d.codigo && d.codigo.toLowerCase().includes(q)));
  }

  const modulosGenerales = capacitaciones.modulos_generales.map(mod => {
    const prog = progreso[mod.id] || {};
    return `
      <div class="training-card">
        <div class="training-header">
          <div>
            <span class="code">MÓDULO GENERAL</span>
            <h3>${esc(mod.titulo)}</h3>
          </div>
          <span class="badge-level badge-${mod.nivel.toLowerCase()}">${mod.nivel}</span>
        </div>
        <p style="font-size:0.82rem;color:var(--text-secondary)">⏱ ${mod.duracion_min} min</p>
        <div class="learning-steps">
          ${mod.objetivos.slice(0,2).map((o,i) => `
            <div class="learning-step"><span class="step-num">${i+1}</span><span style="font-size:0.82rem">${esc(o)}</span></div>
          `).join('')}
        </div>
        <div class="progress-bar"><div class="progress-fill" style="width:${prog.completado ? 100 : prog.puntaje || 0}%"></div></div>
        ${prog.completado ? '<span class="completed-badge">✓ Completado</span>' : ''}
        <div style="margin-top:0.85rem;display:flex;gap:0.5rem">
          <button class="btn btn-success" onclick="iniciarModuloGeneral('${mod.id}')">
            ${prog.completado ? '🔄 Repasar' : '▶ Iniciar'}
          </button>
        </div>
      </div>
    `;
  }).join('');

  const modulosPets = docs.map(doc => {
    const key = `doc-${doc.id}`;
    const prog = progreso[key] || {};
    const nivel = getNivel(doc.categoria_id);
    const riesgos = getRiesgos(doc.categoria_id);
    return `
      <div class="training-card">
        <div class="training-header">
          <div>
            ${doc.codigo ? `<span class="code">${esc(doc.codigo)}</span>` : ''}
            <h3>${esc(truncar(doc.nombre, 55))}</h3>
          </div>
          <span class="badge-level badge-${nivel.toLowerCase()}">${nivel}</span>
        </div>
        <p style="font-size:0.78rem;color:var(--text-secondary)">${esc(doc.categoria)}</p>
        <div class="risk-tags">
          ${riesgos.slice(0,3).map(r => `<span class="risk-tag">⚠ ${esc(r)}</span>`).join('')}
        </div>
        <div class="progress-bar"><div class="progress-fill" style="width:${prog.completado ? 100 : prog.puntaje || 0}%"></div></div>
        ${prog.completado ? '<span class="completed-badge">✓ Completado</span>' : ''}
        <div style="margin-top:0.85rem;display:flex;gap:0.5rem;flex-wrap:wrap">
          <button class="btn btn-primary" onclick="verDocumento('${esc(doc.archivo)}','${esc(doc.nombre)}')">📄 PETS</button>
          <button class="btn btn-success" onclick="iniciarCapacitacion(${doc.id})">
            ${prog.completado ? '🔄 Repasar' : '🎓 Capacitar'}
          </button>
        </div>
      </div>
    `;
  }).join('');

  grid.innerHTML = modulosGenerales + modulosPets;
}

/* ============================================================
   VER DOCUMENTO (modal PDF)
   ============================================================ */
function verDocumento(archivo, nombre) {
  document.getElementById('modal-pdf-title').textContent = nombre;
  document.getElementById('pdf-frame').src = rutaPdf(archivo);
  document.getElementById('modal-pdf').classList.add('active');
}

function cerrarModal(id) {
  document.getElementById(id).classList.remove('active');
  if (id === 'modal-pdf') document.getElementById('pdf-frame').src = '';
}

/* ============================================================
   CAPACITACIÓN / QUIZ
   ============================================================ */
function iniciarCapacitacion(docId) {
  const doc = catalogo.documentos.find(d => d.id === docId);
  if (!doc) return;
  mostrarCapacitacion({
    key: `doc-${doc.id}`,
    titulo: doc.nombre,
    codigo: doc.codigo,
    archivo: doc.archivo,
    riesgos: getRiesgos(doc.categoria_id),
    objetivos: capacitaciones.plantilla_pets.objetivos_base,
    preguntas: [...capacitaciones.plantilla_pets.preguntas_base]
  });
}

function iniciarModuloGeneral(modId) {
  const mod = capacitaciones.modulos_generales.find(m => m.id === modId);
  if (!mod) return;
  mostrarCapacitacion({
    key: modId,
    titulo: mod.titulo,
    codigo: 'GENERAL',
    archivo: null,
    riesgos: ['Cultura de seguridad', 'Marco legal', 'Políticas corporativas'],
    objetivos: mod.objetivos,
    preguntas: capacitaciones.plantilla_pets.preguntas_base,
    temas: mod.temas
  });
}

function mostrarCapacitacion(data) {
  const modal = document.getElementById('modal-training');
  const body = document.getElementById('training-body');
  body.innerHTML = `
    <div class="quiz-container">
      <div style="margin-bottom:1.25rem">
        ${data.codigo ? `<span class="doc-badge">${esc(data.codigo)}</span>` : ''}
        <h3 style="margin-top:0.4rem;font-size:1rem">${esc(data.titulo)}</h3>
      </div>
      <h4 style="color:var(--accent-gold);margin-bottom:0.6rem;font-size:0.9rem">📋 Objetivos</h4>
      <div class="learning-steps">
        ${data.objetivos.map((o,i) => `<div class="learning-step"><span class="step-num">${i+1}</span><span>${esc(o)}</span></div>`).join('')}
      </div>
      ${data.temas ? `
        <h4 style="color:var(--accent-gold);margin:1.25rem 0 0.6rem;font-size:0.9rem">📚 Temas</h4>
        <div class="learning-steps">
          ${data.temas.map((t,i) => `<div class="learning-step"><span class="step-num">${i+1}</span><span>${esc(t)}</span></div>`).join('')}
        </div>
      ` : ''}
      <h4 style="color:var(--accent-red);margin:1.25rem 0 0.6rem;font-size:0.9rem">⚠ Riesgos</h4>
      <div class="risk-tags">${data.riesgos.map(r => `<span class="risk-tag">${esc(r)}</span>`).join('')}</div>
      ${data.archivo ? `
        <div style="margin:1.25rem 0">
          <button class="btn btn-primary" onclick="verDocumento('${esc(data.archivo)}','${esc(data.titulo)}')">📄 Ver procedimiento completo</button>
        </div>
      ` : ''}
      <h4 style="color:var(--accent-gold);margin:1.25rem 0 0.6rem;font-size:0.9rem">✅ Evaluación (mínimo 75%)</h4>
      <div id="quiz-questions">
        ${data.preguntas.map((p,qi) => `
          <div class="quiz-question" data-question="${qi}">
            <h4>${qi+1}. ${esc(p.pregunta)}</h4>
            <div class="quiz-options">
              ${p.opciones.map((op,oi) => `
                <div class="quiz-option" data-q="${qi}" data-o="${oi}" onclick="seleccionarOpcion(${qi},${oi})">${esc(op)}</div>
              `).join('')}
            </div>
          </div>
        `).join('')}
      </div>
      <div style="text-align:center;margin-top:1.25rem">
        <button class="btn btn-success" style="padding:0.7rem 2rem" onclick="evaluarQuiz()">Enviar evaluación</button>
      </div>
      <div id="quiz-result"></div>
    </div>
  `;
  modal.classList.add('active');
  window._respuestas = {};
  window._quizData = { key: data.key, preguntas: data.preguntas };
}

function seleccionarOpcion(q, o) {
  window._respuestas = window._respuestas || {};
  window._respuestas[q] = o;
  document.querySelectorAll(`.quiz-option[data-q="${q}"]`).forEach(el =>
    el.classList.toggle('selected', parseInt(el.dataset.o) === o));
}

function evaluarQuiz() {
  const { key, preguntas } = window._quizData || {};
  if (!preguntas) return;
  const respuestas = window._respuestas || {};
  let correctas = 0;
  preguntas.forEach((p, qi) => {
    const opts = document.querySelectorAll(`.quiz-option[data-q="${qi}"]`);
    opts.forEach(el => {
      const oi = parseInt(el.dataset.o);
      el.classList.remove('selected');
      if (oi === p.correcta) el.classList.add('correct');
      else if (respuestas[qi] === oi) el.classList.add('incorrect');
    });
    if (respuestas[qi] === p.correcta) correctas++;
  });
  const total = preguntas.length;
  const pct = Math.round((correctas / total) * 100);
  const aprobado = pct >= 75;
  progreso[key] = { puntaje: pct, completado: aprobado, fecha: new Date().toISOString() };
  localStorage.setItem('casma_ssoma_progreso', JSON.stringify(progreso));
  document.getElementById('quiz-result').innerHTML = `
    <div class="quiz-result">
      <div class="score">${pct}%</div>
      <p>${correctas} de ${total} correctas</p>
      <p style="font-size:1rem;font-weight:700;color:${aprobado ? 'var(--accent-green)' : 'var(--accent-red)'}">
        ${aprobado ? '✅ ¡Capacitación aprobada!' : '❌ No aprobado. Revise el procedimiento e intente nuevamente.'}
      </p>
      ${!aprobado ? preguntas.map((p,i) => respuestas[i] !== p.correcta
        ? `<p style="font-size:0.82rem;text-align:left;margin:0.4rem 0;color:var(--text-secondary)"><strong>P${i+1}:</strong> ${esc(p.explicacion)}</p>` : '').join('') : ''}
      <button class="btn btn-primary" onclick="cerrarModal('modal-training');renderDashboard();renderCapacitaciones()">Cerrar</button>
    </div>
  `;
}

function setFiltro(filtro) {
  filtroActual = filtro;
  categoriaActual = filtro === 'todos' ? null : filtro;
  document.querySelectorAll('.chip').forEach(c => c.classList.toggle('active', c.dataset.filter === filtro));
  renderDocumentos(document.getElementById('search-input')?.value.trim() || '');
}

/* ============================================================
   🎮 JUEGO IPERC
   ============================================================ */
const IPERC_ESCENARIOS = {
  easy: [
    {
      area: 'Área de Mantenimiento Mecánico',
      actividad: 'Mantenimiento preventivo de equipos de bajo perfil (Scooptram)',
      rows: [
        {
          peligro: 'Desorden y suciedad en el área',
          riesgo: 'Tropezón / Caída al mismo nivel',
          evaluacion: 14,
          nivel: 'MEDIO',
          control: 'Orden y limpieza antes, durante y después',
        },
        {
          peligro: 'Cajas y materiales mal apilados',
          riesgo: 'Aplastamiento por caída de objetos',
          evaluacion: 13,
          nivel: 'MEDIO',
          control: 'Apilar correctamente con altura máxima definida',
        },
        {
          peligro: 'Postura inadecuada al trabajar',
          riesgo: 'Sobreexposición / Lesión ergonómica',
          evaluacion: 13,
          nivel: 'MEDIO',
          control: 'Posicionarse bien para ejecutar la actividad',
        },
      ]
    },
    {
      area: 'Interior Mina — Frente de trabajo',
      actividad: 'Desatado manual de rocas',
      rows: [
        {
          peligro: 'Rocas sueltas en el techo',
          riesgo: 'Caída de roca / Golpe mortal',
          evaluacion: 5,
          nivel: 'ALTO',
          control: 'Inspección visual y desatado sistemático antes de ingresar',
        },
        {
          peligro: 'Falta de sostenimiento',
          riesgo: 'Desprendimiento de masa',
          evaluacion: 6,
          nivel: 'ALTO',
          control: 'Instalar sostenimiento según estándar antes de avanzar',
        },
        {
          peligro: 'Iluminación deficiente',
          riesgo: 'Golpe contra objetos / Caída',
          evaluacion: 18,
          nivel: 'MEDIO',
          control: 'Portar lámpara personal con carga completa',
        },
      ]
    }
  ],
  medium: [
    {
      area: 'PETS Ventilación',
      actividad: 'Traslado e instalación de ventilador colgado',
      rows: [
        {
          peligro: 'Carga suspendida — ventilador pesado',
          riesgo: 'Aplastamiento / Golpe por objeto izado',
          evaluacion: 8,
          nivel: 'ALTO',
          control: 'Aplicar estándar de izaje y zona de exclusión',
        },
        {
          peligro: 'Trabajo en altura mayor a 1.80 m',
          riesgo: 'Caída a diferente nivel',
          evaluacion: 3,
          nivel: 'ALTO',
          control: 'Usar arnés de seguridad y línea de vida certificados',
        },
        {
          peligro: 'Cables eléctricos energizados cercanos',
          riesgo: 'Electrocución / Arco eléctrico',
          evaluacion: 4,
          nivel: 'ALTO',
          control: 'Bloqueo y etiquetado (LOTO) antes del trabajo',
        },
        {
          peligro: 'Gases nocivos acumulados',
          riesgo: 'Intoxicación / Asfixia',
          evaluacion: 13,
          nivel: 'MEDIO',
          control: 'Medición de gases antes de ingresar — ventilación continua',
        },
      ]
    }
  ],
  hard: [
    {
      area: 'Mina — Voladura y Perforación',
      actividad: 'Perforación de frentes con Jumbo electrohidráulico',
      rows: [
        {
          peligro: 'Polvo de sílice en suspensión',
          riesgo: 'Neumoconiosis / Silicosis',
          evaluacion: 13,
          nivel: 'MEDIO',
          control: 'Humectación continua, respirador media cara con filtro P100',
        },
        {
          peligro: 'Ruido del equipo de perforación (>85 dB)',
          riesgo: 'Hipoacusia / Sordera profesional',
          evaluacion: 18,
          nivel: 'MEDIO',
          control: 'Tapones auditivos NRR 33 o mayor durante toda la operación',
        },
        {
          peligro: 'Falla mecánica del brazo hidráulico',
          riesgo: 'Aplastamiento del operador',
          evaluacion: 7,
          nivel: 'ALTO',
          control: 'Inspección preoperacional del equipo y mantenimiento preventivo',
        },
        {
          peligro: 'Zona de disparo — restos de explosivos',
          riesgo: 'Explosión accidental',
          evaluacion: 1,
          nivel: 'ALTO',
          control: 'Inspección de frente post voladura — solo personal autorizado',
        },
        {
          peligro: 'Fatiga del operador en turnos nocturnos',
          riesgo: 'Accidente por somnolencia',
          evaluacion: 14,
          nivel: 'MEDIO',
          control: 'Rotación de turnos, pausas activas y control de fatiga',
        },
      ]
    }
  ]
};

// Estado del juego IPERC
let ipercState = {
  difficulty: 'easy',
  escenarioIdx: 0,
  escenario: null,
  placements: {},  // { rowIdx_col: value }
  score: 0,
  maxScore: 0,
  verificado: false,
};

let dragItem = null;
let dragType = null;

function iniciarJuegoIperc(difficulty) {
  // Update active button
  document.querySelectorAll('.diff-btn').forEach(b => b.classList.remove('active'));
  document.getElementById('diff-' + (difficulty === 'easy' ? 'easy' : difficulty === 'medium' ? 'med' : 'hard'))?.classList.add('active');

  const escenarios = IPERC_ESCENARIOS[difficulty];
  ipercState.difficulty = difficulty;
  ipercState.escenarioIdx = Math.floor(Math.random() * escenarios.length);
  ipercState.escenario = escenarios[ipercState.escenarioIdx];
  ipercState.placements = {};
  ipercState.score = 0;
  ipercState.maxScore = ipercState.escenario.rows.length * 4; // 4 cols per row
  ipercState.verificado = false;

  renderIpercGame();
}

function renderIpercGame() {
  const container = document.getElementById('iperc-game-container');
  if (!container) return;
  const esc2 = ipercState.escenario;

  // Build shuffled option pools
  const allPeligros = shuffleArr([...esc2.rows.map(r => r.peligro)]);
  const allRiesgos  = shuffleArr([...esc2.rows.map(r => r.riesgo)]);
  const allControles= shuffleArr([...esc2.rows.map(r => r.control)]);
  const allEvals    = shuffleArr([...esc2.rows.map(r => String(r.evaluacion))]);

  container.innerHTML = `
    <div class="iperc-game-board">
      <div class="iperc-game-header">
        <h3>📋 IPERC — ${esc(esc2.actividad)}</h3>
        <span class="iperc-score-badge" id="iperc-score-display">0 pts</span>
      </div>
      <div class="iperc-scenario-info">
        <span class="iperc-scenario-tag">🏭 ${esc(esc2.area)}</span><br>
        <strong>Actividad:</strong> ${esc(esc2.actividad)}
      </div>

      <!-- Column headers -->
      <div class="iperc-col-headers" style="display:grid;grid-template-columns:30px 1fr 1fr 1fr 1fr">
        <div class="iperc-col-header">#</div>
        <div class="iperc-col-header">⚠️ PELIGRO</div>
        <div class="iperc-col-header">🔥 RIESGO</div>
        <div class="iperc-col-header">📊 EVAL (nro)</div>
        <div class="iperc-col-header">🛡️ CONTROL</div>
      </div>

      <!-- Rows -->
      ${esc2.rows.map((row, i) => `
        <div style="display:grid;grid-template-columns:30px 1fr 1fr 1fr 1fr;border-bottom:1px solid #e2e8f0"
             id="iperc-row-${i}">
          <div class="iperc-row-num">${i+1}</div>
          ${['peligro','riesgo','eval','control'].map(col => `
            <div class="iperc-drop-cell ${col}-col"
                 id="cell-${i}-${col}"
                 data-row="${i}" data-col="${col}"
                 ondragover="onDragOver(event,this)"
                 ondragleave="onDragLeave(event,this)"
                 ondrop="onDrop(event,this)"
                 onclick="onCellClick(this)">
              ${getCellContent(i, col)}
            </div>
          `).join('')}
        </div>
      `).join('')}
    </div>

    <!-- Feedback -->
    <div class="iperc-feedback" id="iperc-feedback"></div>

    <!-- Progress -->
    <div style="margin-bottom:0.5rem;font-size:0.8rem;color:var(--text-secondary)">
      Progreso: <strong id="iperc-progress-text">0 / ${esc2.rows.length * 4} campos</strong>
    </div>
    <div class="iperc-progress-bar">
      <div class="iperc-progress-fill" id="iperc-progress-fill" style="width:0%"></div>
    </div>

    <!-- Controls -->
    <div class="iperc-controls" style="margin-top:1rem">
      <button class="btn btn-success" onclick="verificarIperc()">✅ Verificar IPERC</button>
      <button class="btn btn-secondary" onclick="iniciarJuegoIperc('${ipercState.difficulty}')">🔄 Nuevo escenario</button>
      <button class="btn btn-danger" onclick="mostrarPistasIperc()">💡 Pista</button>
    </div>

    <!-- Result -->
    <div class="iperc-result" id="iperc-result"></div>

    <!-- Options bank -->
    <div class="iperc-options-bank" id="iperc-bank">
      <h4>🃏 Banco de opciones — Arrastra cada tarjeta a la fila correcta</h4>

      <div class="iperc-bank-section">
        <div class="iperc-bank-label">⚠️ Peligros</div>
        <div class="iperc-bank-cards" id="bank-peligros">
          ${allPeligros.map((p,i) => buildCard(p,'peligro',`bp-${i}`)).join('')}
        </div>
      </div>

      <div class="iperc-bank-section">
        <div class="iperc-bank-label">🔥 Riesgos</div>
        <div class="iperc-bank-cards" id="bank-riesgos">
          ${allRiesgos.map((r,i) => buildCard(r,'riesgo',`br-${i}`)).join('')}
        </div>
      </div>

      <div class="iperc-bank-section">
        <div class="iperc-bank-label">📊 Evaluación IPERC (número de la matriz)</div>
        <div class="iperc-bank-cards" id="bank-evals">
          ${allEvals.map((e,i) => buildCard(e,'nivel',`be-${i}`)).join('')}
        </div>
      </div>

      <div class="iperc-bank-section">
        <div class="iperc-bank-label">🛡️ Medidas de Control</div>
        <div class="iperc-bank-cards" id="bank-controles">
          ${allControles.map((c,i) => buildCard(c,'control',`bc-${i}`)).join('')}
        </div>
      </div>
    </div>
  `;

  // Setup touch drag support
  setupTouchDrag();
}

function buildCard(text, tipo, id) {
  return `<span class="iperc-card-tag ${tipo}"
    id="card-${id}"
    draggable="true"
    ondragstart="onDragStart(event, '${id}', '${tipo}', '${encodeURIComponent(text)}')"
    ondragend="onDragEnd(event)"
    title="${text}">
    <span class="drag-handle">⠿</span>${truncar(text, 30)}
  </span>`;
}

function getCellContent(row, col) {
  const key = `${row}_${col}`;
  const val = ipercState.placements[key];
  if (!val) return '<span style="color:#ccc;font-size:0.7rem">Arrastra aquí</span>';
  const tipo = col === 'peligro' ? 'peligro' : col === 'riesgo' ? 'riesgo' : col === 'control' ? 'control' : 'nivel';
  return `<div class="placed-item">
    <span class="iperc-card-tag ${tipo}" style="cursor:default">${truncar(val, 25)}</span>
    <button class="remove-placed" onclick="removePlacement(${row},'${col}')" title="Quitar">✕</button>
  </div>`;
}

function removePlacement(row, col) {
  const key = `${row}_${col}`;
  if (!ipercState.verificado && ipercState.placements[key]) {
    const val = ipercState.placements[key];
    delete ipercState.placements[key];
    // Put card back to bank
    const col2banco = { peligro: 'bank-peligros', riesgo: 'bank-riesgos', eval: 'bank-evals', control: 'bank-controles' };
    const bankId = col2banco[col];
    const tipo = col === 'peligro' ? 'peligro' : col === 'riesgo' ? 'riesgo' : col === 'control' ? 'control' : 'nivel';
    const bank = document.getElementById(bankId);
    if (bank) {
      const newId = 'restored-' + Date.now();
      bank.insertAdjacentHTML('beforeend', buildCard(val, tipo, newId));
      setupCardDrag(document.getElementById('card-' + newId));
    }
    // Update cell
    const cell = document.getElementById(`cell-${row}-${col}`);
    if (cell) {
      cell.innerHTML = '<span style="color:#ccc;font-size:0.7rem">Arrastra aquí</span>';
      cell.classList.remove('correct-cell', 'wrong-cell');
    }
    updateProgress();
  }
}

/* DRAG & DROP */
function onDragStart(event, cardId, tipo, encodedText) {
  dragItem = { id: cardId, tipo, text: decodeURIComponent(encodedText) };
  dragType = tipo;
  event.dataTransfer.effectAllowed = 'move';
  event.dataTransfer.setData('text/plain', JSON.stringify(dragItem));
  document.getElementById('card-' + cardId)?.classList.add('dragging');
}

function onDragEnd(event) {
  document.querySelectorAll('.iperc-card-tag.dragging').forEach(el => el.classList.remove('dragging'));
  dragItem = null;
}

function onDragOver(event, cell) {
  event.preventDefault();
  event.dataTransfer.dropEffect = 'move';
  cell.classList.add('drag-over');
}

function onDragLeave(event, cell) {
  cell.classList.remove('drag-over');
}

function onDrop(event, cell) {
  event.preventDefault();
  cell.classList.remove('drag-over');
  if (ipercState.verificado) return;
  let data;
  try { data = JSON.parse(event.dataTransfer.getData('text/plain')); }
  catch { return; }
  placeCardInCell(cell, data);
}

function onCellClick(cell) {
  // On mobile, tapping a cell while holding a dragged item
  if (!dragItem) return;
  placeCardInCell(cell, dragItem);
}

function placeCardInCell(cell, data) {
  const row = parseInt(cell.dataset.row);
  const col = cell.dataset.col;
  const key = `${row}_${col}`;

  // Check column type compatibility
  const colToTipo = { peligro: 'peligro', riesgo: 'riesgo', eval: 'nivel', control: 'control' };
  if (colToTipo[col] !== data.tipo) {
    showFeedback('⚠️ Esa tarjeta no corresponde a esa columna. Arrastra al tipo correcto.', 'error');
    return;
  }

  // If cell already has content, return the old one to bank
  if (ipercState.placements[key]) {
    const oldVal = ipercState.placements[key];
    returnCardToBank(col, oldVal);
  }

  // Place new value
  ipercState.placements[key] = data.text;

  // Remove card from bank
  document.getElementById('card-' + data.id)?.remove();

  // Update cell display
  cell.innerHTML = getCellContent(row, col);
  cell.classList.remove('empty-hint');

  updateProgress();
  dragItem = null;
}

function returnCardToBank(col, val) {
  const col2banco = { peligro: 'bank-peligros', riesgo: 'bank-riesgos', eval: 'bank-evals', control: 'bank-controles' };
  const tipo = col === 'peligro' ? 'peligro' : col === 'riesgo' ? 'riesgo' : col === 'control' ? 'control' : 'nivel';
  const bank = document.getElementById(col2banco[col]);
  if (bank) {
    const newId = 'ret-' + Date.now() + Math.random().toString(36).slice(2);
    bank.insertAdjacentHTML('beforeend', buildCard(val, tipo, newId));
    setupCardDrag(document.getElementById('card-' + newId));
  }
}

function updateProgress() {
  const total = ipercState.escenario.rows.length * 4;
  const filled = Object.keys(ipercState.placements).length;
  const pct = Math.round((filled / total) * 100);
  document.getElementById('iperc-progress-fill').style.width = pct + '%';
  document.getElementById('iperc-progress-text').textContent = `${filled} / ${total} campos`;
}

function verificarIperc() {
  if (ipercState.verificado) return;
  const esc2 = ipercState.escenario;
  let correctas = 0;
  let total = 0;

  esc2.rows.forEach((row, i) => {
    const cols = [
      { col: 'peligro', expected: row.peligro },
      { col: 'riesgo', expected: row.riesgo },
      { col: 'eval', expected: String(row.evaluacion) },
      { col: 'control', expected: row.control },
    ];
    cols.forEach(({ col, expected }) => {
      total++;
      const key = `${i}_${col}`;
      const placed = ipercState.placements[key] || '';
      const cell = document.getElementById(`cell-${i}-${col}`);
      const isCorrect = placed.trim().toLowerCase() === expected.trim().toLowerCase();
      if (cell) {
        cell.classList.remove('correct-cell', 'wrong-cell', 'empty-hint');
        cell.classList.add(isCorrect ? 'correct-cell' : 'wrong-cell');
        if (!isCorrect && placed === '') {
          cell.innerHTML = `<span style="font-size:0.68rem;color:#999">Vacío — era: "${truncar(expected,20)}"</span>`;
        }
      }
      if (isCorrect) correctas++;
    });
  });

  ipercState.verificado = true;
  ipercState.score = correctas;
  const pct = Math.round((correctas / total) * 100);

  const resultEl = document.getElementById('iperc-result');
  const stars = pct >= 90 ? '⭐⭐⭐' : pct >= 70 ? '⭐⭐' : '⭐';
  const msg = pct >= 90 ? '¡Excelente! Dominas la identificación de peligros.' :
              pct >= 70 ? '¡Bien! Sigue practicando para mejorar.' :
              'Repasa el material IPERC e inténtalo de nuevo.';

  resultEl.innerHTML = `
    <div class="big-score">${pct}%</div>
    <h3>${stars} ${correctas} / ${total} correctas</h3>
    <p>${msg}</p>
    <div style="margin-top:1rem;display:flex;gap:0.75rem;justify-content:center;flex-wrap:wrap">
      <button class="btn btn-primary" onclick="iniciarJuegoIperc('${ipercState.difficulty}')">🔄 Nuevo escenario</button>
      <button class="btn btn-secondary" onclick="mostrarSolucionIperc()">👁️ Ver solución completa</button>
    </div>
  `;
  resultEl.classList.add('show');
  document.getElementById('iperc-score-display').textContent = correctas + ' pts';
  showFeedback(pct >= 70 ? `✅ ¡Verificado! ${correctas}/${total} correctas (${pct}%)` : `❌ ${correctas}/${total} correctas. Revisa las celdas en rojo.`,
    pct >= 70 ? 'success' : 'error');
  resultEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function mostrarPistasIperc() {
  if (ipercState.verificado) return;
  const esc2 = ipercState.escenario;
  // Show first empty cell hint
  for (let i = 0; i < esc2.rows.length; i++) {
    for (const col of ['peligro','riesgo','eval','control']) {
      const key = `${i}_${col}`;
      if (!ipercState.placements[key]) {
        const row = esc2.rows[i];
        const vals = { peligro: row.peligro, riesgo: row.riesgo, eval: String(row.evaluacion), control: row.control };
        const hint = truncar(vals[col], 35);
        showFeedback(`💡 Pista — Fila ${i+1}, columna "${col.toUpperCase()}": La respuesta empieza por "${hint.slice(0,15)}..."`, 'success');
        return;
      }
    }
  }
  showFeedback('✅ ¡Ya completaste todos los campos! Presiona Verificar.', 'success');
}

function mostrarSolucionIperc() {
  const esc2 = ipercState.escenario;
  esc2.rows.forEach((row, i) => {
    [['peligro', row.peligro],['riesgo', row.riesgo],['eval', String(row.evaluacion)],['control', row.control]]
      .forEach(([col, val]) => {
        const cell = document.getElementById(`cell-${i}-${col}`);
        if (cell) {
          const tipo = col === 'peligro' ? 'peligro' : col === 'riesgo' ? 'riesgo' : col === 'control' ? 'control' : 'nivel';
          cell.innerHTML = `<span class="iperc-card-tag ${tipo}" style="cursor:default">${truncar(val, 25)}</span>`;
          cell.classList.add('correct-cell');
        }
      });
  });
}

function showFeedback(msg, type) {
  const fb = document.getElementById('iperc-feedback');
  if (!fb) return;
  fb.className = 'iperc-feedback ' + type;
  fb.textContent = msg;
  fb.style.display = 'block';
  if (type === 'error') setTimeout(() => { fb.style.display = 'none'; }, 4000);
}

/* ============================================================
   TOUCH DRAG SUPPORT (mobile)
   ============================================================ */
function setupTouchDrag() {
  document.querySelectorAll('.iperc-card-tag[draggable]').forEach(card => setupCardDrag(card));
}

function setupCardDrag(card) {
  if (!card) return;
  let touchStartX, touchStartY, clone;

  card.addEventListener('touchstart', e => {
    const touch = e.touches[0];
    touchStartX = touch.clientX;
    touchStartY = touch.clientY;
    const cardId = card.id.replace('card-', '');
    const tipo = [...card.classList].find(c => ['peligro','riesgo','control','nivel'].includes(c)) || 'peligro';
    const text = card.textContent.replace('⠿','').trim();
    dragItem = { id: cardId, tipo, text };

    clone = card.cloneNode(true);
    clone.style.cssText = `position:fixed;z-index:9999;opacity:0.85;pointer-events:none;transform:scale(1.05);max-width:200px;`;
    document.body.appendChild(clone);
  }, { passive: true });

  card.addEventListener('touchmove', e => {
    if (!clone) return;
    e.preventDefault();
    const touch = e.touches[0];
    clone.style.left = (touch.clientX - 80) + 'px';
    clone.style.top = (touch.clientY - 20) + 'px';
    // Highlight drop target
    document.querySelectorAll('.drag-over').forEach(c => c.classList.remove('drag-over'));
    const el = document.elementFromPoint(touch.clientX, touch.clientY);
    const cell = el?.closest('.iperc-drop-cell');
    if (cell) cell.classList.add('drag-over');
  }, { passive: false });

  card.addEventListener('touchend', e => {
    if (clone) { clone.remove(); clone = null; }
    document.querySelectorAll('.drag-over').forEach(c => c.classList.remove('drag-over'));
    if (!dragItem) return;
    const touch = e.changedTouches[0];
    const el = document.elementFromPoint(touch.clientX, touch.clientY);
    const cell = el?.closest('.iperc-drop-cell');
    if (cell) placeCardInCell(cell, dragItem);
    dragItem = null;
  }, { passive: true });
}

/* ============================================================
   🎮 GAMES HUB
   ============================================================ */
function abrirJuego(id) {
  document.getElementById('juegos-hub').style.display = 'none';
  document.querySelectorAll('.game-view').forEach(v => v.style.display = 'none');
  
  const view = document.getElementById('game-view-' + id);
  if (view) view.style.display = 'block';

  if (id === 'iperc') iniciarJuegoIperc('easy');
  if (id === 'desate') iniciarJuegoDesate();
  if (id === 'lentes') iniciarJuegoLentes();
}

function volverAHubJuegos() {
  document.querySelectorAll('.game-view').forEach(v => v.style.display = 'none');
  document.getElementById('juegos-hub').style.display = 'block';
}

/* ============================================================
   🎮 GAME 2: DESATE DE ROCAS
   ============================================================ */
const DESATE_STEPS = [
  "Evaluar las condiciones de seguridad (ventilación, sostenimiento).",
  "Regar el frente, techo y hastiales.",
  "Preparar una superficie segura (piso limpio) y ruta de escape.",
  "Verificar el estado de las barretillas (juego de barretillas).",
  "Posicionarse bajo techo seguro y estable.",
  "Golpear y escuchar el sonido de la roca (sonido metálico o hueco).",
  "Desatar la roca suelta haciendo palanca."
];

let currentDesateOrder = [];

function iniciarJuegoDesate() {
  // Shuffle steps
  currentDesateOrder = shuffleArr([...DESATE_STEPS]);
  renderDesateBoard();
  document.getElementById('desate-feedback').style.display = 'none';
  document.getElementById('desate-result').style.display = 'none';
}

function renderDesateBoard() {
  const board = document.getElementById('desate-board');
  board.innerHTML = currentDesateOrder.map((step, i) => `
    <div class="desate-step" draggable="true" data-index="${i}">
      <span class="desate-step-num">${i + 1}</span>
      <span class="desate-step-text">${esc(step)}</span>
      <span style="margin-left:auto;color:#cbd5e1;cursor:grab">☰</span>
    </div>
  `).join('');

  // Setup drag and drop for sorting
  let dragSrcEl = null;

  document.querySelectorAll('.desate-step').forEach(item => {
    // Desktop Drag & Drop
    item.addEventListener('dragstart', function(e) {
      dragSrcEl = this;
      e.dataTransfer.effectAllowed = 'move';
      e.dataTransfer.setData('text/html', this.innerHTML);
      this.classList.add('dragging');
    });

    item.addEventListener('dragover', function(e) {
      if (e.preventDefault) e.preventDefault();
      e.dataTransfer.dropEffect = 'move';
      return false;
    });

    item.addEventListener('dragenter', function(e) {
      this.classList.add('drag-over');
    });

    item.addEventListener('dragleave', function(e) {
      this.classList.remove('drag-over');
    });

    item.addEventListener('drop', function(e) {
      if (e.stopPropagation) e.stopPropagation();
      this.classList.remove('drag-over');
      if (dragSrcEl !== this) {
        // Swap values in array
        const srcIdx = parseInt(dragSrcEl.dataset.index);
        const tgtIdx = parseInt(this.dataset.index);
        const temp = currentDesateOrder[srcIdx];
        currentDesateOrder[srcIdx] = currentDesateOrder[tgtIdx];
        currentDesateOrder[tgtIdx] = temp;
        renderDesateBoard(); // Re-render
      }
      return false;
    });

    item.addEventListener('dragend', function(e) {
      this.classList.remove('dragging');
      document.querySelectorAll('.desate-step').forEach(i => i.classList.remove('drag-over'));
    });

    // Mobile touch support
    setupDesateTouch(item);
  });
}

function setupDesateTouch(item) {
  let touchClone = null;
  let initialY = 0;
  let initialIndex = -1;

  item.addEventListener('touchstart', e => {
    initialIndex = parseInt(item.dataset.index);
    const touch = e.touches[0];
    initialY = touch.clientY;
    
    touchClone = item.cloneNode(true);
    touchClone.style.cssText = `position:fixed;z-index:9999;opacity:0.9;pointer-events:none;width:${item.offsetWidth}px;left:${item.getBoundingClientRect().left}px;top:${touch.clientY - 20}px;box-shadow:0 10px 20px rgba(0,0,0,0.2)`;
    document.body.appendChild(touchClone);
    item.style.opacity = '0.3';
  }, { passive: true });

  item.addEventListener('touchmove', e => {
    if (!touchClone) return;
    e.preventDefault();
    const touch = e.touches[0];
    touchClone.style.top = (touch.clientY - 20) + 'px';

    const el = document.elementFromPoint(touch.clientX, touch.clientY);
    const targetItem = el?.closest('.desate-step');
    document.querySelectorAll('.desate-step').forEach(i => i.classList.remove('drag-over'));
    if (targetItem && targetItem !== item) {
      targetItem.classList.add('drag-over');
    }
  }, { passive: false });

  item.addEventListener('touchend', e => {
    if (touchClone) { touchClone.remove(); touchClone = null; }
    item.style.opacity = '1';
    document.querySelectorAll('.desate-step').forEach(i => i.classList.remove('drag-over'));
    
    const touch = e.changedTouches[0];
    const el = document.elementFromPoint(touch.clientX, touch.clientY);
    const targetItem = el?.closest('.desate-step');

    if (targetItem && targetItem !== item) {
      const tgtIdx = parseInt(targetItem.dataset.index);
      const temp = currentDesateOrder[initialIndex];
      currentDesateOrder[initialIndex] = currentDesateOrder[tgtIdx];
      currentDesateOrder[tgtIdx] = temp;
      renderDesateBoard();
    }
  }, { passive: true });
}

function verificarDesate() {
  let correctas = 0;
  document.querySelectorAll('.desate-step').forEach((el, i) => {
    const text = currentDesateOrder[i];
    el.classList.remove('correct-order', 'wrong-order');
    if (text === DESATE_STEPS[i]) {
      el.classList.add('correct-order');
      correctas++;
    } else {
      el.classList.add('wrong-order');
    }
  });

  const fb = document.getElementById('desate-feedback');
  const result = document.getElementById('desate-result');
  fb.style.display = 'block';

  if (correctas === DESATE_STEPS.length) {
    fb.className = 'iperc-feedback success';
    fb.textContent = '✅ ¡Excelente! Conoces el procedimiento seguro para desatar rocas.';
    result.style.display = 'block';
    result.innerHTML = `
      <div class="big-score">100%</div>
      <h3>⭐⭐⭐ ¡Procedimiento Perfecto!</h3>
      <p>Un desate ordenado y seguro previene accidentes fatales.</p>
      <button class="btn btn-primary" onclick="volverAHubJuegos()" style="margin-top:1rem">Volver al Arcade</button>
    `;
  } else {
    fb.className = 'iperc-feedback error';
    fb.textContent = `❌ Tienes ${correctas} de ${DESATE_STEPS.length} en la posición correcta. Sigue intentando.`;
    result.style.display = 'none';
  }
}

/* ============================================================
   🎮 GAME 3: USO DE LENTES
   ============================================================ */
const LENTES_PAIRS = [
  { peligro: 'Proyección de partículas y fragmentos', epp: 'Lentes de seguridad contra impactos (ANSI Z87.1)' },
  { peligro: 'Salpicadura de reactivos químicos', epp: 'Goggles panorámicos de ventilación indirecta' },
  { peligro: 'Radiación infrarroja y arco eléctrico', epp: 'Careta de soldador con luna filtrante' },
  { peligro: 'Polvo fino en suspensión', epp: 'Lentes herméticos / Goggles' },
  { peligro: 'Radiación UV solar intensa', epp: 'Lentes oscuros con filtro UV400' }
];

let lentesState = {};

function iniciarJuegoLentes() {
  lentesState = { placements: {} };
  renderLentesBoard();
}

function renderLentesBoard() {
  const board = document.getElementById('lentes-board');
  const bank = document.getElementById('lentes-bank');
  
  // Create rows for each Peligro
  board.innerHTML = LENTES_PAIRS.map((pair, i) => `
    <div class="lentes-row">
      <div class="lentes-peligro">⚠️ ${esc(pair.peligro)}</div>
      <div class="iperc-drop-cell lentes-drop-cell" data-index="${i}"
           ondragover="onDragOver(event,this)"
           ondragleave="onDragLeave(event,this)"
           ondrop="onDropLente(event,this)">
        ${getLenteCellContent(i)}
      </div>
    </div>
  `).join('');

  // Collect unplaced EPPs and shuffle
  const placedEpps = Object.values(lentesState.placements);
  const unplacedEpps = shuffleArr(LENTES_PAIRS.map(p => p.epp).filter(e => !placedEpps.includes(e)));

  bank.innerHTML = unplacedEpps.map((epp, i) => `
    <div class="iperc-card-tag control" id="lente-card-${i}" draggable="true"
         ondragstart="onDragStartLente(event, '${encodeURIComponent(epp)}')"
         ondragend="onDragEnd(event)">
      <span class="drag-handle">⠿</span> ${esc(epp)}
    </div>
  `).join('');

  // Setup touch for bank cards
  document.querySelectorAll('.lentes-bank .iperc-card-tag').forEach(card => {
    setupLenteTouchDrag(card);
  });
}

function getLenteCellContent(i) {
  const val = lentesState.placements[i];
  if (!val) return '<span style="color:#ccc;font-size:0.8rem">Arrastra el EPP correcto aquí</span>';
  return `<div class="placed-item">
    <span class="iperc-card-tag control" style="cursor:default;white-space:normal">${esc(val)}</span>
    <button class="remove-placed" onclick="quitarLente(${i})" title="Quitar">✕</button>
  </div>`;
}

function quitarLente(i) {
  delete lentesState.placements[i];
  renderLentesBoard();
}

// Drag logic
let dragLenteItem = null;
function onDragStartLente(event, encodedEpp) {
  dragLenteItem = decodeURIComponent(encodedEpp);
  event.dataTransfer.effectAllowed = 'move';
  event.dataTransfer.setData('text/plain', dragLenteItem);
  event.target.classList.add('dragging');
}

function onDropLente(event, cell) {
  event.preventDefault();
  cell.classList.remove('drag-over');
  let data;
  try { data = event.dataTransfer.getData('text/plain'); } catch { return; }
  placeLenteInCell(cell, data);
}

function setupLenteTouchDrag(card) {
  let touchClone = null;
  card.addEventListener('touchstart', e => {
    const touch = e.touches[0];
    dragLenteItem = card.textContent.replace('⠿','').trim();
    touchClone = card.cloneNode(true);
    touchClone.style.cssText = `position:fixed;z-index:9999;opacity:0.85;pointer-events:none;transform:scale(1.05);max-width:200px;`;
    document.body.appendChild(touchClone);
  }, { passive: true });

  card.addEventListener('touchmove', e => {
    if (!touchClone) return;
    e.preventDefault();
    const touch = e.touches[0];
    touchClone.style.left = (touch.clientX - 80) + 'px';
    touchClone.style.top = (touch.clientY - 20) + 'px';
    
    document.querySelectorAll('.lentes-drop-cell.drag-over').forEach(c => c.classList.remove('drag-over'));
    const el = document.elementFromPoint(touch.clientX, touch.clientY);
    const cell = el?.closest('.lentes-drop-cell');
    if (cell) cell.classList.add('drag-over');
  }, { passive: false });

  card.addEventListener('touchend', e => {
    if (touchClone) { touchClone.remove(); touchClone = null; }
    document.querySelectorAll('.lentes-drop-cell.drag-over').forEach(c => c.classList.remove('drag-over'));
    if (!dragLenteItem) return;
    const touch = e.changedTouches[0];
    const el = document.elementFromPoint(touch.clientX, touch.clientY);
    const cell = el?.closest('.lentes-drop-cell');
    if (cell) placeLenteInCell(cell, dragLenteItem);
    dragLenteItem = null;
  }, { passive: true });
}

function placeLenteInCell(cell, eppData) {
  const idx = parseInt(cell.dataset.index);
  // Return current item to bank if any
  lentesState.placements[idx] = eppData;
  renderLentesBoard();
}

function verificarLentes() {
  let correctas = 0;
  let total = LENTES_PAIRS.length;

  document.querySelectorAll('.lentes-drop-cell').forEach((cell, i) => {
    const expected = LENTES_PAIRS[i].epp;
    const actual = lentesState.placements[i] || '';
    cell.classList.remove('correct-cell', 'wrong-cell');
    
    if (actual === expected) {
      cell.classList.add('correct-cell');
      correctas++;
    } else {
      cell.classList.add('wrong-cell');
    }
  });

  const fb = document.getElementById('lentes-feedback');
  const result = document.getElementById('lentes-result');
  fb.style.display = 'block';

  if (correctas === total) {
    fb.className = 'iperc-feedback success';
    fb.textContent = '✅ ¡Excelente! Has protegido correctamente cada peligro.';
    result.style.display = 'block';
    result.innerHTML = `
      <div class="big-score">100%</div>
      <h3>⭐⭐⭐ ¡Ojos Protegidos!</h3>
      <p>Usar el EPP adecuado es clave para salvar tu visión.</p>
      <button class="btn btn-primary" onclick="volverAHubJuegos()" style="margin-top:1rem">Volver al Arcade</button>
    `;
  } else {
    fb.className = 'iperc-feedback error';
    fb.textContent = `❌ ${correctas} correctas de ${total}. Revisa las tarjetas resaltadas en rojo.`;
    result.style.display = 'none';
  }
}

/* ============================================================
   UTILS
   ============================================================ */
function esc(str) {
  if (!str) return '';
  const d = document.createElement('div');
  d.textContent = str;
  return d.innerHTML.replace(/'/g, '&#39;');
}

function truncar(str, n) {
  if (!str) return '';
  return str.length > n ? str.slice(0, n) + '…' : str;
}

function shuffleArr(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/* Keyboard nav */
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    if (introRunning) { cerrarIntro(); return; }
    cerrarModal('modal-pdf');
    cerrarModal('modal-training');
    cerrarModalFlyer();
  }
});

/* Boot sequence */
document.addEventListener('DOMContentLoaded', () => {
  // Launch cinematic intro first
  iniciarIntro();
  // Load data in parallel (portal is hidden behind intro)
  init();
});