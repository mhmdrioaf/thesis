"use client";

import LoadingSpinner from "@/components/indicators/LoadingSpinner";
import supabase from "@/lib/supabase";
import { UserIcon } from "@heroicons/react/24/solid";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useState } from "react";

export default function ProfileImageUpload() {
  const { data: session, status, update } = useSession();
  const [isLoading, setIsLoading] = useState(false);

  function imageLoader({
    src,
    width,
    quality,
  }: {
    src: string;
    width: number;
    quality?: number | undefined;
  }) {
    return `${src}?/w=${width}&q=${quality || 75}`;
  }

  function getPublicImageURL(imagePath: string) {
    return supabase.storage.from("avatars").getPublicUrl(imagePath).data
      .publicUrl;
  }

  async function onAvatarChange(event: React.ChangeEvent<HTMLInputElement>) {
    if (!event.target.files) return;
    setIsLoading(true);
    const file = event.target.files[0];

    try {
      if (session) {
        const date = new Date();
        const filename = `${session.user.id}/profile_pic?t=${date}`;
        if (session.user.image) {
          const { data, error } = await supabase.storage
            .from("avatars")
            .update(filename, file, {
              upsert: true,
            });

          if (error) {
            setIsLoading(false);
            console.error("An error occurred when updating the image: ", error);
          } else {
            const imageURL = getPublicImageURL(data.path);
            const res = await fetch(process.env.NEXT_PUBLIC_API_USER_UPDATE!, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ id: session.user.id, image: imageURL }),
            });

            if (!res.ok) {
              setIsLoading(false);
              console.error(
                "an Error occurred when updating the database: ",
                res.statusText
              );
            } else {
              setIsLoading(false);
              update();
            }
          }
        } else {
          const { data, error } = await supabase.storage
            .from("avatars")
            .upload(filename, file, {
              upsert: false,
            });

          if (error) {
            setIsLoading(false);
            console.error("an Error occurred when uploading an image: ", error);
          } else {
            const imageURL = getPublicImageURL(data.path);
            const res = await fetch(process.env.NEXT_PUBLIC_API_USER_UPDATE!, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ id: session.user.id, image: imageURL }),
            });

            if (!res.ok) {
              setIsLoading(false);
              console.error(
                "an Error occurred when updating the database: ",
                res.statusText
              );
            } else {
              setIsLoading(false);
              update();
            }
          }
        }
      }
    } catch (e) {
      setIsLoading(false);
      console.error("Unable to upload image: ", e);
    }
  }

  if (status === "loading") return <LoadingSpinner />;

  return (
    <div className="w-full lg:w-72 px-8 py-8 flex flex-col gap-8 border border-b rounded-xl items-center justify-center">
      <div className="w-64 h-64 border border-gray-300 rounded-xl overflow-hidden relative">
        {session && session.user.image ? (
          <Image
            key={session.user.image}
            src={session.user.image}
            alt="Profile Picture"
            className="object-cover"
            priority={true}
            loader={imageLoader}
            fill
          />
        ) : (
          <div className="w-full h-full grid place-items-center">
            <UserIcon className="w-16 h-16 text-gray-300" />
          </div>
        )}
      </div>
      <label
        htmlFor="image"
        className="w-full cursor-pointer font-bold text-center py-2 border border-gray-300 rounded-md"
      >
        {isLoading ? "Uploading..." : "Upload Photo"}
      </label>
      <input
        type="file"
        id="image"
        accept="image/*"
        hidden
        onChange={onAvatarChange}
        disabled={isLoading}
      />
      <p className="text-gray-500">
        Note: Please be aware that the profile picture update may take up to 5
        minutes to reflect the changes across all platforms.
      </p>
    </div>
  );
}
