
"use client";
import "@/css/satoshi.css";
import "@/css/style.css";
import React, { useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import useAuthStore from "@/store/authStore";
import { useRouter, usePathname } from "next/navigation";
import OverlayLoaderContextProvider from "../contexts/OverlayLoaderContext";
import OverlayLoader from "../components/Loader/OverlayLoader";

const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { user, token, isLoading, getProfile } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();
  const [isInitialized, setIsInitialized] = useState(false);
  const [isAuthChecking, setIsAuthChecking] = useState(true);

  // Initialize auth state on mount
  useEffect(() => {
    const initializeAuth = async () => {
      setIsAuthChecking(true);

      if (token && !user) {
        try {
          await getProfile();
        } catch (error) {
          console.error("Failed to get profile:", error);
        }
      }
      setIsInitialized(true);
      setIsAuthChecking(false);
    };

    initializeAuth();
  }, [token, user, getProfile]);

  // Handle routing logic after initialization
  useEffect(() => {
    if (!isInitialized || isLoading || isAuthChecking) {
      return;
    }

    const isSignInPage = pathname === "/auth/signin";
    const isAuthenticated = token && user?.role === "admin";

 
    if (isSignInPage) {
      if (isAuthenticated) {
        router.replace("/");
      }
    } else {
      if (!isAuthenticated) {
        router.replace("/auth/signin");
      }
    }
  }, [user, token, pathname, router, isInitialized, isLoading, isAuthChecking]);

  const isSignInPage = pathname === "/auth/signin";
  const isAuthenticated = token && user?.role === "admin";

  // Render logic
  if (isSignInPage) {
    return <>{children}</>;
  }

  // For protected routes, only render if authenticated
  if (isAuthenticated) {
    return <>{children}</>;
  }

  // Show loader while redirecting to signin
  return (
    <div className="flex min-h-screen items-center justify-center">
      <OverlayLoader />
    </div>
  );
};

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body suppressHydrationWarning={true}>
        <OverlayLoaderContextProvider>
          <ToastContainer position="top-right" autoClose={3000} />
          <PrivateRoute>{children}</PrivateRoute>
          <OverlayLoader />
        </OverlayLoaderContextProvider>
      </body>
    </html>
  );
}
