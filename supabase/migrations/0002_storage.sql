-- Aura · media storage
--
-- Demonstration videos uploaded by coaches. Requires Supabase's storage schema,
-- so this file is applied by Supabase only (the local schema check skips it).

insert into storage.buckets (id, name, public)
values ('demonstrations', 'demonstrations', true)
on conflict (id) do nothing;

-- Anyone can watch a demonstration.
create policy demonstrations_read on storage.objects for select to anon, authenticated
  using (bucket_id = 'demonstrations');

-- Coaches upload into a folder named after their own user id.
create policy demonstrations_upload on storage.objects for insert to authenticated
  with check (bucket_id = 'demonstrations' and public.has_role('coach') and (storage.foldername(name))[1] = auth.uid()::text);

create policy demonstrations_manage on storage.objects for delete to authenticated
  using (bucket_id = 'demonstrations' and (storage.foldername(name))[1] = auth.uid()::text);
