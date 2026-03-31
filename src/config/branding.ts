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
  gestao: {
    id: "gestao",
    name: "Sistema Gestor",
    logo: "/logo.png",
    sidebarLogo: "/logo.png",
    welcomeMessage: "Acessar Analytics",
    footerText: "Analytics Integrado · Gestão Pro",
  },
  acme: {
    id: "acme",
    name: "Acme Analytics",
    logo: "/logo1.png",
    sidebarLogo: "/logo.png",
    welcomeMessage: "Client Dashboard",
    footerText: "Acme Corp · Powered by Utxica",
  }
};
