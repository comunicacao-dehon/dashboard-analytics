// Supabase Edge Function: meta-exchange
// Recebe o ?code= do OAuth e troca pelo access_token + dados do perfil.
// Depois salva na tabela social_accounts.

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { code, redirectUri, userId } = await req.json();

    if (!code || !redirectUri || !userId) {
      return new Response(
        JSON.stringify({ error: "Parâmetros obrigatórios: code, redirectUri, userId" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const META_APP_ID = Deno.env.get("META_APP_ID") ?? "";
    const META_APP_SECRET = Deno.env.get("META_APP_SECRET") ?? "";

    if (!META_APP_ID || !META_APP_SECRET) {
      return new Response(
        JSON.stringify({ error: "Configuração do servidor incompleta." }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // 1. Trocar o code pelo access_token (short-lived)
    const tokenRes = await fetch(
      `https://graph.facebook.com/v19.0/oauth/access_token?client_id=${META_APP_ID}&client_secret=${META_APP_SECRET}&redirect_uri=${encodeURIComponent(redirectUri)}&code=${code}`
    );
    const tokenData = await tokenRes.json();

    if (tokenData.error) {
      console.error("Token exchange error:", tokenData.error);
      return new Response(
        JSON.stringify({ error: tokenData.error.message }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const shortLivedToken = tokenData.access_token;

    // 2. Converter para long-lived token (60 dias)
    const longTokenRes = await fetch(
      `https://graph.facebook.com/v19.0/oauth/access_token?grant_type=fb_exchange_token&client_id=${META_APP_ID}&client_secret=${META_APP_SECRET}&fb_exchange_token=${shortLivedToken}`
    );
    const longTokenData = await longTokenRes.json();
    const accessToken = longTokenData.access_token || shortLivedToken;
    const expiresIn = longTokenData.expires_in; // em segundos

    // 3 & 4. Buscar perfil de usuário (Facebook) e páginas do usuário em paralelo
    const [meRes, pagesRes] = await Promise.all([
      fetch(`https://graph.facebook.com/v19.0/me?fields=id,name,picture&access_token=${accessToken}`),
      fetch(`https://graph.facebook.com/v19.0/me/accounts?fields=id,name,picture,instagram_business_account&access_token=${accessToken}`)
    ]);

    const meData = await meRes.json();
    const pagesData = await pagesRes.json();
    const pages = pagesData.data || [];

    // 5. Salvar no Supabase
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const tokenExpiresAt = expiresIn
      ? new Date(Date.now() + expiresIn * 1000).toISOString()
      : null;

    // Salvar conta do Facebook
    const firstPage = pages[0];
    const fbPlatformId = firstPage?.id || meData.id;
    const fbUsername = firstPage?.name || meData.name;
    const fbPicture = firstPage?.picture?.data?.url || meData.picture?.data?.url || "";

    console.log("Upserting Facebook account for user:", userId);
    const { error: fbError } = await supabase.from("social_accounts").upsert({
      user_id: userId,
      platform: "facebook",
      platform_user_id: fbPlatformId,
      username: fbUsername.toLowerCase().replace(/\s+/g, ""),
      display_name: fbUsername,
      profile_picture_url: fbPicture,
      access_token: accessToken,
      token_expires_at: tokenExpiresAt,
      connected_at: new Date().toISOString(),
      is_active: true,
    }, { onConflict: "user_id,platform" });

    if (fbError) {
      console.error("Facebook upsert error:", fbError);
      throw new Error(`Erro ao salvar Facebook: ${fbError.message}`);
    }

    // Verificar se tem conta de Instagram vinculada
    let instagramAccount = null;
    for (const page of pages) {
      if (page.instagram_business_account) {
        const igId = page.instagram_business_account.id;
        const igRes = await fetch(
          `https://graph.facebook.com/v19.0/${igId}?fields=id,username,name,profile_picture_url,followers_count,media_count&access_token=${accessToken}`
        );
        const igData = await igRes.json();

        if (!igData.error) {
          console.log("Upserting Instagram account:", igData.username);
          const { error: igError } = await supabase.from("social_accounts").upsert({
            user_id: userId,
            platform: "instagram",
            platform_user_id: igId,
            username: igData.username || igData.name,
            display_name: igData.name || igData.username,
            profile_picture_url: igData.profile_picture_url || "",
            access_token: accessToken,
            token_expires_at: tokenExpiresAt,
            connected_at: new Date().toISOString(),
            is_active: true,
          }, { onConflict: "user_id,platform" });

          if (igError) {
            console.error("Instagram upsert error:", igError);
            throw new Error(`Erro ao salvar Instagram: ${igError.message}`);
          }

          instagramAccount = {
            id: igId,
            username: igData.username,
            name: igData.name,
            profilePicture: igData.profile_picture_url || "",
            followers: igData.followers_count || 0,
            posts: igData.media_count || 0,
          };
        }
        break;
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        facebook: {
          id: fbPlatformId,
          name: fbUsername,
          picture: fbPicture,
        },
        instagram: instagramAccount,
        pagesCount: pages.length,
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (err: any) {
    console.error("Edge Function error:", err);
    return new Response(
      JSON.stringify({ error: err.message || "Erro interno" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
