/* ============================================================
   BUJUTSU — JavaScript del sitio
   Menú móvil · formulario (Formspree) · popup de promoción
   ============================================================ */

// mobile menu
const burger = document.getElementById('burger');
const mm = document.getElementById('mobileMenu');
burger.addEventListener('click', ()=> mm.classList.toggle('open'));
mm.querySelectorAll('a').forEach(a=> a.addEventListener('click', ()=> mm.classList.remove('open')));



// ---- Formulario de clase de prueba (envío AJAX a Formspree) ----
(function () {
  const form = document.getElementById('lead-form');
  if (!form) return;
  const status = document.getElementById('form-status');
  const btn = form.querySelector('button[type="submit"]');
  const btnText = btn ? btn.textContent : '';

  function show(msg, ok) {
    if (!status) return;
    status.textContent = msg;
    status.className = 'form-status ' + (ok ? 'ok' : 'err');
    status.hidden = false;
  }

  form.addEventListener('submit', async function (e) {
    e.preventDefault();
    if (btn) { btn.disabled = true; btn.textContent = 'Enviando...'; }
    try {
      const res = await fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { 'Accept': 'application/json' }
      });
      if (res.ok) {
        form.reset();
        show('¡Gracias! Te contactaremos muy pronto por WhatsApp. 🥋', true);
      } else {
        const data = await res.json().catch(() => ({}));
        const msg = (data.errors && data.errors.map(x => x.message).join(', '))
          || 'No se pudo enviar. Intenta de nuevo o escríbenos por WhatsApp.';
        show(msg, false);
      }
    } catch (_) {
      show('Error de conexión. Revisa tu internet o escríbenos por WhatsApp.', false);
    } finally {
      if (btn) { btn.disabled = false; btn.textContent = btnText; }
    }
  });
})();


// ---- Recorrido del dojo: flechas del carrusel ----
(function () {
  const track = document.getElementById('track');
  if (!track) return;
  document.querySelectorAll('.tour-nav button').forEach(function (b) {
    b.addEventListener('click', function () {
      track.scrollBy({ left: Number(b.dataset.dir) * track.clientWidth * 0.7, behavior: 'smooth' });
    });
  });
})();

// ---- Horarios en móvil: pestañas por día (mañana + tarde juntas) ----
(function () {
  const subs = document.querySelectorAll('#horarios .sched-sub');
  if (!subs.length) return;
  const ORDER = ['Lunes','Martes','Miércoles','Jueves','Viernes','Sábado','Domingo'];
  const SHORT = { 'Lunes':'Lun','Martes':'Mar','Miércoles':'Mié','Jueves':'Jue','Viernes':'Vie','Sábado':'Sáb','Domingo':'Dom' };
  const data = {}; // { dia: [{turno, slotsHTML}] }
  subs.forEach(function (sub) {
    const grid = sub.nextElementSibling;
    if (!grid || !grid.classList.contains('grid-week')) return;
    const turno = sub.textContent.replace('Horario', '').trim();
    grid.querySelectorAll('.day').forEach(function (d) {
      const name = d.querySelector('h4').textContent.trim();
      const slots = Array.from(d.querySelectorAll('.slot')).map(s => s.outerHTML).join('');
      (data[name] = data[name] || []).push({ turno: turno, html: slots });
    });
  });
  const days = ORDER.filter(d => data[d]);
  const wrap = document.createElement('div');
  wrap.className = 'sched-mobile';
  wrap.innerHTML = '<div class="day-tabs" role="tablist"></div><div class="day-panel" aria-live="polite"></div>';
  subs[0].parentNode.insertBefore(wrap, subs[0]);
  const tabs = wrap.querySelector('.day-tabs'), panel = wrap.querySelector('.day-panel');
  function show(day) {
    tabs.querySelectorAll('button').forEach(b => b.classList.toggle('active', b.dataset.day === day));
    panel.innerHTML = data[day].map(t => '<h5>' + t.turno + '</h5>' + (t.html || '<p class="empty">Sin clases</p>')).join('');
  }
  days.forEach(function (d) {
    const b = document.createElement('button');
    b.type = 'button'; b.textContent = SHORT[d] || d; b.dataset.day = d;
    b.addEventListener('click', () => show(d));
    tabs.appendChild(b);
  });
  const today = ORDER[(new Date().getDay() + 6) % 7];
  show(data[today] ? today : days[0]);
})();

// ---- Barra fija móvil: se oculta cuando el formulario está a la vista ----
(function () {
  const bar = document.getElementById('mBar'), form = document.getElementById('prueba');
  if (!bar || !form || !('IntersectionObserver' in window)) return;
  new IntersectionObserver(function (e) { bar.classList.toggle('hide', e[0].isIntersecting); }, { threshold: 0.15 }).observe(form);
})();
