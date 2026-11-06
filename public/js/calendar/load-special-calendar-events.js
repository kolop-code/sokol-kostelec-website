import {events} from "../modules/events.mjs";

const special_event_template = document.querySelector("#spacial-event-template");
const special_calendar__events = document.querySelector(".special-calendar__events");

for (let ev of await events(`${import.meta.env.BASE_URL}api/calendar/special-events`)) {
    const start = new Date(ev.start);
    const end = new Date(ev.end);

    const template_clone = special_event_template.content.cloneNode(true);

    const special_event__title = template_clone.querySelector(".special-event__title");
    const special_event__from = template_clone.querySelector(".special-event__from");
    const special_event__to = template_clone.querySelector(".special-event__to");
    const special_event__description = template_clone.querySelector(".special-event__description");

    special_event__title.innerHTML = ev.title;
    special_event__from.innerHTML = "Od: " + start.toLocaleString();
    special_event__to.innerHTML = start === end ? "" : "Do: " + end.toLocaleString();
    special_event__description.innerHTML = ev.description === undefined ? "" : ev.description;

    special_calendar__events.appendChild(template_clone);
}

