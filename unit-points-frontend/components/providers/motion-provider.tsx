"use client";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

interface MotionContextValue {
  reduced: boolean;
}

const MotionContext = createContext<MotionContextValue>({ reduced: false });

export function MotionProvider({ children }: { children: ReactNode }) {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  return (
    <MotionContext.Provider value={{ reduced }}>
      <div className={reduced ? "rm" : undefined}>{children}</div>
    </MotionContext.Provider>
  );
}

export function useMotion() {
  return useContext(MotionContext);
}
