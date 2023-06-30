"use client";

import LoadingSpinner from "@/components/indicators/LoadingSpinner";
import { useSession } from "next-auth/react";
import React, { useState } from "react";
import ProfileImageUpload from "./ImageUpload";
import UserDetails from "./UserDetails";
import { useForm, SubmitHandler } from "react-hook-form";
import ModalsContainer from "@/components/container/ModalsContainer";
import Snackbar from "@/components/snackbars/Snackbar";
import { capitalizeFirstWord, phoneNumberConverter } from "@/lib/helper";
import { useRouter } from "next/navigation";
import supabase from "@/lib/supabase";

type Inputs = {
  name: string;
  username: string;
  email: string;
  birthdate: Date;
  phoneNumber: number;
};

export default function PersonalInfo() {
  const [isLoading, setIsLoading] = useState(false);
  const [modalShown, setModalShown] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const { data: session, status, update } = useSession();
  const { register, handleSubmit, reset } = useForm<Inputs>();

  const router = useRouter();

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
            capitalizeFirstWord(cause)
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
  const deleteUser: SubmitHandler<Inputs> = async (data) => {
    setIsLoading(true);
    setMessage(null);
    if (session) {
      if (session.user.username === data.username) {
        try {
          const res = await fetch("http://localhost:3000/api/delete-user", {
            method: "POST",
            // TODO: Add authorization token to protect the api request
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              id: session.user.id,
              username: data.username,
            }),
          });

          const updateResponse = await res.json();

          if (!updateResponse.ok) {
            setIsLoading(false);
            setMessage(updateResponse.cause);
          } else {
            if (session.user.image) {
              await deleteUserImage()
                .then((response) => {
                  if (response === true) {
                    update().then(() => window.location.reload());
                  }
                })
                .catch((error) => {
                  setMessage(error);
                });
            } else {
              await update().then(() => window.location.reload());
            }
          }
        } catch (err) {
          setMessage(null);
          setIsLoading(false);
          console.error(err);
        }
      } else {
        setIsLoading(false);
        setMessage("The username that you entered is incorrect.");
      }
    }
  };

  async function deleteUserImage() {
    if (session) {
      if (session.user.image) {
        const { data, error } = await supabase.storage
          .from("avatars")
          .list(`${session.user.id}`);

        if (data) {
          const fileToRemove = data.map(
            (file) => `${session.user.id}/${file.name}`
          );
          const { error } = await supabase.storage
            .from("avatars")
            .remove(fileToRemove);

          if (error) {
            return error;
          } else {
            return true;
          }
        }

        if (error) {
          return error;
        }
      } else {
        return true;
      }
    }
  }

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
        case "birthdate": {
          return (
            <ModalsContainer
              title="Change birthdate"
              description="Fill the input below based on your birthdate."
              onClose={() => hideModal()}
            >
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="flex flex-col gap-4"
              >
                <label htmlFor="birthdate">Birthdate</label>
                <input
                  className="px-2 py-2 border border-gray-300 rounded-md"
                  type="date"
                  id="birthdate"
                  {...register("birthdate", {
                    valueAsDate: true,
                  })}
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
        case "phoneNumber": {
          return (
            <ModalsContainer
              title="Change phone number"
              description="Please be aware that this phone number is required for transactional purposes, so fill this using your current active phone number."
              onClose={() => hideModal()}
            >
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="flex flex-col gap-4"
              >
                <label htmlFor="phoneNumber">Phone Number</label>
                <input
                  className="px-2 py-2 border border-gray-300 rounded-md"
                  type="number"
                  defaultValue={
                    session.user.phoneNumber?.toString() || undefined
                  }
                  placeholder="08xxx"
                  id="phoneNumber"
                  {...register("phoneNumber", {
                    setValueAs: (v) => phoneNumberConverter(v),
                  })}
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
        case "deleteUser": {
          return (
            <ModalsContainer
              title="Delete account"
              description="Please be aware that this action cannot be undone, and your account will be deleted permanently."
              onClose={hideModal}
            >
              <div className="w-full px-2 py-2 rounded-md bg-red-950 text-white">
                <p>
                  Please fill in the inputs below with your username to
                  continue. <br />
                  Your username is: <b>{session.user.username}</b>
                </p>
              </div>

              <form
                onSubmit={handleSubmit(deleteUser)}
                className="flex flex-col gap-4"
              >
                <label htmlFor="username">Username</label>
                <input
                  className="px-2 py-2 border border-gray-300 rounded-md"
                  type="text"
                  id="username"
                  placeholder={session!.user!.username!}
                  {...register("username")}
                />
                <button
                  type="submit"
                  className="w-full py-2 rounded-md text-white bg-red-950 disabled:bg-gray-300 disabled:text-gray-500"
                  disabled={isLoading}
                >
                  Delete
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
