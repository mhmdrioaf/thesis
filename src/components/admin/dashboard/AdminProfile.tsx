"use client";

import Button from "@/components/buttons/Button";
import ProfileImageUpload from "@/components/forms/user/personal-info/ImageUpload";
import TextField from "@/components/inputs/TextField";
import { useSession } from "next-auth/react";

interface Props {
  setModalShown: React.Dispatch<React.SetStateAction<string | null>>;
}

export default function AdminProfile({ setModalShown }: Props) {
  const { data: session } = useSession();

  if (session) {
    return (
      <div className="w-full flex flex-col gap-8">
        <div className="w-full flex flex-col lg:flex-row gap-8 lg:gap-4">
          <ProfileImageUpload />
          <div className="w-full flex flex-col gap-8">
            <table className="w-full h-full flex flex-col gap-8 rounded-xl overflow-hidden px-4 py-4">
              <thead className="flex items-center justify-start">
                <tr>
                  <th colSpan={2}>Admin Detail</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="py-4 pr-4 font-semibold">Admin name</td>
                  {session.user && (
                    <td className="flex py-4 gap-4 items-center">
                      <p>{session.user.name}</p>
                      <button
                        className="text-primary"
                        onClick={() => setModalShown("admin-name")}
                      >
                        Change
                      </button>
                    </td>
                  )}
                </tr>
                <tr>
                  <td className="py-4 pr-4 font-semibold">Admin email</td>
                  {session.user && (
                    <td className="flex py-4 gap-4 items-center">
                      <p>{session.user.email}</p>
                      <button
                        className="text-primary"
                        onClick={() => setModalShown("admin-email")}
                      >
                        Change
                      </button>
                    </td>
                  )}
                </tr>
                <tr>
                  <td className="py-4 pr-4 font-semibold">Admin username</td>
                  {session.user && (
                    <td className="flex py-4 gap-4 items-center">
                      <p>{session.user.username}</p>
                      <button
                        className="text-primary"
                        onClick={() => setModalShown("admin-username")}
                      >
                        Change
                      </button>
                    </td>
                  )}
                </tr>
                <tr>
                  <td className="py-4 pr-4 font-semibold">
                    <p>Password</p>
                  </td>
                  {session.user && (
                    <td className="flex py-4 gap-4 items-center">
                      <TextField
                        id="password"
                        placeholder="Password..."
                        name="password"
                        type="password"
                        className="border-none"
                        defaultValue={"dummyPassword"}
                        disabled
                      />
                      <button
                        className="text-primary"
                        onClick={() => setModalShown("admin-password-change")}
                      >
                        Change
                      </button>
                    </td>
                  )}
                </tr>
              </tbody>
            </table>
            <div className="px-8 py-8 w-full rounded-xl border border-gray-300 flex flex-col gap-4">
              <p className="font-semibold">Destructive Actions</p>
              <p>
                Please be aware that, this action would be deleting your account
                permanently, and cannot be restored.
              </p>
              <Button
                variants="ERROR"
                onClick={() => setModalShown("admin-delete")}
              >
                Delete Account
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
