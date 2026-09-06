import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHeader } from "@/components/layout/PageHeader";
import { Reveal } from "@/components/animations/interactive";
import { MatchmakerPanel } from "@/components/voyage/MatchmakerPanel";
import { DestinationCarousel } from "@/components/voyage/DestinationCarousel";
import { VButton } from "@/components/voyage/primitives";
import { destinations } from "@/data/destinations";

const title = "Destination Matchmaker — VoyageAI";
const description =
  "Set six travel preferences and watch VoyageAI re-rank destinations in real time, with match scores, budgets and reasons.";

export const Route = createFileRoute("/matchmaker")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
    ],
  }),
  component: MatchmakerPage,
});

function MatchmakerPage() {
  return (
    <>
      <PageHeader
        eyebrow="Matchmaker"
        title="Not sure where to go? Describe how you travel."
        description="No quizzes, no personality types. Six sliders, and a ranked world that responds as you move them."
      >
        <div className="mt-8 flex flex-wrap gap-3">
          <Link to="/planner">
            <VButton magnetic>Turn a match into an itinerary</VButton>
          </Link>
          <Link to="/discover">
            <VButton variant="glass">Browse destinations instead</VButton>
          </Link>
        </div>
      </PageHeader>

      <section className="px-4 pb-16 sm:px-6">
        <div className="mx-auto max-w-7xl">
          <MatchmakerPanel />
        </div>
      </section>

      <section className="px-4 pb-16 sm:px-6">
        <div className="mx-auto max-w-7xl">
          <Reveal>
            <h2 className="text-2xl font-semibold">Alternatives worth a look</h2>
            <p className="mt-2 max-w-xl text-sm text-muted-foreground">
              Close matches that trade one preference for another — often the better
              trip.
            </p>
          </Reveal>
          <DestinationCarousel
            className="mt-8"
            items={destinations}
            label="Alternative destinations"
          />
        </div>
      </section>
    </>
  );
}
