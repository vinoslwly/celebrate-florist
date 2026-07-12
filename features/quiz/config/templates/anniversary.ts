import type { QuizTemplateDefinition } from "@/features/quiz/types";

export const anniversaryTemplate: QuizTemplateDefinition = {
  id: "anniversary",
  quizTitle: "How Well Do You Know Our Story?",
  questions: [
    {
      sortOrder: 1,
      prompt: "Where did we have our first date?",
      options: [
        "The coffee shop downtown",
        "The park by the river",
        "Our favorite restaurant",
      ],
      correctOptionIndex: 2,
    },
    {
      sortOrder: 2,
      prompt: "What song always reminds us of each other?",
      options: [
        "Our road-trip playlist song",
        "The song from our first dance",
        "The one we sing badly in the car",
      ],
      correctOptionIndex: 1,
    },
    {
      sortOrder: 3,
      prompt: "What is our go-to comfort food together?",
      options: ["Late-night noodles", "Shared dessert", "Homemade soup"],
      correctOptionIndex: 0,
    },
    {
      sortOrder: 4,
      prompt: "What do we say makes us a great team?",
      options: [
        "We laugh at the same jokes",
        "We listen first",
        "We always find our way back",
      ],
      correctOptionIndex: 2,
    },
  ],
  bands: [
    {
      minPercent: 0,
      maxPercent: 49,
      message:
        "Sweet start! There are still plenty of chapters left to discover together.",
    },
    {
      minPercent: 50,
      maxPercent: 79,
      message:
        "Impressive! You know our story well — and the best memories are still ahead.",
    },
    {
      minPercent: 80,
      maxPercent: 100,
      message:
        "Perfect match! You know our love story by heart. Here's to many more years together.",
    },
  ],
};
