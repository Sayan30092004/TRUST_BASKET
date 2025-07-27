import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShoppingBag, Shield, Star, TrendingUp } from "lucide-react";

interface LoadingScreenProps {
  onComplete: () => void;
}

export const LoadingScreen = ({ onComplete }: LoadingScreenProps) => {
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);

  const loadingSteps = [
    { text: "Initializing Trust Basket", icon: ShoppingBag, color: "text-blue-500" },
    { text: "Loading Security Protocols", icon: Shield, color: "text-green-500" },
    { text: "Verifying Suppliers", icon: Star, color: "text-yellow-500" },
    { text: "Analyzing Market Trends", icon: TrendingUp, color: "text-purple-500" },
    { text: "Ready to Connect!", icon: ShoppingBag, color: "text-blue-500" }
  ];

  useEffect(() => {
    // Simulate loading progress with slower, more visible steps
    const progressTimer = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressTimer);
          setTimeout(onComplete, 1000); // Longer delay before completing
          return 100;
        }
        return prev + 1; // Slower increment (was +2)
      });
    }, 60); // Adjusted for 6 seconds total (100 steps * 60ms = 6000ms = 6 seconds)

    // Update current step based on progress with longer pauses
    const stepTimer = setInterval(() => {
      setCurrentStep(prev => {
        const newStep = Math.floor((progress / 100) * (loadingSteps.length - 1));
        return Math.min(newStep, loadingSteps.length - 1);
      });
    }, 200); // Slower step updates (was 100ms)

    return () => {
      clearInterval(progressTimer);
      clearInterval(stepTimer);
    };
  }, [progress, onComplete]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-2xl border-0 bg-white/80 backdrop-blur-sm">
        <CardContent className="p-8">
          {/* App Logo and Title */}
          <div className="text-center mb-8">
            <div className="relative mb-4">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-green-500 rounded-2xl mx-auto flex items-center justify-center shadow-lg">
                <ShoppingBag className="h-10 w-10 text-white" />
              </div>
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center">
                <Shield className="h-4 w-4 text-white" />
              </div>
            </div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Trust Basket</h1>
            <p className="text-gray-600 text-sm">Connecting trusted suppliers with verified buyers</p>
          </div>

          {/* Progress Bar */}
          <div className="mb-6">
            <div className="flex justify-between text-xs text-gray-500 mb-2">
              <span>Loading...</span>
              <span>{progress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-blue-500 to-green-500 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${progress}%` }}
              >
                <div className="h-full bg-white/30 animate-pulse"></div>
              </div>
            </div>
          </div>

          {/* Current Step */}
          <div className="text-center mb-6">
            <div className="flex items-center justify-center space-x-2 mb-2">
              {loadingSteps.map((step, index) => {
                const Icon = step.icon;
                const isActive = index === currentStep;
                const isCompleted = index < currentStep;
                
                return (
                  <div key={index} className="relative">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-500 ${
                      isCompleted 
                        ? 'bg-green-500 text-white' 
                        : isActive 
                          ? 'bg-blue-500 text-white animate-pulse' 
                          : 'bg-gray-200 text-gray-400'
                    }`}>
                      <Icon className="h-4 w-4" />
                    </div>
                    {index < loadingSteps.length - 1 && (
                      <div className={`absolute top-4 left-8 w-4 h-0.5 transition-all duration-500 ${
                        isCompleted ? 'bg-green-500' : 'bg-gray-200'
                      }`}></div>
                    )}
                  </div>
                );
              })}
            </div>
            <p className={`text-sm font-medium transition-all duration-500 ${
              loadingSteps[currentStep]?.color || 'text-gray-600'
            }`}>
              {loadingSteps[currentStep]?.text || 'Loading...'}
            </p>
          </div>

          {/* Loading Animation */}
          <div className="flex justify-center space-x-1">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
                style={{ animationDelay: `${i * 0.2}s` }}
              ></div>
            ))}
          </div>

          {/* Features Preview */}
          <div className="mt-8 grid grid-cols-2 gap-3">
            <Badge variant="secondary" className="text-xs">
              <Shield className="h-3 w-3 mr-1" />
              Verified Suppliers
            </Badge>
            <Badge variant="secondary" className="text-xs">
              <Star className="h-3 w-3 mr-1" />
              Trust Scores
            </Badge>
            <Badge variant="secondary" className="text-xs">
              <TrendingUp className="h-3 w-3 mr-1" />
              Real-time Updates
            </Badge>
            <Badge variant="secondary" className="text-xs">
              <ShoppingBag className="h-3 w-3 mr-1" />
              Quality Reviews
            </Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}; 