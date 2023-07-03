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
  description: string;
  user?: User[];
};

type NewProduct = {
  name: string;
  description: string;
  price: number;
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
  receiverPhone: string;
  receiverId: string;
  mainAddressFor?: string;
};
