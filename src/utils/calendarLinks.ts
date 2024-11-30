import { format } from 'date-fns';

interface FlightLeg {
  airline: string;
  flightNumber: string;
  departureAirport: string;
  arrivalAirport: string;
  departureTime: Date;
  arrivalTime: Date;
}

export function generateCalendarLinks(flightLegs: FlightLeg[]) {
  const startDate = format(flightLegs[0].departureTime, "yyyyMMdd'T'HHmmss'Z'");
  const endDate = format(flightLegs[flightLegs.length - 1].arrivalTime, "yyyyMMdd'T'HHmmss'Z'");
  
  const eventTitle = flightLegs.map(leg => `${leg.airline} ${leg.flightNumber}`).join(' + ');
  const eventDescription = flightLegs.map(leg => 
    `${leg.airline} ${leg.flightNumber}: ${leg.departureAirport} (${format(leg.departureTime, 'HH:mm')}) to ${leg.arrivalAirport} (${format(leg.arrivalTime, 'HH:mm')})`
  ).join('\n');

  const googleLink = `https://www.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(eventTitle)}&dates=${startDate}/${endDate}&details=${encodeURIComponent(eventDescription)}`;
  
  const outlookLink = `https://outlook.live.com/calendar/0/deeplink/compose?subject=${encodeURIComponent(eventTitle)}&startdt=${startDate}&enddt=${endDate}&body=${encodeURIComponent(eventDescription)}`;
  
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

