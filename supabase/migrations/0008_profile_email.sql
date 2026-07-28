-- Guarda o e-mail do cliente no perfil (facilita ver os dados no admin
-- sem precisar de acesso a auth.users) e atualiza o trigger de cadastro
-- para gravar o e-mail junto com nome e telefone.
alter table public.profiles add column if not exists email text;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, name, phone, email)
  values (
    new.id,
    new.raw_user_meta_data ->> 'name',
    new.raw_user_meta_data ->> 'phone',
    new.email
  );
  return new;
end;
$$;

-- preenche o e-mail de contas que ja existiam antes desta migration
update public.profiles p
set email = u.email
from auth.users u
where p.id = u.id and p.email is null;
