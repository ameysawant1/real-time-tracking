const socket = io("https://real-time-tracking.onrender.com"); // ✅ Correct


const map = L.map("map").setView([19.0760, 72.8777], 13);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: 'Made By Amey Sawant'
}).addTo(map);

const markers = {};

socket.on("receive-location", (data) => {
    const { id, latitude, longitude } = data;

    if (!markers[id]) {
        markers[id] = L.marker([latitude, longitude]).addTo(map);
        map.setView([latitude, longitude], 16);
    } else {
        markers[id].setLatLng([latitude, longitude]);
    }
});

socket.on("remove-marker", (data) => {
    if (markers[data.id]) {
        map.removeLayer(markers[data.id]);
        delete markers[data.id];
    }
});

if (navigator.geolocation) {
    navigator.geolocation.watchPosition(
        (position) => {
            const { latitude, longitude } = position.coords;
            socket.emit("location", { latitude, longitude });
        },
        (error) => {
            console.error("Geolocation Error:", error);
            if (error.code === error.PERMISSION_DENIED) {
                alert("Geolocation permission denied. Please enable it in your browser settings.");
            }
        },
        {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0,
        }
    );
} else {
    console.log("Geolocation is not supported by this browser.");
}
