"use client";

import { useRef, useState } from "react";
import type { Video } from "@/lib/types";
import { useApp } from "@/hooks/use-app";
import Link from "next/link";
import ActionButtons from "./action-buttons";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Music4, Volume2, VolumeX, AlertTriangle } from "lucide-react";

type VideoCardProps = {
  video: Video & { uniqueId: string };
};

export default function VideoCard({ video }: VideoCardProps) {
  const { getUser, currentUser } = useApp();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isMuted, setIsMuted] = useState(false);
  
  const videoUser = getUser(video.userId);

  const togglePlay = () => {
    const videoElement = videoRef.current;
    if (!videoElement) return;
    
    if (videoElement.paused) {
      videoElement.play();
    } else {
      videoElement.pause();
    }
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent toggling play/pause when clicking the mute button
    setIsMuted(prev => !prev);
  }

  if (!videoUser || !currentUser) return null;

  return (
    <div
      className="relative h-full w-full snap-start bg-black video-card-container"
      data-video-id={video.uniqueId}
    >
      {video.videoUrl ? (
        <video
          ref={videoRef}
          src={video.videoUrl}
          loop
          muted={isMuted}
          playsInline
          autoPlay
          preload="auto"
          className="h-full w-full object-contain"
          onClick={togglePlay}
          onLoadedData={() => console.log("Video loaded:", video.videoUrl)}
          onError={(e) => console.error("Video error:", video.videoUrl, e)}
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center bg-black text-white flex-col gap-2">
            <AlertTriangle className="h-10 w-10 text-destructive" />
            <p>Video source not available.</p>
        </div>
      )}
      
      <div className="absolute inset-0 bg-black/20 pointer-events-none"></div>

      <div className="absolute bottom-0 left-0 right-0 p-4 pb-20 text-white pointer-events-none">
        <div className="mb-2">
          <Link
            href={`/profile/${videoUser.username}`}
            className="flex items-center gap-2 pointer-events-auto w-fit"
          >
            <Avatar className="h-10 w-10 border-2 border-white">
              <AvatarImage src={videoUser.profilePicture} alt={videoUser.username} />
              <AvatarFallback>{videoUser.username.slice(0, 2)}</AvatarFallback>
            </Avatar>
            <p className="font-bold font-headline">{videoUser.username}</p>
          </Link>
        </div>
        <p className="text-sm">{video.caption}</p>
        <div className="flex items-center gap-2 mt-2">
            <Music4 size={16}/>
            <p className="text-sm font-medium">Original Audio - {videoUser.username}</p>
        </div>
      </div>
      
      <div className="absolute right-2 bottom-24 flex flex-col items-center gap-4">
        <ActionButtons video={video} />
      </div>

      <button onClick={toggleMute} className="absolute top-4 right-4 bg-black/50 p-2 rounded-full text-white pointer-events-auto">
        {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
      </button>

    </div>
  );
}
