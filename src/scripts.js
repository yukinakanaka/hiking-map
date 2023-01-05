import { config } from "./config.js";
mapboxgl.accessToken = config.accessToken;

const featureLayer = {
    sourceId: "featureSourceId",
    layerId: "featureLayerId",
};

const add3D = (map) => {
    // Add a sky layer over the horizon
    map.addLayer({
        id: "sky",
        type: "sky",
        paint: {
            "sky-type": "atmosphere",
            "sky-atmosphere-color": "rgba(85, 151, 210, 0.5)",
        },
    });

    // Add terrain source, with slight exaggeration
    map.addSource("mapbox-dem", {
        type: "raster-dem",
        url: "mapbox://mapbox.mapbox-terrain-dem-v1",
        tileSize: 512,
    });
    map.setTerrain({
        source: "mapbox-dem",
        exaggeration: config.style.terrainExaggeration,
    });
};

const addFeatures = (map, featuresGeojson) => {
    map.addSource(featureLayer.sourceId, {
        type: "geojson",
        data: featuresGeojson,
    });

    map.addLayer({
        id: featureLayer.layerId,
        type: "symbol",
        source: featureLayer.sourceId,
        visibility: "none",
        // minzoom: config.zoomInView.zoomLevel - 0.5,
        layout: {
            "icon-image": ["match", ["get", "type"], ["", "top"], "mountain", ["hut"], "ranger-station", "border-dot-13"],
            "icon-size": 2,
            "text-font": ["DIN Pro Bold", "Arial Unicode MS Regular"],
            "text-anchor": "top",
            "text-size": config.style.featureTextSize,
            "text-field": ["get", "displayName"],
            "text-offset": [0, 1],
            "text-variable-anchor": ["top", "bottom"],
        },
        paint: {
            "text-halo-color": "hsla(321, 0%, 13%, 0.8)",
            "text-halo-width": 1,
            "text-halo-blur": 1,
            "text-color": "hsl(0, 0%, 100%)",
        },
    });

    map.on("click", featureLayer.layerId, (e) => {
        const feature = e.features[0];

        // Ensure that if the map is zoomed out such that multiple
        // copies of the feature are visible, the popup appears
        // over the copy being pointed to.
        while (Math.abs(e.lngLat.lng - feature.geometry.coordinates[0]) > 180) {
            coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
        }

        new mapboxgl.Popup({ closeOnClick: false, anchor: feature.properties.anchor })
            .setLngLat(feature.geometry.coordinates)
            .setHTML(
                `<iframe type="text/html" width="${config.video.width}" height="${config.video.height}" src="https://www.youtube.com/embed/${feature.properties.id}?autoplay=1&mute=1&controls=${config.video.controls}&rel=0&start=${feature.properties.start}" frameborder="0"></iframe>
            <div class="mountain-name">${feature.properties.displayName}</div>`
            )
            .addTo(map)
            .setMaxWidth("400px");
    });
    map.on("mouseenter", featureLayer.layerId, () => {
        map.getCanvas().style.cursor = "pointer";
    });

    // Change it back to a pointer when it leaves.
    map.on("mouseleave", featureLayer.layerId, () => {
        map.getCanvas().style.cursor = "";
    });
};

const addDefaultVideos = (map, featuresGeojson) => {
    for (let index = 0; index < featuresGeojson.features.length; index++) {
        const feature = featuresGeojson.features[index];

        if (feature.properties.show) {
            new mapboxgl.Popup({ closeOnClick: false, anchor: feature.properties.anchor })
                .setLngLat(feature.geometry.coordinates)
                .setHTML(
                    `<iframe type="text/html" width="${config.video.width}" height="${config.video.height}" src="https://www.youtube.com/embed/${feature.properties.id}?autoplay=1&mute=1&controls=${config.video.controls}&rel=0&start=${feature.properties.start}" frameborder="0"></iframe>
                    <div class="mountain-name">${feature.properties.displayName}</div>`
                )
                .addTo(map)
                .setMaxWidth("400px");
        }
    }
};

const playAnimations = async (map) => {
    return new Promise(async (resolve) => {
        for (let index = 0; index < config.flyToPoints.length; index++) {
            const point = config.flyToPoints[index];
            await map.flyTo({
                zoom: point.zoomLevel,
                pitch: point.pitch,
                bearing: point.bearing,
                speed: point.speed,
                center: point.center,
            });
            await map.once("moveend");
            await new Promise((s) => setTimeout(s, config.animation.intervalSleepTime));
        }
        resolve();
    });
};

async function main() {
    // load data
    const featuresGeojson = await fetch(config.data.features).then((d) => d.json());

    // initialize map
    const map = await new mapboxgl.Map({
        container: "map",
        zoom: config.flyToPoints[0].zoomLevel,
        center: config.flyToPoints[0].center,
        pitch: config.flyToPoints[0].pitch,
        bearing: config.flyToPoints[0].bearing,
        style: config.style.mapStyle,
        interactive: true,
        hash: false,
        fadeDuration: 0,
    });
    if (config.style.showControl) {
        map.addControl(new mapboxgl.NavigationControl());
    }
    window.map = map;
    await map.once("load");

    // add Layers
    add3D(map);
    addFeatures(map, featuresGeojson);
    addDefaultVideos(map, featuresGeojson);

    if (config.animation.run) {
        await new Promise((s) => setTimeout(s, config.animation.firstSleepTime));
        await playAnimations(map);
    }
}

main();
