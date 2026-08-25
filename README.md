# Sitio web Bujutsu

Sitio **estático estándar** hecho con HTML5 + CSS + JavaScript puro (sin frameworks ni proceso de build). Se puede abrir y editar en cualquier herramienta (VS Code, Sublime, Dreamweaver, etc.) y publicar en cualquier hosting.

---

## Estructura de archivos

```
bujutsu-site/
├── index.html          ← toda la página (contenido/textos aquí)
├── css/
│   └── styles.css      ← todos los estilos (colores, tipografía, layout)
├── js/
│   └── main.js         ← menú móvil y horarios filtrables
├── assets/
│   └── img/            ← imágenes (logos reales + placeholders a reemplazar)
├── robots.txt          ← para buscadores
└── README.md           ← este archivo
```

---

## Cómo verlo en tu computadora

Solo abre `index.html` en el navegador (doble clic). Para que todo funcione igual que en producción (rutas, etc.), lo ideal es levantar un servidor local simple:

```bash
# con Python (ya viene en Mac/Linux)
python3 -m http.server 8000
# luego abre http://localhost:8000
```

O usa la extensión **Live Server** de VS Code.

---

## Qué reemplazar antes de producción (checklist)

Busca la palabra `TODO` en los archivos; ahí están los puntos a completar.

- [x] **WhatsApp** — ya configurado con el número real (`wa.me/525648222022`) y mensaje pre-cargado, en los 5 enlaces y el botón flotante.
- [x] **Formulario** — ya conectado a Formspree (`https://formspree.io/f/xdenraaq`) con envío AJAX (el visitante no sale de la página y ve el mensaje de éxito). Los envíos llegan a tu panel de Formspree y a tu correo.
- [x] **Mapa** — ya integrado el mapa real de Bujutsu Central (Google Maps embed).
- [x] **Dirección, teléfono, correo** — datos reales integrados (Topógrafos 7, Escandón; +52 56 4822 2022; admin@bujutsubjj.com).
- [x] **Precios** — tabla real integrada (1/2 disciplinas, promos, infantil, visitas).
- [ ] **Horarios** — actualiza el objeto `CLASSES` en `js/main.js` con el horario real (el tablero de horarios no venía completo).
- [ ] **Maestros** — nombres, roles y credenciales en la sección "Nuestros maestros". Hoy usan iniciales; para poner fotos, mira la nota abajo.
- [ ] **Imágenes** — reemplaza los archivos placeholder en `assets/img/` por fotos reales (mismo nombre de archivo = no tocas el HTML). Ver lista abajo.
- [ ] **Instagram** — la galería enlaza a `@bujutsutv`. Para mostrar el feed real y en vivo, ver "Feed de Instagram" abajo.
- [ ] **Dominio** — en `index.html` (etiquetas `og:url` y el bloque de datos estructurados `application/ld+json`) y en `robots.txt`, cambia `https://www.bujutsubjj.com/` por tu dominio final.

---

## Imágenes (carpeta `assets/img/`)

Los `logo-b*.png` son tus **logos reales**. El resto son **placeholders** on-brand (fondo oscuro con etiqueta) listos para sustituir por fotos reales, respetando el nombre:

| Archivo | Uso | Medida sugerida |
|---|---|---|
| `logo-b.png` | Logo B rojo (header, footer, favicon) | — (real) |
| `logo-b-negro.png` / `logo-b-blanco.png` | Variantes del logo | — (real) |
| `hero.jpg` | Portada (fondo del hero) | 1600×900 |
| `disc-bjj / muaythai / mma / nogi / judo / wrestling / boxeo.jpg` | Tarjetas de disciplinas | 700×500 |
| `kids.jpg` | Programa infantil | 700×700 |
| `gallery-1..8.jpg` | Galería / Instagram | 600×600 (cuadradas) |

**Fotos de maestros:** hoy se muestran con iniciales. Para usar foto, en cada tarjeta de maestro cambia
`<div class="ph gold" data-init="AS"></div>` por
`<div class="ph"><img src="assets/img/maestro-alan.jpg" alt="Alan S."></div>`
y agrega en `css/styles.css`: `.coach .ph img{width:100%;height:100%;object-fit:cover;}`

---

## Feed de Instagram en vivo (opcional)

La galería actual son imágenes que enlazan a `@bujutsutv`. Para que **jale las publicaciones reales automáticamente**, usa un widget gratuito (no requiere programar):

1. Crea el widget en [LightWidget](https://lightwidget.com) o [Behold.so](https://behold.so) conectando `@bujutsutv`.
2. Copia el `<script>`/`<iframe>` que te dan.
3. Pégalo dentro de la sección `#galeria` reemplazando la grilla `.gallery`.

---

## Tipografías

Fuentes de marca **autohospedadas** en `assets/fonts/` (formato woff2, no dependen de internet):

- **Monument Extended** → wordmark "Bujutsu" (header y footer).
- **Neutro ExtraBold** → títulos display. *(Neutro Outline incluida por si quieres el efecto contorno.)*
- **PT Sans** → texto (regular, bold, itálica).

Están declaradas con `@font-face` al inicio de `css/styles.css` y asignadas con las variables `--display`, `--wordmark` y la fuente base del `body`. Para cambiar una fuente, reemplaza el archivo en `assets/fonts/` o edita el `@font-face`.

## Galería de fotos (galeria.html)

Página aparte con **filtros por tags** y **lightbox** (clic para ampliar). Se llega desde el menú "Galería".

- **Agregar/quitar fotos:** edita la lista `PHOTOS` al inicio de `js/galeria.js`. Cada foto es una línea con `src`, `tags` y `alt`. Los botones de filtro se generan solos a partir de los tags.
- **Fotos:** están en `assets/img/gallery/` (ejemplos por categoría). Reemplázalas por las reales con el mismo nombre, o agrega nuevas y apúntalas en `PHOTOS`.
- **Google Drive:** puedes usar un link de Drive como `src`, pero **no es lo recomendado** (Google limita el hotlinking y puede fallar). Si aun así lo usas, el formato debe ser `https://lh3.googleusercontent.com/d/ID=w1200` (ID = lo que va entre `/d/` y `/view` en el enlace de Compartir; el archivo debe estar como "Cualquiera con el enlace"). Lo ideal para producción es tener las fotos dentro de `assets/img/gallery/`.

## Muchas fotos: generarlas automáticamente (Mac)

Si tienes muchas fotos, usa el script `generar-galeria.command` (renombra, optimiza y crea el archivo de datos solo):

1. Junto al script crea una carpeta `fotos-galeria/`.
2. Dentro, una **subcarpeta por categoría** (el nombre de la carpeta = el tag):
   `fotos-galeria/BJJ/`, `fotos-galeria/Muay Thai/`, `fotos-galeria/MMA/`, `fotos-galeria/Ninos/`, `fotos-galeria/Eventos/` …
3. Mete las fotos (jpg, png o **heic** de iPhone) en cada subcarpeta.
4. Doble clic en `generar-galeria.command` (la 1ª vez: clic derecho → **Abrir**).

El script convierte todo a JPG, reduce a 1600 px de ancho, las copia a `assets/img/gallery/` con nombres limpios (`bjj-1.jpg`, `muay-thai-1.jpg`…) y **regenera `js/gallery-data.js`** con sus tags. Después solo sube los cambios (Netlify o `git push`). *(La lista `PHOTOS` vive en `js/gallery-data.js`; la lógica en `js/galeria.js`.)*

## Publicar (deploy)

Es un sitio estático, así que va en cualquier lado. Opciones estándar:

- **Netlify** (lo más fácil): entra a [app.netlify.com/drop](https://app.netlify.com/drop) y arrastra la carpeta `bujutsu-site`. Listo, queda en línea. Luego conectas tu dominio.
- **Vercel**: importa el proyecto o arrastra la carpeta.
- **GitHub Pages**: sube la carpeta a un repo y actívalo en Settings → Pages.
- **Hosting tradicional (cPanel/FTP)**: sube el contenido de `bujutsu-site/` a la carpeta `public_html/` (o `www/`).

En todos los casos, el archivo de inicio es `index.html` en la raíz.

---

## Notas

- No hay dependencias ni `node_modules`: es HTML/CSS/JS plano.
- Colores de marca: rojo `#E11D2A`, negro `#0d0d0d` (definidos como variables al inicio de `styles.css`).
- El sitio es responsivo (escritorio, tablet y móvil).
