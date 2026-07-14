-- Permite que o proprio fluxo de orcamento de convidado (sem conta) marque
-- whatsapp_sent_at logo apos criar o pedido, sem exigir dono autenticado.
drop policy "orders: owner or admin update" on public.orders;

create policy "orders: owner, guest or admin update" on public.orders
  for update
  using (customer_id = auth.uid() or customer_id is null or public.is_admin());
