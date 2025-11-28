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
async function mostrarDatos() {
  const cont = document.getElementById("datosContainer");
  if (!cont) return;

  cont.innerHTML = "<p class='text-gray-500'>Cargando registros...</p>";

  const res = await getDatos();

  if (res.status !== "success") {
    cont.innerHTML = "<p class='text-gray-500'>No hay registros aún.</p>";
    return;
  }

  const entries = Object.values(res.data);

  cont.innerHTML = entries.map(d => `
    <li class="p-4 border rounded-lg bg-white shadow-sm">
      <p><strong>Nombre:</strong> ${d.nombre}</p>
      <p><strong>Correo:</strong> ${d.correo}</p>
      <p><strong>Teléfono:</strong> ${d.telefono}</p>
      <p><strong>Asunto:</strong> ${d.asunto}</p>
      <p><strong>Mensaje:</strong> ${d.mensaje}</p>
    </li>
  `).join("");
}

document.addEventListener("DOMContentLoaded", mostrarDatos);
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

    const result = await saveDatos(data);

    resp.textContent = result.message;
    resp.className =
      result.status === "success"
        ? "mt-4 text-green-600 font-medium"
        : "mt-4 text-red-600 font-medium";

    if (result.status === "success") {
      form.reset();
      mostrarDatos();  
    }

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
const btnAutomatizacion = document.querySelector('[data-service="domotica"]') || document.getElementById('btnAutomatizacion');
const modalAutomatizacion = document.getElementById('modalAutomatizacion');
const closeAutomatizacion = document.getElementById('closeAutomatizacion');

function openAuto() {
  modalAutomatizacion.classList.remove('opacity-0', 'pointer-events-none');
  modalAutomatizacion.classList.add('opacity-100');

  const v = document.getElementById('vidAutomatizacion');
  const btn = document.getElementById('toggleSound');
  const fp = document.getElementById('forcePlay');

  if (!v) return;

  v.muted = true;
  btn.textContent = 'Activar sonido';

  v.play().catch(() => {
    if (fp) fp.classList.remove('hidden');
  });

  fp?.addEventListener('click', () => {
    v.play().then(() => fp.classList.add('hidden')).catch(() => { });
  }, { once: true });

  btn?.addEventListener('click', () => {
    // Un gesto de usuario permite activar audio
    v.muted = !v.muted;
    if (v.paused) v.play().catch(() => { });
    btn.textContent = v.muted ? 'Activar sonido' : 'Silenciar';
  });
}

function closeAuto() {
  modalAutomatizacion.classList.add('opacity-0', 'pointer-events-none');
  modalAutomatizacion.classList.remove('opacity-100');

  const v = document.getElementById('vidAutomatizacion');
  const fp = document.getElementById('forcePlay');
  const btn = document.getElementById('toggleSound');

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
const btnDiseno = document.querySelector('[data-service="diseno"]') || document.querySelector('[data-service="eficiencia"]');
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

// --------- Helpers ----------
const $ = (id) => document.getElementById(id);

// --------- Lightbox  ----------
const lb = $("lightbox"), img = $("lbImg"), vid = $("lbVid"),
      cap = $("lbCap"), btnC = $("lbClose"), btnP = $("lbPrev"), btnN = $("lbNext");

let items = [], i = 0;

const show = (k) => {
  if (!items.length) return;
  i = (k + items.length) % items.length;
  const it = items[i];

  if (it.type === "video") {
    img?.classList.add("hidden"); if (img) img.src = "";
    if (vid) {
      vid.classList.remove("hidden");
      vid.src = it.src; vid.currentTime = 0;
      vid.muted = true; vid.playsInline = true; vid.autoplay = true;
      vid.play().catch(()=>{});
    }
  } else {
    if (vid) { vid.pause(); vid.classList.add("hidden"); vid.src = ""; }
    if (img) { img.classList.remove("hidden"); img.src = it.src; }
  }
  if (cap) cap.textContent = it.caption || "";
};

const open = (gallery = [], video = "", title = "") => {
  items = gallery.map(s => ({ type: "img", src: s.trim(), caption: title }));
  if (video) items.push({ type: "video", src: video.trim(), caption: title });
  if (!items.length) return;
  document.body.classList.add("overflow-hidden");
  lb?.classList.remove("hidden");
  const one = items.length < 2; btnP && (btnP.disabled = one); btnN && (btnN.disabled = one);
  show(0);
};

const close = () => {
  lb?.classList.add("hidden");
  document.body.classList.remove("overflow-hidden");
  if (vid) { vid.pause(); vid.src = ""; }
  if (img) img.src = "";
  items = []; i = 0;
};

document.addEventListener("click", (e) => {
  const el = e.target.closest("[data-gallery]");
  if (!el) return;
  const gal = (el.dataset.gallery || "").split(",").map(s=>s.trim()).filter(Boolean);
  open(gal, el.dataset.video || "", el.dataset.title || "");
});

btnC?.addEventListener("click", close);
btnP?.addEventListener("click", () => show(i - 1));
btnN?.addEventListener("click", () => show(i + 1));
lb?.addEventListener("click", (e) => e.target === lb && close());
window.addEventListener("keydown", (e) => {
  if (lb?.classList.contains("hidden")) return;
  if (e.key === "Escape") close();
  if (e.key === "ArrowLeft" && items.length > 1) show(i - 1);
  if (e.key === "ArrowRight" && items.length > 1) show(i + 1);
});

document.addEventListener("DOMContentLoaded", () => {
  const back = $("btnBack"); if (!back) return;
  back.addEventListener("click", () => {
    if (document.referrer && new URL(document.referrer).origin === location.origin) return history.back();
    const base = location.href.replace(/proyecto\.html.*$/,"");
    location.href = base + "index.html#proyectos";
  });
});
