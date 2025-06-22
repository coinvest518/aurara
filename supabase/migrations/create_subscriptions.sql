-- Create subscriptions table
create table if not exists public.subscriptions (
    id uuid default uuid_generate_v4() primary key,
    user_id uuid references auth.users not null,
    stripe_customer_id text,
    subscription_type text not null default 'free',
    current_period_end timestamptz,
    created_at timestamptz default now(),
    updated_at timestamptz default now()
);

-- Enable RLS
alter table public.subscriptions enable row level security;

-- Create policies
create policy "Users can view own subscription"
  on public.subscriptions for select
  using (auth.uid() = user_id);

create policy "Enable insert for authenticated users on own records"
  on public.subscriptions for insert
  with check (auth.uid() = user_id);

-- Create initial free subscriptions for existing users
insert into public.subscriptions (user_id, subscription_type)
select id, 'free' from auth.users
where id not in (select user_id from public.subscriptions);
