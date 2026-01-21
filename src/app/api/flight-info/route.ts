import OpenAI from "openai";
import { zodTextFormat } from "openai/helpers/zod";
import { z } from "zod";
import { NextRequest, NextResponse } from "next/server";

const FlightInfo = z.object({
  airline: z.string(),
  flightNumber: z.string(),
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

function normalizeAirportCode(airport: string, fieldName: string): string {
  const trimmed = airport.trim();
  if (trimmed.length > 3) {
    const capped = trimmed.substring(0, 3).toUpperCase();
    console.warn(`⚠️ Airport code capped: ${fieldName} was "${airport}" -> "${capped}"`);
    return capped;
  }
  return trimmed.toUpperCase();
}

async function attemptFetchFlightInfo(flightNumber: string, date: Date) {
  const response = await openai.responses.create({
    model: "gpt-5-nano",
    tools: [{ type: "web_search" }],
    text: {
      format: zodTextFormat(FlightInfo, "flight_info"),
    },
    input:
      `Fetch the flight information for flight number ${flightNumber} on date ${date.toISOString()}. ` +
      `Provide the airline, flight number, departure and arrival airports (MUST be 3-character IATA codes ONLY, e.g., 'FRA' not 'FRA (Frankfurt)'), ` +
      `departure and arrival times (in UTC and ISO 8601 format), and duration in minutes.`,
  });

  let jsonText = response.output_text.trim();
  console.info("Raw response:", jsonText);

  const firstClosingBrace = jsonText.indexOf('}');
  if (firstClosingBrace !== -1) {
    const potentialJson = jsonText.substring(0, firstClosingBrace + 1);
    try {
      const parsed = FlightInfo.parse(JSON.parse(potentialJson));
      return {
        ...parsed,
        departureAirport: normalizeAirportCode(parsed.departureAirport, 'departureAirport'),
        arrivalAirport: normalizeAirportCode(parsed.arrivalAirport, 'arrivalAirport'),
        departureTime: new Date(parsed.departureTime).toISOString(),
        arrivalTime: new Date(parsed.arrivalTime).toISOString()
      };
    } catch (e) {
      const parsed = FlightInfo.parse(JSON.parse(jsonText));
      return {
        ...parsed,
        departureAirport: normalizeAirportCode(parsed.departureAirport, 'departureAirport'),
        arrivalAirport: normalizeAirportCode(parsed.arrivalAirport, 'arrivalAirport'),
        departureTime: new Date(parsed.departureTime).toISOString(),
        arrivalTime: new Date(parsed.arrivalTime).toISOString()
      };
    }
  }

  const parsed = FlightInfo.parse(JSON.parse(jsonText));
  return {
    ...parsed,
    departureAirport: normalizeAirportCode(parsed.departureAirport, 'departureAirport'),
    arrivalAirport: normalizeAirportCode(parsed.arrivalAirport, 'arrivalAirport'),
    departureTime: new Date(parsed.departureTime).toISOString(),
    arrivalTime: new Date(parsed.arrivalTime).toISOString()
  };
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const flightNumber = searchParams.get('flightNumber');
    const dateStr = searchParams.get('date');

    if (!flightNumber || !dateStr) {
      return NextResponse.json(
        { error: 'Missing flightNumber or date parameter' },
        { status: 400 }
      );
    }

    const date = new Date(dateStr);
    if (isNaN(date.getTime())) {
      return NextResponse.json(
        { error: 'Invalid date format' },
        { status: 400 }
      );
    }

    const maxRetries = 3;
    let lastError: Error | null = null;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        console.log(`Attempt ${attempt} to fetch flight info for ${flightNumber}`);
        const flightInfo = await attemptFetchFlightInfo(flightNumber, date);
        return NextResponse.json(flightInfo);
      } catch (error) {
        lastError = error as Error;
        console.error(`Attempt ${attempt} failed:`, error);

        if (attempt === maxRetries) {
          return NextResponse.json(
            { 
              error: `Failed to fetch flight info after ${maxRetries} attempts: ${lastError.message}` 
            },
            { status: 500 }
          );
        }

        await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
      }
    }

    return NextResponse.json(
      { error: lastError?.message || 'Unknown error' },
      { status: 500 }
    );
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
