"use client";

import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface Achievement {
  id: number;
  name: string;
  description: string;
  icon: string;
  rarity: string;
  points: number;
}

interface AchievementBadgeProps {
  achievement: Achievement;
  isUnlocked: boolean;
  progress?: number;
  className?: string;
}

export const AchievementBadge = ({ 
  achievement, 
  isUnlocked, 
  progress = 0, 
  className 
}: AchievementBadgeProps) => {
  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'border-gray-300 bg-gray-50';
      case 'rare': return 'border-blue-300 bg-blue-50';
      case 'epic': return 'border-purple-300 bg-purple-50';
      case 'legendary': return 'border-yellow-300 bg-yellow-50';
      default: return 'border-gray-300 bg-gray-50';
    }
  };

  const getRarityBadgeColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'bg-gray-500';
      case 'rare': return 'bg-blue-500';
      case 'epic': return 'bg-purple-500';
      case 'legendary': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <Card className={cn(
      "relative transition-all duration-300 hover:scale-105",
      isUnlocked ? getRarityColor(achievement.rarity) : "border-gray-200 bg-gray-100",
      !isUnlocked && "opacity-50 grayscale",
      className
    )}>
      <CardContent className="p-4 text-center">
        <div className="text-3xl mb-2">
          {isUnlocked ? achievement.icon : "🔒"}
        </div>
        
        <h3 className={cn(
          "font-semibold text-sm mb-1",
          isUnlocked ? "text-gray-900" : "text-gray-500"
        )}>
          {achievement.name}
        </h3>
        
        <p className={cn(
          "text-xs mb-2",
          isUnlocked ? "text-gray-600" : "text-gray-400"
        )}>
          {achievement.description}
        </p>
        
        <div className="flex justify-between items-center">
          <Badge 
            className={cn("text-xs", getRarityBadgeColor(achievement.rarity))}
            variant="default"
          >
            {achievement.rarity.toUpperCase()}
          </Badge>
          
          <span className="text-xs font-medium text-gray-600">
            {achievement.points} XP
          </span>
        </div>
        
        {!isUnlocked && progress > 0 && (
          <div className="mt-2">
            <div className="w-full bg-gray-200 rounded-full h-1.5">
              <div 
                className="bg-blue-500 h-1.5 rounded-full transition-all duration-300" 
                style={{ width: `${Math.min(progress, 100)}%` }}
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {progress}% complete
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};