INSERT INTO users (email, password_hash, role)
VALUES
  ('organizer@frp.tickets', '$2a$10$qG7UqZqYjQ5HhS1OUp4sP.Gx4DKmLRLxgqVwzW3Xv8Fv8pFpgv4Vy', 'organizer'),
  ('admin@frp.tickets', '$2a$10$qG7UqZqYjQ5HhS1OUp4sP.Gx4DKmLRLxgqVwzW3Xv8Fv8pFpgv4Vy', 'admin');

INSERT INTO events (organizer_id, name, description, start_time, venue, capacity, price_crc)
VALUES (
  (SELECT id FROM users WHERE email = 'organizer@frp.tickets'),
  'Festival Playa Azul',
  'Evento al aire libre con artistas nacionales.',
  NOW() + INTERVAL '20 days',
  'Puntarenas',
  500,
  15000
);
