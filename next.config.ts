import type { NextConfig } from "next";

const securityHeaders = [
  // Forces HTTPS on every subsequent visit for a year, including
  // subdomains, and opts into browser HSTS preload lists. Vercel adds
  // its own HSTS header at the edge for HTTPS deployments, but that is
  // a platform default we don't control or see in this repo — declaring
  // it here means the guarantee travels with the code, not the host.
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  // Prevents the browser from MIME-sniffing a response away from the
  // declared Content-Type — mitigates certain XSS vectors.
  { key: "X-Content-Type-Options", value: "nosniff" },
  // Legacy clickjacking protection; CSP frame-ancestors below supersedes
  // this but it costs nothing to keep as defense in depth.
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  // Avoids leaking full URLs (which may contain experience tokens) to
  // third-party origins via the Referer header.
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // Disables powerful browser features this product never needs.
  {
    key: "Permissions-Policy",
    value: "camera=(self), microphone=(), geolocation=()",
  },
];

/**
 * `script-src`/`style-src` need `'unsafe-eval'`/`'unsafe-inline'` for Next's
 * dev-mode Fast Refresh — enforcing the production policy locally would
 * break the dev server for no security benefit, since dev never serves
 * real traffic. `'unsafe-inline'` for `style-src` in *both* modes is a
 * genuine (not lazy) requirement: Radix UI (Sheet, Accordion) sets inline
 * `style` attributes via JS for positioning/animation — there is no nonce
 * we control for that.
 *
 * `connect-src`/`img-src` allow Supabase's wildcard domain in *every*
 * environment, not just dev — Sprint 02's first draft only allowed `wss:`
 * in dev, which would have silently broken Supabase Realtime in
 * production the day it was adopted while looking fine locally. Fixed
 * during the Sprint 02A architecture audit. Storage/Realtime aren't used
 * yet, but the policy is ready for both without needing to be touched
 * again when they ship — that is the point of hardening it now.
 */
function buildContentSecurityPolicy(isDev: boolean): string {
  const supabaseHttp = "https://*.supabase.co";
  const supabaseWebSocket = "wss://*.supabase.co";

  const directives: Record<string, string> = {
    "default-src": "'self'",
    "script-src": isDev ? "'self' 'unsafe-eval' 'unsafe-inline'" : "'self'",
    "style-src": "'self' 'unsafe-inline'",
    "img-src": `'self' data: ${supabaseHttp}`,
    "font-src": "'self' data:",
    "connect-src": `'self' ${supabaseHttp} ${supabaseWebSocket}`,
    "frame-ancestors": "'self'",
    "base-uri": "'self'",
    "form-action": "'self'",
  };

  return Object.entries(directives)
    .map(([directive, value]) => `${directive} ${value}`)
    .join("; ");
}

const nextConfig: NextConfig = {
  // Removes the "X-Powered-By: Next.js" response header.
  poweredByHeader: false,

  // Photo upload sends raw files via Server Action before server-side WebP
  // compression. Default Next.js limit is 1 MB — raised to match studio schema
  // (max 10 MB per photo).
  experimental: {
    serverActions: {
      bodySizeLimit: "12mb",
    },
  },

  images: {
    /*
     * `next/image` rejects any external domain by default. Allow-listed
     * now, before a single real bouquet/theme photo is uploaded, so that
     * upload doesn't double as a production incident — PhotoSlot already
     * assumes real photos may live outside /public. Scoped to
     * `/storage/v1/object/public/**` (Supabase's public object path)
     * rather than the whole domain, since remotePatterns should only
     * cover what this app actually serves as an <Image>.
     */
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },

  async headers() {
    const isDev = process.env.NODE_ENV !== "production";

    return [
      {
        source: "/:path*",
        headers: [
          ...securityHeaders,
          {
            key: "Content-Security-Policy",
            value: buildContentSecurityPolicy(isDev),
          },
        ],
      },
    ];
  },
};

export default nextConfig;
