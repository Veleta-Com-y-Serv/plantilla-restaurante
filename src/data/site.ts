// Carga ../../site.yaml en el build y lo expone tipado.
// Es la única fuente de contenido: textos, colores, contacto, menú y secciones.
import datos from '../../site.yaml';

export interface Enlace { texto: string; url: string }
export interface Item { titulo: string; texto?: string; icono?: string; imagen?: string }
export interface Persona { nombre: string; cargo?: string; foto?: string; texto?: string }
/** Opinión. `nota` es opcional (de dónde viene: «Google», «TripAdvisor»…). */
export interface Testimonio { texto: string; autor: string; nota?: string }
export interface Horario { dia: string; horas: string }
export interface Pregunta { pregunta: string; respuesta: string }
export interface Proyecto { titulo: string; texto?: string; imagen?: string; categoria?: string; anio?: string }
export interface Noticia { fecha: string; titulo: string; texto?: string; url?: string }
/** Plato de la carta. `categoria` agrupa (en el orden en que aparece); `precio` siempre como cadena («12,50 €»). */
export interface Plato { nombre: string; texto?: string; precio?: string; categoria?: string; destacado?: boolean }
/** Menú del día: bloque aparte dentro de la carta. */
export interface MenuDia { titulo: string; precio: string; texto: string }

export interface Seccion {
  activa: boolean;
  titulo?: string;
  antetitulo?: string;
  texto?: string;
  imagen?: string;
  cta?: Enlace;
  cta_secundario?: Enlace;
  items: Item[];
  personas: Persona[];
  testimonios: Testimonio[];
  galeria: string[];
  horario: Horario[];
  preguntas: Pregunta[];
  proyectos: Proyecto[];
  noticias: Noticia[];
  /** carta */
  platos: Plato[];
  menu_dia: MenuDia | null;
  marca_destacado?: string;
  /** sobre */
  declaracion?: string;
  /** reservas */
  nota?: string;
  [campo: string]: unknown;
}

export interface Site {
  nombre: string;
  eslogan: string;
  sector: string;
  logo: string;
  colores: { primario: string; acento: string; fondo: string; texto: string };
  contacto: { telefono: string; email: string; direccion: string; horario: string; whatsapp: string };
  redes: { instagram: string; facebook: string; linkedin: string };
  menu: Enlace[];
  seo: { titulo: string; descripcion: string; tipo: string };
  boton_cabecera: Enlace | null;
  marca_pie: boolean;
  secciones: Record<string, Seccion>;
}

type Crudo = Record<string, any>;
const d = (datos ?? {}) as Crudo;
function lista<T>(v: unknown): T[] {
  return Array.isArray(v) ? (v.filter(Boolean) as T[]) : [];
}
const texto = (v: unknown) => (v == null ? '' : String(v).trim());

function normalizar(s: Crudo = {}): Seccion {
  const m = (s.menu_dia ?? {}) as Crudo;
  return {
    ...s,
    activa: s.activa === true,
    items: lista<Item>(s.items),
    personas: lista<Persona>(s.personas),
    testimonios: lista<Testimonio>(s.testimonios),
    galeria: lista<string>(s.galeria),
    horario: lista<Horario>(s.horario),
    preguntas: lista<Pregunta>(s.preguntas),
    proyectos: lista<Proyecto>(s.proyectos),
    noticias: lista<Noticia>(s.noticias),
    platos: lista<Crudo>(s.platos)
      .filter((p) => texto(p.nombre))
      .map((p) => ({
        nombre: texto(p.nombre),
        texto: texto(p.texto),
        precio: texto(p.precio),
        categoria: texto(p.categoria),
        destacado: p.destacado === true,
      })),
    menu_dia: texto(m.titulo) || texto(m.texto) ? { titulo: texto(m.titulo), precio: texto(m.precio), texto: texto(m.texto) } : null,
  } as Seccion;
}

const secciones: Record<string, Seccion> = {};
for (const [id, s] of Object.entries((d.secciones ?? {}) as Crudo)) secciones[id] = normalizar((s ?? {}) as Crudo);

export const site: Site = {
  nombre: texto(d.nombre) || 'Mi restaurante',
  eslogan: texto(d.eslogan),
  sector: texto(d.sector),
  logo: texto(d.logo),
  colores: { primario: '#6e1f2c', acento: '#c9a35c', fondo: '#f7f1e6', texto: '#2b1d1a', ...(d.colores ?? {}) },
  contacto: { telefono: '', email: '', direccion: '', horario: '', whatsapp: '', ...(d.contacto ?? {}) },
  redes: { instagram: '', facebook: '', linkedin: '', ...(d.redes ?? {}) },
  menu: lista<Enlace>(d.menu),
  seo: {
    titulo: texto(d.seo?.titulo) || texto(d.nombre),
    descripcion: texto(d.seo?.descripcion) || texto(d.eslogan),
    tipo: texto(d.seo?.tipo) || 'Restaurant',
  },
  boton_cabecera: d.boton_cabecera?.url ? (d.boton_cabecera as Enlace) : null,
  marca_pie: d.marca_pie !== false,
  secciones,
};

/** Devuelve la sección si existe y tiene `activa: true`; si no, null. */
export function seccion(id: string): Seccion | null {
  const s = site.secciones[id];
  return s && s.activa ? s : null;
}

/** Ids de las secciones activas, en el orden en que aparecen en site.yaml. */
export function seccionesActivas(): string[] {
  return Object.keys(site.secciones).filter((id) => site.secciones[id].activa);
}

/** Agrupa una lista por un campo escalar (p. ej. `categoria`), respetando el orden en que aparece cada grupo. */
export function agrupar<T>(items: T[], campo: (x: T) => string | undefined): { grupo: string; items: T[] }[] {
  const grupos: { grupo: string; items: T[] }[] = [];
  for (const it of items) {
    const g = (campo(it) ?? '').trim();
    let destino = grupos.find((x) => x.grupo === g);
    if (!destino) grupos.push((destino = { grupo: g, items: [] }));
    destino.items.push(it);
  }
  return grupos;
}

export const tel = (n?: string) => (n ? 'tel:' + n.replace(/[^\d+]/g, '') : '');
export const whatsapp = (n?: string, mensaje = '') =>
  n ? `https://wa.me/${n.replace(/\D/g, '')}${mensaje ? '?text=' + encodeURIComponent(mensaje) : ''}` : '';
export const mapa = (direccion?: string) =>
  direccion ? 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(direccion) : '';
/** Párrafos a partir de un texto con líneas en blanco entre párrafos. */
export const parrafos = (t?: string) => (t ? t.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean) : []);
/** Líneas sueltas de un texto (el menú del día: una línea por plato). */
export const lineas = (t?: string) => (t ? t.split(/\n/).map((p) => p.trim()).filter(Boolean) : []);
