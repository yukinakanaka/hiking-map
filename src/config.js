const config = {
    accessToken: "PLEASE_SET_YOUR_TOKEN",
    animation: {
        run: false,
        firstSleepTime: 10000,
        intervalSleepTime: 8000,
    },
    data: {
        features: "./data/poi.geojson",
    },
    video: {
        controls: 1,
        width: 384,
        height: 216,
    },
    flyToPoints: [
        {
            center: [142.739, 43.167], //Hokkaido
            speed: 1,
            zoomLevel: 7,
            pitch: 0,
            bearing: 0,
        },
        {
            center: [140.771, 39.522], //Tohoku
            speed: 0.5,
            zoomLevel: 7.44,
            pitch: 0,
            bearing: 0,
        },
        {
            center: [138.466, 36.7], //Hokuriku
            speed: 0.5,
            zoomLevel: 9,
            pitch: 0,
            bearing: 0,
        },
        {
            center: [138.044, 35.755], //shinshu
            speed: 0.5,
            zoomLevel: 9.2,
            pitch: 0,
            bearing: 0,
        },
        {
            center: [139.672, 35.2], //kanto
            speed: 0.5,
            zoomLevel: 9,
            pitch: 0,
            bearing: 0,
        },
        {
            center: [135.249, 34.791], //Kansai
            speed: 0.5,
            zoomLevel: 8.3,
            pitch: 0,
            bearing: 0,
        },
        {
            center: [130.809, 32.529], //Kyusyu
            speed: 0.5,
            zoomLevel: 7.5,
            pitch: 0,
            bearing: 0,
        },
        {
            center: [127.90849311, 26.68706235], //Okinawa
            speed: 0.5,
            zoomLevel: 7,
            pitch: 0,
            bearing: 0,
        },
    ],
    style: {
        mapStyle: "mapbox://styles/mapbox/satellite-streets-v12",
        terrainExaggeration: 1.5,
        featureTextSize: 15,
    },
};
export { config };
