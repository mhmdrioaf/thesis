import Image from "next/image";
import Container from "../container/Container";
import Card from "../card/Card";
import {
  SOCIAL_MEDIA_LIST as SocialMediaList,
  HOME_TABS as HomeTabs,
} from "@/lib/constants";
import Link from "next/link";

export default function Footer() {
  return (
    <Container className="w-full grid grid-cols-1 items-center gap-8 lg:grid-cols-2 lg:gap-0 border-t border-t-gray-100">
      <div className="flex flex-col gap-4">
        <div className="flex flex-row gap-4 items-center">
          <h3 className="text-2xl font-medium">SMKS Korporasi Garut</h3>
        </div>
        <div className="flex flex-row gap-4 items-center">
          {SocialMediaList.map((socialMedia: SocialMedia) => (
            <Link key={socialMedia.id} href={socialMedia.url} target="_blank">
              <Card>
                <Image
                  src={socialMedia.iconURL}
                  width={32}
                  height={32}
                  alt={socialMedia.id}
                />
              </Card>
            </Link>
          ))}
        </div>
      </div>
      <div className="w-full grid grid-cols-2 justify-around">
        <div className="flex flex-col gap-4">
          <p className="text-neutral-500 font-medium">Quick Links</p>
          {HomeTabs.map((tab: Tab) => (
            <Link
              key={tab.id!}
              href={tab.route!}
              className="text-primary hover:underline underline-offset-4"
            >
              {tab.name}
            </Link>
          ))}
        </div>
        <div className="flex flex-col gap-4">
          <p className="text-neutral-500 font-medium">Address</p>
          <p className="text-primary">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Consequatur
            eligendi sed, eum itaque ad illo.
          </p>
        </div>
      </div>
    </Container>
  );
}
