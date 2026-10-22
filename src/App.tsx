import React from "react";
import { BrowserRouter } from "react-router-dom";
import { AppRoutes } from "./routes.tsx";
import { PageTransitionProvider } from "./context/PageTransitionContext.tsx";
import { ErrorBoundary } from "./components/common/ErrorBoundary.tsx";
import { Loader } from "./components/layout/Loader.tsx";

export default function App() {
  return (
    <ErrorBoundary isRoot={true}>
      <Loader />
      <BrowserRouter>
        <PageTransitionProvider>
          <AppRoutes />
        </PageTransitionProvider>
      </BrowserRouter>
    </ErrorBoundary>
  );
}
