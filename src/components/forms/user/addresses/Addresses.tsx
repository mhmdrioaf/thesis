"use client";

import CardContainer from "@/components/container/CardContainer";
import ModalsContainer from "@/components/container/ModalsContainer";
import LoadingSpinner from "@/components/indicators/LoadingSpinner";
import TextField from "@/components/inputs/TextField";
import {
  CheckIcon,
  MagnifyingGlassIcon,
  PlusIcon,
} from "@heroicons/react/24/solid";
import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useSession } from "next-auth/react";
import { phoneNumberConverter } from "@/lib/helper";

type Inputs = {
  id?: string;
  label: string;
  note?: string;
  fullAddress: string;
  receiverName: string;
  receiverPhone: string;
  receiverId: string;
};

interface User {
  id: string;
  mainAddress?: string;
  addresses: Inputs[];
}

export default function Addresses() {
  const { register, handleSubmit, reset } = useForm<Inputs>();
  const { data: session, update, status } = useSession();
  const [modalShown, setModalShown] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const userAddress = user?.addresses;
  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    setIsLoading(true);
    try {
      const { id, ...dataToSubmit } = data;
      const res = await fetch(process.env.NEXT_PUBLIC_API_USER_UPDATE!, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: user!.id,
          address: {
            ...dataToSubmit,
            // TODO: Make the address id using cuid() or uuidv4
            id: `${session!.user.id}_address_${dataToSubmit.fullAddress}`,
          },
        }),
      });

      const updateResponse = await res.json();

      if (!updateResponse.ok) {
        console.error(updateResponse);
      } else {
        setModalShown(null);
        setIsLoading(false);
        update();
        reset();
      }
    } catch (err) {
      setIsLoading(false);
      console.error("An error occurred: ", err);
    }
  };

  function hideModal() {
    setModalShown(null);
    reset();
  }
  function showModal(options: string | null) {
    switch (options) {
      case "add": {
        return (
          <ModalsContainer
            title="Add address"
            description="Fill the fields below using the correct address for shipping"
            onClose={hideModal}
          >
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="flex flex-col gap-4"
            >
              <label htmlFor="label">Address Label</label>
              <input
                id="label"
                className="px-2 py-2 border border-gray-300 rounded-md"
                type="text"
                {...register("label")}
                required
                placeholder="Home / Office"
              />
              <label htmlFor="receiverName">Recipient Name</label>
              <input
                id="receiverName"
                className="px-2 py-2 border border-gray-300 rounded-md"
                type="text"
                {...register("receiverName")}
                required
                placeholder="Recipent name..."
              />
              <label htmlFor="receiverPhone">Recipient Phone Number</label>
              <input
                id="receiverPhone"
                className="px-2 py-2 border border-gray-300 rounded-md"
                type="number"
                {...register("receiverPhone", {
                  setValueAs: (v) => phoneNumberConverter(v),
                })}
                required
                placeholder="08xx"
              />
              <label htmlFor="fullAddress">Full Address</label>
              <textarea
                id="fullAddress"
                className="px-2 py-2 border border-gray-300 rounded-md"
                rows={2}
                {...register("fullAddress")}
                placeholder="Jl..."
                required
              />
              <button
                type="submit"
                className="w-full px-2 py-2 rounded-md bg-primary text-white disabled:bg-gray-300 disabled:text-gray-500"
                disabled={isLoading}
              >
                Save
              </button>
            </form>
          </ModalsContainer>
        );
      }
    }
  }
  async function updatePrimaryAddress(addressId: string) {
    setIsLoading(true);
    try {
      const res = await fetch(process.env.NEXT_PUBLIC_API_USER_UPDATE!, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: user!.id, mainAddress: addressId }),
      });

      const updateResponse = await res.json();

      if (!updateResponse.ok) {
        console.error(updateResponse);
      } else {
        setModalShown(null);
        setIsLoading(false);
        update();
      }
    } catch (err) {
      setIsLoading(false);
      console.error("An error occurred: ", err);
    }
  }

  useEffect(() => {
    async function getUser() {
      setIsLoading(true);
      try {
        const res = await fetch(
          `http://localhost:3000/api/get-user/${session!.user!.id}`,
          {
            method: "GET",
            headers: { "Content-Type": "application/json" },
          }
        );

        const fetchedUser = await res.json();
        setUser(fetchedUser);
        setIsLoading(false);
      } catch (err) {
        setIsLoading(false);
        console.error(err);
      }
    }

    getUser();
  }, [session]);

  return (
    <div className="w-full min-h-screen flex flex-col gap-8">
      <div className="w-full flex justify-end items-center">
        {/* <div className="grid grid-flow-col-dense rounded-lg overflow-hidden border border-gray-300">
          <TextField
            className="border-none"
            type="text"
            placeholder="Search for addresses or recipient name"
          />
          <div className="grid place-items-center px-2 py-2 h-full bg-gray-300">
            <MagnifyingGlassIcon className="w-5 h-5 text-neutral-800" />
          </div>
        </div> */}
        <button
          onClick={() => setModalShown("add")}
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
        <div className="w-full flex flex-col gap-4">
          {userAddress && userAddress.length > 0 ? (
            <>
              {userAddress
                .filter((address: Inputs) => address.id === user.mainAddress)
                .map((address: Inputs) => (
                  <CardContainer
                    key={address.id}
                    active={user.mainAddress === address.id}
                  >
                    <div className="w-full flex flex-row justify-between items-center">
                      <div className="w-full flex flex-col gap-2">
                        <div className="flex flex-row gap-1 items-center">
                          <b>{address.label}</b>
                          {user.mainAddress === address.id && (
                            <div className="px-1 py-1 bg-neutral-700 text-white rounded-md grid place-items-center">
                              Main
                            </div>
                          )}
                        </div>
                        <p>{address.receiverName}</p>
                        <p>{address.receiverPhone}</p>
                        <p>{address.fullAddress}</p>
                        <div className="flex gap-4 items-center text-sm font-semibold">
                          <p>Change address</p>
                          <div className="w-px h-auto bg-primary bg-opacity-10" />
                          <button
                            onClick={() => updatePrimaryAddress(address.id!)}
                          >
                            Make this as a main address
                          </button>
                          <div className="w-px h-auto bg-primary bg-opacity-10" />
                          <p>Delete</p>
                        </div>
                      </div>
                      {user.mainAddress === address.id && (
                        <CheckIcon className="w-8 h-8" />
                      )}
                    </div>
                  </CardContainer>
                ))}

              {userAddress
                .filter((address: Inputs) => address.id !== user.mainAddress)
                .map((address: Inputs) => (
                  <CardContainer
                    key={address.id}
                    active={user.mainAddress === address.id}
                  >
                    <div className="w-full flex flex-row justify-between items-center">
                      <div className="w-full flex flex-col gap-2">
                        <div className="flex flex-row gap-1 items-center">
                          <b>{address.label}</b>
                          {user.mainAddress === address.id && (
                            <div className="px-1 py-1 bg-neutral-700 text-white rounded-md grid place-items-center">
                              Main
                            </div>
                          )}
                        </div>
                        <p>{address.receiverName}</p>
                        <p>{address.receiverPhone}</p>
                        <p>{address.fullAddress}</p>
                        <div className="flex gap-4 items-center text-sm font-semibold">
                          <p>Change address</p>
                          <div className="w-px h-auto bg-primary bg-opacity-10" />
                          <button
                            onClick={() => updatePrimaryAddress(address.id!)}
                          >
                            Make this as a main address
                          </button>
                          <div className="w-px h-auto bg-primary bg-opacity-10" />
                          <p>Delete</p>
                        </div>
                      </div>
                      {user.mainAddress === address.id && (
                        <CheckIcon className="w-8 h-8" />
                      )}
                    </div>
                  </CardContainer>
                ))}
            </>
          ) : isLoading ? (
            <div className="w-full grid place-items-center">
              <LoadingSpinner />
            </div>
          ) : (
            <div className="grid place-items-center text-gray-400">
              <p>No address added yet.</p>
            </div>
          )}
        </div>
      )}

      {showModal(modalShown)}
    </div>
  );
}
