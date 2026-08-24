function readStorage(
  selectStorage: () => Storage,
  key: string,
): string | null {
  if (typeof window === "undefined") return null;

  try {
    return selectStorage().getItem(key);
  } catch {
    return null;
  }
}

function writeStorage(
  selectStorage: () => Storage,
  key: string,
  value: string,
): boolean {
  if (typeof window === "undefined") return false;

  try {
    selectStorage().setItem(key, value);
    return true;
  } catch {
    return false;
  }
}

export function readLocalStorage(key: string): string | null {
  return readStorage(() => window.localStorage, key);
}

export function writeLocalStorage(key: string, value: string): boolean {
  return writeStorage(() => window.localStorage, key, value);
}

export function readSessionStorage(key: string): string | null {
  return readStorage(() => window.sessionStorage, key);
}

export function writeSessionStorage(key: string, value: string): boolean {
  return writeStorage(() => window.sessionStorage, key, value);
}
