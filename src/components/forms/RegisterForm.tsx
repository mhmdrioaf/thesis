"use client";

import { ChangeEvent, FormEvent, useState } from "react";
import TextField from "../inputs/TextField";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/solid";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/lib/constants";
import Snackbar from "../snackbars/Snackbar";
import { signIn } from "next-auth/react";
import Button from "../buttons/Button";

export default function RegisterForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
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
    setErrorMessage(null);
    setIsLoading(true);

    try {
      const res = await fetch(process.env.NEXT_PUBLIC_API_AUTH_REGISTER!, {
        method: "POST",
        body: JSON.stringify(newUser),
        headers: { "Content-Type": "application/json" },
      });

      if (res.status === 409) {
        setErrorMessage(res.statusText);
        setIsLoading(false);
      } else {
        await signIn("credentials", {
          redirect: false,
          username: newUser.username,
          password: newUser.password,
        }).then(() => router.push(ROUTES.MARKETPLACE));
        setIsLoading(false);
      }
    } catch (e) {
      console.error("Registration failed: ", e);
      setIsLoading(false);
    }
  }

  return (
    <form
      className="flex flex-col gap-4"
      onSubmit={(event) => registerHandler(event)}
    >
      {errorMessage && (
        <Snackbar variant="ERROR" message={errorMessage} autoHide />
      )}
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
          disabled={isLoading}
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
          disabled={isLoading}
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
          disabled={isLoading}
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
            minLength={8}
            required
            onChange={(event) => inputChangeHandler(event)}
            disabled={isLoading}
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
      <Button type="submit" disabled={isLoading}>
        {isLoading && "Registration in progress..."}
        {!isLoading && "Register"}
      </Button>
    </form>
  );
}
