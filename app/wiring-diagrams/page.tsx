import { WiringDiagramExplorer } from "@/components/wiring-diagram";
import { Alert } from "@/components/ui";

export const metadata = {
  title: "Wiring Diagrams — Ohm School",
  description: "Interactive UK domestic wiring diagrams with hover-to-inspect conductors and per-scenario knowledge checks."
};

export default function WiringDiagramsPage() {
  return (
    <div className="space-y-8 pb-10">
      <section className="rounded-[1.75rem] border border-slate-900/8 bg-[linear-gradient(135deg,#1e293b,#0f172a)] px-6 py-8 sm:px-8">
        <p className="text-xs uppercase tracking-[0.24em] text-copper-300">Reference & practice</p>
        <h1 className="mt-3 font-display text-5xl leading-none text-white sm:text-6xl">
          Wiring diagrams
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-7 text-slate-300 sm:text-lg">
          Explore common UK domestic circuit layouts. Hover over conductors to identify their role, then test your understanding with a scenario quiz.
        </p>
        <Alert className="mt-6 border-copper-300/40 bg-copper-500/12 text-sand-50">
          These diagrams are for educational reference only. No live work should be carried out based on diagrams alone. Always follow BS 7671 and consult a qualified electrician for installation or fault rectification work.
        </Alert>
      </section>

      <WiringDiagramExplorer />
    </div>
  );
}
