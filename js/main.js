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


// ---- Popup de promoción (flyer) ----
(function () {
  const m = document.getElementById('promoModal');
  if (!m) return;
  const closeBtn = document.getElementById('promoClose');
  let dismissed = false;
  try { dismissed = sessionStorage.getItem('promoClosed') === '1'; } catch (e) {}
  if (!dismissed) { setTimeout(() => m.classList.add('open'), 900); }
  function hide() {
    m.classList.remove('open');
    try { sessionStorage.setItem('promoClosed', '1'); } catch (e) {}
  }
  closeBtn.addEventListener('click', hide);
  m.addEventListener('click', e => { if (e.target === m) hide(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') hide(); });
})();
