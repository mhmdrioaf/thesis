export default function Card({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-lg select-none cursor-pointer border border-gray-100 flex flex-col gap-4 relative items-center overflow-hidden ${className}`}
    >
      {children}
    </div>
  );
}
