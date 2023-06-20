import Image from "next/image";
import SectionTitle from "../section-title/SectionTitle";
import Container from "../container/Container";

export default function Speech() {
  return (
    <Container className="w-full h-full flex flex-col gap-8 border-b border-b-gray-100">
      <SectionTitle title="Sambutan Kepala Sekolah" />
      <div className="flex flex-col lg:flex-row items-center lg:items-start gap-8">
        <div className="shrink-0">
          <Image
            src="/principal.jpg"
            width={300}
            height={700}
            quality={75}
            alt="Principal"
            className="rounded-lg"
          />
        </div>
        <div className="text-justify">
          Lorem, ipsum dolor sit amet consectetur adipisicing elit. Soluta
          voluptate, asperiores cum velit nobis Lorem ipsum dolor sit amet
          consectetur adipisicing elit. Eos assumenda deleniti quod facilis
          animi perspiciatis sapiente laborum enim, accusamus ad quibusdam
          reiciendis, nihil dolorem saepe maxime aspernatur nostrum, dolores
          iusto?
          <br />
          <br />
          Lorem ipsum dolor sit amet consectetur, adipisicing elit. Hic, qui
          sunt atque tenetur at, velit dolores recusandae repudiandae
          voluptatibus harum, minus laborum omnis fugit nulla quae perspiciatis.
          Delectus quod similique animi optio eveniet quasi repellat perferendis
          ipsam, quisquam quae distinctio, neque cumque. Quod eligendi molestias
          excepturi suscipit aliquam aspernatur possimus ut, ab magni,
          reprehenderit quos laboriosam optio nulla eius officia.
          <br />
          <br />
          Lorem ipsum dolor, sit amet consectetur adipisicing elit. Deleniti
          quia porro doloribus esse? Quisquam saepe molestias dolor est autem
          facere cupiditate consequatur nemo vitae itaque reprehenderit eum quos
          accusantium, soluta alias cumque neque! Explicabo porro iusto quidem
          dolorum rem minima autem placeat labore, perspiciatis optio odio
          molestias velit reprehenderit architecto aut harum mollitia ad
          doloremque aspernatur nisi. Quae laborum porro non, incidunt
          voluptates ipsum?
          <br />
          <br />
          <b>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Porro,
            beatae laudantium? Hic.
          </b>
        </div>
      </div>
    </Container>
  );
}
