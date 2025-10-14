/**
 * Suppress specific console warnings from Privy
 * These are known issues with Privy's internal components
 * and don't affect functionality
 */
export function suppressPrivyWarnings() {
  if (typeof window === "undefined") return;

  const originalError = console.error;
  const originalWarn = console.warn;

  console.error = (...args: any[]) => {
    const message = args[0]?.toString() || "";

    // Suppress Privy hydration warnings
    if (
      message.includes("In HTML, <div> cannot be a descendant of <p>") ||
      message.includes("<p> cannot contain a nested <div>") ||
      (message.includes(
        'Each child in a list should have a unique "key" prop'
      ) &&
        message.includes("jm"))
    ) {
      return;
    }

    originalError.apply(console, args);
  };

  console.warn = (...args: any[]) => {
    const message = args[0]?.toString() || "";

    // Suppress Privy hydration warnings
    if (
      message.includes("In HTML, <div> cannot be a descendant of <p>") ||
      message.includes("<p> cannot contain a nested <div>")
    ) {
      return;
    }

    originalWarn.apply(console, args);
  };
}
