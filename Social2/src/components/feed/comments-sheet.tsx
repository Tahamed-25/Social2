"use client";

import { useApp } from "@/hooks/use-app";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Send } from "lucide-react";

type CommentsSheetProps = {
  videoId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const formSchema = z.object({
  comment: z.string().min(1, "Comment cannot be empty"),
});

export default function CommentsSheet({
  videoId,
  open,
  onOpenChange,
}: CommentsSheetProps) {
  const { getVideo, getUser, addComment, currentUser } = useApp();
  const video = getVideo(videoId);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { comment: "" },
  });

  if (!video) return null;

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    addComment(videoId, values.comment);
    form.reset();
  };

  const timeAgo = (timestamp: number) => {
    const seconds = Math.floor((Date.now() - timestamp) / 1000);
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + "y";
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + "m";
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + "d";
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + "h";
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + "m";
    return Math.floor(seconds) + "s";
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="h-[75vh] flex flex-col">
        <SheetHeader className="text-center">
          <SheetTitle>{video.comments.length} Comments</SheetTitle>
        </SheetHeader>
        <Separator />
        <ScrollArea className="flex-1 px-4 py-2">
          <div className="space-y-4">
            {video.comments.length === 0 ? (
                <div className="flex justify-center items-center h-full pt-16">
                    <p className="text-muted-foreground">No comments yet. Be the first!</p>
                </div>
            ) : (
                [...video.comments].reverse().map((comment) => {
                  const user = getUser(comment.userId);
                  if (!user) return null;
                  return (
                    <div key={comment.id} className="flex items-start gap-3">
                      <Avatar className="h-9 w-9">
                        <AvatarImage src={user.profilePicture} alt={user.username} />
                        <AvatarFallback>{user.username.slice(0, 2)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 text-xs">
                          <p className="font-semibold font-headline">{user.username}</p>
                          <p className="text-muted-foreground">{timeAgo(comment.timestamp)}</p>
                        </div>
                        <p className="text-sm">{comment.text}</p>
                      </div>
                    </div>
                  );
                })
            )}
          </div>
        </ScrollArea>
        <Separator />
        <div className="p-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex items-center gap-2">
              <Avatar className="h-9 w-9">
                <AvatarImage src={currentUser?.profilePicture} />
                <AvatarFallback>{currentUser?.username.slice(0,2)}</AvatarFallback>
              </Avatar>
              <FormField
                control={form.control}
                name="comment"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormControl>
                      <Input placeholder="Add a comment..." {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <Button type="submit" size="icon">
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </Form>
        </div>
      </SheetContent>
    </Sheet>
  );
}
