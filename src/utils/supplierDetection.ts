import { Post, Supplier } from "@/types";

// Common supplier patterns and keywords
const SUPPLIER_PATTERNS = {
  // Direct mentions
  direct: [
    /from\s+([A-Z][a-zA-Z\s&]+(?:Farms?|Distributors?|Palace|World|Co|Ltd|Inc|Corp|Company|Store|Market|Shop))/gi,
    /at\s+([A-Z][a-zA-Z\s&]+(?:Farms?|Distributors?|Palace|World|Co|Ltd|Inc|Corp|Company|Store|Market|Shop))/gi,
    /by\s+([A-Z][a-zA-Z\s&]+(?:Farms?|Distributors?|Palace|World|Co|Ltd|Inc|Corp|Company|Store|Market|Shop))/gi,
    /supplier\s+([A-Z][a-zA-Z\s&]+)/gi,
    /vendor\s+([A-Z][a-zA-Z\s&]+)/gi,
  ],
  
  // Brand names and common suppliers
  brands: [
    'Green Valley Farms',
    'City Distributors', 
    'Spice Palace',
    'EcoWrap',
    'Spice World',
    'MilkCo',
    'Local Market',
    'Organic Valley',
    'Fresh Farms',
    'Quality Foods',
    'Premium Spices',
    'Natural Oils',
    'Eco Packaging',
    'Trusted Suppliers',
    'Verified Vendors',
    'Quality Distributors',
    'Fresh Market',
    'Organic Palace',
    'Premium Farms',
    'Natural World'
  ],
  
  // Category-specific patterns
  vegetables: [
    /(?:fresh|organic)\s+([a-zA-Z\s]+)\s+(?:from|at|by)\s+([A-Z][a-zA-Z\s&]+)/gi,
    /([A-Z][a-zA-Z\s&]+)\s+(?:farms?|growers?)\s+(?:for|with)\s+([a-zA-Z\s]+)/gi
  ],
  
  spices: [
    /(?:spice|turmeric|pepper|cardamom)\s+(?:from|at|by)\s+([A-Z][a-zA-Z\s&]+)/gi,
    /([A-Z][a-zA-Z\s&]+)\s+(?:spice|seasoning)\s+(?:company|store)/gi
  ],
  
  oil: [
    /(?:oil|sunflower|mustard|olive)\s+(?:from|at|by)\s+([A-Z][a-zA-Z\s&]+)/gi,
    /([A-Z][a-zA-Z\s&]+)\s+(?:oil|refinery)\s+(?:company|distributors)/gi
  ],
  
  packaging: [
    /(?:bags?|packaging|wraps?)\s+(?:from|at|by)\s+([A-Z][a-zA-Z\s&]+)/gi,
    /([A-Z][a-zA-Z\s&]+)\s+(?:packaging|wrapping)\s+(?:company|solutions)/gi
  ],
  
  dairy: [
    /(?:milk|dairy|cheese|yogurt)\s+(?:from|at|by)\s+([A-Z][a-zA-Z\s&]+)/gi,
    /([A-Z][a-zA-Z\s&]+)\s+(?:dairy|milk)\s+(?:company|farm)/gi
  ]
};

// Confidence scoring weights
const CONFIDENCE_WEIGHTS = {
  direct_match: 0.9,
  brand_match: 0.8,
  pattern_match: 0.7,
  category_match: 0.6,
  partial_match: 0.4
};

export interface DetectedSupplier {
  name: string;
  confidence: number;
  category: string;
  source: string;
  location?: string;
}

/**
 * AI-powered supplier detection from post content
 */
export const detectSupplierFromPost = (post: Post): DetectedSupplier | null => {
  const content = post.content.toLowerCase();
  const category = post.category.toLowerCase();
  
  let bestMatch: DetectedSupplier | null = null;
  let highestConfidence = 0;

  // 1. Check for direct brand matches
  for (const brand of SUPPLIER_PATTERNS.brands) {
    const brandLower = brand.toLowerCase();
    if (content.includes(brandLower)) {
      const confidence = CONFIDENCE_WEIGHTS.brand_match;
      if (confidence > highestConfidence) {
        bestMatch = {
          name: brand,
          confidence,
          category: post.category,
          source: 'brand_match'
        };
        highestConfidence = confidence;
      }
    }
  }

  // 2. Check for direct pattern matches
  for (const pattern of SUPPLIER_PATTERNS.direct) {
    const matches = content.matchAll(pattern);
    for (const match of matches) {
      const supplierName = match[1]?.trim();
      if (supplierName && supplierName.length > 2) {
        const confidence = CONFIDENCE_WEIGHTS.direct_match;
        if (confidence > highestConfidence) {
          bestMatch = {
            name: supplierName,
            confidence,
            category: post.category,
            source: 'direct_pattern'
          };
          highestConfidence = confidence;
        }
      }
    }
  }

  // 3. Check category-specific patterns
  const categoryPatterns = SUPPLIER_PATTERNS[category as keyof typeof SUPPLIER_PATTERNS];
  if (categoryPatterns && Array.isArray(categoryPatterns)) {
    for (const pattern of categoryPatterns) {
      if (pattern instanceof RegExp) {
        const matches = content.matchAll(pattern);
        for (const match of matches) {
          const supplierName = match[1]?.trim() || match[2]?.trim();
          if (supplierName && supplierName.length > 2) {
            const confidence = CONFIDENCE_WEIGHTS.category_match;
            if (confidence > highestConfidence) {
              bestMatch = {
                name: supplierName,
                confidence,
                category: post.category,
                source: 'category_pattern'
              };
              highestConfidence = confidence;
            }
          }
        }
      }
    }
  }

  // 4. Extract location-based suppliers
  const locationMatch = content.match(/(?:in|at|near)\s+([A-Z][a-zA-Z\s]+)\s+(?:market|store|shop|farms?)/gi);
  if (locationMatch) {
    for (const match of locationMatch) {
      const location = match.replace(/(?:in|at|near)\s+/i, '').replace(/\s+(?:market|store|shop|farms?)/i, '').trim();
      if (location.length > 2) {
        const confidence = CONFIDENCE_WEIGHTS.partial_match;
        if (confidence > highestConfidence) {
          bestMatch = {
            name: `${location} Market`,
            confidence,
            category: post.category,
            source: 'location_based',
            location: location
          };
          highestConfidence = confidence;
        }
      }
    }
  }

  // Only return if confidence is above threshold
  return highestConfidence >= 0.4 ? bestMatch : null;
};

/**
 * Verify if a detected supplier should be added to the suppliers list
 */
export const shouldAddSupplier = (
  detectedSupplier: DetectedSupplier, 
  existingSuppliers: Supplier[], 
  posts: Post[]
): boolean => {
  // Check if supplier already exists
  const exists = existingSuppliers.some(s => 
    s.name.toLowerCase() === detectedSupplier.name.toLowerCase()
  );
  
  if (exists) return false;

  // Count posts mentioning this supplier
  const supplierPosts = posts.filter(post => {
    const detected = detectSupplierFromPost(post);
    return detected && detected.name.toLowerCase() === detectedSupplier.name.toLowerCase();
  });

  // Add supplier if mentioned in at least 2 posts with good confidence
  const highConfidencePosts = supplierPosts.filter(post => {
    const detected = detectSupplierFromPost(post);
    return detected && detected.confidence >= 0.6;
  });

  return highConfidencePosts.length >= 2;
};

/**
 * Generate supplier data from detected supplier
 */
export const generateSupplierData = (
  detectedSupplier: DetectedSupplier, 
  posts: Post[]
): Supplier => {
  // Calculate trust score based on posts
  const supplierPosts = posts.filter(post => {
    const detected = detectSupplierFromPost(post);
    return detected && detected.name.toLowerCase() === detectedSupplier.name.toLowerCase();
  });

  let totalLikes = 0;
  let totalDislikes = 0;
  const totalPosts = supplierPosts.length;

  supplierPosts.forEach(post => {
    totalLikes += post.likes;
    totalDislikes += post.dislikes;
  });

  const trustScore = totalPosts > 0 
    ? Math.round((totalLikes / (totalLikes + totalDislikes)) * 100)
    : 75; // Default score for new suppliers

  // Get category emoji
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
    id: Date.now().toString(),
    name: detectedSupplier.name,
    category: detectedSupplier.category,
    thumbsUp: totalLikes,
    thumbsDown: totalDislikes,
    isVerified: detectedSupplier.confidence >= 0.7,
    location: {
      latitude: 28.6129,
      longitude: 77.2295,
      address: detectedSupplier.location || 'Delhi',
      area: detectedSupplier.location || 'Delhi',
      city: 'Delhi'
    }
  };
};

/**
 * Analyze all posts and detect new suppliers
 */
export const analyzePostsForSuppliers = (
  posts: Post[], 
  existingSuppliers: Supplier[]
): Supplier[] => {
  const newSuppliers: Supplier[] = [];
  const detectedSuppliers = new Map<string, DetectedSupplier>();

  // Detect suppliers from all posts
  posts.forEach(post => {
    const detected = detectSupplierFromPost(post);
    if (detected) {
      const key = detected.name.toLowerCase();
      if (!detectedSuppliers.has(key)) {
        detectedSuppliers.set(key, detected);
      }
    }
  });

  // Check which detected suppliers should be added
  detectedSuppliers.forEach(detected => {
    if (shouldAddSupplier(detected, existingSuppliers, posts)) {
      const supplierData = generateSupplierData(detected, posts);
      newSuppliers.push(supplierData);
    }
  });

  return newSuppliers;
};

/**
 * Get supplier statistics
 */
export const getSupplierStats = (supplier: Supplier, posts: Post[]) => {
  const supplierPosts = posts.filter(post => {
    const detected = detectSupplierFromPost(post);
    return detected && detected.name.toLowerCase() === supplier.name.toLowerCase();
  });

  return {
    totalPosts: supplierPosts.length,
    totalLikes: supplierPosts.reduce((sum, post) => sum + post.likes, 0),
    totalDislikes: supplierPosts.reduce((sum, post) => sum + post.dislikes, 0),
    averageRating: supplierPosts.length > 0 
      ? (supplier.thumbsUp / (supplier.thumbsUp + supplier.thumbsDown) * 100).toFixed(1)
      : '0'
  };
}; 