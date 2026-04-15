import { useState, useEffect } from "react";
import { useStableUserId } from "./useStableUserId";
import { profileService, type UserProfile } from "@/services/profileService";
import { useAuth } from "@/contexts/AuthContext";

export function useProfile() {
  const stableUserId = useStableUserId();
  const { user: authUser } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async () => {
    if (!stableUserId) {
      setLoading(false);
      return;
    }

    try {
      const data = await profileService.getProfile(stableUserId);
      if (data) {
        setProfile(data);
      } else if (authUser) {
        // Fallback inicial caso não exista no banco ainda
        setProfile({
          userId: stableUserId,
          fullName: authUser.user_metadata?.full_name || authUser.name || "Usuário",
          email: authUser.email || "",
          avatarUrl: authUser.user_metadata?.avatar_url || null,
        });
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [stableUserId]);

  return { profile, loading, refreshProfile: fetchProfile };
}
