"use client";
import { ShoppingCartIcon } from "@heroicons/react/24/solid";

export default function CartButton({ onClick }: { onClick: () => void }) {
  return (
    <div className="block lg:hidden cursor-pointer" onClick={onClick}>
      <ShoppingCartIcon className="w-8 h-8 text-primary" />
    </div>
  );
}
