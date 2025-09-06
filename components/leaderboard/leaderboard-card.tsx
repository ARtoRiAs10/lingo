"use client";

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Trophy, Medal, Award, Users } from 'lucide-react';

interface LeaderboardEntry {
  rank: number;
  userId: string;
  userName: string;
  userImageSrc: string;
  weeklyPoints: number;
  monthlyPoints: number;
  allTimePoints: number;
  streak: number;
}

interface LeaderboardCardProps {
  entries: LeaderboardEntry[];
  type: 'weekly' | 'monthly' | 'allTime';
  currentUserId?: string;
}

export const LeaderboardCard = ({ entries, type, currentUserId }: LeaderboardCardProps) => {
  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return <Trophy className="h-5 w-5 text-yellow-500" />;
      case 2: return <Medal className="h-5 w-5 text-gray-400" />;
      case 3: return <Award className="h-5 w-5 text-amber-600" />;
      default: return <span className="text-sm font-bold text-muted-foreground">#{rank}</span>;
    }
  };

  const getPoints = (entry: LeaderboardEntry) => {
    switch (type) {
      case 'weekly': return entry.weeklyPoints;
      case 'monthly': return entry.monthlyPoints;
      case 'allTime': return entry.allTimePoints;
    }
  };

  const getTitle = () => {
    switch (type) {
      case 'weekly': return 'Weekly Champions';
      case 'monthly': return 'Monthly Leaders';
      case 'allTime': return 'Hall of Fame';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          {getTitle()}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {entries.length === 0 ? (
          <p className="text-center text-muted-foreground">No entries yet</p>
        ) : (
          entries.map((entry) => (
            <div
              key={entry.userId}
              className={`flex items-center gap-3 p-3 rounded-lg border transition-colors ${
                entry.userId === currentUserId 
                  ? 'bg-blue-50 border-blue-200 dark:bg-blue-950 dark:border-blue-800' 
                  : 'hover:bg-gray-50 dark:hover:bg-gray-900'
              }`}
            >
              <div className="flex items-center justify-center w-8">
                {getRankIcon(entry.rank)}
              </div>
              
              <Avatar className="h-10 w-10">
                <AvatarImage src={entry.userImageSrc} />
                <AvatarFallback>
                  {entry.userName.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1">
                <p className="font-medium">{entry.userName}</p>
                <p className="text-sm text-muted-foreground">
                  {getPoints(entry)} points
                </p>
              </div>
              
              {entry.streak > 0 && (
                <Badge variant="secondary" className="gap-1">
                  🔥 {entry.streak}
                </Badge>
              )}
              
              {entry.userId === currentUserId && (
                <Badge variant="default">You</Badge>
              )}
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
};
