// Named Entity Recognition for supplier names
export const extractSupplierName = (text: string): string => {
  const cleaned = text.toLowerCase().trim();
  
  // Common supplier patterns
  const patterns = [
    // "from [supplier]" patterns
    /(?:from|bought from|purchased from|supplier|vendor)\s+([a-zA-Z\s]+?)(?:\s|$|[.,!?])/i,
    // Company names with common suffixes
    /([a-zA-Z\s]+?)\s+(?:farms?|distributors?|traders?|suppliers?|enterprises?|company|co\.?|ltd\.?|pvt\.?)/i,
    // "[Name] delivered" patterns
    /^([a-zA-Z\s]+?)\s+(?:delivered|supplied|provided|gave)/i,
    // Market/shop names
    /(?:at|from)\s+([a-zA-Z\s]+?)\s+(?:market|shop|store|outlet)/i,
  ];

  for (const pattern of patterns) {
    const match = cleaned.match(pattern);
    if (match && match[1]) {
      const supplier = match[1].trim();
      // Filter out common words that aren't supplier names
      const excludeWords = ['the', 'good', 'bad', 'quality', 'fresh', 'old', 'new', 'local', 'nearby'];
      if (!excludeWords.includes(supplier.toLowerCase()) && supplier.length > 2) {
        return supplier
          .split(' ')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ');
      }
    }
  }

  return '';
};