import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, MapPin, Star, TrendingUp, Shield, Bot, ThumbsUp, ThumbsDown } from "lucide-react";
import { UserPreferences, Supplier } from "@/types";
import { t } from "@/utils/translations";
import { calculateDistance } from "@/utils/location";

interface SupplierListProps {
  userPreferences: UserPreferences;
  suppliers: Supplier[];
  onVoteSupplier: (supplierId: string, type: 'up' | 'down') => void;
  getUserSupplierVote: (supplierId: string) => 'up' | 'down' | null;
}

export const SupplierList = ({ 
  userPreferences, 
  suppliers, 
  onVoteSupplier, 
  getUserSupplierVote 
}: SupplierListProps) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Calculate distances and sort by proximity
  const suppliersWithDistance = useMemo(() => {
    return suppliers
      .map(supplier => ({
        ...supplier,
        distance: calculateDistance(userPreferences.location, supplier.location)
      }))
      .sort((a, b) => a.distance - b.distance);
  }, [suppliers, userPreferences.location]);

  // Filter suppliers based on category and search
  const filteredSuppliers = useMemo(() => {
    return suppliersWithDistance.filter(supplier => {
      const matchesCategory = selectedCategory === 'all' || supplier.category === selectedCategory;
      const matchesSearch = supplier.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           supplier.category.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [suppliersWithDistance, selectedCategory, searchQuery]);

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

  const getTrustScore = (supplier: Supplier) => {
    const total = supplier.thumbsUp + supplier.thumbsDown;
    if (total === 0) return 75; // Default score
    return Math.round((supplier.thumbsUp / total) * 100);
  };

  const getTrustColor = (score: number) => {
    if (score >= 80) return 'text-trust-high';
    if (score >= 60) return 'text-trust-medium';
    return 'text-trust-low';
  };

  const handleVote = (supplierId: string, type: 'up' | 'down') => {
    onVoteSupplier(supplierId, type);
  };

  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'vegetables', label: '🥬 Vegetables' },
    { value: 'spices', label: '🌶️ Spices' },
    { value: 'oil', label: '🛢️ Oil' },
    { value: 'packaging', label: '📦 Packaging' },
    { value: 'meat', label: '🥩 Meat' },
    { value: 'dairy', label: '🥛 Dairy' },
  ];

  return (
    <div className="max-w-2xl mx-auto p-4 pb-20">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">{t('suppliers', userPreferences.language)}</h1>
          <p className="text-sm text-muted-foreground">Discover trusted suppliers in your area</p>
        </div>
        <span className="text-2xl">🏪</span>
      </div>

      {/* Search and Filter */}
      <div className="space-y-4 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search suppliers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {categories.map(category => (
              <SelectItem key={category.value} value={category.value}>
                {category.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* AI Detection Notice */}
      {suppliers.some(s => !s.isVerified) && (
        <Card className="mb-6 bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Bot className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm font-medium text-blue-800 dark:text-blue-200">
                  AI-Detected Suppliers
                </p>
                <p className="text-xs text-blue-600 dark:text-blue-300">
                  Some suppliers were automatically detected from user posts
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Suppliers List */}
      <div className="space-y-4">
        {filteredSuppliers.length > 0 ? (
          filteredSuppliers.map(supplier => {
            const trustScore = getTrustScore(supplier);
            const trustColor = getTrustColor(trustScore);
            const userVote = getUserSupplierVote(supplier.id);
            
            return (
              <Card key={supplier.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3">
                      <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center">
                        <span className="text-2xl">{getCategoryEmoji(supplier.category)}</span>
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <h3 className="font-semibold text-foreground">{supplier.name}</h3>
                          {supplier.isVerified ? (
                            <Badge variant="secondary" className="text-xs">
                              <Shield className="h-3 w-3 mr-1" />
                              Verified
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="text-xs">
                              <Bot className="h-3 w-3 mr-1" />
                              AI Detected
                            </Badge>
                          )}
                        </div>
                        
                        <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-2">
                          <span className="capitalize">{supplier.category}</span>
                          <div className="flex items-center">
                            <MapPin className="h-3 w-3 mr-1" />
                            <span>{supplier.distance?.toFixed(1)} km away</span>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center space-x-1">
                            <Star className={`h-4 w-4 ${trustColor}`} />
                            <span className={`text-sm font-medium ${trustColor}`}>
                              {trustScore}%
                            </span>
                          </div>
                          
                          {/* Voting Buttons */}
                          <div className="flex items-center space-x-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleVote(supplier.id, 'up')}
                              className={`flex items-center space-x-1 px-2 py-1 h-auto ${
                                userVote === 'up' 
                                  ? 'bg-trust-high/20 text-trust-high' 
                                  : 'hover:bg-trust-high/10 hover:text-trust-high'
                              }`}
                            >
                              <ThumbsUp className={`h-3 w-3 ${userVote === 'up' ? 'fill-current' : ''}`} />
                              <span className="text-xs font-medium">{supplier.thumbsUp}</span>
                            </Button>

                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleVote(supplier.id, 'down')}
                              className={`flex items-center space-x-1 px-2 py-1 h-auto ${
                                userVote === 'down' 
                                  ? 'bg-trust-low/20 text-trust-low' 
                                  : 'hover:bg-trust-low/10 hover:text-trust-low'
                              }`}
                            >
                              <ThumbsDown className={`h-3 w-3 ${userVote === 'down' ? 'fill-current' : ''}`} />
                              <span className="text-xs font-medium">{supplier.thumbsDown}</span>
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })
        ) : (
          <Card>
            <CardContent className="p-8 text-center">
              <div className="text-4xl mb-4">🏪</div>
              <h3 className="text-lg font-semibold mb-2">No suppliers found</h3>
              <p className="text-muted-foreground text-sm">
                Try adjusting your search or category filter
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Stats */}
      <div className="mt-8 grid grid-cols-2 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <TrendingUp className="h-8 w-8 text-primary mx-auto mb-2" />
            <p className="text-2xl font-bold text-foreground">{suppliers.length}</p>
            <p className="text-xs text-muted-foreground">Total Suppliers</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <Shield className="h-8 w-8 text-trust-high mx-auto mb-2" />
            <p className="text-2xl font-bold text-foreground">
              {suppliers.filter(s => s.isVerified).length}
            </p>
            <p className="text-xs text-muted-foreground">Verified</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};