import { FeedWrapper } from "@/components/feed-wrapper";
import { Promo } from "@/components/promo";
import { Quests } from "@/components/quests";
import { StickyWrapper } from "@/components/sticky-wrapper";
import { UserProgress } from "@/components/user-progress";
import { getTopTenUsers, getUserProgress, getUserSubscription } from "@/db/queries";
import Image from "next/image";
import { redirect } from "next/navigation";
import { Separator } from "@/components/ui/separator";
import { LeaderboardClientWrapper } from "@/components/leaderboard/leaderboardClientWrapper";

const LeaderboardPage = async () => {
  const userProgressData = getUserProgress();
  const userSubscriptionData = getUserSubscription();
  const leaderboardData = getTopTenUsers();

  const [userProgress, userSubscription, leaderboard] = await Promise.all([
    userProgressData,
    userSubscriptionData,
    leaderboardData,
  ]);

  if (!userProgress || !userProgress.activeCourse) redirect("/courses");

  const isPro = !!userSubscription?.isActive;

  return (
    <div className="flex flex-row-reverse gap-[48px] px-6">
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

      <FeedWrapper>
        <div className="flex w-full flex-col items-center">
          <Image
            src="/leaderboard.svg"
            alt="Leaderboard"
            height={90}
            width={90}
          />

          <h1 className="my-6 text-center text-2xl font-bold text-neutral-800">
            Leaderboard
          </h1>

          <p className="mb-6 text-center text-lg text-muted-foreground">
            See where you stand among other learners in the community.
          </p>

          <Separator className="mb-4 h-0.5 rounded-full" />

          <LeaderboardClientWrapper
            entries={leaderboard}
            currentUserId={userProgress.userId}
          />
        </div>
      </FeedWrapper>
    </div>
  );
};

export default LeaderboardPage;
