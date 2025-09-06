// app/(main)/achievements/page.tsx
import { redirect } from "next/navigation";
import { StickyWrapper } from "@/components/sticky-wrapper";
import { FeedWrapper } from "@/components/feed-wrapper";
import { UserProgress } from "@/components/user-progress";
import { Quests } from "@/components/quests";
import { Promo } from "@/components/promo";
import { Separator } from "@/components/ui/separator";

import { getUserProgress, getUserSubscription } from "@/db/queries";
import { AchievementClient } from "@/components/achievements/achievement-client";
// import { AchievementClient } from "@/components/achievements/achievement-client";

const AchievementsPage = async () => {
  const [userProgress, userSubscription] = await Promise.all([
    getUserProgress(),
    getUserSubscription(),
  ]);

  if (!userProgress || !userProgress.activeCourse) redirect("/courses");

  const isPro = !!userSubscription?.isActive;

  return (
    <div className="flex flex-row-reverse gap-[48px] px-6">
      {/* Sidebar */}
      <StickyWrapper>
        <UserProgress
          activeCourse={userProgress.activeCourse}
          hearts={userProgress.hearts}
          points={userProgress.points}
          hasActiveSubscription={isPro}
        />
        {!isPro && <Promo />}
        <Quests points={userProgress.points} />
      </StickyWrapper>

      {/* Main Content */}
      <FeedWrapper>
        <div className="flex flex-col items-center w-full">
          <h1 className="my-6 text-center text-2xl font-bold text-neutral-800">
            Achievements
          </h1>
          <p className="mb-6 text-center text-lg text-muted-foreground">
            Track your progress and see what achievements you’ve unlocked!
          </p>

          <Separator className="mb-6 h-0.5 rounded-full" />

          {/* Client-side component for interactivity */}
          <AchievementClient userId={userProgress.userId} />
        </div>
      </FeedWrapper>
    </div>
  );
};

export default AchievementsPage;
