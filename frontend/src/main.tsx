import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css"; // Import Tailwind CSS
import { AuthProvider } from "./context/AuthContext";
import './styles/fonts.css';
import './styles/globals.css';

ReactDOM.createRoot(document.getElementById("root")!).render(
<React.StrictMode>
<AuthProvider>
    <App />
  </AuthProvider>
</React.StrictMode>
);