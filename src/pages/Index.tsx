import { useState, useEffect } from "react";
import { AuthLogin } from "@/components/AuthLogin";
import { LoadingScreen } from "@/components/LoadingScreen";
import { BottomNav } from "@/components/BottomNav";
import { HomeFeed } from "@/components/HomeFeed";
import { SupplierList } from "@/components/SupplierList";
import { CreatePost } from "@/components/CreatePost";
import { Profile } from "@/components/Profile";
import { UserPreferences, Post, Vote, UserVote, Supplier } from "@/types";
import { detectSupplierFromPost, analyzePostsForSuppliers } from "@/utils/supplierDetection";

const Index = () => {
  const [isLoading, setIsLoading] = useState(true);
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
      authorUserType: 'trusted',
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
      authorUserType: 'verified',
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
      authorUserType: 'regular',
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
      authorUserType: 'trusted',
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
      authorUserType: 'regular',
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
      authorUserType: 'verified',
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

  // Track user's votes for each post
  const [userVotes, setUserVotes] = useState<UserVote[]>([]);
  
  // Track all voting history for the profile
  const [votingHistory, setVotingHistory] = useState<Vote[]>([]);

  // Track user's votes for suppliers
  const [userSupplierVotes, setUserSupplierVotes] = useState<UserVote[]>([]);

  // Track suppliers (both existing and AI-detected)
  const [suppliers, setSuppliers] = useState<Supplier[]>([
    {
      id: '1',
      name: 'Green Valley Farms',
      category: 'vegetables',
      thumbsUp: 12,
      thumbsDown: 1,
      isVerified: true,
      location: {
        latitude: 28.6129,
        longitude: 77.2295,
        address: 'Delhi',
        area: 'Delhi',
        city: 'Delhi'
      }
    },
    {
      id: '2',
      name: 'City Distributors',
      category: 'oil',
      thumbsUp: 15,
      thumbsDown: 0,
      isVerified: true,
      location: {
        latitude: 28.6129,
        longitude: 77.2295,
        address: 'Delhi',
        area: 'Delhi',
        city: 'Delhi'
      }
    },
    {
      id: '3',
      name: 'Spice Palace',
      category: 'spices',
      thumbsUp: 2,
      thumbsDown: 8,
      isVerified: false,
      location: {
        latitude: 28.6129,
        longitude: 77.2295,
        address: 'Delhi',
        area: 'Delhi',
        city: 'Delhi'
      }
    },
    {
      id: '4',
      name: 'EcoWrap',
      category: 'packaging',
      thumbsUp: 8,
      thumbsDown: 1,
      isVerified: true,
      location: {
        latitude: 28.6129,
        longitude: 77.2295,
        address: 'Delhi',
        area: 'Delhi',
        city: 'Delhi'
      }
    }
  ]);

  const handleLoadingComplete = () => {
    setIsLoading(false);
  };

  const handleLogin = (preferences: UserPreferences) => {
    setUserPreferences(preferences);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUserPreferences(null);
    setActiveTab('feed');
    // Clear user votes and history on logout
    setUserVotes([]);
    setVotingHistory([]);
    setUserSupplierVotes([]);
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
      authorUserType: userPreferences?.userType || 'regular',
      location: userPreferences?.location || {
        latitude: 28.6129,
        longitude: 77.2295,
        address: 'Delhi',
        area: 'Delhi',
        city: 'Delhi'
      }
    };

    // Detect supplier from post content
    const detectedSupplier = detectSupplierFromPost(post);
    if (detectedSupplier) {
      post.supplierName = detectedSupplier.name;
      console.log('AI detected supplier:', detectedSupplier);
    }

    setPosts(prevPosts => [post, ...prevPosts]); // Add new post at the beginning
    setActiveTab('feed'); // Switch to feed to show the new post
  };

  // Analyze posts for new suppliers periodically
  useEffect(() => {
    if (posts.length > 0) {
      const newSuppliers = analyzePostsForSuppliers(posts, suppliers);
      if (newSuppliers.length > 0) {
        setSuppliers(prevSuppliers => [...prevSuppliers, ...newSuppliers]);
        console.log('AI added new suppliers:', newSuppliers);
      }
    }
  }, [posts, suppliers]);

  const handleVote = (postId: string, type: 'up' | 'down') => {
    if (!userPreferences) return;

    const currentVote = userVotes.find(vote => vote.postId === postId);
    const post = posts.find(p => p.id === postId);
    
    if (!post) return;

    let newVoteType: 'up' | 'down' | null = type;
    
    // If clicking the same vote type, remove the vote
    if (currentVote?.type === type) {
      newVoteType = null;
    }

    // Update user votes
    setUserVotes(prevVotes => {
      const filtered = prevVotes.filter(vote => vote.postId !== postId);
      if (newVoteType) {
        return [...filtered, { postId, type: newVoteType }];
      }
      return filtered;
    });

    // Update post counts
    setPosts(prevPosts => 
      prevPosts.map(post => {
        if (post.id === postId) {
          let newLikes = post.likes;
          let newDislikes = post.dislikes;

          // Remove previous vote if exists
          if (currentVote?.type === 'up') newLikes--;
          if (currentVote?.type === 'down') newDislikes--;

          // Add new vote
          if (newVoteType === 'up') newLikes++;
          if (newVoteType === 'down') newDislikes++;

          return {
            ...post,
            likes: newLikes,
            dislikes: newDislikes
          };
        }
        return post;
      })
    );

    // Update voting history
    if (newVoteType) {
      const vote: Vote = {
        id: Date.now().toString(),
        postId,
        userId: userPreferences.phone,
        type: newVoteType,
        timestamp: new Date(),
        postContent: post.content,
        postCategory: post.category
      };

      setVotingHistory(prevHistory => [vote, ...prevHistory]);
    } else {
      // Remove from history if vote was cancelled
      setVotingHistory(prevHistory => 
        prevHistory.filter(vote => !(vote.postId === postId && vote.userId === userPreferences.phone))
      );
    }
  };

  const handleVoteSupplier = (supplierId: string, type: 'up' | 'down') => {
    if (!userPreferences) return;

    const currentVote = userSupplierVotes.find(vote => vote.postId === supplierId);
    
    let newVoteType: 'up' | 'down' | null = type;
    
    // If clicking the same vote type, remove the vote
    if (currentVote?.type === type) {
      newVoteType = null;
    }

    // Update user supplier votes
    setUserSupplierVotes(prevVotes => {
      const filtered = prevVotes.filter(vote => vote.postId !== supplierId);
      if (newVoteType) {
        return [...filtered, { postId: supplierId, type: newVoteType }];
      }
      return filtered;
    });

    // Update supplier counts
    setSuppliers(prevSuppliers => 
      prevSuppliers.map(supplier => {
        if (supplier.id === supplierId) {
          let newThumbsUp = supplier.thumbsUp;
          let newThumbsDown = supplier.thumbsDown;

          // Remove previous vote if exists
          if (currentVote?.type === 'up') newThumbsUp--;
          if (currentVote?.type === 'down') newThumbsDown--;

          // Add new vote
          if (newVoteType === 'up') newThumbsUp++;
          if (newVoteType === 'down') newThumbsDown++;

          return {
            ...supplier,
            thumbsUp: newThumbsUp,
            thumbsDown: newThumbsDown
          };
        }
        return supplier;
      })
    );
  };

  // Get user's current vote for a specific post
  const getUserVote = (postId: string): 'up' | 'down' | null => {
    const vote = userVotes.find(v => v.postId === postId);
    return vote?.type || null;
  };

  // Get user's current vote for a specific supplier
  const getUserSupplierVote = (supplierId: string): 'up' | 'down' | null => {
    const vote = userSupplierVotes.find(v => v.postId === supplierId);
    return vote?.type || null;
  };

  // Get voting history for profile
  const getVotingHistory = () => {
    return votingHistory.map(vote => ({
      id: vote.id,
      action: vote.type === 'up' ? '👍 Liked' : '👎 Disliked',
      post: vote.postContent,
      timestamp: formatTimestamp(vote.timestamp),
      category: vote.postCategory
    }));
  };

  // Get user's recent posts for profile
  const getUserPosts = () => {
    if (!userPreferences) return [];
    
    return posts
      .filter(post => post.authorPhone === userPreferences.phone)
      .map(post => ({
        id: post.id,
        content: post.content,
        category: post.category,
        likes: post.likes,
        dislikes: post.dislikes,
        timestamp: formatTimestamp(post.timestamp),
        supplierName: post.supplierName
      }))
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  };

  const formatTimestamp = (date: Date) => {
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
  };

  // Show loading screen first
  if (isLoading) {
    return <LoadingScreen onComplete={handleLoadingComplete} />;
  }

  if (!isAuthenticated || !userPreferences) {
    return <AuthLogin onLogin={handleLogin} />;
  }

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'feed':
        return <HomeFeed 
          userPreferences={userPreferences} 
          posts={posts} 
          onVote={handleVote}
          getUserVote={getUserVote}
        />;
      case 'suppliers':
        return <SupplierList 
          userPreferences={userPreferences} 
          suppliers={suppliers}
          onVoteSupplier={handleVoteSupplier}
          getUserSupplierVote={getUserSupplierVote}
        />;
      case 'post':
        return <CreatePost userPreferences={userPreferences} onCreatePost={handleCreatePost} />;
      case 'profile':
        return <Profile 
          userPreferences={userPreferences} 
          onLogout={handleLogout} 
          onUpdatePreferences={handleUpdatePreferences}
          votingHistory={getVotingHistory()}
          userPosts={getUserPosts()}
          suppliers={suppliers}
          getUserSupplierVote={getUserSupplierVote}
        />;
      default:
        return <HomeFeed 
          userPreferences={userPreferences} 
          posts={posts} 
          onVote={handleVote}
          getUserVote={getUserVote}
        />;
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
