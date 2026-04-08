import { buildClaudePlanDocument } from "@/lib/claude-plan";

export default function ClaudeReferencePage() {
  return (
    <iframe
      srcDoc={buildClaudePlanDocument()}
      title="Claude Fitness Plan HTML Reference"
      className="h-screen w-full border-0 bg-white"
      sandbox="allow-same-origin allow-scripts"
    />
  );
}
