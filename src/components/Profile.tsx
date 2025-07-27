import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { User, Star, ShoppingBag, MessageSquare, ThumbsUp, Settings, LogOut, Edit, Eye, EyeOff } from "lucide-react";
import { UserPreferences } from "@/types";
import { Language } from "@/utils/translations";
import { t } from "@/utils/translations";

interface ProfileProps {
  userPreferences: UserPreferences;
  onLogout: () => void;
  onUpdatePreferences: (preferences: UserPreferences) => void;
}

export const Profile = ({ userPreferences, onLogout, onUpdatePreferences }: ProfileProps) => {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isMyPostsOpen, setIsMyPostsOpen] = useState(false);
  const [isVotingHistoryOpen, setIsVotingHistoryOpen] = useState(false);
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
    postsShared: 12,
    helpfulVotes: 45,
    trustedSuppliers: 8,
    commentsPosted: 23
  };

  const trustedSuppliers = [
    { name: "Green Valley Farms", category: "vegetables", emoji: "🥬", score: 92 },
    { name: "City Distributors", category: "oil", emoji: "🛢️", score: 88 },
    { name: "EcoWrap", category: "packaging", emoji: "📦", score: 95 },
  ];

  const myPosts = [
    { id: 1, content: "Got fresh tomatoes from Green Valley Farms. Quality was excellent!", category: "vegetables", likes: 12, timestamp: "2h ago" },
    { id: 2, content: "Spice Palace delivered adulterated turmeric powder. Very disappointed.", category: "spices", likes: 2, timestamp: "1d ago" },
    { id: 3, content: "Sunflower oil from City Distributors is good quality and reasonably priced.", category: "oil", likes: 15, timestamp: "3d ago" },
  ];

  const votingHistory = [
    { id: 1, action: "👍 Liked", post: "Fresh vegetables from local market", timestamp: "1h ago" },
    { id: 2, action: "👎 Disliked", post: "Poor quality dairy products", timestamp: "3h ago" },
    { id: 3, action: "👍 Liked", post: "Excellent packaging supplier", timestamp: "1d ago" },
  ];

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
            <span>My Trusted Suppliers</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {trustedSuppliers.map((supplier, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
              <div className="flex items-center space-x-3">
                <span className="text-xl">{supplier.emoji}</span>
                <div>
                  <p className="font-medium text-foreground">{supplier.name}</p>
                  <p className="text-xs text-muted-foreground capitalize">{supplier.category}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-trust-high">{supplier.score}%</p>
                <p className="text-xs text-muted-foreground">Trust Score</p>
              </div>
            </div>
          ))}
          
          <Button variant="outline" className="w-full mt-4">
            View All Suppliers
          </Button>
        </CardContent>
      </Card>

      {/* Quick actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Dialog open={isMyPostsOpen} onOpenChange={setIsMyPostsOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="w-full justify-start">
                📝 My Posts & Comments
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>My Posts & Comments</DialogTitle>
              </DialogHeader>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {myPosts.map(post => (
                  <div key={post.id} className="p-3 border rounded-lg">
                    <p className="text-sm font-medium">{post.content}</p>
                    <div className="flex items-center justify-between mt-2">
                      <Badge variant="secondary" className="text-xs">
                        {post.category}
                      </Badge>
                      <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                        <ThumbsUp className="h-3 w-3" />
                        <span>{post.likes}</span>
                        <span>•</span>
                        <span>{post.timestamp}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </DialogContent>
          </Dialog>

          <Dialog open={isVotingHistoryOpen} onOpenChange={setIsVotingHistoryOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="w-full justify-start">
                📊 My Voting History
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>My Voting History</DialogTitle>
              </DialogHeader>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {votingHistory.map(vote => (
                  <div key={vote.id} className="p-3 border rounded-lg">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{vote.action}</span>
                      <span className="text-xs text-muted-foreground">{vote.timestamp}</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">{vote.post}</p>
                  </div>
                ))}
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
    </div>
  );
};