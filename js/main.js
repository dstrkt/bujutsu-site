/* ============================================================
   BUJUTSU — JavaScript del sitio
   1) Menu movil (hamburguesa)  2) Horarios filtrables
   Edita el objeto CLASSES para cambiar el horario real.
   ============================================================ */

// mobile menu
const burger = document.getElementById('burger');
const mm = document.getElementById('mobileMenu');
burger.addEventListener('click', ()=> mm.classList.toggle('open'));
mm.querySelectorAll('a').forEach(a=> a.addEventListener('click', ()=> mm.classList.remove('open')));


// horarios data
const CLASSES = {
  Lun:[['07:00','BJJ','bjj'],['18:00','Muay Thai','mt'],['20:00','MMA','mma']],
  Mar:[['07:00','Muay Thai','mt'],['18:00','BJJ','bjj'],['20:00','No-Gi','bjj']],
  Mié:[['07:00','BJJ','bjj'],['18:00','MMA','mma'],['20:00','Muay Thai','mt']],
  Jue:[['07:00','Muay Thai','mt'],['18:00','BJJ','bjj'],['20:00','MMA','mma']],
  Vie:[['07:00','BJJ','bjj'],['18:00','Muay Thai','mt'],['19:30','Open Mat','bjj']],
  Sáb:[['09:00','BJJ','bjj'],['10:30','Muay Thai','mt'],['12:00','Femenil','mma']],
  Dom:[['12:00','Open Mat','bjj']],
};
const week = document.getElementById('week');
function renderWeek(filter){
  week.innerHTML='';
  Object.entries(CLASSES).forEach(([day,slots])=>{
    const col=document.createElement('div'); col.className='day';
    col.innerHTML='<h4>'+day+'</h4>';
    slots.filter(s=> filter==='all'||s[2]===filter).forEach(s=>{
      col.innerHTML+='<div class="slot"><div class="t">'+s[0]+'</div><div class="d">'+s[1]+'</div></div>';
    });
    week.appendChild(col);
  });
}
renderWeek('all');
document.querySelectorAll('.sched-tab').forEach(tab=>{
  tab.addEventListener('click',()=>{
    document.querySelectorAll('.sched-tab').forEach(t=>t.classList.remove('active'));
    tab.classList.add('active'); renderWeek(tab.dataset.f);
  });
});


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
