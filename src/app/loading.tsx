import Container from "@/components/container/Container";
import LoadingSpinner from "@/components/indicators/LoadingSpinner";

export default function Loading() {
  return (
    <Container className="flex items-center justify-center min-h-screen">
      <LoadingSpinner />
    </Container>
  );
}
