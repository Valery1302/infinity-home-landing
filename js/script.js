
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getDatabase, ref, push, serverTimestamp, query, limitToLast, onValue } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-database.js";

// TODO: Reemplaza con tu configuración real desde la consola de Firebase
// (Proyecto > Configuración > Tus apps > SDK de configuración)
const firebaseConfig = {
  apiKey: "TU_API_KEY",
  authDomain: "TU_PROYECTO.firebaseapp.com",
  databaseURL: "https://TU_PROYECTO.firebaseio.com",
  projectId: "TU_PROYECTO",
  storageBucket: "TU_PROYECTO.appspot.com",
  messagingSenderId: "TU_SENDER_ID",
  appId: "TU_APP_ID"
};

// Inicializa Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// Animación reveal al hacer scroll
const io = new IntersectionObserver((entries)=>{
  entries.forEach(e=>{
    if(e.isIntersecting) e.target.classList.add('is-visible');
  });
},{ threshold: 0.12 });
document.querySelectorAll('.reveal').forEach(el=>io.observe(el));

// --- POST: envío del formulario a Realtime Database ---
const form = document.getElementById('contactForm');
const resp = document.getElementById('respuesta');

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const data = {
    nombre: document.getElementById('nombre').value.trim(),
    correo: document.getElementById('correo').value.trim(),
    servicio: document.getElementById('servicio').value,
    mensaje: document.getElementById('mensaje').value.trim(),
    createdAt: serverTimestamp()
  };

  if(!data.nombre || !data.correo || !data.servicio || !data.mensaje){
    resp.textContent = "Por favor completa todos los campos.";
    resp.className = "mt-4 text-red-600 font-medium";
    return;
  }

  try{
    await push(ref(db, 'solicitudes'), data);
    resp.textContent = `¡Gracias ${data.nombre}! Tu solicitud fue enviada correctamente.`;
    resp.className = "mt-4 text-green-600 font-medium";
    form.reset();
  }catch(err){
    console.error(err);
    resp.textContent = "Error al enviar. Revisa tu conexión o configuración de Firebase.";
    resp.className = "mt-4 text-red-600 font-medium";
  }
});

// --- GET: leer últimos registros bajo /solicitudes ---
const btnCargar = document.getElementById('cargarDatos');
const lista = document.getElementById('listaDatos');

btnCargar.addEventListener('click', () => {
  lista.innerHTML = "<p class='text-gray-300'>Cargando datos...</p>";
  const q = query(ref(db, 'solicitudes'), limitToLast(6));
  onValue(q, (snap) => {
    const items = [];
    snap.forEach(child => {
      const d = child.val();
      items.push(`
        <div class="item">
          <h3>${d.nombre || "Sin nombre"}</h3>
          <p class="text-sm">${d.mensaje || ""}</p>
          <p class="text-xs mt-2 text-gray-400">${d.correo || ""} • ${d.servicio || ""}</p>
        </div>
      `);
    });
    if(items.length === 0){
      lista.innerHTML = "<p class='text-gray-300'>No hay registros aún.</p>";
    }else{
      // los datos vienen en orden por key; invertimos para ver el más reciente primero
      lista.innerHTML = items.reverse().join("");
    }
  }, (err) => {
    console.error(err);
    lista.innerHTML = "<p class='text-red-400'>Error al leer datos. Verifica reglas de Realtime Database.</p>";
  });
});
// --- Menú móvil hamburguesa (sin overlay de fondo) ---
const menuBtn = document.getElementById("menuBtn");
const mobileMenu = document.getElementById("mobileMenu");
const closeMenu = document.getElementById("closeMenu");

function openMenu() {
  mobileMenu.classList.remove("translate-x-full", "opacity-0");
  mobileMenu.classList.add("translate-x-0", "opacity-100");
  document.body.classList.add("overflow-hidden");
}

function closeMenuFn() {
  mobileMenu.classList.add("translate-x-full", "opacity-0");
  mobileMenu.classList.remove("translate-x-0", "opacity-100");
  document.body.classList.remove("overflow-hidden");
}


menuBtn.addEventListener("click", openMenu);
closeMenu.addEventListener("click", closeMenuFn);
mobileMenu.querySelectorAll("a").forEach(link => link.addEventListener("click", closeMenuFn));
document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeMenuFn(); });
