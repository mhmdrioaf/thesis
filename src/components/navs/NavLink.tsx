"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function NavLink({ tabs }: { tabs: Tab[] }) {
  const pathname = usePathname();
  return (
    <div className="hidden lg:flex flex-row gap-8 items-center justify-evenly">
      {tabs
        .filter((tab: Tab) => tab.element === undefined)
        .map((tab: Tab) => (
          <Link
            key={tab.id}
            href={tab.route!}
            className={
              pathname === tab.route
                ? "font-normal text-normal no-underline text-neutral-950 flex-shrink-0"
                : "font-normal text-normal no-underline text-gray-400 hover:text-gray-900 flex-shrink-0"
            }
          >
            {tab.name}
          </Link>
        ))}
    </div>
  );
}
