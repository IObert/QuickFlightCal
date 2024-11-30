import { addHours, parse, format } from 'date-fns';

interface FlightLeg {
  airline: string;
  flightNumber: string;
  departureAirport: string;
  arrivalAirport: string;
  departureTime: Date;
  arrivalTime: Date;
}

export function parseFlightInfo(flightNumber: string, date: Date): FlightLeg | null {
  const regex = /^([A-Z]{2,3})(\d{1,4})$/;
  const match = flightNumber.match(regex);

  if (!match) return null;

  const [, airline, number] = match;
  
  // This is a mock implementation. In a real-world scenario, you would use an API to get actual flight information.
  const mockFlightData = {
    departureAirport: 'LAX',
    arrivalAirport: 'JFK',
    departureTime: addHours(date, 10), // Assume flight departs at 10:00 AM
    arrivalTime: addHours(date, 19), // Assume flight arrives at 7:00 PM
  };

  return {
    airline,
    flightNumber,
    ...mockFlightData,
  };
}

