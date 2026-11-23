document.getElementById('anio').textContent = new Date().getFullYear();

// Menú móvil
const burger = document.querySelector('.burger'), menu = document.getElementById('menu');
burger.addEventListener('click', () => {
  const abierto = menu.classList.toggle('open');
  burger.setAttribute('aria-expanded', abierto);
});
menu.addEventListener('click', e => { if (e.target.tagName === 'A') { menu.classList.remove('open'); burger.setAttribute('aria-expanded', false); } });

// Galería: lightbox
const lb = document.getElementById('lightbox'), lbImg = lb.querySelector('img');
document.querySelectorAll('.gallery figure').forEach(f => {
  const img = f.querySelector('img');
  img.addEventListener('error', () => img.style.display = 'none'); // muestra el degradado si falta la foto
  f.addEventListener('click', () => { if (img.style.display === 'none') return; lbImg.src = img.src; lbImg.alt = img.alt; lb.hidden = false; });
});
lb.addEventListener('click', () => lb.hidden = true);
document.addEventListener('keydown', e => { if (e.key === 'Escape') lb.hidden = true; });

// Formulario de contacto
const form = document.getElementById('form'), estado = document.getElementById('estado');
form.addEventListener('submit', async e => {
  e.preventDefault();
  estado.className = ''; estado.textContent = '';
  const d = new FormData(form);
  const nombre = d.get('nombre').trim(), correo = d.get('correo').trim(), mensaje = d.get('comentario').trim(), tel = d.get('telefono').trim();
  if (nombre.length < 2 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo) || mensaje.length < 10 || tel.replace(/\D/g,'').length < 7) {
    estado.className = 'bad'; estado.textContent = 'Revisa los campos: escribe tu nombre, un correo válido, un teléfono y un mensaje de al menos 10 caracteres.'; return;
  }
  const btn = form.querySelector('button'); btn.disabled = true; estado.textContent = 'Enviando…';
  try {
    const r = await fetch('envio.php', { method: 'POST', body: d });
    const j = await r.json();
    estado.className = j.ok ? 'ok' : 'bad'; estado.textContent = j.msg;
    if (j.ok) form.reset();
  } catch (err) {
    estado.className = 'bad'; estado.textContent = 'No se pudo enviar. Inténtalo de nuevo en unos minutos.';
  }
  btn.disabled = false;
});
