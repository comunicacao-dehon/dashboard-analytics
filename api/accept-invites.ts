import { createClient } from '@supabase/supabase-js';

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // 1. Initialize admin client to bypass RLS
  const supabaseUrl = process.env.VITE_SUPABASE_URL || "https://twzovmrgohqxmynroooo.supabase.co"; // fallback if env is missing
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseServiceKey) {
    return res.status(500).json({ error: 'Server misconfiguration: missing SUPABASE_SERVICE_ROLE_KEY' });
  }

  const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
    auth: { autoRefreshToken: false, persistSession: false }
  });

  try {
    const { token } = req.body;
    if (!token) return res.status(400).json({ error: 'Missing auth token' });

    // 2. Verify user authenticity securely
    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token);
    if (authError || !user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const email = user.email;
    const userId = user.id;

    if (!email) return res.status(400).json({ error: 'User has no email' });

    // 3. Find pending invitations for this email
    const { data: pendingInvites, error: invError } = await supabaseAdmin
      .from('invitations')
      .select('*')
      .eq('email', email)
      .eq('status', 'pending');

    if (invError) throw invError;
    
    if (!pendingInvites || pendingInvites.length === 0) {
      return res.status(200).json({ message: 'No pending invitations found', processed: 0 });
    }

    let processedCount = 0;

    // 4. Accept each invitation
    for (const invite of pendingInvites) {
      // Create team member
      const { error: memberError } = await supabaseAdmin
        .from('team_members')
        .insert({
          team_id: invite.team_id,
          user_id: userId,
          role: invite.role
        });

      // Ignore duplicate insertions if they already exist
      if (memberError && memberError.code !== '23505') {
        console.error('Error inserting team member:', memberError);
        continue;
      }

      // Mark invitation as accepted
      await supabaseAdmin
        .from('invitations')
        .update({ status: 'accepted' })
        .eq('id', invite.id);

      processedCount++;
    }

    return res.status(200).json({ 
      success: true, 
      message: `Processed ${processedCount} invitations.`,
      processed: processedCount
    });

  } catch (err: any) {
    console.error('Accept invites API error:', err);
    return res.status(500).json({ error: err.message });
  }
}
