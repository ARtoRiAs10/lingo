import { FeedWrapper } from "@/components/feed-wrapper";
import { StickyWrapper } from "@/components/sticky-wrapper";
import { UserProgress } from "@/components/user-progress";
import { getUnits, getUserProgress } from "@/db/queries";
import { redirect } from "next/navigation";
import { Header } from "./header";

const LearnPage = async () => {
  const unitsData = getUnits();
  const userProgressData = getUserProgress();

  const [
    userProgress,
    units,

  ] = await Promise.all([
    userProgressData,
    unitsData,
  ]);

  if (!userProgress || !userProgress.activeCourse) {
    redirect("/courses");
    // console.log()
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
          hasActiveSubscription={false}
        />
      </StickyWrapper>

      <FeedWrapper>

        {/* <Header title="Spanish" /> */}
        <Header title = {userProgress.activeCourse.title} />
        {units.map((unit) => (
          <div key={unit.id} className="mb-10">
            {JSON.stringify(unit)}
          </div>
        ) )}
      </FeedWrapper>
    </div>
  );
}
export default LearnPage;