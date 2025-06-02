import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css"; // Import Tailwind CSS
import { AuthProvider } from "./context/AuthContext";
import "./styles/fonts.css";
import "./styles/globals.css";
import Providers from "./components/providers";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Providers>
      <AuthProvider>
        <App />
      </AuthProvider>
    </Providers>
  </React.StrictMode>
);
