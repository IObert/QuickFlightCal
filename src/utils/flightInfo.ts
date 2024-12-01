import { addHours, parse, format, addMinutes } from "date-fns";
import { de } from "date-fns/locale";

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

const routes = [
  {
    airline: "LH",
    flightNumber: "LH2304",
    number: 2304,
    departureAirport: "MUC",
    departureTime: "10:20",
    arrivalAirport: "AMS",
    arrivalTime: "12:00",
    duration: 100,
  },
  {
    airline: "LH",
    flightNumber: "LH2303",
    number: 2305,
    departureAirport: "AMS",
    departureTime: "12:45",
    arrivalAirport: "MUC",
    arrivalTime: "14:05",
    duration: 80,
  },
  {
    airline: "LH",
    flightNumber: "LH458",
    number: 458,
    departureAirport: "MUC",
    departureTime: "14:50",
    arrivalAirport: "SFO",
    arrivalTime: "18:45",
    duration: 1200,
  },
];

interface ParseError {
  type: "PARSE_ERROR";
  message: string;
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
    return { type: "PARSE_ERROR", message: `Flight ${flightNumber} not found` };

  const [hours, minutes] = route.departureTime.split(":");
  const departureTime = addHours(
    addMinutes(UTCDate, parseInt(minutes)),
    parseInt(hours)
  );

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
