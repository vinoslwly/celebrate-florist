import type { QuizTemplateDefinition } from "@/features/quiz/types";

export const proposalTemplate: QuizTemplateDefinition = {
  id: "proposal",
  quizTitle: "Before I Ask the Big Question...",
  questions: [
    {
      sortOrder: 1,
      prompt: "When did you know this relationship was different?",
      options: [
        "On our first adventure",
        "During a quiet ordinary day",
        "The moment they made you feel safe",
      ],
      correctOptionIndex: 2,
    },
    {
      sortOrder: 2,
      prompt: "What future dream do you share most?",
      options: [
        "Building a home together",
        "Growing through every season",
        "Laughing together for decades",
      ],
      correctOptionIndex: 1,
    },
    {
      sortOrder: 3,
      prompt: "What little habit of theirs makes you smile?",
      options: [
        "How they greet you",
        "How they hum while cooking",
        "How they remember small details",
      ],
      correctOptionIndex: 2,
    },
    {
      sortOrder: 4,
      prompt: "What promise matters most to you both?",
      options: [
        "Honesty always",
        "Choosing each other daily",
        "Making life an adventure",
      ],
      correctOptionIndex: 1,
    },
  ],
  bands: [
    {
      minPercent: 0,
      maxPercent: 49,
      message:
        "A tender beginning. Love grows in the everyday moments you still get to share.",
    },
    {
      minPercent: 50,
      maxPercent: 79,
      message:
        "Beautiful connection. You see each other clearly — and the story is still unfolding.",
    },
    {
      minPercent: 80,
      maxPercent: 100,
      message:
        "True partners. You know each other's hearts — and that is the best answer of all.",
    },
  ],
};
