-- migration: 003_tenant_branding_v2.sql
-- Script completo para configurar a tabela de branding White Label.
-- Este script pode ser rodado várias vezes sem causar erros.

-- 1. Criar a tabela se não existir
CREATE TABLE IF NOT EXISTS public.tenant_branding (
    tenant_id TEXT PRIMARY KEY, 
    name TEXT NOT NULL,
    motto TEXT,
    welcome_message TEXT,
    footer_text TEXT,
    primary_color TEXT DEFAULT '#8B0000',
    logo_url TEXT,
    sidebar_logo_url TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Habilitar RLS (Row Level Security)
ALTER TABLE public.tenant_branding ENABLE ROW LEVEL SECURITY;

-- 3. Remover políticas antigas para evitar erros de "já existe" ao re-rodar
DROP POLICY IF EXISTS "Anyone can view branding" ON public.tenant_branding;
DROP POLICY IF EXISTS "Users can upsert own branding" ON public.tenant_branding;

-- 4. Criar as novas políticas
CREATE POLICY "Anyone can view branding" 
ON public.tenant_branding FOR SELECT 
USING (true);

CREATE POLICY "Users can upsert own branding" 
ON public.tenant_branding FOR ALL 
USING (true)
WITH CHECK (true);
