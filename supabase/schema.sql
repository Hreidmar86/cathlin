create extension if not exists pgcrypto;

create table if not exists public.catches (
  id uuid primary key default gen_random_uuid(),
  angler text not null,
  species text not null,
  length numeric(6,2) not null default 0,
  weight numeric(6,2) not null default 0,
  date date not null,
  location text not null default '',
  method text not null default '',
  weather text not null default '',
  lure text not null default '',
  note text not null default '',
  photo_url text not null default '',
  mood text not null default '',
  tags text[] not null default '{}',
  released boolean not null default true,
  trip_name text not null default '',
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists catches_date_idx on public.catches (date desc);
create index if not exists catches_species_idx on public.catches (species);
create index if not exists catches_angler_idx on public.catches (angler);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists catches_set_updated_at on public.catches;
create trigger catches_set_updated_at
before update on public.catches
for each row
execute function public.set_updated_at();

alter table public.catches enable row level security;

drop policy if exists "Public can read catches" on public.catches;
create policy "Public can read catches"
on public.catches
for select
to anon, authenticated
using (true);

drop policy if exists "Allowlisted admins can insert catches" on public.catches;
create policy "Allowlisted admins can insert catches"
on public.catches
for insert
to authenticated
with check (
  lower(auth.jwt() ->> 'email') in ('cathlin@example.com', 'robin@example.com')
);

drop policy if exists "Allowlisted admins can update catches" on public.catches;
create policy "Allowlisted admins can update catches"
on public.catches
for update
to authenticated
using (
  lower(auth.jwt() ->> 'email') in ('cathlin@example.com', 'robin@example.com')
)
with check (
  lower(auth.jwt() ->> 'email') in ('cathlin@example.com', 'robin@example.com')
);

drop policy if exists "Allowlisted admins can delete catches" on public.catches;
create policy "Allowlisted admins can delete catches"
on public.catches
for delete
to authenticated
using (
  lower(auth.jwt() ->> 'email') in ('cathlin@example.com', 'robin@example.com')
);

insert into storage.buckets (id, name, public)
values ('catch-photos', 'catch-photos', true)
on conflict (id) do update set public = true;

drop policy if exists "Public can read catch photos" on storage.objects;
create policy "Public can read catch photos"
on storage.objects
for select
to anon, authenticated
using (bucket_id = 'catch-photos');

drop policy if exists "Allowlisted admins can upload catch photos" on storage.objects;
create policy "Allowlisted admins can upload catch photos"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'catch-photos'
  and lower(auth.jwt() ->> 'email') in ('cathlin@example.com', 'robin@example.com')
);

drop policy if exists "Allowlisted admins can update catch photos" on storage.objects;
create policy "Allowlisted admins can update catch photos"
on storage.objects
for update
to authenticated
using (
  bucket_id = 'catch-photos'
  and lower(auth.jwt() ->> 'email') in ('cathlin@example.com', 'robin@example.com')
)
with check (
  bucket_id = 'catch-photos'
  and lower(auth.jwt() ->> 'email') in ('cathlin@example.com', 'robin@example.com')
);

drop policy if exists "Allowlisted admins can delete catch photos" on storage.objects;
create policy "Allowlisted admins can delete catch photos"
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'catch-photos'
  and lower(auth.jwt() ->> 'email') in ('cathlin@example.com', 'robin@example.com')
);
