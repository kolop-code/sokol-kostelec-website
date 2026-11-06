export async function events(path) {
    const response = await fetch(path);

    if (!response.ok) {
        throw new Error("Could not load calendar");
    }

    return await response.json();

    // Render events in your custom calendar.
}