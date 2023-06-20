import Image from "next/image";

export default function MajorCard({
  img,
  title,
  desc,
}: {
  img: string;
  title: string;
  desc: string;
}) {
  return (
    <div className="w-full h-full rounded-lg select-none cursor-pointer border border-gray-100 flex flex-col gap-4 relative items-center overflow-hidden">
      <div className="w-full h-96 relative rounded-b-lg overflow-hidden">
        <Image fill src={img} alt="Major" className="object-cover" />
      </div>
      <div className="px-4 w-full mb-4 flex flex-col">
        <h3 className="text-2xl font-bold">{title}</h3>
        <p>{desc}</p>
      </div>
    </div>
  );
}
