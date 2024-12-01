import { FlightLeg } from "@/utils/flightInfo";
import { addMinutes, format } from "date-fns";
import { ArrowRight } from "lucide-react";

export function FlightInfo({ flightLegs }: { flightLegs: FlightLeg[] }) {
  const arrivalTime = addMinutes(
    flightLegs[0].departureTime,
    flightLegs[0].duration
  );

  return (
    <div className="space-y-4">
      {flightLegs.map((leg, index) => (
        <div
          key={index}
          className="flex items-center justify-between bg-gray-100 p-4 rounded-lg"
        >
          <div className="flex flex-col items-center">
            <span className="text-2xl font-bold">{leg.departureAirport}</span>
            <span className="text-sm">
              {format(leg.departureTime, "HH:mm z")}
            </span>
            {format(leg.departureTime, "eee") !==
              format(arrivalTime, "eee") && (
              <span className="text-xs">
                {format(leg.departureTime, "eee")}
              </span>
            )}
          </div>
          <div className="flex flex-col items-center">
            <span className="text-sm font-semibold">
              {leg.airline} {leg.number}
            </span>
            <ArrowRight className="my-2" />
          </div>
          <div className="flex flex-col items-center">
            <span className="text-2xl font-bold">{leg.arrivalAirport}</span>
            <span className="text-sm">{format(arrivalTime, "HH:mm z")}</span>
            {format(leg.departureTime, "eee") !==
              format(arrivalTime, "eee") && (
              <span className="text-xs">{format(arrivalTime, "eee")}</span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
