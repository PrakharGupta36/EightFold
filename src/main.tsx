// Fonts (load before Tailwind)
import '@fontsource-variable/jetbrains-mono';
import "@fontsource-variable/space-grotesk";
import "@fontsource-variable/inter";

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";

// Mount app
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
