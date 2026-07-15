-- Rode este comando substituindo o e-mail pelo da conta que deve ser administradora.
-- Voce precisa ja ter se cadastrado no app (/cadastro) com esse e-mail antes de rodar isso.
update public.profiles
set role = 'admin'
where id = (select id from auth.users where email = 'admin.mitiz.qa@gmail.com');
