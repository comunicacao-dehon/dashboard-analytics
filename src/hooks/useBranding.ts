import { useBrandingContext } from "@/contexts/BrandingContext";
import { Branding } from "@/config/branding";

export function useBranding(): Branding {
  const { branding } = useBrandingContext();
  return branding;
}
