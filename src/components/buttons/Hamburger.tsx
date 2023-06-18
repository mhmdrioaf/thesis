"use client";

import { Bars3Icon } from "@heroicons/react/24/solid";

interface Props {
  onClick: () => void;
}

export default function Hamburger({ onClick }: Props) {
  return (
    <div
      id="header-menu"
      className="block lg:hidden cursor-pointer"
      onClick={onClick}
    >
      <Bars3Icon className="w-8 h-8 text-primary" />
    </div>
  );
}
