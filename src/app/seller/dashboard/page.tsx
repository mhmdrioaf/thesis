import Container from "@/components/container/Container";
import { SELLER_PAGE_TABS as tabs } from "@/lib/constants";

export default function SellerDashboard() {
  return (
    <Container className="w-full flex flex-col gap-8">
      <div className="flex flex-row gap-8 items-start">
        <div className="px-8 py-8 border border-gray-300 rounded-lg flex flex-col gap-4">
          {tabs.map((tab: Tab) => (
            <div key={tab.id} className="flex flex-row items-center gap-4">
              {tab.element}
              <p>{tab.name}</p>
            </div>
          ))}
        </div>
      </div>
    </Container>
  );
}
