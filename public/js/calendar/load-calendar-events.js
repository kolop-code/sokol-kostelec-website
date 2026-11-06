import {events} from "../modules/events.mjs";

const days_data = document.getElementById("calendar__days-data");
const day_event_template = document.querySelector("#calendar-event-template")

const event_data = await events("/api/calendar/events");
const data = [];

const height = 1.5;
const time_offset = 7;

const week_dates = [];
const now = new Date(Date.now());
const diff = now.getDay() === 0 ? 6 : now.getDay() - 1;
const day_milliseconds = 24 * 60 * 60 * 1000;
const monday_milliseconds = Date.now() - (day_milliseconds * diff);

for (let i = 0; i < 7; i++) {
    week_dates[i] = new Date(monday_milliseconds + (i * day_milliseconds));
}

// room_index -> 0 = Velky sal, 1 = Horni sal, 2 = Pimponkarna
let room_index = 0;
for (let room of event_data) {
    for (let event of room) {
        const rrules = event.rules;
        const now = new Date(Date.now());
        const start_org = new Date(event.start);
        const start = new Date(start_org.getTime());
        const end = new Date(new Date(event.end).getTime());
        const top = room_index * height;
        //console.log(event.title, start, end);
        data.push({
            is_day_right: function (other) {
                if (rrules === undefined) {
                    const monday_date = new Date(week_dates[0].getFullYear(), week_dates[0].getMonth(), week_dates[0].getDate());
                    return monday_date.getTime() <= start.getTime() && start.getTime() <= monday_date.getTime() + 3600 * 24 * 7 * 1000 &&
                        other === (start.getDay() - 1 === -1 ? 6 : start.getDay() - 1);
                } else {
                    //console.log(event.title, start, end, rrules);
                    if (rrules.until !== undefined) {
                        const until_date = new Date(rrules.until);
                        if (now.getTime() > until_date.getTime() &&
                            now.getDate() !== start.getDate() &&
                            now.getFullYear() !== start.getFullYear() &&
                            now.getMonth() !== start.getMonth()) {
                            return false;
                        }
                    }

                    if (rrules.freq === "WEEKLY") {
                        const date_num = start.getDay();
                        return other === (date_num - 1 === -1 ? 6 : date_num - 1);
                    } else {
                        return false
                    }
                }
            },
            start: start,
            end: end,
            title: event.title,
            description: event.description,
            top: top,
            design_index: room_index
        })
    }
    room_index++;
}

for (let i = 0; i < 7; i++) {
    const day_data = document.createElement("div");
    day_data.classList.add("calendar__day-data");
    days_data.appendChild(day_data);

    let j = 0;
    for (let dat of data) {
        if (!dat.is_day_right(i)) {continue;}
        const start = new Date(dat.start);
        const end = new Date(dat.end);
        const duration = new Date(end.getTime() - start.getTime());

        const width_ = ((duration.getHours() - 1 + (duration.getMinutes() / 60)) * 80) + "px";
        const left_ = ((start.getHours() +
            (start.getMinutes() / 60)) * 80 - time_offset * 80) + "px";

        const features = [
            "calendar-event--horni-sal",
            "calendar-event--velky-sal",
            "calendar-event--pinponkarna",
            "calendar-event--velky-sal"
        ]

        const day_event_clone = day_event_template.content.cloneNode(true);

        const day_event__component = day_event_clone.querySelector(".calendar-event");
        const day_event__title = day_event_clone.querySelector(".calendar-event__title");
        day_event__component.setAttribute("style", `--calendar-event-width: ${width_};
                    --calendar-event-height: ${height}rem;
                    --calendar-event-left: ${left_};
                    --calendar-event-top: ${dat.top}rem`);
        day_event__component.classList.add(features[dat.design_index]);

        day_event__title.innerHTML = dat.title;

        day_data.appendChild(day_event__component);

        j++;
    }
}