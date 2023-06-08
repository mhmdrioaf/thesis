import "@/app/globals.css";
import { Open_Sans } from "next/font/google";
import Header from "@/components/header/Header";

const open_sans = Open_Sans({ subsets: ["latin"] });

export const metadata = {
  title: "SMKS Korporasi Garut",
  description: "Official website of SMKS Korporasi Garut",
};

const tabs = [
  { name: "Home", route: "/", id: "home" },
  { name: "About", route: "/about", id: "about" },
  { name: "Help", route: "/help", id: "help" },
];

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={open_sans.className}>
        <Header headerTabs={tabs} />
        {children}
      </body>
    </html>
  );
}
