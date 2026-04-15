import React, { createContext, useContext, useState, useEffect } from "react";
import { Branding, BRANDING_CONFIG } from "@/config/branding";
import { brandingService } from "@/services/brandingService";
import { useStableUserId } from "@/hooks/useStableUserId";

interface BrandingContextType {
  branding: Branding;
  loading: boolean;
  refreshBranding: () => Promise<void>;
}

const BrandingContext = createContext<BrandingContextType | undefined>(undefined);

export function BrandingProvider({ children }: { children: React.ReactNode }) {
  const stableUserId = useStableUserId();
  const [branding, setBranding] = useState<Branding>(BRANDING_CONFIG.default);
  const [loading, setLoading] = useState(true);

  const loadBranding = async () => {
    if (!stableUserId) {
      setLoading(false);
      return;
    }

    try {
      // 1. Tenta carregar do banco de dados
      const dbBranding = await brandingService.getBranding(stableUserId);
      
      if (dbBranding) {
        setBranding(dbBranding);
        applyThemeColor(dbBranding.primaryColor || "#8B0000");
      } else {
        // 2. Fallback para estático dependendo do contexto (se necessário)
        const isConventinho = stableUserId.includes('Y29t') || stableUserId.includes('Y29t'); // Exemplo simplificado
        const fallback = BRANDING_CONFIG.conventinho;
        setBranding(fallback);
        applyThemeColor(fallback.primaryColor || "#8B0000");
      }
    } catch (error) {
      console.error("Error loading branding:", error);
    } finally {
      setLoading(false);
    }
  };

  const applyThemeColor = (color: string) => {
    // Aplica a cor primária como uma variável CSS global (Hex)
    document.documentElement.style.setProperty('--primary', color);
    document.documentElement.style.setProperty('--sidebar-primary', color);
    document.documentElement.style.setProperty('--sidebar-accent', `${color}10`); // 10% opacity hex
    
    // Converte Hex para RGB para suportar opacidade no Tailwind (ex: bg-primary/20)
    if (color.startsWith('#')) {
      try {
        const hex = color.replace('#', '');
        const r = parseInt(hex.substring(0, 2), 16);
        const g = parseInt(hex.substring(2, 4), 16);
        const b = parseInt(hex.substring(4, 6), 16);
        
        if (!isNaN(r) && !isNaN(g) && !isNaN(b)) {
          document.documentElement.style.setProperty('--primary-rgb', `${r}, ${g}, ${b}`);
          // Também injeta uma cor de superfície sutil
          document.documentElement.style.setProperty('--primary-surface', `rgba(${r}, ${g}, ${b}, 0.08)`);
        }
      } catch (e) {
        console.error("Erro ao converter cor para RGB", e);
      }
    }

    // Variáveis auxiliares de contraste
    document.documentElement.style.setProperty('--primary-foreground', '#ffffff');
    document.documentElement.style.setProperty('--sidebar-primary-foreground', '#ffffff');
    document.documentElement.style.setProperty('--sidebar-accent-foreground', color);
  };

  useEffect(() => {
    loadBranding();
  }, [stableUserId]);

  return (
    <BrandingContext.Provider value={{ branding, loading, refreshBranding: loadBranding }}>
      {children}
    </BrandingContext.Provider>
  );
}

export function useBrandingContext() {
  const context = useContext(BrandingContext);
  if (context === undefined) {
    throw new Error("useBrandingContext must be used within a BrandingProvider");
  }
  return context;
}
