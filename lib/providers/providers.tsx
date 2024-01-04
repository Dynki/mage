"use client";

import * as React from "react";

import { ThemeProvider } from "next-themes";

import AuthContext from "./AuthContext";
import { Web3Modal } from "./Web3ModalContext";

export function Providers({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <Web3Modal>
        <AuthContext>
          {mounted && children}
        </AuthContext>
      </Web3Modal>
    </ThemeProvider>
  );
}
