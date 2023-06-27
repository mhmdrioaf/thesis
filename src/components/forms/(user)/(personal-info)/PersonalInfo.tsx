"use client";

import LoadingSpinner from "@/components/indicators/LoadingSpinner";
import { useSession } from "next-auth/react";
import React from "react";
import ProfileImageUpload from "./ImageUpload";

export default function PersonalInfo() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <div className="w-full h-screen grid place-items-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="flex gap-8">
      <ProfileImageUpload />
    </div>
  );
}
