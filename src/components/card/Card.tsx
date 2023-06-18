export default function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-lg select-none cursor-pointer border border-gray-400 flex flex-col gap-4 relative items-center overflow-hidden">
      {children}
    </div>
  );
}
