-- Tabela: content_posts
-- Armazena o planejamento de postagens para redes sociais.

DO $$ BEGIN
    CREATE TYPE post_status AS ENUM ('draft', 'review', 'approved', 'scheduled', 'published', 'failed');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE social_platform AS ENUM ('instagram', 'facebook', 'youtube', 'x', 'linkedin');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

CREATE TABLE IF NOT EXISTS content_posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  media_urls TEXT[] DEFAULT '{}', -- URLs do Supabase Storage
  platform social_platform NOT NULL,
  status post_status DEFAULT 'draft',
  scheduled_at TIMESTAMPTZ,
  published_at TIMESTAMPTZ,
  external_post_id TEXT,
  error_log TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS (Row Level Security)
ALTER TABLE content_posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own posts"
  ON content_posts FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own posts"
  ON content_posts FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own posts"
  ON content_posts FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own posts"
  ON content_posts FOR DELETE
  USING (auth.uid() = user_id);

-- Indices
CREATE INDEX IF NOT EXISTS idx_content_posts_user ON content_posts(user_id);
CREATE INDEX IF NOT EXISTS idx_content_posts_status_date ON content_posts(status, scheduled_at);

-- Trigger para atualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_content_posts_updated_at
    BEFORE UPDATE ON content_posts
    FOR EACH ROW
    EXECUTE PROCEDURE update_updated_at_column();

-- Inicialização do Bucket de Storage (Content)
-- Nota: Isso requer permissões de admin no storage.
INSERT INTO storage.buckets (id, name, public)
VALUES ('content', 'content', true)
ON CONFLICT (id) DO NOTHING;

-- Policies para o Storage
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING ( bucket_id = 'content' );

CREATE POLICY "Authenticated Users can upload media"
ON storage.objects FOR INSERT
WITH CHECK ( bucket_id = 'content' AND auth.role() = 'authenticated' );

CREATE POLICY "Users can update their own media"
ON storage.objects FOR UPDATE
USING ( bucket_id = 'content' AND auth.uid() = owner );

CREATE POLICY "Users can delete their own media"
ON storage.objects FOR DELETE
USING ( bucket_id = 'content' AND auth.uid() = owner );
