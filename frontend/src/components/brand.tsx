import { Link } from "react-router-dom";

export function Logo({ className = "" }: { className?: string }) {
  return (
    <Link to="/" className={`flex items-center gap-2 ${className}`}>
      <span className="grid h-7 w-7 place-items-center rounded-md bg-primary text-primary-foreground">
        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 7h16" />
          <path d="M4 12h10" />
          <path d="M4 17h16" />
          <path d="M18 9l3 3-3 3" />
        </svg>
      </span>
      <span className="text-base font-semibold tracking-tight">ZawariFlow</span>
    </Link>
  );
}
