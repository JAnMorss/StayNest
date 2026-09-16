import type { Metadata } from "next";
import "./globals.css";
import { Nunito } from "next/font/google";
import Navbar from "./components/navbar/Navbar";
import ClientOnly from "./components/ClientOnly";
import LoginModal from "./components/modals/LoginModal";
import RegisterModal from "./components/modals/RegisterModal";
import ToasterProvider from "./providers/ToasterProvider";
import TanstackProvider from "./components/providers/tanstack-provider";
import RentModal from "./components/modals/RentModal";

export const metadata: Metadata = {
  title: "StayNest",
  description:
    "Find and book unique vacation homes, apartments, and stays for your next trip with StayNest.",
};

const font = Nunito({
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={font.className}>
        <TanstackProvider>
          <ClientOnly>
            <ToasterProvider />
            <RentModal />
            <LoginModal />
            <RegisterModal />
            <Navbar />
          </ClientOnly>
          {children}
        </TanstackProvider>
      </body>
    </html>
  );
}
