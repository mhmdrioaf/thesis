"use client";

import { useGlobalState } from "@/lib/contexts/GlobalState";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import CartButton from "../buttons/CartButton";
import Hamburger from "../buttons/Hamburger";
import BottomDrawer from "../drawers/BottomDrawer";
import NavLink from "../navs/NavLink";
import { useSession, signOut } from "next-auth/react";
import LoadingSpinner from "../indicators/LoadingSpinner";
import {
  HEADER_MENU_ADMIN_TABS,
  HEADER_MENU_GUEST_TABS,
  HEADER_MENU_SELLER_TABS,
  HEADER_MENU_TABS,
  ROUTES,
} from "@/lib/constants";
import { Bars2Icon, UserIcon, XMarkIcon } from "@heroicons/react/24/solid";
import HeaderMenu from "./Menu";
import NavButtons from "../navs/NavButtons";
import Button from "../buttons/Button";

interface Props {
  homeTabs: Tab[];
  marketplaceTabs: Tab[];
}

export default function Header({ homeTabs, marketplaceTabs }: Props) {
  const [scrollValue, setScrollValue] = useState(0);
  const [headerMenuOpen, setHeaderMenuOpen] = useState(false);

  const { drawerState } = useGlobalState();
  const { data: session, status } = useSession();
  const pathname = usePathname();

  const marketplaceTabsWithoutAuth = marketplaceTabs.filter(
    (tab: Tab) => tab.id !== "login" && tab.id !== "register"
  );

  const conditionalHeaderStyle =
    scrollValue > 50 ? "px-8 lg:px-16" : "px-10 lg:px-24";
  const headerStyle =
    "w-full sticky top-0 z-10 transition-padding duration-200 ease-in-out flex flex-row justify-between items-center border-b border-b-gray-100 py-4 bg-white bg-opacity-95 backdrop-blur-md relative " +
    conditionalHeaderStyle;

  const conditionalHeaderMenuStyle =
    scrollValue > 50
      ? "bg-opacity-95 backdrop-blur-md"
      : "bg-opacity-100 backdrop-none";

  function imageLoader({
    src,
    width,
    quality,
  }: {
    src: string;
    width: number;
    quality?: number | undefined;
  }) {
    return `${src}?/w=${width}&q=${quality || 75}`;
  }

  function roleValidation(role: string) {
    if (status === "authenticated") {
      switch (role) {
        case "CUSTOMER":
          return HEADER_MENU_TABS;
        case "SELLER":
          return HEADER_MENU_SELLER_TABS;
        case "ADMINISTRATOR":
          return HEADER_MENU_ADMIN_TABS;
        default:
          return [];
      }
    } else {
      return HEADER_MENU_GUEST_TABS;
    }
  }

  useEffect(() => {
    const handleScroll = () => {
      setScrollValue(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [session]);
  return (
    <div className={headerStyle}>
      {pathname !== ROUTES.MARKETPLACE && (
        <>
          <div
            id="header-logo"
            className="w-full flex flex-row gap-4 items-center select-none"
          >
            <Image
              src="/smk_logo.png"
              alt="SMKS Korporasi Logo"
              width={64}
              height={64}
            />
            <div id="header-logo-title" className="flex flex-col">
              <p className="font-semibold text-xl text-primary">
                SMKS Korporasi Garut
              </p>
              <p className="font-normal text-sm">
                Yayasan Pendidikan Galeuh Pakuan
              </p>
            </div>
          </div>
          <div className="w-fit flex justify-end gap-8 justify-self-end">
            <NavLink
              tabs={homeTabs.filter(
                (tab: Tab) => tab.id !== "login" && tab.id !== "register"
              )}
            />
            {status === "loading" ? (
              <LoadingSpinner />
            ) : (
              <div
                className="hidden lg:flex lg:flex-row lg:items-center px-2 py-2 rounded-xl gap-2 cursor-pointer hover:bg-gray-200 bg-opacity-75 relative"
                onClick={() => setHeaderMenuOpen((prev) => !prev)}
              >
                {headerMenuOpen && (
                  <HeaderMenu
                    tabs={
                      status === "authenticated"
                        ? roleValidation(session.user.role)
                        : HEADER_MENU_GUEST_TABS
                    }
                    style={conditionalHeaderMenuStyle}
                  />
                )}
                <div className="w-12 h-12 rounded-full border border-gray-300 relative overflow-hidden">
                  {session && session.user.image ? (
                    <Image
                      src={session.user.image}
                      fill
                      alt="profile picture"
                      className="object-cover"
                      loader={imageLoader}
                    />
                  ) : (
                    <div className="w-full h-full grid place-items-center">
                      <UserIcon className="w-4 h-4 text-gray-500" />
                    </div>
                  )}
                </div>
                {!headerMenuOpen ? (
                  <Bars2Icon className="w-4 h-4 text-gray-500" />
                ) : (
                  <XMarkIcon className="w-4 h-4 text-gray-500" />
                )}
              </div>
            )}
            <Hamburger
              onClick={() => drawerState.setDrawerOpen((prev) => !prev)}
            />
          </div>
        </>
      )}
      {pathname === ROUTES.MARKETPLACE && (
        <>
          <NavLink
            tabs={marketplaceTabs.filter(
              (tab: Tab) => tab.id !== "login" && tab.id !== "register"
            )}
          />
          <Hamburger
            onClick={() => drawerState.setDrawerOpen((prev) => !prev)}
          />
          <div
            id="header-logo"
            className="flex flex-row gap-4 items-center select-none justify-center absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
          >
            <Image
              src="/smk_logo.png"
              alt="SMKS Korporasi Logo"
              width={64}
              height={64}
              quality={75}
            />
          </div>
          <div className="hidden lg:block">
            {status === "loading" && <LoadingSpinner />}
            {status !== "loading" && (
              <>
                {status === "authenticated" && (
                  <div
                    className="hidden lg:flex lg:flex-row lg:items-center px-2 py-2 rounded-xl gap-2 cursor-pointer hover:bg-gray-200 bg-opacity-75 relative"
                    onClick={() => setHeaderMenuOpen((prev) => !prev)}
                  >
                    {headerMenuOpen && (
                      <HeaderMenu
                        tabs={roleValidation(session.user.role)}
                        style={conditionalHeaderMenuStyle}
                      />
                    )}
                    <div className="w-12 h-12 rounded-full border border-gray-300 relative overflow-hidden">
                      {session && session.user.image ? (
                        <Image
                          src={session.user.image}
                          fill
                          alt="profile picture"
                          className="object-cover"
                          loader={imageLoader}
                        />
                      ) : (
                        <div className="w-full h-full grid place-items-center">
                          <UserIcon className="w-4 h-4 text-gray-500" />
                        </div>
                      )}
                    </div>
                    {!headerMenuOpen ? (
                      <Bars2Icon className="w-4 h-4 text-gray-500" />
                    ) : (
                      <XMarkIcon className="w-4 h-4 text-gray-500" />
                    )}
                  </div>
                )}
                {status === "unauthenticated" && (
                  <NavButtons tabs={marketplaceTabs} />
                )}
              </>
            )}
          </div>
          <CartButton onClick={() => console.log("hello")} />
        </>
      )}
      <BottomDrawer
        tabs={
          pathname === ROUTES.MARKETPLACE
            ? status === "authenticated"
              ? [
                  ...marketplaceTabsWithoutAuth,
                  {
                    element: (
                      <Button
                        key="sign out button"
                        onClick={() => signOut()}
                        fullWidth
                      >
                        Sign out
                      </Button>
                    ),
                  },
                ].concat(roleValidation(session.user.role))
              : marketplaceTabs
            : status === "authenticated"
            ? homeTabs.filter(
                (tab: Tab) => tab.id !== "login" && tab.id !== "register"
              )
            : homeTabs
        }
        drawerState={drawerState}
      />
    </div>
  );
}
