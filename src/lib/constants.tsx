import { AuthGroupButton } from "@/components/buttons/AuthButton";
import {
  ArrowRightOnRectangleIcon,
  BookmarkIcon,
  Cog6ToothIcon,
  UserIcon,
} from "@heroicons/react/24/solid";

// Dummies data
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

export const DUMMY_HOME_CAROUSEL_ASSETS: CarouselAsset[] = [
  {
    id: "ca-1",
    img: "/carousel_1.jpg",
    desc: `Lorem ipsum dolor sit amet consectetur adipisicing elit. Vel ipsum voluptatem provident.`,
    title: `Lorem ipsum dolor sit.`,
  },
  {
    id: "ca-2",
    img: "/carousel_2.jpg",
    desc: `Lorem ipsum dolor sit amet consectetur adipisicing elit. Vel ipsum voluptatem provident.`,
    title: `Lorem ipsum dolor sit.`,
  },
  {
    id: "ca-3",
    img: "/carousel_3.jpg",
    desc: `Lorem ipsum dolor sit amet consectetur adipisicing elit. Vel ipsum voluptatem provident.`,
    title: `Lorem ipsum dolor sit.`,
  },
];

export const DUMMY_MARKETPLACE_CAROUSEL_ASSETS: CarouselAsset[] = [
  {
    id: "ca-1",
    img: "/product-category-1.jpg",
    desc: `Lorem ipsum dolor sit amet consectetur.`,
    title: `Hortikultura`,
  },
  {
    id: "ca-2",
    img: "/product-category-2.jpg",
    desc: `Lorem ipsum dolor sit amet consectetur adipisicing elit.`,
    title: `Lorem ipsum`,
  },
  {
    id: "ca-3",
    img: "/product-category-3.jpg",
    desc: `Lorem ipsum dolor sit amet.`,
    title: `Ruminansia`,
  },
];

export const DUMMY_MARKETPLACE_PRODUCTS: Product[] = [
  {
    id: "prod01",
    name: "Product 1",
    price: 50000,
    category: "Ruminansia",
    desc: `Lorem ipsum dolor sit amet consectetur adipisicing elit. Rerum iure in accusantium quia voluptatum optio?`,
    imgURL: "/product-category-1.jpg",
  },
  {
    id: "prod02",
    name: "Product 2",
    price: 24000,
    category: "Hortikultura",
    desc: `Lorem ipsum dolor sit amet consectetur adipisicing elit. Rerum iure in accusantium quia voluptatum optio?`,
    imgURL: "/product-category-2.jpg",
  },
  {
    id: "prod03",
    name: "Product 3",
    price: 32000,
    category: "Ruminansia",
    desc: `Lorem ipsum dolor sit amet consectetur adipisicing elit. Rerum iure in accusantium quia voluptatum optio?`,
    imgURL: "/product-category-3.jpg",
  },
  {
    id: "prod04",
    name: "Product 4",
    price: 12500,
    category: "Florikultura",
    desc: `Lorem ipsum dolor sit amet consectetur adipisicing elit. Rerum iure in accusantium quia voluptatum optio?`,
    imgURL: "/product-category-1.jpg",
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

// routes
export const ROUTES = {
  HOME: "/",
  MARKETPLACE: "/marketplace",
  ABOUT: "/about",
  PRODUCTS: {
    CREATE: "/products/create",
  },
  AUTH: {
    LOGIN: "/auth/login",
    REGISTER: "/auth/register",
  },
  PRODUCT_DETAIL: (productId: string | number) =>
    `/marketplace/product/${productId}`,

  USER: {
    PROFILE: "/user/profile",
    SETTINGS: "/user/settings",
    WISHLISTS: "/user/wishlists",
  },
};

// pages tabs
export const HOME_TABS: Tab[] = [
  { id: "home", route: ROUTES.HOME, name: "Home" },
  { id: "about", route: ROUTES.ABOUT, name: "About" },
  { id: "marketplace", route: ROUTES.MARKETPLACE, name: "Marketplace" },
];

export const MARKETPLACE_TABS: Tab[] = [
  { id: "home", route: ROUTES.HOME, name: "Home" },
  { id: "marketplace", route: ROUTES.MARKETPLACE, name: "Marketplace" },
  { id: "login", route: ROUTES.AUTH.LOGIN, name: "Login" },
  { id: "register", route: ROUTES.AUTH.REGISTER, name: "Daftar" },
  {
    id: "buttons",
    element: <AuthGroupButton key="auth group button" />,
  },
];

export const HEADER_MENU_TABS: Tab[] = [
  {
    id: "profile",
    route: ROUTES.USER.PROFILE,
    name: "Profile",
    element: <UserIcon className="w-4 h-4 text-gray-500" />,
  },
  {
    id: "wishlists",
    route: ROUTES.USER.WISHLISTS,
    name: "Wishlist's",
    element: <BookmarkIcon className="w-4 h-4 text-gray-500" />,
  },
  {
    id: "settings",
    route: ROUTES.USER.SETTINGS,
    name: "Settings",
    element: <Cog6ToothIcon className="w-4 h-4 text-gray-500" />,
  },
  {
    id: "logout",
    name: "Log out",
    element: (
      <div
        key="logout button"
        className="w-full px-4 flex flex-row gap-2 items-center text-gray-500 hover:underline"
      >
        <ArrowRightOnRectangleIcon className="w-4 h-4" />
        <p className="text-500">Log out</p>
      </div>
    ),
  },
];

export const PROFILE_PAGE_TABS: Tab[] = [
  {
    id: "bio",
    name: "Personal Info",
  },
  {
    id: "addresses",
    name: "Addresses",
  },
  {
    id: "payments",
    name: "Payment Method",
  },
  {
    id: "security",
    name: "Security",
  },
];
