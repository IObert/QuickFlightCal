"use client";

import { type FlightLeg } from "@/utils/flightInfo";
import { FlightInfo } from "./FlightInfo";
import { FlightSkeleton } from "./FlightSkeleton";
import { useEffect, useState } from "react";

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

      try {
        const params = new URLSearchParams({
          flightNumber: flightInput,
          date: flightDate.toISOString(),
        });

        const response = await fetch(`/api/flight-info?${params.toString()}`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Failed to fetch flight info');
        }

        if (!cancelled) {
          // Convert ISO strings back to Date objects
          const flightData: FlightLeg = {
            ...data,
            departureTime: new Date(data.departureTime),
            arrivalTime: new Date(data.arrivalTime),
          };
          setFlightInfo(flightData);
          setLoading(false);
        }
      } catch (error) {
        if (!cancelled) {
          setFlightInfo({ 
            type: "PARSE_ERROR", 
            message: error instanceof Error ? error.message : 'Unknown error'
          });
          setLoading(false);
        }
      }
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
      <div className="bg-red-50 border border-red-200 rounded-lg text-center p-4">
        <p className="text-red-800 font-medium mb-1">❌ Unable to find flight</p>
        <p className="text-red-600 text-sm">{/* @ts-ignore fix for nicer types later */}
        {flightInfo.message}</p>
        <p className="text-gray-600 text-xs mt-2">Please check the flight number and date</p>
      </div>
    );
  }

  // @ts-ignore fix for nicer types later
  return <FlightInfo flightLeg={flightInfo} />;
}
