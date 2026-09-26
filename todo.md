# Pendiente — nuevas entidades del backend

Decisiones ya tomadas: sin Reservas, comentarios abiertos con nombre (con moderación),
Archivos/Galerías solo para Eventos, se reutilizan las Categorías/Tags actuales.
No probar la API con cada implementación; probar al final.

## Hecho
- [x] Eventos (`eventos`) — CRUD + migración aplicada + probado contra la API.
- [x] Notificaciones (`notificaciones`) — CRUD + migración aplicada (pendiente probar al final).

## Por hacer
- [ ] Archivos (`multimedia`) — referencia a ficheros (nombre, url, tipo, tamaño),
  solo para Eventos. Entidad + CRUD + migración.
- [ ] Galerías (`multimedia`) — agrupación de archivos con título y descripción.
  Entidad + CRUD + migración.
- [ ] Tablas asociativas con Eventos — Evento-Archivo, Evento-Galería y
  Galería-Archivo. Se gestionan desde Eventos y Galerías (asignar/quitar).
- [ ] Comentarios (`participacion`) — abiertos con nombre + texto, con estado
  pendiente/aprobado/rechazado. Cuelgan de una Noticia, un Evento o una
  Notificación. Lo último porque depende de los tres contenidos.

## Al final
- [ ] Probar la API completa (Notificaciones, Archivos, Galerías, Comentarios,
  regresión de Noticias/Categorías/Tags/Eventos).
