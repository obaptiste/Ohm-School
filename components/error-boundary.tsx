"use client";

import React from "react";
import { Alert } from "./ui";

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <Alert className="m-4">
          <h2 className="font-semibold">Something went wrong</h2>
          <p className="mt-2">
            {this.state.error?.message || "An unexpected error occurred. Please try refreshing the page."}
          </p>
        </Alert>
      );
    }

    return this.props.children;
  }
}
