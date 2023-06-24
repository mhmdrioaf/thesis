import { ROUTES } from "@/lib/constants";
import LinkButton from "./LinkButton";

export function AuthGroupButton() {
  return (
    <div className="flex flex-row gap-4 justify-between">
      <LinkButton href={ROUTES.AUTH.LOGIN} name="Login" />
      <div className="h-auto w-px bg-primary rounded-lg" />
      <LinkButton
        href={ROUTES.AUTH.REGISTER}
        name="Daftar"
        variant="outlined"
      />
    </div>
  );
}
