-- Executar este script no SQL Editor do Supabase

-- Habilitar a extensão "uuid-ossp" se não existir, para garantir UUIDs corretos
create extension if not exists "uuid-ossp";

-- 1. Tabela profiles (Se já existir, não fará nada. Retirada a criação da tabela para apenas garantir as colunas, ou você já a tem ligada ao auth.users)
-- Apenas como segurança, criaremos se não existir:
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade not null primary key,
  name text,
  email text,
  role text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Habilitando RLS para profiles se não estiver
alter table public.profiles enable row level security;

-- Política de RLS para profiles: Usuário só vê e edita o seu
drop policy if exists "Users can view own profile" on public.profiles;
create policy "Users can view own profile" 
on public.profiles for select 
using ( auth.uid() = id );

drop policy if exists "Users can update own profile" on public.profiles;
create policy "Users can update own profile" 
on public.profiles for update 
using ( auth.uid() = id );

-- 2. Tabela social_accounts
create table if not exists public.social_accounts (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  platform text not null check (platform in ('instagram', 'facebook', 'youtube')),
  account_name text not null,
  account_id text, -- ID da própria plataforma (ex: ID da conta de negócios do FB)
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.social_accounts enable row level security;

drop policy if exists "Users can modify their own social accounts" on public.social_accounts;
create policy "Users can modify their own social accounts" 
on public.social_accounts for all 
using ( auth.uid() = user_id );

-- 3. Tabela metrics
create table if not exists public.metrics (
  id uuid default uuid_generate_v4() primary key,
  account_id uuid references public.social_accounts(id) on delete cascade not null,
  platform text not null check (platform in ('instagram', 'facebook', 'youtube')),
  followers integer default 0,
  reach integer default 0,
  impressions integer default 0,
  engagement integer default 0,
  clicks integer default 0,
  views integer default 0,
  date date not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.metrics enable row level security;

drop policy if exists "Users can modify metrics for their own accounts" on public.metrics;
create policy "Users can modify metrics for their own accounts" 
on public.metrics for all 
using ( 
  auth.uid() = (
    select user_id from public.social_accounts where public.social_accounts.id = public.metrics.account_id
  )
);

-- 4. Tabela audience_demographics
create table if not exists public.audience_demographics (
  id uuid default uuid_generate_v4() primary key,
  account_id uuid references public.social_accounts(id) on delete cascade not null,
  gender text,     -- Ex: 'Masculino', 'Feminino'
  age_range text,  -- Ex: '18-24', '25-34'
  city text,       -- Ex: 'São Paulo'
  percentage numeric(5,2) check (percentage >= 0 and percentage <= 100),
  date date not null, -- É sempre bom amarrar a demografia a uma data base também
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.audience_demographics enable row level security;

drop policy if exists "Users can modify demographics for their own accounts" on public.audience_demographics;
create policy "Users can modify demographics for their own accounts" 
on public.audience_demographics for all 
using ( 
  auth.uid() = (
    select user_id from public.social_accounts where public.social_accounts.id = public.audience_demographics.account_id
  )
);
