export default function SectionTitle({ title }: { title: string }) {
  return (
    <div className="w-48 flex flex-col gap-2">
      <h3 className="font-bold text-xl">{title}</h3>
      <div className="bg-primary w-full h-1" />
    </div>
  );
}
