export interface User {
  id: string;
  username: string;
  password?: string;
  profilePicture: string;
  bio: string;
  followers: string[];
  following: string[];
}

export interface Comment {
  id: string;
  userId: string;
  text: string;
  timestamp: number;
}

export interface Video {
  id: string;
  userId: string;
  videoUrl: string;
  posterUrl: string;
  caption: string;
  likes: string[];
  comments: Comment[];
  shares: number;
  isUploaded?: boolean;
}
