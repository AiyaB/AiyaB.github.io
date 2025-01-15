const TRANSLINK_API_KEY = "LtaGE3TBKMXVU1nDPcdr";
const GOOGLE_API_KEY = "AIzaSyBvC5Rw4DfQV5bc08fu2rK8TeeKZkHwDa0"
const GTFS_RT_URL = `https://gtfsapi.translink.ca/v3/gtfsrealtime?apikey=${TRANSLINK_API_KEY}`;

const buses = {
    "r5": 53096, //49.27848225067688, -122.91279079399621
    "143" : 52807, //49.27846387747979, -122.912680152876
    "144" : 60662, //49.278148724124556, -122.9118296057002
    "145" : 51861 //49.27862486143122, -122.91296446703457
}


async function fetchGTFS() {
  const FUNCTION_URL = "https://northamerica-northeast2-translinkbustimes.cloudfunctions.net/gtfs-realtime-function";

  try {
    const response = await fetch(FUNCTION_URL);
    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }

    const data = await response.json();
    console.log("Parsed GTFS Data:", data);
  } catch (error) {
    console.error("Error:", error);
  }
}

fetchGTFS();

