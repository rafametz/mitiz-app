-- Cria o "bucket" (pasta) de armazenamento para as imagens do app.
-- Publico para leitura (qualquer visitante ve as fotos), mas so admin pode enviar/apagar.
insert into storage.buckets (id, name, public)
values ('images', 'images', true)
on conflict (id) do nothing;

create policy "images: public read" on storage.objects
  for select using (bucket_id = 'images');

create policy "images: admin insert" on storage.objects
  for insert with check (bucket_id = 'images' and public.is_admin());

create policy "images: admin update" on storage.objects
  for update using (bucket_id = 'images' and public.is_admin());

create policy "images: admin delete" on storage.objects
  for delete using (bucket_id = 'images' and public.is_admin());
