"use client";

import { useGlobalState } from "@/lib/contexts/GlobalState";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import CartButton from "../buttons/CartButton";
import Hamburger from "../buttons/Hamburger";
import BottomDrawer from "../drawers/BottomDrawer";
import NavButtons from "../navs/NavButtons";
import NavLink from "../navs/NavLink";
import { useSession, signOut } from "next-auth/react";
import LoadingSpinner from "../indicators/LoadingSpinner";
import { ROUTES } from "@/lib/constants";

interface Props {
  homeTabs: Tab[];
  marketplaceTabs: Tab[];
}

export default function Header({ homeTabs, marketplaceTabs }: Props) {
  const [scrollValue, setScrollValue] = useState(0);

  const { drawerState } = useGlobalState();
  const { status } = useSession();
  const pathname = usePathname();

  const marketplaceTabsWithoutAuth = marketplaceTabs.filter(
    (tab: Tab) => tab.id !== "login" && tab.id !== "register"
  );

  const conditionalHeaderStyle =
    scrollValue > 50 ? "px-8 lg:px-16" : "px-10 lg:px-24";
  const headerStyle =
    "w-full sticky top-0 z-10 transition-padding duration-200 ease-in-out flex flex-row justify-between items-center border-b border-b-gray-100 py-4 bg-white bg-opacity-95 backdrop-blur-md relative " +
    conditionalHeaderStyle;

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
          <NavButtons
            tabs={
              status === "authenticated"
                ? [
                    {
                      element: (
                        <button
                          className="px-2 py-2"
                          key="signoutbutton"
                          onClick={() => signOut()}
                        >
                          Sign out
                        </button>
                      ),
                    },
                  ]
                : status === "loading"
                ? [
                    {
                      element: <LoadingSpinner key="loading-spinner" />,
                    },
                  ]
                : marketplaceTabs
            }
          />
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
                        className="w-full px-2 py-2 bg-red-950 text-white"
                        onClick={() => signOut()}
                      >
                        Sign out
                      </button>
                    ),
                  },
                ]
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
