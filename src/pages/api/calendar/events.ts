import type { APIRoute } from "astro";
import ical from "node-ical";

export const GET: APIRoute = async () => {
    try {
        const response = [];
        const urls = [];
        urls[0] = import.meta.env.HLAVNI_SAL_URL;
        urls[1] = import.meta.env.HORNI_SAL_URL;
        urls[2] = import.meta.env.PIMPONKARNA_URL;

        let i = 0;
        for (let url of urls) {
            const calendar = await ical.async.fromURL(url);

            response[i] = Object.values(calendar)
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
            // Object.values(calendar)
            //     .filter(event => event !== undefined && event.type === "VEVENT")
            //     .map(event => (
            //         console.log(event)
            //     ))
            i++
        }

        return Response.json(response);

    } catch (error) {
        console.error("Calendar error:", error);

        return new Response("Failed to fetch calendar", {
            status: 500
        });
    }
};