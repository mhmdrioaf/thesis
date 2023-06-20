"use client";

import { ChangeEvent, FormEvent, MouseEvent, useState } from "react";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/solid";
import TextField from "../inputs/TextField";
import TextDivider from "../dividers/TextDivider";
import { signIn } from "next-auth/react";

export default function AuthForm() {
  const [user, setUser] = useState<{ email: string; password: string }>({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState<{ status?: string; value?: string }>({
    status: undefined,
    value: undefined,
  });

  function inputChangeHandler(event: ChangeEvent<HTMLInputElement>) {
    return setUser((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
  }

  async function signInWithGoogleHandler(event: MouseEvent) {
    event.preventDefault();
    return await signIn("google");
  }

  async function signInWithCredentials(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    return await signIn("credentials", {
      redirect: false,
      username: user.email,
      password: user.password,
    })
      .then((res) => {
        if (!res?.ok) {
          setMessage({
            status: "error",
            value:
              "Login failed, please check your username/email or password.",
          });
        }
      })
      .catch((e) => {
        throw new Error(e);
      });
  }

  return (
    <form
      className="w-full flex flex-col gap-4"
      onSubmit={(event) => signInWithCredentials(event)}
    >
      <label htmlFor="email" className="text-neutral-500">
        Email/username
      </label>
      <TextField
        id="email"
        placeholder="john@doe.com"
        name="email"
        type="text"
        onChange={(event) => inputChangeHandler(event)}
      />
      <label htmlFor="password" className="text-neutral-500">
        Password
      </label>
      <div className="flex flex-row gap-4 border border-gray-300 rounded-md">
        <TextField
          id="password"
          placeholder="Password..."
          name="password"
          type={showPassword ? "text" : "password"}
          className="border-none"
          onChange={(event) => inputChangeHandler(event)}
        />
        <div
          className="flex items-center justify-center px-2 py-2 cursor-pointer"
          onClick={() => setShowPassword((prev) => !prev)}
        >
          {showPassword ? (
            <EyeSlashIcon className="w-4 h-4 text-primary" />
          ) : (
            <EyeIcon className="w-4 h-4 text-primary" />
          )}
        </div>
      </div>
      <button
        type="submit"
        className="w-full px-4 py-4 bg-primary text-white outline-none border-none bg-opacity-95 hover:bg-opacity-100 rounded-md"
      >
        Login
      </button>
      <TextDivider text="OR" />
      <button
        type="button"
        className="w-full px-4 py-4 bg-google text-white outline-none border-none bg-opacity-95 hover:bg-opacity-100 rounded-md"
        onClick={(event) => signInWithGoogleHandler(event)}
      >
        Login with Google
      </button>
    </form>
  );
}
