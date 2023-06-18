"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function BottomDrawer({
  drawerState,
  tabs,
}: GlobalStateContextType & { tabs: Tab[] }) {
  const pathname = usePathname();
  return (
    <div
      className={
        drawerState.drawerOpen
          ? "w-full h-screen fixed top-0 left-0 bg-black bg-opacity-30"
          : "hidden"
      }
      onClick={() => drawerState.setDrawerOpen(false)}
    >
      <div className="w-full py-4 px-4 bg-white rounded-xl flex flex-col gap-2 absolute bottom-0 left-0">
        {tabs
          .filter((tab: Tab) => tab.element === undefined)
          .map((tab: Tab) => (
            <Link
              href={tab.route!}
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
  );
}
