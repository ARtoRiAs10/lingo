"use client";

import { useEffect, useState } from "react";
import { AchievementBadge } from "./achievements-badge";
// import { getUserAchievements } from "@/db/achievements";
import {  UserAchievement } from "@/lib/achievements";

interface Props {
  userId: string;
}

export const AchievementClient = ({ userId }: Props) => {
  const [achievements, setAchievements] = useState<UserAchievement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAchievements() {
      try {
        const res = await fetch(`/api/achievements?userId=${userId}`);
        const data: UserAchievement[] = await res.json();
        setAchievements(data);
      } catch (err) {
        console.error("Failed to load achievements", err);
      } finally {
        setLoading(false);
      }
    }

    fetchAchievements();
  }, [userId]);

  if (loading) return <p>Loading achievements...</p>;
  if (achievements.length === 0) return <p>No achievements yet!</p>;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 w-full">
      {achievements.map((ua) => (
        <AchievementBadge
          key={ua.achievement.id}
          achievement={ua.achievement}
          isUnlocked={ua.progress >= 100}
          progress={ua.progress}
        />
      ))}
    </div>
  );
};
