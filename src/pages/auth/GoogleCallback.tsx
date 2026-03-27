import { useEffect, useState } from "react";
import { useLocation, useSearch } from "wouter";
import { Loader2, CheckCircle2, XCircle } from "lucide-react";
import { motion } from "framer-motion";
import { validateOAuthState } from "@/lib/oauth";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

// ─── Google OAuth Callback (YouTube) ────────────────────────────────────────
// Essa página recebe o ?code= e o ?state= que o Google retorna após autorizar.

export default function GoogleCallback() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const search = useSearch();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("Conectando com o Google...");

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

      if (!code || !state) {
        setStatus("error");
        setMessage("Parâmetros inválidos. Tente novamente.");
        return;
      }

      if (!validateOAuthState(state)) {
        setStatus("error");
        setMessage("Erro de segurança. Tente novamente.");
        return;
      }

      try {
        // ─── IMPORTANTE ─────────────────────────────────────────────────
        // Em produção, essa troca deve ser feita no BACKEND, pois precisa
        // do Client Secret do Google.
        //
        // O fluxo completo seria:
        // 1. Frontend envia o `code` para o backend
        // 2. Backend troca o `code` pelo `access_token` usando Client Secret
        // 3. Backend busca o canal do YouTube com a YouTube Data API v3
        // 4. Backend salva no Supabase e retorna os dados
        // ─────────────────────────────────────────────────────────────────

        setMessage("Trocando código de autorização pelo token de acesso...");

        // TODO: Descomentar quando o backend estiver configurado:
        // const response = await fetch("/api/auth/google/exchange", {
        //   method: "POST",
        //   headers: { "Content-Type": "application/json" },
        //   body: JSON.stringify({ code, userId: user?.id })
        // });
        // const data = await response.json();

        setStatus("success");
        setMessage("Código de autorização recebido! Para concluir, configure a Edge Function no Supabase para trocar o código pelo token de acesso.");
        toast.success("Código OAuth do Google recebido com sucesso!");

        setTimeout(() => setLocation("/dashboard"), 4000);

      } catch (err) {
        console.error("Google callback error:", err);
        setStatus("error");
        setMessage("Erro ao processar a autorização. Tente novamente.");
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
            <p className="text-sm text-white/50">{message}</p>
            <p className="text-xs text-white/30 mt-4">Redirecionando automaticamente...</p>
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
