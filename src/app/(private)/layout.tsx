import { sans } from "@/styles/fonts";
import "@/styles/globals.css";
import type { Metadata } from "next";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: {
    template: "%s | FoodList",
    default: "My lists | FoodList",
  },
  description: "Generated by create next app",
};

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={sans.className}>
        {children}
        <Toaster
          theme="dark"
          toastOptions={{ duration: 6000 }}
          style={{ pointerEvents: "auto" }}
          richColors
        />
      </body>
    </html>
  );
}
