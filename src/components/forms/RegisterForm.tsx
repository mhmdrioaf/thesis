"use client";

import { ChangeEvent, FormEvent, useState } from "react";
import TextField from "../inputs/TextField";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/solid";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

export default function RegisterForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [newUser, setNewUser] = useState<NewUser>({
    username: "",
    email: "",
    name: "",
    password: "",
  });

  const labelStyle = "text-neutral-500";
  const inputStyle = "flex flex-col gap-2";
  const router = useRouter();

  function inputChangeHandler(event: ChangeEvent<HTMLInputElement>) {
    return setNewUser((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
  }

  async function registerHandler(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      const res = await fetch("http://localhost:3000/api/register", {
        method: "POST",
        body: JSON.stringify(newUser),
        headers: { "Content-Type": "application/json" },
      });

      if (!res.ok) {
        throw new Error(await res.json());
      }
      router.push("/auth/login");
    } catch (e) {
      console.error("Register failed: ", e);
    }
  }

  return (
    <form
      className="flex flex-col gap-4"
      onSubmit={(event) => registerHandler(event)}
    >
      <div className={inputStyle}>
        <label htmlFor="name" className={labelStyle}>
          Full name
        </label>
        <TextField
          type="text"
          name="name"
          id="name"
          placeholder="John Doe"
          onChange={(event) => inputChangeHandler(event)}
          required
        />
      </div>

      <div className={inputStyle}>
        <label htmlFor="username" className={labelStyle}>
          Username
        </label>
        <TextField
          type="text"
          name="username"
          id="username"
          placeholder="johndoe"
          onChange={(event) => inputChangeHandler(event)}
          required
        />
      </div>

      <div className={inputStyle}>
        <label htmlFor="email" className={labelStyle}>
          Email
        </label>
        <TextField
          type="email"
          name="email"
          id="email"
          placeholder="johndoe@mail.com"
          onChange={(event) => inputChangeHandler(event)}
          required
        />
      </div>

      <div className={inputStyle}>
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
            required
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
      </div>
      <button
        type="submit"
        className="w-full px-4 py-4 bg-primary text-white outline-none border-none bg-opacity-95 hover:bg-opacity-100 rounded-md"
      >
        Register
      </button>
    </form>
  );
}
