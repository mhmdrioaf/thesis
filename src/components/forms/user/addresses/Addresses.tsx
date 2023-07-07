"use client";

import CardContainer from "@/components/container/CardContainer";
import LoadingSpinner from "@/components/indicators/LoadingSpinner";
import { CheckIcon, PlusIcon } from "@heroicons/react/24/solid";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { sortAddress } from "@/lib/helper";
import ShowFormModal from "@/components/utils/ShowFormModal";
import Snackbar from "@/components/snackbars/Snackbar";
import { getUserById } from "@/lib/api";

interface User {
  id: string;
  mainAddress?: string;
  addresses: Address[];
}

export default function Addresses() {
  const { data: session, update, status } = useSession();
  const [modalShown, setModalShown] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [addressToUpdate, setAddressToUpdate] = useState<
    Address | null | undefined
  >(null);
  const [isLoading, setIsLoading] = useState(false);

  async function updatePrimaryAddress(addressId: string) {
    setIsLoading(true);
    try {
      const res = await fetch(process.env.NEXT_PUBLIC_API_ADDRESS_UPDATE!, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          address: {
            id: addressId,
          },
          userId: user!.id,
        }),
      });

      const updateResponse = await res.json();

      if (!updateResponse.ok) {
        console.error(updateResponse);
      } else {
        setIsLoading(false);
        update();
      }
    } catch (err) {
      setIsLoading(false);
      console.error("An error occurred: ", err);
    }
  }

  function showAddresses() {
    if (user) {
      const userAddress = user.addresses;

      if (userAddress && userAddress.length > 0) {
        const sortedUserAddress = userAddress.sort((address: Address) =>
          sortAddress(address)
        );
        return sortedUserAddress.map((address: Address) => (
          <CardContainer
            key={address.id}
            active={address.primaryAddressFor === user.id}
          >
            <div className="w-full flex flex-row justify-between items-center">
              <div className="w-full flex flex-col gap-2">
                <div className="flex flex-row gap-1 items-center">
                  <b>{address.label}</b>
                  {address.primaryAddressFor === user.id && (
                    <div className="px-1 py-1 bg-neutral-700 text-white rounded-md grid place-items-center">
                      Main
                    </div>
                  )}
                </div>
                <p>{address.receiverName}</p>
                <p>{address.receiverPhoneNumber}</p>
                <p>{address.fullAddress}</p>
                <div className="flex gap-4 items-center text-sm font-semibold">
                  <button
                    onClick={() => {
                      setModalShown("address-update");
                      setAddressToUpdate(address);
                    }}
                  >
                    Change address
                  </button>
                  <div className="w-px h-auto bg-primary bg-opacity-10" />
                  {address.primaryAddressFor !== user.id && (
                    <>
                      <button onClick={() => updatePrimaryAddress(address.id!)}>
                        Make this as a main address
                      </button>
                      <div className="w-px h-auto bg-primary bg-opacity-10" />
                    </>
                  )}
                  <button
                    onClick={() => {
                      setModalShown("address-delete");
                      setAddressToUpdate(address);
                    }}
                  >
                    Delete address
                  </button>
                </div>
              </div>
              {address.primaryAddressFor === user.id && (
                <CheckIcon className="w-8 h-8" />
              )}
            </div>
          </CardContainer>
        ));
      }

      if (isLoading) {
        return (
          <div className="w-full grid place-items-center">
            <LoadingSpinner />
          </div>
        );
      }

      if (!userAddress || userAddress.length <= 0) {
        return (
          <div className="grid place-items-center text-gray-400">
            <p>No address added yet...</p>
          </div>
        );
      }
    } else {
      return null;
    }
  }

  useEffect(() => {
    setIsLoading(true);
    async function getUser() {
      if (session) {
        const fetchedUser = await getUserById(session.user.id);

        if (fetchedUser) {
          setUser(fetchedUser);
          setIsLoading(false);
        } else {
          setMessage("An error occurred when getting user's data.");
        }
      }
    }

    getUser();
  }, [session]);

  return (
    <div className="w-full min-h-screen flex flex-col gap-8">
      {message && <Snackbar variant="ERROR" message={message} />}
      <div className="w-full flex justify-end items-center">
        <button
          onClick={() => setModalShown("address-create")}
          className="px-4 py-2 flex gap-2 justify-center items-center rounded-lg bg-primary bg-opacity-95 hover:bg-opacity-100 text-white"
        >
          <PlusIcon className="w-5 h-5 text-white" />
          <p>Add address</p>
        </button>
      </div>
      {status === "loading" || isLoading ? (
        <div className="w-full grid place-items-center gap-4">
          <LoadingSpinner />
          <p className="text-gray-300">Loading addressess...</p>
        </div>
      ) : (
        showAddresses()
      )}

      <ShowFormModal
        onClose={() => setModalShown(null)}
        options={modalShown}
        setMessage={setMessage}
        formData={addressToUpdate}
      />
    </div>
  );
}
