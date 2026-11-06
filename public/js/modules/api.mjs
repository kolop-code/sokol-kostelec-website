export async function api(path) {
    console.log(path)
    const response = await fetch(path);

    if (!response.ok) {
        throw new Error("Could not load calendar");
    }

    return await response.json();
}