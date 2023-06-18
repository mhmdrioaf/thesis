import Link from "next/link";

export default function LinkButton({
  href,
  name,
  variant,
}: {
  href: string;
  name: string;
  variant?: string;
}) {
  const styles = {
    outlined:
      "border border-primary text-primary hover:bg-primary hover:text-white rounded-lg px-2 py-2",
    filled:
      "bg-primary bg-opacity-80 text-white hover:bg-opacity-100 rounded-lg px-2 py-2",
  };
  return (
    <Link
      href={href}
      className={
        !variant
          ? styles.filled
          : variant === "outlined"
          ? styles.outlined
          : styles.filled
      }
    >
      {name}
    </Link>
  );
}
