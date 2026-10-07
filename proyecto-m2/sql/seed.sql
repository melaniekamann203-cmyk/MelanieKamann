-- Datos de ejemplo para probar la API
INSERT INTO authors (name, email, bio) VALUES
  ('Melanie Kamann', 'melanie@bitacora.dev', 'Desarrolladora web. Escribe sobre frontend y backend con JavaScript.'),
  ('Tomás Ibarra',  'tomas@bitacora.dev',   'Fotógrafo y viajero. Cuenta historias de rutas por Sudamérica.'),
  ('Carla Méndez',  'carla@bitacora.dev',   'Cocinera amateur. Comparte recetas fáciles para el día a día.');

INSERT INTO posts (author_id, title, content, published) VALUES
  (1, 'Cómo funciona el Event Loop de Node.js', 'Node.js usa un solo hilo y aun así atiende miles de peticiones gracias al Event Loop...', TRUE),
  (1, 'Status codes que todo backend debe conocer', '200, 201, 204, 400, 404 y 500: cuándo usar cada uno y por qué importa.', TRUE),
  (1, 'Borrador: mi primera API con PostgreSQL', 'Notas sobre cómo conectar Express con una base de datos real usando pg.', FALSE),
  (2, 'Diez días recorriendo la Patagonia', 'De El Calafate a Ushuaia: rutas, paisajes y consejos prácticos.', TRUE),
  (3, 'Empanadas al horno en 40 minutos', 'Una receta simple para la masa y tres rellenos distintos.', TRUE);
