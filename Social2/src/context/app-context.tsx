"use client";

import { createContext, useState, ReactNode } from "react";
import { dummyUsers, dummyVideos } from "@/lib/dummy-data";
import type { User, Video, Comment } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";

type AppContextType = {
  users: User[];
  videos: Video[];
  currentUser: User | null;
  login: (username: string, password?: string) => boolean;
  logout: () => void;
  signup: (username: string, password?: string) => boolean;
  getUser: (userId: string) => User | undefined;
  getVideo: (videoId: string) => Video | undefined;
  toggleLike: (videoId: string) => void;
  addComment: (videoId: string, text: string) => void;
  shareVideo: (videoId: string) => void;
  toggleFollow: (userIdToFollow: string) => void;
  updateProfile: (userId: string, updates: Partial<Pick<User, "username" | "bio" | "profilePicture">>) => boolean;
  uploadVideo: (file: File, caption: string) => void;
};

export const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [users, setUsers] = useState<User[]>(dummyUsers);
  const [videos, setVideos] = useState<Video[]>(dummyVideos);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const { toast } = useToast();

  const login = (username: string, password?: string) => {
    const user = users.find(
      (u) => u.username === username && u.password === password
    );
    if (user) {
      setCurrentUser(user);
      return true;
    }
    return false;
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const signup = (username: string, password?: string) => {
    if (users.some((u) => u.username === username)) {
      return false; // Username already exists
    }
    const newUser: User = {
      id: `user${Date.now()}`,
      username,
      password,
      profilePicture: "https://picsum.photos/seed/newuser/200/200",
      bio: "New to Social-fit!",
      followers: [],
      following: [],
    };
    setUsers([...users, newUser]);
    setCurrentUser(newUser);
    return true;
  };

  const getUser = (userId: string) => users.find((u) => u.id === userId);
  const getVideo = (videoId: string) => videos.find((v) => v.id === videoId);

  const toggleLike = (videoId: string) => {
    if (!currentUser) return;
    setVideos(
      videos.map((video) => {
        if (video.id === videoId) {
          const isLiked = video.likes.includes(currentUser.id);
          const newLikes = isLiked
            ? video.likes.filter((id) => id !== currentUser.id)
            : [...video.likes, currentUser.id];
          return { ...video, likes: newLikes };
        }
        return video;
      })
    );
  };

  const addComment = (videoId: string, text: string) => {
    if (!currentUser) return;
    setVideos(
      videos.map((video) => {
        if (video.id === videoId) {
          const newComment: Comment = {
            id: `c${Date.now()}`,
            userId: currentUser.id,
            text,
            timestamp: Date.now(),
          };
          return { ...video, comments: [...video.comments, newComment] };
        }
        return video;
      })
    );
  };

  const shareVideo = (videoId: string) => {
    setVideos(videos.map(v => v.id === videoId ? {...v, shares: v.shares + 1} : v));
    toast({ title: "Video shared!", description: "You've shared this video with your friends." });
  };
  
  const toggleFollow = (userIdToFollow: string) => {
    if (!currentUser || currentUser.id === userIdToFollow) return;
  
    setUsers(prevUsers => {
      let isFollowing: boolean | undefined;
      // Update current user's following list
      const updatedUsers = prevUsers.map(user => {
        if (user.id === currentUser.id) {
          isFollowing = user.following.includes(userIdToFollow);
          const newFollowing = isFollowing
            ? user.following.filter(id => id !== userIdToFollow)
            : [...user.following, userIdToFollow];
          const updatedCurrentUser = { ...user, following: newFollowing };
          // Also update the currentUser state
          setCurrentUser(updatedCurrentUser);
          return updatedCurrentUser;
        }
        return user;
      });
  
      // Update target user's followers list
      return updatedUsers.map(user => {
        if (user.id === userIdToFollow) {
          const newFollowers = isFollowing === false // Check against the original state
            ? [...user.followers, currentUser.id]
            : user.followers.filter(id => id !== currentUser.id);
          return { ...user, followers: newFollowers };
        }
        return user;
      });
    });
  };

  const updateProfile = (userId: string, updates: Partial<Pick<User, "username" | "bio" | "profilePicture">>) => {
    if (updates.username && users.some(u => u.username === updates.username && u.id !== userId)) {
      return false; // Username taken
    }
    
    const updatedUsers = users.map(user => {
      if (user.id === userId) {
        return { ...user, ...updates };
      }
      return user;
    });
    setUsers(updatedUsers);
    
    if (currentUser?.id === userId) {
      setCurrentUser(updatedUsers.find(u => u.id === userId) || null);
    }
    
    return true;
  };

  const uploadVideo = (file: File, caption: string) => {
    if (!currentUser) return;
    const localVideoUrl = URL.createObjectURL(file);
    const newVideo: Video = {
      id: `vid${Date.now()}`,
      userId: currentUser.id,
      videoUrl: localVideoUrl,
      posterUrl: "https://picsum.photos/seed/newvideo/540/960",
      caption,
      likes: [],
      comments: [],
      shares: 0,
      isUploaded: true,
    };
    setVideos([newVideo, ...videos]);
  };

  return (
    <AppContext.Provider
      value={{
        users,
        videos,
        currentUser,
        login,
        logout,
        signup,
        getUser,
        getVideo,
        toggleLike,
        addComment,
        shareVideo,
        toggleFollow,
        updateProfile,
        uploadVideo,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}
