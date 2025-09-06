import { NextRequest, NextResponse } from 'next/server';
import { currentUser } from '@clerk/nextjs/server';
import { llmClient } from '@/lib/ai/llm-client';
import  db  from '@/db/drizzle';
import { aiGeneratedCourses, courses, units, lessons, challenges, challengeOptions } from '@/db/schema';

export async function POST(request: NextRequest) {
  try {
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { topic, language, difficulty, makePublic } = await request.json();

    if (!topic || !language || !difficulty) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Generate course content using AI
    const aiResponse = await llmClient.generateCourse(topic, language, difficulty);
    
    if (!aiResponse.success) {
      return NextResponse.json(
        { error: 'Failed to generate course content' },
        { status: 500 }
      );
    }

    let courseData;
    try {
      courseData = JSON.parse(aiResponse.content);
    } catch (parseError) {
      return NextResponse.json(
        { error: 'Invalid AI response format' },
        { status: 500 }
      );
    }

    // Save to database
    const [newCourse] = await db
      .insert(courses)
      .values({
        title: courseData.title,
        imageSrc: '/flag-placeholder.svg', // Default image
      })
      .returning();

    // Record AI generation metadata
    await db
      .insert(aiGeneratedCourses)
      .values({
        title: courseData.title,
        description: courseData.description,
        language,
        difficulty,
        topic,
        createdBy: user.id,
        isPublic: makePublic || false,
        aiModel: 'mistralai/Mistral-7B-Instruct-v0.1',
        prompt: `Topic: ${topic}, Language: ${language}, Difficulty: ${difficulty}`,
      });

    // Create units, lessons, and challenges
    for (const [unitIndex, unitData] of courseData.units.entries()) {
      const [newUnit] = await db
        .insert(units)
        .values({
          title: unitData.title,
          description: unitData.description,
          courseId: newCourse.id,
          order: unitIndex + 1,
        })
        .returning();

      for (const [lessonIndex, lessonData] of unitData.lessons.entries()) {
        const [newLesson] = await db
          .insert(lessons)
          .values({
            title: lessonData.title,
            unitId: newUnit.id,
            order: lessonIndex + 1,
          })
          .returning();

        for (const [challengeIndex, challengeData] of lessonData.challenges.entries()) {
          const [newChallenge] = await db
            .insert(challenges)
            .values({
              lessonId: newLesson.id,
              type: challengeData.type as "SELECT" | "ASSIST",
              question: challengeData.question,
              order: challengeIndex + 1,
            })
            .returning();

          // Add challenge options
          for (const optionData of challengeData.options) {
            await db
              .insert(challengeOptions)
              .values({
                challengeId: newChallenge.id,
                text: optionData.text,
                correct: optionData.correct,
              });
          }
        }
      }
    }

    return NextResponse.json({
      success: true,
      courseId: newCourse.id,
      title: courseData.title,
      message: 'Course generated successfully!'
    });

  } catch (error) {
    console.error('Course generation error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
