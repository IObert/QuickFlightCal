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
    flightNumber: "LH458",
    number: 458,
    departureAirport: "MUC",
    departureTime: "14:50",
    arrivalAirport: "SFO",
    arrivalTime: "18:45",
    duration: 1200,
  },

  {
    airline: "LH",
    flightNumber: "LH459",
    number: 459,
    departureAirport: "SFO",
    departureTime: "03:50",
    arrivalAirport: "MUC",
    arrivalTime: "15:45",
    duration: 1200,
  },

  {
    airline: "LH",
    flightNumber: "LH907",
    number: 907,
    departureAirport: "LHR",
    departureTime: "13:30",
    arrivalAirport: "FRA",
    arrivalTime: "15:05",
    duration: 95,
  },

  {
    airline: "LH",
    flightNumber: "LH2230",
    number: 2230,
    departureAirport: "MUC",
    departureTime: "11:20",
    arrivalAirport: "CDG",
    arrivalTime: "12:50",
    duration: 90,
  },

  {
    airline: "LH",
    flightNumber: "LH2231",
    number: 2231,
    departureAirport: "CDG",
    departureTime: "13:30",
    arrivalAirport: "MUC",
    arrivalTime: "15:00",
    duration: 90,
  },

  {
    airline: "LH",
    flightNumber: "LH2303",
    number: 2303,
    departureAirport: "AMS",
    departureTime: "10:00",
    arrivalAirport: "MUC",
    arrivalTime: "11:20",
    duration: 80,
  },
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
    flightNumber: "LH2305",
    number: 2305,
    departureAirport: "AMS",
    departureTime: "12:45",
    arrivalAirport: "MUC",
    arrivalTime: "14:05",
    duration: 80,
  },
  {
    airline: "LH",
    flightNumber: "LH2306",
    number: 2306,
    departureAirport: "MUC",
    departureTime: "14:10",
    arrivalAirport: "AMS",
    arrivalTime: "15:50",
    duration: 100,
  },
  {
    airline: "LH",
    flightNumber: "LH2472",
    number: 2472,
    departureAirport: "MUC",
    departureTime: "08:20",
    arrivalAirport: "LHR",
    arrivalTime: "10:25",
    duration: 125,
  },
  {
    airline: "LH",
    flightNumber: "LH2474",
    number: 2474,
    departureAirport: "MUC",
    departureTime: "10:55",
    arrivalAirport: "LHR",
    arrivalTime: "13:00",
    duration: 125,
  },
  {
    airline: "LH",
    flightNumber: "LH2475",
    number: 2475,
    departureAirport: "LHR",
    departureTime: "13:50",
    arrivalAirport: "MUC",
    arrivalTime: "15:40",
    duration: 110,
  },

  {
    airline: "LH",
    flightNumber: "LH2477",
    number: 2477,
    departureAirport: "LHR",
    departureTime: "16:40",
    arrivalAirport: "MUC",
    arrivalTime: "18:30",
    duration: 110,
  },

  {
    airline: "LH",
    flightNumber: "LH2517",
    number: 2517,
    departureAirport: "DUB",
    departureTime: "10:45",
    arrivalAirport: "MUC",
    arrivalTime: "13:00",
    duration: 135,
  },
  {
    airline: "LH",
    flightNumber: "LH2518",
    number: 2518,
    departureAirport: "MUC",
    departureTime: "14:40",
    arrivalAirport: "DUB",
    arrivalTime: "17:15",
    duration: 155,
  },

  {
    airline: "LH",
    flightNumber: "LH9403",
    number: 9403,
    departureAirport: "MUC",
    departureTime: "12:30",
    arrivalAirport: "SFO",
    arrivalTime: "22:30",
    duration: 1200,
  },

  {
    airline: "LH",
    flightNumber: "LH7996",
    number: 7996,
    departureAirport: "SFO",
    departureTime: "21:00",
    arrivalAirport: "MUC",
    arrivalTime: "09:00",
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
