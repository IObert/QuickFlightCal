import { format } from "date-fns";
import { FlightLeg } from "./flightInfo";

export function generateCalendarLinks(flightLegs: FlightLeg[]) {
  const utcDepartureTime = flightLegs[0].departureTime.toUTCString();
  const startDate = format(utcDepartureTime, "yyyyMMdd'T'HHmmss");
  const endDate = format(
    flightLegs[flightLegs.length - 1].arrivalTime,
    "yyyyMMdd'T'HHmmss"
  );

  const eventTitle = flightLegs
    .map((leg) => `${leg.airline} ${leg.number}`)
    .join(" + ");
  let eventDescription = flightLegs
    .map(
      (leg) =>
        `${leg.airline} ${leg.number}: ${leg.departureAirport} (${format(
          leg.departureTime,
          "HH:mm"
        )}) to ${leg.arrivalAirport} (${format(leg.arrivalTime, "HH:mm")})`
    )
    .join("\n");

  eventDescription +=
    "\n\n\n\nGenerated with 💙 by QuickFlightCal ✈️ \n\n Generate calendar links for your flights";

  const googleLink = `https://www.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
    eventTitle
  )}&dates=${startDate}/${endDate}&details=${encodeURIComponent(
    eventDescription
  )}`;

  const outlookLink = `https://outlook.live.com/calendar/0/deeplink/compose?subject=${encodeURIComponent(
    eventTitle
  )}&startdt=${startDate}&enddt=${endDate}&body=${encodeURIComponent(
    eventDescription
  )}`;

  const icalLink = `data:text/calendar;charset=utf8,BEGIN:VCALENDAR
VERSION:2.0
BEGIN:VEVENT
DTSTART:${startDate}
DTEND:${endDate}
SUMMARY:${eventTitle}
DESCRIPTION:${eventDescription}
END:VEVENT
END:VCALENDAR`;

  return { googleLink, outlookLink, icalLink };
}
