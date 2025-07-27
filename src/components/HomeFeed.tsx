import { useMemo } from "react";
import { FeedPost } from "./FeedPost";
import { UserPreferences, Post as PostType, Location } from "@/types";
import { t } from "@/utils/translations";
import { calculateDistance, getLocationName } from "@/utils/location";
import { MapPin } from "lucide-react";

interface HomeFeedProps {
  userPreferences: UserPreferences;
  posts: PostType[];
  onVote: (postId: string, type: 'up' | 'down') => void;
  getUserVote: (postId: string) => 'up' | 'down' | null;
}

export const HomeFeed = ({ userPreferences, posts, onVote, getUserVote }: HomeFeedProps) => {
  // Calculate distances and sort by proximity
  const postsWithDistance = useMemo(() => {
    return posts.map(post => ({
      ...post,
      distance: calculateDistance(userPreferences.location, post.location)
    })).sort((a, b) => a.distance - b.distance);
  }, [posts, userPreferences.location]);

  return (
    <div className="max-w-2xl mx-auto p-4 pb-20">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">{t('appName', userPreferences.language)} {t('feed', userPreferences.language)}</h1>
          <p className="text-sm text-muted-foreground flex items-center mt-1">
            <MapPin className="h-4 w-4 mr-1" />
            {t('nearYou', userPreferences.language)} • {getLocationName(userPreferences.location)}
          </p>
        </div>
        <span className="text-2xl">🛒</span>
      </div>
      
      <div className="space-y-1">
        {postsWithDistance.map(post => (
          <FeedPost 
            key={post.id} 
            post={post} 
            onVote={onVote}
            language={userPreferences.language}
            userVote={getUserVote(post.id)}
          />
        ))}
      </div>
    </div>
  );
};