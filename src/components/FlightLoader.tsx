import { parseFlightInfo } from "@/utils/flightInfo";
import { FlightInfo } from "./FlightInfo";
import Link from "next/link";

interface FlightLoaderProps {
  flightInput: string;
  flightDate: Date;
}

export async function FlightLoader({
  flightInput,
  flightDate,
}: FlightLoaderProps) {
  const flightInfo = await parseFlightInfo(flightInput, flightDate);

  // @ts-ignore fix for nicer types later
  if (flightInfo?.type === "PARSE_ERROR") {
    return (
      <Link
        // @ts-ignore fix for nicer types later
        href={flightInfo.link || "#"}
        target="_blank"
        rel="noopener noreferrer"
      >
        <div className="bg-red-400 rounded-lg text-center p-4">
          {/* @ts-ignore fix for nicer types later */}
          <span className="text-white">{flightInfo.message}</span>
        </div>
      </Link>
    );
  }

  // @ts-ignore fix for nicer types later
  return <FlightInfo flightLeg={flightInfo} />;
}
