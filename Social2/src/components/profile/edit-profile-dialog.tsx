"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useApp } from "@/hooks/use-app";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormDescription,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { User } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(20, "Username must be at most 20 characters"),
  bio: z.string().max(150, "Bio must be at most 150 characters").optional(),
  profilePicture: z.any().optional(),
});

type EditProfileDialogProps = {
  user: User;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export default function EditProfileDialog({ user, open, onOpenChange }: EditProfileDialogProps) {
  const { updateProfile } = useApp();
  const { toast } = useToast();
  const router = useRouter();
  const [profilePreview, setProfilePreview] = useState(user.profilePicture);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: user.username,
      bio: user.bio,
      profilePicture: undefined,
    },
  });

  useEffect(() => {
    form.reset({
      username: user.username,
      bio: user.bio,
      profilePicture: undefined,
    });
    setProfilePreview(user.profilePicture);
  }, [form, user]);

  function onSubmit(values: z.infer<typeof formSchema>) {
    const selectedFile = values.profilePicture?.[0] as File | undefined;
    const nextProfilePicture = selectedFile
      ? URL.createObjectURL(selectedFile)
      : user.profilePicture;

    if (updateProfile(user.id, { username: values.username, bio: values.bio, profilePicture: nextProfilePicture })) {
      toast({ title: "Profile updated successfully!" });
      onOpenChange(false);
      router.replace(`/profile/${values.username}`);
    } else {
      form.setError("username", {
        type: "manual",
        message: "This username is already taken.",
      });
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
          <DialogDescription>
            Make changes to your profile here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="profilePicture"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Profile Picture</FormLabel>
                  <FormControl>
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const files = e.target.files;
                        field.onChange(files);
                        const file = files?.[0];
                        if (file) {
                          setProfilePreview(URL.createObjectURL(file));
                        } else {
                          setProfilePreview(user.profilePicture);
                        }
                      }}
                    />
                  </FormControl>
                  <FormDescription>Choose a new image to update your avatar.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            {profilePreview ? (
              <div className="flex items-center gap-3 rounded-md border p-3">
                <img
                  src={profilePreview}
                  alt="Profile preview"
                  className="h-14 w-14 rounded-full object-cover"
                />
                <p className="text-sm text-muted-foreground">Preview of your updated profile picture.</p>
              </div>
            ) : null}
            <FormField
              control={form.control}
              name="bio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bio</FormLabel>
                  <FormControl>
                    <Textarea {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="secondary">
                  Cancel
                </Button>
              </DialogClose>
              <Button type="submit">Save Changes</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
