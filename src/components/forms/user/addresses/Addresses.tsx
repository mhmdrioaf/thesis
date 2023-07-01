"use client";

import CardContainer from "@/components/container/CardContainer";
import LoadingSpinner from "@/components/indicators/LoadingSpinner";
import { CheckIcon, PlusIcon } from "@heroicons/react/24/solid";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { sortAddress } from "@/lib/helper";
import ShowFormModal from "@/components/utils/ShowFormModal";
import Snackbar from "@/components/snackbars/Snackbar";

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
    const userAddress = user?.addresses;

    if (userAddress && userAddress.length > 0) {
      const sortedUserAddress = userAddress.sort((address: Address) =>
        sortAddress(address)
      );
      return sortedUserAddress.map((address: Address) => (
        <CardContainer
          key={address.id}
          active={address.mainAddressFor === user.id}
        >
          <div className="w-full flex flex-row justify-between items-center">
            <div className="w-full flex flex-col gap-2">
              <div className="flex flex-row gap-1 items-center">
                <b>{address.label}</b>
                {address.mainAddressFor === user.id && (
                  <div className="px-1 py-1 bg-neutral-700 text-white rounded-md grid place-items-center">
                    Main
                  </div>
                )}
              </div>
              <p>{address.receiverName}</p>
              <p>{address.receiverPhone}</p>
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
                {address.mainAddressFor !== user.id && (
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
            {address.mainAddressFor === user.id && (
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
  }

  useEffect(() => {
    async function getUser() {
      setIsLoading(true);
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_USER_GET}${session!.user!.id}`,
          {
            method: "GET",
            headers: { "Content-Type": "application/json" },
          }
        );

        const fetchedUser = await res.json();

        if (fetchedUser) {
          setUser(fetchedUser);
          setIsLoading(false);
        } else {
          setMessage("An error occurred when getting user's data.");
        }
      } catch (err) {
        setIsLoading(false);
        console.error(err);
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
      {status === "loading" ? (
        <div className="w-full grid place-items-center">
          <LoadingSpinner />
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
