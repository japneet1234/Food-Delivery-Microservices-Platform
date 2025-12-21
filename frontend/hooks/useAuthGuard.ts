"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

export const AUTH_TOKEN_KEY = "foodie-auth-token";

type AuthGuardState = {
  authorized: boolean;
  checking: boolean;
};

export function useAuthGuard(): AuthGuardState {
  const router = useRouter();
  const pathname = usePathname();
  const [authorized, setAuthorized] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem(AUTH_TOKEN_KEY) : null;
    if (!token) {
      const next = encodeURIComponent(pathname || "/");
      router.replace(`/login?next=${next}`);
    } else {
      setAuthorized(true);
    }
    setChecking(false);
  }, [router, pathname]);

  return { authorized, checking };
}
