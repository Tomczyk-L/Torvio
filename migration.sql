-- migration.sql
-- Uruchom PO: npx prisma migrate dev --name init
-- To uzupełnia to, czego Prisma nie wspiera natywnie

-- ─────────────────────────────────────────
-- FULL-TEXT SEARCH — trigger automatycznie
-- aktualizuje search_vector przy każdym
-- INSERT lub UPDATE na tabeli listings
-- ─────────────────────────────────────────

CREATE OR REPLACE FUNCTION listings_search_vector_update()
RETURNS TRIGGER AS $$
BEGIN
  NEW.search_vector :=
    setweight(to_tsvector('polish', coalesce(NEW.title, '')), 'A') ||
    setweight(to_tsvector('polish', coalesce(NEW.description, '')), 'B') ||
    setweight(to_tsvector('polish', coalesce(NEW.city, '')), 'C') ||
    setweight(to_tsvector('polish', coalesce(NEW.voivodeship, '')), 'C');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER listings_search_vector_trigger
  BEFORE INSERT OR UPDATE ON listings
  FOR EACH ROW EXECUTE FUNCTION listings_search_vector_update();

-- Indeks GIN dla szybkiego full-text search
CREATE INDEX listings_search_vector_idx ON listings USING GIN(search_vector);

-- ─────────────────────────────────────────
-- AUTOMATYCZNY SLUG dla ogłoszeń
-- Generuje unikalny slug z tytułu + losowy suffix
-- ─────────────────────────────────────────

CREATE OR REPLACE FUNCTION generate_listing_slug(title TEXT)
RETURNS TEXT AS $$
DECLARE
  base_slug TEXT;
  final_slug TEXT;
  suffix TEXT;
BEGIN
  -- Zamień polskie znaki, małe litery, myślniki
  base_slug := lower(title);
  base_slug := translate(base_slug, 'ąćęłńóśźżĄĆĘŁŃÓŚŹŻ', 'acelnoszz acelnoszz');
  base_slug := regexp_replace(base_slug, '[^a-z0-9]+', '-', 'g');
  base_slug := trim(both '-' from base_slug);

  -- Dodaj losowy 6-znakowy suffix dla unikalności
  suffix := lower(substring(md5(random()::text) from 1 for 6));
  final_slug := base_slug || '-' || suffix;

  RETURN final_slug;
END;
$$ LANGUAGE plpgsql;

-- ─────────────────────────────────────────
-- AUTOMATYCZNE WYGASANIE ogłoszeń po 30 dniach
-- Uruchamiaj jako cron job (np. przez pg_cron
-- lub zewnętrzny scheduler co 24h)
-- ─────────────────────────────────────────

CREATE OR REPLACE FUNCTION expire_old_listings()
RETURNS void AS $$
BEGIN
  UPDATE listings
  SET status = 'EXPIRED'
  WHERE status = 'ACTIVE'
    AND expires_at IS NOT NULL
    AND expires_at < NOW();
END;
$$ LANGUAGE plpgsql;

-- ─────────────────────────────────────────
-- SEED: MARKI I MODELE
-- Podstawowy katalog najpopularniejszych aut w Polsce
-- ─────────────────────────────────────────

INSERT INTO makes (name, slug) VALUES
  ('Audi',       'audi'),
  ('BMW',        'bmw'),
  ('Citroën',    'citroen'),
  ('Dacia',      'dacia'),
  ('Fiat',       'fiat'),
  ('Ford',       'ford'),
  ('Honda',      'honda'),
  ('Hyundai',    'hyundai'),
  ('Kia',        'kia'),
  ('Mazda',      'mazda'),
  ('Mercedes-Benz', 'mercedes-benz'),
  ('Mitsubishi', 'mitsubishi'),
  ('Nissan',     'nissan'),
  ('Opel',       'opel'),
  ('Peugeot',    'peugeot'),
  ('Renault',    'renault'),
  ('Seat',       'seat'),
  ('Skoda',      'skoda'),
  ('Suzuki',     'suzuki'),
  ('Toyota',     'toyota'),
  ('Volkswagen', 'volkswagen'),
  ('Volvo',      'volvo')
ON CONFLICT (slug) DO NOTHING;

-- Modele Volkswagen
INSERT INTO models (make_id, name, slug, body_type) 
SELECT m.id, model.name, model.slug, model.body_type
FROM makes m, (VALUES
  ('Golf',      'golf',      'hatchback'),
  ('Passat',    'passat',    'sedan'),
  ('Tiguan',    'tiguan',    'suv'),
  ('Polo',      'polo',      'hatchback'),
  ('T-Roc',     't-roc',     'suv'),
  ('Touareg',   'touareg',   'suv'),
  ('Arteon',    'arteon',    'sedan'),
  ('T-Cross',   't-cross',   'suv'),
  ('Sharan',    'sharan',    'van'),
  ('Caddy',     'caddy',     'van')
) AS model(name, slug, body_type)
WHERE m.slug = 'volkswagen'
ON CONFLICT (make_id, slug) DO NOTHING;

-- Modele Toyota
INSERT INTO models (make_id, name, slug, body_type)
SELECT m.id, model.name, model.slug, model.body_type
FROM makes m, (VALUES
  ('Corolla',   'corolla',   'sedan'),
  ('Yaris',     'yaris',     'hatchback'),
  ('RAV4',      'rav4',      'suv'),
  ('C-HR',      'c-hr',      'suv'),
  ('Camry',     'camry',     'sedan'),
  ('Aygo',      'aygo',      'hatchback'),
  ('Land Cruiser', 'land-cruiser', 'suv'),
  ('Prius',     'prius',     'hatchback'),
  ('Auris',     'auris',     'hatchback'),
  ('Hilux',     'hilux',     'pickup')
) AS model(name, slug, body_type)
WHERE m.slug = 'toyota'
ON CONFLICT (make_id, slug) DO NOTHING;

-- Modele BMW
INSERT INTO models (make_id, name, slug, body_type)
SELECT m.id, model.name, model.slug, model.body_type
FROM makes m, (VALUES
  ('1 Series',  '1-series',  'hatchback'),
  ('2 Series',  '2-series',  'coupe'),
  ('3 Series',  '3-series',  'sedan'),
  ('4 Series',  '4-series',  'coupe'),
  ('5 Series',  '5-series',  'sedan'),
  ('7 Series',  '7-series',  'sedan'),
  ('X1',        'x1',        'suv'),
  ('X3',        'x3',        'suv'),
  ('X5',        'x5',        'suv'),
  ('X6',        'x6',        'suv')
) AS model(name, slug, body_type)
WHERE m.slug = 'bmw'
ON CONFLICT (make_id, slug) DO NOTHING;

-- Modele Skoda
INSERT INTO models (make_id, name, slug, body_type)
SELECT m.id, model.name, model.slug, model.body_type
FROM makes m, (VALUES
  ('Octavia',   'octavia',   'sedan'),
  ('Fabia',     'fabia',     'hatchback'),
  ('Superb',    'superb',    'sedan'),
  ('Kodiaq',    'kodiaq',    'suv'),
  ('Karoq',     'karoq',     'suv'),
  ('Scala',     'scala',     'hatchback'),
  ('Kamiq',     'kamiq',     'suv'),
  ('Rapid',     'rapid',     'sedan')
) AS model(name, slug, body_type)
WHERE m.slug = 'skoda'
ON CONFLICT (make_id, slug) DO NOTHING;

-- Modele Ford
INSERT INTO models (make_id, name, slug, body_type)
SELECT m.id, model.name, model.slug, model.body_type
FROM makes m, (VALUES
  ('Focus',     'focus',     'hatchback'),
  ('Fiesta',    'fiesta',    'hatchback'),
  ('Mondeo',    'mondeo',    'sedan'),
  ('Kuga',      'kuga',      'suv'),
  ('Puma',      'puma',      'suv'),
  ('Explorer',  'explorer',  'suv'),
  ('Mustang',   'mustang',   'coupe'),
  ('Transit',   'transit',   'van')
) AS model(name, slug, body_type)
WHERE m.slug = 'ford'
ON CONFLICT (make_id, slug) DO NOTHING;

-- Modele Opel
INSERT INTO models (make_id, name, slug, body_type)
SELECT m.id, model.name, model.slug, model.body_type
FROM makes m, (VALUES
  ('Astra',     'astra',     'hatchback'),
  ('Corsa',     'corsa',     'hatchback'),
  ('Insignia',  'insignia',  'sedan'),
  ('Mokka',     'mokka',     'suv'),
  ('Crossland', 'crossland', 'suv'),
  ('Grandland', 'grandland', 'suv'),
  ('Zafira',    'zafira',    'van'),
  ('Vectra',    'vectra',    'sedan')
) AS model(name, slug, body_type)
WHERE m.slug = 'opel'
ON CONFLICT (make_id, slug) DO NOTHING;
