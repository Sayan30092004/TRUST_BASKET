import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ThumbsUp, ThumbsDown, Star, MapPin } from "lucide-react";
import { UserPreferences, Supplier, Location } from "@/types";
import { t } from "@/utils/translations";
import { calculateDistance, getLocationName } from "@/utils/location";

interface SupplierListProps {
  userPreferences: UserPreferences;
}

export const SupplierList = ({ userPreferences }: SupplierListProps) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [suppliers] = useState<Supplier[]>([
    {
      id: '1',
      name: 'Green Valley Farms',
      category: 'vegetables',
      thumbsUp: 45,
      thumbsDown: 3,
      isVerified: true,
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
      name: 'City Distributors',
      category: 'oil',
      thumbsUp: 32,
      thumbsDown: 1,
      isVerified: true,
      location: {
        latitude: 28.6500,
        longitude: 77.2500,
        address: 'Karol Bagh',
        area: 'Karol Bagh',
        city: 'Delhi'
      }
    },
    {
      id: '3',
      name: 'Spice Palace',
      category: 'spices',
      thumbsUp: 8,
      thumbsDown: 15,
      isVerified: true,
      location: {
        latitude: 28.6000,
        longitude: 77.2000,
        address: 'Lajpat Nagar',
        area: 'Lajpat Nagar',
        city: 'Delhi'
      }
    },
    {
      id: '4',
      name: 'EcoWrap',
      category: 'packaging',
      thumbsUp: 28,
      thumbsDown: 2,
      isVerified: true,
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
      name: 'Fresh Dairy Co.',
      category: 'dairy',
      thumbsUp: 19,
      thumbsDown: 4,
      isVerified: false,
      location: {
        latitude: 28.5800,
        longitude: 77.1800,
        address: 'Vasant Kunj',
        area: 'Vasant Kunj',
        city: 'Delhi'
      }
    }
  ]);

  const categories = [
    { id: 'all', name: t('all', userPreferences.language), emoji: '🏪' },
    { id: 'vegetables', name: t('vegetables', userPreferences.language), emoji: '🥬' },
    { id: 'spices', name: t('spices', userPreferences.language), emoji: '🌶️' },
    { id: 'oil', name: t('oil', userPreferences.language), emoji: '🛢️' },
    { id: 'packaging', name: t('packaging', userPreferences.language), emoji: '📦' },
    { id: 'dairy', name: t('dairy', userPreferences.language), emoji: '🥛' },
  ];

  const getTrustScore = (supplier: Supplier) => {
    const total = supplier.thumbsUp + supplier.thumbsDown;
    return total > 0 ? Math.round((supplier.thumbsUp / total) * 100) : 0;
  };

  const getTrustColor = (score: number) => {
    if (score >= 80) return 'trust-high';
    if (score >= 60) return 'trust-medium';
    return 'trust-low';
  };

  // Calculate distances and sort by proximity
  const suppliersWithDistance = useMemo(() => {
    return suppliers.map(supplier => ({
      ...supplier,
      distance: calculateDistance(userPreferences.location, supplier.location)
    })).sort((a, b) => a.distance - b.distance);
  }, [suppliers, userPreferences.location]);

  const filteredSuppliers = selectedCategory === 'all' 
    ? suppliersWithDistance 
    : suppliersWithDistance.filter(s => s.category === selectedCategory);

  const handleVote = (supplierId: string, type: 'up' | 'down') => {
    // Vote logic would go here
    console.log(`Voted ${type} for supplier ${supplierId}`);
  };

  return (
    <div className="max-w-2xl mx-auto p-4 pb-20">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">{t('suppliers', userPreferences.language)}</h1>
          <p className="text-sm text-muted-foreground flex items-center mt-1">
            <MapPin className="h-4 w-4 mr-1" />
            {t('nearYou', userPreferences.language)} • {getLocationName(userPreferences.location)}
          </p>
        </div>
        <span className="text-2xl">🏪</span>
      </div>

      {/* Category filters */}
      <div className="flex overflow-x-auto space-x-2 mb-6 pb-2">
        {categories.map(category => (
          <Button
            key={category.id}
            variant={selectedCategory === category.id ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedCategory(category.id)}
            className="flex items-center space-x-1 whitespace-nowrap"
          >
            <span>{category.emoji}</span>
            <span>{category.name}</span>
          </Button>
        ))}
      </div>

      {/* Suppliers list */}
      <div className="space-y-4">
        {filteredSuppliers.map(supplier => {
          const trustScore = getTrustScore(supplier);
          const trustColor = getTrustColor(trustScore);
          
          return (
            <Card key={supplier.id}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg flex items-center space-x-2">
                    <span>{supplier.name}</span>
                    {supplier.isVerified && (
                      <Star className="h-4 w-4 text-secondary fill-current" />
                    )}
                  </CardTitle>
                  <div className="flex flex-col items-end space-y-1">
                    <div className={`px-2 py-1 rounded-full text-xs font-bold bg-${trustColor}/20 text-${trustColor}`}>
                      {trustScore}% {t('trust', userPreferences.language)}
                    </div>
                    <div className="flex items-center text-xs text-muted-foreground">
                      <MapPin className="h-3 w-3 mr-1" />
                      {supplier.distance?.toFixed(1)} {t('km', userPreferences.language)} {t('distance', userPreferences.language)}
                    </div>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground capitalize">
                  {categories.find(c => c.id === supplier.category)?.emoji} {supplier.category}
                </p>
              </CardHeader>
              
              <CardContent className="pt-0">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleVote(supplier.id, 'up')}
                      className="flex items-center space-x-1 hover:bg-trust-high/20 hover:text-trust-high"
                    >
                      <ThumbsUp className="h-4 w-4" />
                      <span className="font-medium">{supplier.thumbsUp}</span>
                    </Button>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleVote(supplier.id, 'down')}
                      className="flex items-center space-x-1 hover:bg-trust-low/20 hover:text-trust-low"
                    >
                      <ThumbsDown className="h-4 w-4" />
                      <span className="font-medium">{supplier.thumbsDown}</span>
                    </Button>
                  </div>
                  
                  {supplier.isVerified && (
                    <span className="text-xs text-muted-foreground">
                      {t('verified', userPreferences.language)}
                    </span>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};