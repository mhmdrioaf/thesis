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

interface Props {
  homeTabs: Tab[];
  marketplaceTabs: Tab[];
}

export default function Header({ homeTabs, marketplaceTabs }: Props) {
  const { drawerState } = useGlobalState();
  const { data: session, status } = useSession();
  const [scrollValue, setScrollValue] = useState(0);
  const pathname = usePathname();

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
    <div
      className={`w-full sticky top-0 z-10 transition-padding duration-200 ease-in-out flex flex-row justify-between items-center border-b border-b-gray-100 py-4 bg-white bg-opacity-95 backdrop-blur-md ${
        scrollValue > 50 ? "px-8 lg:px-16" : "px-10 lg:px-24"
      }`}
    >
      {pathname !== "/marketplace" && (
        <>
          <div
            id="header-logo"
            className="flex flex-row gap-4 items-center select-none"
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
          <NavLink
            tabs={homeTabs.filter(
              (tab: Tab) => tab.id !== "login" && tab.id !== "register"
            )}
          />
          <Hamburger
            onClick={() => drawerState.setDrawerOpen((prev) => !prev)}
          />
        </>
      )}
      {pathname === "/marketplace" && (
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
            className="flex flex-row gap-4 items-center select-none"
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
                        <button onClick={() => signOut()}>Sign out</button>
                      ),
                    },
                  ]
                : marketplaceTabs
            }
          />
          <CartButton onClick={() => console.log("hello")} />
        </>
      )}
      <BottomDrawer
        tabs={pathname === "/marketplace" ? marketplaceTabs : homeTabs}
        drawerState={drawerState}
      />
    </div>
  );
}
