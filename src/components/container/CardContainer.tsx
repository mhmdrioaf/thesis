interface ComponentProps {
  children: React.ReactNode;
  active?: boolean;
}

export default function CardContainer({
  active = false,
  children,
}: ComponentProps) {
  const cardBaseStyle = "w-full px-4 py-4 rounded-md overflow-hidden ";
  const cardStyles = !active
    ? cardBaseStyle + "bg-white border border-gray-300"
    : cardBaseStyle +
      "bg-primary bg-opacity-10 text-neutral-950 border border-primary";
  return <div className={cardStyles}>{children}</div>;
}
