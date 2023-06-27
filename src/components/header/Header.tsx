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
import { HEADER_MENU_TABS, ROUTES } from "@/lib/constants";
import { UserIcon } from "@heroicons/react/24/solid";
import HeaderMenu from "./Menu";
import NavButtons from "../navs/NavButtons";

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

  useEffect(() => {
    const handleScroll = () => {
      setScrollValue(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);
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
          <div className="w-fit flex justify-end justify-self-end">
            <NavLink
              tabs={homeTabs.filter(
                (tab: Tab) => tab.id !== "login" && tab.id !== "register"
              )}
            />
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
                    className="w-12 h-12 rounded-full border border-gray-300 cursor-pointer hidden lg:inline-block relative"
                    onClick={() => setHeaderMenuOpen((prev) => !prev)}
                  >
                    {session && session.user.image ? (
                      <Image
                        src={session.user.image}
                        fill
                        alt="profile picture"
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full grid place-items-center">
                        <UserIcon className="w-4 h-4 text-gray-500" />
                      </div>
                    )}
                    {headerMenuOpen && (
                      <HeaderMenu
                        tabs={HEADER_MENU_TABS}
                        style={conditionalHeaderMenuStyle}
                      />
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
                      <button
                        key="sign out button"
                        className="w-full px-2 py-2 bg-red-950 text-white"
                        onClick={() => signOut()}
                      >
                        Sign out
                      </button>
                    ),
                  },
                ].concat(HEADER_MENU_TABS)
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
