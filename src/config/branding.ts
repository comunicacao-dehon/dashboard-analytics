export interface Branding {
  id: string;
  name: string;
  logo: string;
  sidebarLogo: string;
  primaryColor?: string;
  welcomeMessage?: string;
  motto?: string;
  footerText?: string;
}

export const BRANDING_CONFIG: Record<string, Branding> = {
  default: {
    id: "utxica",
    name: "Utxica",
    logo: "/logo1.png",
    sidebarLogo: "/logo.png",
    welcomeMessage: "Entrar No Painel",
    footerText: "Painel Utxica · Analytics Dashboard",
  },
  conventinho: {
    id: "conventinho",
    name: "Utxica",
    logo: "/logo1.png",
    sidebarLogo: "/logo.png",
    motto: "“Tudo por Ele, tudo com Ele, tudo n’Ele.”",
    welcomeMessage: "Entrar No Painel",
    footerText: "Painel Utxica · Conventinho SCJ",
  },
  // Exemplo de uma nova empresa (Empresa X)
  empresa_x: {
    id: "empresa_x",
    name: "Gestão Pro",
    logo: "/logo_cliente.png", // O usuário precisará subir este arquivo
    sidebarLogo: "/logo_cliente.png",
    welcomeMessage: "Acessar Sistema",
    footerText: "Gestão Pro · Integrado",
  }
};
