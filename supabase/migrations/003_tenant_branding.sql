-- migration: 003_tenant_branding.sql
-- Tabela para armazenar as configurações de marca personalizadas por tenant/usuário.

CREATE TABLE IF NOT EXISTS public.tenant_branding (
    tenant_id TEXT PRIMARY KEY, -- Usamos o stableUserId como identificador do tenant
    name TEXT NOT NULL,
    motto TEXT,
    welcome_message TEXT,
    footer_text TEXT,
    primary_color TEXT DEFAULT '#8B0000',
    logo_url TEXT,
    sidebar_logo_url TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Ativar RLS (Row Level Security)
ALTER TABLE public.tenant_branding ENABLE ROW LEVEL SECURITY;

-- Políticas de acesso
CREATE POLICY "Anyone can view branding" 
ON public.tenant_branding FOR SELECT 
USING (true);

CREATE POLICY "Users can upsert own branding" 
ON public.tenant_branding FOR ALL 
USING (true)
WITH CHECK (true);
