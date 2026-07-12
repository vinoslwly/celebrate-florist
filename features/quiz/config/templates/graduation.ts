import type { QuizTemplateDefinition } from "@/features/quiz/types";

export const graduationTemplate: QuizTemplateDefinition = {
  id: "graduation",
  quizTitle: "How Well Do You Know the Graduate?",
  questions: [
    {
      sortOrder: 1,
      prompt: "What subject did they enjoy most?",
      options: [
        "Creative arts",
        "Science and problem-solving",
        "History and stories",
      ],
      correctOptionIndex: 1,
    },
    {
      sortOrder: 2,
      prompt: "What kept them going on tough study days?",
      options: [
        "Coffee and playlists",
        "Family encouragement",
        "Dreams of the future",
      ],
      correctOptionIndex: 2,
    },
    {
      sortOrder: 3,
      prompt: "What is their proudest graduation moment?",
      options: [
        "Finishing the final project",
        "Walking across the stage",
        "Celebrating with loved ones",
      ],
      correctOptionIndex: 1,
    },
    {
      sortOrder: 4,
      prompt: "What do they want to do next?",
      options: [
        "Travel and explore",
        "Start a new chapter of work",
        "Take a well-earned rest",
      ],
      correctOptionIndex: 1,
    },
  ],
  bands: [
    {
      minPercent: 0,
      maxPercent: 49,
      message:
        "A solid effort! Spend more time with the graduate and you'll know their journey even better.",
    },
    {
      minPercent: 50,
      maxPercent: 79,
      message: "Great job! You clearly cheered them on through this milestone.",
    },
    {
      minPercent: 80,
      maxPercent: 100,
      message:
        "Outstanding! You know this graduate's hard work and heart inside out.",
    },
  ],
};
