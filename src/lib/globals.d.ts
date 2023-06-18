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

type GlobalStateContextType = {
  drawerState: {
    drawerOpen: boolean;
    setDrawerOpen: React.Dispatch<React.SetStateAction<boolean>>;
  };
};
