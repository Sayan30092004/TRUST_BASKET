import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Smartphone, CheckCircle, MapPin, Globe, User, RefreshCw } from "lucide-react";
import { UserPreferences, Location } from "@/types";
import { translations, Language, t } from "@/utils/translations";
import { getCurrentLocation } from "@/utils/location";
import { sendOTP, verifyOTP, resendOTP } from "@/utils/smsService";
import { useToast } from "@/hooks/use-toast";

interface AuthLoginProps {
  onLogin: (preferences: UserPreferences) => void;
}

export const AuthLogin = ({ onLogin }: AuthLoginProps) => {
  const [step, setStep] = useState<'language' | 'location' | 'name' | 'phone' | 'otp'>('language');
  const [language, setLanguage] = useState<Language>('en');
  const [location, setLocation] = useState<Location | null>(null);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [isSendingOTP, setIsSendingOTP] = useState(false);
  const [isVerifyingOTP, setIsVerifyingOTP] = useState(false);
  const [isResendingOTP, setIsResendingOTP] = useState(false);
  const [resendCount, setResendCount] = useState(0);
  const [resendTimer, setResendTimer] = useState(0);
  const { toast } = useToast();

  const handleLanguageSelect = (selectedLanguage: Language) => {
    setLanguage(selectedLanguage);
    setStep('location');
  };

  const handleLocationPermission = async () => {
    setIsLoadingLocation(true);
    try {
      const userLocation = await getCurrentLocation();
      setLocation(userLocation);
      setStep('name');
    } catch (error) {
      // If location fails, use a default location
      setLocation({
        latitude: 28.6139,
        longitude: 77.2090,
        address: 'New Delhi',
        area: 'Central Delhi',
        city: 'Delhi'
      });
      setStep('name');
    } finally {
      setIsLoadingLocation(false);
    }
  };

  const handleNameSubmit = () => {
    if (name.trim()) {
      setStep('phone');
    }
  };

  const startResendTimer = () => {
    setResendTimer(30);
    const interval = setInterval(() => {
      setResendTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleSendOTP = async () => {
    if (phone.length < 10) {
      toast({
        title: "Invalid Phone Number",
        description: "Please enter a valid 10-digit phone number.",
        variant: "destructive"
      });
      return;
    }

    setIsSendingOTP(true);
    try {
      const result = await sendOTP(phone);
      if (result.success) {
        toast({
          title: "OTP Sent Successfully",
          description: `A verification code has been sent to +91 ${phone}
          Development OTP for ${phone}: ${result.otp}`,
        });
        setStep('otp');
        startResendTimer();
        // In development, show the OTP in console
        if (result.otp) {
          console.log(`Development OTP for ${phone}: ${result.otp}`);
        }
      } else {
        toast({
          title: "Failed to Send OTP",
          description: result.error || "Please try again.",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send OTP. Please check your connection and try again.",
        variant: "destructive"
      });
    } finally {
      setIsSendingOTP(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (otp.length < 4) {
      toast({
        title: "Invalid OTP",
        description: "Please enter the complete 4-digit verification code.",
        variant: "destructive"
      });
      return;
    }

    setIsVerifyingOTP(true);
    try {
      const result = verifyOTP(phone, otp);
      if (result.success && location && name.trim()) {
        toast({
          title: "Phone Verified Successfully",
          description: "Welcome to TRUST_BASKET!",
        });
        
        const preferences: UserPreferences = {
          language,
          location,
          phone,
          name: name.trim(),
          userType: 'regular',
          isPhoneVerified: true,
          businessDocuments: []
        };
        onLogin(preferences);
      } else {
        toast({
          title: "Verification Failed",
          description: result.error || "Invalid OTP. Please try again.",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to verify OTP. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsVerifyingOTP(false);
    }
  };

  const handleResendOTP = async () => {
    if (resendTimer > 0) {
      toast({
        title: "Please Wait",
        description: `You can resend OTP in ${resendTimer} seconds.`,
        variant: "destructive"
      });
      return;
    }

    if (resendCount >= 3) {
      toast({
        title: "Too Many Attempts",
        description: "Maximum resend attempts reached. Please try again later.",
        variant: "destructive"
      });
      return;
    }

    setIsResendingOTP(true);
    try {
      const result = await resendOTP(phone);
      if (result.success) {
        setResendCount(prev => prev + 1);
        setOtp(''); // Clear current OTP
        startResendTimer();
        toast({
          title: "OTP Resent",
          description: "A new verification code has been sent to your phone.",
        });
      } else {
        toast({
          title: "Failed to Resend OTP",
          description: result.error || "Please try again.",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to resend OTP. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsResendingOTP(false);
    }
  };

  const getStepTitle = () => {
    switch (step) {
      case 'language': return t('selectLanguage', language);
      case 'location': return t('selectLocation', language);
      case 'name': return 'Enter your name';
      case 'phone': return t('enterMobile', language);
      case 'otp': return t('verifyCode', language);
      default: return t('selectLanguage', language);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center pb-8">
          <div className="mx-auto w-20 h-20 bg-primary rounded-full flex items-center justify-center mb-4">
            <span className="text-2xl">🛒</span>
          </div>
          <h1 className="text-2xl font-bold text-foreground">{t('appName', language)}</h1>
          <p className="text-muted-foreground text-sm">
            {getStepTitle()}
          </p>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {step === 'language' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-3">
                {Object.entries(translations).map(([lang, trans]) => (
                  <Button
                    key={lang}
                    variant="outline"
                    onClick={() => handleLanguageSelect(lang as Language)}
                    className="h-14 text-lg flex items-center justify-between"
                  >
                    <div className="flex items-center space-x-3">
                      <Globe className="h-5 w-5" />
                      <span>{trans.appName}</span>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {lang === 'en' ? 'English' : 
                       lang === 'hi' ? 'हिंदी' :
                       lang === 'bn' ? 'বাংলা' : 'தமிழ்'}
                    </span>
                  </Button>
                ))}
              </div>
            </div>
          )}

          {step === 'location' && (
            <div className="space-y-4">
              <div className="text-center space-y-2">
                <MapPin className="mx-auto h-12 w-12 text-primary" />
                <p className="text-sm text-muted-foreground">
                  {t('allowLocation', language)}
                </p>
              </div>
              
              <Button 
                onClick={handleLocationPermission}
                className="w-full h-12 text-lg"
                disabled={isLoadingLocation}
              >
                <MapPin className="mr-2 h-5 w-5" />
                {isLoadingLocation ? 'Getting Location...' : t('allowLocation', language)}
              </Button>
            </div>
          )}

          {step === 'name' && (
            <>
              <div className="space-y-4">
                {location && (
                  <div className="bg-muted p-3 rounded-lg">
                    <div className="flex items-center space-x-2 text-sm">
                      <MapPin className="h-4 w-4 text-primary" />
                      <span>{location.area}, {location.city}</span>
                    </div>
                  </div>
                )}
                
                <div className="relative">
                  <User className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Enter your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="pl-10 h-12 text-lg"
                  />
                </div>
              </div>
              
              <Button 
                onClick={handleNameSubmit}
                className="w-full h-12 text-lg"
                disabled={!name.trim()}
              >
                Continue
              </Button>
              
              <Button 
                variant="outline"
                onClick={() => setStep('location')}
                className="w-full"
              >
                {t('location', language)}
              </Button>
            </>
          )}

          {step === 'phone' && (
            <>
              <div className="space-y-4">
                {location && (
                  <div className="bg-muted p-3 rounded-lg">
                    <div className="flex items-center space-x-2 text-sm">
                      <MapPin className="h-4 w-4 text-primary" />
                      <span>{location.area}, {location.city}</span>
                    </div>
                  </div>
                )}
                
                <div className="bg-muted p-3 rounded-lg">
                  <div className="flex items-center space-x-2 text-sm">
                    <User className="h-4 w-4 text-primary" />
                    <span>{name}</span>
                  </div>
                </div>
                
                <div className="relative">
                  <Smartphone className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                  <Input
                    type="tel"
                    placeholder={t('enterMobile', language)}
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                    className="pl-10 h-12 text-lg"
                    maxLength={10}
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  We'll send a verification code via SMS to verify your phone number.
                </p>
              </div>
              
              <Button 
                onClick={handleSendOTP}
                className="w-full h-12 text-lg"
                disabled={phone.length < 10 || isSendingOTP}
              >
                {isSendingOTP ? 'Sending...' : t('sendOTP', language)}
              </Button>
              
              <Button 
                variant="outline"
                onClick={() => setStep('name')}
                className="w-full"
              >
                Name
              </Button>
            </>
          )}

          {step === 'otp' && (
            <>
              <div className="space-y-4">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground mb-4">
                    Code sent to +91 {phone}
                  </p>
                </div>
                
                <Input
                  type="text"
                  placeholder="Enter 4-digit code"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 4))}
                  className="text-center text-2xl tracking-widest h-12"
                  maxLength={4}
                />

                <div className="text-center">
                  <Button
                    variant="link"
                    onClick={handleResendOTP}
                    disabled={resendTimer > 0 || isResendingOTP || resendCount >= 3}
                    className="text-sm"
                  >
                    {isResendingOTP ? (
                      <><RefreshCw className="mr-1 h-3 w-3 animate-spin" /> Resending...</>
                    ) : resendTimer > 0 ? (
                      `Resend in ${resendTimer}s`
                    ) : resendCount >= 3 ? (
                      'Max attempts reached'
                    ) : (
                      'Resend OTP'
                    )}
                  </Button>
                  {resendCount > 0 && (
                    <p className="text-xs text-muted-foreground mt-1">
                      Attempts: {resendCount}/3
                    </p>
                  )}
                </div>
              </div>
              
              <Button 
                onClick={handleVerifyOTP}
                className="w-full h-12 text-lg"
                disabled={otp.length < 4 || isVerifyingOTP}
              >
                <CheckCircle className="mr-2 h-5 w-5" />
                {isVerifyingOTP ? 'Verifying...' : t('verify', language)}
              </Button>
              
              <Button 
                variant="outline"
                onClick={() => setStep('phone')}
                className="w-full"
              >
                {t('changeNumber', language)}
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};