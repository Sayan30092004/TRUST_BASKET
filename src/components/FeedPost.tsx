import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ThumbsUp, ThumbsDown, MessageCircle, MapPin, Languages, RotateCcw, Shield, Crown } from "lucide-react";
import { Post } from "@/types";
import { Language, t } from "@/utils/translations";
import { translatePost, isTranslationAvailable, getLanguageName } from "@/utils/postTranslation";

interface FeedPostProps {
  post: Post & { distance?: number };
  onVote: (postId: string, type: 'up' | 'down') => void;
  language: Language;
  userVote: 'up' | 'down' | null;
}

export const FeedPost = ({ post, onVote, language, userVote }: FeedPostProps) => {
  const [translatedContent, setTranslatedContent] = useState<string>('');
  const [isTranslated, setIsTranslated] = useState(false);
  const [isTranslating, setIsTranslating] = useState(false);

  const getCategoryEmoji = (category: string) => {
    const emojis: Record<string, string> = {
      vegetables: '🥬',
      spices: '🌶️',
      oil: '🛢️',
      packaging: '📦',
      meat: '🥩',
      dairy: '🥛',
    };
    return emojis[category.toLowerCase()] || '🏪';
  };

  const getTrustColor = () => {
    const total = post.likes + post.dislikes;
    if (total === 0) return 'trust-unknown';
    const score = post.likes / total;
    if (score >= 0.8) return 'trust-high';
    if (score >= 0.6) return 'trust-medium';
    return 'trust-low';
  };

  const formatTimestamp = (date: Date) => {
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
  };

  const handleVote = (type: 'up' | 'down') => {
    onVote(post.id, type);
  };

  const handleTranslate = async () => {
    if (isTranslated) {
      setIsTranslated(false);
      return;
    }

    setIsTranslating(true);
    try {
      const translated = await translatePost(post.content, language);
      setTranslatedContent(translated);
      setIsTranslated(true);
    } catch (error) {
      console.error('Translation failed:', error);
    } finally {
      setIsTranslating(false);
    }
  };

  const canTranslate = isTranslationAvailable(post.content, language);

  return (
    <Card className="mb-4">
      <CardContent className="p-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <span className="text-2xl">{getCategoryEmoji(post.category)}</span>
            <div>
              <div className="flex items-center space-x-2">
                <p className="font-semibold text-foreground">{post.authorName}</p>
                {post.authorUserType === 'trusted' && (
                  <Badge variant="secondary" className="text-xs bg-blue-100 text-blue-800 border-blue-200">
                    <Shield className="h-3 w-3 mr-1" />
                    Trusted
                  </Badge>
                )}
                {post.authorUserType === 'verified' && (
                  <Badge variant="secondary" className="text-xs bg-green-100 text-green-800 border-green-200">
                    <Crown className="h-3 w-3 mr-1" />
                    Verified
                  </Badge>
                )}
              </div>
              <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                <span className="capitalize">{post.category}</span>
                {post.distance !== undefined && (
                  <>
                    <span>•</span>
                    <div className="flex items-center">
                      <MapPin className="h-3 w-3 mr-1" />
                      <span>{post.distance.toFixed(1)} {t('km', language)} {t('distance', language)}</span>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
          <span className="text-xs text-muted-foreground">{formatTimestamp(post.timestamp)}</span>
        </div>

        {/* Content */}
        <div className="mb-4">
          <div className="relative">
            <p className="text-foreground leading-relaxed">
              {isTranslated ? translatedContent : post.content}
            </p>
            
            {/* Translation indicator */}
            {isTranslated && (
              <div className="mt-2 flex items-center space-x-2 text-xs text-muted-foreground bg-blue-50 dark:bg-blue-950/20 px-2 py-1 rounded">
                <Languages className="h-3 w-3" />
                <span>{t('translatedTo', language)} {getLanguageName(language)}</span>
              </div>
            )}
          </div>
          
          {/* Translation button */}
          {canTranslate && (
            <div className="mt-3">
              <Button
                variant={isTranslated ? "outline" : "secondary"}
                size="sm"
                onClick={handleTranslate}
                disabled={isTranslating}
                className={`flex items-center space-x-2 transition-all duration-200 ${
                  isTranslated 
                    ? 'border-blue-200 text-blue-700 hover:bg-blue-50 dark:border-blue-800 dark:text-blue-300 dark:hover:bg-blue-950/20' 
                    : 'bg-blue-100 text-blue-700 hover:bg-blue-200 dark:bg-blue-950/30 dark:text-blue-300 dark:hover:bg-blue-950/50'
                }`}
              >
                {isTranslating ? (
                  <>
                    <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-current"></div>
                    <span>{t('translating', language)}</span>
                  </>
                ) : isTranslated ? (
                  <>
                    <RotateCcw className="h-3 w-3" />
                    <span>{t('showOriginal', language)}</span>
                  </>
                ) : (
                  <>
                    <Languages className="h-3 w-3" />
                    <span>{t('translate', language)} {t('translatedTo', language)} {getLanguageName(language)}</span>
                  </>
                )}
              </Button>
            </div>
          )}
        </div>

        {/* Supplier highlight */}
        {post.supplierName && (
          <div className={`inline-block px-3 py-1 rounded-full text-xs font-medium mb-4 bg-${getTrustColor()}/10 text-${getTrustColor()}`}>
            📍 {post.supplierName}
          </div>
        )}

        {/* Action buttons */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleVote('up')}
              className={`flex items-center space-x-1 ${
                userVote === 'up' ? 'bg-trust-high/20 text-trust-high' : ''
              }`}
            >
              <ThumbsUp className={`h-4 w-4 ${userVote === 'up' ? 'fill-current' : ''}`} />
              <span className="font-medium">{post.likes}</span>
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleVote('down')}
              className={`flex items-center space-x-1 ${
                userVote === 'down' ? 'bg-trust-low/20 text-trust-low' : ''
              }`}
            >
              <ThumbsDown className={`h-4 w-4 ${userVote === 'down' ? 'fill-current' : ''}`} />
              <span className="font-medium">{post.dislikes}</span>
            </Button>
          </div>

          <Button variant="ghost" size="sm" className="flex items-center space-x-1">
            <MessageCircle className="h-4 w-4" />
            <span className="font-medium">{post.comments}</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};