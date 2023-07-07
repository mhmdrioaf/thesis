"use client";

import Container from "@/components/container/Container";
import SellerProfile from "@/components/seller/Profile";
import Snackbar from "@/components/snackbars/Snackbar";
import ShowFormModal from "@/components/utils/ShowFormModal";
import { SELLER_PAGE_TABS as tabs } from "@/lib/constants";
import { useState } from "react";

export default function SellerDashboard() {
  const [activePage, setActivePage] = useState("dashboard");
  const [modalShown, setModalShown] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const baseTabStyle =
    "w-full flex flex-row px-4 py-4 rounded-md items-center gap-4 cursor-pointer hover:bg-primary hover:text-white items-center justify-center lg:justify-start";
  const activeTabStyle = baseTabStyle + " bg-primary text-white bg-opacity-95";

  function showActivePage(page: string) {
    switch (page) {
      case "dashboard":
        return <SellerProfile setModalShown={setModalShown} />;
      case "products":
        return "Products";
      case "orders":
        return "Orders";
      default:
        return "nothing";
    }
  }

  return (
    <Container className="w-full flex flex-col gap-8">
      {message && <Snackbar variant="ERROR" message={message} />}
      {success && <Snackbar variant="SUCCESS" message={success} />}
      <div className="w-full flex flex-col lg:flex-row gap-8">
        <div className="flex flex-row lg:flex-col gap-4 border border-gray-300 rounded-md px-4 py-4">
          {tabs.map((tab: Tab) => (
            <div
              key={tab.id}
              className={tab.id === activePage ? activeTabStyle : baseTabStyle}
              onClick={() => setActivePage(tab.id!)}
            >
              {tab.element}
              <p>{tab.name}</p>
            </div>
          ))}
        </div>
        <div className="w-full flex flex-col gap-4 border border-gray-300 rounded-md px-4 py-4">
          {showActivePage(activePage)}
        </div>
      </div>
      <ShowFormModal
        onClose={() => setModalShown(null)}
        options={modalShown}
        setMessage={setMessage}
        setSuccess={setSuccess}
      />
    </Container>
  );
}
