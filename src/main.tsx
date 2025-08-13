import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "@/assets/styles/index.css";
import "@/assets/styles/fonts.css";
import { BrowserRouter as Router } from "react-router-dom";
import AppRoutes from "@/routes/AppRoutes";
import MainAuthLayout from "./pages/MainAuthLayout";
import AuthContainer from "./components/AuthContainer";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Router>
      <MainAuthLayout>
        <AuthContainer>
          <AppRoutes />
        </AuthContainer>
      </MainAuthLayout>
    </Router>
  </StrictMode>
);
