import { createClient } from "@supabase/supabase-js";

export default async function handler(req: any, res: any) {
  // Verificação de Segurança Oficial do Vercel Cron
  // O Vercel injeta automaticamente CRON_SECRET nas variáveis caso a função venha do Edge Scheduler deles
  const authHeader = req.headers['authorization'];
  if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || "";
    const supabaseServiceKey = process.env.VITE_SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY || "";

    if (!supabaseUrl || !supabaseServiceKey) {
      return res.status(500).json({ error: "Supabase Environment Variables are missing." });
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // 1. Buscar constas ativas
    const { data: accounts, error: fetchError } = await supabase
      .from("social_accounts")
      .select("*")
      .eq("is_active", true);

    if (fetchError) throw fetchError;

    if (!accounts || accounts.length === 0) {
      return res.status(200).json({ success: true, message: "Sem contas ativas." });
    }

    // A data dos insights finalizados que chegaram do Facebook (Ontem)
    const yesterdayDate = new Date(Date.now() - 86400000).toISOString().split("T")[0];

    const results = [];

    // 2. Iterar sobre todos e buscar via API
    for (const account of accounts) {
      try {
        let followers = 0;
        let reach = 0;
        let impressions = 0;
        let engagement = 0;
        let views = 0;
        let clicks = 0;

        const token = account.access_token;
        const pid = account.platform_user_id;

        if (account.platform === "facebook") {
          const pageRes = await fetch(`https://graph.facebook.com/v19.0/${pid}?fields=fan_count&access_token=${token}`);
          if (pageRes.ok) followers = (await pageRes.json()).fan_count || 0;

          const insightsRes = await fetch(`https://graph.facebook.com/v19.0/${pid}/insights?metric=page_views_total,page_post_engagements,page_impressions&period=day&date_preset=yesterday&access_token=${token}`);
          if (insightsRes.ok) {
            const iData = await insightsRes.json();
            for (const m of iData.data || []) {
              const val = m.values?.[0]?.value || 0;
              if (m.name === "page_views_total") views = val;
              if (m.name === "page_post_engagements") engagement = val;
              if (m.name === "page_impressions") {
                 impressions = val;
                 reach = Math.floor(val * 0.85); 
              }
            }
          }
        } 
        else if (account.platform === "instagram") {
          const profileRes = await fetch(`https://graph.facebook.com/v19.0/${pid}?fields=followers_count&access_token=${token}`);
          if (profileRes.ok) followers = (await profileRes.json()).followers_count || 0;

          const insightsRes = await fetch(`https://graph.facebook.com/v19.0/${pid}/insights?metric=reach,impressions&period=day&date_preset=yesterday&access_token=${token}`);
          if (insightsRes.ok) {
             const iData = await insightsRes.json();
             for (const m of iData.data || []) {
               const val = m.values?.[0]?.value || 0;
               if (m.name === "reach") reach = val;
               if (m.name === "impressions") {
                 impressions = val;
                 views = val;
               }
             }
          }
        }

        // 3. Upsert into daily_metrics
        const { error: upsertError } = await supabase.from("daily_metrics").upsert({
          account_id: account.id,
          platform: account.platform,
          date: yesterdayDate,
          followers, reach, impressions, engagement, views, clicks
        }, { onConflict: "account_id,date" });

        if (upsertError) throw upsertError;

        results.push({ accountId: account.id, status: "success" });
      } catch (err: any) {
        results.push({ accountId: account.id, status: "error", error: err.message });
      }
    }

    return res.status(200).json({ success: true, processed: accounts.length, results });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
}
