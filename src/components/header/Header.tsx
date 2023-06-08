"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bars3Icon } from "@heroicons/react/24/solid";
import { useState } from "react";

interface Props {
  headerTabs: Tab[];
}

export default function Header({ headerTabs }: Props) {
  const [openDrawer, setOpenDrawer] = useState(false);
  const pathname = usePathname();
  return (
    <div className="w-full flex flex-row justify-between items-center border-b border-b-gray-100 px-4 lg:px-16 py-4">
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
      <div
        id="header-nav"
        className="hidden lg:flex flex-row gap-8 items-center"
      >
        {headerTabs.map((tab: Tab) => (
          <Link
            key={tab.id}
            href={tab.route}
            className={
              pathname === tab.route
                ? "font-normal text-normal no-underline text-neutral-950"
                : "font-normal text-normal no-underline text-gray-400 hover:text-gray-900"
            }
          >
            {tab.name}
          </Link>
        ))}
      </div>
      <div
        id="header-menu"
        className="block lg:hidden cursor-pointer"
        onClick={() => setOpenDrawer((prev) => !prev)}
      >
        <Bars3Icon className="w-8 h-8 text-primary" />
      </div>
      <div
        className={
          openDrawer
            ? "w-full h-screen fixed top-0 left-0 bg-black bg-opacity-30"
            : "hidden"
        }
        onClick={() => setOpenDrawer(false)}
      >
        <div className="w-full py-4 px-4 bg-white rounded-xl flex flex-col gap-2 fixed bottom-0 left-0">
          {headerTabs.map((tab: Tab) => (
            <Link
              href={tab.route}
              key={tab.id}
              className={
                pathname === tab.route
                  ? "w-full px-4 py-4 bg-primary text-white rounded-md hover:cursor-pointer"
                  : "w-full px-4 py-4 text-neutral-950 rounded-md hover:cursor-pointer hover:bg-primary hover:text-white"
              }
            >
              {tab.name}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
