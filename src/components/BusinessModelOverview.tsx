import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { 
  DollarSign, 
  Users, 
  TrendingUp, 
  Shield, 
  Crown, 
  Star,
  Building2,
  Handshake,
  ChartBar,
  Target,
  Banknote,
  FileText
} from "lucide-react";
import { 
  TRUST_BASKET_BUSINESS_MODEL, 
  REVENUE_STREAMS, 
  COST_STRUCTURE, 
  PROJECTED_METRICS,
  VALUE_PROPOSITION,
  MEMBERSHIP_TIERS
} from "@/utils/businessModel";

export const BusinessModelOverview = () => {
  const formatCurrency = (amount: number) => `₹${amount.toLocaleString()}`;
  
  const currentMonth = 12; // Assume we're at month 12 for projections

  return (
    <div className="space-y-6 p-6 max-w-7xl mx-auto">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-foreground">TRUST_BASKET Business Model</h1>
        <p className="text-lg text-muted-foreground">
          Building India's Most Trusted B2B Marketplace
        </p>
      </div>

      {/* Revenue Streams */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <DollarSign className="h-5 w-5 text-green-600" />
            <span>Revenue Streams</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-green-50 p-4 rounded-lg">
              <h4 className="font-semibold text-green-900">Membership Fees</h4>
              <p className="text-2xl font-bold text-green-700">
                {formatCurrency(REVENUE_STREAMS.membershipFees.trustedAnnual)}
              </p>
              <p className="text-sm text-green-600">Annual Trusted Membership</p>
            </div>
            
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-semibold text-blue-900">Document Verification</h4>
              <p className="text-2xl font-bold text-blue-700">
                {formatCurrency(REVENUE_STREAMS.membershipFees.documentVerification)}
              </p>
              <p className="text-sm text-blue-600">Per verification</p>
            </div>
            
            <div className="bg-purple-50 p-4 rounded-lg">
              <h4 className="font-semibold text-purple-900">Premium Support</h4>
              <p className="text-2xl font-bold text-purple-700">
                {formatCurrency(REVENUE_STREAMS.additionalServices.premiumSupport)}
              </p>
              <p className="text-sm text-purple-600">Monthly service</p>
            </div>
            
            <div className="bg-orange-50 p-4 rounded-lg">
              <h4 className="font-semibold text-orange-900">Transaction Fees</h4>
              <p className="text-2xl font-bold text-orange-700">
                {REVENUE_STREAMS.transactionFees.paymentGateway}%
              </p>
              <p className="text-sm text-orange-600">Of transaction value</p>
            </div>
          </div>

          <Separator />

          <div className="space-y-3">
            <h4 className="font-semibold">Additional Revenue Sources</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Business Consultation</span>
                  <span className="font-medium">{formatCurrency(REVENUE_STREAMS.additionalServices.businessConsultation)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Custom Integration</span>
                  <span className="font-medium">{formatCurrency(REVENUE_STREAMS.additionalServices.customIntegration)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Bulk Data Export</span>
                  <span className="font-medium">{formatCurrency(REVENUE_STREAMS.additionalServices.bulkDataExport)}</span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Banking Partner Commission</span>
                  <span className="font-medium">{REVENUE_STREAMS.partnerships.bankingPartnerCommission}%</span>
                </div>
                <div className="flex justify-between">
                  <span>Insurance Commission</span>
                  <span className="font-medium">{REVENUE_STREAMS.partnerships.insurancePartnerCommission}%</span>
                </div>
                <div className="flex justify-between">
                  <span>Logistics Commission</span>
                  <span className="font-medium">{REVENUE_STREAMS.partnerships.logisticsPartnerCommission}%</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Membership Tiers */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Crown className="h-5 w-5 text-yellow-600" />
            <span>Membership Tiers & Pricing</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {MEMBERSHIP_TIERS.map((tier) => (
              <Card key={tier.id} className={`relative ${tier.popular ? 'border-blue-500 shadow-lg' : ''}`}>
                {tier.popular && (
                  <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-blue-500">
                    Most Popular
                  </Badge>
                )}
                <CardHeader className="text-center">
                  <div className={`mx-auto w-12 h-12 rounded-full flex items-center justify-center ${
                    tier.color === 'gray' ? 'bg-gray-100' :
                    tier.color === 'blue' ? 'bg-blue-100' : 'bg-green-100'
                  }`}>
                    {tier.id === 'regular' ? <Star className="h-6 w-6 text-gray-600" /> :
                     tier.id === 'trusted' ? <Shield className="h-6 w-6 text-blue-600" /> :
                     <Crown className="h-6 w-6 text-green-600" />}
                  </div>
                  <h3 className="font-bold">{tier.name}</h3>
                  <div className="text-3xl font-bold">
                    {tier.price === 0 ? 'Free' : `₹${tier.price}`}
                  </div>
                  {tier.price > 0 && <p className="text-sm text-muted-foreground">{tier.period}</p>}
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-muted-foreground text-center">{tier.description}</p>
                  <ul className="space-y-2 text-sm">
                    {tier.features.slice(0, 5).map((feature, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <div className="w-1 h-1 bg-primary rounded-full mt-2 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                    {tier.features.length > 5 && (
                      <li className="text-xs text-muted-foreground text-center">
                        +{tier.features.length - 5} more features
                      </li>
                    )}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Growth Projections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-blue-600" />
              <span>User Growth Projections</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm">Month 1</span>
                <span className="font-semibold">{PROJECTED_METRICS.userGrowth.month1.toLocaleString()} users</span>
              </div>
              <Progress value={10} className="h-2" />
              
              <div className="flex justify-between items-center">
                <span className="text-sm">Month 6</span>
                <span className="font-semibold">{PROJECTED_METRICS.userGrowth.month6.toLocaleString()} users</span>
              </div>
              <Progress value={40} className="h-2" />
              
              <div className="flex justify-between items-center">
                <span className="text-sm">Month 12</span>
                <span className="font-semibold">{PROJECTED_METRICS.userGrowth.month12.toLocaleString()} users</span>
              </div>
              <Progress value={70} className="h-2" />
              
              <div className="flex justify-between items-center">
                <span className="text-sm">Month 24</span>
                <span className="font-semibold">{PROJECTED_METRICS.userGrowth.month24.toLocaleString()} users</span>
              </div>
              <Progress value={100} className="h-2" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <ChartBar className="h-5 w-5 text-green-600" />
              <span>Revenue Projections</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              <div className="bg-green-50 p-4 rounded-lg">
                <p className="text-sm text-green-600">Year 1 Revenue</p>
                <p className="text-2xl font-bold text-green-700">
                  {formatCurrency(PROJECTED_METRICS.revenueProjection.month12)}
                </p>
              </div>
              
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm text-blue-600">Year 2 Revenue</p>
                <p className="text-2xl font-bold text-blue-700">
                  {formatCurrency(PROJECTED_METRICS.revenueProjection.month24)}
                </p>
              </div>
              
              <div className="bg-purple-50 p-4 rounded-lg">
                <p className="text-sm text-purple-600">Year 3 Revenue</p>
                <p className="text-2xl font-bold text-purple-700">
                  {formatCurrency(PROJECTED_METRICS.revenueProjection.month36)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Cost Structure */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Banknote className="h-5 w-5 text-red-600" />
            <span>Monthly Cost Structure</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-3">
              <h4 className="font-semibold text-red-900">Technology Costs</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Server & Hosting</span>
                  <span>{formatCurrency(COST_STRUCTURE.technology.serverAndHosting)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Storage & CDN</span>
                  <span>{formatCurrency(COST_STRUCTURE.technology.storageAndCDN)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Third-party APIs</span>
                  <span>{formatCurrency(COST_STRUCTURE.technology.thirdPartyAPIs)}</span>
                </div>
              </div>
            </div>
            
            <div className="space-y-3">
              <h4 className="font-semibold text-orange-900">Operations</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Customer Support</span>
                  <span>{formatCurrency(COST_STRUCTURE.operations.customerSupport)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Document Verification</span>
                  <span>{formatCurrency(COST_STRUCTURE.operations.documentVerificationTeam)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Sales & Marketing</span>
                  <span>{formatCurrency(COST_STRUCTURE.operations.salesAndMarketing)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Legal & Compliance</span>
                  <span>{formatCurrency(COST_STRUCTURE.operations.legalAndCompliance)}</span>
                </div>
              </div>
            </div>
            
            <div className="space-y-3">
              <h4 className="font-semibold text-blue-900">Fixed Costs</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Office Rent</span>
                  <span>{formatCurrency(COST_STRUCTURE.fixed.officeRent)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Utilities</span>
                  <span>{formatCurrency(COST_STRUCTURE.fixed.utilities)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Insurance</span>
                  <span>{formatCurrency(COST_STRUCTURE.fixed.insurance)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Licenses</span>
                  <span>{formatCurrency(COST_STRUCTURE.fixed.licenses)}</span>
                </div>
              </div>
            </div>
          </div>
          
          <Separator className="my-4" />
          
          <div className="bg-red-50 p-4 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="font-semibold text-red-900">Total Monthly Operating Cost</span>
              <span className="text-xl font-bold text-red-700">
                {formatCurrency(
                  Object.values(COST_STRUCTURE.technology).reduce((a, b) => typeof b === 'number' ? a + b : a, 0) +
                  Object.values(COST_STRUCTURE.operations).reduce((a, b) => a + b, 0) +
                  Object.values(COST_STRUCTURE.fixed).reduce((a, b) => a + b, 0)
                )}
              </span>
            </div>
            <p className="text-sm text-red-600 mt-1">
              Excluding variable costs like SMS per message
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Value Proposition */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Target className="h-5 w-5 text-purple-600" />
            <span>Value Proposition</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Building2 className="h-5 w-5 text-blue-600" />
                <h4 className="font-semibold">For Suppliers</h4>
              </div>
              <ul className="space-y-2 text-sm">
                {VALUE_PROPOSITION.forSuppliers.map((item, index) => (
                  <li key={index} className="flex items-start space-x-2">
                    <div className="w-1 h-1 bg-blue-600 rounded-full mt-2 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Users className="h-5 w-5 text-green-600" />
                <h4 className="font-semibold">For Buyers</h4>
              </div>
              <ul className="space-y-2 text-sm">
                {VALUE_PROPOSITION.forBuyers.map((item, index) => (
                  <li key={index} className="flex items-start space-x-2">
                    <div className="w-1 h-1 bg-green-600 rounded-full mt-2 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Handshake className="h-5 w-5 text-purple-600" />
                <h4 className="font-semibold">Platform Benefits</h4>
              </div>
              <ul className="space-y-2 text-sm">
                {VALUE_PROPOSITION.forPlatform.map((item, index) => (
                  <li key={index} className="flex items-start space-x-2">
                    <div className="w-1 h-1 bg-purple-600 rounded-full mt-2 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Conversion Rates */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <FileText className="h-5 w-5 text-indigo-600" />
            <span>Key Metrics & Conversion Rates</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-indigo-50 p-4 rounded-lg text-center">
              <p className="text-sm text-indigo-600">Regular → Trusted</p>
              <p className="text-3xl font-bold text-indigo-700">
                {PROJECTED_METRICS.conversionRates.regularToTrusted}%
              </p>
              <p className="text-xs text-indigo-600">Conversion Rate</p>
            </div>
            
            <div className="bg-green-50 p-4 rounded-lg text-center">
              <p className="text-sm text-green-600">Trusted → Verified</p>
              <p className="text-3xl font-bold text-green-700">
                {PROJECTED_METRICS.conversionRates.trustedToVerified}%
              </p>
              <p className="text-xs text-green-600">Upgrade Rate</p>
            </div>
            
            <div className="bg-orange-50 p-4 rounded-lg text-center">
              <p className="text-sm text-orange-600">Free Trial → Trusted</p>
              <p className="text-3xl font-bold text-orange-700">
                {PROJECTED_METRICS.conversionRates.freeTrialToTrusted}%
              </p>
              <p className="text-xs text-orange-600">Trial Conversion</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="text-center text-sm text-muted-foreground border-t pt-4">
        <p>TRUST_BASKET Business Model Overview • Building Trust in B2B Commerce</p>
      </div>
    </div>
  );
};