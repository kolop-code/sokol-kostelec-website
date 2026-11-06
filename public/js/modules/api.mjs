export async function api(path) {
    const response = await fetch(path);

    if (!response.ok) {
        throw new Error("Could not load calendar");
    }

    return await response.json();

    // Render api in your custom calendar.
}