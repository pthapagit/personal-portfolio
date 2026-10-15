-- Enforce the upload allow-list at the storage layer too (mirrors
-- lib/blog/image-upload.ts): 10 MB max, raster images only, no SVG.
update storage.buckets
set file_size_limit = 10485760,
    allowed_mime_types = array['image/png','image/jpeg','image/gif','image/webp','image/avif']
where id = 'blog-images';
