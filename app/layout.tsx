// app/layout.tsx
import "./globals.css";
import { Inter } from "next/font/google";
import Layout from "../lib/components/layout/Layout";
import { Providers } from "../lib/providers/providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "MAGE",
  description: "Defi NFT Platform",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <Layout>{children}</Layout>
        </Providers>
      </body>
    </html>
  );
}
