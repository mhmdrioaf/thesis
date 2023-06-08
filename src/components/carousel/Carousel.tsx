"use client";

import Image from "next/image";
import { ArrowLeftIcon, ArrowRightIcon } from "@heroicons/react/24/solid";
import { useCallback, useEffect, useState } from "react";

interface Props {
  assets: CarouselAsset[];
  autoplay?: boolean;
}

export default function Carousel({ assets, autoplay = true }: Props) {
  const [activeImage, setActiveImage] = useState(0);

  const handlePrevClick = useCallback(() => {
    setActiveImage(activeImage === 0 ? assets.length - 1 : activeImage - 1);
  }, [activeImage, assets]);

  const handleNextClick = useCallback(() => {
    setActiveImage(activeImage === assets.length - 1 ? 0 : activeImage + 1);
  }, [activeImage, assets]);

  useEffect(() => {
    if (autoplay) {
      const handleAutoPlay = () => {
        handleNextClick();
      };
      const intervalID = setInterval(handleAutoPlay, 3000);

      return () => clearInterval(intervalID);
    }
  }, [handleNextClick, autoplay]);

  return (
    <div className="w-full h-64 lg:h-screen relative bg-black">
      <Image
        alt="Carousel Image"
        src={assets[activeImage].img}
        fill
        className="object-cover"
      />
      <div className="w-full h-full absolute top-0 left-0 bg-gradient-to-t from-black opacity-50" />
      <div className="w-full h-full absolute top-0 left-0 text-white flex flex-col items-center justify-center select-none">
        <p className="font-bold text-2xl">{assets[activeImage]?.title}</p>
        <p className="font-normal text-md">{assets[activeImage]?.desc}</p>
      </div>
      <div className="px-4 lg:px-16 absolute top-1/2 -translate-y-1/2 w-full flex flex-row justify-between">
        <div
          className="px-2 py-2 bg-white opacity-50 text-primary rounded-md flex items-center justify-center cursor-pointer hover:opacity-100"
          onClick={() => handlePrevClick()}
        >
          <ArrowLeftIcon className="w-4 h-4" />
        </div>
        <div
          className="px-2 py-2 bg-white opacity-50 text-primary rounded-md flex items-center justify-center cursor-pointer hover:opacity-100"
          onClick={() => handleNextClick()}
        >
          <ArrowRightIcon className="w-4 h-4" />
        </div>
      </div>
    </div>
  );
}
