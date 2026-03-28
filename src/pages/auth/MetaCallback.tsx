import { useEffect, useState } from "react";
import { useLocation, useSearch } from "wouter";
import { Loader2, CheckCircle2, XCircle, Instagram, Facebook } from "lucide-react";
import { motion } from "framer-motion";
import { validateOAuthState } from "@/lib/oauth";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

// ─── Tipos ───────────────────────────────────────────────────────────────────

interface InstagramProfile {
  id: string;
  username: string;
  name: string;
  profilePicture: string;
  followers: number;
  posts: number;
}

interface FacebookProfile {
  id: string;
  name: string;
  picture: string;
}

// ─── Meta OAuth Callback ─────────────────────────────────────────────────────

export default function MetaCallback() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const search = useSearch();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("Conectando com o Meta...");
  const [instagram, setInstagram] = useState<InstagramProfile | null>(null);
  const [facebook, setFacebook] = useState<FacebookProfile | null>(null);

  useEffect(() => {
    async function handleCallback() {
      const params = new URLSearchParams(search);
      const code = params.get("code");
      const state = params.get("state");
      const error = params.get("error");

      if (error) {
        setStatus("error");
        setMessage("Permissão negada. Você cancelou a autorização.");
        return;
      }

      if (!code) {
        setStatus("error");
        setMessage("Código de autorização não encontrado. Tente novamente.");
        return;
      }

      // Validar state (aviso apenas, não bloqueia - Business Login pode não retornar state)
      if (state && !validateOAuthState(state)) {
        console.warn("OAuth state mismatch - continuando mesmo assim (Business Login).");
      }

      if (!user) {
        setStatus("error");
        setMessage("Você precisa estar logado para vincular uma conta.");
        return;
      }

      try {
        setMessage("Trocando código de autorização...");

        const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
        const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;
        const redirectUri = import.meta.env.VITE_META_REDIRECT_URI ||
          `${window.location.origin}/auth/callback/meta`;

        const res = await fetch(`${SUPABASE_URL}/functions/v1/meta-exchange`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${SUPABASE_ANON_KEY}`,
          },
          body: JSON.stringify({
            code,
            redirectUri,
            userId: user.id,
          }),
        });

        const data = await res.json();

        if (!res.ok || !data.success) {
          throw new Error(data.error || "Erro ao processar autorização.");
        }

        // Salvar dados no estado para exibir na tela de sucesso
        if (data.instagram) setInstagram(data.instagram);
        if (data.facebook) setFacebook(data.facebook);

        setStatus("success");
        setMessage(
          data.instagram
            ? `Instagram @${data.instagram.username} conectado com sucesso!`
            : `Facebook conectado com sucesso!`
        );
        toast.success("Conta vinculada com sucesso! 🎉");

        // Redirecionar após 4 segundos
        setTimeout(() => setLocation("/dashboard"), 4000);

      } catch (err: any) {
        console.error("Meta callback error:", err);
        setStatus("error");
        setMessage(err.message || "Erro ao processar a autorização. Tente novamente.");
      }
    }

    handleCallback();
  }, [search, user, setLocation]);

  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center font-['Outfit'] p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-dark border border-white/10 rounded-3xl p-12 max-w-md w-full text-center"
      >
        {status === "loading" && (
          <>
            <Loader2 className="w-12 h-12 text-amber-500 animate-spin mx-auto mb-6" />
            <h2 className="text-xl font-bold text-white mb-2">Conectando...</h2>
            <p className="text-sm text-white/50">{message}</p>
          </>
        )}

        {status === "success" && (
          <>
            <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-8 h-8 text-emerald-400" />
            </div>
            <h2 className="text-xl font-bold text-white mb-2">Conectado!</h2>
            <p className="text-sm text-white/50 mb-6">{message}</p>

            {/* Perfil do Instagram */}
            {instagram && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white/5 border border-white/10 rounded-2xl p-4 mb-4 flex items-center gap-4 text-left"
              >
                {instagram.profilePicture ? (
                  <img
                    src={instagram.profilePicture}
                    alt={instagram.username}
                    className="w-14 h-14 rounded-full object-cover border-2 border-pink-500/40"
                  />
                ) : (
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center">
                    <Instagram className="w-7 h-7 text-white" />
                  </div>
                )}
                <div>
                  <div className="flex items-center gap-2 mb-0.5">
                    <Instagram className="w-4 h-4 text-pink-400" />
                    <span className="text-xs text-pink-400 font-semibold uppercase tracking-wide">Instagram</span>
                  </div>
                  <p className="text-white font-bold">@{instagram.username}</p>
                  <p className="text-white/40 text-xs">{instagram.name}</p>
                  <div className="flex gap-3 mt-2">
                    <span className="text-xs text-white/60">
                      <span className="text-white font-semibold">{instagram.followers.toLocaleString("pt-BR")}</span> seguidores
                    </span>
                    <span className="text-xs text-white/60">
                      <span className="text-white font-semibold">{instagram.posts.toLocaleString("pt-BR")}</span> posts
                    </span>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Perfil do Facebook */}
            {facebook && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white/5 border border-white/10 rounded-2xl p-4 mb-4 flex items-center gap-4 text-left"
              >
                {facebook.picture ? (
                  <img
                    src={facebook.picture}
                    alt={facebook.name}
                    className="w-14 h-14 rounded-full object-cover border-2 border-blue-500/40"
                  />
                ) : (
                  <div className="w-14 h-14 rounded-full bg-blue-600 flex items-center justify-center">
                    <Facebook className="w-7 h-7 text-white" />
                  </div>
                )}
                <div>
                  <div className="flex items-center gap-2 mb-0.5">
                    <Facebook className="w-4 h-4 text-blue-400" />
                    <span className="text-xs text-blue-400 font-semibold uppercase tracking-wide">Facebook</span>
                  </div>
                  <p className="text-white font-bold">{facebook.name}</p>
                </div>
              </motion.div>
            )}

            <p className="text-xs text-white/30 mt-2">Redirecionando para o painel...</p>
          </>
        )}

        {status === "error" && (
          <>
            <div className="w-16 h-16 rounded-2xl bg-red-500/20 flex items-center justify-center mx-auto mb-6">
              <XCircle className="w-8 h-8 text-red-400" />
            </div>
            <h2 className="text-xl font-bold text-white mb-2">Erro na Conexão</h2>
            <p className="text-sm text-white/50 mb-6">{message}</p>
            <button
              onClick={() => setLocation("/dashboard")}
              className="text-sm text-amber-500 hover:text-amber-400 transition-colors font-bold"
            >
              Voltar ao Painel →
            </button>
          </>
        )}
      </motion.div>
    </div>
  );
}
