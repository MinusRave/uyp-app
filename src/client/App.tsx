import { useEffect, useMemo } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { routes } from "wasp/client/router";
import { Toaster } from "../client/components/ui/toaster";
import "./Main.css";
import NavBar from "./components/NavBar/NavBar";
import {
  demoNavigationitems,
  marketingNavigationItems,
} from "./components/NavBar/constants";
import CookieConsentBanner from "./components/cookie-consent/Banner";

/**
 * use this component to wrap all child components
 * this is useful for templates, themes, and context
 */
// Keep track of initialization to prevent duplicates in React Strict Mode
let isPixelInitialized = false;

export default function App() {
  const location = useLocation();
  const isMarketingPage = useMemo(() => {
    return (
      location.pathname === "/" || location.pathname.startsWith("/pricing")
    );
  }, [location]);

  const navigationItems = isMarketingPage
    ? marketingNavigationItems
    : demoNavigationitems;

  const shouldDisplayAppNavBar = useMemo(() => {
    return (
      location.pathname !== routes.LoginRoute.build() &&
      location.pathname !== routes.SignupRoute.build()
    );
  }, [location]);

  const isAdminDashboard = useMemo(() => {
    return location.pathname.startsWith("/admin");
  }, [location]);

  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace("#", "");
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView();
      }
    }
  }, [location]);

  useEffect(() => {
    // Initialize Meta Pixel
    // Hardcoded ID to ensure it works client-side without env var issues
    const pixelId = '916987204839994';
    if (pixelId && !isPixelInitialized) {
      isPixelInitialized = true;
      import("../analytics/pixel").then(({ initPixel }) => {
        initPixel(pixelId);
      });
    }

    // Capture fbclid if present
    import("../analytics/utils").then(({ captureFbclid }) => {
      captureFbclid();
    });
  }, []);

  useEffect(() => {
    // Track PageView on route change
    import("../analytics/pixel").then(({ trackPixelEvent }) => {
      trackPixelEvent("PageView");
    });
  }, [location.pathname]);

  return (
    <>
      <div className="bg-background text-foreground min-h-screen">
        {isAdminDashboard ? (
          <Outlet />
        ) : (
          <>
            {shouldDisplayAppNavBar && (
              <NavBar navigationItems={navigationItems} />
            )}
            <div className="mx-auto max-w-screen-2xl">
              <Outlet />
            </div>
          </>
        )}
      </div>
      <Toaster position="bottom-right" />
      <CookieConsentBanner />
    </>
  );
}
