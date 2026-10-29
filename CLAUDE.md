# Plantilla «Restaurante y bar» (NoExpertise)

Web estática Astro 5 + Tailwind 4, derivada de AstroWind (MIT, ver `LICENSE-ASTROWIND.md`). Estilo: **elegante**.
Todo en castellano de España, frases cortas, sin jerga.

## Dónde está cada cosa
- **Textos, contacto, menú, SEO y secciones**: `site.yaml` (raíz). Es la única fuente de contenido. `src/data/site.ts` lo carga y lo tipa; no pongas textos fijos en los componentes.
- **Colores**: `site.yaml → colores` (primario = burdeos, acento = dorado, fondo = crema, texto). `src/layouts/Base.astro` los convierte en variables CSS (`--c-primario`…) y Tailwind los expone como `bg-primario`, `text-acento`, `bg-primario/10`… Los tonos derivados (`--oscuro` del pie y de reservas, `--acento-legible`, `--filete`) se calculan con `color-mix` en `src/styles/global.css`.
- **Tipografías y aspecto general**: `src/styles/global.css` (serif del sistema para títulos, sans para texto, botones rectangulares `.btn`/`.btn-sec`, cabecera `.cabecera--velada`, pie `.pie--velada`). Fuentes del sistema: no añadas fuentes externas.
- **Imágenes**: en `public/`. Fotos en `public/fotos/` (se generan a partir de `fotos.json`); si una foto de `/fotos/` falta, `Imagen.astro` muestra `/placeholders/<mismo nombre>.svg`. En `site.yaml` se referencian con ruta absoluta (`/fotos/hero.jpg`). Personas: siempre `/placeholders/persona.svg`, nunca caras generadas.
- **Logo**: `site.yaml → logo` (ruta en `public/`); vacío = nombre en texto.
- **Pie «Web creada con NoExpertise»**: `site.yaml → marca_pie` (true en plan gratis). El pie muestra en grande `contacto.horario` y `contacto.direccion`.

## Secciones
Cada sección es un componente que solo se pinta si `site.yaml → secciones.<id>.activa` es `true`. Se pintan en el orden en que aparecen en `site.yaml`.
- `hero` → `src/components/secciones/hero.astro` (portada a pantalla completa; la cabecera es transparente encima)
- `carta` → `src/components/secciones/carta.astro`
- `sobre` → `src/components/secciones/sobre.astro`
- `galeria` → `src/components/secciones/galeria.astro`
- `reservas` → `src/components/secciones/reservas.astro`
- `horario-ubicacion` → `src/components/secciones/horario-ubicacion.astro`
- `opiniones` → `src/components/secciones/opiniones.astro`
- `preguntas` → `src/components/secciones/preguntas.astro` (preguntas frecuentes en acordeón `details/summary`; sin preguntas no se pinta)
- `contacto` → `src/components/secciones/contacto.astro`
- `texto` → `src/components/secciones/texto.astro` (apartado genérico para `tipo: texto`)

## Campos propios de esta plantilla (además del esquema común)
- `hero`: `cta` y `cta_secundario` (sin `cta` el botón llama; sin `cta_secundario` lleva al mapa); `items` = detalles cortos (solo `titulo`) en una línea bajo los botones.
- `carta.platos` [{nombre, texto, precio, categoria, destacado}]: se agrupan por `categoria` en el orden en que aparecen. `precio` SIEMPRE como cadena entre comillas (`"12,50 €"`); vacío = no se pinta precio ni línea de puntos. `destacado: true` pone la marca «De la casa» (texto en `carta.marca_destacado`).
- `carta.menu_dia` {titulo, precio, texto}: bloque aparte; `texto` con una línea por plato o detalle (`|` en YAML). Sin `titulo` ni `texto`, no aparece. `carta.imagen`: foto junto al menú del día (opcional).
- `sobre`: `texto` largo (párrafos separados por una línea en blanco), `imagen` vertical, `declaracion` (frase corta en cursiva) e `items` (valores: `titulo` + `texto`).
- `reservas`: `texto`, `items` (pasos), `cta` (normalmente WhatsApp; sin él, el botón llama), `nota` (p. ej. grupos). Formulario con día, hora y personas por `mailto`.
- `horario-ubicacion`: `horario` [{dia, horas}] (sin él, se usa `contacto.horario`) e `imagen` (fachada o plano, enlazada al mapa).
- `opiniones.testimonios` [{texto, autor, nota}]: `nota` opcional (de dónde viene, p. ej. «Google»). Sin opiniones, la sección no se pinta. No hay estrellas ni notas numéricas.

## Reglas para órdenes
1. **Activar o quitar una sección**: cambia `activa: true|false` en `site.yaml`. No borres componentes.
2. **Reordenar secciones**: mueve el bloque dentro de `secciones:` en `site.yaml`. Si `hero` deja de ser la primera, la cabecera pasa a ser sólida sola.
3. **Cambiar textos, platos, precios, horarios, fotos**: solo en `site.yaml`. Si un texto contiene comas o dos puntos dentro de `{ … }`, ponlo entre comillas. Precios siempre entre comillas.
4. **Listas planas**: nunca una lista dentro de un elemento de lista. Para agrupar platos usa `categoria`; para varios datos, una cadena. Máximo 24 elementos por lista.
5. **Nunca inventes** precios, cifras ni opiniones: si el cliente no los da, déjalos vacíos (los componentes lo soportan).
6. **Página nueva**: crea `src/pages/<slug>.astro` con `import Base from '../layouts/Base.astro'` y `<Base titulo="…" descripcion="…">…</Base>`; enlázala en `site.yaml → menu`. Ejemplo: `src/pages/aviso-legal.astro`.
7. **Apartado nuevo**: añade `secciones.<id>` en `site.yaml` con `tipo:` = `texto`, `carta`, `galeria`, `opiniones`… (el diseño que quiera reutilizar). `src/pages/index.astro` lo recoge solo; no lo toques.
8. **No tocar** `src/pages/index.astro`, `src/layouts/Base.astro`, `tailwind.config.mjs` ni `src/styles/comun.css` salvo orden explícita de diseño. Tampoco `src/lib/seo.ts` ni `src/pages/robots.txt.ts`, `sitemap.xml.ts` y `llms.txt.ts`: son el SEO de base (canónica, og:image, `noindex` si `seo.indexable: false`, JSON-LD del negocio y de las preguntas, robots, sitemap y llms.txt), salen solos de `site.yaml` y el fichero es el mismo en las 16 plantillas. `seo.url` y `seo.indexable` los pone la plataforma: no los cambies.
9. Mantén: `lang="es-ES"`, imágenes con `Imagen.astro` (carga diferida), sin JavaScript nuevo salvo necesidad real (solo hay el de la cabecera), 16 px de margen lateral (`.contenedor`), sin scroll horizontal en móvil. Imágenes de contenido con `alt` sacado del contenido (`altHero`, `altFicha`, `altGaleria`, `altSeccion` de `src/lib/seo.ts`, o el `titulo`/`nombre` de la ficha); las decorativas, `alt=""` (Imagen.astro les pone `aria-hidden`).
10. El formulario no tiene servidor: abre el correo (`mailto`) con el email de `site.yaml`. Para envío real, cambia `action` en `src/components/ui/FormularioContacto.astro`.

## Construir
```
npm ci && npm run build      # resultado en dist/
npx astro preview            # ver dist/ en http://localhost:4321
```
Antes de dar una orden por buena: `npm run build` sin errores.
