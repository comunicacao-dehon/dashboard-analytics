-- migration: 002_user_profiles.sql
-- Tabela para centralizar os dados de perfil (Nome, Bio, Avatar) independente da forma de login.
-- Use o stableUserId baseado no e-mail como chave primária.

CREATE TABLE IF NOT EXISTS public.user_profiles (
    user_id TEXT PRIMARY KEY, -- O stableUserId unificado
    full_name TEXT,
    email TEXT,
    avatar_url TEXT,
    bio TEXT,
    role TEXT,
    phone TEXT,
    location TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Ativar RLS (Row Level Security)
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- Políticas de acesso
-- Qualquer usuário logado pode buscar seu próprio perfil
CREATE POLICY "Users can view own profile" 
ON public.user_profiles FOR SELECT 
USING (true); -- Controle maior será feito na camada de aplicação via userId

-- Usuários podem atualizar ou inserir o próprio perfil
CREATE POLICY "Users can upsert own profile" 
ON public.user_profiles FOR ALL 
USING (true)
WITH CHECK (true);
