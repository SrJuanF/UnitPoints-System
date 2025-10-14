"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Building2, Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface RegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRegisterUser: () => Promise<void>;
  onRegisterCompany: (name: string, description: string) => Promise<void>;
}

export function RegistrationModal({
  isOpen,
  onClose,
  onRegisterUser,
  onRegisterCompany,
}: RegistrationModalProps) {
  const [selectedType, setSelectedType] = useState<"user" | "company" | null>(null);
  const [companyName, setCompanyName] = useState("");
  const [companyDescription, setCompanyDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleUserRegistration = async () => {
    try {
      setIsLoading(true);
      await onRegisterUser();
      toast({
        title: "¡Registro exitoso!",
        description: "Te has registrado como usuario correctamente.",
      });
      onClose();
    } catch (error) {
      console.error("Error registering user:", error);
      toast({
        title: "Error en el registro",
        description: "Hubo un problema al registrarte como usuario. Inténtalo de nuevo.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCompanyRegistration = async () => {
    if (!companyName.trim() || !companyDescription.trim()) {
      toast({
        title: "Campos requeridos",
        description: "Por favor completa el nombre y descripción de la empresa.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsLoading(true);
      await onRegisterCompany(companyName.trim(), companyDescription.trim());
      toast({
        title: "¡Registro exitoso!",
        description: "Tu empresa ha sido registrada correctamente.",
      });
      onClose();
    } catch (error) {
      console.error("Error registering company:", error);
      toast({
        title: "Error en el registro",
        description: "Hubo un problema al registrar tu empresa. Inténtalo de nuevo.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const resetModal = () => {
    setSelectedType(null);
    setCompanyName("");
    setCompanyDescription("");
    setIsLoading(false);
  };

  const handleClose = () => {
    resetModal();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-bold">
            ¡Bienvenido a UnitPoints!
          </DialogTitle>
        </DialogHeader>

        {!selectedType ? (
          <div className="space-y-4">
            <p className="text-center text-muted-foreground mb-6">
              Para comenzar, selecciona cómo te quieres registrar:
            </p>
            
            <div className="grid grid-cols-1 gap-4">
              <Card 
                className="cursor-pointer hover:bg-accent transition-colors border-2 hover:border-primary"
                onClick={() => setSelectedType("user")}
              >
                <CardHeader className="text-center pb-2">
                  <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-2">
                    <User className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle className="text-lg">Usuario</CardTitle>
                  <CardDescription>
                    Participa en eventos y gana puntos
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card 
                className="cursor-pointer hover:bg-accent transition-colors border-2 hover:border-primary"
                onClick={() => setSelectedType("company")}
              >
                <CardHeader className="text-center pb-2">
                  <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-2">
                    <Building2 className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle className="text-lg">Empresa</CardTitle>
                  <CardDescription>
                    Crea eventos y gestiona actividades
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>
          </div>
        ) : selectedType === "user" ? (
          <div className="space-y-6">
            <div className="text-center">
              <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <User className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Registro como Usuario</h3>
              <p className="text-muted-foreground">
                Podrás participar en eventos, completar actividades y ganar puntos UPT.
              </p>
            </div>

            <div className="flex gap-3">
              <Button 
                variant="outline" 
                onClick={() => setSelectedType(null)}
                disabled={isLoading}
                className="flex-1"
              >
                Volver
              </Button>
              <Button 
                onClick={handleUserRegistration}
                disabled={isLoading}
                className="flex-1"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Registrando...
                  </>
                ) : (
                  "Registrarse"
                )}
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="text-center">
              <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <Building2 className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Registro como Empresa</h3>
              <p className="text-muted-foreground">
                Podrás crear eventos, gestionar actividades y distribuir puntos UPT.
              </p>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="company-name">Nombre de la empresa *</Label>
                <Input
                  id="company-name"
                  placeholder="Ej: Mi Empresa S.A."
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="company-description">Descripción *</Label>
                <Textarea
                  id="company-description"
                  placeholder="Describe brevemente tu empresa y sus actividades..."
                  value={companyDescription}
                  onChange={(e) => setCompanyDescription(e.target.value)}
                  disabled={isLoading}
                  rows={3}
                />
              </div>
            </div>

            <div className="flex gap-3">
              <Button 
                variant="outline" 
                onClick={() => setSelectedType(null)}
                disabled={isLoading}
                className="flex-1"
              >
                Volver
              </Button>
              <Button 
                onClick={handleCompanyRegistration}
                disabled={isLoading}
                className="flex-1"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Registrando...
                  </>
                ) : (
                  "Registrar Empresa"
                )}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}