import React from "react";
import ReactDOM from "react-dom/client";
import { CssBaseline } from "@mui/material";
import { RouterProvider } from "react-router-dom";
import router from "./router.jsx";
import "./index.css";
import { AuthContextProvider } from "./context/AuthContext.jsx";
import { Toaster } from "react-hot-toast";
ReactDOM.createRoot(document.getElementById("root")).render(
    <AuthContextProvider>
      <Toaster position="top-right" containerStyle={{ top: 80 }} />
      <CssBaseline />
      <RouterProvider router={router} />
    </AuthContextProvider>
);

