import Card from "@/components/card/Card";
import Container from "@/components/container/Container";
import AuthForm from "@/components/forms/AuthForm";

export default function Login() {
  return (
    <Container className="w-full min-h-screen flex justify-center items-center">
      <Card className="w-full lg:w-2/3 px-8 py-8 cursor-auto gap-8 ">
        <div className="w-full flex flex-col gap-2">
          <p className="text-2xl text-primary font-bold">Login</p>
          <p className="text-neutral-500">
            Please enter your email or username and password to log in.
          </p>
        </div>
        <AuthForm />
      </Card>
    </Container>
  );
}
