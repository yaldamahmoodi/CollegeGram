import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "@/assets/styles/index.css";
import "@/assets/styles/fonts.css";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import AppRoutes from "./routes/AppRoutes";
import { AuthProvider } from "@/context/AuthProvider";
import ToastContainer from "@components/Toast";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
        <ToastContainer />
      </BrowserRouter>
    </QueryClientProvider>
  </StrictMode>
);
