-- ==========================================
-- GESTÃO DE EQUIPES E PERMISSÕES
-- Executar este script no SQL Editor do Supabase
-- ==========================================

create extension if not exists "uuid-ossp";

-- 1. Tabela de Equipes (teams)
create table if not exists public.teams (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  owner_id uuid references public.profiles(id) on delete cascade not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.teams enable row level security;

-- Dono da equipe tem acesso total
drop policy if exists "Team owners have full access" on public.teams;
create policy "Team owners have full access" 
on public.teams for all 
using (auth.uid() = owner_id);

-- Membros podem visualizar a equipe
drop policy if exists "Team members can view team" on public.teams;
create policy "Team members can view team" 
on public.teams for select 
using (
  exists (
    select 1 from public.team_members 
    where team_members.team_id = teams.id 
    and team_members.user_id = auth.uid()
  )
);


-- 2. Tabela de Membros da Equipe (team_members)
create table if not exists public.team_members (
  id uuid default uuid_generate_v4() primary key,
  team_id uuid references public.teams(id) on delete cascade not null,
  user_id uuid references public.profiles(id) on delete cascade not null,
  role text not null check (role in ('admin', 'editor', 'viewer')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(team_id, user_id) -- Um usuário não pode estar duas vezes na mesma equipe
);

alter table public.team_members enable row level security;

-- Membros podem ver todos os outros membros da mesma equipe
drop policy if exists "Members can view their team members" on public.team_members;
create policy "Members can view their team members" 
on public.team_members for select 
using (
  team_id in (
    select team_id from public.team_members where user_id = auth.uid()
  )
  or
  team_id in (
    select id from public.teams where owner_id = auth.uid()
  )
);

-- Apenas Admins ou Dono podem modificar os membros
drop policy if exists "Only admins or owners can modify members" on public.team_members;
create policy "Only admins or owners can modify members" 
on public.team_members for all 
using (
  team_id in (
    select id from public.teams where owner_id = auth.uid()
  )
  or
  (
    select role from public.team_members 
    where team_id = public.team_members.team_id and user_id = auth.uid() limit 1
  ) = 'admin'
);


-- 3. Tabela de Convites (invitations)
create table if not exists public.invitations (
  id uuid default uuid_generate_v4() primary key,
  team_id uuid references public.teams(id) on delete cascade not null,
  email text not null,
  role text not null check (role in ('admin', 'editor', 'viewer')),
  status text not null default 'pending' check (status in ('pending', 'accepted', 'rejected')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.invitations enable row level security;

-- Todos da equipe podem ver os convites da sua equipe
drop policy if exists "Team members can view invitations" on public.invitations;
create policy "Team members can view invitations" 
on public.invitations for select 
using (
  team_id in (
    select team_id from public.team_members where user_id = auth.uid()
  )
  or
  team_id in (
    select id from public.teams where owner_id = auth.uid()
  )
);

-- Apenas admins ou donos podem enviar/deletar convites
drop policy if exists "Only admins can manage invitations" on public.invitations;
create policy "Only admins can manage invitations" 
on public.invitations for all 
using (
  team_id in (
    select id from public.teams where owner_id = auth.uid()
  )
  or
  (
    select role from public.team_members 
    where team_id = public.invitations.team_id and user_id = auth.uid() limit 1
  ) = 'admin'
);


-- 4. Função Automática (Trigger)
-- Quando um usuário cria uma conta e já tem um convite válido, podemos adicioná-lo automaticamente
-- Ou o backend (teamService) pode lidar com a aceitação. Para este projeto, manteremos no frontend 
-- (usuário loga, vê convites pro email dele, aceita e vira membro).
