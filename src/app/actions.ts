"use server";

import OpenAI from "openai";
import { zodTextFormat } from "openai/helpers/zod";
import { z } from "zod";

// make sure the response is json that follows this format
// {
//     airline,
//     flightNumber,
//     number: parseInt(number),
//     departureAirport: route.departureAirport,
//     arrivalAirport: route.arrivalAirport,
//     departureTime,
//     arrivalTime,
//     duration: route.duration,
//   }

const FlightInfo = z.object({
  airline: z.string(),
  flightNumber: z.string(),
  number: z.number(),
  departureAirport: z.string(),
  arrivalAirport: z.string(),
  departureTime: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: "Invalid date format",
  }),
  arrivalTime: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: "Invalid date format",
  }),
  duration: z.number(),
});

const openai = new OpenAI();

async function attemptFetchFlightInfo(flightNumber: string, date: Date) {
  const response = await openai.responses.create({
    model: "gpt-5-nano",
    tools: [{ type: "web_search" }],
    text: {
      format: zodTextFormat(FlightInfo, "flight_info"),
    },
    input:
      `Fetch the flight information for flight number ${flightNumber} on date ${date.toISOString()}. ` +
      `Provide the airline, flight number, departure and arrival airports, ` +
      `departure and arrival times (in UTC and ISO 8601 format), and duration in minutes.`,
  });

  // Try to extract the first valid JSON object if multiple are concatenated
  let jsonText = response.output_text.trim();
  console.info("Raw response:", jsonText);

  // Find the first closing brace and use only that portion
  const firstClosingBrace = jsonText.indexOf('}');
  if (firstClosingBrace !== -1) {
    const potentialJson = jsonText.substring(0, firstClosingBrace + 1);
    try {
      const parsed = FlightInfo.parse(JSON.parse(potentialJson));
      return {
        ...parsed,
        departureTime: new Date(parsed.departureTime),
        arrivalTime: new Date(parsed.arrivalTime)
      };
    } catch (e) {
      // If first object fails, try the full text
      const parsed = FlightInfo.parse(JSON.parse(jsonText));
      return {
        ...parsed,
        departureTime: new Date(parsed.departureTime),
        arrivalTime: new Date(parsed.arrivalTime)
      };
    }
  }

  // Fallback to parsing the full text
  const parsed = FlightInfo.parse(JSON.parse(jsonText));
  return {
    ...parsed,
    departureTime: new Date(parsed.departureTime),
    arrivalTime: new Date(parsed.arrivalTime)
  };
}

export async function fetchFlightInfo(flightNumber: string, date: Date) {
  const maxRetries = 3;
  let lastError: Error | null = null;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {

      console.log(`Attempt ${attempt} to fetch flight info for ${flightNumber}`);
      return attemptFetchFlightInfo(flightNumber, date);
    } catch (error) {
      lastError = error as Error;
      console.error(`Attempt ${attempt} failed:`, error);

      // If this was the last attempt, throw the error
      if (attempt === maxRetries) {
        throw new Error(
          `Failed to fetch flight info after ${maxRetries} attempts: ${lastError.message}`
        );
      }

      // Wait a bit before retrying (exponential backoff)
      await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
    }
  }


  // This should never be reached, but TypeScript needs it
  throw lastError || new Error("Unknown error");
}
