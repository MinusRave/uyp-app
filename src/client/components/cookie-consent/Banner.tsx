import { useEffect } from "react";
import * as CookieConsent from "vanilla-cookieconsent";
import "vanilla-cookieconsent/dist/cookieconsent.css";
import getConfig from "./Config";
import { useQuery, getSystemConfig } from "wasp/client/operations";

/**
 * NOTE: if you do not want to use the cookie consent banner, you should
 * run `npm uninstall vanilla-cookieconsent`, and delete this component, its config file,
 * as well as its import in src/client/App.tsx .
 */
const CookieConsentBanner = () => {
  const { data: config } = useQuery(getSystemConfig);

  useEffect(() => {
    if (config?.enableCookieBanner) {
      // Check if already initialized to avoid re-run issues if config reloads
      if (!document.getElementById("cc--main")) {
        CookieConsent.run(getConfig());
      }
    } else {
      // If disabled, we might want to ensure it's hidden or reset, 
      // but vanilla-cookieconsent injects DOM elements. 
      // For now, simple conditional running is enough for page load.
      // If specific API to 'destroy' exists, use it.
      // CookieConsent.reset(true); // This might clear cookies, careful.
    }
  }, [config]);

  // Don't render definition div if disabled (though the lib creates its own usually)
  if (config && !config.enableCookieBanner) return null;

  return <div id="cookieconsent"></div>;
};

export default CookieConsentBanner;
