import MajorCard from "@/components/card/MajorCard";
import Carousel from "@/components/carousel/Carousel";
import Container from "@/components/container/Container";
import SectionTitle from "@/components/section-title/SectionTitle";
import Speech from "@/components/speech/Speech";
import { DUMMY_HOME_CAROUSEL_ASSETS as dummyCarouselAssets } from "@/lib/constants";

export default function Home() {
  return (
    <main>
      <Carousel
        assets={dummyCarouselAssets}
        className="h-64 lg:h-screen rounded-b-xl overflow-hidden"
      />
      <Speech />
      <Container className="flex flex-col gap-8">
        <SectionTitle title="Available Majors" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 justify-between items-center">
          {dummyCarouselAssets.map((carouselAsset: CarouselAsset) => (
            <MajorCard
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
