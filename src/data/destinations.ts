import vietnam from "@/assets/dest-vietnam.jpg";
import thailand from "@/assets/dest-thailand.jpg";
import bali from "@/assets/dest-bali.jpg";
import tokyo from "@/assets/dest-tokyo.jpg";
import paris from "@/assets/dest-paris.jpg";
import istanbul from "@/assets/dest-istanbul.jpg";
import alps from "@/assets/dest-alps.jpg";
import type { CollectionKey, Destination } from "@/types";

export const destinations: Destination[] = [
  {
    id: "vietnam",
    city: "Hanoi & Ha Long",
    country: "Vietnam",
    region: "Asia",
    image: vietnam,
    match: 96,
    budget: 92000,
    durationDays: [8, 12],
    bestSeason: "Autumn",
    tags: ["Adventure", "Food", "Budget", "Nature"],
    blurb:
      "Perfect for your budget, food preferences and adventure level. Street food, karst bays and slow river towns.",
    collections: ["trending", "best-value", "adventure"],
  },
  {
    id: "thailand",
    city: "Bangkok & Krabi",
    country: "Thailand",
    region: "Asia",
    image: thailand,
    match: 92,
    budget: 105000,
    durationDays: [7, 11],
    bestSeason: "Winter",
    tags: ["Beach", "Nightlife", "Food", "Budget"],
    blurb:
      "Island hopping paired with a world-class food capital and effortless internal flights.",
    collections: ["trending", "best-value"],
  },
  {
    id: "bali",
    city: "Ubud & Uluwatu",
    country: "Indonesia",
    region: "Asia",
    image: bali,
    match: 89,
    budget: 118000,
    durationDays: [7, 10],
    bestSeason: "Year-round",
    tags: ["Beach", "Nature", "Food"],
    blurb:
      "Rice terraces at sunrise, surf breaks at sunset, and long stays that stretch your budget.",
    collections: ["trending", "hidden-gems"],
  },
  {
    id: "tokyo",
    city: "Tokyo & Kyoto",
    country: "Japan",
    region: "Asia",
    image: tokyo,
    match: 87,
    budget: 215000,
    durationDays: [9, 14],
    bestSeason: "Spring",
    tags: ["Culture", "Food", "Nightlife", "Luxury"],
    blurb:
      "The most efficient country on earth for dense itineraries — rail-perfect and endlessly layered.",
    collections: ["trending", "luxury"],
  },
  {
    id: "istanbul",
    city: "Istanbul",
    country: "Türkiye",
    region: "Middle East",
    image: istanbul,
    match: 84,
    budget: 128000,
    durationDays: [5, 8],
    bestSeason: "Autumn",
    tags: ["Culture", "Food", "Budget"],
    blurb:
      "Two continents, one city — and the best layover city in the world if you route through IST.",
    collections: ["best-value", "hidden-gems"],
  },
  {
    id: "paris",
    city: "Paris",
    country: "France",
    region: "Europe",
    image: paris,
    match: 81,
    budget: 195000,
    durationDays: [6, 12],
    bestSeason: "Spring",
    tags: ["Culture", "Food", "Luxury"],
    blurb:
      "Museums, markets and rooftop evenings — with rail links that make a multi-city Europe trip simple.",
    collections: ["trending", "luxury"],
  },
  {
    id: "alps",
    city: "Swiss Alps",
    country: "Switzerland",
    region: "Europe",
    image: alps,
    match: 78,
    budget: 268000,
    durationDays: [6, 10],
    bestSeason: "Winter",
    tags: ["Nature", "Adventure", "Luxury"],
    blurb:
      "Alpine rail, glacier viewpoints and quiet valley villages. Premium, but unforgettable.",
    collections: ["adventure", "luxury"],
  },
];

export const collections: { key: CollectionKey; label: string; note: string }[] =
  [
    { key: "trending", label: "Trending Now", note: "Rising searches this week" },
    { key: "best-value", label: "Best Value", note: "Most journey per rupee" },
    { key: "adventure", label: "Adventure", note: "High-effort, high-reward" },
    { key: "luxury", label: "Luxury", note: "Slow, refined, considered" },
    { key: "hidden-gems", label: "Hidden Gems", note: "Low crowd, high signal" },
  ];

export const regions = [
  "Asia",
  "Europe",
  "Middle East",
  "Americas",
  "Africa",
  "Oceania",
] as const;

export const travelStyles = [
  "Adventure",
  "Culture",
  "Beach",
  "Nature",
  "Food",
  "Nightlife",
  "Luxury",
  "Budget",
] as const;

export const seasons = [
  "Year-round",
  "Spring",
  "Summer",
  "Autumn",
  "Winter",
] as const;

export const destinationImages = {
  vietnam,
  thailand,
  bali,
  tokyo,
  paris,
  istanbul,
  alps,
};
