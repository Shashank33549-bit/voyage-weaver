import { createFileRoute } from "@tanstack/react-router";
import { Hero } from "@/components/sections/Hero";
import {
  BudgetSection,
  CommandCenter,
  FinalCta,
  ItinerarySection,
  LayoverStory,
  MatchmakerSection,
  RealitySection,
} from "@/components/sections/home";

const title = "VoyageAI — Your Journey Begins Before You Leave";
const description =
  "VoyageAI is an operating system for travellers: destinations, AI itineraries, layover intelligence, visa checks, budgets and trip readiness in one journey.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <>
      <Hero />
      <CommandCenter />
      <LayoverStory />
      <MatchmakerSection />
      <ItinerarySection />
      <BudgetSection />
      <RealitySection />
      <FinalCta />
    </>
  );
}
