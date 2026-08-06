import type { Metadata } from "next";
import "./globals.css";
import { Nunito } from "next/font/google";
import Navbar from "./components/navbar/Navbar";

export const metadata: Metadata = {
  title: "StayNest",
  description: "Find and book unique vacation homes, apartments, and stays for your next trip with StayNest.",
};

const font = Nunito({
  subsets: ["latin"],
})

export default function RootLayout({
  children
}: LayoutProps<"/">
) {
  return (
    <html lang="en"
    >
      <body className={font.className}>
        <Navbar />
        {children}
      </body>
    </html>
  );
}
