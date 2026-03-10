import { DecisionTree, Fault } from "./types";

/** Initial symptoms that users can select to begin diagnosis */
export const symptoms = [
  "MCB trips under load",
  "RCD trips immediately",
  "RCBO trips on one circuit",
  "Some sockets dead, others live",
  "Whole socket circuit dead",
  "Lights not working on one floor",
  "Lights flicker or dim",
  "Socket or switch feels hot / shows burn marks",
  "Appliance causes trip when plugged in",
  "Two-way switching behaves strangely",
  "Low insulation resistance suspected",
  "Loose connection / overheating suspected",
  "Borrowed neutral suspected",
  "Broken ring final suspected",
  "Damaged cable / exposed cores / unenclosed connection"
].map((title) => ({ title, slug: title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") }));

/**
 * Helper function to create a fault object with standard educational guidance.
 * @param slug - URL-friendly identifier for the fault
 * @param title - Display title of the fault
 * @param severity - Risk level (low, medium, high, urgent)
 * @param tags - Categorization tags for the fault
 * @returns Complete Fault object with standard educational content
 */
const mk = (slug: string, title: string, severity: Fault["severity"], tags: string[]): Fault => ({
  slug,
  title,
  severity,
  tags,
  summary: `Educational triage guidance for ${title.toLowerCase()}.`,
  description: "This scenario explains likely domestic causes in UK installations and helps learners structure a safe fault-finding thought process.",
  dangerNotes: "Potential for shock, burns, fire, or concealed damage if misdiagnosed. Do not remove covers or carry out live testing unless you are qualified.",
  commonSymptoms: ["Protective device tripping", "Local loss of power", "Signs of heat, noise, or odour"],
  likelyCauses: ["Damaged accessory or cable", "Loose or high-resistance connection", "Appliance fault or leakage"],
  safeChecks: ["Identify exactly which protective device has operated", "Unplug portable appliances", "Look for visible heat damage without dismantling"],
  escalationGuidance: "Escalate promptly to a qualified electrician if tripping repeats, overheating signs are present, or wiring integrity is uncertain.",
  electricianTestsNext: ["Safe isolation and prove dead", "Appropriate dead tests/continuity/IR based on circuit type", "Targeted inspection and rectification to BS 7671"],
  educationalExplanation: "Good diagnostics separates symptom from cause. Start broad, isolate variables safely, and escalate when fixed wiring work is needed. These are learning prompts, not DIY electrical instructions."
});

export const faults: Fault[] = [
  mk("mcb-trips-under-load", "MCB trips under load", "high", ["protection devices", "sockets"]),
  mk("rcd-trips-immediately", "RCD trips immediately", "high", ["protection devices", "insulation"]),
  mk("rcbo-trips-one-circuit", "RCBO trips on one circuit", "high", ["protection devices"]),
  mk("partial-socket-failure", "Some sockets dead, others live", "high", ["sockets", "ring final"]),
  mk("whole-socket-circuit-dead", "Whole socket circuit dead", "high", ["sockets", "protection devices"]),
  mk("partial-lighting-failure", "Lights not working on one floor", "medium", ["lighting"]),
  mk("lights-flicker-under-load", "Lights flicker or dim", "medium", ["lighting", "overheating"]),
  mk("hot-socket-or-switch", "Socket or switch feels hot / shows burn marks", "urgent", ["overheating", "sockets"]),
  mk("appliance-causes-trip", "Appliance causes trip when plugged in", "high", ["appliance fault", "protection devices"]),
  mk("two-way-switching-miswire", "Two-way switching behaves strangely", "medium", ["lighting"]),
  mk("low-insulation-resistance", "Low insulation resistance suspected", "high", ["insulation"]),
  mk("loose-connection-high-resistance-joint", "Loose connection / overheating suspected", "urgent", ["overheating"]),
  mk("borrowed-neutral", "Borrowed neutral suspected", "urgent", ["lighting", "protection devices"]),
  mk("broken-ring-final", "Broken ring final suspected", "high", ["ring final", "sockets"]),
  mk("damaged-cable-or-unenclosed-connection", "Damaged cable / exposed cores / unenclosed connection", "urgent", ["insulation", "overheating"])
];

export const decisionTrees: DecisionTree[] = [
  {
    slug: "rcd-trips-immediately",
    title: "RCD trips immediately",
    symptomSlug: "rcd-trips-immediately",
    startNodeKey: "plugged-in",
    nodes: [
      { key: "plugged-in", question: "Does it trip with everything still plugged in?", questionType: "boolean", explanation: "Appliances are a common leakage source.", options: [
        { label: "Yes", value: "yes", nextNodeKey: "reset-after-unplug", faultWeightAdjustments: { "faulty appliance": 2 } },
        { label: "No", value: "no", nextNodeKey: "one-circuit", faultWeightAdjustments: { "earth leakage on final circuit": 2 } }
      ]},
      { key: "reset-after-unplug", question: "Does it reset when all portable appliances are unplugged?", questionType: "boolean", explanation: "If yes, fixed wiring is less likely.", options: [
        { label: "Yes", value: "yes", nextNodeKey: "damage", faultWeightAdjustments: { "faulty appliance": 3 } },
        { label: "No", value: "no", nextNodeKey: "damp", faultWeightAdjustments: { "N-E fault requiring electrician": 3 }, riskBoost: 2 }
      ]},
      { key: "one-circuit", question: "Is only one circuit involved?", questionType: "boolean", explanation: "Single-circuit trips narrow the search area.", options: [
        { label: "Yes", value: "yes", nextNodeKey: "damp", faultWeightAdjustments: { "earth leakage on a final circuit": 3 } },
        { label: "No", value: "no", nextNodeKey: "damp", faultWeightAdjustments: { "N-E fault requiring electrician": 3 }, riskBoost: 2 }
      ]},
      { key: "damp", question: "Has there been damp or moisture recently?", questionType: "boolean", explanation: "Moisture can lower insulation resistance.", options: [
        { label: "Yes", value: "yes", nextNodeKey: "damage", faultWeightAdjustments: { "damp-related leakage": 3 } },
        { label: "No", value: "no", nextNodeKey: "damage" }
      ]},
      { key: "damage", question: "Are there visible signs of cable, flex, or accessory damage?", questionType: "boolean", explanation: "Visible damage is an urgent risk marker.", options: [
        { label: "Yes", value: "yes", faultWeightAdjustments: { "damaged flex/cable": 4 }, urgentTrigger: true },
        { label: "No", value: "no", faultWeightAdjustments: { "N-E fault requiring electrician": 2 } }
      ], safetyGate: true, severity: "high", recommendedAction: "Stop at observational checks and escalate to a qualified electrician for isolation and testing." }
    ]
  },
  {
    slug: "some-sockets-dead-others-live",
    title: "Some sockets dead, others live",
    symptomSlug: "some-sockets-dead-others-live",
    startNodeKey: "adjacent",
    nodes: [
      { key: "adjacent", question: "Are the dead sockets adjacent or in one area?", questionType: "boolean", explanation: "Local clustering suggests a break or local damage.", options: [
        { label: "Yes", value: "yes", nextNodeKey: "sudden", faultWeightAdjustments: { "localised cable damage": 2 } },
        { label: "No", value: "no", nextNodeKey: "sudden", faultWeightAdjustments: { "broken ring final": 2 } }
      ]},
      { key: "sudden", question: "Did this happen suddenly?", questionType: "boolean", explanation: "Sudden failure may indicate a termination failure.", options: [
        { label: "Yes", value: "yes", nextNodeKey: "breaker", faultWeightAdjustments: { "loose terminal": 2 } },
        { label: "No", value: "no", nextNodeKey: "breaker" }
      ]},
      { key: "breaker", question: "Is the breaker still on?", questionType: "boolean", explanation: "If protection remains on, hidden high resistance faults are possible.", options: [
        { label: "Yes", value: "yes", nextNodeKey: "damage", faultWeightAdjustments: { "broken ring final": 2 } },
        { label: "No", value: "no", nextNodeKey: "damage", riskBoost: 1 }
      ]},
      { key: "damage", question: "Are any sockets warm, cracked, or discoloured?", questionType: "boolean", explanation: "Heat damage indicates urgent risk.", options: [
        { label: "Yes", value: "yes", nextNodeKey: "diy", faultWeightAdjustments: { "dangerous overheating issue": 4 }, urgentTrigger: true },
        { label: "No", value: "no", nextNodeKey: "diy", faultWeightAdjustments: { "damaged accessory": 2 } }
      ]},
      { key: "diy", question: "Has recent DIY been done nearby?", questionType: "boolean", explanation: "Recent alterations can disturb continuity or terminations.", options: [
        { label: "Yes", value: "yes", faultWeightAdjustments: { "localised cable damage": 3 } },
        { label: "No", value: "no", faultWeightAdjustments: { "broken ring final": 2, "loose terminal": 1 } }
      ], safetyGate: true, recommendedAction: "Do not remove socket fronts. Escalate for qualified dead testing and ring continuity checks." }
    ]
  },
  {
    slug: "lights-flicker-or-dim",
    title: "Lights flicker or dim",
    symptomSlug: "lights-flicker-or-dim",
    startNodeKey: "one-or-many",
    nodes: [
      { key: "one-or-many", question: "Is it only one fitting or multiple fittings?", questionType: "single_choice", explanation: "Single-point issues differ from circuit-wide issues.", options: [
        { label: "One fitting", value: "one", nextNodeKey: "heavy-load", faultWeightAdjustments: { "failing accessory": 2 } },
        { label: "Multiple", value: "multiple", nextNodeKey: "heavy-load", faultWeightAdjustments: { "shared neutral issue": 2 } }
      ]},
      { key: "heavy-load", question: "Does it worsen when kettle, shower, or another heavy load runs?", questionType: "boolean", explanation: "Load-linked dimming may indicate voltage drop or poor joints.", options: [
        { label: "Yes", value: "yes", nextNodeKey: "burning", faultWeightAdjustments: { "overloaded/poor joint": 3 } },
        { label: "No", value: "no", nextNodeKey: "burning", faultWeightAdjustments: { "failing accessory": 1 } }
      ]},
      { key: "burning", question: "Any buzzing, unusual heat, or smell?", questionType: "boolean", explanation: "Audible/thermal signs raise risk significantly.", options: [
        { label: "Yes", value: "yes", nextNodeKey: "changes", faultWeightAdjustments: { "loose connection": 4 }, urgentTrigger: true },
        { label: "No", value: "no", nextNodeKey: "changes" }
      ]},
      { key: "changes", question: "Any recent lamp replacement or fitting changes?", questionType: "boolean", explanation: "Recent alteration can introduce poor contact or incompatibility.", options: [
        { label: "Yes", value: "yes", nextNodeKey: "switch", faultWeightAdjustments: { "failing accessory": 2 } },
        { label: "No", value: "no", nextNodeKey: "switch", faultWeightAdjustments: { "supply-side issue requiring escalation": 2 } }
      ]},
      { key: "switch", question: "Is the switch also affected?", questionType: "boolean", explanation: "Switch symptoms suggest local accessory/termination issues.", options: [
        { label: "Yes", value: "yes", faultWeightAdjustments: { "loose connection": 2 } },
        { label: "No", value: "no", faultWeightAdjustments: { "shared neutral issue": 2 } }
      ], safetyGate: true, recommendedAction: "Continue only with observation. Any heat/smell or persistent dimming needs a qualified electrician." }
    ]
  },
  {
    slug: "appliance-causes-trip-when-plugged-in",
    title: "Appliance causes trip when plugged in",
    symptomSlug: "appliance-causes-trip-when-plugged-in",
    startNodeKey: "timing",
    nodes: [
      { key: "timing", question: "Does it trip immediately on plug-in or when switched on?", questionType: "single_choice", explanation: "Timing helps separate leakage from load/start faults.", options: [
        { label: "Immediately", value: "immediately", nextNodeKey: "another-socket", faultWeightAdjustments: { "appliance earth leakage": 2 } },
        { label: "When switched on", value: "switched", nextNodeKey: "another-socket", faultWeightAdjustments: { "internal appliance short": 2 } }
      ]},
      { key: "another-socket", question: "Does the same happen on another socket?", questionType: "boolean", explanation: "Repeating across sockets points toward the appliance itself.", options: [
        { label: "Yes", value: "yes", nextNodeKey: "other-appliance", faultWeightAdjustments: { "appliance earth leakage": 3 } },
        { label: "No", value: "no", nextNodeKey: "other-appliance", faultWeightAdjustments: { "socket issue": 2 } }
      ]},
      { key: "other-appliance", question: "Does another appliance work fine in the same socket?", questionType: "boolean", explanation: "Control test narrows fault domain.", options: [
        { label: "Yes", value: "yes", nextNodeKey: "flex", faultWeightAdjustments: { "internal appliance short": 2 } },
        { label: "No", value: "no", nextNodeKey: "flex", faultWeightAdjustments: { "circuit issue": 2 } }
      ]},
      { key: "flex", question: "Any visible flex damage?", questionType: "boolean", explanation: "Damaged flex can expose live parts.", options: [
        { label: "Yes", value: "yes", nextNodeKey: "moisture", faultWeightAdjustments: { "damaged flex": 4 }, urgentTrigger: true },
        { label: "No", value: "no", nextNodeKey: "moisture" }
      ]},
      { key: "moisture", question: "Any moisture exposure?", questionType: "boolean", explanation: "Moisture can create temporary leakage paths.", options: [
        { label: "Yes", value: "yes", faultWeightAdjustments: { "appliance earth leakage": 2 } },
        { label: "No", value: "no", faultWeightAdjustments: { "circuit issue": 1 } }
      ], safetyGate: true, recommendedAction: "Unplug affected appliance and escalate if tripping persists without it." }
    ]
  },
  {
    slug: "socket-or-switch-feels-hot-shows-burn-marks",
    title: "Socket or switch hot / burn marks",
    symptomSlug: "socket-or-switch-feels-hot-shows-burn-marks",
    startNodeKey: "discolouration",
    nodes: [
      { key: "discolouration", question: "Is there discolouration?", questionType: "boolean", explanation: "Discolouration indicates sustained heat.", options: [
        { label: "Yes", value: "yes", nextNodeKey: "burn-smell", faultWeightAdjustments: { "high resistance joint": 3 }, urgentTrigger: true },
        { label: "No", value: "no", nextNodeKey: "burn-smell" }
      ]},
      { key: "burn-smell", question: "Is there any smell of burning?", questionType: "boolean", explanation: "Burning smell is immediate escalation territory.", options: [
        { label: "Yes", value: "yes", nextNodeKey: "heavy-load", faultWeightAdjustments: { "urgent fire risk": 5 }, urgentTrigger: true },
        { label: "No", value: "no", nextNodeKey: "heavy-load" }
      ]},
      { key: "heavy-load", question: "Does it happen under heavy load only?", questionType: "boolean", explanation: "Load dependence suggests poor contact or overloaded point.", options: [
        { label: "Yes", value: "yes", nextNodeKey: "single-multiple", faultWeightAdjustments: { "overloaded accessory": 2 } },
        { label: "No", value: "no", nextNodeKey: "single-multiple", faultWeightAdjustments: { "loose termination": 2 } }
      ]},
      { key: "single-multiple", question: "Is it one accessory or multiple?", questionType: "single_choice", explanation: "Multiple points suggest wider circuit issue.", options: [
        { label: "Single", value: "single", nextNodeKey: "plug", faultWeightAdjustments: { "worn contacts": 2 } },
        { label: "Multiple", value: "multiple", nextNodeKey: "plug", faultWeightAdjustments: { "high resistance joint": 2 }, riskBoost: 2 }
      ]},
      { key: "plug", question: "Does a loose plug fit seem involved?", questionType: "boolean", explanation: "Loose contact increases arcing and heat.", options: [
        { label: "Yes", value: "yes", faultWeightAdjustments: { "worn contacts": 2 } },
        { label: "No", value: "no", faultWeightAdjustments: { "loose termination": 2 } }
      ], safetyGate: true, severity: "urgent", stopReason: "Heat or burn signs require immediate professional intervention.", recommendedAction: "Stop using the point, reduce load if safe, and call a qualified electrician now." }
    ]
  }
];

export const learningArticles = [
  { slug: "rcd-vs-mcb-basics", title: "RCD vs MCB in UK boards", body: "RCDs respond to imbalance (earth leakage). MCBs respond to overcurrent. RCBOs do both for one circuit.", relatedFaultSlugs: ["rcd-trips-immediately", "mcb-trips-under-load"] },
  { slug: "ring-final-principles", title: "Ring final fault logic", body: "A broken ring can leave sockets apparently working but overloaded paths may develop depending on load distribution.", relatedFaultSlugs: ["broken-ring-final", "partial-socket-failure"] }
];
