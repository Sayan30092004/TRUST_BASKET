import { Home, Store, PlusCircle, User } from "lucide-react";
import { Language, t } from "@/utils/translations";

interface BottomNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  language: Language;
}

export const BottomNav = ({ activeTab, onTabChange, language }: BottomNavProps) => {
  const tabs = [
    { id: 'feed', icon: Home, label: t('feed', language) },
    { id: 'suppliers', icon: Store, label: t('suppliers', language) },
    { id: 'post', icon: PlusCircle, label: t('post', language) },
    { id: 'profile', icon: User, label: t('profile', language) },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border">
      <div className="flex justify-around items-center py-2">
        {tabs.map(({ id, icon: Icon, label }) => (
          <button
            key={id}
            onClick={() => onTabChange(id)}
            className={`flex flex-col items-center py-2 px-4 rounded-lg transition-colors ${
              activeTab === id
                ? 'text-primary bg-primary-soft'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Icon className="h-6 w-6 mb-1" />
            <span className="text-xs font-medium">{label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};