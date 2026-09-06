import { Link } from "@tanstack/react-router";
import { Plane } from "lucide-react";
import { Divider } from "@/components/voyage/primitives";

const groups = [
  {
    title: "Plan",
    links: [
      { label: "Discover", to: "/discover" as const },
      { label: "AI Planner", to: "/planner" as const },
      { label: "Matchmaker", to: "/matchmaker" as const },
      { label: "Budget", to: "/budget" as const },
    ],
  },
  {
    title: "Intelligence",
    links: [
      { label: "Layover", to: "/layover" as const },
      { label: "Visa", to: "/visa" as const },
      { label: "My Trips", to: "/trips" as const },
      { label: "Trip dashboard", to: "/trips" as const },
    ],
  },
  {
    title: "You",
    links: [
      { label: "Profile", to: "/profile" as const },
      { label: "Home", to: "/" as const },
    ],
  },
];

export function Footer() {
  return (
    <footer className="relative mt-24 px-4 pb-10 sm:px-6">
      <div className="mx-auto max-w-7xl">
        <Divider />
        <div className="grid gap-10 py-14 md:grid-cols-[1.4fr_repeat(3,1fr)]">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="grid size-9 place-items-center rounded-full bg-primary/18 text-cyan">
                <Plane className="size-4" aria-hidden />
              </span>
              <span className="font-display text-sm font-bold tracking-[0.2em]">
                VOYAGE<span className="text-cyan">AI</span>
              </span>
            </div>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted-foreground">
              An operating system for travellers. Destinations, itineraries,
              layovers, visas and budgets in one continuous journey.
            </p>
          </div>
          {groups.map((group) => (
            <nav key={group.title} aria-label={group.title}>
              <h3 className="text-xs font-semibold tracking-[0.18em] text-foreground uppercase">
                {group.title}
              </h3>
              <ul className="mt-4 space-y-2.5">
                {group.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.to}
                      className="text-sm text-muted-foreground transition-colors hover:text-cyan"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>
        <Divider />
        <div className="flex flex-col gap-3 pt-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} VoyageAI. Demo experience with sample data.</p>
          <p>
            Travel requirements can change. Always verify with official government
            or embassy sources before travelling.
          </p>
        </div>
      </div>
    </footer>
  );
}
