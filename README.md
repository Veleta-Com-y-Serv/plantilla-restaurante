# Plantilla NoExpertise · Restaurante y bar

Web elegante para restaurantes y bares, con carta, reservas, fotos y horario a la vista.

- Sectores: restaurante, bar, cafeteria, hosteleria. Estilo: elegante. Plan mínimo: gratis.
- Secciones: hero, carta, sobre, galeria, reservas, horario-ubicacion, opiniones, preguntas, contacto (y `texto` para apartados nuevos).
- Diseño: portada a pantalla completa con la cabecera transparente encima (pasa a sólida al bajar), títulos en serif del sistema, burdeos + crema + dorado, carta a dos columnas con línea de puntos, galería en mosaico de columnas, banda oscura de reservas y pie oscuro con horario y dirección en grande.
- SEO de base incluido (`src/lib/seo.ts`): canónica, og:image, JSON-LD del negocio y de las preguntas frecuentes, `robots.txt`, `sitemap.xml` y `llms.txt`; `noindex` si `seo.indexable: false`.
- Contenido editable en `site.yaml`; metadatos en `template.yaml`; reglas para el agente en `CLAUDE.md`; fotos a generar en `fotos.json`.

```
npm ci
npm run dev      # desarrollo
npm run build    # web estática en dist/
```

Basada en [AstroWind](https://github.com/onwidget/astrowind) © onWidget, licencia MIT (`LICENSE-ASTROWIND.md`). Imágenes de relleno (`public/placeholders/`) dibujadas para esta plantilla, sin licencias de terceros.
