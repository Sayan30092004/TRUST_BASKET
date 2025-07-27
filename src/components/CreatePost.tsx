import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PlusCircle, Mic, MicOff } from "lucide-react";
import { UserPreferences, Post } from "@/types";
import { t } from "@/utils/translations";
import { getSpeechRecognition, isSpeechRecognitionSupported, WebkitSpeechRecognition } from "@/utils/speechRecognition";
import { extractSupplierName } from "@/utils/nerExtractor";

interface CreatePostProps {
  userPreferences: UserPreferences;
  onCreatePost: (newPost: Omit<Post, 'id' | 'timestamp' | 'likes' | 'dislikes' | 'comments' | 'authorName' | 'authorPhone' | 'location'>) => void;
}

export const CreatePost = ({ userPreferences, onCreatePost }: CreatePostProps) => {
  const [category, setCategory] = useState<string>('');
  const [content, setContent] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [extractedSupplier, setExtractedSupplier] = useState<string>('');
  const recognitionRef = useRef<WebkitSpeechRecognition | null>(null);

  const categories = [
    { id: 'vegetables', name: t('vegetables', userPreferences.language), emoji: '🥬' },
    { id: 'spices', name: t('spices', userPreferences.language), emoji: '🌶️' },
    { id: 'oil', name: t('oil', userPreferences.language), emoji: '🛢️' },
    { id: 'packaging', name: t('packaging', userPreferences.language), emoji: '📦' },
    { id: 'dairy', name: t('dairy', userPreferences.language), emoji: '🥛' },
  ];

  // Initialize speech recognition
  useEffect(() => {
    if (isSpeechRecognitionSupported()) {
      recognitionRef.current = getSpeechRecognition();
      if (recognitionRef.current) {
        recognitionRef.current.continuous = false;
        recognitionRef.current.interimResults = false;
        recognitionRef.current.lang = userPreferences.language === 'hi' ? 'hi-IN' : 
                                     userPreferences.language === 'bn' ? 'bn-IN' :
                                     userPreferences.language === 'ta' ? 'ta-IN' : 'en-IN';
      }
    }
  }, [userPreferences.language]);

  // Extract supplier name when content changes
  useEffect(() => {
    if (content.trim()) {
      const supplier = extractSupplierName(content);
      setExtractedSupplier(supplier);
    } else {
      setExtractedSupplier('');
    }
  }, [content]);

  const startListening = () => {
    if (!recognitionRef.current) return;
    
    setIsListening(true);
    recognitionRef.current.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setContent(prev => prev + ' ' + transcript);
    };
    
    recognitionRef.current.onend = () => {
      setIsListening(false);
    };
    
    recognitionRef.current.onerror = () => {
      setIsListening(false);
    };
    
    recognitionRef.current.start();
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsListening(false);
  };

  const handleSubmit = async () => {
    if (!category || !content.trim()) return;
    
    setIsSubmitting(true);
    
    // Create the new post
    const newPost = {
      content: content.trim(),
      category,
      supplierName: extractedSupplier || undefined
    };
    
    // Call the parent callback
    onCreatePost(newPost);
    
    // Reset form
    setCategory('');
    setContent('');
    setExtractedSupplier('');
    setIsSubmitting(false);
  };

  return (
    <div className="max-w-2xl mx-auto p-4 pb-20">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-foreground">{t('post', userPreferences.language)}</h1>
        <span className="text-2xl">✍️</span>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <PlusCircle className="h-5 w-5" />
            <span>New Post</span>
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Category selection */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              {t('selectCategory', userPreferences.language)} *
            </label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="h-12">
                <SelectValue placeholder={t('selectCategory', userPreferences.language)} />
              </SelectTrigger>
              <SelectContent>
                {categories.map(cat => (
                  <SelectItem key={cat.id} value={cat.id}>
                    <div className="flex items-center space-x-2">
                      <span>{cat.emoji}</span>
                      <span>{cat.name}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Content input */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-foreground">
                Share your experience *
              </label>
              {isSpeechRecognitionSupported() && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={isListening ? stopListening : startListening}
                  className={`flex items-center space-x-2 ${isListening ? 'bg-destructive/10 text-destructive border-destructive' : ''}`}
                >
                  {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                  <span>{isListening ? 'Stop' : '🎤'}</span>
                </Button>
              )}
            </div>
            <Textarea
              placeholder={t('writePost', userPreferences.language)}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="min-h-32 text-base"
              maxLength={500}
            />
            <div className="flex items-center justify-between">
              <div>
                {extractedSupplier && (
                  <div className="text-xs text-primary font-medium">
                    🏪 Supplier detected: {extractedSupplier}
                  </div>
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                {content.length}/500
              </p>
            </div>
          </div>

          {/* Tips */}
          <div className="bg-primary-soft p-4 rounded-lg">
            <h3 className="font-medium text-primary mb-2">💡 Tips for better posts:</h3>
            <ul className="text-sm text-primary space-y-1">
              <li>• Mention supplier name clearly</li>
              <li>• Share specific quality details</li>
              <li>• Be honest and helpful</li>
              <li>• Include prices if relevant</li>
            </ul>
          </div>

          {/* Submit button */}
          <Button 
            onClick={handleSubmit}
            disabled={!category || !content.trim() || isSubmitting}
            className="w-full h-12 text-lg"
          >
            {isSubmitting ? 'Sharing...' : t('sharePost', userPreferences.language) + ' 📝'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};