"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useApp } from "@/hooks/use-app";
import { getAiCaptions } from "./actions";
import AuthGuard from "@/components/auth/auth-guard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Wand2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  videoFile: z.any().refine(files => files?.length > 0, "A video file is required."),
  caption: z.string().max(2200, "Caption is too long."),
  aiContext: z.string().optional(),
});

function UploadPageContent() {
  const router = useRouter();
  const { uploadVideo } = useApp();
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { caption: "", aiContext: "" },
  });

  const handleGenerateCaptions = async () => {
    const context = form.getValues("aiContext");
    if (!context) {
      form.setError("aiContext", { message: "Please provide some context for the AI." });
      return;
    }
    setIsGenerating(true);
    setSuggestions([]);
    try {
      const result = await getAiCaptions(context);
      setSuggestions(result.captions);
    } catch (error) {
      console.error("AI Caption Error:", error);
      toast({ variant: "destructive", title: "AI Error", description: "Failed to generate captions." });
    } finally {
      setIsGenerating(false);
    }
  };

  const useSuggestion = (suggestion: string) => {
    form.setValue("caption", suggestion);
    setSuggestions([]);
  };

  function onSubmit(values: z.infer<typeof formSchema>) {
    const file = values.videoFile?.[0];
    if (!file) {
      form.setError("videoFile", {
        type: "manual",
        message: "Please choose a video to upload.",
      });
      return;
    }

    uploadVideo(file, values.caption);
    toast({ title: "Upload successful!", description: "Your video is now live." });
    router.push("/");
  }

  return (
    <div className="container mx-auto max-w-2xl py-8 px-4">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Upload Video</CardTitle>
          <CardDescription>Share your latest workout with the community.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="videoFile"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Video File</FormLabel>
                    <FormControl>
                      <Input type="file" accept="video/*" onChange={e => field.onChange(e.target.files)} />
                    </FormControl>
                    <FormDescription>Select a video from your device.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="space-y-4 rounded-lg border p-4">
                <h3 className="text-lg font-semibold font-headline">AI Caption Helper</h3>
                <FormField
                  control={form.control}
                  name="aiContext"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Video Context</FormLabel>
                      <FormControl>
                        <Textarea placeholder="e.g., Morning yoga session, focusing on flexibility and balance." {...field} />
                      </FormControl>
                      <FormDescription>
                        Describe your video in a few words to get AI-powered caption suggestions.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="button" onClick={handleGenerateCaptions} disabled={isGenerating}>
                  {isGenerating ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Wand2 className="mr-2 h-4 w-4" />
                  )}
                  Generate Suggestions
                </Button>
                {suggestions.length > 0 && (
                  <div className="space-y-2 pt-2">
                    <p className="font-medium text-sm">Suggestions:</p>
                    <div className="flex flex-wrap gap-2">
                      {suggestions.map((s, i) => (
                        <Button key={i} type="button" variant="outline" size="sm" onClick={() => useSuggestion(s)}>
                          {s}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <FormField
                control={form.control}
                name="caption"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Caption</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Write a caption..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full">Upload</Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}

export default function UploadPage() {
    return (
        <AuthGuard>
            <UploadPageContent />
        </AuthGuard>
    )
}
