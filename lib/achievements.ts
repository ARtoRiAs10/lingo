import db  from '@/db/drizzle';
import { achievements, userAchievements, userProgress, challengeProgress } from '@/db/schema';
import { eq, and, count, gte } from 'drizzle-orm';

export interface Achievement {
  id: number;
  name: string;
  description: string;
  icon: string;
  category: string;
  condition: string;
  points: number;
  rarity: string;
}

export interface UserAchievement {
  achievement: Achievement;
  unlockedAt: Date;
  progress: number;
}

// Predefined achievements
export const defaultAchievements: Omit<Achievement, 'id'>[] = [
  {
    name: "First Steps",
    description: "Complete your first lesson",
    icon: "🎯",
    category: "learning",
    condition: JSON.stringify({ type: "lessons_completed", target: 1 }),
    points: 50,
    rarity: "common"
  },
  {
    name: "Streak Master",
    description: "Maintain a 7-day learning streak",
    icon: "🔥",
    category: "streak", 
    condition: JSON.stringify({ type: "consecutive_days", target: 7 }),
    points: 200,
    rarity: "rare"
  },
  {
    name: "Points Collector",
    description: "Earn 1000 total points",
    icon: "💎",
    category: "learning",
    condition: JSON.stringify({ type: "total_points", target: 1000 }),
    points: 100,
    rarity: "common"
  },
  {
    name: "Perfect Score",
    description: "Complete a lesson with 100% accuracy",
    icon: "⭐",
    category: "learning", 
    condition: JSON.stringify({ type: "perfect_lesson", target: 1 }),
    points: 150,
    rarity: "rare"
  },
  {
    name: "AI Pioneer",
    description: "Generate your first AI course",
    icon: "🤖",
    category: "special",
    condition: JSON.stringify({ type: "ai_courses_created", target: 1 }),
    points: 300,
    rarity: "epic"
  },
  {
    name: "Knowledge Sharer",
    description: "Create 5 public AI courses",
    icon: "📚",
    category: "social",
    condition: JSON.stringify({ type: "public_courses_created", target: 5 }),
    points: 500,
    rarity: "legendary"
  }
];

export async function initializeAchievements() {
  for (const achievement of defaultAchievements) {
    await db
      .insert(achievements)
      .values(achievement)
      .onConflictDoNothing();
  }
}

export async function checkAndUnlockAchievements(userId: string) {
  const allAchievements = await db.select().from(achievements).where(eq(achievements.isActive, true));
  const userUnlockedAchievements = await db
    .select()
    .from(userAchievements)
    .where(eq(userAchievements.userId, userId));

  const unlockedIds = new Set(userUnlockedAchievements.map((ua: { achievementId: any; }) => ua.achievementId));
  const newUnlocks = [];

  for (const achievement of allAchievements) {
    if (unlockedIds.has(achievement.id)) continue;

    const condition = JSON.parse(achievement.condition);
    const isUnlocked = await checkAchievementCondition(userId, condition);

    if (isUnlocked) {
      await db.insert(userAchievements).values({
        userId,
        achievementId: achievement.id,
        progress: 100,
      });
      
      newUnlocks.push(achievement);
    }
  }

  return newUnlocks;
}

async function checkAchievementCondition(userId: string, condition: any): Promise<boolean> {
  switch (condition.type) {
    case 'lessons_completed': {
      const [result] = await db
        .select({ count: count() })
        .from(challengeProgress)
        .where(and(
          eq(challengeProgress.userId, userId),
          eq(challengeProgress.completed, true)
        ));
      return result.count >= condition.target;
    }
    
    case 'total_points': {
      const [user] = await db
        .select()
        .from(userProgress)
        .where(eq(userProgress.userId, userId));
      return user?.points >= condition.target;
    }
    
    // Add more condition types as needed
    default:
      return false;
  }
}

export async function getUserAchievements(userId: string): Promise<UserAchievement[]> {
  const result = await db
    .select({
      achievement: achievements,
      unlockedAt: userAchievements.unlockedAt,
      progress: userAchievements.progress,
    })
    .from(userAchievements)
    .innerJoin(achievements, eq(userAchievements.achievementId, achievements.id))
    .where(eq(userAchievements.userId, userId));

  return result.map((r: { achievement: any; unlockedAt: any; progress: any; }) => ({
    achievement: r.achievement,
    unlockedAt: r.unlockedAt!,
    progress: r.progress!,
  }));
}
