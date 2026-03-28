// ─── OAuth Helper ───────────────────────────────────────────────────────────
// Funções para iniciar o fluxo OAuth com Meta (Instagram/Facebook) e Google (YouTube).

import type { SocialPlatform } from "@/types/social";

// ─── Configuração ───────────────────────────────────────────────────────────

const META_APP_ID = import.meta.env.VITE_META_APP_ID || "";
const META_REDIRECT_URI = import.meta.env.VITE_META_REDIRECT_URI || `${window.location.origin}/auth/callback/meta`;
const META_CONFIG_ID = import.meta.env.VITE_META_CONFIG_ID || "1457406572795983";

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || "";
const GOOGLE_REDIRECT_URI = import.meta.env.VITE_GOOGLE_REDIRECT_URI || `${window.location.origin}/auth/callback/google`;

// ─── URLs de Autorização ────────────────────────────────────────────────────

// As permissões do Meta agora são definidas DIRETAMENTE na Configuração do Login (no painel Meta)
// Portanto, não usamos mais o parâmetro 'scope' manual no frontend, e sim o 'config_id'.

// Permissões necessárias para o YouTube Data API
const GOOGLE_SCOPES = [
  "https://www.googleapis.com/auth/youtube.readonly",
  "https://www.googleapis.com/auth/yt-analytics.readonly",
].join(" ");

// ─── Iniciar OAuth ──────────────────────────────────────────────────────────

export function startMetaOAuth() {
  const state = generateRandomState();
  sessionStorage.setItem("oauth_state", state);
  sessionStorage.setItem("oauth_platform", "meta");

  const authUrl = new URL("https://www.facebook.com/v19.0/dialog/oauth");
  authUrl.searchParams.set("client_id", META_APP_ID);
  authUrl.searchParams.set("redirect_uri", META_REDIRECT_URI);
  authUrl.searchParams.set("config_id", META_CONFIG_ID);
  authUrl.searchParams.set("response_type", "code");
  authUrl.searchParams.set("state", state);

  window.location.href = authUrl.toString();
}

export function startGoogleOAuth() {
  const state = generateRandomState();
  sessionStorage.setItem("oauth_state", state);
  sessionStorage.setItem("oauth_platform", "google");

  const authUrl = new URL("https://accounts.google.com/o/oauth2/v2/auth");
  authUrl.searchParams.set("client_id", GOOGLE_CLIENT_ID);
  authUrl.searchParams.set("redirect_uri", GOOGLE_REDIRECT_URI);
  authUrl.searchParams.set("scope", GOOGLE_SCOPES);
  authUrl.searchParams.set("response_type", "code");
  authUrl.searchParams.set("access_type", "offline");
  authUrl.searchParams.set("prompt", "consent");
  authUrl.searchParams.set("state", state);

  window.location.href = authUrl.toString();
}

// Função genérica para iniciar OAuth por plataforma
export function startOAuth(platform: SocialPlatform) {
  switch (platform) {
    case "instagram":
    case "facebook":
      startMetaOAuth();
      break;
    case "youtube":
      startGoogleOAuth();
      break;
  }
}

// ─── Validação de State (proteção contra CSRF) ──────────────────────────────

export function validateOAuthState(returnedState: string): boolean {
  const savedState = sessionStorage.getItem("oauth_state");
  sessionStorage.removeItem("oauth_state");
  return savedState === returnedState;
}

export function getOAuthPlatform(): string | null {
  const platform = sessionStorage.getItem("oauth_platform");
  sessionStorage.removeItem("oauth_platform");
  return platform;
}

// ─── Helpers ────────────────────────────────────────────────────────────────

function generateRandomState(): string {
  const array = new Uint8Array(16);
  crypto.getRandomValues(array);
  return Array.from(array, (b) => b.toString(16).padStart(2, "0")).join("");
}
