"use client";

import { useSession } from "next-auth/react";

export default function UserDetails({
  setModalShown,
}: {
  setModalShown: React.Dispatch<React.SetStateAction<string | null>>;
}) {
  const { data: session } = useSession();

  if (session) {
    return (
      <div className="w-full flex flex-col gap-8">
        <table className="w-full h-full flex flex-col gap-8 rounded-xl overflow-hidden border border-gray-300 px-8 py-8">
          <thead className="flex items-center justify-start">
            <tr>
              <th colSpan={2}>Personal Details</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="py-4 pr-4">
                <p>Name</p>
              </td>
              {session.user && (
                <td className="flex py-4 gap-4 items-center">
                  <p>{session.user.name}</p>
                  <button
                    className="text-primary"
                    onClick={() => setModalShown("name")}
                  >
                    Change
                  </button>
                </td>
              )}
            </tr>
            <tr>
              <td className="py-4 pr-4">
                <p>Email</p>
              </td>
              {session.user && (
                <td className="flex py-4 gap-4 items-center">
                  <p>{session.user.email}</p>
                  <button
                    className="text-primary"
                    onClick={() => setModalShown("email")}
                  >
                    Change
                  </button>
                </td>
              )}
            </tr>
            <tr>
              <td className="py-4 pr-4">
                <p>Username</p>
              </td>
              {session.user && (
                <td className="flex py-4 gap-4 items-center">
                  <p>{session.user.username}</p>
                  <button
                    className="text-primary"
                    onClick={() => setModalShown("username")}
                  >
                    Change
                  </button>
                </td>
              )}
            </tr>
            <tr>
              <td className="py-4 pr-4">
                <p>Birthday</p>
              </td>
              {session.user && (
                <td className="flex py-4 gap-4 items-center">
                  <p>
                    {session.user.birthdate
                      ? new Date(
                          `${session.user.birthdate}`
                        ).toLocaleDateString()
                      : "Not setted yet"}
                  </p>
                  <button
                    className="text-primary"
                    onClick={() => setModalShown("birthdate")}
                  >
                    Change
                  </button>
                </td>
              )}
            </tr>
            <tr>
              <td className="py-4 pr-4">
                <p>Phone Number</p>
              </td>
              {session.user && (
                <td className="flex py-4 gap-4 items-center">
                  <p>
                    {session.user.phoneNumber?.toString() || "Not setted yet"}
                  </p>
                  <button
                    className="text-primary"
                    onClick={() => setModalShown("phoneNumber")}
                  >
                    Change
                  </button>
                </td>
              )}
            </tr>
          </tbody>
        </table>
        <div className="px-8 py-8 w-full rounded-xl overflow-hidden border border-gray-300 flex flex-col gap-4">
          <p className="font-semibold">Destructive Actions</p>
          <p>
            Please be aware that, this action would be deleting your account
            permanently, and cannot be restored.
          </p>
          <button className="w-max px-4 py-4 bg-red-950 text-white rounded-md">
            Delete Account
          </button>
        </div>
      </div>
    );
  }
}
