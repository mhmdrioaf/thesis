import Carousel from "@/components/carousel/Carousel";

export default function Home() {
  const dummyCarouselAssets: CarouselAsset[] = [
    {
      id: "ca-1",
      img: "/carousel_1.jpg",
      desc: `Lorem ipsum dolor sit amet consectetur adipisicing elit. Vel ipsum voluptatem provident.`,
      title: `Lorem ipsum dolor sit.`,
    },
    {
      id: "ca-2",
      img: "/carousel_2.jpg",
      desc: `Lorem ipsum dolor sit amet consectetur adipisicing elit. Vel ipsum voluptatem provident.`,
      title: `Lorem ipsum dolor sit.`,
    },
    {
      id: "ca-3",
      img: "/carousel_3.jpg",
      desc: `Lorem ipsum dolor sit amet consectetur adipisicing elit. Vel ipsum voluptatem provident.`,
      title: `Lorem ipsum dolor sit.`,
    },
  ];

  return (
    <main>
      <Carousel assets={dummyCarouselAssets} />
    </main>
  );
}
