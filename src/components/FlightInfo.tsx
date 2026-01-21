import { FlightLeg } from "@/utils/flightInfo";
import { addMinutes, format } from "date-fns";
import { ArrowRight, Calendar, CalendarDays, Download } from "lucide-react";
import { generateCalendarLinks } from "@/utils/calendarLinks";
import { Button } from "@/components/ui/button";

export function FlightInfo({ flightLeg }: { flightLeg: FlightLeg }) {
  const arrivalTime = addMinutes(flightLeg.departureTime, flightLeg.duration);
  const { googleLink, outlookLink, icalLink } = generateCalendarLinks([flightLeg]);

  const handleICalDownload = () => {
    const element = document.createElement('a');
    element.setAttribute('href', icalLink);
    element.setAttribute('download', `flight-${flightLeg.flightNumber}.ics`);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="bg-gray-100 border border-gray-300 rounded-lg overflow-hidden">
      <div className="flex items-center justify-between bg-gray-200 p-4">
        <div className="flex flex-col items-center">
          <span className="text-2xl font-bold">{flightLeg.departureAirport}</span>
          <span className="text-sm">
            {format(flightLeg.departureTime, "HH:mm z")}
          </span>
          <span className="text-xs">
            {format(flightLeg.departureTime, "eee")}
          </span>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-sm font-semibold">
            {flightLeg.airline} {flightLeg.flightNumber}
          </span>
          <ArrowRight className="my-2" />
        </div>
        <div className="flex flex-col items-center">
          <span className="text-2xl font-bold">{flightLeg.arrivalAirport}</span>
          <span className="text-sm">{format(arrivalTime, "HH:mm z")}</span>
          <span className="text-xs">{format(arrivalTime, "eee")}</span>
        </div>
      </div>
      <div className="p-3 bg-white border-t border-gray-300">
        <p className="text-xs text-gray-600 mb-2 font-medium">Add to calendar:</p>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="flex-1 text-xs"
            asChild
          >
            <a href={googleLink} target="_blank" rel="noopener noreferrer">
              <Calendar className="w-3 h-3 mr-1" />
              Google
            </a>
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="flex-1 text-xs"
            asChild
          >
            <a href={outlookLink} target="_blank" rel="noopener noreferrer">
              <CalendarDays className="w-3 h-3 mr-1" />
              Outlook
            </a>
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="flex-1 text-xs"
            onClick={handleICalDownload}
          >
            <Download className="w-3 h-3 mr-1" />
            iCal
          </Button>
        </div>
      </div>
    </div>
  );
}
