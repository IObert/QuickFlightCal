import { format } from 'date-fns';
import { ArrowRight } from 'lucide-react';

interface FlightLeg {
  airline: string;
  flightNumber: string;
  departureAirport: string;
  arrivalAirport: string;
  departureTime: Date;
  arrivalTime: Date;
}

export function FlightInfo({ flightLegs }: { flightLegs: FlightLeg[] }) {
  return (
    <div className="space-y-4">
      {flightLegs.map((leg, index) => (
        <div key={index} className="flex items-center justify-between bg-gray-100 p-4 rounded-lg">
          <div className="flex flex-col items-center">
            <span className="text-lg font-bold">{leg.departureAirport}</span>
            <span className="text-sm">{format(leg.departureTime, 'HH:mm')}</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-sm font-semibold">{leg.airline} {leg.flightNumber}</span>
            <ArrowRight className="my-2" />
          </div>
          <div className="flex flex-col items-center">
            <span className="text-lg font-bold">{leg.arrivalAirport}</span>
            <span className="text-sm">{format(leg.arrivalTime, 'HH:mm')}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

