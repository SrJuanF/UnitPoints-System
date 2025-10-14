/**
 * Utilidades para gestión de cache de roles
 */

const COMPANY_ROLE_KEY = "unitpoints_company_role_";

/**
 * Limpiar cache de rol de compañía para una dirección específica
 */
export function clearCompanyRoleCache(address: string) {
  if (typeof window === "undefined") return;

  const key = `${COMPANY_ROLE_KEY}${address.toLowerCase()}`;
  localStorage.removeItem(key);
  console.log(`🗑️ Cleared company role cache for ${address}`);
}

/**
 * Limpiar todos los caches de roles
 */
export function clearAllCompanyRoleCaches() {
  if (typeof window === "undefined") return;

  const keys = Object.keys(localStorage);
  let count = 0;

  keys.forEach((key) => {
    if (key.startsWith(COMPANY_ROLE_KEY)) {
      localStorage.removeItem(key);
      count++;
    }
  });

  console.log(`🗑️ Cleared ${count} company role cache entries`);
}

/**
 * Obtener rol cacheado para una dirección
 */
export function getCachedCompanyRole(address: string): boolean | null {
  if (typeof window === "undefined") return null;

  const key = `${COMPANY_ROLE_KEY}${address.toLowerCase()}`;
  const stored = localStorage.getItem(key);

  if (stored === null) return null;
  return stored === "true";
}

/**
 * Establecer rol de compañía en cache
 */
export function setCachedCompanyRole(address: string, isCompany: boolean) {
  if (typeof window === "undefined") return;

  const key = `${COMPANY_ROLE_KEY}${address.toLowerCase()}`;
  localStorage.setItem(key, String(isCompany));
  console.log(`💾 Cached company role for ${address}: ${isCompany}`);
}

/**
 * Debug: Mostrar todos los roles cacheados
 */
export function debugCompanyRoleCaches() {
  if (typeof window === "undefined") return;

  const keys = Object.keys(localStorage);
  const caches: Record<string, boolean> = {};

  keys.forEach((key) => {
    if (key.startsWith(COMPANY_ROLE_KEY)) {
      const address = key.replace(COMPANY_ROLE_KEY, "");
      const isCompany = localStorage.getItem(key) === "true";
      caches[address] = isCompany;
    }
  });

  console.table(caches);
  return caches;
}
