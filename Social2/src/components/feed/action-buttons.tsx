"use client";

import { useState } from "react";
import { Heart, MessageCircle, Send } from "lucide-react";
import type { Video } from "@/lib/types";
import { cn } from "@/lib/utils";
import { useApp } from "@/hooks/use-app";
import { Button } from "@/components/ui/button";
import CommentsSheet from "./comments-sheet";

type ActionButtonsProps = {
  video: Video;
};

export default function ActionButtons({ video }: ActionButtonsProps) {
  const { currentUser, toggleLike, shareVideo } = useApp();
  const [isCommentsOpen, setIsCommentsOpen] = useState(false);
  
  if (!currentUser) return null;

  const isLiked = video.likes.includes(currentUser.id);

  const formatCount = (count: number) => {
    if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
    if (count >= 1000) return `${(count / 1000).toFixed(1)}K`;
    return count;
  };

  return (
    <>
      <div className="flex flex-col items-center gap-4 text-white">
        <div className="flex flex-col items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-12 w-12 rounded-full bg-black/40 hover:bg-black/60 hover:text-white"
            onClick={() => toggleLike(video.id)}
          >
            <Heart className={cn("h-7 w-7", isLiked && "fill-primary text-primary")} />
          </Button>
          <span className="text-sm font-semibold">{formatCount(video.likes.length)}</span>
        </div>

        <div className="flex flex-col items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-12 w-12 rounded-full bg-black/40 hover:bg-black/60 hover:text-white"
            onClick={() => setIsCommentsOpen(true)}
          >
            <MessageCircle className="h-7 w-7" />
          </Button>
          <span className="text-sm font-semibold">{formatCount(video.comments.length)}</span>
        </div>

        <div className="flex flex-col items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-12 w-12 rounded-full bg-black/40 hover:bg-black/60 hover:text-white"
            onClick={() => shareVideo(video.id)}
          >
            <Send className="h-7 w-7" />
          </Button>
          <span className="text-sm font-semibold">{formatCount(video.shares)}</span>
        </div>
      </div>
      <CommentsSheet
        videoId={video.id}
        open={isCommentsOpen}
        onOpenChange={setIsCommentsOpen}
      />
    </>
  );
}
