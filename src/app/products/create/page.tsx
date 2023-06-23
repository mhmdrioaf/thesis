import Container from "@/components/container/Container";
import AddProductForm from "@/components/forms/AddProductForm";

export default function CreateProduct() {
  return (
    <Container className="flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <p className="text-2xl text-primary">Add new product</p>
        <p className="text-neutral-500">Please fill all the required fields.</p>
      </div>
      <AddProductForm />
    </Container>
  );
}
