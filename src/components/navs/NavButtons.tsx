export default function NavButtons({ tabs }: { tabs: Tab[] }) {
  return (
    <div className="hidden lg:block">
      {tabs
        .filter((tab: Tab) => tab.element !== undefined)
        .map((tab: Tab) => tab.element)}
    </div>
  );
}
