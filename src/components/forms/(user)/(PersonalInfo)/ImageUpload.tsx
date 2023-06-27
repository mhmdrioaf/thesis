"use client";

import LoadingSpinner from "@/components/indicators/LoadingSpinner";
import supabase from "@/lib/supabase";
import { UserIcon } from "@heroicons/react/24/solid";
import { useSession } from "next-auth/react";
import Image from "next/image";

export default function ProfileImageUpload() {
  const { data: session, status, update } = useSession();

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
    const file = event.target.files[0];

    try {
      const filename = `${session?.user.id}/profile_pic`;
      const { data, error } = await supabase.storage
        .from("avatars")
        .upload(filename, file, {
          cacheControl: "0",
          upsert: true,
        });

      if (error) {
        console.error("An error occurred while uploading the image: ", error);
      }

      if (data && session) {
        const imageURL = getPublicImageURL(data.path);
        const res = await fetch(process.env.NEXT_PUBLIC_API_USER_UPDATE!, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: session.user.id, image: imageURL }),
        });

        if (!res.ok) {
          console.error("Response not ok: ", res.statusText);
        } else {
          update();
          console.log(await res.json());
        }
      }
    } catch (e) {
      console.error("Unable to upload image: ", e);
    }
  }

  if (status === "loading") return <LoadingSpinner />;

  return (
    <div className="w-72 px-8 py-8 flex flex-col gap-8 border border-b rounded-xl items-center justify-center">
      <div className="w-64 h-64 border border-gray-300 rounded-xl overflow-hidden relative">
        {session && session.user.image ? (
          <Image
            loader={imageLoader}
            src={session.user.image}
            alt="Profile Picture"
            className="object-cover"
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
        Upload Photo
      </label>
      <input
        type="file"
        id="image"
        accept="image/*"
        hidden
        onChange={onAvatarChange}
      />
      <p className="text-gray-500">
        Note: Please be aware that the profile picture update may take up to 5
        minutes to reflect the changes across all platforms.
      </p>
    </div>
  );
}
