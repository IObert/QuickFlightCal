import { addHours, parse, format, addMinutes } from "date-fns";
import { de } from "date-fns/locale";
import { routes } from "./routes";
import { fetchFlightInfo } from "@/app/actions";

export interface FlightLeg {
  airline: string;
  flightNumber: string;
  number: number;
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

export async function parseFlightInfo(
  flightNumber: string,
  date: Date
): Promise<FlightLeg | ParseError> {
  const regex = /^([A-Z]{2,3})(\d{1,4})$/;

  flightNumber = flightNumber.toUpperCase().replace(/\s/g, "");
  const match = flightNumber.match(regex);

  // convert to same day and month but in UTC independent of timezone
  const UTCDate = new Date(
    Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())
  );

  if (!match)
    return {
      type: "PARSE_ERROR",
      message: `Flight ${flightNumber} not found. Our database is still limited. Please open a issue on Github for your airline / flight number`,
      link: "https://github.com/IObert/QuickFlightCal/issues",
    };

  const [, airline, number] = match;

  try {
    const flighInfo = await fetchFlightInfo(flightNumber);
    return flighInfo;
  } catch (e) {
    return {
      type: "PARSE_ERROR",
      message: `Flight ${flightNumber} not found. Please open a issue on Github.`,
      link: "https://github.com/IObert/QuickFlightCal/issues",
    };
  }

}
