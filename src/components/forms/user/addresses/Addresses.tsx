"use client";

import CardContainer from "@/components/container/CardContainer";
import ModalsContainer from "@/components/container/ModalsContainer";
import LoadingSpinner from "@/components/indicators/LoadingSpinner";
import { CheckIcon, PlusIcon } from "@heroicons/react/24/solid";
import { FormEvent, FormEventHandler, useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useSession } from "next-auth/react";
import { phoneNumberConverter, sortAddress } from "@/lib/helper";

type Inputs = {
  address: Address;
  isDelete?: boolean;
};

interface User {
  id: string;
  mainAddress?: string;
  addresses: Address[];
}

export default function Addresses() {
  const { register, handleSubmit, reset } = useForm<Inputs>();
  const { data: session, update, status } = useSession();
  const [modalShown, setModalShown] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [addressToUpdate, setAddressToUpdate] = useState<
    Address | null | undefined
  >(null);
  const [isLoading, setIsLoading] = useState(false);

  const userAddress = user?.addresses;
  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    setIsLoading(true);
    try {
      const { receiverId, ...dataToSubmit } = data.address;
      const res = await fetch("http://localhost:3000/api/create-address", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user!.id,
          address: {
            ...dataToSubmit,
            receiverId: user!.id,
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
  const onUpdate: SubmitHandler<Inputs> = async (data) => {
    setIsLoading(true);
    try {
      const { id, ...dataToSubmit } = data.address;
      const res = await fetch("http://localhost:3000/api/update-address", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          isUpdate: true,
          addressId: addressToUpdate?.id,
          address: dataToSubmit,
        }),
      });

      const updateResponse = await res.json();

      if (!updateResponse.ok) {
        console.error(updateResponse);
      } else {
        setAddressToUpdate(null);
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
  function showModal(
    options: string | null,
    address: Address | null | undefined
  ) {
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
                {...register("address.label")}
                required
                placeholder="Home / Office"
              />
              <label htmlFor="receiverName">Recipient Name</label>
              <input
                id="receiverName"
                className="px-2 py-2 border border-gray-300 rounded-md"
                type="text"
                {...register("address.receiverName")}
                required
                placeholder="Recipent name..."
              />
              <label htmlFor="receiverPhone">Recipient Phone Number</label>
              <input
                id="receiverPhone"
                className="px-2 py-2 border border-gray-300 rounded-md"
                type="number"
                {...register("address.receiverPhone", {
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
                {...register("address.fullAddress")}
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
      case "update": {
        return (
          <ModalsContainer
            onClose={hideModal}
            description="Update the current address"
            title="Update Address"
          >
            <form
              onSubmit={handleSubmit(onUpdate)}
              className="flex flex-col gap-4"
            >
              <label htmlFor="label">Address Label</label>
              <input
                id="label"
                className="px-2 py-2 border border-gray-300 rounded-md"
                type="text"
                defaultValue={address?.label}
                {...register("address.label")}
                required
                placeholder="Home / Office"
              />
              <label htmlFor="receiverName">Recipient Name</label>
              <input
                id="receiverName"
                className="px-2 py-2 border border-gray-300 rounded-md"
                type="text"
                defaultValue={address?.receiverName}
                {...register("address.receiverName")}
                required
                placeholder="Recipent name..."
              />
              <label htmlFor="receiverPhone">Recipient Phone Number</label>
              <input
                id="receiverPhone"
                className="px-2 py-2 border border-gray-300 rounded-md"
                type="number"
                defaultValue={address?.receiverPhone}
                {...register("address.receiverPhone", {
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
                defaultValue={address?.fullAddress}
                {...register("address.fullAddress")}
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
      case "delete": {
        return (
          <ModalsContainer
            title="Delete address"
            description="Are you sure want to delete this address?"
            onClose={hideModal}
          >
            <form
              className="flex flex-col gap-4"
              onSubmit={(event) => deleteAddress(event, address!.id)}
            >
              <button
                type="submit"
                className="px-2 py-2 rounded-md bg-red-950 text-white disabled:bg-gray-300 disabled:text-gray-500"
                disabled={isLoading}
              >
                Delete
              </button>
              <button
                type="button"
                className="px-2 py-2 rounded-md bg-neutral-500 text-neutral-50 disabled:bg-gray-300 disabled:text-gray-500"
                disabled={isLoading}
                onClick={hideModal}
              >
                Cancel
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
      const res = await fetch("http://localhost:3000/api/update-address", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          isUpdate: false,
          addressId: addressId,
          userId: user!.id,
        }),
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
  async function deleteAddress(
    event: FormEvent<HTMLFormElement>,
    addressId: string | null | undefined
  ) {
    setMessage(null);
    event.preventDefault();
    setIsLoading(true);
    try {
      const res = await fetch("http://localhost:3000/api/delete-address", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ addressId: addressId }),
      });

      if (!res.ok) {
        setMessage("An error occurred when deleting address");
        setIsLoading(false);
      } else {
        update();
        setIsLoading(false);
        setModalShown(null);
        setMessage(null);
      }
    } catch (err) {
      setIsLoading(false);
      console.error(err);
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
            userAddress
              .sort((address: Address) => sortAddress(address))
              .map((address: Address) => (
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
                            setModalShown("update");
                            setAddressToUpdate(address);
                          }}
                        >
                          Change address
                        </button>
                        <div className="w-px h-auto bg-primary bg-opacity-10" />
                        {address.mainAddressFor !== user.id && (
                          <>
                            <button
                              onClick={() => updatePrimaryAddress(address.id!)}
                            >
                              Make this as a main address
                            </button>
                            <div className="w-px h-auto bg-primary bg-opacity-10" />
                          </>
                        )}
                        <button
                          onClick={() => {
                            setModalShown("delete");
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
              ))
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

      {showModal(modalShown, addressToUpdate)}
    </div>
  );
}
