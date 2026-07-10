/**
 * Cute, hand-drawn-feeling bouquet illustration — restores the
 * prototype's whimsical SVG bouquet instead of a photorealistic
 * stock photo. Design Bible calls for "cute, warm... not flat
 * illustration ala startup"; a stylized illustration reads warmer
 * and more ownable than a generic product photo.
 */
export function BouquetIllustration() {
  return (
    <svg
      viewBox="0 0 200 200"
      className="h-full w-full"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M70 120 L100 190 M130 120 L100 190"
        stroke="#AAD4C4"
        strokeWidth="4"
        strokeLinecap="round"
      />
      <path
        d="M100 100 L100 195"
        stroke="#8EB59B"
        strokeWidth="4.5"
        strokeLinecap="round"
      />
      <path
        d="M75 160 C90 155, 110 155, 125 160 L100 195 Z"
        fill="#FBD5E3"
        opacity="0.95"
      />
      <circle cx="70" cy="70" r="28" fill="#F7AFCB" />
      <circle cx="70" cy="70" r="8" fill="#FFF4D6" />
      <circle cx="130" cy="70" r="28" fill="#FFD7C2" />
      <circle cx="130" cy="70" r="8" fill="#FFF4D6" />
      <circle cx="100" cy="110" r="32" fill="#F08AA8" />
      <circle cx="100" cy="110" r="10" fill="#FFF4D6" />
      <path
        d="M45 45 L47 53 L55 55 L47 57 L45 65 L43 57 L35 55 L43 53 Z"
        fill="#F08AA8"
        opacity="0.8"
      />
      <path
        d="M155 40 L157 46 L163 48 L157 50 L155 56 L153 50 L147 48 L153 46 Z"
        fill="#FFD7C2"
        opacity="0.8"
      />
    </svg>
  );
}
