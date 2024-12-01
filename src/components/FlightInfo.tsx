import { FlightLeg } from "@/utils/flightInfo";
import { addMinutes, format } from "date-fns";
import { ArrowRight } from "lucide-react";

export function FlightInfo({ flightLeg }: { flightLeg: FlightLeg }) {
  const arrivalTime = addMinutes(flightLeg.departureTime, flightLeg.duration);

  return (
    <div className="flex items-center justify-between bg-gray-200 p-4 rounded-lg">
      <div className="flex flex-col items-center">
        <span className="text-2xl font-bold">{flightLeg.departureAirport}</span>
        <span className="text-sm">
          {format(flightLeg.departureTime, "HH:mm z")}
        </span>
        <span className="text-xs">
          {format(flightLeg.departureTime, "eee")}
        </span>
      </div>
      <div className="flex flex-col items-center">
        <span className="text-sm font-semibold">
          {flightLeg.airline} {flightLeg.number}
        </span>
        <ArrowRight className="my-2" />
      </div>
      <div className="flex flex-col items-center">
        <span className="text-2xl font-bold">{flightLeg.arrivalAirport}</span>
        <span className="text-sm">{format(arrivalTime, "HH:mm z")}</span>
        <span className="text-xs">{format(arrivalTime, "eee")}</span>
      </div>
    </div>
  );
}
