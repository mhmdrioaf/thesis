"use client";

import { XMarkIcon } from "@heroicons/react/24/solid";
import { useEffect, useState } from "react";

interface SnackbarVariant {
  PRIMARY: {
    CONTAINER: string;
    ICON: string;
  };
  ERROR: {
    CONTAINER: string;
    ICON: string;
  };
  SUCCESS: {
    CONTAINER: string;
    ICON: string;
  };
  HIDDEN: {
    CONTAINER: string;
    ICON: string;
  };
}

interface SnackBarProps {
  variant: keyof SnackbarVariant;
  message: string;
  autoHide?: boolean;
  duration?: number;
}

export default function Snackbar({
  variant = "PRIMARY",
  autoHide = false,
  duration = 3000,
  message,
}: SnackBarProps) {
  const [hide, setHide] = useState(false);

  const snackbarBaseStyle =
    "w-1/2 px-2 py-2 rounded-lg flex justify-between items-center fixed bottom-4 left-8 mx-auto z-40 bg-opacity-95 backdrop-blur-sm ";
  const snackbarIconBaseStyle = "w-8 h-8 cursor-pointer ";
  const snackbarStyles: SnackbarVariant = {
    PRIMARY: {
      CONTAINER: snackbarBaseStyle + "border border-gray-300 text-primary",
      ICON: snackbarIconBaseStyle + "text-primary",
    },
    ERROR: {
      CONTAINER: snackbarBaseStyle + "bg-red-950 text-white",
      ICON: snackbarIconBaseStyle + "text-white",
    },
    SUCCESS: {
      CONTAINER: snackbarBaseStyle + "bg-primary text-white",
      ICON: snackbarIconBaseStyle + "text-white",
    },
    HIDDEN: {
      CONTAINER: "hidden",
      ICON: "hidden",
    },
  };

  useEffect(() => {
    if (autoHide) {
      setTimeout(() => {
        setHide(true);
      }, duration);
    }
  }, [autoHide, duration]);

  return !hide ? (
    <div className={snackbarStyles[variant].CONTAINER}>
      <p>{message}</p>
      <XMarkIcon
        className={snackbarStyles[variant].ICON}
        onClick={() => setHide(true)}
      />
    </div>
  ) : null;
}
