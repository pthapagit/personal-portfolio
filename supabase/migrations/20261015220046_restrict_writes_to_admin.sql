-- Writes were previously allowed for ANY authenticated user; with public
-- signups enabled that let any self-registered account modify content.
-- Pin every write policy to the single admin account.

drop policy "authenticated full access" on public.posts;
create policy "admin full access" on public.posts
  for all to authenticated
  using ((select auth.uid()) = '50b0c090-7bff-49b0-acb3-edbce96d97a8'::uuid)
  with check ((select auth.uid()) = '50b0c090-7bff-49b0-acb3-edbce96d97a8'::uuid);

drop policy "blog images authenticated insert" on storage.objects;
drop policy "blog images authenticated update" on storage.objects;
drop policy "blog images authenticated delete" on storage.objects;

create policy "blog images admin insert" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'blog-images' and (select auth.uid()) = '50b0c090-7bff-49b0-acb3-edbce96d97a8'::uuid);

create policy "blog images admin update" on storage.objects
  for update to authenticated
  using (bucket_id = 'blog-images' and (select auth.uid()) = '50b0c090-7bff-49b0-acb3-edbce96d97a8'::uuid)
  with check (bucket_id = 'blog-images' and (select auth.uid()) = '50b0c090-7bff-49b0-acb3-edbce96d97a8'::uuid);

create policy "blog images admin delete" on storage.objects
  for delete to authenticated
  using (bucket_id = 'blog-images' and (select auth.uid()) = '50b0c090-7bff-49b0-acb3-edbce96d97a8'::uuid);
