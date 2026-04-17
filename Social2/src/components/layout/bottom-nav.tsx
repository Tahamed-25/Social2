"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { useApp } from "@/hooks/use-app";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

const LogoIcon = () => (
  <svg
      viewBox="0 0 108 87"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="h-7 w-auto"
  >
      <path
        d="M40.3857 86.6665L0.996582 0.333008H21.0299L50.404 69.1105L79.7781 0.333008H99.8114L60.4223 86.6665H40.3857Z"
        fill="currentColor"
      />
      <path
        d="M69.522 56.4118L106.875 0H86.7961L59.8162 38.8235L69.522 56.4118Z"
        fill="hsl(var(--primary))"
      />
  </svg>
);

export default function BottomNav() {
  const pathname = usePathname();
  const { currentUser } = useApp();

  if (!currentUser) {
    return null;
  }
  
  const isHomeActive = pathname === "/";
  const isProfileActive = pathname.startsWith("/profile");

  return (
    <nav className="absolute bottom-0 w-full shrink-0 border-t bg-background/95 backdrop-blur-sm z-40">
      <div className="mx-auto flex h-16 items-center justify-around px-4">
        {/* Home/Logo */}
        <Link
          href="/"
          className={cn(
            "flex items-center justify-center p-2 rounded-full transition-colors",
            isHomeActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
          )}
        >
          <LogoIcon />
          <span className="sr-only">Home</span>
        </Link>

        {/* Upload Button */}
        <Link
          href="/upload"
          className={cn(
            "flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg transition-transform hover:scale-105 active:scale-95"
          )}
        >
          <Plus className="h-7 w-7" strokeWidth={3} />
          <span className="sr-only">Upload</span>
        </Link>

        {/* Profile */}
        <Link
          href="/profile"
          className={cn(
            "flex items-center justify-center rounded-full p-1",
            isProfileActive ? "ring-2 ring-primary ring-offset-2 ring-offset-background" : ""
          )}
        >
          <Avatar className={cn("h-8 w-8")}>
            <AvatarImage src={currentUser.profilePicture} alt={currentUser.username} />
            <AvatarFallback>{currentUser.username.charAt(0).toUpperCase()}</AvatarFallback>
          </Avatar>
          <span className="sr-only">Profile</span>
        </Link>
      </div>
    </nav>
  );
}
