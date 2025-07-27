import { BusinessModel } from '@/types';

export const TRUST_BASKET_BUSINESS_MODEL: BusinessModel = {
  trustedMembershipFee: {
    oneTime: 499,
    annual: 999,
    currency: 'INR'
  },
  documentVerificationFee: 99,
  features: {
    regular: [
      'Basic supplier search',
      'View supplier ratings',
      'Post basic inquiries',
      'Access to community discussions',
      'Basic location-based search'
    ],
    trusted: [
      'All Regular features',
      'Priority listing in search results',
      'Trusted badge on profile',
      'Advanced analytics dashboard',
      'Customer support priority',
      'Bulk inquiry options',
      'Custom business profile',
      'Lead generation tools',
      'Verified business credentials'
    ],
    verified: [
      'All Trusted features',
      'Government verified badge',
      'Enhanced credibility score',
      'Premium placement in search',
      'Direct customer contact options',
      'Advanced dispute resolution',
      'Business insurance eligibility',
      'Bank loan assistance',
      'Export/Import facilitation'
    ]
  },
  benefits: {
    trusted: [
      '🏆 Trusted Member Badge',
      '📈 2x More Visibility',
      '💼 Professional Profile',
      '📞 Priority Support',
      '📊 Business Analytics',
      '🎯 Lead Generation',
      '💳 Payment Gateway Integration',
      '📱 Mobile App Priority Features'
    ],
    verified: [
      '✅ Government Verified Badge',
      '⭐ Premium Search Ranking',
      '🛡️ Enhanced Security Features',
      '🏦 Banking Partner Benefits',
      '📄 Legal Document Assistance',
      '🌍 Export/Import Support',
      '🤝 B2B Partnership Opportunities',
      '📞 Dedicated Account Manager'
    ]
  }
};

export const MEMBERSHIP_TIERS = [
  {
    id: 'regular',
    name: 'Regular Member',
    price: 0,
    currency: 'INR',
    period: 'Free',
    description: 'Basic access to TRUST_BASKET features',
    features: TRUST_BASKET_BUSINESS_MODEL.features.regular,
    popular: false,
    color: 'gray'
  },
  {
    id: 'trusted',
    name: 'Trusted Member',
    price: TRUST_BASKET_BUSINESS_MODEL.trustedMembershipFee.annual,
    currency: 'INR',
    period: 'per year',
    description: 'Enhanced features for serious businesses',
    features: TRUST_BASKET_BUSINESS_MODEL.features.trusted,
    popular: true,
    color: 'blue'
  },
  {
    id: 'verified',
    name: 'Verified Member',
    price: TRUST_BASKET_BUSINESS_MODEL.trustedMembershipFee.annual + TRUST_BASKET_BUSINESS_MODEL.documentVerificationFee,
    currency: 'INR',
    period: 'per year',
    description: 'Government verified business credentials',
    features: TRUST_BASKET_BUSINESS_MODEL.features.verified,
    popular: false,
    color: 'green'
  }
];

export const REVENUE_STREAMS = {
  membershipFees: {
    trustedAnnual: TRUST_BASKET_BUSINESS_MODEL.trustedMembershipFee.annual,
    trustedOneTime: TRUST_BASKET_BUSINESS_MODEL.trustedMembershipFee.oneTime,
    documentVerification: TRUST_BASKET_BUSINESS_MODEL.documentVerificationFee
  },
  additionalServices: {
    premiumSupport: 199,
    businessConsultation: 999,
    customIntegration: 4999,
    bulkDataExport: 299,
    dedicatedAccountManager: 2999
  },
  transactionFees: {
    paymentGateway: 2.5, // percentage
    leadGeneration: 99, // per qualified lead
    businessListingPromotion: 199 // per month
  },
  partnerships: {
    bankingPartnerCommission: 1.0, // percentage of loan amount
    insurancePartnerCommission: 15.0, // percentage of premium
    logisticsPartnerCommission: 5.0 // percentage of shipment value
  }
};

export const COST_STRUCTURE = {
  technology: {
    serverAndHosting: 15000, // monthly
    smsServiceCosts: 0.08, // per SMS
    storageAndCDN: 5000, // monthly
    thirdPartyAPIs: 8000, // monthly
    securityAndCompliance: 12000 // monthly
  },
  operations: {
    customerSupport: 25000, // monthly
    documentVerificationTeam: 35000, // monthly
    salesAndMarketing: 40000, // monthly
    legalAndCompliance: 15000 // monthly
  },
  fixed: {
    officeRent: 20000, // monthly
    utilities: 3000, // monthly
    insurance: 5000, // monthly
    licenses: 2000 // monthly
  }
};

export const PROJECTED_METRICS = {
  userGrowth: {
    month1: 500,
    month6: 5000,
    month12: 15000,
    month24: 50000
  },
  conversionRates: {
    regularToTrusted: 15, // percentage
    trustedToVerified: 25, // percentage
    freeTrialToTrusted: 8 // percentage
  },
  revenueProjection: {
    month12: 1250000, // INR
    month24: 4500000, // INR
    month36: 8500000 // INR
  }
};

export const VALUE_PROPOSITION = {
  forSuppliers: [
    'Increased visibility and credibility',
    'Direct connection with verified buyers',
    'Reduced customer acquisition costs',
    'Government verification for trust building',
    'Analytics and business insights',
    'Payment and logistics support'
  ],
  forBuyers: [
    'Access to verified and trusted suppliers',
    'Reduced risk in business transactions',
    'Quality assurance through ratings',
    'Efficient supplier discovery',
    'Dispute resolution support',
    'Competitive pricing transparency'
  ],
  forPlatform: [
    'Scalable SaaS business model',
    'Multiple revenue streams',
    'Network effects and data advantages',
    'Government partnership opportunities',
    'Export/import facilitation potential',
    'Financial services integration'
  ]
};

export const calculateMembershipPrice = (
  tier: 'trusted' | 'verified',
  duration: 'monthly' | 'annual' = 'annual'
): number => {
  const basePrice = TRUST_BASKET_BUSINESS_MODEL.trustedMembershipFee.annual;
  const verificationFee = tier === 'verified' ? TRUST_BASKET_BUSINESS_MODEL.documentVerificationFee : 0;
  
  if (duration === 'monthly') {
    return Math.round((basePrice / 12) + (verificationFee / 12));
  }
  
  return basePrice + verificationFee;
};

export const getFeatureComparison = () => {
  const allFeatures = [
    ...new Set([
      ...TRUST_BASKET_BUSINESS_MODEL.features.regular,
      ...TRUST_BASKET_BUSINESS_MODEL.features.trusted,
      ...TRUST_BASKET_BUSINESS_MODEL.features.verified
    ])
  ];

  return allFeatures.map(feature => ({
    feature,
    regular: TRUST_BASKET_BUSINESS_MODEL.features.regular.includes(feature),
    trusted: TRUST_BASKET_BUSINESS_MODEL.features.trusted.includes(feature),
    verified: TRUST_BASKET_BUSINESS_MODEL.features.verified.includes(feature)
  }));
};