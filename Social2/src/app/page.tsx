import AuthGuard from "@/components/auth/auth-guard";
import VideoFeed from "@/components/feed/video-feed";

export default function Home() {
  return (
    <AuthGuard>
      <VideoFeed />
    </AuthGuard>
  );
}
