"use client";

import LoadingSpinner from "@/components/indicators/LoadingSpinner";
import { useSession } from "next-auth/react";
import React, { useState } from "react";
import ProfileImageUpload from "./ImageUpload";
import UserDetails from "./UserDetails";
import { useForm, SubmitHandler } from "react-hook-form";
import ModalsContainer from "@/components/container/ModalsContainer";
import Snackbar from "@/components/snackbars/Snackbar";
import CapitalizeWords from "@/lib/capitalizeWords";

type Inputs = {
  name: string;
  username: string;
  email: string;
};

export default function PersonalInfo() {
  const [isLoading, setIsLoading] = useState(false);
  const [modalShown, setModalShown] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const { data: session, status, update } = useSession();
  const { register, handleSubmit, reset } = useForm<Inputs>();
  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    setIsLoading(true);
    setMessage(null);
    try {
      if (session) {
        const res = await fetch(process.env.NEXT_PUBLIC_API_USER_UPDATE!, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: session.user.id, ...data }),
        });

        const updateResponse = await res.json();

        if (!updateResponse.ok) {
          const errorCause = updateResponse.cause.map((cause: string) =>
            CapitalizeWords(cause)
          );
          setIsLoading(false);
          setMessage(`${errorCause} already exists!`);
        } else {
          setModalShown(null);
          setIsLoading(false);
          update();
        }
      }
    } catch (e) {
      setIsLoading(false);
      console.error("An error occurred: ", e);
    }
  };

  function hideModal() {
    setModalShown(null);
    reset();
  }

  function showModal(name: string | null) {
    if (session) {
      switch (name) {
        case "name": {
          return (
            <ModalsContainer
              title="Change name"
              description="You could only change your name 2 times. Make sure the name that you entered is correct"
              onClose={() => hideModal()}
            >
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="flex flex-col gap-4"
              >
                <label htmlFor="name">Name</label>
                <input
                  className="px-2 py-2 border border-gray-300 rounded-md"
                  type="text"
                  id="name"
                  defaultValue={session.user.name!}
                  {...register("name")}
                />
                <button
                  type="submit"
                  className="w-full py-2 rounded-md text-white bg-primary disabled:bg-gray-300 disabled:text-gray-500"
                  disabled={isLoading}
                >
                  Save
                </button>
              </form>
            </ModalsContainer>
          );
        }
        case "email": {
          return (
            <ModalsContainer
              title="Change email"
              description="You could only change your email 1 time. Make sure the email that you entered is correct"
              onClose={() => hideModal()}
            >
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="flex flex-col gap-4"
              >
                <label htmlFor="email">Email</label>
                <input
                  className="px-2 py-2 border border-gray-300 rounded-md"
                  type="email"
                  id="email"
                  defaultValue={session.user.email!}
                  {...register("email")}
                />
                <button
                  type="submit"
                  className="w-full py-2 rounded-md text-white bg-primary disabled:bg-gray-300 disabled:text-gray-500"
                  disabled={isLoading}
                >
                  Save
                </button>
              </form>
            </ModalsContainer>
          );
        }
        case "username": {
          return (
            <ModalsContainer
              title="Change username"
              description="Please enter the username that would be easy to remember."
              onClose={() => hideModal()}
            >
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="flex flex-col gap-4"
              >
                <label htmlFor="username">Username</label>
                <input
                  className="px-2 py-2 border border-gray-300 rounded-md"
                  type="text"
                  id="username"
                  defaultValue={session.user.username!}
                  {...register("username")}
                />
                <button
                  type="submit"
                  className="w-full py-2 rounded-md text-white bg-primary disabled:bg-gray-300 disabled:text-gray-500"
                  disabled={isLoading}
                >
                  Save
                </button>
              </form>
            </ModalsContainer>
          );
        }
        default: {
          return null;
        }
      }
    }
  }

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
      <ProfileImageUpload />
      <UserDetails setModalShown={setModalShown} />

      {showModal(modalShown)}
    </div>
  );
}
