import { useAuth } from "@/contexts/AuthContext";
import { BRANDING_CONFIG, Branding } from "@/config/branding";

export function useBranding(): Branding {
  const { user } = useAuth();
  
  // Lógica de seleção:
  // 1. Se for o e-mail do Conventinho, força Conventinho
  // 2. Poderia ser por domínio (window.location.hostname)
  // 3. Por enquanto, se tiver 'conventinho' no email ou for o dehon, usa conventinho
  
  const isConventinho = user?.email?.toLowerCase().includes('conventinho') || 
                        user?.email?.toLowerCase() === 'comunicacao@conventinho.org.br';

  if (isConventinho) {
    return BRANDING_CONFIG.conventinho;
  }

  // Futuramente o usuário pode passar um ?id=empresa_x na URL para o sistema de gestão
  const urlParams = new URLSearchParams(window.location.search);
  const tenantId = urlParams.get('tenant_id');
  
  if (tenantId && BRANDING_CONFIG[tenantId]) {
    return BRANDING_CONFIG[tenantId];
  }

  return BRANDING_CONFIG.default;
}
