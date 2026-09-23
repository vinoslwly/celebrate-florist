import { marketingFontClassName } from "@/features/landing/config/marketing-fonts";
import { LoginForm } from "@/features/studio/components/login-form";

import "@/features/landing/styles/marketing.css";

export const metadata = {
  title: "Studio login",
  robots: { index: false, follow: false },
};

export default function StudioLoginPage() {
  return (
    <div className={`${marketingFontClassName} page-minimal`}>
      <main className="auth-card">
        <p className="eyebrow">Celebrate Studio</p>
        <h1>Selamat datang kembali</h1>
        <p>Masuk untuk merancang dan menerbitkan greeting digital.</p>
        <LoginForm />
      </main>
    </div>
  );
}
