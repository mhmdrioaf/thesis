"use client";

import { useSearchParams } from "next/navigation";
import Snackbar from "../snackbars/Snackbar";

export default function ShowMessage() {
  const searchParams = useSearchParams();

  const message = searchParams.get("message");

  if (message) {
    return (
      <Snackbar variant="SUCCESS" message={message} autoHide duration={5000} />
    );
  } else {
    return null;
  }
}
