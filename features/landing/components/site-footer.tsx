const CURRENT_YEAR = new Date().getFullYear();

export function SiteFooter() {
  return (
    <footer className="border-t border-border px-4 py-10 sm:px-6">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 sm:flex-row">
        <p className="text-sm text-muted-foreground">
          © {CURRENT_YEAR} Celebrate Florist. Surakarta.
        </p>
        {/* TODO(founder): replace with the real @celebrateflorist handle URL. */}
        <a
          href="https://instagram.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          Instagram
        </a>
      </div>
    </footer>
  );
}
