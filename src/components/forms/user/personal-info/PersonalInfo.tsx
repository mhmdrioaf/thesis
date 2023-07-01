"use client";

import LoadingSpinner from "@/components/indicators/LoadingSpinner";
import { useSession } from "next-auth/react";
import React, { useState } from "react";
import ProfileImageUpload from "./ImageUpload";
import UserDetails from "./UserDetails";
import Snackbar from "@/components/snackbars/Snackbar";
import ShowFormModal from "@/components/utils/ShowFormModal";

export default function PersonalInfo() {
  const [modalShown, setModalShown] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const { status } = useSession();

  if (status === "loading") {
    return (
      <div className="w-full h-screen grid place-items-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="flex flex-col justify-center items-center lg:flex-row lg:justify-normal lg:items-start gap-8 relative">
      {message && <Snackbar message={message} variant="ERROR" />}
      {success && <Snackbar message={success} variant="SUCCESS" />}
      <ProfileImageUpload />
      <UserDetails setModalShown={setModalShown} />

      <ShowFormModal
        options={modalShown}
        onClose={() => setModalShown(null)}
        setMessage={setMessage}
        setSuccess={setSuccess}
      />
    </div>
  );
}
