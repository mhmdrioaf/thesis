"use client";

import AdminProducts from "@/components/admin/dashboard/AdminProducts";
import AdminProfile from "@/components/admin/dashboard/AdminProfile";
import Container from "@/components/container/Container";
import DashboardContainer, {
  DashboardLeftRow,
  DashboardRightRow,
} from "@/components/container/DashboardContainer";
import ShowFormModal from "@/components/utils/ShowFormModal";
import { ADMIN_PAGE_TABS as tabs } from "@/lib/constants";
import { useState } from "react";

export default function AdminDashboard() {
  const [activePage, setActivePage] = useState("dashboard");
  const [modalShown, setModalShown] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const baseTabStyle =
    "w-full flex flex-row px-4 py-4 rounded-md items-center gap-4 cursor-pointer hover:bg-primary hover:text-white items-center justify-center lg:justify-start";
  const activeTabStyle = baseTabStyle + " bg-primary text-white bg-opacity-95";

  function showActivePage(page: string) {
    switch (page) {
      case "dashboard":
        return <AdminProfile setModalShown={setModalShown} />;
      case "products":
        return <AdminProducts />;
      case "sellers":
        return "Sellers";
      default:
        return "Dashboard";
    }
  }
  return (
    <Container>
      <DashboardContainer>
        <DashboardLeftRow>
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
        </DashboardLeftRow>

        <DashboardRightRow>{showActivePage(activePage)}</DashboardRightRow>
      </DashboardContainer>

      <ShowFormModal
        onClose={() => setModalShown(null)}
        options={modalShown}
        setMessage={setMessage}
      />
    </Container>
  );
}
