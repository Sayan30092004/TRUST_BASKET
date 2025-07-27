import { useState } from "react";
import { AuthLogin } from "@/components/AuthLogin";
import { BottomNav } from "@/components/BottomNav";
import { HomeFeed } from "@/components/HomeFeed";
import { SupplierList } from "@/components/SupplierList";
import { CreatePost } from "@/components/CreatePost";
import { Profile } from "@/components/Profile";
import { UserPreferences, Post } from "@/types";

const Index = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userPreferences, setUserPreferences] = useState<UserPreferences | null>(null);
  const [activeTab, setActiveTab] = useState('feed');
  const [posts, setPosts] = useState<Post[]>([
    {
      id: '1',
      content: 'Got fresh tomatoes from Green Valley Farms. Quality was excellent, no rotten pieces. Highly recommend! 🍅',
      category: 'vegetables',
      authorName: 'Rajesh Kumar',
      authorPhone: '+91 98765 43210',
      supplierName: 'Green Valley Farms',
      likes: 12,
      dislikes: 1,
      comments: 3,
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      location: {
        latitude: 28.6129,
        longitude: 77.2295,
        address: 'Connaught Place',
        area: 'CP',
        city: 'Delhi'
      }
    },
    {
      id: '2',
      content: 'Spice Palace delivered adulterated turmeric powder. Very disappointed. Avoid this supplier!',
      category: 'spices',
      authorName: 'Priya Devi',
      authorPhone: '+91 87654 32109',
      supplierName: 'Spice Palace',
      likes: 2,
      dislikes: 8,
      comments: 5,
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
      location: {
        latitude: 28.6000,
        longitude: 77.2000,
        address: 'Lajpat Nagar',
        area: 'Lajpat Nagar',
        city: 'Delhi'
      }
    },
    {
      id: '3',
      content: 'Sunflower oil from City Distributors is good quality and reasonably priced. Been using for 3 months.',
      category: 'oil',
      authorName: 'Mohammed Ali',
      authorPhone: '+91 76543 21098',
      supplierName: 'City Distributors',
      likes: 15,
      dislikes: 0,
      comments: 2,
      timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
      location: {
        latitude: 28.6500,
        longitude: 77.2500,
        address: 'Karol Bagh',
        area: 'Karol Bagh',
        city: 'Delhi'
      }
    },
    {
      id: '4',
      content: 'Paper bags from EcoWrap are strong and eco-friendly. Customers love them! Good investment.',
      category: 'packaging',
      authorName: 'Lakshmi',
      authorPhone: '+91 65432 10987',
      supplierName: 'EcoWrap',
      likes: 8,
      dislikes: 1,
      comments: 1,
      timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000),
      location: {
        latitude: 28.6700,
        longitude: 77.2200,
        address: 'Rajouri Garden',
        area: 'Rajouri Garden',
        city: 'Delhi'
      }
    },
    {
      id: '5',
      content: 'Fresh vegetables from local market. Good quality and reasonable prices.',
      category: 'vegetables',
      authorName: 'Anita Sharma',
      authorPhone: '+91 54321 09876',
      supplierName: 'Local Market',
      likes: 6,
      dislikes: 0,
      comments: 2,
      timestamp: new Date(Date.now() - 10 * 60 * 60 * 1000),
      location: {
        latitude: 28.6800,
        longitude: 77.2300,
        address: 'Dwarka',
        area: 'Dwarka',
        city: 'Delhi'
      }
    },
    {
      id: '6',
      content: 'Organic spices from Spice World. Authentic taste and pure quality.',
      category: 'spices',
      authorName: 'Rajesh Patel',
      authorPhone: '+91 43210 98765',
      supplierName: 'Spice World',
      likes: 12,
      dislikes: 1,
      comments: 4,
      timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000),
      location: {
        latitude: 28.6900,
        longitude: 77.2400,
        address: 'Vasant Vihar',
        area: 'Vasant Vihar',
        city: 'Delhi'
      }
    },
    {
      id: '7',
      content: 'Dairy products from MilkCo are fresh and hygienic. Trusted supplier.',
      category: 'dairy',
      authorName: 'Sunita Devi',
      authorPhone: '+91 32109 87654',
      supplierName: 'MilkCo',
      likes: 9,
      dislikes: 0,
      comments: 3,
      timestamp: new Date(Date.now() - 14 * 60 * 60 * 1000),
      location: {
        latitude: 28.7000,
        longitude: 77.2500,
        address: 'Greater Kailash',
        area: 'Greater Kailash',
        city: 'Delhi'
      }
    }
  ]);

  const handleLogin = (preferences: UserPreferences) => {
    setUserPreferences(preferences);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUserPreferences(null);
    setActiveTab('feed');
  };

  const handleUpdatePreferences = (newPreferences: UserPreferences) => {
    setUserPreferences(newPreferences);
  };

  const handleCreatePost = (newPost: Omit<Post, 'id' | 'timestamp' | 'likes' | 'dislikes' | 'comments' | 'authorName' | 'authorPhone' | 'location'>) => {
    const post: Post = {
      ...newPost,
      id: Date.now().toString(), // Simple ID generation
      timestamp: new Date(),
      likes: 0,
      dislikes: 0,
      comments: 0,
      authorName: userPreferences?.name || 'Anonymous User',
      authorPhone: userPreferences?.phone || '+91 00000 00000',
      location: userPreferences?.location || {
        latitude: 28.6129,
        longitude: 77.2295,
        address: 'Delhi',
        area: 'Delhi',
        city: 'Delhi'
      }
    };

    setPosts(prevPosts => [post, ...prevPosts]); // Add new post at the beginning
    setActiveTab('feed'); // Switch to feed to show the new post
  };

  const handleVote = (postId: string, type: 'up' | 'down') => {
    setPosts(prevPosts => 
      prevPosts.map(post => {
        if (post.id === postId) {
          return {
            ...post,
            likes: type === 'up' ? post.likes + 1 : post.likes,
            dislikes: type === 'down' ? post.dislikes + 1 : post.dislikes
          };
        }
        return post;
      })
    );
  };

  if (!isAuthenticated || !userPreferences) {
    return <AuthLogin onLogin={handleLogin} />;
  }

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'feed':
        return <HomeFeed userPreferences={userPreferences} posts={posts} onVote={handleVote} />;
      case 'suppliers':
        return <SupplierList userPreferences={userPreferences} />;
      case 'post':
        return <CreatePost userPreferences={userPreferences} onCreatePost={handleCreatePost} />;
      case 'profile':
        return <Profile userPreferences={userPreferences} onLogout={handleLogout} onUpdatePreferences={handleUpdatePreferences} />;
      default:
        return <HomeFeed userPreferences={userPreferences} posts={posts} onVote={handleVote} />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {renderActiveTab()}
      <BottomNav 
        activeTab={activeTab} 
        onTabChange={setActiveTab} 
        language={userPreferences.language}
      />
    </div>
  );
};

export default Index;
