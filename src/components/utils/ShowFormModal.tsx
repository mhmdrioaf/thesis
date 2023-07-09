"use client";

import { SubmitHandler, useForm } from "react-hook-form";
import { useSession } from "next-auth/react";
import ModalsContainer from "@/components/container/ModalsContainer";
import { useState } from "react";
import Button from "../buttons/Button";
import {
  capitalizeFirstWord,
  getFilenameFromURL,
  phoneNumberConverter,
} from "@/lib/helper";
import supabase from "@/lib/supabase";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/solid";
import { useSWRConfig } from "swr";

export type Inputs = {
  personalDetails: {
    name: string;
    username: string;
    email: string;
    birthdate: Date;
    phoneNumber: number;
    storeAddress?: string;
  };
  addressDetails: {
    address: Address;
  };
  security: {
    password: {
      currentPassword: string;
      newPassword: string;
      newPasswordConfirmations: string;
    };
    PIN: number;
  };
  product: {
    name: string;
    price: number;
    stock: number;
    descriptions: string;
    thumbnail: string;
  };
};

interface ComponentsProps {
  options: string | null;
  onClose: () => void;
  setMessage: React.Dispatch<React.SetStateAction<string | null>>;
  setSuccess?: React.Dispatch<React.SetStateAction<string | null>>;
  formData?: Address | null | undefined;
  product?: Product | null | undefined;
}

export default function ShowFormModal({
  options,
  onClose,
  setMessage,
  formData,
  setSuccess,
  product,
}: ComponentsProps) {
  const { handleSubmit, register, reset, watch } = useForm<Inputs>({
    mode: "onChange",
  });
  const { data: session, update } = useSession();
  const { mutate } = useSWRConfig();

  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const inputStyles = "px-2 py-2 border border-gray-300 rounded-md";

  const onUserDetailsUpdate: SubmitHandler<Inputs> = async (data) => {
    setMessage(null);
    setIsLoading(true);
    const dataToSubmit = data.personalDetails;
    try {
      if (session) {
        const res = await fetch(process.env.NEXT_PUBLIC_API_USER_UPDATE!, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: session.user.id, ...dataToSubmit }),
        });

        const updateResponse = await res.json();

        if (!updateResponse.ok) {
          const errorCause = updateResponse.cause.map((cause: string) =>
            capitalizeFirstWord(cause)
          );
          setMessage(`${errorCause} already exists!`);
          setIsLoading(false);
        } else {
          setIsLoading(false);
          update();
          hideModal();
        }
      }
    } catch (err) {
      setIsLoading(false);
      console.error("An error occurred when updating user data: ", err);
    }
  };
  const onUserDelete: SubmitHandler<Inputs> = async (data) => {
    setIsLoading(true);
    setMessage(null);

    if (session && session.user.username === data.personalDetails.username) {
      try {
        const response = await fetch(process.env.NEXT_PUBLIC_API_USER_DELETE!, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: session.user.id,
            username: data.personalDetails.username,
          }),
        });

        const deleteResponse = await response.json();

        if (!deleteResponse.ok) {
          setIsLoading(false);
          setMessage(deleteResponse.cause);
        } else {
          if (session.user.image) {
            const imageDeleteResponse = await deleteUserImage(session.user.id);

            if (!imageDeleteResponse.ok) {
              setMessage(imageDeleteResponse.error);
            } else {
              await update().then(() => window.location.reload());
            }
          } else {
            await update().then(() => window.location.reload());
          }
        }
      } catch (err) {
        console.error("An error occured when deleting user: ", err);
      }
    }
  };

  const onAddressSubmit: SubmitHandler<Inputs> = async (data) => {
    setMessage(null);
    setIsLoading(true);
    if (setSuccess) {
      setSuccess(null);
    }
    try {
      if (session) {
        const { receiverId, ...dataToSubmit } = data.addressDetails.address;
        const res = await fetch(process.env.NEXT_PUBLIC_API_ADDRESS_CREATE!, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId: session.user.id,
            address: {
              ...dataToSubmit,
              receiverId: session.user.id,
            },
          }),
        });

        const response = await res.json();

        if (!response.ok) {
          console.error(response);
        } else {
          hideModal();
          setIsLoading(false);
          update();
          mutate("/api/get-user-primary-address" + `/${session?.user.id}`);
          if (setSuccess) {
            setSuccess(
              "The address has been successfully added; retry your order."
            );
          }
        }
      }
    } catch (err) {
      setIsLoading(false);
      console.error("An error occurred when adding an address", err);
    }
  };
  const onAddressUpdate: SubmitHandler<Inputs> = async (data) => {
    setIsLoading(true);
    try {
      const { id, ...dataToSubmit } = data.addressDetails.address;
      const response = await fetch(
        process.env.NEXT_PUBLIC_API_ADDRESS_UPDATE!,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            address: {
              ...dataToSubmit,
              id: formData?.id,
            },
          }),
        }
      );

      const updateResponse = await response.json();

      if (!updateResponse.ok) {
        console.error(updateResponse);
      } else {
        hideModal();
        setIsLoading(false);
        update();
      }
    } catch (err) {
      console.error("An error occurred when updating an address: ", err);
      setIsLoading(false);
    }
  };
  const onAddressDelete: SubmitHandler<Inputs> = async () => {
    setMessage(null);
    setIsLoading(true);

    try {
      const response = await fetch(
        process.env.NEXT_PUBLIC_API_ADDRESS_DELETE!,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ addressId: formData?.id }),
        }
      );

      const deleteResponse = await response.json();

      if (!deleteResponse.ok) {
        setIsLoading(false);
        setMessage("An error occured when deleting an address.");
      } else {
        hideModal();
        setIsLoading(false);
        setMessage(null);
        update();
      }
    } catch (err) {
      console.error("An error occured when deleting an address: ", err);
      setIsLoading(false);
    }
  };

  const onSecurityPasswordChanged: SubmitHandler<Inputs> = async (data) => {
    setIsLoading(true);
    setMessage(null);
    const dataToSubmit = data.security.password;

    if (dataToSubmit.newPassword === dataToSubmit.newPasswordConfirmations) {
      try {
        if (session) {
          const response = await fetch(
            process.env.NEXT_PUBLIC_API_USER_UPDATE!,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                id: session.user.id,
                currentPassword: dataToSubmit.currentPassword,
                newPassword: dataToSubmit.newPassword,
              }),
            }
          );

          const updateResponse = await response.json();

          if (!updateResponse.ok) {
            setIsLoading(false);
            setMessage(updateResponse.message);
          } else {
            if (setSuccess) {
              setSuccess(
                "Your password has been successfully changed. You can now login using your new password."
              );
            }
            setIsLoading(false);
            hideModal();
            update();
          }
        }
      } catch (err) {
        setIsLoading(false);
        console.error("An error occurred when updating user password: ", err);
      }
    } else {
      setMessage("New password and new password confirmations doesn't match!");
    }
  };

  const onProductUpdate: SubmitHandler<Inputs> = async (data) => {
    setIsLoading(true);
    setMessage(null);
    if (setSuccess) {
      setSuccess(null);
    }
    const dataToSubmit = data.product;

    try {
      const res = await fetch(process.env.NEXT_PUBLIC_API_PRODUCT_UPDATE!, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: product?.id, ...dataToSubmit }),
      });

      const response = await res.json();

      if (!response.ok) {
        setIsLoading(false);
        setMessage(response.message);
      } else {
        if (setSuccess) {
          setSuccess("The product updated succesfully.");
        }
        hideModal();
        update();
        mutate(
          process.env.NEXT_PUBLIC_API_PRODUCT_LIST_SELLER_PRODUCTS! +
            product?.sellerId
        );
        mutate(process.env.NEXT_PUBLIC_API_PRODUCT_LIST_PRODUCTS);
      }
    } catch (err) {
      setMessage("An error occurred when updating the product.");
    }
  };

  async function deleteUserImage(userId: string) {
    async function deleteUserAvatars() {
      const { data, error } = await supabase.storage
        .from("avatars")
        .list(userId);

      if (error) {
        return Promise.reject({ ok: false, error: error.message });
      } else {
        if (data) {
          const fileToRemove = data.map((file) => `${userId}/${file.name}`);
          const { error } = await supabase.storage
            .from("avatars")
            .remove(fileToRemove);

          if (error) {
            return Promise.reject({ ok: false, error: error.message });
          } else {
            return Promise.resolve({ ok: true, error: null });
          }
        } else {
          return Promise.resolve({ ok: true, error: null });
        }
      }
    }
    async function deleteUserProducts() {
      const { data, error } = await supabase.storage
        .from("products")
        .list(userId);

      if (error) {
        return Promise.reject({ ok: false, error: error.message });
      } else {
        if (data) {
          const fileToRemove = data.map((file) => `${userId}/${file.name}`);
          const { error } = await supabase.storage
            .from("products")
            .remove(fileToRemove);

          if (error) {
            return Promise.reject({ ok: false, error: error.message });
          } else {
            return Promise.resolve({ ok: true, error: null });
          }
        } else {
          return Promise.resolve({ ok: true, error: null });
        }
      }
    }

    if (session?.user.role === "SELLER") {
      return await deleteUserAvatars().then(
        async () => await deleteUserProducts()
      );
    } else {
      return await deleteUserAvatars();
    }
  }
  async function deleteProductsImage(product: Product) {
    const fileToRemove = getFilenameFromURL(product.thumbnail) + "/thumbnail";

    const { error } = await supabase.storage
      .from("products")
      .remove([fileToRemove]);

    if (error) {
      return Promise.reject({ ok: false, error: error.message });
    } else {
      return Promise.resolve({ ok: true, error: null });
    }
  }

  async function deleteProduct() {
    setIsLoading(true);
    setMessage(null);
    if (setSuccess) {
      setSuccess(null);
    }

    if (product) {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_PRODUCT_DELETE!}/${product.id}`,
          {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
          }
        );
        const response = await res.json();
        if (!response.ok) {
          setIsLoading(false);
          setMessage("An error occurred when deleting the product.");
        } else {
          await deleteProductsImage(product).then(() => {
            setIsLoading(false);
            hideModal();
            update();
            mutate(
              process.env.NEXT_PUBLIC_API_PRODUCT_LIST_SELLER_PRODUCTS! +
                product?.sellerId
            );
            mutate(process.env.NEXT_PUBLIC_API_PRODUCT_LIST_PRODUCTS);
            if (setSuccess) {
              setSuccess("The product deleted succesfully.");
            }
          });
        }
      } catch (err) {
        setIsLoading(false);
        console.error(err);
      }
    }
  }

  async function productActions(actions: string) {
    setIsLoading(true);
    setMessage(null);
    if (setSuccess) {
      setSuccess(null);
    }

    if (product) {
      try {
        const res = await fetch(process.env.NEXT_PUBLIC_API_PRODUCT_ACTIONS!, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            product: product,
            token: session?.user.token,
            actions: actions,
          }),
        });
        const response = await res.json();
        if (!response.ok) {
          setIsLoading(false);
          setMessage("An error occurred when doing this actions...");
        } else {
          setIsLoading(false);
          hideModal();
          update();
          mutate("/api/list-seller-products/" + product?.sellerId);
          mutate("/api/list-products");
          if (setSuccess) {
            setSuccess(`The product has been ${actions}ed succesfully`);
          }
        }
      } catch (err) {
        setIsLoading(false);
        console.error(err);
      }
    }
  }

  function hideModal() {
    onClose();
    reset();
  }

  if (session) {
    switch (options) {
      case "user-name":
      case "seller-name": {
        return (
          <ModalsContainer
            title="Change name"
            description="You could only change your name 2 times. Make sure the name that you entered is correct"
            onClose={hideModal}
          >
            <form
              onSubmit={handleSubmit(onUserDetailsUpdate)}
              className="flex flex-col gap-4"
            >
              <label htmlFor="name">Name</label>
              <input
                className="px-2 py-2 border border-gray-300 rounded-md"
                type="text"
                id="name"
                defaultValue={session.user.name ?? "Not setted yet"}
                {...register("personalDetails.name")}
              />
              <Button type="submit" disabled={isLoading} fullWidth>
                Save
              </Button>
            </form>
          </ModalsContainer>
        );
      }
      case "user-email":
      case "seller-email": {
        return (
          <ModalsContainer
            title="Change email"
            description="You could only change your email 1 time. Make sure the email that you entered is correct"
            onClose={hideModal}
          >
            <form
              onSubmit={handleSubmit(onUserDetailsUpdate)}
              className="flex flex-col gap-4"
            >
              <label htmlFor="email">Email</label>
              <input
                className="px-2 py-2 border border-gray-300 rounded-md"
                type="email"
                id="email"
                defaultValue={session.user.email ?? "Not setted yet"}
                {...register("personalDetails.email")}
              />
              <Button type="submit" disabled={isLoading} fullWidth>
                Save
              </Button>
            </form>
          </ModalsContainer>
        );
      }
      case "user-username":
      case "seller-username": {
        return (
          <ModalsContainer
            title="Change username"
            description="Please enter the username that would be easy to remember."
            onClose={hideModal}
          >
            <form
              onSubmit={handleSubmit(onUserDetailsUpdate)}
              className="flex flex-col gap-4"
            >
              <label htmlFor="username">Username</label>
              <input
                className="px-2 py-2 border border-gray-300 rounded-md"
                type="text"
                id="username"
                defaultValue={session.user.username ?? "Not setted yet"}
                {...register("personalDetails.username")}
              />
              <Button type="submit" disabled={isLoading} fullWidth>
                Save
              </Button>
            </form>
          </ModalsContainer>
        );
      }
      case "user-birthdate": {
        return (
          <ModalsContainer
            title="Change birthdate"
            description="Fill the input below based on your birthdate."
            onClose={hideModal}
          >
            <form
              onSubmit={handleSubmit(onUserDetailsUpdate)}
              className="flex flex-col gap-4"
            >
              <label htmlFor="birthdate">Birthdate</label>
              <input
                className="px-2 py-2 border border-gray-300 rounded-md"
                type="date"
                id="birthdate"
                {...register("personalDetails.birthdate", {
                  valueAsDate: true,
                })}
              />
              <Button type="submit" disabled={isLoading} fullWidth>
                Save
              </Button>
            </form>
          </ModalsContainer>
        );
      }
      case "user-phoneNumber":
      case "seller-phoneNumber": {
        return (
          <ModalsContainer
            title="Change phone number"
            description="Please be aware that this phone number is required for transactional purposes, so fill this using your current active phone number."
            onClose={hideModal}
          >
            <form
              onSubmit={handleSubmit(onUserDetailsUpdate)}
              className="flex flex-col gap-4"
            >
              <label htmlFor="phoneNumber">Phone Number</label>
              <input
                className="px-2 py-2 border border-gray-300 rounded-md"
                type="number"
                defaultValue={session.user.phoneNumber?.toString() || undefined}
                placeholder="08xxx"
                id="phoneNumber"
                {...register("personalDetails.phoneNumber", {
                  setValueAs: (v) => phoneNumberConverter(v),
                })}
              />
              <Button type="submit" disabled={isLoading} fullWidth>
                Save
              </Button>
            </form>
          </ModalsContainer>
        );
      }
      case "user-delete":
      case "seller-delete": {
        return (
          <ModalsContainer
            title="Delete account"
            description="Please be aware that this action cannot be undone, and your account will be deleted permanently."
            onClose={hideModal}
          >
            <div className="w-full px-2 py-2 rounded-md bg-red-950 text-white">
              <p>
                Please fill in the inputs below with your username to continue.{" "}
                <br />
                Your username is: <b>{session.user.username}</b>
              </p>
            </div>

            <form
              onSubmit={handleSubmit(onUserDelete)}
              className="flex flex-col gap-4"
            >
              <label htmlFor="username">Username</label>
              <input
                className="px-2 py-2 border border-gray-300 rounded-md"
                type="text"
                id="username"
                placeholder={session!.user!.username!}
                {...register("personalDetails.username")}
              />
              <Button
                type="submit"
                disabled={
                  isLoading ||
                  session!.user!.username !== watch("personalDetails.username")
                }
                variants="ERROR"
                fullWidth
              >
                {isLoading ? "Deleting..." : "Delete"}
              </Button>
            </form>
          </ModalsContainer>
        );
      }

      case "address-create": {
        return (
          <ModalsContainer
            title="Add address"
            description="Fill the fields below using the correct address for shipping"
            onClose={hideModal}
          >
            <form
              onSubmit={handleSubmit(onAddressSubmit)}
              className="flex flex-col gap-4"
            >
              <label htmlFor="label">Address Label</label>
              <input
                id="label"
                className="px-2 py-2 border border-gray-300 rounded-md"
                type="text"
                {...register("addressDetails.address.label")}
                required
                placeholder="Home / Office"
              />
              <label htmlFor="receiverName">Recipient Name</label>
              <input
                id="receiverName"
                className="px-2 py-2 border border-gray-300 rounded-md"
                type="text"
                {...register("addressDetails.address.receiverName")}
                required
                placeholder="Recipent name..."
              />
              <label htmlFor="receiverPhone">Recipient Phone Number</label>
              <input
                id="receiverPhone"
                className="px-2 py-2 border border-gray-300 rounded-md"
                type="number"
                {...register("addressDetails.address.receiverPhoneNumber", {
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
                {...register("addressDetails.address.fullAddress")}
                placeholder="Jl..."
                required
              />
              <Button type="submit" disabled={isLoading} fullWidth>
                Save
              </Button>
            </form>
          </ModalsContainer>
        );
      }
      case "address-update": {
        return (
          <ModalsContainer
            onClose={hideModal}
            description="Update the current address"
            title="Update Address"
          >
            <form
              onSubmit={handleSubmit(onAddressUpdate)}
              className="flex flex-col gap-4"
            >
              <label htmlFor="label">Address Label</label>
              <input
                id="label"
                className="px-2 py-2 border border-gray-300 rounded-md"
                type="text"
                defaultValue={formData?.label}
                {...register("addressDetails.address.label")}
                required
                placeholder="Home / Office"
              />
              <label htmlFor="receiverName">Recipient Name</label>
              <input
                id="receiverName"
                className="px-2 py-2 border border-gray-300 rounded-md"
                type="text"
                defaultValue={formData?.receiverName}
                {...register("addressDetails.address.receiverName")}
                required
                placeholder="Recipent name..."
              />
              <label htmlFor="receiverPhone">Recipient Phone Number</label>
              <input
                id="receiverPhone"
                className="px-2 py-2 border border-gray-300 rounded-md"
                type="number"
                defaultValue={formData?.receiverPhoneNumber}
                {...register("addressDetails.address.receiverPhoneNumber", {
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
                defaultValue={formData?.fullAddress}
                {...register("addressDetails.address.fullAddress")}
                placeholder="Jl..."
                required
              />
              <Button type="submit" fullWidth disabled={isLoading}>
                Save
              </Button>
            </form>
          </ModalsContainer>
        );
      }
      case "address-delete": {
        return (
          <ModalsContainer
            title="Delete address"
            description="Are you sure want to delete this address?"
            onClose={hideModal}
          >
            <form
              className="flex flex-col gap-4"
              onSubmit={handleSubmit(onAddressDelete)}
            >
              <Button
                type="submit"
                variants="ERROR"
                disabled={isLoading}
                fullWidth
              >
                Delete
              </Button>
              <Button
                variants="SECONDARY"
                type="button"
                disabled={isLoading}
                onClick={hideModal}
                fullWidth
              >
                Cancel
              </Button>
            </form>
          </ModalsContainer>
        );
      }

      case "security-password-change":
      case "seller-password-change": {
        return (
          <ModalsContainer
            onClose={hideModal}
            title="Change password"
            description="Please use the password that are easy to remember"
          >
            <form
              className="flex flex-col gap-4"
              onSubmit={handleSubmit(onSecurityPasswordChanged)}
            >
              <label htmlFor="current-password">Current password</label>
              <div className="w-full flex flex-row gap-4 rounded-md border border-gray-300">
                <input
                  id="current-password"
                  placeholder="Your current password..."
                  type={showPassword ? "text" : "password"}
                  className="w-full px-2 py-2 border-none"
                  disabled={isLoading}
                  required
                  {...register("security.password.currentPassword")}
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

              <label htmlFor="new-password">New password</label>
              <div className="w-full flex flex-row gap-4 rounded-md border border-gray-300">
                <input
                  id="new-password"
                  placeholder="Your new password..."
                  type={showPassword ? "text" : "password"}
                  className="w-full px-2 py-2 border-none"
                  disabled={isLoading}
                  required
                  {...register("security.password.newPassword")}
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

              <label htmlFor="new-password-confirmations">
                New password confirmations
              </label>
              <div className="w-full flex flex-row gap-4 rounded-md border border-gray-300">
                <input
                  id="new-password-confirmations"
                  placeholder="Your new password..."
                  type={showPassword ? "text" : "password"}
                  className="w-full px-2 py-2 border-none"
                  disabled={isLoading}
                  required
                  {...register("security.password.newPasswordConfirmations")}
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

              <Button
                type="submit"
                fullWidth
                disabled={
                  isLoading ||
                  watch("security.password.newPassword") !==
                    watch("security.password.newPasswordConfirmations") ||
                  watch("security.password.currentPassword")?.length === 0
                }
              >
                Save
              </Button>
            </form>
          </ModalsContainer>
        );
      }

      case "store-address": {
        return (
          <ModalsContainer
            title="Change store address"
            description="Please enter your current store address"
            onClose={hideModal}
          >
            <form
              onSubmit={handleSubmit(onUserDetailsUpdate)}
              className="flex flex-col gap-4"
            >
              <label htmlFor="store-address">Store address</label>
              <input
                className="px-2 py-2 border border-gray-300 rounded-md"
                type="text"
                id="store-address"
                defaultValue={session.user.storeAddress ?? "Not setted yet"}
                {...register("personalDetails.storeAddress")}
              />
              <Button type="submit" disabled={isLoading} fullWidth>
                Save
              </Button>
            </form>
          </ModalsContainer>
        );
      }

      case "product-edit": {
        return (
          <ModalsContainer
            title="Edit Product"
            description="To make the product more appealing, fill out the following fields with precise information."
            onClose={hideModal}
          >
            <form
              className="flex flex-col gap-4"
              onSubmit={handleSubmit(onProductUpdate)}
            >
              <div className="flex flex-col gap-2">
                <label htmlFor="product-name">Product name</label>
                <input
                  type="text"
                  id="product-name"
                  defaultValue={product?.name ?? ""}
                  {...register("product.name")}
                  className={inputStyles}
                />
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="product-descriptions">
                  Product descriptions
                </label>
                <textarea
                  id="product-descriptions"
                  rows={2}
                  defaultValue={product?.descriptions ?? ""}
                  {...register("product.descriptions")}
                  className={inputStyles}
                />
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="product-price">Product price</label>
                <input
                  type="number"
                  id="product-price"
                  defaultValue={product?.price ?? ""}
                  className={inputStyles}
                  {...register("product.price", {
                    setValueAs: (v) => parseInt(v),
                  })}
                />
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="product-stock">Product stock</label>
                <input
                  type="number"
                  id="product-stock"
                  defaultValue={product?.stock ?? ""}
                  className={inputStyles}
                  {...register("product.stock", {
                    setValueAs: (v) => parseInt(v),
                  })}
                />
              </div>

              <Button
                type="submit"
                variants="PRIMARY"
                fullWidth
                disabled={isLoading}
              >
                {isLoading ? "Saving..." : "Save"}
              </Button>
            </form>
          </ModalsContainer>
        );
      }
      case "product-delete": {
        return (
          <ModalsContainer
            onClose={hideModal}
            title="Delete product"
            description="Are you sure want to delete this product?"
          >
            <div className="w-full flex flex-row gap-4">
              {!isLoading && (
                <>
                  <Button
                    variants="ERROR"
                    fullWidth
                    onClick={() => deleteProduct()}
                  >
                    Delete
                  </Button>
                  <Button variants="SECONDARY" fullWidth onClick={hideModal}>
                    Cancel
                  </Button>
                </>
              )}
              {isLoading && (
                <Button disabled fullWidth>
                  Deleting...
                </Button>
              )}
            </div>
          </ModalsContainer>
        );
      }
      case "product-approve": {
        return (
          <ModalsContainer
            onClose={hideModal}
            title="Approve Product"
            description="Are you sure want to approve this product?"
          >
            <div className="w-full flex flex-row gap-4">
              {!isLoading && (
                <>
                  <Button
                    variants="PRIMARY"
                    fullWidth
                    onClick={() => productActions("approve")}
                  >
                    Approve
                  </Button>
                  <Button variants="SECONDARY" fullWidth onClick={hideModal}>
                    Cancel
                  </Button>
                </>
              )}
              {isLoading && (
                <Button disabled fullWidth>
                  Approving...
                </Button>
              )}
            </div>
          </ModalsContainer>
        );
      }
      case "product-reject": {
        return (
          <ModalsContainer
            onClose={hideModal}
            title="Reject Product"
            description="Are you sure want to reject this product?"
          >
            <div className="w-full flex flex-row gap-4">
              {!isLoading && (
                <>
                  <Button
                    variants="ERROR"
                    fullWidth
                    onClick={() => productActions("reject")}
                  >
                    Reject
                  </Button>
                  <Button variants="SECONDARY" fullWidth onClick={hideModal}>
                    Cancel
                  </Button>
                </>
              )}
              {isLoading && (
                <Button disabled fullWidth>
                  Rejecting...
                </Button>
              )}
            </div>
          </ModalsContainer>
        );
      }
    }
  }
}
