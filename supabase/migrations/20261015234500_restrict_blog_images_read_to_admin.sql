-- The "blog images public read" SELECT policy applied to the anon role, which
-- also authorizes the storage `list` endpoint: anyone with the public anon key
-- could enumerate EVERY object name in the bucket (incl. unpublished drafts'
-- cover images and orphaned uploads), then fetch each one.
--
-- The bucket is public (public = true), so objects remain reachable by their
-- direct public URL (/storage/v1/object/public/blog-images/<name>) WITHOUT any
-- SELECT policy — next/image keeps working unchanged. Scoping SELECT to the
-- admin removes anonymous enumeration while preserving public image serving.
--
-- NOTE: this depends on the bucket staying public. If it is ever made private,
-- covers must instead be served via signed URLs.

drop policy "blog images public read" on storage.objects;

create policy "blog images admin read" on storage.objects
  for select to authenticated
  using (
    bucket_id = 'blog-images'
    and (select auth.uid()) = '50b0c090-7bff-49b0-acb3-edbce96d97a8'::uuid
  );
