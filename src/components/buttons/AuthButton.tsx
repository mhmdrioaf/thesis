import LinkButton from "./LinkButton";

export function AuthGroupButton() {
  return (
    <div className="flex flex-row gap-4 justify-between">
      <LinkButton href="/auth/login" name="Login" />
      <div className="h-auto w-px bg-primary rounded-lg" />
      <LinkButton href="/auth/register" name="Daftar" variant="outlined" />
    </div>
  );
}
