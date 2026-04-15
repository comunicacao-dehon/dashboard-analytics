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
    id: "conventinho",
    name: "Comunicação Conventinho",
    logo: "logo.png",
    sidebarLogo: "logo.png",
    welcomeMessage: "Entrar No Painel",
    footerText: "Painel de Análise · Conventinho SCJ",
  },
  conventinho: {
    id: "conventinho",
    name: "Comunicação Conventinho",
    logo: "logo.png",
    sidebarLogo: "logo.png",
    primaryColor: "#8B0000",
    motto: "“Tudo por Ele, tudo com Ele, tudo n’Ele.”",
    welcomeMessage: "Entrar No Painel",
    footerText: "Dashboard Analytics · Conventinho SCJ",
  },
  gestao: {
    id: "gestao",
    name: "Sistema Gestor",
    logo: "logo.png",
    sidebarLogo: "logo.png",
    welcomeMessage: "Acessar Analytics",
    footerText: "Analytics Integrado · Gestão Pro",
  },
  acme: {
    id: "acme",
    name: "Acme Analytics",
    logo: "logo1.png",
    sidebarLogo: "logo.png",
    welcomeMessage: "Client Dashboard",
    footerText: "Dashboard Analytics · Conventinho SCJ",
  }
};
