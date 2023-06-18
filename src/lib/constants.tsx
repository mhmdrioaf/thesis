import { AuthGroupButton } from "@/components/buttons/AuthButton";

const socialMediaData = {
  facebook: {
    URL: "https://facebook.com/mr.r3v",
    iconURL: "/icons8-facebook-48.png",
  },
  instagram: {
    URL: "https://instagram.com/mhmdrioaf",
    iconURL: "/icons8-instagram-48.png",
  },
  twitter: {
    URL: "https://twitter.com/oirioir",
    iconURL: "/icons8-twitter-48.png",
  },
  youtube: {
    URL: "https://youtube.com",
    iconURL: "/icons8-youtube-48.png",
  },
};

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

export const SOCIAL_MEDIA_LIST: SocialMedia[] = [
  {
    id: "facebook",
    iconURL: socialMediaData.facebook.iconURL,
    url: socialMediaData.facebook.URL,
  },
  {
    id: "twitter",
    iconURL: socialMediaData.twitter.iconURL,
    url: socialMediaData.twitter.URL,
  },
  {
    id: "instagram",
    iconURL: socialMediaData.instagram.iconURL,
    url: socialMediaData.instagram.URL,
  },
  {
    id: "youtube",
    iconURL: socialMediaData.youtube.iconURL,
    url: socialMediaData.youtube.URL,
  },
];
