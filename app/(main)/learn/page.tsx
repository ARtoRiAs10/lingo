import { FeedWrapper } from "@/components/feed-wrapper";
import { StickyWrapper } from "@/components/sticky-wrapper";
import { UserProgress } from "@/components/user-progress";
import { getCourseProgress, getLessonPercentage, getUnits, getUserProgress, getUserSubscription } from "@/db/queries";
import { redirect } from "next/navigation";
import { Header } from "./header";
import { Unit } from "./unit";

const LearnPage = async () => {
  const unitsData = getUnits();
  const courseProgressData = getCourseProgress();
  const lessonPercentageData = getLessonPercentage();
  const userProgressData = getUserProgress();
  const userSubscriptionData = getUserSubscription();

  const [
    userProgress,
    units,
    courseProgress,
    lessonPercentage,
    userSubscription,
  ] = await Promise.all([
    userProgressData,
    unitsData,
    courseProgressData,
    lessonPercentageData,
    userSubscriptionData
  ]);

  if (!userProgress || !userProgress.activeCourse) {
    redirect("/courses");
    // console.log()
  }

  if (!courseProgress) {
    redirect("/courses");
  }

  return (
    <div className= "flex flex-row-reverse gap-[48px] px-6">
      <StickyWrapper>
        <UserProgress 
          // activeCourse={{title: "Spanish", imgSrc: "es.svg"}}
          activeCourse={userProgress.activeCourse}
          // hearts= {5}
          hearts={userProgress.hearts}
          // points={100}
          points = {userProgress.points}
          hasActiveSubscription={!!userSubscription?.isActive}
        />
      </StickyWrapper>

      <FeedWrapper>

        {/* <Header title="Spanish" /> */}
        <Header title = {userProgress.activeCourse.title} />
        {units.map((unit) => (
          <div key={unit.id} className="mb-10">
            {/* {JSON.stringify(unit)} */}
            <Unit
              id = {unit.id}
              order = {unit.order}
              description = {unit.description}
              title = {unit.title}
              lessons = {unit.lessons}
              activeLesson = {courseProgress.activeLesson // as typeof lessons.$inferSelect & {
              //   unit: typeof unitsSchema.$inferSelect;
              // } | undefined}
              }
              activeLessonPercentage = {lessonPercentage}
            />
          </div>
        ) )}
      </FeedWrapper>
    </div>
  );
}
export default LearnPage;