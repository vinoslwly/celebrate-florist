import type { NextConfig } from "next";

const securityHeaders = [
  // Prevents the browser from MIME-sniffing a response away from the
  // declared Content-Type — mitigates certain XSS vectors.
  { key: "X-Content-Type-Options", value: "nosniff" },
  // Legacy clickjacking protection; CSP frame-ancestors (added later,
  // once the experience/preview embedding model is finalized) supersedes
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

const nextConfig: NextConfig = {
  // Removes the "X-Powered-By: Next.js" response header.
  poweredByHeader: false,

  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
