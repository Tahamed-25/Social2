"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "@/hooks/use-app";
import AuthGuard from "@/components/auth/auth-guard";
import { Skeleton } from "@/components/ui/skeleton";

function ProfileRedirect() {
  const { currentUser } = useApp();
  const router = useRouter();

  useEffect(() => {
    if (currentUser) {
      router.replace(`/profile/${currentUser.username}`);
    }
  }, [currentUser, router]);

  return (
    <div className="flex h-full w-full items-center justify-center p-4">
      <div className="flex w-full items-center justify-center gap-4">
        <Skeleton className="h-24 w-24 rounded-full" />
        <Skeleton className="h-24 w-24 rounded-full" />
        <Skeleton className="h-24 w-24 rounded-full" />
      </div>
    </div>
  );
}

export default function MyProfilePage() {
  return (
    <AuthGuard>
      <ProfileRedirect />
    </AuthGuard>
  );
}
