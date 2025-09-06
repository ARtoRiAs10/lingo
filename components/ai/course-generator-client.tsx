// components/ai/course-generator-client.tsx
"use client";

import { CourseGenerator } from "./course-generator";

export const CourseGeneratorClient = () => {
  return (
    <CourseGenerator
      onCourseGenerated={(courseId: any) => {
        console.log("Course generated:", courseId);
        // You could navigate, show a toast, etc.
      }}
    />
  );
};
