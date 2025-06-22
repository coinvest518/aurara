# Supabase Integration Guide for My Buddy App

This guide will help you set up Supabase for user authentication, user profiles, and conversation tracking in your production React app.

---

## 1. Supabase Project Setup

- Go to [Supabase](https://supabase.com/) and create a new project.
- Get your Project URL and anon/public API key from the Supabase dashboard.
- Enable Row Level Security (RLS) for all tables you create.

---

## 2. Install Supabase Client

```
npm install @supabase/supabase-js
```

---

## 3. Environment Variables

Create a `.env` or `.env.local` file in your project root:

```
VITE_SUPABASE_URL=https://xogolrwbxbcdicpuwevs.supabase.co
VITE_SUPABASE_KEY=your-anon-public-key-here
```

---

## 4. Initialize Supabase Client

Create a new file `src/supabaseClient.ts`:

```ts
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY;
export const supabase = createClient(supabaseUrl, supabaseKey);
```

---

## 5. Database Schema

### a. User Profiles Table

```sql
create table profiles (
  id uuid primary key references auth.users(id),
  display_name text,
  avatar_url text,
  created_at timestamp with time zone default timezone('utc'::text, now())
);
```

### b. Conversations Table

```sql
create table conversations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id),
  persona_id text,
  started_at timestamp with time zone default timezone('utc'::text, now()),
  ended_at timestamp with time zone,
  transcript text
);
```

### c. Persona Descriptions Table

```sql
create table persona_descriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id),
  persona_id text,
  description text
);
```

---

## 6. Row Level Security (RLS) Policies

Enable RLS for each table and add policies so users can only access their own data:

```sql
-- Enable RLS
alter table profiles enable row level security;
alter table conversations enable row level security;
alter table persona_descriptions enable row level security;

-- Allow users to select/insert/update/delete their own rows
create policy "Users can manage their own profile" on profiles
  for all using (auth.uid() = id);

create policy "Users can manage their own conversations" on conversations
  for all using (auth.uid() = user_id);

create policy "Users can manage their own persona descriptions" on persona_descriptions
  for all using (auth.uid() = user_id);
```

---

## 7. Next Steps

- Implement Supabase Auth (sign up, login, logout) in your React app.
- Use the `supabase` client to read/write user profiles, conversations, and persona descriptions.
- Store and fetch data as needed for your app features.

---

**You are now ready to integrate Supabase into your app!**

If you want, I can scaffold the authentication UI and logic next.
