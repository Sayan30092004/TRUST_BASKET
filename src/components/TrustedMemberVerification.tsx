import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { 
  Upload, 
  FileText, 
  CheckCircle, 
  AlertCircle, 
  Clock, 
  Shield, 
  Star, 
  Crown,
  X,
  Eye
} from "lucide-react";
import { useDropzone } from 'react-dropzone';
import { BusinessDocument, UserPreferences } from "@/types";
import { 
  DOCUMENT_TYPES, 
  uploadDocument, 
  validateFile, 
  formatFileSize,
  getDocumentStatusColor,
  getDocumentStatusIcon
} from "@/utils/documentService";
import { MEMBERSHIP_TIERS, calculateMembershipPrice } from "@/utils/businessModel";
import { useToast } from "@/hooks/use-toast";

interface TrustedMemberVerificationProps {
  user: UserPreferences;
  onUpdateUser: (updatedUser: UserPreferences) => void;
  onClose: () => void;
}

export const TrustedMemberVerification = ({ 
  user, 
  onUpdateUser, 
  onClose 
}: TrustedMemberVerificationProps) => {
  const [selectedDocumentType, setSelectedDocumentType] = useState<keyof typeof DOCUMENT_TYPES>('business_license');
  const [uploadingFiles, setUploadingFiles] = useState<string[]>([]);
  const [selectedTier, setSelectedTier] = useState<'trusted' | 'verified'>('trusted');
  const [step, setStep] = useState<'choose' | 'upload' | 'payment' | 'pending'>('choose');
  const { toast } = useToast();

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    for (const file of acceptedFiles) {
      const validation = validateFile(file);
      if (!validation.isValid) {
        toast({
          title: "Invalid File",
          description: validation.error,
          variant: "destructive"
        });
        continue;
      }

      setUploadingFiles(prev => [...prev, file.name]);

      try {
        const result = await uploadDocument(file, selectedDocumentType, user.phone);
        if (result.success && result.document) {
          const updatedUser = {
            ...user,
            businessDocuments: [...(user.businessDocuments || []), result.document]
          };
          onUpdateUser(updatedUser);
          
          toast({
            title: "Document Uploaded",
            description: "Your document has been uploaded successfully and is pending verification.",
          });
        } else {
          toast({
            title: "Upload Failed",
            description: result.error || "Failed to upload document",
            variant: "destructive"
          });
        }
      } catch (error) {
        toast({
          title: "Upload Error",
          description: "An error occurred while uploading the document",
          variant: "destructive"
        });
      } finally {
        setUploadingFiles(prev => prev.filter(name => name !== file.name));
      }
    }
  }, [selectedDocumentType, user, onUpdateUser, toast]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png'],
      'image/webp': ['.webp']
    },
    maxSize: 5 * 1024 * 1024, // 5MB
    multiple: true
  });

  const handleTierUpgrade = () => {
    if (selectedTier === 'verified' && (!user.businessDocuments || user.businessDocuments.length === 0)) {
      toast({
        title: "Documents Required",
        description: "Please upload at least one business document for verified membership.",
        variant: "destructive"
      });
      return;
    }
    setStep('payment');
  };

  const handlePayment = () => {
    // In a real application, this would integrate with payment gateway
    const updatedUser = {
      ...user,
      userType: selectedTier,
      verificationRequestedAt: new Date()
    };
    onUpdateUser(updatedUser);
    setStep('pending');
    
    toast({
      title: "Payment Successful",
      description: `Your ${selectedTier} membership upgrade is being processed.`,
    });
  };

  const getVerificationProgress = (): number => {
    if (!user.businessDocuments || user.businessDocuments.length === 0) return 0;
    
    const approved = user.businessDocuments.filter(doc => doc.status === 'approved').length;
    return (approved / user.businessDocuments.length) * 100;
  };

  const getTierIcon = (tier: string) => {
    switch (tier) {
      case 'trusted': return <Shield className="h-5 w-5" />;
      case 'verified': return <Crown className="h-5 w-5" />;
      default: return <Star className="h-5 w-5" />;
    }
  };

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'trusted': return 'text-blue-600';
      case 'verified': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  if (step === 'pending') {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center space-x-2">
                <Clock className="h-5 w-5 text-blue-600" />
                <span>Verification Pending</span>
              </CardTitle>
              <Button variant="ghost" size="sm" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center space-y-2">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                {getTierIcon(selectedTier)}
              </div>
              <h3 className="font-semibold">Upgrade Request Submitted</h3>
              <p className="text-sm text-muted-foreground">
                Your {selectedTier} membership upgrade is being processed. You'll be notified once the verification is complete.
              </p>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Verification Progress</span>
                <span>{Math.round(getVerificationProgress())}%</span>
              </div>
              <Progress value={getVerificationProgress()} className="w-full" />
            </div>

            {user.businessDocuments && user.businessDocuments.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-medium text-sm">Uploaded Documents</h4>
                {user.businessDocuments.map((doc) => (
                  <div key={doc.id} className="flex items-center justify-between p-2 bg-muted rounded">
                    <div className="flex items-center space-x-2">
                      <FileText className="h-4 w-4" />
                      <span className="text-sm truncate">{doc.fileName}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <span className="text-xs">{getDocumentStatusIcon(doc.status)}</span>
                      <span className={`text-xs ${getDocumentStatusColor(doc.status)}`}>
                        {doc.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <Button onClick={onClose} className="w-full">
              Continue to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <Shield className="h-5 w-5 text-blue-600" />
              <span>Become a Trusted Member</span>
            </CardTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {step === 'choose' && (
            <>
              <div className="text-center space-y-2">
                <h3 className="text-lg font-semibold">Choose Your Membership Tier</h3>
                <p className="text-sm text-muted-foreground">
                  Upgrade your account to access premium features and build trust with your customers.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {MEMBERSHIP_TIERS.filter(tier => tier.id !== 'regular').map((tier) => (
                  <Card 
                    key={tier.id}
                    className={`cursor-pointer transition-all ${
                      selectedTier === tier.id 
                        ? 'ring-2 ring-primary border-primary' 
                        : 'hover:border-primary/50'
                    } ${tier.popular ? 'border-blue-500' : ''}`}
                    onClick={() => setSelectedTier(tier.id as 'trusted' | 'verified')}
                  >
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <div className={getTierColor(tier.id)}>
                            {getTierIcon(tier.id)}
                          </div>
                          <h4 className="font-semibold">{tier.name}</h4>
                        </div>
                        {tier.popular && (
                          <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                            Popular
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">{tier.description}</p>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="text-center">
                        <span className="text-2xl font-bold">₹{tier.price}</span>
                        <span className="text-sm text-muted-foreground ml-1">{tier.period}</span>
                      </div>
                      
                      <ul className="space-y-1 text-sm">
                        {tier.features.slice(0, 4).map((feature, index) => (
                          <li key={index} className="flex items-center space-x-2">
                            <CheckCircle className="h-3 w-3 text-green-600 flex-shrink-0" />
                            <span className="text-xs">{feature}</span>
                          </li>
                        ))}
                        {tier.features.length > 4 && (
                          <li className="text-xs text-muted-foreground">
                            +{tier.features.length - 4} more features
                          </li>
                        )}
                      </ul>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="flex space-x-3">
                <Button 
                  onClick={() => setStep('upload')} 
                  className="flex-1"
                  disabled={selectedTier === 'verified'}
                >
                  {selectedTier === 'verified' ? 'Upload Documents First' : 'Continue'}
                </Button>
                {selectedTier === 'verified' && (
                  <Button onClick={() => setStep('upload')} variant="outline">
                    Upload Documents
                  </Button>
                )}
              </div>
            </>
          )}

          {step === 'upload' && (
            <>
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Upload Business Documents</h3>
                <p className="text-sm text-muted-foreground">
                  Upload authentic government-issued business documents to verify your business credentials.
                </p>

                <div className="space-y-3">
                  <label className="text-sm font-medium">Document Type</label>
                  <Select value={selectedDocumentType} onValueChange={(value: keyof typeof DOCUMENT_TYPES) => setSelectedDocumentType(value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select document type" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(DOCUMENT_TYPES).map(([key, label]) => (
                        <SelectItem key={key} value={key}>
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div
                  {...getRootProps()}
                  className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
                    isDragActive 
                      ? 'border-primary bg-primary/5' 
                      : 'border-muted-foreground/25 hover:border-primary/50'
                  }`}
                >
                  <input {...getInputProps()} />
                  <Upload className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                  {isDragActive ? (
                    <p className="text-sm">Drop files here...</p>
                  ) : (
                    <div className="space-y-1">
                      <p className="text-sm font-medium">
                        Drag & drop files here, or click to select
                      </p>
                      <p className="text-xs text-muted-foreground">
                        PDF, JPG, PNG, WebP up to 5MB each
                      </p>
                    </div>
                  )}
                </div>

                {uploadingFiles.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm">Uploading...</h4>
                    {uploadingFiles.map((fileName) => (
                      <div key={fileName} className="flex items-center space-x-2 p-2 bg-muted rounded">
                        <div className="animate-spin h-4 w-4 border-2 border-primary border-t-transparent rounded-full" />
                        <span className="text-sm">{fileName}</span>
                      </div>
                    ))}
                  </div>
                )}

                {user.businessDocuments && user.businessDocuments.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm">Uploaded Documents</h4>
                    <div className="space-y-2">
                      {user.businessDocuments.map((doc) => (
                        <div key={doc.id} className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center space-x-3">
                            <FileText className="h-5 w-5 text-muted-foreground" />
                            <div>
                              <p className="text-sm font-medium">{doc.fileName}</p>
                              <p className="text-xs text-muted-foreground">
                                {DOCUMENT_TYPES[doc.documentType]} • {formatFileSize(doc.fileSize)}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge 
                              variant={doc.status === 'approved' ? 'default' : doc.status === 'rejected' ? 'destructive' : 'secondary'}
                              className="text-xs"
                            >
                              {getDocumentStatusIcon(doc.status)} {doc.status}
                            </Badge>
                            <Button size="sm" variant="ghost">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <Separator />

              <div className="flex space-x-3">
                <Button variant="outline" onClick={() => setStep('choose')}>
                  Back
                </Button>
                <Button 
                  onClick={handleTierUpgrade} 
                  className="flex-1"
                  disabled={selectedTier === 'verified' && (!user.businessDocuments || user.businessDocuments.length === 0)}
                >
                  Continue to Payment
                </Button>
              </div>
            </>
          )}

          {step === 'payment' && (
            <>
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Complete Your Upgrade</h3>
                
                <Card className="p-4 bg-muted/50">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Membership Tier</span>
                      <div className="flex items-center space-x-2">
                        <div className={getTierColor(selectedTier)}>
                          {getTierIcon(selectedTier)}
                        </div>
                        <span className="font-medium capitalize">{selectedTier} Member</span>
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Annual Membership</span>
                        <span>₹999</span>
                      </div>
                      {selectedTier === 'verified' && (
                        <div className="flex justify-between">
                          <span>Document Verification</span>
                          <span>₹99</span>
                        </div>
                      )}
                      <Separator />
                      <div className="flex justify-between font-medium">
                        <span>Total Amount</span>
                        <span>₹{calculateMembershipPrice(selectedTier)}</span>
                      </div>
                    </div>
                  </div>
                </Card>

                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-medium text-sm text-blue-900 mb-2">What you'll get:</h4>
                  <ul className="text-sm text-blue-800 space-y-1">
                    {MEMBERSHIP_TIERS.find(tier => tier.id === selectedTier)?.features.slice(0, 3).map((feature, index) => (
                      <li key={index} className="flex items-center space-x-2">
                        <CheckCircle className="h-3 w-3 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="flex space-x-3">
                <Button variant="outline" onClick={() => setStep('upload')}>
                  Back
                </Button>
                <Button onClick={handlePayment} className="flex-1">
                  Pay ₹{calculateMembershipPrice(selectedTier)} & Upgrade
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};