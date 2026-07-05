# EXPEDIENTE UMBRA 🛸

Web de divulgación sobre el fenómeno OVNI/UAP con estética de archivo desclasificado.
Cada caso enlaza a su **documentación oficial original** (expedientes desclasificados del
Ejército del Aire español, Project Blue Book, AARO, National Archives UK, GEIPAN...).

## Filosofía

- **Estética conspiranoica, contenido veraz**: el envoltorio es un dossier clasificado; los datos son reales y citables.
- **Modo Creyente / Escéptico**: cada caso tiene sus dos lecturas documentadas. El interruptor de la cabecera cambia entre ellas.
- **Sin registro, sin cookies de rastreo, sin build**: HTML/CSS/JS puro. Se abre y se lee.

## Estructura

```
index.html              Portada: expediente del día, ruta "Empieza aquí", buscador y listado con filtros
expediente.html         Ficha de caso (lee ?id= y renderiza desde el JSON, con tooltips de glosario)
cronologia.html         Línea de tiempo 1947→hoy en doble carril (casos / historia)
bestiario.html          Guía de arquetipos: qué reporta la gente y de dónde sale cada figura
mapa.html               Los casos sobre un mapa oscuro (Leaflet autoalojado en assets/vendor/)
archivo-espanol.html    Los 80 expedientes desclasificados navegables por año
archivos.html           Sala de archivos: enlaces verificados a las fuentes oficiales
glosario.html           Glosario del investigador
reportar.html           Formulario de reporte con control de descartes (guarda solo en local)
data/casos.json         Los casos con ficha completa (esquema documentado dentro del JSON)
data/archivo-espanol.json  Los 80 expedientes con enlace al documento original
data/cronologia.json    Hitos de la cronología
data/bestiario.json     Entidades del bestiario
data/glosario.json      Términos y definiciones
assets/style.css        Estética dossier/X-Files
assets/app.js           Toda la lógica (sin frameworks)
```

Extra: código Konami (↑↑↓↓←→←→BA) en cualquier página.

## Añadir un caso

Añade un objeto al array `casos` de `data/casos.json` siguiendo el esquema de cualquier
caso existente. Campos clave:

- `estado`: `explicado` | `disputado` | `sin_explicar`
- `creyente` / `esceptico`: las dos lecturas del caso
- `documentos`: enlaces al expediente/documento oficial (¡verifícalos!)
- `empiezaAqui`: número de orden si forma parte de la ruta para principiantes (o `null`)

## Desarrollo local

No hay dependencias. Sirve la carpeta con cualquier servidor estático:

```bash
python3 -m http.server 8080
# → http://localhost:8080
```

(Abrir `index.html` como fichero no funciona: el `fetch` del JSON necesita HTTP.)

## Despliegue: Firebase Hosting (automático con GitHub Actions)

El repo ya incluye `firebase.json`, `.firebaserc` y el workflow
`.github/workflows/firebase-deploy.yml`. Cada push a `main` despliega a
producción; cada pull request genera una URL de preview temporal.

Configuración inicial (una sola vez):

1. **Crear el proyecto**: entra en [console.firebase.google.com](https://console.firebase.google.com)
   → *Añadir proyecto* → nombre `expediente-umbra` (si Google te sugiere otro ID
   porque ese está cogido, apunta el ID final). No hace falta activar Analytics.
2. **Generar la credencial de despliegue**: en la consola del proyecto →
   ⚙️ *Configuración del proyecto* → *Cuentas de servicio* →
   *Generar nueva clave privada* (descarga un JSON).
3. **Añadir el secreto en GitHub**: en el repo → *Settings → Secrets and
   variables → Actions → New repository secret* → nombre
   `FIREBASE_SERVICE_ACCOUNT`, valor: el contenido íntegro del JSON descargado.
   (Borra el JSON de tu disco después.)

Si el ID final del proyecto no es `expediente-umbra`, actualiza ese valor en
`.firebaserc` y en los dos `projectId` del workflow.

La web quedará en `https://<project-id>.web.app`.

Alternativa manual: `npm i -g firebase-tools && firebase login && firebase deploy`.

## Fuentes y verificación

Los enlaces a archivos oficiales fueron verificados el **05-07-2026**. Los documentos del
gobierno federal de EE.UU. son de dominio público; para el resto de archivos, esta web
**enlaza** a los documentos en sus sedes oficiales (no los reproduce).
