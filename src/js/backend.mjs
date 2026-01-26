import PocketBase from "pocketbase";
const pb = new PocketBase("http://127.0.0.1:8090");

export async function getEvents() {
    let events = await pb.collection("events").getFullList();
    return events;
}

export async function getImageUrl(record, imageField) {
    return pb.files.getURL(record, record[imageField]);
}
