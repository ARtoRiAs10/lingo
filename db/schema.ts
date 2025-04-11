import { relations } from "drizzle-orm";
import { boolean, integer, pgEnum, pgTable, serial, text } from "drizzle-orm/pg-core";

// import { MAX_HEARTS } from "@/constants";

export const courses = pgTable("courses", {
    id:serial("id").primaryKey(),
    title: text("title").notNull(),
    imageSrc:text("imageSrc").notNull(),
});

export const coursesRelations = relations(courses, ({ many }) => ({
    userProgress: many(userProgress),
    units: many(units),
}));

export const units = pgTable("units", {
    id: serial("id").primaryKey(),
    title: text("title").notNull(),//unit 1
    description: text("description").notNull(),//unit 1 description
    courseId: integer("course_id")
        .references(() => courses.id, {
            onDelete: "cascade",
        })
        .notNull(),//course id
        order: integer("order").notNull(),//unit order
})

export const unitsRelations = relations(units, ({ many ,one }) => ({
    course: one(courses, {
        fields: [units.courseId],
        references: [courses.id],
    }),
    lessons: many(lessons),
}));

export const lessons = pgTable("lessons", {
    id: serial("id").primaryKey(),
    title: text("title").notNull(),//lesson 1
    // description: text("description").notNull(),//lesson 1 description
    unitId: integer("unit_id")
        .references(() => units.id, {
            onDelete: "cascade",
        })
        .notNull(),//unit id
        order: integer("order").notNull(),//lesson order
})

export const lessonsRelations = relations(lessons, ({ one, many }) => ({
    unit: one(units, {
        fields: [lessons.unitId],
        references: [units.id],
    }),
    challenges: many(challenges),
}));

export const challengesEnum = pgEnum("type", ["SELECT", "ASSIST"]);

export const challenges = pgTable("challenges", {
    id: serial("id").primaryKey(),
    lessonId: integer("lesson_id")
        .references(() => lessons.id, {
            onDelete: "cascade",
        })
        .notNull(),
        type: challengesEnum("type").notNull(),//challenge type
        question: text("question").notNull(),//question
        order: integer("order").notNull(),//challenge order
})

export const challengesRelations = relations(challenges, ({ one, many }) => ({
    lesson: one(lessons, {
        fields: [challenges.lessonId],
        references: [lessons.id],
    }),
    challengesOptions: many(challengeOptions),
    challengesProgress: many(challengeProgress),
}));

export const challengeOptions = pgTable("challenges_options", {
    id: serial("id").primaryKey(),
    challengeId: integer("challenge_id")
        .references(() => challenges.id, {
            onDelete: "cascade",
        })
        .notNull(),
        text: text("text").notNull(),//option text
        correct: boolean("correct").notNull(),
        imageSrc: text("imageSrc"),
        audioSrc: text("audioSrc"),
});

export const challengeOptionsRelations = relations(challengeOptions, ({ one}) => ({
    challenge: one(challenges, {
        fields: [challengeOptions.challengeId],
        references: [challenges.id],
    }),

}));

export const challengeProgress = pgTable("challenges_progress", {
    id: serial("id").primaryKey(),
    userId: text("user_id").notNull(),
    challengeId: integer("challenge_id")
        .references(() => challenges.id, {
            onDelete: "cascade",
        })
        .notNull(),
        completed: boolean("correct").notNull().default(false),

});


export const challengeProgressRelations = relations(challengeProgress, ({ one}) => ({
    challenge: one(challenges, {
        fields: [challengeProgress.challengeId],
        references: [challenges.id],
    }),

}));

export const userProgress = pgTable("user_progress", {
    userId: text("user_id").primaryKey(),
    userName: text("user_name").notNull().default("User"),
    userImageSrc: text("user_image_src").notNull().default("/mascot.svg"),
    activeCourseId: integer("active_course_id").references(() => courses.id, {
        onDelete: "cascade",
    }),
    hearts: integer("hearts").notNull().default(5),
    points: integer("points").notNull().default(0),
});

export const userProgressRelations = relations(userProgress, ({ one }) => ({
    activeCourse: one(courses, {
        fields: [userProgress.activeCourseId],
        references: [courses.id],
    }),
}));


// export const userSubscription = pgTable("user_subscription", {
//     id: serial("id").primaryKey(),
//     userId: text("user_id").notNull().unique(),
//     stripeCustomerId: text("stripe_customer_id").notNull().unique(),
//     stripeSubscriptionId: text("stripe_subscription_id").notNull().unique(),
//     stripePriceId: text("stripe_price_id").notNull(),
//     stripeCurrentPeriodEnd: timestamp("stripe_current_period_end").notNull(),
// })

