import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Smartphone, CheckCircle, MapPin, Globe, User } from "lucide-react";
import { UserPreferences, Location } from "@/types";
import { translations, Language, t } from "@/utils/translations";
import { getCurrentLocation } from "@/utils/location";

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

  const handleSendOTP = () => {
    if (phone.length >= 10) {
      setStep('otp');
    }
  };

  const handleVerifyOTP = () => {
    if (otp.length >= 4 && location && name.trim()) {
      const preferences: UserPreferences = {
        language,
        location,
        phone,
        name: name.trim()
      };
      onLogin(preferences);
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
                    onChange={(e) => setPhone(e.target.value)}
                    className="pl-10 h-12 text-lg"
                    maxLength={10}
                  />
                </div>
              </div>
              
              <Button 
                onClick={handleSendOTP}
                className="w-full h-12 text-lg"
                disabled={phone.length < 10}
              >
                {t('sendOTP', language)}
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
              </div>
              
              <Button 
                onClick={handleVerifyOTP}
                className="w-full h-12 text-lg"
                disabled={otp.length < 4}
              >
                <CheckCircle className="mr-2 h-5 w-5" />
                {t('verify', language)}
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