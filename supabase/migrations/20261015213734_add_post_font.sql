alter table public.posts add column font text not null default 'sans' check (font in ('sans','serif','mono'));
