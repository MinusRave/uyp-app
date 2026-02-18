import { routes } from "wasp/client/router";
import { BlogUrl, DocsUrl } from "../../../shared/common";
import type { NavigationItem } from "./NavBar";

const staticNavigationItems: NavigationItem[] = [];

export const marketingNavigationItems: NavigationItem[] = [
  // { name: "Features", to: "/#features" },

] as const;

export const demoNavigationitems: NavigationItem[] = [
  // { name: "Dashboard", to: "/account" }, 
] as const;
