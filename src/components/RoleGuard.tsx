"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAppLoading, useUserType } from "@/hooks";
import { useLoggedIn } from "@/hooks";
import { AppLoading } from "@/components";

interface RoleGuardProps {
  children: React.ReactNode;
  allowedRole: "admin" | "instructor" | "student" | "worker";
}

export default function RoleGuard({ children, allowedRole }: RoleGuardProps) {
  const router = useRouter();
  const { userType } = useUserType(); // Assuming this returns { userType: string | null }
  const { loggedIn } = useLoggedIn();
  const { appLoading } = useAppLoading();

  // Track if we've successfully passed the role check locally
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    // 1. Do nothing until the backend request in Context finishes
    if (appLoading) return;

    // Handle userType being a function or a string to fix previous TS errors
    const currentRole = typeof userType === "function" ? userType() : userType;

    if (!loggedIn) {
      router.replace("/signin");
    } else if (currentRole && currentRole !== allowedRole) {
      // Wrong dashboard? Redirect to their actual role path
      router.replace(`/${currentRole}s`);
    } else {
      // Only now is it safe to show the dashboard
      setIsAuthorized(true);
    }
  }, [loggedIn, userType, appLoading, allowedRole, router]);

  // 2. CRITICAL: While loading or unauthorized, show NOTHING (or a spinner)
  // This prevents the "Flash" because the children aren't rendered yet.
  if (appLoading || !isAuthorized) {
    return <AppLoading />;
  }

  return <>{children}</>;
}
