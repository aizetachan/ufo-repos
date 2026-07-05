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

/* ---------- Navegación común ---------- */
const SECCIONES_NAV = [
  ["index.html", "portada", "Archivo"],
  ["cronologia.html", "cronologia", "Cronología"],
  ["bestiario.html", "bestiario", "Bestiario"],
  ["mapa.html", "mapa", "Mapa"],
  ["archivo-espanol.html", "archivo-espanol", "Archivo español"],
  ["archivos.html", "archivos", "Sala de archivos"],
  ["glosario.html", "glosario", "Glosario"],
  ["reportar.html", "reportar", "Reportar"],
  ["metodologia.html", "metodologia", "Metodología"],
];

function iniciarNav() {
  const nav = document.getElementById("nav-sitio");
  if (!nav) return;
  const actual = document.body.dataset.pagina;
  nav.innerHTML =
    '<div class="contenido-nav">' +
    SECCIONES_NAV.map(
      ([href, pagina, nombre]) =>
        `<a href="${href}" class="${pagina === actual ? "actual" : ""}">${nombre}</a>`
    ).join("") +
    "</div>";
}

/* ---------- Bestiario ---------- */
const SILUETAS = {
  grises:
    '<svg viewBox="0 0 100 100"><path d="M50 8c-19 0-30 13-30 29 0 12 7 22 15 28l4 14c1 4 3 6 5 12h12c2-6 4-8 5-12l4-14c8-6 15-16 15-28 0-16-11-29-30-29z"/><ellipse cx="36" cy="42" rx="9" ry="14" transform="rotate(24 36 42)" fill="#060806"/><ellipse cx="64" cy="42" rx="9" ry="14" transform="rotate(-24 64 42)" fill="#060806"/></svg>',
  nordicos:
    '<svg viewBox="0 0 100 100"><circle cx="50" cy="16" r="11"/><path d="M50 28c-10 0-16 6-17 15l-3 25h6l3 24h5l2-22h8l2 22h5l3-24h6l-3-25c-1-9-7-15-17-15z"/></svg>',
  reptilianos:
    '<svg viewBox="0 0 100 100"><path d="M50 6l-8 10-10 4-6 14 2 14 8 12 4 12 3 20h14l3-20 4-12 8-12 2-14-6-14-10-4z"/><path d="M40 40l8 4-8 4c-3-2-3-6 0-8zM60 40c3 2 3 6 0 8l-8-4z" fill="#060806"/><path d="M46 12l4-8 4 8-4 4z" /></svg>',
  mantis:
    '<svg viewBox="0 0 100 100"><path d="M50 20L30 8l6 12zM50 20L70 8l-6 12z"/><path d="M50 18c-11 0-17 7-17 15 0 7 5 12 10 14l-6 18 6 24h4l2-20h2l2 20h4l6-24-6-18c5-2 10-7 10-14 0-8-6-15-17-15z"/><ellipse cx="40" cy="32" rx="6" ry="8" fill="#060806"/><ellipse cx="60" cy="32" rx="6" ry="8" fill="#060806"/><path d="M28 52l8-10 4 4-6 12zM72 52l-8-10-4 4 6 12z"/></svg>',
  "duendes-hopkinsville":
    '<svg viewBox="0 0 100 100"><path d="M22 18c8-2 14 2 16 8 4-2 8-3 12-3s8 1 12 3c2-6 8-10 16-8-2 8-6 12-11 14 4 4 7 10 7 16 0 14-11 22-24 22S26 62 26 48c0-6 3-12 7-16-5-2-9-6-11-14z"/><circle cx="41" cy="46" r="5" fill="#060806"/><circle cx="59" cy="46" r="5" fill="#060806"/><path d="M38 72l-6 20h8l4-16zM62 72l6 20h-8l-4-16z"/></svg>',
};

async function iniciarBestiario() {
  const casos = await cargarCasos();
  const resp = await fetch("data/bestiario.json");
  const datos = await resp.json();
  const cont = document.getElementById("bestiario");
  cont.innerHTML = datos.entidades
    .map((e) => {
      const asociados = (e.casosAsociados || [])
        .map((id) => casos.find((c) => c.id === id))
        .filter(Boolean)
        .map((c) => `<a href="expediente.html?id=${encodeURIComponent(c.id)}">${esc(c.titulo)}</a>`)
        .join("");
      return `
      <div class="carta-entidad">
        <span class="presencia">Presencia: ${esc(e.presenciaEnReportes)}</span>
        <div class="silueta">${SILUETAS[e.id] || ""}</div>
        <h3>${esc(e.nombre)}</h3>
        <div class="alias">${esc(e.alias)}</div>
        <div class="campo"><b>Primer registro</b>${esc(e.primerRegistro)}</div>
        <div class="campo"><b>Apariencia reportada</b>${esc(e.apariencia)}</div>
        <div class="campo"><b>Comportamiento en los relatos</b>${esc(e.comportamiento)}</div>
        <div class="campo"><b>Origen cultural</b>${esc(e.origenCultural)}</div>
        <div class="campo solo-creyente version version-creyente"><b class="quien">La lectura del creyente</b>${esc(e.creyente)}</div>
        <div class="campo solo-esceptico version version-esceptico"><b class="quien">La lectura del escéptico</b>${esc(e.esceptico)}</div>
        ${asociados ? `<div class="campo"><b>Casos en el archivo</b><span class="casos-asociados">${asociados}</span></div>` : ""}
      </div>`;
    })
    .join("");
}

/* ---------- Cronología ---------- */
async function iniciarCronologia() {
  const casos = await cargarCasos();
  const resp = await fetch("data/cronologia.json");
  const datos = await resp.json();
  const cont = document.getElementById("cronologia");

  let html = "";
  let decadaActual = null;
  for (const ev of datos.eventos) {
    const decada = Math.floor(ev.anio / 10) * 10;
    if (decada !== decadaActual) {
      decadaActual = decada;
      html += `<div class="marcador-decada"><span>${decada}s</span></div>`;
    }
    const caso = ev.casoId ? casos.find((c) => c.id === ev.casoId) : null;
    html += `
      <div class="hito hito-${ev.carril}">
        <span class="anio-hito">${esc(ev.fechaTexto)}</span>
        <h3>${esc(ev.titulo)}</h3>
        <p>${esc(ev.texto)}</p>
        ${caso ? `<a class="enlace-caso" href="expediente.html?id=${encodeURIComponent(caso.id)}">▸ Abrir expediente</a>` : ""}
        ${ev.url ? `<a class="enlace-caso" href="${esc(ev.url)}" target="_blank" rel="noopener">▸ Ver documento oficial</a>` : ""}
      </div>`;
  }
  cont.innerHTML = html;
}

/* ---------- Archivo español (80 expedientes) ---------- */
async function iniciarArchivoEspanol() {
  const casos = await cargarCasos();
  const resp = await fetch("data/archivo-espanol.json");
  const datos = await resp.json();

  // idValor de los expedientes que ya tienen ficha completa en la web
  const conFicha = {};
  for (const c of casos) {
    for (const d of c.documentos || []) {
      const m = d.url.match(/idValor=(\d+)/);
      if (m) conFicha[m[1]] = c.id;
    }
  }

  const porAnio = new Map();
  for (const e of datos.expedientes) {
    if (!porAnio.has(e.anio)) porAnio.set(e.anio, []);
    porAnio.get(e.anio).push(e);
  }

  let html = "";
  for (const [anio, exps] of [...porAnio.entries()].sort((a, b) => a[0] - b[0])) {
    const filas = exps
      .map((e) => {
        const fichaId = conFicha[e.idValor];
        return `
        <div class="exp-linea">
          <span>${esc(e.titulo)}${fichaId ? ` <a href="expediente.html?id=${encodeURIComponent(fichaId)}" style="color:var(--ambar)">[ficha completa ★]</a>` : ""}</span>
          <a class="ver-exp" href="${esc(e.url)}" target="_blank" rel="noopener">VER EXPEDIENTE ▸</a>
        </div>`;
      })
      .join("");
    html += `
      <details class="grupo-anio" ${exps.length >= 7 ? "" : ""}>
        <summary>${anio} <span class="n-exp">${exps.length} expediente${exps.length > 1 ? "s" : ""}</span></summary>
        <div class="expedientes-anio">${filas}</div>
      </details>`;
  }
  document.getElementById("archivo-espanol").innerHTML = html;

  document.getElementById("archivo-docs").innerHTML = datos.documentacion
    .map(
      (d) => `
      <div class="exp-linea" style="border:1px solid var(--linea);margin-bottom:8px">
        <span>${esc(d.titulo)}</span>
        <a class="ver-exp" href="${esc(d.url)}" target="_blank" rel="noopener">VER ▸</a>
      </div>`
    )
    .join("");
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

  // Listado con filtros + buscador
  const contLista = document.getElementById("lista-casos");
  const buscador = document.getElementById("buscador");
  const orden = [...casos].sort((a, b) => a.fecha.localeCompare(b.fecha));
  let filtroActual = "todos";

  const pintar = () => {
    let visibles = orden;
    if (filtroActual === "espana") visibles = visibles.filter((c) => c.pais === "España");
    if (filtroActual === "internacional") visibles = visibles.filter((c) => c.pais !== "España");
    if (filtroActual === "sin_explicar") visibles = visibles.filter((c) => c.estado === "sin_explicar");
    if (filtroActual === "disputado") visibles = visibles.filter((c) => c.estado === "disputado");
    const q = (buscador?.value || "").trim().toLowerCase();
    if (q) {
      visibles = visibles.filter((c) =>
        [c.titulo, c.lugar, c.pais, c.resumen, c.gancho, c.fechaTexto, ...(c.tipo || [])]
          .join(" ")
          .toLowerCase()
          .includes(q)
      );
    }
    contLista.innerHTML =
      visibles.map(tarjetaCaso).join("") ||
      '<p class="sin-resultados">Ningún expediente coincide. O eso quieren que creas — prueba otros términos.</p>';
  };

  pintar();
  document.querySelectorAll(".filtros button").forEach((btn) => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".filtros button").forEach((b) => b.classList.remove("activo"));
      btn.classList.add("activo");
      filtroActual = btn.dataset.filtro;
      pintar();
    });
  });
  buscador?.addEventListener("input", pintar);
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

  marcarTerminos(document.getElementById("expediente"));
}

/* ---------- Glosario ---------- */
let _glosario = null;
async function cargarGlosario() {
  if (_glosario) return _glosario;
  const resp = await fetch("data/glosario.json");
  _glosario = (await resp.json()).terminos;
  return _glosario;
}

async function iniciarGlosario() {
  const terminos = await cargarGlosario();
  document.getElementById("glosario").innerHTML = terminos
    .map((t) => `<div class="entrada-glosario"><b>${esc(t.termino)}</b> — ${esc(t.definicion)}</div>`)
    .join("");
}

/* Subraya términos del glosario (primera aparición por bloque) en la ficha */
async function marcarTerminos(contenedor) {
  const terminos = await cargarGlosario();
  contenedor.querySelectorAll(".bloque p, .version p").forEach((p) => {
    let html = p.innerHTML;
    for (const t of terminos) {
      const re = new RegExp(`\\b(${t.termino.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})\\b`, "i");
      if (re.test(html)) {
        const def = t.definicion.replace(/"/g, "&quot;");
        html = html.replace(re, `<span class="termino" data-def="${def}">$1</span>`);
      }
    }
    p.innerHTML = html;
  });
}

/* ---------- Mapa ---------- */
async function iniciarMapa() {
  const casos = await cargarCasos();
  const mapa = L.map("mapa", { worldCopyJump: true }).setView([38, -20], 3);
  L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
    attribution: '&copy; OpenStreetMap &copy; CARTO',
    subdomains: "abcd",
    maxZoom: 12,
  }).addTo(mapa);

  for (const c of casos) {
    if (!c.coordenadas) continue;
    const rojo = c.estado === "sin_explicar";
    const icono = L.divIcon({
      className: "marcador-ovni" + (rojo ? " rojo" : ""),
      iconSize: rojo ? [16, 16] : [12, 12],
    });
    L.marker(c.coordenadas, { icon: icono })
      .addTo(mapa)
      .bindPopup(
        `<b style="text-transform:uppercase;letter-spacing:1px">${esc(c.titulo)}</b><br>
         <span style="font-size:11px">${esc(c.lugar)} · ${esc(c.fechaTexto)}</span><br>
         <span style="font-size:10px;letter-spacing:1px;color:${rojo ? "#ff3b30" : "#e8b23a"}">${ESTADOS[c.estado]}</span><br>
         <a href="expediente.html?id=${encodeURIComponent(c.id)}">▸ Abrir expediente</a>`
      );
  }
}

/* ---------- Formulario de reporte ---------- */
function iniciarReportar() {
  const form = document.getElementById("formulario-reporte");
  if (!form) return;
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const descartes = form.querySelectorAll('.lista-descartes input:checked').length;
    const reporte = {
      fecha: document.getElementById("campo-fecha").value,
      lugar: document.getElementById("campo-lugar").value,
      duracion: document.getElementById("campo-duracion").value,
      descripcion: document.getElementById("campo-descripcion").value,
      descartes,
      registrado: new Date().toISOString(),
    };
    const guardados = JSON.parse(localStorage.getItem("reportes") || "[]");
    guardados.push(reporte);
    localStorage.setItem("reportes", JSON.stringify(guardados));

    const ref = "UMBRA-" + String(Date.now()).slice(-6);
    const valoracion =
      descartes >= 4
        ? "Valoración preliminar: TESTIGO METÓDICO. Un reporte con este nivel de descartes es exactamente lo que un investigador quiere leer."
        : descartes >= 2
        ? "Valoración preliminar: ACEPTABLE. La próxima vez, dedica dos minutos a Flightradar y a comprobar Venus: eliminan la mitad de los sustos."
        : "Valoración preliminar: SIN FILTRAR. Casi seguro que era un avión, Venus o Starlink. Pero guardamos el registro — por si acaso.";

    form.style.display = "none";
    const resp = document.getElementById("respuesta-reporte");
    resp.style.display = "block";
    resp.innerHTML = `
      <p class="ref-reporte">■ TRANSMISIÓN COMPLETADA — REFERENCIA ${ref}</p>
      <p>Su reporte ha sido registrado en el archivo local (${esc(reporte.lugar)}, ${esc(reporte.fecha)}).</p>
      <p>${valoracion}</p>
      <p style="color:var(--tinta-tenue);font-size:12px">No hable de esto con nadie. O mejor sí: la ciencia avanza compartiendo datos.</p>`;
    resp.scrollIntoView({ behavior: "smooth" });
  });
}

/* ---------- Código Konami: el expediente prohibido ---------- */
function iniciarKonami() {
  const secuencia = ["ArrowUp","ArrowUp","ArrowDown","ArrowDown","ArrowLeft","ArrowRight","ArrowLeft","ArrowRight","b","a"];
  let pos = 0;
  document.addEventListener("keydown", (e) => {
    pos = e.key === secuencia[pos] ? pos + 1 : e.key === secuencia[0] ? 1 : 0;
    if (pos === secuencia.length) {
      pos = 0;
      mostrarExpedienteProhibido();
    }
  });

  // Versión táctil: la misma secuencia direccional con swipes (sin B-A).
  const gestos = ["arriba","arriba","abajo","abajo","izquierda","derecha","izquierda","derecha"];
  let posTactil = 0;
  let inicioToque = null;
  let ultimoPunto = null;

  const evaluarGesto = () => {
    if (!inicioToque || !ultimoPunto) { inicioToque = null; return; }
    const dx = ultimoPunto.x - inicioToque.x;
    const dy = ultimoPunto.y - inicioToque.y;
    const rapido = Date.now() - inicioToque.t < 1000;
    inicioToque = null;
    if (!rapido || (Math.abs(dx) < 30 && Math.abs(dy) < 30)) return;
    const gesto = Math.abs(dx) > Math.abs(dy)
      ? (dx > 0 ? "derecha" : "izquierda")
      : (dy > 0 ? "abajo" : "arriba");
    posTactil = gesto === gestos[posTactil] ? posTactil + 1 : gesto === gestos[0] ? 1 : 0;
    if (posTactil === gestos.length) {
      posTactil = 0;
      mostrarExpedienteProhibido();
    }
  };

  document.addEventListener("touchstart", (e) => {
    inicioToque = { x: e.touches[0].clientX, y: e.touches[0].clientY, t: Date.now() };
    ultimoPunto = { x: inicioToque.x, y: inicioToque.y };
  }, { passive: true });
  // Seguimos el dedo durante el gesto: así el swipe cuenta aunque el
  // navegador se quede el evento final (pull-to-refresh, gestos de borde).
  document.addEventListener("touchmove", (e) => {
    if (inicioToque) ultimoPunto = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  }, { passive: true });
  document.addEventListener("touchend", (e) => {
    if (inicioToque && e.changedTouches.length) {
      ultimoPunto = { x: e.changedTouches[0].clientX, y: e.changedTouches[0].clientY };
    }
    evaluarGesto();
  }, { passive: true });
  // touchcancel: el navegador ha interceptado el gesto (p. ej. pull-to-refresh);
  // evaluamos con la última posición conocida en vez de descartar el swipe.
  document.addEventListener("touchcancel", evaluarGesto, { passive: true });

  function mostrarExpedienteProhibido() {
    if (document.getElementById("expediente-prohibido")) return;
    const div = document.createElement("div");
    div.id = "expediente-prohibido";
    div.innerHTML = `
      <div class="documento-prohibido">
        <span class="sello">Nivel Ω — No distribuir</span>
        <h2 style="margin:14px 0;letter-spacing:3px">EXPEDIENTE UMBRA-0</h2>
        <p>ASUNTO: El visitante que encontró esta página.</p>
        <p>El sujeto ha introducido una secuencia de acceso que solo conocen
        <span class="censurado">los que crecieron con una consola</span>. Perfil: curiosidad
        por encima de la media, tendencia a <span class="censurado">leer hasta el final</span>
        y resistencia notable a aceptar la primera explicación.</p>
        <p>RECOMENDACIÓN: exactamente el tipo de persona que este archivo necesita.
        Que revise los documentos originales. Que dude de nosotros también.
        Que <span class="censurado">comparta la página</span>.</p>
        <p style="color:var(--tinta-tenue);font-size:11px">No hay más secretos aquí. Los de verdad están en los enlaces de la Sala de Archivos.</p>
        <span class="cerrar-prohibido">Cerrar y no decir nada</span>
      </div>`;
    document.body.appendChild(div);
    div.querySelector(".cerrar-prohibido").addEventListener("click", () => div.remove());
  }
}

/* ---------- Arranque ---------- */
document.addEventListener("DOMContentLoaded", () => {
  iniciarModo();
  iniciarIntro();
  iniciarNav();
  const pagina = document.body.dataset.pagina;
  if (pagina === "portada") iniciarPortada();
  if (pagina === "expediente") iniciarExpediente();
  if (pagina === "bestiario") iniciarBestiario();
  if (pagina === "cronologia") iniciarCronologia();
  if (pagina === "archivo-espanol") iniciarArchivoEspanol();
  if (pagina === "glosario") iniciarGlosario();
  if (pagina === "mapa") iniciarMapa();
  if (pagina === "reportar") iniciarReportar();
  iniciarKonami();
});
