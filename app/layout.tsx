import "./globals.css";
import Link from "next/link";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-GB">
      <body>
        <div className="sticky top-0 z-50 border-b border-red-200 bg-red-700 px-4 py-2 text-sm font-semibold text-white">
          Electricity can cause shock, burns, fire, and serious injury. This tool does not replace a qualified electrician.
        </div>
        <header className="border-b border-workshop-300 bg-white px-4 py-3">
          <nav className="mx-auto flex max-w-6xl items-center justify-between">
            <Link href="/" className="text-lg font-bold">Fault Path UK</Link>
            <div className="flex gap-3 text-sm">
              <Link href="/diagnose">Diagnose</Link>
              <Link href="/library">Library</Link>
              <Link href="/tutor">Tutor</Link>
              <Link href="/admin/seeds">Admin Seeds</Link>
            </div>
          </nav>
        </header>
        <main className="mx-auto max-w-6xl p-4">{children}</main>
      </body>
    </html>
  );
}
