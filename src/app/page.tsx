"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { generateCalendarLinks } from "../utils/calendarLinks";
import { parseFlightInfo } from "../utils/flightInfo";
import { FlightInfo } from "../components/FlightInfo";
import { CalendarIcon, CircleXIcon } from "lucide-react";
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
import { format, set } from "date-fns";
import { Separator } from "@/components/ui/separator";
import { useSearchParams, useRouter } from "next/navigation";

interface FormState {
  date: Date;
  flightInputs: string[];
}

export default function FlightCalendarLinks() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const urlDate = searchParams.get("date"),
    urlFlights = searchParams.get("flights");

  const [formState, setFormState] = useState<FormState>({
    date: urlDate ? new Date(urlDate) : new Date(),
    flightInputs: urlFlights ? urlFlights.split(",") : [""],
  });

  const [calendarOpen, setCalendarOpen] = useState(false);
  const [flightInfos, setFlightInfos] = useState<
    ReturnType<typeof parseFlightInfo>[]
  >([]);
  const [links, setLinks] = useState<ReturnType<
    typeof generateCalendarLinks
  > | null>(null);

  const validateAndGenerateLinks = () => {
    setFlightInfos([]);
    setLinks(null);

    const flightDate = formState.date;

    const newFlightInfos = formState.flightInputs
      .filter((input) => input.trim() !== "")
      .map((input) => parseFlightInfo(input.trim(), flightDate));

    setFlightInfos(newFlightInfos);
    // @ts-ignore fix for nicer types later
    if (!newFlightInfos.some((flight) => flight?.type === "PARSE_ERROR")) {
      // @ts-ignore fix for nicer types later
      const newLinks = generateCalendarLinks(newFlightInfos);
      setLinks(newLinks);
    } else {
      setLinks(null);
    }
  };

  return (
    <div className="container lg:my-16 my-8 mx-auto p-4 max-w-md">
      <div
        className="text-center mb-4 cursor-pointer"
        onClick={() => {
          setFormState({
            date: new Date(),
            flightInputs: [""],
          });
          router.push("/");
        }}
      >
        <h1 className="text-2xl font-bold ">QuickFlightCal ✈️</h1>
        <h2 className="text-lg">Generate calendar links for your flights</h2>
      </div>
      <div className="text-gray-600 my-10 bg-slate-300 p-2  rounded-md">
        Enter your flight information to generate calendar links. You can also
        add multiple flight legs.
      </div>
      <div className="my-10">
        <div className="my-2">
          <Label htmlFor="date">Flight Date</Label>
          <div>
            <Popover
              open={calendarOpen}
              onOpenChange={() => {
                setCalendarOpen(!calendarOpen);
              }}
            >
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !formState.date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formState.date ? (
                    format(formState.date, "PPP")
                  ) : (
                    <span>Pick a date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={formState.date}
                  onSelect={(date) => {
                    const newParams = new URLSearchParams(
                      searchParams.toString()
                    );
                    if (date) {
                      newParams.set("date", format(date, "yyyy-MM-dd"));
                    } else {
                      newParams.delete("date");
                    }
                    router.push(`?${newParams.toString()}`);
                    setCalendarOpen(false);
                    setFormState({
                      ...formState,
                      date: date ? date : new Date(),
                    });
                  }}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
        {formState.flightInputs.map((input, index) => (
          <div className="my-2" key={index}>
            <Label htmlFor={`flight-${index}`}>
              Flight Number (e.g., LH 458)
            </Label>
            <div className="flex">
              <Input
                id={`flight-${index}`}
                value={input}
                onChange={(e) => {
                  const newFlightInputs = [...formState.flightInputs];
                  newFlightInputs[index] = e.target.value;
                  const newParams = new URLSearchParams(
                    searchParams.toString()
                  );
                  newParams.set("flights", newFlightInputs.join(","));
                  router.push(`?${newParams.toString()}`);

                  setFormState({
                    ...formState,
                    flightInputs: newFlightInputs,
                  });
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    validateAndGenerateLinks();
                  }
                }}
                placeholder="e.g. LH 458"
              />
              {index > 0 && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      className="hover:text-red"
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        const newFlightInputs = formState.flightInputs.filter(
                          (_, i) => i !== index
                        );
                        const newParams = new URLSearchParams(
                          searchParams.toString()
                        );
                        newParams.set("flights", newFlightInputs.join(","));
                        router.push(`?${newParams.toString()}`);

                        setFormState({
                          ...formState,
                          flightInputs: newFlightInputs,
                        });
                      }}
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
          onClick={() => {
            const newParams = new URLSearchParams(searchParams.toString());
            const flightInputs = [...formState.flightInputs];
            flightInputs.push("");
            newParams.set("flights", flightInputs.join(","));
            router.push(`?${newParams.toString()}`);
            setFormState({
              ...formState,
              flightInputs,
            });
          }}
        >
          Add Another Flight
        </Button>
        <Button className="w-full my-2" onClick={validateAndGenerateLinks}>
          Generate Links
        </Button>
        {/* {error && <p className="text-red-500">{error}</p>} */}
        {/* @ts-ignore invalid since null is catched */}

        <div className="space-y-4">
          {flightInfos.map((flightInfo, index) => (
            <div key={index}>
              {/* @ts-ignore fix for nicer types later */}
              {flightInfo?.type === "PARSE_ERROR" ? (
                // @ts-ignore fix for nicer types later
                <div className="bg-red-400 rounded-lg text-center p-4">
                  {flightInfo.message}
                </div>
              ) : (
                // @ts-ignore fix for nicer types later
                <FlightInfo flightLeg={flightInfo} />
              )}
            </div>
          ))}
        </div>
        {links && (
          <>
            <Separator className="my-4" />
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
          </>
        )}
      </div>
    </div>
  );
}
