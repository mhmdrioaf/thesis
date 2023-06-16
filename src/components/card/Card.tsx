import Image from "next/image";

export default function Card({
  img,
  title,
  desc,
}: {
  img: string;
  title: string;
  desc: string;
}) {
  return (
    <div className="w-full h-full rounded-lg select-none cursor-pointer border border-gray-400 flex flex-col gap-4 relative items-center overflow-hidden">
      <div className="w-screen h-96 relative">
        <Image fill src={img} alt="Major" className="object-cover" />
      </div>
      <div className="px-4 mb-4 flex flex-col gap-2">
        <h3 className="text-xl font-bold">{title}</h3>
        <p>{desc}</p>
      </div>
    </div>
  );
}
