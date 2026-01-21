"use client";

import { useState, Suspense } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FlightLoader } from "../components/FlightLoader";
import { FlightSkeleton } from "../components/FlightSkeleton";
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
import { format } from "date-fns";
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
  const [showFlights, setShowFlights] = useState(false);
  const [generationKey, setGenerationKey] = useState(0);

  const validateAndGenerateLinks = () => {
    setShowFlights(true);
    setGenerationKey((prev) => prev + 1);
  };

  return (
    <div className="min-h-screen w-full">
      <div className="mx-auto w-full px-4 py-6 sm:px-6 sm:py-8 md:max-w-2xl md:px-8 lg:max-w-3xl lg:py-12 pb-20">
        <div
          className="text-center mb-6 sm:mb-8 cursor-pointer"
          onClick={() => {
            setFormState({
              date: new Date(),
              flightInputs: [""]
            });
            router.push("/");
          }}
        >
          <h1 className="text-2xl sm:text-3xl font-bold">QuickFlightCal ✈️</h1>
          <h2 className="text-base sm:text-lg text-gray-600 mt-1">Add flights to your calendar in seconds</h2>
        </div>
        <div className="text-gray-700 mb-6 sm:mb-8 bg-blue-50 border border-blue-200 p-4 sm:p-5 rounded-lg">
          <p className="font-medium mb-2 text-sm sm:text-base">📋 How it works:</p>
          <p className="text-xs sm:text-sm leading-relaxed">Enter your flight numbers and date below. We'll fetch the details and create calendar events you can save to Google, Apple, or Outlook.</p>
        </div>
        <div className="space-y-4 sm:space-y-5">
          <div>
            <Label htmlFor="date" className="text-sm sm:text-base font-medium">Departure Date</Label>
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
                    "w-full justify-start text-left font-normal h-11 sm:h-12 text-sm sm:text-base mt-1",
                    !formState.date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                  {formState.date ? (
                    format(formState.date, "PPP")
                  ) : (
                    <span>Pick a date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="center">
                <Calendar
                  mode="single"
                  selected={formState.date}
                  className="scale-100 sm:scale-110"
                  onSelect={(date: Date | undefined) => {
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
            <div key={index}>
              <Label htmlFor={`flight-${index}`} className="text-sm sm:text-base font-medium">
                Flight {index + 1}
              </Label>
              <div className="flex gap-2 mt-1">
                <Input
                  id={`flight-${index}`}
                  value={input}
                  className="h-11 sm:h-12 text-sm sm:text-base"
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
                placeholder="e.g., LH 458, UA 2345, BA 117"
              />
                {index > 0 && (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        className="hover:text-red min-w-[44px] h-11 sm:h-12 shrink-0"
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
            className="w-full h-11 sm:h-12 text-sm sm:text-base mt-2"
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
          + Add Connecting Flight
        </Button>
        <Button className="w-full h-11 sm:h-12 text-sm sm:text-base" onClick={validateAndGenerateLinks}>
          ✨ Get Calendar Events
        </Button>
          {showFlights && (
            <div className="space-y-4 mt-6">
            {formState.flightInputs
              .filter((input) => input.trim() !== "")
              .map((input, index) => (
                <div key={`${generationKey}-${index}-${input}`}>
                  <Suspense fallback={<FlightSkeleton />}>
                    <FlightLoader
                      flightInput={input}
                      flightDate={formState.date}
                    />
                  </Suspense>
                </div>
              ))}
            </div>
          )}
          {/* TODO: Calendar links will be re-enabled after proper async handling */}
        </div>
      </div>
    </div>
  );
}
