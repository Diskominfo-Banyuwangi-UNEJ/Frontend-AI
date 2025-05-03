// import { StrictMode } from "react";
// import { createRoot } from "react-dom/client";
// import App from "./App.jsx";
// import "./index.css";
// import "leaflet/dist/leaflet.css";

// import { AuthProvider } from "./contexts/auth-context";
// import { ThemeProvider } from "./contexts/theme-context";

// createRoot(document.getElementById("root")).render(
//     <StrictMode>
//         <ThemeProvider storageKey="theme">
//             <AuthProvider>
//                 <App />
//             </AuthProvider>
//         </ThemeProvider>
//     </StrictMode>,
// );

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import "leaflet/dist/leaflet.css";

import { ThemeProvider } from "./contexts/theme-context"; // Keep ThemeProvider

createRoot(document.getElementById("root")).render(
    <StrictMode>
        <ThemeProvider storageKey="theme">
            <App />
        </ThemeProvider>
    </StrictMode>,
);
