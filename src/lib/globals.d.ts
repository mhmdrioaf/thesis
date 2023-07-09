type Tab = {
  name?: string;
  route?: string;
  id?: string;
  element?: ReactNode;
};

type CarouselAsset = {
  id: string;
  img: string;
  title?: string;
  desc?: string;
};

type SocialMedia = {
  id: string;
  url: string;
  iconURL: string;
};

type GlobalStateContextType = {
  drawerState: {
    drawerOpen: boolean;
    setDrawerOpen: React.Dispatch<React.SetStateAction<boolean>>;
  };
};

type User = {
  name: string;
  username: string;
  email: string;
};

type Product = {
  id: number;
  name: string;
  price: number;
  thumbnail: string;
  images?: string[];
  descriptions: string;
  sellerId: string;
  stock: number;
  status?: ProductStatus;
  createdAt: Date;
  approvedAt?: Date;
  isFeatured: Boolean;
  seller: User;
};

enum ProductStatus {
  SUBMITTED = "SUBMITTED",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
}

type NewProduct = {
  name: string;
  description: string;
  price: number;
  stock: number;
};

type NewUser = {
  email: string;
  username: string;
  name: string;
  password: string;
};

type Address = {
  id?: string;
  label: string;
  note?: string;
  fullAddress: string;
  receiverName: string;
  receiverPhoneNumber: string;
  receiverId: string;
  primaryAddressFor?: string;
};
