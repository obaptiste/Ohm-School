"use client";

import { useState } from "react";
import { Badge, Button, Card } from "@/components/ui";

type WireColor = "brown" | "blue" | "green-yellow" | "black" | "grey" | "red";

type Wire = {
  id: string;
  color: WireColor;
  label: string;
  from: string;
  to: string;
  description: string;
};

type Component = {
  id: string;
  label: string;
  x: number;
  y: number;
  type: "consumer-unit" | "socket" | "light" | "switch" | "earth-bar" | "appliance";
};

type DiagramScenario = {
  id: string;
  title: string;
  description: string;
  difficulty: "basic" | "intermediate" | "advanced";
  components: Component[];
  wires: Wire[];
  quiz: {
    question: string;
    options: string[];
    correct: number;
    explanation: string;
  };
  safetyNote: string;
};

const wireColors: Record<WireColor, { bg: string; ring: string; label: string }> = {
  brown:       { bg: "bg-amber-700",    ring: "ring-amber-800",    label: "Brown – Line (Live)" },
  blue:        { bg: "bg-blue-600",     ring: "ring-blue-700",     label: "Blue – Neutral" },
  "green-yellow": { bg: "bg-lime-500",  ring: "ring-lime-600",     label: "Green/Yellow – Earth (CPC)" },
  black:       { bg: "bg-slate-900",    ring: "ring-slate-950",    label: "Black – Neutral (old wiring)" },
  grey:        { bg: "bg-slate-400",    ring: "ring-slate-500",    label: "Grey – Neutral (3-phase)" },
  red:         { bg: "bg-red-600",      ring: "ring-red-700",      label: "Red – Line (old wiring)" }
};

const scenarios: DiagramScenario[] = [
  {
    id: "ring-final",
    title: "Ring Final Circuit (Socket)",
    description: "A ring final circuit leaves the consumer unit, visits each socket in sequence, and returns to the same way — creating a ring that provides two independent paths for current.",
    difficulty: "basic",
    components: [
      { id: "cu",  label: "Consumer Unit\n(MCB 32A)", x: 10,  y: 42, type: "consumer-unit" },
      { id: "s1",  label: "Socket 1",                x: 35,  y: 18, type: "socket" },
      { id: "s2",  label: "Socket 2",                x: 60,  y: 18, type: "socket" },
      { id: "s3",  label: "Socket 3",                x: 60,  y: 68, type: "socket" },
      { id: "s4",  label: "Socket 4",                x: 35,  y: 68, type: "socket" }
    ],
    wires: [
      { id: "w1", color: "brown",        label: "L", from: "cu",  to: "s1",  description: "Line from CU to Socket 1" },
      { id: "w2", color: "brown",        label: "L", from: "s1",  to: "s2",  description: "Line continues to Socket 2" },
      { id: "w3", color: "brown",        label: "L", from: "s2",  to: "s3",  description: "Line continues to Socket 3" },
      { id: "w4", color: "brown",        label: "L", from: "s3",  to: "s4",  description: "Line continues to Socket 4" },
      { id: "w5", color: "brown",        label: "L", from: "s4",  to: "cu",  description: "Line returns to CU (ring complete)" },
      { id: "w6", color: "blue",         label: "N", from: "cu",  to: "s1",  description: "Neutral from CU to Socket 1" },
      { id: "w7", color: "blue",         label: "N", from: "s1",  to: "s2",  description: "Neutral continues ring" },
      { id: "w8", color: "blue",         label: "N", from: "s2",  to: "s3",  description: "Neutral continues ring" },
      { id: "w9", color: "blue",         label: "N", from: "s3",  to: "s4",  description: "Neutral continues ring" },
      { id: "w10", color: "blue",        label: "N", from: "s4",  to: "cu",  description: "Neutral returns to CU" },
      { id: "w11", color: "green-yellow",label: "E", from: "cu",  to: "s1",  description: "CPC from CU to Socket 1" },
      { id: "w12", color: "green-yellow",label: "E", from: "s1",  to: "s2",  description: "CPC continues ring" },
      { id: "w13", color: "green-yellow",label: "E", from: "s2",  to: "s3",  description: "CPC continues ring" },
      { id: "w14", color: "green-yellow",label: "E", from: "s3",  to: "s4",  description: "CPC continues ring" },
      { id: "w15", color: "green-yellow",label: "E", from: "s4",  to: "cu",  description: "CPC returns to CU" }
    ],
    quiz: {
      question: "Why does a ring final circuit offer better resilience than a radial circuit?",
      options: [
        "It uses thicker cable throughout",
        "Current can flow from both directions to each socket",
        "It has a higher voltage rating",
        "It does not require an earth conductor"
      ],
      correct: 1,
      explanation: "A ring final provides two current paths to every socket — if one leg develops a fault, current can still reach the socket via the other leg. This also means each leg only carries half the total load current, reducing volt-drop."
    },
    safetyNote: "Never work on a live ring final circuit. Always isolate, lock off, and prove dead at both MCB terminals before any inspection."
  },
  {
    id: "one-way-lighting",
    title: "One-Way Lighting Circuit",
    description: "A simple lighting circuit with one switch controlling one luminaire. Power runs to the switch (switch-line wiring) or to the light first (loop-in method). This diagram shows loop-in at the ceiling rose.",
    difficulty: "basic",
    components: [
      { id: "cu",  label: "Consumer Unit\n(MCB 6A)", x: 8,   y: 48, type: "consumer-unit" },
      { id: "cr",  label: "Ceiling Rose",            x: 45,  y: 20, type: "light" },
      { id: "sw",  label: "Switch",                  x: 45,  y: 78, type: "switch" },
      { id: "lp",  label: "Lamp",                    x: 72,  y: 20, type: "appliance" }
    ],
    wires: [
      { id: "w1", color: "brown",         label: "L",  from: "cu", to: "cr",  description: "Permanent live to ceiling rose" },
      { id: "w2", color: "blue",          label: "N",  from: "cu", to: "cr",  description: "Neutral to ceiling rose" },
      { id: "w3", color: "green-yellow",  label: "E",  from: "cu", to: "cr",  description: "CPC to ceiling rose" },
      { id: "w4", color: "brown",         label: "SW", from: "cr", to: "sw",  description: "Switch-feed (line colour) to switch" },
      { id: "w5", color: "blue",          label: "SW", from: "sw", to: "cr",  description: "Switch-return — must be sleeved brown at both ends" },
      { id: "w6", color: "brown",         label: "L",  from: "cr", to: "lp",  description: "Switched live to lamp" },
      { id: "w7", color: "blue",          label: "N",  from: "cr", to: "lp",  description: "Neutral to lamp" }
    ],
    quiz: {
      question: "A blue conductor runs from the ceiling rose to the switch and back. What colour sleeving must be applied at each end?",
      options: [
        "Green/yellow — it may carry fault current",
        "Brown — to indicate it is a switch-line conductor, not a neutral",
        "Red — old wiring standard still applies here",
        "No sleeving needed if the cable is labelled"
      ],
      correct: 1,
      explanation: "Under BS 7671, a conductor that is not its natural colour must be re-identified. A blue switch-return carries switched line voltage when the switch is closed, so brown sleeving is applied at both ends to show it is a live conductor."
    },
    safetyNote: "The switch-return conductor is live when the switch is ON. Treat all conductors in a switch drop as live until proven dead."
  },
  {
    id: "two-way-switching",
    title: "Two-Way Switching (Staircase)",
    description: "Two-way switching lets one light be controlled from two locations — typical on stairs or long corridors. Three conductors (L1, L2, Common) link the two switch units.",
    difficulty: "intermediate",
    components: [
      { id: "cu",  label: "Consumer Unit\n(MCB 6A)", x: 6,   y: 48, type: "consumer-unit" },
      { id: "sw1", label: "Switch 1\n(bottom)",      x: 30,  y: 22, type: "switch" },
      { id: "sw2", label: "Switch 2\n(top)",          x: 60,  y: 22, type: "switch" },
      { id: "lp",  label: "Lamp",                     x: 85,  y: 48, type: "light" }
    ],
    wires: [
      { id: "w1", color: "brown",         label: "L",   from: "cu",  to: "sw1", description: "Permanent live to common of Switch 1" },
      { id: "w2", color: "blue",          label: "N",   from: "cu",  to: "lp",  description: "Neutral direct to lamp" },
      { id: "w3", color: "green-yellow",  label: "E",   from: "cu",  to: "lp",  description: "CPC to lamp and switches" },
      { id: "w4", color: "brown",         label: "C",   from: "sw1", to: "sw2", description: "Common strap between switches" },
      { id: "w5", color: "black",         label: "L1",  from: "sw1", to: "sw2", description: "Strappers wire L1 (must be sleeved brown)" },
      { id: "w6", color: "grey",          label: "L2",  from: "sw1", to: "sw2", description: "Strappers wire L2 (must be sleeved brown)" },
      { id: "w7", color: "brown",         label: "SW",  from: "sw2", to: "lp",  description: "Switched live from Switch 2 common to lamp" }
    ],
    quiz: {
      question: "In a two-way switching circuit, the grey and black strapper conductors in the 3-core cable — what re-identification is required at terminations?",
      options: [
        "No re-identification needed inside conduit",
        "Brown sleeve on both ends of each strapper — they carry line voltage",
        "Blue sleeve — they share the neutral block",
        "Green/yellow sleeve — they pass through the switch plate earth terminal"
      ],
      correct: 1,
      explanation: "The strapper conductors (L1 and L2) both carry line potential depending on switch positions. BS 7671 Regulation 514.4.2 requires non-blue, non-green-yellow conductors that carry line voltage to be sleeved brown at every termination point."
    },
    safetyNote: "Both switches must be in a known position before testing. With two-way switching, the lamp circuit can be live at the switch plate even when the lamp is off."
  }
];

const difficultyBadge: Record<DiagramScenario["difficulty"], { tone: "success" | "warning" | "danger"; label: string }> = {
  basic:        { tone: "success",  label: "Basic" },
  intermediate: { tone: "warning",  label: "Intermediate" },
  advanced:     { tone: "danger",   label: "Advanced" }
};

const componentIcon: Record<Component["type"], string> = {
  "consumer-unit": "⚡",
  socket:          "🔌",
  light:           "💡",
  switch:          "🔁",
  "earth-bar":     "⏚",
  appliance:       "📦"
};

function WireLegend({ wires }: { wires: Wire[] }) {
  const seen = new Set<WireColor>();
  const unique = wires.filter((w) => {
    if (seen.has(w.color)) return false;
    seen.add(w.color);
    return true;
  });

  return (
    <div className="flex flex-wrap gap-2">
      {unique.map((w) => {
        const c = wireColors[w.color];
        return (
          <span key={w.color} className="flex items-center gap-1.5 rounded-full bg-white px-3 py-1 text-xs font-medium text-slate-700 ring-1 ring-slate-200">
            <span className={`inline-block h-3 w-3 rounded-full ${c.bg} ring-1 ${c.ring}`} />
            {c.label}
          </span>
        );
      })}
    </div>
  );
}

function SchematicView({ scenario }: { scenario: DiagramScenario }) {
  const [hoveredWire, setHoveredWire] = useState<string | null>(null);
  const [hoveredComponent, setHoveredComponent] = useState<string | null>(null);

  const compMap = Object.fromEntries(scenario.components.map((c) => [c.id, c]));

  return (
    <div className="space-y-4">
      {/* SVG diagram */}
      <div className="relative overflow-hidden rounded-[1.4rem] border border-slate-200 bg-[#f8f6f2]">
        <svg viewBox="0 0 100 100" className="w-full" style={{ aspectRatio: "2/1", display: "block" }}>
          {/* Wires */}
          {scenario.wires.map((wire) => {
            const from = compMap[wire.from];
            const to   = compMap[wire.to];
            if (!from || !to) return null;
            const c = wireColors[wire.color];
            const isHovered = hoveredWire === wire.id;
            const strokeColor =
              wire.color === "brown"        ? "#92400e" :
              wire.color === "blue"         ? "#1d4ed8" :
              wire.color === "green-yellow" ? "#4d7c0f" :
              wire.color === "black"        ? "#0f172a" :
              wire.color === "grey"         ? "#94a3b8" :
              wire.color === "red"          ? "#b91c1c" : "#555";

            // slight offset per wire group to avoid exact overlap
            const wireIndex = scenario.wires.indexOf(wire);
            const offset = (wireIndex % 3 - 1) * 0.8;
            const x1 = from.x + 4 + offset;
            const y1 = from.y + 4;
            const x2 = to.x + 4 + offset;
            const y2 = to.y + 4;
            const mx = (x1 + x2) / 2;
            const my = (y1 + y2) / 2;

            return (
              <g key={wire.id}>
                <line
                  x1={x1} y1={y1} x2={x2} y2={y2}
                  stroke={strokeColor}
                  strokeWidth={isHovered ? 1.4 : 0.7}
                  strokeLinecap="round"
                  opacity={hoveredWire && !isHovered ? 0.25 : 1}
                  style={{ cursor: "pointer", transition: "all 0.15s" }}
                  onMouseEnter={() => setHoveredWire(wire.id)}
                  onMouseLeave={() => setHoveredWire(null)}
                />
                <text x={mx} y={my - 1} textAnchor="middle" fontSize="2.4" fill={strokeColor} fontWeight="600" opacity={isHovered ? 1 : 0.55}>
                  {wire.label}
                </text>
              </g>
            );
          })}

          {/* Components */}
          {scenario.components.map((comp) => {
            const isHovered = hoveredComponent === comp.id;
            return (
              <g
                key={comp.id}
                onMouseEnter={() => setHoveredComponent(comp.id)}
                onMouseLeave={() => setHoveredComponent(null)}
                style={{ cursor: "pointer" }}
              >
                <rect
                  x={comp.x} y={comp.y}
                  width={18} height={12}
                  rx={2}
                  fill={isHovered ? "#fff7ec" : "#ffffff"}
                  stroke={isHovered ? "#c57c3d" : "#cbd5e1"}
                  strokeWidth={isHovered ? 0.8 : 0.5}
                  style={{ transition: "all 0.15s" }}
                />
                <text x={comp.x + 9} y={comp.y + 5} textAnchor="middle" fontSize="3.5" fill="#1e293b">
                  {componentIcon[comp.type]}
                </text>
                {comp.label.split("\n").map((line, i) => (
                  <text key={i} x={comp.x + 9} y={comp.y + 9.5 + i * 3.2} textAnchor="middle" fontSize="1.9" fill="#475569" fontWeight={i === 0 ? "600" : "400"}>
                    {line}
                  </text>
                ))}
              </g>
            );
          })}
        </svg>
      </div>

      {/* Hover tooltip */}
      <div className="min-h-[3rem] rounded-[1.2rem] border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700">
        {hoveredWire ? (
          <span>
            <span className={`mr-2 inline-block h-3 w-3 rounded-full ring-1 ${wireColors[scenario.wires.find(w => w.id === hoveredWire)!.color].bg} ${wireColors[scenario.wires.find(w => w.id === hoveredWire)!.color].ring}`} />
            {scenario.wires.find(w => w.id === hoveredWire)?.description}
          </span>
        ) : hoveredComponent ? (
          <span className="font-medium text-slate-900">
            {componentIcon[scenario.components.find(c => c.id === hoveredComponent)!.type]}{" "}
            {scenario.components.find(c => c.id === hoveredComponent)!.label.replace("\n", " — ")}
          </span>
        ) : (
          <span className="text-slate-400 italic">Hover over a wire or component to see details</span>
        )}
      </div>

      <WireLegend wires={scenario.wires} />
    </div>
  );
}

function QuizPanel({ quiz }: { quiz: DiagramScenario["quiz"] }) {
  const [selected, setSelected] = useState<number | null>(null);
  const answered = selected !== null;

  return (
    <div className="space-y-4">
      <p className="font-semibold text-slate-950">{quiz.question}</p>
      <div className="space-y-2">
        {quiz.options.map((opt, i) => {
          let cls = "rounded-[1.2rem] border p-4 text-sm transition cursor-pointer ";
          if (!answered) {
            cls += "border-slate-200 bg-white hover:border-copper-400 hover:bg-[#fff7ef]";
          } else if (i === quiz.correct) {
            cls += "border-emerald-400 bg-emerald-50 text-emerald-900";
          } else if (i === selected) {
            cls += "border-red-300 bg-red-50 text-red-900";
          } else {
            cls += "border-slate-200 bg-white opacity-50";
          }

          return (
            <button
              key={i}
              className={cls + " w-full text-left"}
              onClick={() => !answered && setSelected(i)}
              disabled={answered}
            >
              <span className="mr-2 font-semibold text-copper-700">{String.fromCharCode(65 + i)}.</span>
              {opt}
            </button>
          );
        })}
      </div>

      {answered && (
        <div className={`rounded-[1.2rem] border p-4 text-sm leading-6 ${selected === quiz.correct ? "border-emerald-300 bg-emerald-50 text-emerald-900" : "border-amber-300 bg-amber-50 text-amber-950"}`}>
          <p className="font-semibold mb-1">{selected === quiz.correct ? "Correct!" : "Not quite — here's why:"}</p>
          {quiz.explanation}
        </div>
      )}

      {answered && (
        <Button variant="ghost" onClick={() => setSelected(null)}>Reset question</Button>
      )}
    </div>
  );
}

export function WiringDiagramExplorer() {
  const [activeId, setActiveId] = useState<string>(scenarios[0].id);
  const [tab, setTab] = useState<"diagram" | "quiz">("diagram");

  const scenario = scenarios.find((s) => s.id === activeId)!;
  const diff = difficultyBadge[scenario.difficulty];

  return (
    <div className="space-y-6">
      {/* Scenario selector */}
      <div className="grid gap-3 sm:grid-cols-3">
        {scenarios.map((s) => {
          const d = difficultyBadge[s.difficulty];
          const isActive = s.id === activeId;
          return (
            <button
              key={s.id}
              onClick={() => { setActiveId(s.id); setTab("diagram"); }}
              className={`rounded-[1.5rem] border p-4 text-left transition duration-200 ${isActive ? "border-copper-400 bg-[#fff7ef] shadow-[0_8px_24px_rgba(165,82,34,0.12)]" : "border-slate-200 bg-white hover:border-copper-300 hover:bg-[#fffcf8]"}`}
            >
              <Badge tone={d.tone}>{d.label}</Badge>
              <p className={`mt-2 text-sm font-semibold leading-5 ${isActive ? "text-copper-900" : "text-slate-950"}`}>{s.title}</p>
            </button>
          );
        })}
      </div>

      {/* Main panel */}
      <Card className="space-y-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <Badge tone={diff.tone}>{diff.label}</Badge>
              <p className="text-xs uppercase tracking-[0.22em] text-copper-700">Wiring diagram</p>
            </div>
            <h2 className="mt-2 font-display text-3xl text-slate-950">{scenario.title}</h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-700">{scenario.description}</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 border-b border-slate-200 pb-px">
          {(["diagram", "quiz"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`rounded-t-lg px-4 py-2 text-sm font-semibold transition ${tab === t ? "border-b-2 border-copper-500 text-copper-800" : "text-slate-500 hover:text-slate-800"}`}
            >
              {t === "diagram" ? "Interactive diagram" : "Test your knowledge"}
            </button>
          ))}
        </div>

        {tab === "diagram" ? (
          <SchematicView scenario={scenario} key={scenario.id} />
        ) : (
          <QuizPanel quiz={scenario.quiz} key={scenario.id} />
        )}

        {/* Safety note */}
        <div className="rounded-[1.2rem] border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-6 text-amber-950">
          <span className="mr-1.5 font-semibold">Safety reminder:</span>
          {scenario.safetyNote}
        </div>
      </Card>
    </div>
  );
}
