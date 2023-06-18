import "@/app/globals.css";
import Footer from "@/components/footer/Footer";
import Header from "@/components/header/Header";
import { HOME_TABS, MARKETPLACE_TABS } from "@/lib/constants";
import { GlobalStateContextProvider } from "@/lib/contexts/GlobalState";
import { Open_Sans } from "next/font/google";

const open_sans = Open_Sans({ subsets: ["latin"] });

export const metadata = {
  title: "SMKS Korporasi Garut",
  description: "Official website of SMKS Korporasi Garut",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={open_sans.className}>
        <GlobalStateContextProvider>
          <Header homeTabs={HOME_TABS} marketplaceTabs={MARKETPLACE_TABS} />
          {children}
          <Footer />
        </GlobalStateContextProvider>
      </body>
    </html>
  );
}
