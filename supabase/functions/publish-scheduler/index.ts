// Supabase Edge Function: publish-scheduler
// Rodado via Cron para identificar posts agendados e disparar a publicação nas redes sociais.

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
    const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";

    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error("Missing Supabase env vars");
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // 1. Buscar posts agendados para agora ou no passado que ainda não foram publicados
    const { data: posts, error: postsError } = await supabase
      .from("content_posts")
      .select("*, social_accounts(*)")
      .eq("status", "scheduled")
      .lte("scheduled_at", new Date().toISOString());

    if (postsError) throw postsError;
    if (!posts || posts.length === 0) {
      return new Response(JSON.stringify({ success: true, message: "No posts to publish." }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    const results = [];

    // 2. Processar cada post
    for (const post of posts) {
      try {
        const account = post.social_accounts;
        if (!account) {
          throw new Error("Social account not found for this post.");
        }

        let publishResult = { success: false, externalId: null, error: "Platform not supported yet" };

        // ADAPTERS LOGIC
        if (post.platform === "facebook") {
          publishResult = await publishToFacebook(post, account);
        } else if (post.platform === "instagram") {
          publishResult = await publishToInstagram(post, account);
        }

        if (publishResult.success) {
          // 3. Sucesso: Atualizar status
          await supabase.from("content_posts").update({
            status: "published",
            published_at: new Date().toISOString(),
            external_post_id: publishResult.externalId,
            error_log: null
          }).eq("id", post.id);
          results.push({ id: post.id, status: "published" });
        } else {
          // 4. Falha: Atualizar erro
          await supabase.from("content_posts").update({
            status: "failed",
            error_log: publishResult.error
          }).eq("id", post.id);
          results.push({ id: post.id, status: "failed", error: publishResult.error });
        }

      } catch (err: any) {
        console.error(`Error processing post ${post.id}:`, err);
        results.push({ id: post.id, status: "error", error: err.message });
      }
    }

    return new Response(JSON.stringify({ success: true, results }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });

  } catch (err: any) {
    return new Response(JSON.stringify({ success: false, error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  }
});

// --- Facebook Publisher Adapter ---
async function publishToFacebook(post: any, account: any) {
  const token = account.access_token;
  const pageId = account.platform_user_id;
  const message = post.content;
  const mediaUrl = post.media_urls?.[0];

  let url = `https://graph.facebook.com/v19.0/${pageId}/feed`;
  let body: any = { message, access_token: token };

  if (mediaUrl) {
    url = `https://graph.facebook.com/v19.0/${pageId}/photos`;
    body = { ...body, url: mediaUrl };
  }

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });

  const data = await res.json();
  if (res.ok) {
    return { success: true, externalId: data.id || data.post_id };
  } else {
    return { success: false, error: data.error?.message || "FB Publish Error" };
  }
}

// --- Instagram Publisher Adapter ---
async function publishToInstagram(post: any, account: any) {
  const token = account.access_token;
  const igBusinessId = account.platform_user_id;
  const caption = post.content;
  const imageUrl = post.media_urls?.[0];

  if (!imageUrl) {
    return { success: false, error: "Instagram requires an image URL." };
  }

  // Step 1: Create Container
  const containerRes = await fetch(`https://graph.facebook.com/v19.0/${igBusinessId}/media?image_url=${encodeURIComponent(imageUrl)}&caption=${encodeURIComponent(caption)}&access_token=${token}`, {
    method: "POST"
  });
  
  const containerData = await containerRes.json();
  if (!containerRes.ok) return { success: false, error: containerData.error?.message || "IG Container Error" };

  const creationId = containerData.id;

  // Step 2: Publish Container
  const publishRes = await fetch(`https://graph.facebook.com/v19.0/${igBusinessId}/media_publish?creation_id=${creationId}&access_token=${token}`, {
    method: "POST"
  });

  const publishData = await publishRes.json();
  if (publishRes.ok) {
    return { success: true, externalId: publishData.id };
  } else {
    return { success: false, error: publishData.error?.message || "IG Publish Error" };
  }
}
