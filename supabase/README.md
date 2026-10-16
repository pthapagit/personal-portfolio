# Supabase configuration (source of truth)

The blog's real security boundary lives in Supabase, **not** in the Next.js app.
The browser receives only the public `anon` key, so anyone can call Supabase
directly. The `requireAdmin()` guards in the app protect the app's own routes
only — Row-Level Security (RLS) and Storage policies are what actually stop an
attacker from reading drafts or writing/deleting posts.

## Migrations

`migrations/` mirrors, file for file, what has been applied to the live project
(`supabase_migrations.schema_migrations`). The file name prefix is the applied
version. Add new changes as new timestamped files; never edit applied ones.

Current live policy model:

| Table / bucket | Read | Write |
| -------------- | ---- | ----- |
| `public.posts` | anyone: `status = 'published'` rows only | admin account only (`auth.uid()` pinned to the admin user id) |
| `storage.objects` in `blog-images` | objects served by direct public URL (bucket is public); `list`/authenticated read = admin only | admin account only (same pin) |

The `blog-images` bucket also enforces a 10 MB limit and a raster-image MIME
allow-list (PNG, JPEG, GIF, WebP, AVIF — no SVG) at the storage layer.

Storage SELECT is admin-only so the anon key can't enumerate the bucket via
`list`. Public image URLs keep working because the bucket is public — if it is
ever made private, covers must be served via signed URLs instead.

Writes are pinned to the admin **user id**, not the email claim: ids never
change or get reused, so the policy can't be satisfied by any other account.
If you ever recreate the admin account, add a migration updating the id.

## Dashboard checklist (cannot be done in SQL)

- [ ] **Public sign-ups disabled** (Authentication → Sign In / Providers →
      "Allow new users to sign up" OFF). Rogue accounts already can't write
      (policies are pinned to the admin id), but this removes the surface.
- [ ] **Leaked password protection enabled** (same page; checks new passwords
      against HaveIBeenPwned).
- [ ] **Auth rate limits** left at Supabase defaults (Authentication → Rate
      Limits) for brute-force protection.

## Verify the policies hold

With ONLY the anon key (no session), both of these must fail:

```bash
SUPABASE_URL="https://<your-ref>.supabase.co"
ANON="<anon key>"

# Draft rows must NOT come back:
curl -s "$SUPABASE_URL/rest/v1/posts?select=id&status=eq.draft" \
  -H "apikey: $ANON" -H "Authorization: Bearer $ANON"   # expect: []

# Anonymous insert must be rejected (RLS):
curl -s -X POST "$SUPABASE_URL/rest/v1/posts" \
  -H "apikey: $ANON" -H "Authorization: Bearer $ANON" \
  -H "Content-Type: application/json" \
  -d '{"title":"x","slug":"x","content_md":"x","status":"published"}'
  # expect: 401 + "new row violates row-level security policy"

# Anonymous bucket enumeration must return no objects:
curl -s -X POST "$SUPABASE_URL/storage/v1/object/list/blog-images" \
  -H "apikey: $ANON" -H "Authorization: Bearer $ANON" \
  -H "Content-Type: application/json" -d '{"prefix":"","limit":100}'
  # expect: []   (a known public image URL still loads directly)
```
