"use client";

import { useApp } from "@/hooks/use-app";
import VideoCard from "./video-card";
import { useEffect, useMemo, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";

export default function VideoFeed() {
  const { videos } = useApp();
  const feedRef = useRef<HTMLDivElement>(null);
  const scrollTimeout = useRef<NodeJS.Timeout | null>(null);
  const isJumping = useRef(false);

  const searchParams = useSearchParams();
  const router = useRouter();

  const feedVideos = useMemo(() => {
    if (videos.length === 0) return [];
    // Create a list of [videos, videos, videos] to create the looping illusion.
    // The user starts in the middle block. When they scroll to the top or bottom,
    // we silently jump them back to the corresponding video in the middle block.
    return [...videos, ...videos, ...videos].map((video, index) => ({
      ...video,
      uniqueId: `${video.id}-clone-${index}`,
    }));
  }, [videos]);

  useEffect(() => {
    const feedElement = feedRef.current;
    if (!feedElement || videos.length === 0) return;

    const videoIdToPlay = searchParams.get("videoId");
    const videoHeight = feedElement.clientHeight;

    if (videoIdToPlay) {
      const videoIndex = videos.findIndex((v) => v.id === videoIdToPlay);
      if (videoIndex !== -1) {
        feedElement.scrollTop = (videos.length + videoIndex) * videoHeight;
        router.replace("/", { scroll: false });
      }
    } else {
      // This check prevents resetting scroll on hot-reloads during development.
      if (feedElement.scrollTop < videoHeight) {
        const initialScrollTop = videos.length * videoHeight;
        feedElement.scrollTop = initialScrollTop;
      }
    }
  }, [videos, searchParams, router]);

  useEffect(() => {
    const feedElement = feedRef.current;
    if (!feedElement || feedVideos.length === 0) return;
    
    // This is the core logic for playing/pausing videos as they scroll into view.
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const videoElement = entry.target.querySelector('video');
        if (videoElement) {
            if (entry.isIntersecting) {
              // Play the video when it's the one in view
              videoElement.play().catch(error => {
                // Autoplay was prevented. This is common in browsers and can be ignored
                // as user scrolling is considered an interaction.
                console.warn("Video autoplay prevented:", error);
              });
            } else {
              // Pause the video when it's scrolled out of view
              videoElement.pause();
            }
        }
      });
    }, {
      root: feedElement,
      rootMargin: "0px",
      // This threshold means the video will play when 80% is visible
      threshold: 0.8, 
    });

    const videoContainers = feedElement.querySelectorAll('.video-card-container');
    videoContainers.forEach((el) => observer.observe(el));

    // Cleanup observer on component unmount
    return () => {
      videoContainers.forEach((el) => observer.unobserve(el));
    };
  }, [feedVideos]);

  const handleScroll = () => {
    // isJumping ref prevents an infinite loop from our own programmatic scrolling.
    if (isJumping.current) return;
    
    if (scrollTimeout.current) {
        clearTimeout(scrollTimeout.current);
    }

    scrollTimeout.current = setTimeout(() => {
      const feedElement = feedRef.current;
      if (!feedElement || videos.length === 0) return;
      
      const videoHeight = feedElement.clientHeight;
      const scrollTop = feedElement.scrollTop;
      
      // Define the top and bottom boundaries of the middle video block.
      const topThreshold = videoHeight * videos.length;
      const bottomThreshold = videoHeight * videos.length * 2;

      // When the scroll position enters the top or bottom buffer blocks,
      // perform a "jump" to the corresponding video in the middle block.
      if (scrollTop < topThreshold) {
        isJumping.current = true;
        feedElement.scrollTop = scrollTop + topThreshold;
      } else if (scrollTop >= bottomThreshold) {
        isJumping.current = true;
        feedElement.scrollTop = scrollTop - topThreshold;
      }
      
      // Reset the jumping flag after a short delay to allow the scroll to settle.
      setTimeout(() => {
        isJumping.current = false;
      }, 100);

    }, 150);
  };

  if (videos.length === 0) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-black text-white">
        <p>No videos in the feed.</p>
      </div>
    );
  }

  return (
    <div 
      ref={feedRef} 
      onScroll={handleScroll}
      className="h-full w-full snap-y snap-mandatory overflow-y-auto overflow-x-hidden bg-black no-scrollbar"
    >
      {feedVideos.map((video) => (
        <VideoCard 
          key={video.uniqueId} 
          video={video}
        />
      ))}
    </div>
  );
}
