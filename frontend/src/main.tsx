import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css"; // Import Tailwind CSS
import { AuthProvider } from "./context/AuthContext";
import "./styles/fonts.css";
import "./styles/globals.css";
import Providers from "./components/providers";
import { Toaster } from "sonner";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Providers>
      <AuthProvider>
        <App />
      </AuthProvider>
      <Toaster richColors closeButton />
    </Providers>
  </React.StrictMode>
);
