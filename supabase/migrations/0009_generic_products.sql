-- Torna o catalogo generico (nao mais restrito a carnes): remove o campo
-- fixo "tipo de carne" do produto e adiciona campos genericos de cadastro
-- (NCM, codigo do produto, marca/fabricante).
--
-- A calculadora de churrasco passa a sugerir produtos pela CATEGORIA do
-- produto em vez do campo removido, entao cada regra da calculadora agora
-- se liga a uma categoria (configuravel em /admin/calculadora-config).

alter table public.barbecue_calculator_rules
  add column category_id uuid references public.categories (id) on delete set null;

-- vincula automaticamente as regras existentes as categorias equivalentes
update public.barbecue_calculator_rules r
set category_id = c.id
from public.categories c
where r.category_id is null and (
  (r.meat_type = 'bovina' and c.slug = 'bovinos') or
  (r.meat_type = 'suina' and c.slug = 'suinos') or
  (r.meat_type = 'frango' and c.slug = 'aves') or
  (r.meat_type = 'linguica' and c.slug = 'linguicas')
);

alter table public.products
  add column ncm text,
  add column product_code text,
  add column brand text;

alter table public.products drop column meat_type;
