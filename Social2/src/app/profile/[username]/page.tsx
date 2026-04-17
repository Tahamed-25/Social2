"use client";

import { useParams, useRouter } from "next/navigation";
import { useApp } from "@/hooks/use-app";
import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import AuthGuard from "@/components/auth/auth-guard";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Grid3x3 } from 'lucide-react';
import EditProfileDialog from "@/components/profile/edit-profile-dialog";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";

function UserProfilePageContent() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const { users, videos, currentUser, toggleFollow, logout } = useApp();
  const username = Array.isArray(params.username)
    ? params.username[0]
    : params.username;
  
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const user = users.find((u) => u.username === username);

  useEffect(() => {
    // Set vh unit for mobile browsers
    const setVh = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty("--vh", `${vh}px`);
    };
    setVh();
    window.addEventListener("resize", setVh);
    return () => window.removeEventListener("resize", setVh);
  }, []);

  if (!user || !currentUser) {
    return (
      <div className="p-4 space-y-6 animate-pulse">
        <div className="flex items-start space-x-4">
          <Skeleton className="h-20 w-20 rounded-full" />
          <div className="flex-1 space-y-2 pt-2">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-9 w-full" />
          </div>
        </div>
        <Skeleton className="h-4 w-3/4" />
        <div className="flex justify-around text-center border-t border-b py-2">
          <Skeleton className="h-10 w-16" />
          <Skeleton className="h-10 w-16" />
          <Skeleton className="h-10 w-16" />
        </div>
        <div className="grid grid-cols-3 gap-0.5">
          <Skeleton className="aspect-[9/16]" />
          <Skeleton className="aspect-[9/16]" />
          <Skeleton className="aspect-[9/16]" />
        </div>
      </div>
    );
  }

  const isOwnProfile = currentUser.id === user.id;
  const userVideos = videos.filter((v) =>
    v.userId === user.id && (isOwnProfile ? v.isUploaded : !v.isUploaded)
  );
  const isFollowing = currentUser.following.includes(user.id);

  const handleLogout = () => {
    logout();
    toast({ title: "Logged out successfully." });
    router.replace("/login");
  };

  return (
    <>
      <div className="flex flex-col p-4 space-y-4">
          <div className="flex items-start space-x-4">
              <Avatar className="h-20 w-20 md:h-24 md:w-24 border-2 border-primary">
                <AvatarImage src={user.profilePicture} alt={user.username} />
                <AvatarFallback>{user.username.slice(0, 2)}</AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-2 pt-2">
                  <h1 className="text-xl font-bold font-headline">{user.username}</h1>
                   {isOwnProfile ? (
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="w-full" onClick={() => setIsEditDialogOpen(true)}>
                          Edit Profile
                        </Button>
                        <Button variant="secondary" size="sm" className="w-full" onClick={handleLogout}>
                          Log Out
                        </Button>
                      </div>
                  ) : (
                      <Button onClick={() => toggleFollow(user.id)} size="sm" className="w-full">
                          {isFollowing ? "Unfollow" : "Follow"}
                      </Button>
                  )}
              </div>
          </div>
          <div>
            <p className="text-sm">{user.bio}</p>
          </div>
          <div className="flex justify-around text-center border-t border-b py-2">
              <div>
                  <p className="font-bold text-lg">{userVideos.length}</p>
                  <p className="text-xs text-muted-foreground">Posts</p>
              </div>
              <div>
                  <p className="font-bold text-lg">{user.followers.length}</p>
                  <p className="text-xs text-muted-foreground">Followers</p>
              </div>
              <div>
                  <p className="font-bold text-lg">{user.following.length}</p>
                  <p className="text-xs text-muted-foreground">Following</p>
              </div>
          </div>

          <Tabs defaultValue="grid" className="w-full">
              <TabsList className="w-full grid grid-cols-1">
                <TabsTrigger value="grid"><Grid3x3 /></TabsTrigger>
              </TabsList>
              <TabsContent value="grid">
                {userVideos.length > 0 ? (
                  <div className="grid grid-cols-3 gap-0.5">
                      {userVideos.map((video) => (
                          <Link href={`/?videoId=${video.id}`} key={video.id} scroll={false}>
                            <div className="group relative aspect-[9/16] cursor-pointer bg-muted">
                                <Image
                                    src={video.posterUrl}
                                    alt={video.caption}
                                    fill
                                    className="object-cover"
                                    sizes="(max-width: 768px) 33vw, 33vw"
                                />
                            </div>
                          </Link>
                      ))}
                  </div>
                ) : (
                  <div className="text-center py-16">
                    <h3 className="text-lg font-semibold">No Posts Yet</h3>
                    <p className="text-muted-foreground">This user hasn't shared any videos.</p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
      </div>
      {isOwnProfile && <EditProfileDialog user={user} open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen} />}
    </>
  );
}

export default function UserProfilePage() {
    return (
        <AuthGuard>
            <UserProfilePageContent />
        </AuthGuard>
    )
}
