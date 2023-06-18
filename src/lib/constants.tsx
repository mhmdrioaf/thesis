import { AuthGroupButton } from "@/components/buttons/AuthButton";

export const HOME_TABS: Tab[] = [
  { id: "home", route: "/", name: "Home" },
  { id: "about", route: "/about", name: "About" },
  { id: "marketplace", route: "/marketplace", name: "Marketplace" },
];

export const MARKETPLACE_TABS: Tab[] = [
  { id: "home", route: "/", name: "Home" },
  { id: "marketplace", route: "/marketplace", name: "Marketplace" },
  { id: "login", route: "/auth/login", name: "Login" },
  { id: "register", route: "/auth/register", name: "Daftar" },
  {
    id: "buttons",
    element: <AuthGroupButton />,
  },
];
