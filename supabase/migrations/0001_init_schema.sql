-- MITIZ Boutique de Carnes - schema inicial
-- Rode este arquivo no SQL Editor do Supabase (Dashboard > SQL Editor > New query)

-- ========== PROFILES ==========
create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  name text,
  phone text,
  role text not null default 'cliente' check (role in ('cliente', 'admin')),
  points_balance integer not null default 0,
  created_at timestamptz not null default now()
);

-- cria automaticamente um profile quando um novo usuario se cadastra
create function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, name)
  values (new.id, new.raw_user_meta_data ->> 'name');
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ========== CATEGORIES ==========
create table public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  sort_order integer not null default 0
);

-- ========== PRODUCTS ==========
create table public.products (
  id uuid primary key default gen_random_uuid(),
  category_id uuid references public.categories (id) on delete set null,
  name text not null,
  slug text not null unique,
  description text,
  unit_type text not null default 'kg' check (unit_type in ('kg', 'unidade', 'pacote')),
  price_per_unit numeric(10, 2) not null,
  meat_type text not null check (meat_type in ('bovina', 'suina', 'frango', 'linguica', 'outros')),
  image_url text,
  is_active boolean not null default true,
  is_featured boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ========== PROMOTIONS ==========
create table public.promotions (
  id uuid primary key default gen_random_uuid(),
  product_id uuid references public.products (id) on delete cascade,
  title text not null,
  description text,
  discount_type text not null check (discount_type in ('percent', 'fixed')),
  discount_value numeric(10, 2) not null,
  starts_at timestamptz,
  ends_at timestamptz,
  image_url text,
  is_active boolean not null default true
);

-- ========== NEWS (novidades) ==========
create table public.news (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  body text,
  image_url text,
  published_at timestamptz not null default now(),
  is_active boolean not null default true
);

-- ========== EVENTS ==========
create table public.events (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  event_date timestamptz not null,
  location text,
  image_url text,
  is_active boolean not null default true
);

-- ========== BARBECUE CALCULATOR RULES ==========
create table public.barbecue_calculator_rules (
  id uuid primary key default gen_random_uuid(),
  meat_type text not null unique check (meat_type in ('bovina', 'suina', 'frango', 'linguica', 'outros')),
  grams_per_adult integer not null,
  grams_per_child integer not null,
  sort_order integer not null default 0
);

insert into public.barbecue_calculator_rules (meat_type, grams_per_adult, grams_per_child, sort_order) values
  ('bovina', 300, 150, 1),
  ('suina', 250, 125, 2),
  ('frango', 200, 100, 3),
  ('linguica', 150, 75, 4);

-- ========== ORDERS (orcamentos) ==========
create table public.orders (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid references public.profiles (id) on delete set null,
  customer_name text not null,
  customer_phone text not null,
  status text not null default 'novo' check (status in ('novo', 'em_analise', 'confirmado', 'entregue', 'cancelado')),
  total_estimated numeric(10, 2) not null default 0,
  notes text,
  whatsapp_sent_at timestamptz,
  created_at timestamptz not null default now()
);

-- ========== ORDER ITEMS ==========
create table public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders (id) on delete cascade,
  product_id uuid not null references public.products (id),
  quantity numeric(10, 3) not null,
  unit_price_snapshot numeric(10, 2) not null,
  subtotal numeric(10, 2) not null
);

-- ========== POINTS TRANSACTIONS ==========
create table public.points_transactions (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid not null references public.profiles (id) on delete cascade,
  order_id uuid references public.orders (id) on delete set null,
  type text not null check (type in ('ganho', 'resgate', 'ajuste')),
  points integer not null,
  description text,
  created_by uuid references public.profiles (id),
  created_at timestamptz not null default now()
);

-- ========== REWARDS ==========
create table public.rewards (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  points_cost integer not null,
  reward_type text not null check (reward_type in ('desconto_percent', 'desconto_fixo', 'brinde')),
  value numeric(10, 2),
  stock integer,
  is_active boolean not null default true
);

-- ========== REWARD REDEMPTIONS ==========
create table public.reward_redemptions (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid not null references public.profiles (id) on delete cascade,
  reward_id uuid not null references public.rewards (id),
  points_spent integer not null,
  status text not null default 'pendente' check (status in ('pendente', 'usado', 'cancelado')),
  redemption_code text not null unique,
  created_at timestamptz not null default now(),
  used_at timestamptz
);

-- ========== ROW LEVEL SECURITY ==========
alter table public.profiles enable row level security;
alter table public.categories enable row level security;
alter table public.products enable row level security;
alter table public.promotions enable row level security;
alter table public.news enable row level security;
alter table public.events enable row level security;
alter table public.barbecue_calculator_rules enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.points_transactions enable row level security;
alter table public.rewards enable row level security;
alter table public.reward_redemptions enable row level security;

-- helper: checa se o usuario logado e admin
create function public.is_admin()
returns boolean
language sql
security definer set search_path = public
stable
as $$
  select exists (
    select 1 from public.profiles where id = auth.uid() and role = 'admin'
  );
$$;

-- profiles: usuario ve/edita o proprio perfil; admin ve/edita todos
create policy "profiles: self select" on public.profiles for select using (id = auth.uid() or public.is_admin());
create policy "profiles: self update" on public.profiles for update using (id = auth.uid() or public.is_admin());
create policy "profiles: admin insert" on public.profiles for insert with check (public.is_admin());

-- conteudo publico (leitura de itens ativos por qualquer um; escrita so admin)
create policy "categories: public read" on public.categories for select using (true);
create policy "categories: admin write" on public.categories for all using (public.is_admin()) with check (public.is_admin());

create policy "products: public read active" on public.products for select using (is_active or public.is_admin());
create policy "products: admin write" on public.products for all using (public.is_admin()) with check (public.is_admin());

create policy "promotions: public read active" on public.promotions for select using (is_active or public.is_admin());
create policy "promotions: admin write" on public.promotions for all using (public.is_admin()) with check (public.is_admin());

create policy "news: public read active" on public.news for select using (is_active or public.is_admin());
create policy "news: admin write" on public.news for all using (public.is_admin()) with check (public.is_admin());

create policy "events: public read active" on public.events for select using (is_active or public.is_admin());
create policy "events: admin write" on public.events for all using (public.is_admin()) with check (public.is_admin());

create policy "calculator rules: public read" on public.barbecue_calculator_rules for select using (true);
create policy "calculator rules: admin write" on public.barbecue_calculator_rules for all using (public.is_admin()) with check (public.is_admin());

create policy "rewards: public read active" on public.rewards for select using (is_active or public.is_admin());
create policy "rewards: admin write" on public.rewards for all using (public.is_admin()) with check (public.is_admin());

-- orders: cliente cria/ve os proprios; admin ve/gerencia todos
create policy "orders: owner or admin select" on public.orders for select using (customer_id = auth.uid() or public.is_admin());
create policy "orders: anyone insert" on public.orders for insert with check (true);
create policy "orders: owner or admin update" on public.orders for update using (customer_id = auth.uid() or public.is_admin());

create policy "order_items: owner or admin select" on public.order_items for select using (
  exists (select 1 from public.orders o where o.id = order_id and (o.customer_id = auth.uid() or public.is_admin()))
);
create policy "order_items: anyone insert" on public.order_items for insert with check (true);

-- points e recompensas: cliente ve as proprias; so admin lanca/gerencia
create policy "points: owner or admin select" on public.points_transactions for select using (customer_id = auth.uid() or public.is_admin());
create policy "points: admin write" on public.points_transactions for all using (public.is_admin()) with check (public.is_admin());

create policy "redemptions: owner or admin select" on public.reward_redemptions for select using (customer_id = auth.uid() or public.is_admin());
create policy "redemptions: owner insert" on public.reward_redemptions for insert with check (customer_id = auth.uid());
create policy "redemptions: admin update" on public.reward_redemptions for update using (public.is_admin());
