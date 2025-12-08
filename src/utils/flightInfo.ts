import { addHours, parse, format, addMinutes } from "date-fns";
import { de } from "date-fns/locale";
import { routes } from "./routes";

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

export function parseFlightInfo(
  flightNumber: string,
  date: Date
): FlightLeg | ParseError {
  const regex = /^([A-Z]{2,3})(\d{1,4})$/;

  flightNumber = flightNumber.toUpperCase().replace(/\s/g, "");
  const match = flightNumber.match(regex);

  // convert to same day and month but in UTC independent of timezone
  const UTCDate = new Date(
    Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())
  );

  if (!match) return { type: "PARSE_ERROR", message: "Invalid flight number" };

  const [, airline, number] = match;

  const route = routes.find((route) => route.flightNumber === flightNumber);

  if (!route)
    return {
      type: "PARSE_ERROR",
      message: `Flight ${flightNumber} not found. Our database is still limited. Please open a issue on Github for your airline / flight number`,
      link: "https://github.com/IObert/QuickFlightCal/issues",
    };

  const [hours, minutes] = route.departureTime.split(":");
  const departureTime = addHours(
    addMinutes(UTCDate, parseInt(minutes)),
    parseInt(hours)
  );

  const departeOnNextDay = date.getTime() > departureTime.getTime();

  if (departeOnNextDay) {
    departureTime.setDate(departureTime.getDate() + 1);
  }

  const arrivalTime = addMinutes(departureTime, route.duration);

  return {
    airline,
    flightNumber,
    number: parseInt(number),
    departureAirport: route.departureAirport,
    arrivalAirport: route.arrivalAirport,
    departureTime,
    arrivalTime,
    duration: route.duration,
  };
}
