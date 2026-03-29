import { GoogleGenerativeAI } from '@google/generative-ai';
import { createClient } from '@supabase/supabase-js';

// Inicializa Supabase Edge Client
const supabaseUrl = process.env.VITE_SUPABASE_URL || "https://twzovmrgohqxmynroooo.supabase.co";
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || "";

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { token, teamId, metricsPayload } = req.body;

  if (!token || !teamId || !metricsPayload) {
     return res.status(400).json({ error: 'Parâmetros ausentes no corpo da requisição' });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
     return res.status(500).json({ error: 'GEMINI_API_KEY não configurada no servidor.' });
  }

  const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    global: { headers: { Authorization: `Bearer ${token}` } }
  });

  try {
     // 1. Instanciar Inteligência Artificial do Google
     const genAI = new GoogleGenerativeAI(apiKey);
     const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

     // 2. Escrever o Master Prompt da Agência
     const prompt = `
Você é o Assessor Chefe de Marketing da agência Conventinho Analytics.
Aqui estão os dados sintéticos/reais de tráfego de nossos clientes das últimas semanas:
${JSON.stringify(metricsPayload)}

Sua missão é agir de forma inteligente e analisar os picos ou quedas de Engajamento, Alcance ou Seguidores.
Com base NESSES DADOS ESTRITAMENTE, crie 3 (três) insights curtos e agressivamente úteis.

Retorne EXATAMENTE um array JSON puro (sem marcação markdown como \`\`\`json). O formato de cada objeto do array deve ser:
{
  "insight_type": "growth" | "drop" | "viral" | "suggestion",
  "title": "Título Curto (Ex: Alta de Reels)",
  "description": "O que causou isso de forma direta (Ex: Notei que a retenção subiu 30% nos dias X).",
  "actionable_step": "O que o time deve fazer AGORA (Ex: Impulsione este conteúdo urgentemente com R$ 50).",
  "platform": "instagram" | "facebook" | "youtube"
}
Não escreva NENHUM TEXTO fora do Array JSON.
`;

     // 3. Fazer o Request Serverless para o Gemini
     const aiResult = await model.generateContent(prompt);
     const responseText = aiResult.response.text();
     
     // 4. Limpar marcações acidentais se a IA desobedecer regras rigorosas (```json)
     const cleanJSON = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
     
     const generatedArray = JSON.parse(cleanJSON);

     if (!Array.isArray(generatedArray)) {
         throw new Error("A IA não retornou um array de insights válido.");
     }

     // 5. Preparar e inserir no banco Supabase
     const timestamp = new Date().toISOString();
     const rowsToInsert = generatedArray.map((aiItem: any, index: number) => ({
         id: `ai-${Date.now()}-${index}`,
         team_id: teamId,
         platform: aiItem.platform || "instagram",
         insight_type: aiItem.insight_type || "suggestion",
         title: aiItem.title,
         description: aiItem.description,
         actionable_step: aiItem.actionable_step,
         metrics_snapshot: {},
         created_at: timestamp
     }));

     const { data: insertedData, error: dbError } = await supabase
       .from('ai_insights_history')
       .insert(rowsToInsert)
       .select();

     if (dbError) {
        console.error("Failed to save insights to DB (maybe table missing):", dbError);
        // Mesmo falhando em salvar, mandaremos os insights vivos para a UX da tela
        return res.status(200).json({ success: true, data: rowsToInsert, dbWarning: dbError.message });
     }

     return res.status(200).json({ success: true, data: insertedData });

  } catch (err: any) {
     console.error("Gemini API Error:", err);
     return res.status(500).json({ error: 'Falha ao processar Inteligência Artificial', details: err.message });
  }
}
