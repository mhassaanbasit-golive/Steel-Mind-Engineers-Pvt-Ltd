import React, { Component, ErrorInfo, ReactNode } from "react";
import { Header } from "../layout/Header.tsx";
import { Footer } from "../layout/Footer.tsx";

interface Props {
  children: ReactNode;
  isRoot?: boolean;
  resetKey?: string;
}

interface State {
  hasError: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(_: Error): State {
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.warn("[ErrorBoundary] Caught error:", error, errorInfo);

    // Chunk error reload recovery
    const msg = error?.message || "";
    if (
      msg.includes("Failed to fetch dynamically imported module") ||
      msg.includes("error loading dynamically imported module") ||
      msg.includes("Importing a module script failed")
    ) {
      try {
        window.location.reload();
      } catch {}
    }
  }

  public componentDidUpdate(prevProps: Props) {
    if (this.props.resetKey !== prevProps.resetKey && this.state.hasError) {
      this.setState({ hasError: false });
    }
  }

  private handleTryAgain = () => {
    try {
      sessionStorage.removeItem("chunk_reloaded");
    } catch {}
    if (typeof window !== "undefined") {
      window.location.reload();
    } else {
      this.setState({ hasError: false });
    }
  };

  public render() {
    if (this.state.hasError) {
      const content = (
        <div className="w-full min-h-[60vh] flex flex-col items-center justify-center text-center px-6 py-20 bg-white">
          <h1
            className="font-bold text-[var(--ink)] leading-[1.15] mb-4"
            style={{ fontSize: "var(--fs-h2)" }}
          >
            Page Unavailable
          </h1>
          <p
            className="text-[var(--grey)] max-w-[500px] mb-8"
            style={{ fontSize: "var(--fs-body)" }}
          >
            The message did not send or the page could not load. Please call +92 300 4253966 or visit the homepage.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              onClick={this.handleTryAgain}
              className="btn btn-primary btn-sm"
            >
              Try Again
            </button>
            <a href="/" className="btn btn-outline btn-sm">
              Go to Home
            </a>
          </div>
        </div>
      );

      if (this.props.isRoot) {
        return (
          <div className="min-h-screen flex flex-col bg-white">
            <Header />
            <main className="flex-1 pt-[var(--nav-h)]">{content}</main>
            <Footer />
          </div>
        );
      }

      return content;
    }

    return this.props.children;
  }
}
