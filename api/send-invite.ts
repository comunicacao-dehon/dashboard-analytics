import { Resend } from 'resend';
import { createClient } from '@supabase/supabase-js';

// Inicializa SDK do Resend
const resend = new Resend(process.env.RESEND_API_KEY || "re_dummy");

const supabaseUrl = process.env.VITE_SUPABASE_URL || "https://twzovmrgohqxmynroooo.supabase.co";
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || "";

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { token, teamId, email, role, teamName } = req.body;

  if (!token || !teamId || !email || !role) {
     return res.status(400).json({ error: 'Parâmetros ausentes no corpo da requisição' });
  }

  if (!process.env.RESEND_API_KEY) {
     return res.status(500).json({ error: 'RESEND_API_KEY não configurada no .env. Impossível enviar e-mail real.' });
  }

  // 1. Instância segregada (Usa as permissões RLS exatas de quem fez a request AuthToken)
  const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    global: { headers: { Authorization: `Bearer ${token}` } }
  });

  try {
     // 2. Insere na tabela 'invitations' garantindo RLS de Admin
     const { data: invData, error: invError } = await supabase
       .from('invitations')
       .insert({ team_id: teamId, email, role })
       .select()
       .single();

     if (invError) {
       console.error("Invite Insertion Error:", invError);
       return res.status(403).json({ error: 'Falha de permissão RLS ou E-mail já possui convite', details: invError.message });
     }

     // 3. Produzir URL Final
     const host = req.headers.host || 'localhost:5173';
     const protocol = host.includes('localhost') ? 'http' : 'https';
     const acceptLink = `${protocol}://${host}/invite/${invData.id}`;

     // 4. Disparar o Email Físico Transacional
     const { data, error: mailError } = await resend.emails.send({
        // IMPORTANTE: Na versão gratuita sem um domínio validado, o Resend SÓ ENVIA PARA O SEU E-MAIL DE CADASTRO NO SITE DO RESEND. 
        from: 'Conventinho App <onboarding@resend.dev>',
        to: email,
        subject: `Você foi convidado para a equipe ${teamName}`,
        html: `
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; padding: 40px 20px; background-color: #050505; color: #ffffff; max-width: 600px; margin: 0 auto; border-radius: 12px;">
            <div style="text-align: center; margin-bottom: 30px;">
               <h1 style="color: #ffffff; font-size: 24px; margin: 0;">Conventinho <span style="color: #f59e0b;">Analytics</span></h1>
            </div>
            
            <div style="background-color: #111111; padding: 30px; border-radius: 12px; border: 1px solid #333333;">
               <h2 style="margin-top: 0; color: #ffffff; font-size: 20px;">Você recebeu um convite!</h2>
               <p style="color: #a1a1aa; line-height: 1.6; font-size: 15px;">
                  Você foi convidado para colaborar e acessar o painel de métricas da equipe <strong>${teamName}</strong> como <strong><span style="color: #f59e0b; text-transform: uppercase; font-size: 13px;">${role}</span></strong>.
               </p>
               
               <div style="text-align: center; margin: 40px 0;">
                  <a href="${acceptLink}" style="background-color: #f59e0b; color: #050505; padding: 14px 28px; text-decoration: none; font-weight: bold; font-size: 15px; border-radius: 8px; display: inline-block;">Visualizar Convite</a>
               </div>
               
               <p style="color: #71717a; font-size: 13px; margin-bottom: 0;">
                  Se você não possui uma conta, ela será criada gratuitamente ao clicar no link. Caso não reconheça este convite, sinta-se livre para ignorá-lo.
               </p>
            </div>
          </div>
        `
     });

     if (mailError) {
        console.error("Resend delivery failed:", mailError);
        return res.status(500).json({ error: 'Convite criado, mas falha ao entregar e-mail físico', details: mailError });
     }

     return res.status(200).json({ success: true, message: 'Convite enviado com e-mail!', data: invData });

  } catch (err: any) {
     console.error("Critical API Invite Error:", err);
     return res.status(500).json({ error: 'Falha Catastrófica', details: err.message });
  }
}
