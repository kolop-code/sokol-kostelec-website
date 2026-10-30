import type { APIRoute } from "astro";
import ical from "node-ical";

export const GET: APIRoute = async () => {
    try {
        const url = import.meta.env.GOOGLE_ICAL_URL;

        const calendar = await ical.async.fromURL(url);

        const events = Object.values(calendar)
            .filter(event => event !== undefined && event.type === "VEVENT")
            .map(event => ({
                id: event.uid,
                title: event.summary,
                description: event.description,
                //location: event.location,

                start: event.start,
                end: event.end,

                allDay: event.start.dateOnly === true
            }));

        return Response.json(events);

    } catch (error) {
        console.error("Calendar error:", error);

        return new Response("Failed to fetch calendar", {
            status: 500
        });
    }
};