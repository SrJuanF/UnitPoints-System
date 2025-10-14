"use client";

import { RegistrationModal } from "./registration-modal";
import { useAuth } from "@/hooks/core/use-auth";
import * as UserManager from "@/hooks/contracts-frontend/scripts/userManager";
import * as CompanyManager from "@/hooks/contracts-frontend/scripts/companyManager";
import {useState, useEffect} from "react";
import { usePathname } from "next/navigation";

export function RegistrationModalProvider() {
  const pathname = usePathname();
  const hideOnTestPage = (pathname || "").startsWith("/test");
  const { 
    showRegistrationModal, 
    setShowRegistrationModal,
    setUserRole,
    userAddress 
  } = useAuth();

  const [isUserRegistered, setIsUserRegistered] = useState(showRegistrationModal);

  useEffect(() => {
    setIsUserRegistered(showRegistrationModal);
  }, [showRegistrationModal]);

  const { registerUser } = UserManager.useRegisterUser();
  const { registerCompany } = CompanyManager.useRegisterCompany();

  const handleUserRegistration = async () => {
    if (!userAddress) {
      throw new Error("No wallet connected");
    }
    
    // Ejecutar la transacción de registro
    const result = await registerUser();
    
    // Guardar el rol en localStorage para cache inmediato
    if (userAddress) {
      setUserRole("user");
      localStorage.setItem(userAddress, "user");
    }
    
    return result;
  };

  const handleCompanyRegistration = async (name: string, description: string) => {
    if (!userAddress) {
      throw new Error("No wallet connected");
    }
    
    // Ejecutar la transacción de registro
    const result = await registerCompany(name, description);
    
    // Guardar el rol en localStorage para cache inmediato
    if (userAddress) {
      setUserRole("company");
      localStorage.setItem(userAddress, "company");
    }
    
    return result;
  };

  const handleCloseModal = () => {
    setShowRegistrationModal(false);
  };


  return (
    <RegistrationModal
      isOpen={isUserRegistered && !hideOnTestPage}
      onClose={handleCloseModal}
      onRegisterUser={async () => { await handleUserRegistration(); }}
      onRegisterCompany={async (name, description) => { await handleCompanyRegistration(name, description); }}
    />
  );
}