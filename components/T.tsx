import { txt, isTodo } from "@/lib/site";

/** Renders content text. TODOs show as dashed markers in dev and are hidden in production. */
export default function T({ s, className }: { s?: string; className?: string }) {
  const v = txt(s);
  if (!v) return null;
  if (isTodo(v)) return <span className={`todo ${className ?? ""}`}>{v}</span>;
  const parts = v.split(/(\(TODO:[^)]*\))/);
  return (
    <span className={className}>
      {parts.map((p, i) => (p.startsWith("(TODO") ? <span key={i} className="todo ml-1">{p}</span> : p))}
    </span>
  );
}
