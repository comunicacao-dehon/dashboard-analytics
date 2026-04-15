/**
 * Hook que retorna o ID estável do usuário para consultas no Supabase.
 * Garante consistência entre o MetaCallback (que salva) e as páginas (que buscam).
 * Para usuários PHP SSO, gera um ID determinístico baseado no email.
 */
import { useAuth } from "@/contexts/AuthContext";

export function useStableUserId(): string | null {
  const { user } = useAuth();
  if (!user || !user.email) return null;

  // Unificado: Sempre usa o e-mail para garantir consistência entre dispositivos e formas de login
  return `u-${btoa(user.email.toLowerCase()).replace(/=/g, "")}`;
}
