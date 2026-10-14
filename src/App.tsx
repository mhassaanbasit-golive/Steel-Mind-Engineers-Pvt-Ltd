import React from "react";
import { BrowserRouter } from "react-router-dom";
import { AppRoutes } from "./routes.tsx";
import { PageTransitionProvider } from "./context/PageTransitionContext.tsx";

export default function App() {
  return (
    <BrowserRouter>
      <PageTransitionProvider>
        <AppRoutes />
      </PageTransitionProvider>
    </BrowserRouter>
  );
}
