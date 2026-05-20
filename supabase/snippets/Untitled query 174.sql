create table items (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  brand text,
  category text,
  tags text[] default '{}',
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Auto-update the updated_at column on changes
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger set_updated_at
before update on items
for each row
execute function update_updated_at();