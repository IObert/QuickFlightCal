export interface FlightLeg {
  airline: string;
  flightNumber: string;
  departureAirport: string;
  arrivalAirport: string;
  departureTime: Date;
  duration: number; // in minutes
  arrivalTime: Date;
  // dayChange?: number;
}

interface ParseError {
  type: "PARSE_ERROR";
  message: string;
  link?: string;
}
