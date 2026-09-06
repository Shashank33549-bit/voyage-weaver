export interface GlobeDestination {
  code: string;
  country: string;
  city: string;
  airport: string;
  lat: number;
  lon: number;
}

/** Selectable destination countries plotted on the globe. */
export const GLOBE_DESTINATIONS: GlobeDestination[] = [
  { code: "JP", country: "Japan", city: "Tokyo", airport: "HND", lat: 35.6, lon: 139.7 },
  { code: "TR", country: "Türkiye", city: "Istanbul", airport: "IST", lat: 41.0, lon: 28.9 },
  { code: "AE", country: "UAE", city: "Dubai", airport: "DXB", lat: 25.2, lon: 55.3 },
  { code: "SG", country: "Singapore", city: "Singapore", airport: "SIN", lat: 1.35, lon: 103.8 },
  { code: "ID", country: "Indonesia", city: "Bali", airport: "DPS", lat: -8.4, lon: 115.2 },
  { code: "FR", country: "France", city: "Paris", airport: "CDG", lat: 48.85, lon: 2.35 },
  { code: "IT", country: "Italy", city: "Rome", airport: "FCO", lat: 41.9, lon: 12.5 },
  { code: "IS", country: "Iceland", city: "Reykjavík", airport: "KEF", lat: 64.1, lon: -21.9 },
  { code: "US", country: "United States", city: "New York", airport: "JFK", lat: 40.7, lon: -74.0 },
  { code: "PE", country: "Peru", city: "Cusco", airport: "CUZ", lat: -13.5, lon: -71.9 },
  { code: "ZA", country: "South Africa", city: "Cape Town", airport: "CPT", lat: -33.9, lon: 18.4 },
  { code: "AU", country: "Australia", city: "Sydney", airport: "SYD", lat: -33.9, lon: 151.2 },
  { code: "TH", country: "Thailand", city: "Bangkok", airport: "BKK", lat: 13.8, lon: 100.5 },
  { code: "NP", country: "Nepal", city: "Kathmandu", airport: "KTM", lat: 27.7, lon: 85.3 },
];

/** Home airport every planned route departs from. */
export const GLOBE_ORIGIN = {
  code: "IN",
  country: "India",
  city: "Delhi",
  airport: "DEL",
  lat: 28.6,
  lon: 77.2,
};
