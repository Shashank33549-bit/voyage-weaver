export type Region =
  | "Asia"
  | "Europe"
  | "Middle East"
  | "Africa"
  | "Americas"
  | "Oceania";

export type TravelStyle =
  | "Adventure"
  | "Culture"
  | "Beach"
  | "Nature"
  | "Food"
  | "Nightlife"
  | "Luxury"
  | "Budget";

export type Season = "Year-round" | "Spring" | "Summer" | "Autumn" | "Winter";

export interface Destination {
  id: string;
  city: string;
  country: string;
  region: Region;
  image: string;
  match: number;
  budget: number;
  durationDays: [number, number];
  bestSeason: Season;
  tags: TravelStyle[];
  blurb: string;
  collections: CollectionKey[];
}

export type CollectionKey =
  | "trending"
  | "best-value"
  | "adventure"
  | "luxury"
  | "hidden-gems";

export type ActivityCategory =
  | "Food"
  | "Culture"
  | "Nature"
  | "Shopping"
  | "Transit"
  | "Nightlife"
  | "Rest";

export interface Activity {
  id: string;
  time: string;
  title: string;
  detail: string;
  cost: number;
  travelMinutes: number;
  transport: string;
  category: ActivityCategory;
}

export interface ItineraryDay {
  id: string;
  day: number;
  city: string;
  headline: string;
  activities: Activity[];
}

export type TripStatus = "upcoming" | "past" | "draft";

export interface Trip {
  id: string;
  title: string;
  country: string;
  image: string;
  dates: string;
  durationDays: number;
  travellers: number;
  budget: number;
  health: number;
  readiness: number;
  status: TripStatus;
}

export interface BudgetCategory {
  key: string;
  label: string;
  amount: number;
  color: string;
}

export type CheckState = "complete" | "pending" | "missing";

export interface ReadinessItem {
  id: string;
  label: string;
  state: CheckState;
  note: string;
}

export type HealthSeverity = "pass" | "warn" | "fail";

export interface HealthSignal {
  id: string;
  label: string;
  severity: HealthSeverity;
  detail: string;
}
