import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { User, Star, ShoppingBag, MessageSquare, ThumbsUp, Eye, EyeOff, Shield, Crown, FileText, TrendingUp } from "lucide-react";
import { UserPreferences, Supplier } from "@/types";
import { Language } from "@/utils/translations";
import { t } from "@/utils/translations";
import { TrustedMemberVerification } from "./TrustedMemberVerification";
import { BusinessModelOverview } from "./BusinessModelOverview";

interface ProfileProps {
  userPreferences: UserPreferences;
  onLogout: () => void;
  onUpdatePreferences: (preferences: UserPreferences) => void;
  votingHistory: Array<{
    id: string;
    action: string;
    post: string;
    timestamp: string;
    category: string;
  }>;
  userPosts: Array<{
    id: string;
    content: string;
    category: string;
    likes: number;
    dislikes: number;
    timestamp: string;
    supplierName?: string;
  }>;
  suppliers: Supplier[];
  getUserSupplierVote: (supplierId: string) => 'up' | 'down' | null;
}

export const Profile = ({ 
  userPreferences, 
  onLogout, 
  onUpdatePreferences, 
  votingHistory, 
  userPosts,
  suppliers,
  getUserSupplierVote
}: ProfileProps) => {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isMyPostsOpen, setIsMyPostsOpen] = useState(false);
  const [isVotingHistoryOpen, setIsVotingHistoryOpen] = useState(false);
  const [showTrustedVerification, setShowTrustedVerification] = useState(false);
  const [showBusinessModel, setShowBusinessModel] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  // Settings state
  const [settings, setSettings] = useState({
    language: userPreferences.language,
    notifications: true,
    locationSharing: true,
    darkMode: false,
    email: 'rajesh.kumar@example.com',
    password: '••••••••'
  });

  const user = {
    name: userPreferences.name,
    phone: userPreferences.phone,
    location: `${userPreferences.location.area}, ${userPreferences.location.city}`,
    joinedDate: "January 2024"
  };

  const stats = {
    postsShared: userPosts.length, // Use actual user posts count
    helpfulVotes: votingHistory.length, // Use actual voting history length
    trustedSuppliers: 8,
    commentsPosted: 23
  };

  // Get user's trusted suppliers (only those they've voted up)
  const getTrustedSuppliers = () => {
    return suppliers
      .filter(supplier => getUserSupplierVote(supplier.id) === 'up')
      .map(supplier => {
        const total = supplier.thumbsUp + supplier.thumbsDown;
        const trustScore = total > 0 ? Math.round((supplier.thumbsUp / total) * 100) : 75;
        
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

        return {
          name: supplier.name,
          category: supplier.category,
          emoji: getCategoryEmoji(supplier.category),
          score: trustScore,
          isVerified: supplier.isVerified
        };
      })
      .sort((a, b) => b.score - a.score); // Sort by trust score (highest first)
  };

  const trustedSuppliers = getTrustedSuppliers();

  const handleLanguageChange = (newLanguage: Language) => {
    setSettings(prev => ({ ...prev, language: newLanguage }));
    onUpdatePreferences({ ...userPreferences, language: newLanguage });
  };

  const handleSaveSettings = () => {
    // In a real app, this would save to backend
    console.log('Settings saved:', settings);
    setIsSettingsOpen(false);
  };

  const handleLogout = () => {
    if (confirm('Are you sure you want to logout?')) {
      onLogout();
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4 pb-20">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-foreground">{t('profile', userPreferences.language)}</h1>
        <span className="text-2xl">👤</span>
      </div>

      {/* User info card */}
      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center">
              <User className="h-8 w-8 text-primary-foreground" />
            </div>
            <div>
              <CardTitle>{user.name}</CardTitle>
              <p className="text-muted-foreground text-sm">{user.phone}</p>
              <p className="text-muted-foreground text-xs">📍 {user.location}</p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">
              Member since {user.joinedDate}
            </span>
            <Badge variant="secondary">
              <Star className="h-3 w-3 mr-1" />
              Trusted Member
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Stats cards */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <Card>
          <CardContent className="p-4 text-center">
            <MessageSquare className="h-8 w-8 text-primary mx-auto mb-2" />
            <p className="text-2xl font-bold text-foreground">{stats.postsShared}</p>
            <p className="text-xs text-muted-foreground">Posts Shared</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <ThumbsUp className="h-8 w-8 text-trust-high mx-auto mb-2" />
            <p className="text-2xl font-bold text-foreground">{stats.helpfulVotes}</p>
            <p className="text-xs text-muted-foreground">Helpful Votes</p>
          </CardContent>
        </Card>
      </div>

      {/* Trusted suppliers */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <ShoppingBag className="h-5 w-5" />
            <span>My Trusted Suppliers ({trustedSuppliers.length})</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {trustedSuppliers.length > 0 ? (
            trustedSuppliers.map((supplier, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <div className="flex items-center space-x-3">
                  <span className="text-xl">{supplier.emoji}</span>
                  <div>
                    <p className="font-medium text-foreground">{supplier.name}</p>
                    <div className="flex items-center space-x-2">
                      <p className="text-xs text-muted-foreground capitalize">{supplier.category}</p>
                      {supplier.isVerified && (
                        <Badge variant="secondary" className="text-xs">
                          <Star className="h-3 w-3 mr-1" />
                          Verified
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-trust-high">{supplier.score}%</p>
                  <p className="text-xs text-muted-foreground">Trust Score</p>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <ShoppingBag className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>No trusted suppliers yet</p>
              <p className="text-xs">Vote up suppliers you trust to see them here</p>
            </div>
          )}
          
          <Button variant="outline" className="w-full mt-4">
            View All Suppliers
          </Button>
        </CardContent>
      </Card>

      {/* Verification Status */}
      {(userPreferences.userType === 'trusted' || userPreferences.userType === 'verified') && (
        <Card className="mb-6 border-green-200 bg-green-50/50">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-green-900">
              {userPreferences.userType === 'trusted' ? 
                <Shield className="h-5 w-5" /> : 
                <Crown className="h-5 w-5" />
              }
              <span>{userPreferences.userType === 'trusted' ? 'Trusted' : 'Verified'} Member</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-green-800">Verification Status</span>
              <Badge className="bg-green-100 text-green-800">
                {userPreferences.userType === 'verified' ? '✅ Government Verified' : '🛡️ Trusted Member'}
              </Badge>
            </div>
            {userPreferences.businessDocuments && userPreferences.businessDocuments.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm font-medium text-green-900">Uploaded Documents</p>
                {userPreferences.businessDocuments.slice(0, 2).map((doc) => (
                  <div key={doc.id} className="flex items-center justify-between text-sm">
                    <span className="text-green-700">{doc.fileName}</span>
                    <Badge variant={doc.status === 'approved' ? 'default' : doc.status === 'rejected' ? 'destructive' : 'secondary'}>
                      {doc.status}
                    </Badge>
                  </div>
                ))}
                {userPreferences.businessDocuments.length > 2 && (
                  <Button 
                    variant="link" 
                    size="sm" 
                    onClick={() => setShowTrustedVerification(true)}
                    className="text-green-700 p-0 h-auto"
                  >
                    View all {userPreferences.businessDocuments.length} documents
                  </Button>
                )}
              </div>
            )}
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setShowTrustedVerification(true)}
              className="w-full border-green-200 text-green-700 hover:bg-green-50"
            >
              <FileText className="h-4 w-4 mr-2" />
              Manage Verification
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Quick actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Dialog open={isMyPostsOpen} onOpenChange={setIsMyPostsOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="w-full justify-start">
                📝 My Posts & Comments ({userPosts.length})
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>My Posts & Comments</DialogTitle>
              </DialogHeader>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {userPosts.length > 0 ? (
                  userPosts.map(post => (
                    <div key={post.id} className="p-3 border rounded-lg">
                      <p className="text-sm font-medium">{post.content}</p>
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center space-x-2">
                          <Badge variant="secondary" className="text-xs">
                            {post.category}
                          </Badge>
                          {post.supplierName && (
                            <Badge variant="outline" className="text-xs">
                              📍 {post.supplierName}
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                          <ThumbsUp className="h-3 w-3" />
                          <span>{post.likes}</span>
                          <span>•</span>
                          <span>{post.timestamp}</span>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <MessageSquare className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p>No posts yet</p>
                    <p className="text-xs">Start sharing your experiences to see them here</p>
                  </div>
                )}
              </div>
            </DialogContent>
          </Dialog>

          <Dialog open={isVotingHistoryOpen} onOpenChange={setIsVotingHistoryOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="w-full justify-start">
                📊 My Voting History ({votingHistory.length})
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>My Voting History</DialogTitle>
              </DialogHeader>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {votingHistory.length > 0 ? (
                  votingHistory.map(vote => (
                    <div key={vote.id} className="p-3 border rounded-lg">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">{vote.action}</span>
                        <span className="text-xs text-muted-foreground">{vote.timestamp}</span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">{vote.post}</p>
                      <Badge variant="outline" className="text-xs mt-1">
                        {vote.category}
                      </Badge>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <ThumbsUp className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p>No voting history yet</p>
                    <p className="text-xs">Start voting on posts to see your history here</p>
                  </div>
                )}
              </div>
            </DialogContent>
          </Dialog>

          <Dialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="w-full justify-start">
                ⚙️ Settings & Privacy
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Settings & Privacy</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Language</Label>
                  <Select value={settings.language} onValueChange={handleLanguageChange}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="hi">हिंदी</SelectItem>
                      <SelectItem value="bn">বাংলা</SelectItem>
                      <SelectItem value="ta">தமிழ்</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input value={settings.email} onChange={(e) => setSettings(prev => ({ ...prev, email: e.target.value }))} />
                </div>

                <div className="space-y-2">
                  <Label>Password</Label>
                  <div className="relative">
                    <Input 
                      type={showPassword ? "text" : "password"} 
                      value={settings.password}
                      onChange={(e) => setSettings(prev => ({ ...prev, password: e.target.value }))}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="notifications">Push Notifications</Label>
                    <Switch
                      id="notifications"
                      checked={settings.notifications}
                      onCheckedChange={(checked) => setSettings(prev => ({ ...prev, notifications: checked }))}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label htmlFor="location">Location Sharing</Label>
                    <Switch
                      id="location"
                      checked={settings.locationSharing}
                      onCheckedChange={(checked) => setSettings(prev => ({ ...prev, locationSharing: checked }))}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label htmlFor="darkMode">Dark Mode</Label>
                    <Switch
                      id="darkMode"
                      checked={settings.darkMode}
                      onCheckedChange={(checked) => setSettings(prev => ({ ...prev, darkMode: checked }))}
                    />
                  </div>
                </div>

                <div className="flex space-x-2 pt-4">
                  <Button variant="outline" onClick={() => setIsSettingsOpen(false)} className="flex-1">
                    Cancel
                  </Button>
                  <Button onClick={handleSaveSettings} className="flex-1">
                    Save Changes
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          <Button 
            variant="outline" 
            className="w-full justify-start text-destructive hover:text-destructive"
            onClick={handleLogout}
          >
            🚪 Logout
          </Button>
        </CardContent>
      </Card>

      {/* Trusted Member Verification Modal */}
      {showTrustedVerification && (
        <TrustedMemberVerification
          user={userPreferences}
          onUpdateUser={onUpdatePreferences}
          onClose={() => setShowTrustedVerification(false)}
        />
      )}

      {/* Business Model Overview Modal */}
      {showBusinessModel && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-background rounded-lg max-w-7xl max-h-[90vh] overflow-y-auto">
            <div className="p-4 border-b flex items-center justify-between">
              <h2 className="text-xl font-semibold">TRUST_BASKET Business Model</h2>
              <Button variant="ghost" size="sm" onClick={() => setShowBusinessModel(false)}>
                ✕
              </Button>
            </div>
            <BusinessModelOverview />
          </div>
        </div>
      )}
    </div>
  );
};