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
index.html          Portada: expediente del día, ruta "Empieza aquí", listado con filtros
expediente.html     Ficha de caso (lee ?id= y renderiza desde el JSON)
archivos.html       Sala de archivos: enlaces verificados a las fuentes oficiales
data/casos.json     Todos los casos (el esquema está documentado dentro del propio JSON)
assets/style.css    Estética dossier/X-Files
assets/app.js       Lógica: carga de datos, toggle de modo, render, intro de terminal
```

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

## Publicar en GitHub Pages

1. Fusiona esta rama en `main`.
2. En GitHub: **Settings → Pages → Source: Deploy from a branch → `main` / `(root)`**.
3. La web quedará en `https://<usuario>.github.io/<repo>/`.

## Fuentes y verificación

Los enlaces a archivos oficiales fueron verificados el **05-07-2026**. Los documentos del
gobierno federal de EE.UU. son de dominio público; para el resto de archivos, esta web
**enlaza** a los documentos en sus sedes oficiales (no los reproduce).
