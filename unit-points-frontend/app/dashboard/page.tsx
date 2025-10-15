"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuth, useCompany } from "@/hooks";
import { Navbar } from "@/components/navbar";
import { LoadingScreen } from "@/components/loading-screen";
import { UserDashboard } from "@/app/dashboard/user-dashboard";
import { CompanyDashboard } from "@/app/dashboard/company-dashboard";

export default function DashboardPage() {
  const {
    userRole,
    authenticated,
    ready,
    isLoading,
    userAddress,
    email,
    userId,
  } = useAuth();
  
  const router = useRouter();

  // Redirect to home if not authenticated
  useEffect(() => {
    if (!ready) return; // Wait for Privy to initialize
    
    if (!authenticated) {
      router.push("/");
    }
  }, [authenticated, ready, router]);

  // Show loading screen while Privy initializes
  if (!ready || isLoading || !userRole) {
    return (
      <main className="min-h-screen bg-background">
        <Navbar />
        <LoadingScreen
          message="Inicializando autenticación..."
          fullScreen={false}
        />
      </main>
    );
  }


  // Determine if user is a company
  const isCompany = userRole === "company";

  return (
    <main className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <Navbar />
      <div className="container px-4 py-20 mx-auto animate-fade-in max-w-6xl">
        <h1 className="font-display text-4xl font-bold mb-8">
          {isCompany ? "Company Dashboard" : "Dashboard"}
        </h1>
        
        {/* Render appropriate dashboard based on user role */}
        {isCompany ? (
          <CompanyDashboard
            userAddress={userAddress}
            email={email}
            userId={userId}
          />
        ) :userRole === "user" ? (
          <UserDashboard
            userAddress={userAddress}
            email={email}
            userId={userId}
          />
        ) : (
          <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-semibold text-foreground">
                Rol de Usuario No Reconocido
              </h2>
              <p className="text-muted-foreground max-w-md">
                Tu cuenta no tiene un rol válido asignado. Por favor, logueate con un email o wallet válido.
              </p>
            </div>
          </div>
        )}

      </div>
    </main>
  );
}