-- Dados de teste para visualizar o app funcionando (pode apagar depois)
insert into public.categories (name, slug, sort_order) values
  ('Bovinos', 'bovinos', 1),
  ('Suínos', 'suinos', 2),
  ('Aves', 'aves', 3),
  ('Linguiças e Embutidos', 'linguicas', 4);

insert into public.products (category_id, name, slug, description, unit_type, price_per_unit, meat_type, is_active, is_featured)
select id, 'Picanha Premium', 'picanha-premium', 'Picanha selecionada, maturada.', 'kg', 89.90, 'bovina', true, true
from public.categories where slug = 'bovinos';

insert into public.products (category_id, name, slug, description, unit_type, price_per_unit, meat_type, is_active, is_featured)
select id, 'Costela Bovina', 'costela-bovina', 'Costela para churrasco lento.', 'kg', 42.90, 'bovina', true, false
from public.categories where slug = 'bovinos';

insert into public.products (category_id, name, slug, description, unit_type, price_per_unit, meat_type, is_active, is_featured)
select id, 'Pernil Suíno', 'pernil-suino', 'Pernil suíno temperado.', 'kg', 28.90, 'suina', true, false
from public.categories where slug = 'suinos';

insert into public.products (category_id, name, slug, description, unit_type, price_per_unit, meat_type, is_active, is_featured)
select id, 'Coxa e Sobrecoxa', 'coxa-sobrecoxa', 'Frango caipira.', 'kg', 18.90, 'frango', true, false
from public.categories where slug = 'aves';

insert into public.products (category_id, name, slug, description, unit_type, price_per_unit, meat_type, is_active, is_featured)
select id, 'Linguiça Artesanal Toscana', 'linguica-artesanal', 'Linguiça toscana artesanal.', 'kg', 32.90, 'linguica', true, true
from public.categories where slug = 'linguicas';

insert into public.promotions (product_id, title, description, discount_type, discount_value, is_active)
select id, 'Picanha com 15% OFF', 'Promoção de aniversário da loja', 'percent', 15, true
from public.products where slug = 'picanha-premium';

insert into public.news (title, body, is_active) values
  ('Nova linha de embutidos artesanais', 'Chegaram novidades na loja, venha conferir!', true);

insert into public.events (title, description, event_date, location, is_active) values
  ('Degustação de carnes nobres', 'Venha provar nossos cortes premium', now() + interval '7 days', 'Loja MITIZ', true);
