-- Permite que produtos vendidos por unidade/pacote (ex: linguica em
-- gitos, pao de alho) informem quantos gramas representa cada unidade,
-- para a calculadora de churrasco converter a gramatura sugerida em
-- "quantas unidades comprar" (arredondando para cima).
alter table public.products add column grams_per_unit integer;
