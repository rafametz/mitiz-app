-- Reconstroi a calculadora de churrasco com um modelo baseado em
-- percentuais fixos sobre o total de gramas por pessoa, em vez de uma
-- gramatura fixa por tipo de carne.
--
-- Modelo: total_gramas = adultos*grams_per_adult + criancas*grams_per_child
-- Esse total e dividido em "grupos" (ex: Bovina 50%, Suina 25%,
-- Linguica 25%), e dentro de cada grupo o cliente escolhe ate
-- "max_selections" produtos da categoria vinculada, dividindo a
-- gramatura do grupo entre os escolhidos.
--
-- Tambem adiciona sugestao automatica de pao de alho e queijo por
-- pacote, calculada a partir do numero total de pessoas.

drop table if exists public.barbecue_calculator_rules cascade;

create table public.calculator_settings (
  id uuid primary key default gen_random_uuid(),
  grams_per_adult integer not null default 400,
  grams_per_child integer not null default 200,
  bread_product_id uuid references public.products (id) on delete set null,
  bread_units_per_package integer not null default 5,
  cheese_product_id uuid references public.products (id) on delete set null,
  cheese_people_per_package integer not null default 5
);

insert into public.calculator_settings (grams_per_adult, grams_per_child)
values (400, 200);

create table public.calculator_groups (
  id uuid primary key default gen_random_uuid(),
  key text not null unique,
  label text not null,
  percent numeric(5, 2) not null,
  category_id uuid references public.categories (id) on delete set null,
  max_selections integer not null default 3,
  sort_order integer not null default 0
);

insert into public.calculator_groups (key, label, percent, sort_order) values
  ('bovina', 'Bovina', 50, 1),
  ('suina', 'Suína', 25, 2),
  ('linguica', 'Linguiça', 25, 3);

alter table public.calculator_settings enable row level security;
alter table public.calculator_groups enable row level security;

create policy "calculator_settings: public read" on public.calculator_settings
  for select using (true);
create policy "calculator_settings: admin write" on public.calculator_settings
  for all using (public.is_admin()) with check (public.is_admin());

create policy "calculator_groups: public read" on public.calculator_groups
  for select using (true);
create policy "calculator_groups: admin write" on public.calculator_groups
  for all using (public.is_admin()) with check (public.is_admin());
