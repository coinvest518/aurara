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

create policy "Users can update own subscription"
  on public.subscriptions for update
  using (auth.uid() = user_id);

-- Create function to handle subscription updates
create or replace function handle_subscription_update()
returns trigger as $$
begin
    new.updated_at = now();
    return new;
end;
$$ language plpgsql;

-- Create trigger for subscription updates
create trigger subscription_updated
    before update on public.subscriptions
    for each row
    execute procedure handle_subscription_update();
