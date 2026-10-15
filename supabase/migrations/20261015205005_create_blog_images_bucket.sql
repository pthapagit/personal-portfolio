insert into storage.buckets (id, name, public)
values ('blog-images', 'blog-images', true)
on conflict (id) do nothing;

create policy "blog images public read" on storage.objects
  for select using (bucket_id = 'blog-images');

-- The three write policies below are superseded by
-- 20261015220046_restrict_writes_to_admin.
create policy "blog images authenticated insert" on storage.objects
  for insert to authenticated with check (bucket_id = 'blog-images');

create policy "blog images authenticated update" on storage.objects
  for update to authenticated using (bucket_id = 'blog-images');

create policy "blog images authenticated delete" on storage.objects
  for delete to authenticated using (bucket_id = 'blog-images');
