import { routes } from "wasp/client/router";
import { BlogUrl, DocsUrl } from "../../../shared/common";
import type { NavigationItem } from "./NavBar";

const productNavigationItems: NavigationItem[] = [
  { name: "Stay or Leave Test", to: "/stay-or-leave" },
  { name: "Relationship Test", to: "/test" },
  { name: "Workbook", to: "/workbook" },
];

export const marketingNavigationItems: NavigationItem[] = productNavigationItems;

export const demoNavigationitems: NavigationItem[] = productNavigationItems;
