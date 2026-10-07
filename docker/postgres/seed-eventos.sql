-- Datos de prueba para eventos (comision-fiestas-varea).
-- Uso: psql -h localhost -U fiestas -d fiestas_varea -f seed-eventos.sql
-- Idempotente: ON CONFLICT (Id) DO NOTHING. Requiere la migracion
-- EventosParidadNoticias aplicada (columnas Publicada/Fijada/ImagenPortada).
-- No forma parte de init.sql (solo se ejecuta con volumen vacio); este
-- script puede reejecutarse en cualquier momento para recargar la prueba.

INSERT INTO eventos."Eventos" ("Id", "Titulo", "Descripcion", "Lugar", "FechaInicio", "FechaFin", "ImagenPortada", "Publicada", "Fijada", "Aforo", "CreatedAt", "CreatedBy", "LastModifiedAt", "LastModifiedBy") VALUES
('11111111-1111-1111-1111-111111111111', 'Pregon inaugural de las fiestas', '<p>Acto oficial de apertura con el pregon desde el balcon del ayuntamiento y reparto de panuelos.</p>', 'Plaza Mayor', '2026-08-14T20:00:00Z', '2026-08-14T22:00:00Z', '/uploads/eventos/pregon.jpg', TRUE, TRUE, NULL, '2026-06-01T10:00:00Z', 'seed', NULL, NULL),
('22222222-2222-2222-2222-222222222222', 'Verbena de verano', '<p>Orquesta en directo, barra popular y pista de baile hasta la madrugada.</p>', 'Parque Central', '2026-08-15T23:00:00Z', '2026-08-16T03:00:00Z', '/uploads/eventos/verbena.jpg', TRUE, FALSE, 500, '2026-06-02T10:00:00Z', 'seed', NULL, NULL),
('33333333-3333-3333-3333-333333333333', 'Concurso de paellas', '<p>Inscripcion por cuadrillas. La organizacion aporta lena y paellero; cada grupo trae sus ingredientes.</p>', 'Recinto ferial', '2026-08-16T12:00:00Z', '2026-08-16T16:00:00Z', NULL, TRUE, FALSE, 120, '2026-06-03T10:00:00Z', 'seed', NULL, NULL),
('44444444-4444-4444-4444-444444444444', 'Taller infantil de cabezudos', '<p>Manualidades para los mas pequenos: construye tu propio cabezudo con material reciclado.</p>', 'Centro civico', '2026-07-20T11:00:00Z', '2026-07-20T13:00:00Z', NULL, TRUE, FALSE, 30, '2026-06-04T10:00:00Z', 'seed', NULL, NULL),
('55555555-5555-5555-5555-555555555555', 'Concierto de la banda municipal', '<p>Repertorio festivo con pasodobles y piezas populares en el quiosco de musica.</p>', 'Quiosco de musica', '2026-09-25T19:30:00Z', '2026-09-25T21:00:00Z', '/uploads/eventos/banda.jpg', TRUE, FALSE, NULL, '2026-06-05T10:00:00Z', 'seed', NULL, NULL),
('66666666-6666-6666-6666-666666666666', 'Encierro chiqui', '<p>Encierro infantil con carretones para que los peques vivan la fiesta con seguridad.</p>', 'Calle Mayor', '2026-08-17T10:00:00Z', '2026-08-17T11:30:00Z', NULL, FALSE, FALSE, NULL, '2026-06-06T10:00:00Z', 'seed', NULL, NULL),
('77777777-7777-7777-7777-777777777777', 'Cena popular de hermandad', '<p>Caldereta popular con sobremesa y musica. Tickets a la venta en el local de la comision.</p>', 'Fronton municipal', '2026-08-18T21:00:00Z', '2026-08-19T00:00:00Z', '/uploads/eventos/cena.jpg', FALSE, FALSE, 200, '2026-06-07T10:00:00Z', 'seed', NULL, NULL),
('88888888-8888-8888-8888-888888888888', 'Misa solemne en honor al patron', '<p>Celebracion religiosa con la participacion del coro parroquial y ofrenda floral.</p>', 'Iglesia de San Martin', '2026-08-15T12:00:00Z', '2026-08-15T13:00:00Z', NULL, TRUE, TRUE, NULL, '2026-06-08T10:00:00Z', 'seed', NULL, NULL),
('99999999-9999-9999-9999-999999999999', 'Castillo de fuegos artificiales', '<p>Gran cierre de fiestas con espectaculo pirotecnico desde la explanada del rio.</p>', 'Explanada del rio', '2026-08-19T23:30:00Z', NULL, '/uploads/eventos/fuegos.jpg', TRUE, TRUE, NULL, '2026-06-09T10:00:00Z', 'seed', NULL, NULL),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Asamblea de la comision', '<p>Reunion interna para repasar el presupuesto y cerrar el programa definitivo.</p>', 'Local de la comision', '2026-09-10T18:00:00Z', '2026-09-10T20:00:00Z', NULL, FALSE, FALSE, 25, '2026-06-10T10:00:00Z', 'seed', NULL, NULL)
ON CONFLICT ("Id") DO NOTHING;
