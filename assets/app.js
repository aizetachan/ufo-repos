/* EXPEDIENTE UMBRA — lógica compartida */

const ESTADOS = {
  sin_explicar: "SIN EXPLICAR",
  disputado: "DISPUTADO",
  explicado: "EXPLICADO",
};

/* ---------- Modo Creyente / Escéptico ---------- */
function iniciarModo() {
  const guardado = localStorage.getItem("modo") || "creyente";
  document.body.dataset.modo = guardado;
  const interruptor = document.getElementById("interruptor-modo");
  if (interruptor) {
    interruptor.addEventListener("click", () => {
      const nuevo = document.body.dataset.modo === "creyente" ? "esceptico" : "creyente";
      document.body.dataset.modo = nuevo;
      localStorage.setItem("modo", nuevo);
    });
  }
  document.addEventListener("click", (e) => {
    if (e.target.closest(".aviso-otra-version")) {
      document.getElementById("interruptor-modo")?.click();
    }
  });
}

/* ---------- Intro terminal (solo una vez por sesión) ---------- */
function iniciarIntro() {
  const intro = document.getElementById("terminal-intro");
  if (!intro) return;
  if (sessionStorage.getItem("acceso")) {
    intro.remove();
    return;
  }
  const lineas = [
    "> CONECTANDO CON SERVIDOR SEGURO...",
    "> CANAL CIFRADO ESTABLECIDO",
    "> VERIFICANDO CREDENCIALES... [DENEGADO]",
    "> REINTENTANDO POR PUERTA TRASERA... [OK]",
    "> ACCESO CONCEDIDO — NIVEL: NO AUTORIZADO",
    "> ABRIENDO ARCHIVO...",
  ];
  const pre = intro.querySelector("pre");
  let i = 0;
  const cerrar = () => {
    sessionStorage.setItem("acceso", "1");
    intro.classList.add("oculto");
    setTimeout(() => intro.remove(), 600);
  };
  const tic = setInterval(() => {
    if (i < lineas.length) {
      pre.textContent += lineas[i] + "\n";
      i++;
    } else {
      clearInterval(tic);
      setTimeout(cerrar, 500);
    }
  }, 320);
  intro.addEventListener("click", () => { clearInterval(tic); cerrar(); });
}

/* ---------- Datos ---------- */
let _casos = null;
async function cargarCasos() {
  if (_casos) return _casos;
  const resp = await fetch("data/casos.json");
  const datos = await resp.json();
  _casos = datos.casos;
  return _casos;
}

/* ---------- Utilidades de render ---------- */
function esc(t) {
  const d = document.createElement("div");
  d.textContent = t ?? "";
  return d.innerHTML;
}

function refExpediente(caso) {
  const anio = caso.fecha.slice(0, 4);
  return `REF ${anio}/${caso.id.toUpperCase().replace(/-/g, "·")}`;
}

function tarjetaCaso(caso) {
  const docs = caso.documentos && caso.documentos.length > 0;
  return `
    <a class="ficha-caso" href="expediente.html?id=${encodeURIComponent(caso.id)}">
      <span class="ref">${esc(refExpediente(caso))} — ${esc(caso.pais)}</span>
      <h3>${esc(caso.titulo)}</h3>
      <span class="lugar-fecha">${esc(caso.lugar)} · ${esc(caso.fechaTexto)}</span>
      <p>${esc(caso.gancho)}</p>
      <span class="pie-ficha">
        <span class="estado estado-${caso.estado}">${ESTADOS[caso.estado]}</span>
        ${docs ? '<span class="doc-si">📄 doc. oficial</span>' : ""}
      </span>
    </a>`;
}

/* ---------- Portada ---------- */
async function iniciarPortada() {
  const casos = await cargarCasos();

  // Expediente del día: rota según el día del año
  const ahora = new Date();
  const inicioAnio = new Date(ahora.getFullYear(), 0, 0);
  const diaDelAnio = Math.floor((ahora - inicioAnio) / 86400000);
  const destacado = casos[diaDelAnio % casos.length];
  const contDestacado = document.getElementById("destacado");
  if (contDestacado) {
    contDestacado.innerHTML = `
      <a class="destacado" href="expediente.html?id=${encodeURIComponent(destacado.id)}">
        <span class="sello">Desclasificado</span>
        <span class="estado estado-${destacado.estado}">${ESTADOS[destacado.estado]}</span>
        <h2>${esc(destacado.titulo)}</h2>
        <span class="meta">${esc(destacado.lugar)} · ${esc(destacado.fechaTexto)}</span>
        <p class="gancho">${esc(destacado.gancho)}</p>
        <span class="abrir">Abrir expediente</span>
      </a>`;
  }

  // Ruta "Empieza aquí"
  const ruta = casos
    .filter((c) => c.empiezaAqui)
    .sort((a, b) => a.empiezaAqui - b.empiezaAqui);
  const contRuta = document.getElementById("ruta");
  if (contRuta) {
    contRuta.innerHTML = ruta
      .map((c) => `<a href="expediente.html?id=${encodeURIComponent(c.id)}">${esc(c.titulo)}</a>`)
      .join("");
  }

  // Listado con filtros
  const contLista = document.getElementById("lista-casos");
  const orden = [...casos].sort((a, b) => a.fecha.localeCompare(b.fecha));
  const pintar = (filtro) => {
    let visibles = orden;
    if (filtro === "espana") visibles = orden.filter((c) => c.pais === "España");
    if (filtro === "internacional") visibles = orden.filter((c) => c.pais !== "España");
    if (filtro === "sin_explicar") visibles = orden.filter((c) => c.estado === "sin_explicar");
    if (filtro === "disputado") visibles = orden.filter((c) => c.estado === "disputado");
    contLista.innerHTML = visibles.map(tarjetaCaso).join("");
  };
  pintar("todos");
  document.querySelectorAll(".filtros button").forEach((btn) => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".filtros button").forEach((b) => b.classList.remove("activo"));
      btn.classList.add("activo");
      pintar(btn.dataset.filtro);
    });
  });
}

/* ---------- Ficha de expediente ---------- */
async function iniciarExpediente() {
  const casos = await cargarCasos();
  const id = new URLSearchParams(location.search).get("id");
  const caso = casos.find((c) => c.id === id) || casos[0];
  document.title = `${caso.titulo} — EXPEDIENTE UMBRA`;

  const docs = (caso.documentos || [])
    .map(
      (d) => `
      <a class="doc-original" href="${esc(d.url)}" target="_blank" rel="noopener">
        ${esc(d.titulo)}
        <span class="fuente-doc">${esc(d.fuente)}</span>
      </a>`
    )
    .join("");

  const fuentes = (caso.fuentes || [])
    .map((f) => `<li><a href="${esc(f.url)}" target="_blank" rel="noopener">${esc(f.titulo)}</a></li>`)
    .join("");

  const relacionados = (caso.relacionados || [])
    .map((rid) => casos.find((c) => c.id === rid))
    .filter(Boolean)
    .map((c) => `<a href="expediente.html?id=${encodeURIComponent(c.id)}">${esc(c.titulo)}</a>`)
    .join("");

  document.getElementById("expediente").innerHTML = `
    <div class="expediente-cabecera">
      <span class="sello">Desclasificado</span>
      <span class="ref" style="font-size:10px;letter-spacing:2px;color:var(--tinta-tenue)">${esc(refExpediente(caso))}</span>
      <h1>${esc(caso.titulo)}</h1>
      <p>${esc(caso.resumen)}</p>
      <div class="meta">
        <span>LUGAR: <b>${esc(caso.lugar)}</b></span>
        <span>FECHA: <b>${esc(caso.fechaTexto)}</b></span>
        <span>ESTADO: <span class="estado estado-${caso.estado}">${ESTADOS[caso.estado]}</span></span>
      </div>
    </div>

    <div class="bloque">
      <h2>Qué ocurrió</h2>
      <p>${esc(caso.queOcurrio)}</p>
    </div>

    <div class="bloque">
      <h2>Quién lo vio</h2>
      <ul>${caso.testigos.map((t) => `<li>${esc(t)}</li>`).join("")}</ul>
    </div>

    <div class="bloque solo-creyente">
      <div class="version version-creyente">
        <div class="quien">La lectura del creyente</div>
        <p>${esc(caso.creyente)}</p>
      </div>
      <p class="aviso-otra-version">Hay otra manera de leer este caso → activar modo escéptico</p>
    </div>

    <div class="bloque solo-esceptico">
      <div class="version version-esceptico">
        <div class="quien">La lectura del escéptico</div>
        <p>${esc(caso.esceptico)}</p>
      </div>
      <p class="aviso-otra-version">Hay otra manera de leer este caso → activar modo creyente</p>
    </div>

    <div class="bloque">
      <h2>Documentación oficial</h2>
      ${docs || '<p class="sin-docs">Este caso no cuenta con documentación oficial pública. Se presenta como fenómeno cultural documentado por fuentes periodísticas y de investigación.</p>'}
      ${fuentes ? `<ul style="margin-top:14px">${fuentes}</ul>` : ""}
    </div>

    <div class="bloque">
      <h2>Casos relacionados</h2>
      <div class="relacionados-lista">${relacionados}</div>
    </div>`;
}

/* ---------- Arranque ---------- */
document.addEventListener("DOMContentLoaded", () => {
  iniciarModo();
  iniciarIntro();
  const pagina = document.body.dataset.pagina;
  if (pagina === "portada") iniciarPortada();
  if (pagina === "expediente") iniciarExpediente();
});
