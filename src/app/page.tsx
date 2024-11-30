"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { generateCalendarLinks } from "../utils/calendarLinks";
import { parseFlightInfo } from "../utils/flightInfo";
import { FlightInfo } from "../components/FlightInfo";
import { CalendarIcon, Circle, CircleXIcon } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";

export default function FlightCalendarLinks() {
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [flightInputs, setFlightInputs] = useState([""]);
  const [flightLegs, setFlightLegs] = useState<
    ReturnType<typeof parseFlightInfo>[]
  >([]);
  const [links, setLinks] = useState<ReturnType<
    typeof generateCalendarLinks
  > | null>(null);
  const [error, setError] = useState<string | null>(null);

  const validateAndGenerateLinks = () => {
    setError(null);
    setFlightLegs([]);
    setLinks(null);

    if (!date) {
      setError("Please select a date");
      return;
    }

    const flightDate = new Date(date);
    if (isNaN(flightDate.getTime())) {
      setError("Invalid date");
      return;
    }

    const newFlightLegs = flightInputs
      .filter((input) => input.trim() !== "")
      .map((input) => parseFlightInfo(input.trim(), flightDate))
      .filter((leg): leg is NonNullable<typeof leg> => leg !== null);

    if (newFlightLegs.length === 0) {
      setError("No valid flight numbers entered");
      return;
    }

    setFlightLegs(newFlightLegs);
    const newLinks = generateCalendarLinks(newFlightLegs);
    setLinks(newLinks);
  };

  const addFlightLeg = () => {
    setFlightInputs([...flightInputs, ""]);
  };

  const updateFlightLeg = (index: number, value: string) => {
    const newFlightInputs = [...flightInputs];
    newFlightInputs[index] = value;
    setFlightInputs(newFlightInputs);
  };

  return (
    <div className="container lg:my-16 my-4 mx-auto p-4 max-w-md">
      <h1 className="text-2xl font-bold mb-4">
        Flight Calendar Links Generator
      </h1>
      <span className="text-gray-600 my-10">
        Enter your flight information to generate calendar links. You can also
        add multiple flight legs.
      </span>
      <div className="my-10">
        <div className="my-2">
          <Label htmlFor="date">Flight Date</Label>
          <div>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
        {flightInputs.map((input, index) => (
          <div className="my-2" key={index}>
            <Label htmlFor={`flight-${index}`}>
              Flight Number (e.g., LH 458)
            </Label>
            <div className="flex">
              <Input
                id={`flight-${index}`}
                value={input}
                onChange={(e) => updateFlightLeg(index, e.target.value)}
                placeholder="e.g. LH 458"
              />
              {index > 0 && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      className="hover:text-red"
                      variant="ghost"
                      size="icon"
                      onClick={() =>
                        setFlightInputs(
                          flightInputs.filter((_, i) => i !== index)
                        )
                      }
                    >
                      <CircleXIcon />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Remove Flight</TooltipContent>
                </Tooltip>
              )}
            </div>
          </div>
        ))}
        <Button
          className="w-full mt-6 mb-4 "
          variant="outline"
          onClick={addFlightLeg}
        >
          Add Another Flight
        </Button>
        <Button className="w-full my-2" onClick={validateAndGenerateLinks}>
          Generate Links
        </Button>
        {error && <p className="text-red-500">{error}</p>}
        {flightLegs.length > 0 && <FlightInfo flightLegs={flightLegs} />}
        {links && (
          <div className="space-y-2">
            <Button asChild className="w-full">
              <a
                href={links.googleLink}
                target="_blank"
                rel="noopener noreferrer"
              >
                Add to Google Calendar
              </a>
            </Button>
            <Button asChild className="w-full">
              <a
                href={links.outlookLink}
                target="_blank"
                rel="noopener noreferrer"
              >
                Add to Outlook
              </a>
            </Button>
            <Button asChild className="w-full">
              <a href={links.icalLink} download="flight.ics">
                Download iCal/ICS
              </a>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
