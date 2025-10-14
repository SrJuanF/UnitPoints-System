"use client";

import { useAuth } from "@/hooks/core/use-auth";
import { LoadingScreen } from "@/components/loading-screen";

interface AuthLoadingProviderProps {
  children: React.ReactNode;
}

export function AuthLoadingProvider({ children }: AuthLoadingProviderProps) {
  const { isLoading } = useAuth();

  if (isLoading) {
    return (
      <LoadingScreen 
        message="Verificando autenticación..." 
        fullScreen={true} 
      />
    );
  }

  return <>{children}</>;
}