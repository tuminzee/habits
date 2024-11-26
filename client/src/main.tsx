import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "@/index.css";
import App from "@/app";
import { ClerkLoaded, ClerkProvider } from "@clerk/clerk-react";
import { Toaster } from "@/components/ui/toaster";

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ClerkProvider publishableKey={PUBLISHABLE_KEY} afterSignOutUrl="/">
      <ClerkLoaded>
        <App />
      </ClerkLoaded>
      <Toaster />
    </ClerkProvider>
  </StrictMode>
);
