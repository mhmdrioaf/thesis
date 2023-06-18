export default function Container({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return <div className={`px-8 lg:px-16 py-8 ${className}`}>{children}</div>;
}
