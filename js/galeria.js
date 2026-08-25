/* ============================================================
   BUJUTSU — Galería: filtros por tags + lightbox
   Las fotos se definen en js/gallery-data.js (variable PHOTOS).
   ============================================================ */

const grid    = document.getElementById('gal-grid');
const filters = document.getElementById('gal-filters');
let current = 'Todas';

// lista de tags única, en orden de aparición
const tags = ['Todas'];
PHOTOS.forEach(p => p.tags.forEach(t => { if (!tags.includes(t)) tags.push(t); }));

// botones de filtro
filters.innerHTML = tags.map((t, i) =>
  `<button class="gal-filter${i === 0 ? ' active' : ''}" data-tag="${t}">${t}</button>`
).join('');

function render() {
  grid.innerHTML = PHOTOS
    .filter(p => current === 'Todas' || p.tags.includes(current))
    .map((p, i) => `
      <a class="gal-item" href="${p.src}" data-idx="${i}" aria-label="${p.alt}">
        <img loading="lazy" src="${p.src}" alt="${p.alt}">
        <span class="gal-tag">${p.tags[0]}</span>
      </a>`).join('');
}

filters.addEventListener('click', e => {
  const btn = e.target.closest('.gal-filter');
  if (!btn) return;
  current = btn.dataset.tag;
  filters.querySelectorAll('.gal-filter').forEach(b => b.classList.toggle('active', b === btn));
  render();
});

// ---- Lightbox ----
const lb    = document.getElementById('lightbox');
const lbImg = document.getElementById('lb-img');
let shown = [];
let pos = 0;

function visiblePhotos() {
  return PHOTOS.filter(p => current === 'Todas' || p.tags.includes(current));
}
function openAt(i) {
  shown = visiblePhotos();
  pos = i;
  lbImg.src = shown[pos].src;
  lbImg.alt = shown[pos].alt;
  lb.classList.add('open');
}
function move(d) {
  pos = (pos + d + shown.length) % shown.length;
  lbImg.src = shown[pos].src;
  lbImg.alt = shown[pos].alt;
}
grid.addEventListener('click', e => {
  const item = e.target.closest('.gal-item');
  if (!item) return;
  e.preventDefault();
  openAt(Number(item.dataset.idx));
});
lb.addEventListener('click', e => {
  if (e.target.dataset.act === 'close' || e.target === lb) lb.classList.remove('open');
  if (e.target.dataset.act === 'next') move(1);
  if (e.target.dataset.act === 'prev') move(-1);
});
document.addEventListener('keydown', e => {
  if (!lb.classList.contains('open')) return;
  if (e.key === 'Escape') lb.classList.remove('open');
  if (e.key === 'ArrowRight') move(1);
  if (e.key === 'ArrowLeft') move(-1);
});

// menú móvil
const burger = document.getElementById('burger');
const mm = document.getElementById('mobileMenu');
if (burger && mm) {
  burger.addEventListener('click', () => mm.classList.toggle('open'));
  mm.querySelectorAll('a').forEach(a => a.addEventListener('click', () => mm.classList.remove('open')));
}

render();
