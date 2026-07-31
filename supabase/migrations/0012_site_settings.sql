-- Configuracoes gerais de aparencia do site (singleton), editaveis pelo
-- admin: imagem de capa da home e cores principais da marca.
create table public.site_settings (
  id uuid primary key default gen_random_uuid(),
  hero_image_url text,
  primary_color text not null default '#AF2B1E',
  primary_hover_color text not null default '#8B1E1E'
);

insert into public.site_settings (id) values (gen_random_uuid());

alter table public.site_settings enable row level security;

create policy "site_settings: public read" on public.site_settings
  for select using (true);

create policy "site_settings: admin write" on public.site_settings
  for all using (public.is_admin()) with check (public.is_admin());
