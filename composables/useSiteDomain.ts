import { SITE_DOMAIN_DEV, SITE_DOMAIN_PROD } from "@/util/constants.common";

export const useSiteDomain = () => {
  const isProd = useIsProd();
  return isProd ? SITE_DOMAIN_PROD : SITE_DOMAIN_DEV;
};