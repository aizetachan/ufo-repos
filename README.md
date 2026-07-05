# 🛸 EXPEDIENTE UMBRA

```
┌─────────────────────────────────────────────────┐
│  ARCHIVO DESCLASIFICADO                         │
│  LA VERDAD ESTÁ EN LOS DOCUMENTOS               │
│                                    ┌──────────┐ │
│  NIVEL DE ACCESO: NO AUTORIZADO    │DESCLASIF.│ │
│  (pase de todos modos)             └──────────┘ │
└─────────────────────────────────────────────────┘
```

**→ La web: https://aizetachan.github.io/ufo-repos/**

## Qué es esto

Una plataforma de divulgación sobre el fenómeno OVNI/UAP con estética de dossier
clasificado y una regla que no se rompe: **cada dato es real y cada afirmación
enlaza a su documento original**. Expedientes militares desclasificados, informes
del Pentágono, transcripciones del Congreso — no nos creas a nosotros: cree a los
documentos.

## Qué contiene

- **18 casos con ficha completa** — de Roswell al Tic-Tac de la Navy, con especial
  atención a los casos españoles (Manises, Canarias, Talavera...): qué ocurrió,
  quién lo vio, y el enlace al expediente oficial escaneado.
- **El interruptor Creyente/Escéptico** — cada caso tiene sus dos lecturas
  documentadas. Tú eliges bando. O mejor: lee los dos.
- **El archivo español completo** — los 80 expedientes desclasificados del
  Ejército del Aire (1962-1995), navegables por año, cada uno enlazado a su PDF
  en la Biblioteca Virtual del Ministerio de Defensa.
- **Dossier de la gran ola de 1968-69** — los 25 expedientes de los dos años más
  intensos del archivo.
- **Cronología 1947→hoy** en doble carril (casos + historia política y cultural),
  con los documentos oficiales enlazados hito a hito.
- **Bestiario** — de dónde sale cada arquetipo (los Grises nacen en 1961, y
  tenemos el caso). Genealogía cultural, no zoología.
- **Sala de Archivos** — enlaces verificados a los archivos OVNI oficiales de
  8 países: España, EE.UU., Reino Unido, Francia, Brasil, Canadá, Australia y Chile.
- **Mapa, glosario, buscador y canal de reportes** con control de descartes
  (¿ya comprobaste que no era Starlink?).
- Un código secreto. Los que crecieron con una consola sabrán encontrarlo.

## Cómo está hecho

HTML, CSS y JavaScript puros. Sin frameworks, sin build, sin cookies, sin registro.
Se abre y se lee.

```
index.html              Portada: expediente del día, ruta "Empieza aquí", buscador
expediente.html         Ficha de caso (renderiza desde el JSON, con glosario integrado)
cronologia.html         Línea de tiempo en doble carril
bestiario.html          Los arquetipos y su partida de nacimiento
ola68.html              Dossier de la gran ola española
mapa.html               Sala de situación (Leaflet autoalojado)
archivo-espanol.html    Los 80 expedientes por año
archivos.html           Sala de archivos: las fuentes oficiales verificadas
glosario.html           Los términos, sin jerga
reportar.html           Canal de reporte con control de descartes
metodologia.html        Cómo trabajamos y qué NO afirmamos
data/*.json             Todo el contenido, estructurado y versionado
assets/                 Estética dossier + lógica (app.js)
```

## Contribuir

Los datos viven en `data/*.json` con el esquema documentado dentro de cada
fichero. Para añadir un caso: copia la estructura de uno existente, incluye sus
dos lecturas (creyente y escéptica) y **verifica los enlaces a los documentos**.
¿Un error, un enlace roto, una fuente mejor? Abre un issue. Corregir rápido y en
público también es parte del método.

## Desarrollo y publicación

```bash
# desarrollo local (el fetch de los JSON necesita HTTP)
python3 -m http.server 8080

# publicar: push a main y el workflow de Pages hace el resto
```

---

*Días desde el último encubrimiento: 0*
