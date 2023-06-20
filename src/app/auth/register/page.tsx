import Container from "@/components/container/Container";
import RegisterForm from "@/components/forms/RegisterForm";

export default function Register() {
  return (
    <Container className="flex flex-col gap-8">
      <div className="w-full flex flex-col gap-2">
        <p className="text-2xl text-primary font-bold">Register</p>
        <p className="text-neutral-500">
          Please register using your active email.
        </p>
      </div>
      <RegisterForm />
    </Container>
  );
}
