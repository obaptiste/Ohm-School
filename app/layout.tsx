import "./globals.css";
import Link from "next/link";

export const metadata = {
  title: "Fault Path UK",
  description: "Educational fault-finding guidance for UK domestic electrical installations"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-GB">
      <body>
        <div className="sticky top-0 z-50 border-b border-red-200 bg-red-700 px-4 py-2 text-sm font-semibold text-white" role="alert">
          Electricity can cause shock, burns, fire, and serious injury. This tool does not replace a qualified electrician.
        </div>
        <header className="border-b border-workshop-300 bg-white px-4 py-3">
          <nav className="mx-auto flex max-w-6xl items-center justify-between">
            <Link href="/" className="text-lg font-bold">
              Fault Path UK
            </Link>
            <div className="flex gap-3 text-sm">
              <Link href="/diagnose" className="hover:text-workshop-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-workshop-900">
                Diagnose
              </Link>
              <Link href="/library" className="hover:text-workshop-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-workshop-900">
                Library
              </Link>
              <Link href="/tutor" className="hover:text-workshop-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-workshop-900">
                Tutor
              </Link>
              <Link href="/admin/seeds" className="hover:text-workshop-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-workshop-900">
                Admin Seeds
              </Link>
            </div>
          </nav>
        </header>
        <main className="mx-auto max-w-6xl p-4">{children}</main>
      </body>
    </html>
  );
}
