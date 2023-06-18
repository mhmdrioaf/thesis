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

type Product = {
  id: string;
  name: string;
  price: number;
  imgURL: string;
  category?: string;
  desc?: string;
};
