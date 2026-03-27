-- Tabela: social_accounts
-- Armazena as contas de redes sociais vinculadas por cada usuario.
-- Execute esse SQL no Supabase > SQL Editor

CREATE TABLE IF NOT EXISTS social_accounts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  platform TEXT NOT NULL CHECK (platform IN ('instagram', 'facebook', 'youtube')),
  platform_user_id TEXT NOT NULL,
  username TEXT NOT NULL,
  display_name TEXT NOT NULL DEFAULT '',
  profile_picture_url TEXT DEFAULT '',
  access_token TEXT NOT NULL,
  refresh_token TEXT DEFAULT '',
  token_expires_at TIMESTAMPTZ,
  connected_at TIMESTAMPTZ DEFAULT NOW(),
  is_active BOOLEAN DEFAULT TRUE,
  
  -- Cada usuario so pode ter uma conta ativa por plataforma
  UNIQUE(user_id, platform)
);

-- RLS (Row Level Security)
-- Cada usuario so pode ver e gerenciar suas proprias contas.

ALTER TABLE social_accounts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own accounts"
  ON social_accounts FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own accounts"
  ON social_accounts FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own accounts"
  ON social_accounts FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own accounts"
  ON social_accounts FOR DELETE
  USING (auth.uid() = user_id);

-- Indices

CREATE INDEX idx_social_accounts_user ON social_accounts(user_id);
CREATE INDEX idx_social_accounts_platform ON social_accounts(user_id, platform);
