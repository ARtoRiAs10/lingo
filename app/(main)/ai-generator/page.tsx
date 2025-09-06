// app/(main)/ai-generator/page.tsx (Server Component)
import { CourseGeneratorClient } from "@/components/ai/course-generator-client";
import { FeedWrapper } from "@/components/feed-wrapper";
import { StickyWrapper } from "@/components/sticky-wrapper";
import { UserProgress } from "@/components/user-progress";
import { Quests } from "@/components/quests";
import { getUserProgress } from "@/db/queries";
import { redirect } from "next/navigation";

const AIGeneratorPage = async () => {
  const userProgress = await getUserProgress();

  if (!userProgress || !userProgress.activeCourse) {
    redirect("/courses");
  }

  return (
    <div className="flex flex-row-reverse gap-[48px] px-6">
      <StickyWrapper>
        <UserProgress
          activeCourse={userProgress.activeCourse}
          hearts={userProgress.hearts}
          points={userProgress.points}
          hasActiveSubscription={false}
        />
        <Quests points={userProgress.points} />
      </StickyWrapper>
      <FeedWrapper>
        <div className="w-full flex flex-col items-center">
          <h1 className="text-2xl font-bold text-neutral-700 mb-6">
            AI Course Generator
          </h1>
          {/* ✅ Pass plain data down */}
          <CourseGeneratorClient />
        </div>
      </FeedWrapper>
    </div>
  );
};

export default AIGeneratorPage;
