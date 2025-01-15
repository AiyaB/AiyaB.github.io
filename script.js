const TRANSLINK_API_KEY = "LtaGE3TBKMXVU1nDPcdr";
const GOOGLE_API_KEY = "AIzaSyBvC5Rw4DfQV5bc08fu2rK8TeeKZkHwDa0"
const GTFS_RT_URL = `https://gtfsapi.translink.ca/v3/gtfsrealtime?apikey=${TRANSLINK_API_KEY}`;

const stops = {
    "53096": "R5",
    "52807" : "143",
    "60662" : "144",
    "51861" : "145"
}


async function fetchGTFS() {
  const FUNCTION_URL = "https://northamerica-northeast2-translinkbustimes.cloudfunctions.net/gtfs-realtime-function";

  try {
    const response = await fetch(FUNCTION_URL);
    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }

    const data = await response.json();

    console.log("Fuck.");
    //getStops(JSON.parse(data));
    console.log("Parsed GTFS Data:", data[0]);
  } catch (error) {
    console.error("Error:", error);
  }
}

const fetchTimes = async () => {
  const response = await fetch("https://your-api-url/gtfs-realtime");
  const data = await response.json();

  Object.entries(data).forEach(([route, times]) => {
    console.log(`Route ${route}:`);
    times.forEach((time) => {
      console.log(`  Arriving in ${time} seconds`);
    });
  });
};
fetchTimes();

function getStops(data) {
    const currentTime = Math.floor(Date.now() / 1000);
    const stopArrivalTimes = {};

    Object.entries(stops).forEach(([stopId, routeId]) => {
        data.feedEntity.forEach(entity => {
            if (entity.tripUpdate) {
                entity.tripUpdate.stopTimeUpdate.forEach(update => {
                    const stopId = update.stopId;
                    const arrivalTime = update.arrival?.time;
                    if (stops[stopId] && arrivalTime) {
                        const timeRemaining = arrivalTime - currentTime;
                        if (timeRemaining > 0) {
                            stopArrivalTimes[stops[stopId]] = `${timeRemaining} seconds`;
                        }
                    }
                });
            }
        })
    })

    console.log(stopArrivalTimes);
}

fetchGTFS();

