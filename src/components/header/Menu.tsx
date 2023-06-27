"use client";

import Link from "next/link";
import { signOut } from "next-auth/react";

interface PageProps {
  tabs: Tab[];
  style?: string;
}

export default function HeaderMenu({ tabs, style }: PageProps) {
  return (
    <div
      className={`w-max py-8 bg-white flex flex-col gap-8 items-start rounded-ee-lg rounded-es-lg absolute left-1/2 -translate-x-1/2 top-16 ${style}`}
    >
      {tabs
        .filter((tab: Tab) => tab.route !== undefined)
        .map((tab: Tab) => (
          <Link
            href={tab.route!}
            key={tab.id}
            className="w-full px-4 flex items-center gap-2 text-gray-500 text-opacity-95 hover:underline"
          >
            {tab.element}
            <p>{tab?.name}</p>
          </Link>
        ))}
      {tabs
        .filter((tab: Tab) => tab.route === undefined)
        .map((tab: Tab) => (
          <div key="signout button" onClick={() => signOut()}>
            {tab.element}
          </div>
        ))}
    </div>
  );
}
