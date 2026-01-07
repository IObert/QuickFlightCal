"use client";

import { useEffect, useState } from "react";
import { parseFlightInfo, FlightLeg } from "@/utils/flightInfo";
import { FlightInfo } from "./FlightInfo";
import { Skeleton } from "./ui/skeleton";
import Link from "next/link";

interface ParseError {
  type: "PARSE_ERROR";
  message: string;
  link?: string;
}

interface FlightLoaderProps {
  flightInput: string;
  flightDate: Date;
}

export function FlightLoader({ flightInput, flightDate }: FlightLoaderProps) {
  const [loading, setLoading] = useState(true);
  const [flightInfo, setFlightInfo] = useState<FlightLeg | ParseError | null>(
    null
  );

  useEffect(() => {
    const loadFlight = async () => {
      setLoading(true);
      try {
        const info = await parseFlightInfo(flightInput, flightDate);
        setFlightInfo(info);
      } catch (error) {
        setFlightInfo({
          type: "PARSE_ERROR",
          message: "Failed to load flight information",
        });
      } finally {
        setLoading(false);
      }
    };

    loadFlight();
  }, [flightInput, flightDate]);

  if (loading) {
    return (
      <div className="flex items-center justify-between bg-gray-200 p-4 rounded-lg">
        <div className="flex flex-col items-center gap-2">
          <Skeleton className="h-8 w-16" />
          <Skeleton className="h-4 w-12" />
          <Skeleton className="h-3 w-8" />
        </div>
        <div className="flex flex-col items-center gap-2">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-6 w-6 rounded-full" />
        </div>
        <div className="flex flex-col items-center gap-2">
          <Skeleton className="h-8 w-16" />
          <Skeleton className="h-4 w-12" />
          <Skeleton className="h-3 w-8" />
        </div>
      </div>
    );
  }

  if (!flightInfo) {
    return null;
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
