import Card from "@/components/card/Card";
import Carousel from "@/components/carousel/Carousel";
import Container from "@/components/container/Container";
import SectionTitle from "@/components/section-title/SectionTitle";
import Speech from "@/components/speech/Speech";

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
      <Speech />
      <Container className="flex flex-col gap-8">
        <SectionTitle title="Available Majors" />
        <div className="grid grid-cols-2 gap-4 justify-between items-center">
          {dummyCarouselAssets.map((carouselAsset: CarouselAsset) => (
            <Card
              key={carouselAsset.id}
              img={carouselAsset.img}
              title={carouselAsset.title ?? "Tidak ada nama"}
              desc={carouselAsset.desc ?? "Tidak ada deskripsi"}
            />
          ))}
        </div>
      </Container>
    </main>
  );
}
