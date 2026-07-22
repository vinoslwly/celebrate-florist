<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Cursor Cloud specific instructions

This is a single Next.js 16 (App Router) web app (`celebrate-florist`), package-managed with npm (`package-lock.json`). There are no databases, auth, or external services, and no automated test suite. Standard commands live in `package.json` (`dev`, `build`, `start`, `lint`).

- The dev server (`npm run dev`) supports hot module reload; edits to files under `app/` update the browser live without a refresh.
- Node 22 is used here; Next.js 16 requires Node >= 20.9.
- Running `npm install` may normalize/rewrite `package-lock.json` under some npm versions. If that happens and it's unrelated to your change, discard it (`git checkout package-lock.json`) to keep the tree clean.
