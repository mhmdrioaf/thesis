"use client";

import { useSession } from "next-auth/react";
import ProfileImageUpload from "../forms/user/personal-info/ImageUpload";
import LoadingSpinner from "../indicators/LoadingSpinner";
import TextField from "../inputs/TextField";
import Button from "../buttons/Button";

export default function SellerProfile({
  setModalShown,
}: {
  setModalShown: React.Dispatch<React.SetStateAction<string | null>>;
}) {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <div className="w-full grid place-items-center">
        <LoadingSpinner />
      </div>
    );
  } else {
    if (session) {
      return (
        <div className="w-full flex flex-col gap-8">
          <div className="w-full flex flex-col lg:flex-row gap-8 lg:gap-4">
            <ProfileImageUpload />
            <div className="w-full flex flex-col gap-8">
              <table className="w-full h-full flex flex-col gap-8 rounded-xl overflow-hidden px-4 py-4">
                <thead className="flex items-center justify-start">
                  <tr>
                    <th colSpan={2}>Store Detail</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="py-4 pr-4 font-semibold">Store name</td>
                    {session.user && (
                      <td className="flex py-4 gap-4 items-center">
                        <p>{session.user.name}</p>
                        <button
                          className="text-primary"
                          onClick={() => setModalShown("seller-name")}
                        >
                          Change
                        </button>
                      </td>
                    )}
                  </tr>
                  <tr>
                    <td className="py-4 pr-4 font-semibold">Store email</td>
                    {session.user && (
                      <td className="flex py-4 gap-4 items-center">
                        <p>{session.user.email}</p>
                        <button
                          className="text-primary"
                          onClick={() => setModalShown("seller-email")}
                        >
                          Change
                        </button>
                      </td>
                    )}
                  </tr>
                  <tr>
                    <td className="py-4 pr-4 font-semibold">Store username</td>
                    {session.user && (
                      <td className="flex py-4 gap-4 items-center">
                        <p>{session.user.username}</p>
                        <button
                          className="text-primary"
                          onClick={() => setModalShown("seller-username")}
                        >
                          Change
                        </button>
                      </td>
                    )}
                  </tr>
                  <tr>
                    <td className="py-4 pr-4 font-semibold">Store address</td>
                    {session.user && (
                      <td className="flex py-4 gap-4 items-center">
                        <p>{session.user.storeAddress ?? "Not yet setted."}</p>
                        <button
                          className="text-primary"
                          onClick={() => setModalShown("store-address")}
                        >
                          Change
                        </button>
                      </td>
                    )}
                  </tr>
                  <tr>
                    <td className="py-4 pr-4 font-semibold">
                      <p>Phone Number</p>
                    </td>
                    {session.user && (
                      <td className="flex py-4 gap-4 items-center">
                        <p>
                          {session.user.phoneNumber?.toString() ||
                            "Not setted yet"}
                        </p>
                        <button
                          className="text-primary"
                          onClick={() => setModalShown("seller-phoneNumber")}
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
                          onClick={() =>
                            setModalShown("seller-password-change")
                          }
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
                  Please be aware that, this action would be deleting your
                  account permanently, and cannot be restored.
                </p>
                <Button
                  variants="ERROR"
                  onClick={() => setModalShown("seller-delete")}
                >
                  Delete Account
                </Button>
              </div>
            </div>
          </div>
        </div>
      );
    } else {
      return "You have no access to this page!";
    }
  }
}
