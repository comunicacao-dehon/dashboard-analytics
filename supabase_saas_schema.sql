-- ==========================================
-- ESTRUTURA SAAS - BILLING & INTEGRAÇÕES
-- ==========================================

create extension if not exists "uuid-ossp";

-- ----------------------------------------------------------------------------------
-- PARTE 1: TABELAS
-- ----------------------------------------------------------------------------------

-- 1. Assinaturas (subscriptions)
create table if not exists public.subscriptions (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  plan_id text not null check (plan_id in ('free', 'pro', 'team')),
  status text not null check (status in ('active', 'canceled', 'past_due', 'trialing')),
  current_period_end timestamp with time zone,
  stripe_customer_id text,
  stripe_subscription_id text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique (user_id) -- Um usuário (ou time) tem 1 assinatura principal ativa
);

-- 2. Conexões de API Externa (api_connections)
create table if not exists public.api_connections (
  id uuid default uuid_generate_v4() primary key,
  team_id uuid references public.teams(id) on delete cascade not null,
  platform text not null check (platform in ('instagram', 'facebook', 'youtube')),
  external_account_id text not null,
  access_token text not null, -- Em produção deve ser criptografado no banco
  refresh_token text,
  token_expires_at timestamp with time zone,
  status text not null default 'active' check (status in ('active', 'expired', 'error')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(team_id, platform) -- Uma conexão pro plataforma por time (regra geral temporária)
);

-- 3. Histórico de Análises de IA (ai_insights_history)
create table if not exists public.ai_insights_history (
  id uuid default uuid_generate_v4() primary key,
  team_id uuid references public.teams(id) on delete cascade not null,
  platform text not null,
  insight_type text not null check (insight_type in ('growth', 'drop', 'viral', 'suggestion')),
  title text not null,
  description text not null,
  actionable_step text,
  metrics_snapshot jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- ----------------------------------------------------------------------------------
-- PARTE 2: RLS (ROW LEVEL SECURITY)
-- ----------------------------------------------------------------------------------

-- SUBSCRIPTIONS
alter table public.subscriptions enable row level security;
drop policy if exists "Users can view own subscription" on public.subscriptions;
create policy "Users can view own subscription" 
on public.subscriptions for select 
using (auth.uid() = user_id);
-- (Apenas superadmin/webhooks do Stripe podem fazer insert/update nesta tabela na vida real)

-- API CONNECTIONS
alter table public.api_connections enable row level security;
drop policy if exists "Team members can view api connections" on public.api_connections;
create policy "Team members can view api connections" 
on public.api_connections for select 
using (
  team_id in (select team_id from public.team_members where user_id = auth.uid())
  or team_id in (select id from public.teams where owner_id = auth.uid())
);

drop policy if exists "Only admins can manage api connections" on public.api_connections;
create policy "Only admins can manage api connections" 
on public.api_connections for all 
using (
  team_id in (select id from public.teams where owner_id = auth.uid())
  or (select role from public.team_members where team_id = public.api_connections.team_id and user_id = auth.uid() limit 1) = 'admin'
);

-- AI INSIGHTS
alter table public.ai_insights_history enable row level security;
drop policy if exists "Team members can view insights" on public.ai_insights_history;
create policy "Team members can view insights" 
on public.ai_insights_history for select 
using (
  team_id in (select team_id from public.team_members where user_id = auth.uid())
  or team_id in (select id from public.teams where owner_id = auth.uid())
);
