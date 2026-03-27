// ─── Hook: useSocialAccounts ────────────────────────────────────────────────
// Hook React para gerenciar contas vinculadas do usuário logado.

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { getConnectedAccounts, connectAccount, disconnectAccount } from "@/services/socialService";
import type { SocialAccount, SocialPlatform } from "@/types/social";

export function useSocialAccounts() {
  const { user } = useAuth();
  const [accounts, setAccounts] = useState<SocialAccount[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    if (!user?.id) return;
    setLoading(true);
    const data = await getConnectedAccounts(user.id);
    setAccounts(data);
    setLoading(false);
  }, [user?.id]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const isConnected = (platform: SocialPlatform) => {
    return accounts.some((a) => a.platform === platform);
  };

  const getAccount = (platform: SocialPlatform) => {
    return accounts.find((a) => a.platform === platform);
  };

  const disconnect = async (platform: SocialPlatform) => {
    if (!user?.id) return;
    await disconnectAccount(user.id, platform);
    await refresh();
  };

  return {
    accounts,
    loading,
    isConnected,
    getAccount,
    disconnect,
    refresh,
  };
}
