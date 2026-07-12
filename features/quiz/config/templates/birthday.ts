import type { QuizTemplateDefinition } from "@/features/quiz/types";

export const birthdayTemplate: QuizTemplateDefinition = {
  id: "birthday",
  quizTitle: "Birthday Best Friend Quiz",
  questions: [
    {
      sortOrder: 1,
      prompt: "What is their favorite way to celebrate?",
      options: [
        "Quiet dinner with close friends",
        "A big party",
        "A cozy day at home",
      ],
      correctOptionIndex: 0,
    },
    {
      sortOrder: 2,
      prompt: "What gift would make them smile instantly?",
      options: [
        "Something handmade",
        "A shared experience",
        "Their favorite treat",
      ],
      correctOptionIndex: 1,
    },
    {
      sortOrder: 3,
      prompt: "What inside joke do you share?",
      options: [
        "The one from our trip",
        "The nickname only we use",
        "The story we retell every year",
      ],
      correctOptionIndex: 2,
    },
    {
      sortOrder: 4,
      prompt: "What do you admire most about them?",
      options: ["Their kindness", "Their humor", "Their courage"],
      correctOptionIndex: 0,
    },
  ],
  bands: [
    {
      minPercent: 0,
      maxPercent: 49,
      message:
        "Fun start! There's always room for more birthday surprises and inside jokes.",
    },
    {
      minPercent: 50,
      maxPercent: 79,
      message:
        "Nice score! You're a thoughtful friend who really shows up for them.",
    },
    {
      minPercent: 80,
      maxPercent: 100,
      message:
        "Birthday champion! You know them better than anyone — and they are lucky to have you.",
    },
  ],
};
