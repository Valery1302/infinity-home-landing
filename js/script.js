// Firebase Configuración
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getDatabase, ref, push, set, serverTimestamp, get } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyBJJXBqu90Fi259ouMQ-mGH6afFY_V15Fo",
  authDomain: "infinity-home-landing.firebaseapp.com",
  databaseURL: "https://infinity-home-landing-default-rtdb.firebaseio.com/",
  projectId: "infinity-home-landing",
  storageBucket: "infinity-home-landing.appspot.com",
  messagingSenderId: "597647383429",
  appId: "1:597647383429:web:690a5d231bec3c2fc1c2ec"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// FUNCIONES CRUD con Firebase


const saveDatos = async (data) => {
  try {
    const datosRef = ref(db, "datos");
    const newDatosRef = push(datosRef);
    await set(newDatosRef, {
      ...data,
      createdAt: serverTimestamp(),
    });
    return { status: "success", message: "✅ Datos guardados correctamente." };
  } catch (error) {
    console.error("Error al guardar:", error);
    return { status: "error", message: "❌ No se pudieron guardar los datos." };
  }
};

const getDatos = async () => {
  try {
    const datosRef = ref(db, "datos");
    const snapshot = await get(datosRef);

    if (snapshot.exists()) {
      return { status: "success", data: snapshot.val() };
    } else {
      return { status: "empty", message: "No hay datos registrados." };
    }
  } catch (error) {
    console.error("Error al obtener datos:", error);
    return { status: "error", message: "Error al leer los datos." };
  }
};


const io = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) e.target.classList.add('is-visible');
  });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach(el => io.observe(el));

// FORMULARIO DE CONTACTO

const form = document.getElementById('contactForm');
const resp = document.getElementById('respuesta');

if (form) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const data = {
      nombre: document.getElementById('nombre').value.trim(),
      correo: document.getElementById('correo').value.trim(),
      telefono: document.getElementById('telefono')?.value.trim() || '',
      asunto: document.getElementById('asunto')?.value.trim() || '',
      mensaje: document.getElementById('mensaje').value.trim(),
    };

    if (!data.nombre || !data.correo || !data.mensaje) {
      resp.textContent = "Por favor completa todos los campos obligatorios.";
      resp.className = "mt-4 text-red-600 font-medium";
      return;
    }

    // Guardar en Firebase usando saveDatos()
    const result = await saveDatos(data);

    // Mostrar confirmación visual
    resp.textContent = result.message;
    resp.className =
      result.status === "success"
        ? "mt-4 text-green-600 font-medium"
        : "mt-4 text-red-600 font-medium";

    if (result.status === "success") form.reset();

    // Alerta flotante en pantalla
    alert(result.message);
  });
}

// ----------MENÚ MÓVIL---------------

const menuBtn = document.getElementById("menuBtn");
const mobileMenu = document.getElementById("mobileMenu");
const closeMenu = document.getElementById("closeMenu");
const overlay = document.getElementById("overlay");

function openMenu() {
  mobileMenu.classList.remove("translate-x-full", "opacity-0");
  mobileMenu.classList.add("translate-x-0", "opacity-100");
  overlay.classList.remove("opacity-0", "pointer-events-none");
  document.body.classList.add("overflow-hidden");
}

function closeMenuFn() {
  mobileMenu.classList.add("translate-x-full", "opacity-0");
  mobileMenu.classList.remove("translate-x-0", "opacity-100");
  overlay.classList.add("opacity-0", "pointer-events-none");
  document.body.classList.remove("overflow-hidden");
}

if (menuBtn && closeMenu && mobileMenu && overlay) {
  menuBtn.addEventListener("click", openMenu);
  closeMenu.addEventListener("click", closeMenuFn);
  overlay.addEventListener("click", closeMenuFn);
  mobileMenu.querySelectorAll("a").forEach(link => link.addEventListener("click", closeMenuFn));
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeMenuFn(); });
}
// -------- MODAL AUTOMATIZACIÓN (VIDEO HTML5) --------
const btnAutomatizacion   = document.querySelector('[data-service="domotica"]') || document.getElementById('btnAutomatizacion');
const modalAutomatizacion = document.getElementById('modalAutomatizacion');
const closeAutomatizacion = document.getElementById('closeAutomatizacion');

function openAuto() {
  modalAutomatizacion.classList.remove('opacity-0','pointer-events-none');
  modalAutomatizacion.classList.add('opacity-100');

  const v   = document.getElementById('vidAutomatizacion');
  const btn = document.getElementById('toggleSound');
  const fp  = document.getElementById('forcePlay');

  if (!v) return;

  v.muted = true;
  btn.textContent = 'Activar sonido';

  v.play().catch(() => {
    if (fp) fp.classList.remove('hidden');
  });

  fp?.addEventListener('click', () => {
    v.play().then(() => fp.classList.add('hidden')).catch(()=>{});
  }, { once: true });

  btn?.addEventListener('click', () => {
    // Un gesto de usuario permite activar audio
    v.muted = !v.muted;
    if (v.paused) v.play().catch(()=>{});
    btn.textContent = v.muted ? 'Activar sonido' : 'Silenciar';
  });
}

function closeAuto() {
  modalAutomatizacion.classList.add('opacity-0','pointer-events-none');
  modalAutomatizacion.classList.remove('opacity-100');

  const v  = document.getElementById('vidAutomatizacion');
  const fp = document.getElementById('forcePlay');
  const btn= document.getElementById('toggleSound');

  if (v) {
    v.pause();
    v.currentTime = 0;
    v.muted = true;
  }
  // reset UI
  if (fp) fp.classList.add('hidden');
  if (btn) btn.textContent = 'Activar sonido';
}

btnAutomatizacion?.addEventListener('click', openAuto);
closeAutomatizacion?.addEventListener('click', closeAuto);
modalAutomatizacion?.addEventListener('click', (e) => { if (e.target === modalAutomatizacion) closeAuto(); });
window.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeAuto(); });


// ----------- MODAL INSTALACIÓN DE LUMINARIA-----------
const btnInstalacion = document.querySelector('[data-service="iluminacion"]');
const modalInstalacion = document.getElementById('modalInstalacion');
const closeInstalacion = document.getElementById('closeInstalacion');

if (btnInstalacion && modalInstalacion && closeInstalacion) {
  btnInstalacion.addEventListener('click', () => {
    modalInstalacion.classList.remove('opacity-0', 'pointer-events-none');
    modalInstalacion.classList.add('opacity-100');
  });

  const closeInst = () => {
    modalInstalacion.classList.add('opacity-0', 'pointer-events-none');
    modalInstalacion.classList.remove('opacity-100');
  };

  closeInstalacion.addEventListener('click', closeInst);
  modalInstalacion.addEventListener('click', (e) => { if (e.target === modalInstalacion) closeInst(); });
  window.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeInst(); });
}
// ----------- MODAL DISEÑO & DECORACIÓN -----------
const btnDiseno   = document.querySelector('[data-service="diseno"]') || document.querySelector('[data-service="eficiencia"]');
const modalDiseno = document.getElementById('modalDiseno');
const closeDiseno = document.getElementById('closeDiseno');

if (btnDiseno && modalDiseno && closeDiseno) {
  const openD = () => {
    modalDiseno.classList.remove('opacity-0', 'pointer-events-none');
    modalDiseno.classList.add('opacity-100');
  };
  const closeD = () => {
    modalDiseno.classList.add('opacity-0', 'pointer-events-none');
    modalDiseno.classList.remove('opacity-100');
  };

  btnDiseno.addEventListener('click', openD);
  closeDiseno.addEventListener('click', closeD);
  modalDiseno.addEventListener('click', (e) => { if (e.target === modalDiseno) closeD(); });
  window.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeD(); });
}


