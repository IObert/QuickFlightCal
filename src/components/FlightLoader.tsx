"use client";

import { type FlightLeg } from "@/utils/flightInfo";
import { FlightInfo } from "./FlightInfo";
import { FlightSkeleton } from "./FlightSkeleton";
import Link from "next/link";
import { useEffect, useState } from "react";
import { fetchFlightInfo } from "@/app/actions";

interface FlightLoaderProps {
  flightInput: string;
  flightDate: Date;
}

type FlightData = FlightLeg | { type: "PARSE_ERROR"; message: string; link?: string } | null;

export function FlightLoader({
  flightInput,
  flightDate,
}: FlightLoaderProps) {
  const [flightInfo, setFlightInfo] = useState<FlightData>(null);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    let cancelled = false;

    async function fetchData() {
      setLoading(true);
      console.log("Rendering flight info for:", flightInput, "on date:", flightDate);

      fetchFlightInfo(flightInput, flightDate).then((data) => {
        if (!cancelled) {
          setFlightInfo(data);
          setLoading(false);
        }
      }).catch((error) => {
        if (!cancelled) {
          setFlightInfo({ type: "PARSE_ERROR", message: error.message });
          setLoading(false);
        }
      });
      
    }

    fetchData();

    return () => {
      cancelled = true;
    };
  }, [flightInput, flightDate]);

  if (loading) {
    return <FlightSkeleton />;
  }

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
