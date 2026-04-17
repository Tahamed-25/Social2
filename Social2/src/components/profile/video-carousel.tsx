"use client";

import Image from "next/image";
import type { Video } from "@/lib/types";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Heart } from "lucide-react";

export default function VideoCarousel({ videos }: { videos: Video[] }) {
  if (videos.length === 0) {
    return (
      <div className="text-center py-16">
        <h3 className="text-lg font-semibold">No Posts Yet</h3>
        <p className="text-muted-foreground">This user hasn't shared any videos.</p>
      </div>
    );
  }

  return (
    <Carousel
      opts={{
        align: "center",
        loop: true,
      }}
      className="w-full"
    >
      <CarouselContent className="-ml-4">
        {videos.map((video) => (
          <CarouselItem key={video.id} className="pl-4 basis-1/2 md:basis-1/3">
            <div className="p-1">
              <div className="group relative aspect-square cursor-pointer">
                <Image
                  src={video.posterUrl}
                  alt={video.caption}
                  fill
                  className="object-cover rounded-full"
                  sizes="(max-width: 768px) 50vw, 33vw"
                />
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center rounded-full">
                  <div className="flex items-center gap-2 text-white font-bold">
                    <Heart className="fill-white" size={18} />
                    <span>{video.likes.length}</span>
                  </div>
                </div>
              </div>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
}
