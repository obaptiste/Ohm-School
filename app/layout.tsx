import "./globals.css";
import Link from "next/link";
import { Fraunces, Source_Sans_3 } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-display"
});

const sourceSans = Source_Sans_3({
  subsets: ["latin"],
  variable: "--font-body"
});

export const metadata = {
  title: "Ohm School",
  description: "Professional electrical fault-finding training and educational triage for UK domestic installations"
};

const navigation = [
  { href: "/diagnose", label: "Diagnosis studio" },
  { href: "/library", label: "Fault atlas" },
  { href: "/tutor", label: "Tutor console" },
  { href: "/admin/seeds", label: "Admin seeds" }
];

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-GB">
      <body className={`${fraunces.variable} ${sourceSans.variable}`}>
        <div className="sticky top-0 z-50 border-b border-copper-400/30 bg-[#702c14] px-4 py-2 text-sm font-semibold text-sand-50 shadow-[0_10px_30px_rgba(85,33,14,0.22)]" role="alert">
          Electricity can cause shock, burns, fire, and serious injury. Ohm School supports safe learning boundaries and does not replace a qualified electrician.
        </div>
        <div className="min-h-screen">
          <header className="sticky top-[41px] z-40 border-b border-slate-900/8 bg-sand-50/88 backdrop-blur-xl">
            <nav className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-4 py-4 sm:px-6">
              <Link href="/" className="flex items-center gap-3">
                <span className="grid h-11 w-11 place-items-center rounded-2xl border border-copper-300/50 bg-[linear-gradient(145deg,#fff7ec,#f0d3b5)] font-display text-lg font-semibold text-copper-900 shadow-[inset_0_1px_0_rgba(255,255,255,0.6)]">
                  Ω
                </span>
                <div>
                  <p className="font-display text-2xl leading-none text-slate-950">Ohm School</p>
                  <p className="text-xs uppercase tracking-[0.22em] text-slate-500">Fault-finding education</p>
                </div>
              </Link>
              <div className="flex flex-wrap items-center justify-end gap-2 text-sm">
                {navigation.map((item) => (
                  <Link key={item.href} href={item.href} className="rounded-full px-4 py-2 text-slate-700 transition hover:bg-white hover:text-slate-950 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-copper-700">
                    {item.label}
                  </Link>
                ))}
              </div>
            </nav>
          </header>
          <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8">{children}</main>
        </div>
        <Analytics />
      </body>
    </html>
  );
}
