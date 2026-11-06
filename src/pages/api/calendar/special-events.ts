import type {APIRoute} from "astro";
import ical from "node-ical";

export const GET: APIRoute = async () => {
    try {
        const url = import.meta.env.AKCE_URL;

        const calendar = await ical.async.fromURL(url);

        const response = Object.values(calendar)
            .filter(event => event !== undefined && event.type === "VEVENT")
            .map(event => ({
                id: event.uid,
                title: event.summary,
                description: event.description,

                start: event.start,
                end: event.end,

                rules: event.rrule === undefined ? undefined : event.rrule.options,

                allDay: event.start.dateOnly === true
            }));


        return Response.json(response);

    } catch (error) {
        console.error("Calendar error:", error);

        return new Response("Failed to fetch calendar", {
            status: 500
        });
    }
};