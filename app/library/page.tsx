import { LibraryExplorer } from "@/components/library-explorer";
import { faults } from "@/lib/content";

export default function LibraryPage() {
  return <LibraryExplorer faults={faults} />;
}
