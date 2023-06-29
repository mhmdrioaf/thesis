"use client";

import Container from "@/components/container/Container";
import Addresses from "@/components/forms/user/addresses/Addresses";
import PaymentMethod from "@/components/forms/user/PaymentMethod";
import PersonalInfo from "@/components/forms/user/personal-info/PersonalInfo";
import Security from "@/components/forms/user/Security";
import { PROFILE_PAGE_TABS } from "@/lib/constants";
import { useState } from "react";

export default function UserProfile() {
  const [activePage, setActivePage] = useState<string | undefined>(
    PROFILE_PAGE_TABS[0].id
  );
  const tabs = PROFILE_PAGE_TABS;

  function activePageChecker(page: string | undefined) {
    const defaultStyle = `flex-grow shrink-0 cursor-pointer uppercase font-semibold text-center border-b-4 transition-all ${
      activePage === page ? "border-b-primary" : "border-b-transparent"
    }`;

    return defaultStyle;
  }

  function showActivePage(page: string | undefined) {
    switch (page) {
      case "bio":
        return <PersonalInfo />;

      case "addresses":
        return <Addresses />;

      case "payments":
        return <PaymentMethod />;

      case "security":
        return <Security />;

      default:
        return (
          <div className="flex flex-col gap-2">
            <p className="text-gray-300">Oops...</p>
            <p className="text-gray-500">Options not found</p>
          </div>
        );
    }
  }

  return (
    <Container className="w-full overflow-hidden flex flex-col gap-8">
      <div className="overflow-x-auto flex flex-row gap-8 justify-stretch items-center border-b border-b-gray-300">
        {tabs.map((tab: Tab) => (
          <div
            key={tab.id}
            className={activePageChecker(tab.id)}
            onClick={() => setActivePage(tab.id)}
          >
            {tab.name}
          </div>
        ))}
      </div>
      {showActivePage(activePage)}
    </Container>
  );
}
