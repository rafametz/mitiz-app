-- Atualiza o trigger de criacao de perfil para tambem gravar o telefone
-- informado no cadastro (alem do nome), usado para campanhas de WhatsApp.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, name, phone)
  values (
    new.id,
    new.raw_user_meta_data ->> 'name',
    new.raw_user_meta_data ->> 'phone'
  );
  return new;
end;
$$;
