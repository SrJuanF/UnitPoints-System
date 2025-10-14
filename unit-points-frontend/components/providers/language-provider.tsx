"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

type Language = "en" | "es";

type TranslationKey =
  | "home"
  | "about"
  | "glossary"
  | "dashboard"
  | "events"
  | "swap"
  | "dao"
  | "login"
  | "logout"
  | "profile"
  | "settings"
  | "myAccount"
  | "loading"
  | "welcome"
  | "joinUs"
  | "connectWallet"
  | "learnMore"
  | "getStarted"
  | "builtWithModern"
  | "blockchain"
  | "frontend"
  | "tools"
  | "features"
  | "wantToBePartOfRevolution"
  | "joinDiscordCommunity"
  | "searchTerms"
  | "allCategories"
  | "all"
  | "basics"
  | "technical"
  | "governance"
  | "polkadot"
  | "defi"
  | "unitpoints"
  | "showingTerms"
  | "terms"
  | "term"
  | "noTermsFound"
  | "tryAdjustingSearch"
  | "toggleTheme"
  | "light"
  | "dark"
  | "system"
  | "language"
  | "english"
  | "spanish"
  | "communityMembers"
  | "eventsHosted"
  | "unitpointsEarned"
  | "countries"
  | "aboutUs"
  | "buildingFuture"
  | "innovation"
  | "community"
  | "decentralization"
  | "techStack"
  | "discoverEvents"
  | "joinExcitingEvents"
  | "searchEvents"
  | "subscribeToEvent"
  | "hostedBy"
  | "unitpointsReward"
  | "subscribe"
  | "subscribed"
  | "earnGovern"
  | "gamifiedReward"
  | "revolutionStartsHere"
  | "builtFor"
  | "decentralizedFuture"
  | "exploreEcosystem"
  | "joinCommunity"
  | "startEarning"
  | "viewProfile"
  | "disconnect"
  | "searchPlaceholder"
  | "noEventsFound"
  | "tryDifferentSearch"
  | "successfullySubscribed"
  | "failedToSubscribe"
  | "pleaseLogin"
  | "readyToStart"
  | "unitPoints"
  | "launchApp"
  | "viewDemo"
  | "gotoDashboard"
  | "builtForLatinHack";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: TranslationKey) => string;
}

// Translation dictionaries
const translations = {
  en: {
    // Navbar
    home: "Home",
    about: "About",
    glossary: "Glossary",
    dashboard: "Dashboard",
    events: "Events",
    swap: "Swap",
    dao: "DAO",
    login: "Login",
    logout: "Logout",
    profile: "Profile",
    settings: "Settings",
    myAccount: "My Account",

    // Common
    loading: "Loading...",
    welcome: "Welcome to the Revolution",
    joinUs: "Join Us",
    connectWallet: "Connect Wallet",
    learnMore: "Learn More",
    getStarted: "Get Started",
    builtWithModern:
      "Built with the most modern and reliable Web3 technologies",
    blockchain: "Blockchain",
    frontend: "Frontend",
    tools: "Tools",
    features: "Features",
    wantToBePartOfRevolution: "Want to be part of the revolution?",
    joinDiscordCommunity: "Join Discord Community",

    // Glossary
    searchTerms: "Search terms, definitions, or categories...",
    allCategories: "All Categories",
    all: "All",
    basics: "Basics",
    technical: "Technical",
    governance: "Governance",
    polkadot: "Polkadot",
    defi: "DeFi",
    unitpoints: "UnitPoints",
    showingTerms: "Showing",
    terms: "terms",
    term: "term",
    noTermsFound: "No terms found",
    tryAdjustingSearch:
      "Try adjusting your search or selecting a different category.",

    // Theme
    toggleTheme: "Toggle theme",
    light: "Light",
    dark: "Dark",
    system: "System",

    // Language
    language: "Language",
    english: "English",
    spanish: "Spanish",

    // About page
    communityMembers: "Community Members",
    eventsHosted: "Events Hosted",
    unitpointsEarned: "UnitPoints Earned",
    countries: "Countries",
    aboutUs: "About Us",
    buildingFuture: "Building the future of community rewards on Polkadot.",
    innovation: "Innovation",
    community: "Community",
    decentralization: "Decentralization",
    techStack: "Tech Stack",

    // Events page
    discoverEvents: "Discover Events",
    joinExcitingEvents:
      "Join exciting events and earn UnitPoints for your participation.",
    searchEvents: "Search events...",
    subscribeToEvent: "Subscribe to Event",
    hostedBy: "Hosted by",
    unitpointsReward: "UnitPoints Reward",
    subscribe: "Subscribe",
    subscribed: "Subscribed",
    noEventsFound: "No events found",
    tryDifferentSearch: "Try a different search term.",
    successfullySubscribed: "Successfully subscribed to event!",
    failedToSubscribe: "Failed to subscribe. Please try again.",
    pleaseLogin: "Please login to subscribe to events.",

    // Landing page
    earnGovern: "Earn & Govern.",
    gamifiedReward: "A gamified reward platform on Polkadot Asset Hub",
    revolutionStartsHere: "The revolution starts here",
    builtFor: "Built for",
    decentralizedFuture: "Decentralized Future",
    exploreEcosystem: "Explore Ecosystem",
    joinCommunity:
      "Join our community today and start earning rewards for your contributions. Participate in events, vote on proposals, and shape the future of the platform.",
    startEarning: "Start Earning",
    viewProfile: "View Profile",
    disconnect: "Disconnect",
    searchPlaceholder: "Search...",

    // CTA Section
    readyToStart: "Ready to Start Earning",
    unitPoints: "UnitPoints",
    launchApp: "Launch App",
    viewDemo: "View Demo",
    gotoDashboard: "Go to Dashboard",
    builtForLatinHack:
      "Built for LATIN HACK 2025 • Powered by Polkadot Asset Hub",
  },
  es: {
    // Navbar
    home: "Inicio",
    about: "Acerca de",
    glossary: "Glosario",
    dashboard: "Panel",
    events: "Eventos",
    swap: "Intercambio",
    dao: "DAO",
    login: "Iniciar Sesión",
    logout: "Cerrar Sesión",
    profile: "Perfil",
    settings: "Configuración",
    myAccount: "Mi Cuenta",

    // Common
    loading: "Cargando...",
    welcome: "Bienvenido a la Revolución",
    joinUs: "Únete a Nosotros",
    connectWallet: "Conectar Billetera",
    learnMore: "Saber Más",
    getStarted: "Empezar",
    builtWithModern:
      "Construido con las tecnologías Web3 más modernas y confiables",
    blockchain: "Cadena de bloques",
    frontend: "Frontend",
    tools: "Herramientas",
    features: "Características",
    wantToBePartOfRevolution: "¿Quieres ser parte de la revolución?",
    joinDiscordCommunity: "Únete a la Comunidad de Discord",

    // Glossary
    searchTerms: "Buscar términos, definiciones o categorías...",
    allCategories: "Todas las Categorías",
    all: "Todos",
    basics: "Básicos",
    technical: "Técnicos",
    governance: "Gobernanza",
    polkadot: "Polkadot",
    defi: "DeFi",
    unitpoints: "UnitPoints",
    showingTerms: "Mostrando",
    terms: "términos",
    term: "término",
    noTermsFound: "No se encontraron términos",
    tryAdjustingSearch:
      "Prueba ajustando tu búsqueda o seleccionando una categoría diferente.",

    // Theme
    toggleTheme: "Cambiar tema",
    light: "Claro",
    dark: "Oscuro",
    system: "Sistema",

    // Language
    language: "Idioma",
    english: "Inglés",
    spanish: "Español",

    // About page
    communityMembers: "Miembros de la Comunidad",
    eventsHosted: "Eventos Organizados",
    unitpointsEarned: "UnitPoints Ganados",
    countries: "Países",
    aboutUs: "Acerca de Nosotros",
    buildingFuture:
      "Construyendo el futuro de las recompensas comunitarias en Polkadot.",
    innovation: "Innovación",
    community: "Comunidad",
    decentralization: "Descentralización",
    techStack: "Pila Tecnológica",

    // Events page
    discoverEvents: "Descubrir Eventos",
    joinExcitingEvents:
      "Únete a eventos emocionantes y gana UnitPoints por tu participación.",
    searchEvents: "Buscar eventos...",
    subscribeToEvent: "Suscribirse al Evento",
    hostedBy: "Organizado por",
    unitpointsReward: "Recompensa UnitPoints",
    subscribe: "Suscribirse",
    subscribed: "Suscrito",
    noEventsFound: "No se encontraron eventos",
    tryDifferentSearch: "Prueba con un término de búsqueda diferente.",
    successfullySubscribed: "¡Te has suscrito al evento exitosamente!",
    failedToSubscribe: "Error al suscribirse. Inténtalo de nuevo.",
    pleaseLogin: "Por favor inicia sesión para suscribirte a eventos.",

    // Landing page
    earnGovern: "Gana. Juega. Gobierna.",
    gamifiedReward:
      "Una plataforma de recompensas gamificada en Polkadot Asset Hub",
    revolutionStartsHere: "La revolución comienza aquí",
    builtFor: "Construido para",
    decentralizedFuture: "Futuro Descentralizado",
    exploreEcosystem: "Explorar Ecosistema",
    joinCommunity:
      "Únete a nuestra comunidad hoy y comienza a ganar recompensas por tus contribuciones. Participa en eventos, vota en propuestas y da forma al futuro de la plataforma.",
    startEarning: "Comenzar a Ganar",
    viewProfile: "Ver Perfil",
    disconnect: "Desconectar",
    searchPlaceholder: "Buscar...",

    // CTA Section
    readyToStart: "¿Listo para Comenzar a Ganar",
    unitPoints: "UnitPoints",
    launchApp: "Lanzar App",
    viewDemo: "Ver Demo",
    gotoDashboard: "Ir al Panel",
    builtForLatinHack:
      "Construido para LATIN HACK 2025 • Impulsado por Polkadot Asset Hub",
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined
);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>("en");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Load language from localStorage
    try {
      const savedLanguage = localStorage.getItem("language") as Language;
      if (savedLanguage && (savedLanguage === "en" || savedLanguage === "es")) {
        setLanguageState(savedLanguage);
      }
    } catch (error) {
      console.log("Could not load language from localStorage");
    }
  }, []); // Empty dependency array to run only once

  const handleSetLanguage = React.useCallback((lang: Language) => {
    console.log("Setting language to:", lang);
    setLanguageState(lang);
    try {
      localStorage.setItem("language", lang);
    } catch (error) {
      console.log("Could not save language to localStorage");
    }
  }, []); // No dependencies needed

  const t = React.useCallback((key: TranslationKey): string => {
    if (!mounted) return key; // Return key during SSR
    const translation =
      translations[language]?.[key] || translations.en[key] || key;
    return translation;
  }, [language, mounted]); // Only depend on language and mounted

  const contextValue = React.useMemo(() => ({
    language,
    setLanguage: handleSetLanguage,
    t,
  }), [language, handleSetLanguage, t]);

  return (
    <LanguageContext.Provider value={contextValue}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
