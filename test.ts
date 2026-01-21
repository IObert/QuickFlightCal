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

console.clear();

const openai = new OpenAI();
const response = await openai.responses.create({
  model: "gpt-5-nano",
  tools: [{ type: "web_search" }],
  text: {
    format: zodTextFormat(FlightInfo, "flight_info"),
  },
  input:
    `Fetch the flight information for flight number LH458. ` +
    `Provide the airline, flight number, departure and arrival airports, ` +
    `departure and arrival times (in UTC and ISO 8601 format), and duration in minutes.`,
});

console.log(response.output_text);
