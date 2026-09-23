import {
  Cormorant_Garamond,
  Libre_Baskerville,
  Montserrat,
  Yeseva_One,
} from "next/font/google";

import { cn } from "@/lib/utils";

const yeseva = Yeseva_One({
  variable: "--font-yeseva",
  subsets: ["latin"],
  weight: "400",
});

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
});

const libre = Libre_Baskerville({
  variable: "--font-libre",
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
});

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
});

export const marketingFontClassName = cn(
  yeseva.variable,
  cormorant.variable,
  libre.variable,
  montserrat.variable,
);
