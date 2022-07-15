const WHERE_THE_ISS_AT_API = 'https://api.wheretheiss.at/v1/satellites/25544'; // Where the ISS at API key

// Get current lat, long, alt and velocity data from ISS API:
async function getSatData() {
    const data = await getData(WHERE_THE_ISS_AT_API); // Call API URL to fetch data
    // Store data in array:
    const satData = {
        lat: data.latitude,
        lng: data.longitude,
        alt: data.altitude,
        vel: data.velocity
    };
    return satData;
}

// Call API and get result:
async function getData(URL) {
    const response = await fetch(URL);
    const data = await response.json();
    return data;
}

// Updates the elements on screen displaying ISS stats
/*
function displayISSData(latitude, longitude, altitude, velocity) {
    document.getElementById('latitude').textContent = latitude;
    document.getElementById('longitude').textContent = longitude;
    document.getElementById('altitude').textContent = altitude;
    document.getElementById('velocity').textContent = velocity;
}
*/

/*
function newMarkerPos(coordinates, marker) {
    const newPos = new google.maps.LatLng(coordinates.lat, coords.lng);
    marker.setPosition(newPos);
}
*/

// Update coordinates/map position based on API stats every 2 secs:
function update() {
    const initialCoords = { lat: 51.505, lng: -0.09 }; // Position on page load

    //displayISSData('Getting lat', 'Getting long', 'Getting alt', 'Getting vel') // Notify user of loading status

    /*
    const map = new google.maps.Map(
        document.getElementById('map'),
        {
            zoom: 5,
            center: initialCoords,
            streetViewControl: false,
            mapTypeId: 'hybrid'
        }
    );

    const marker = new google.maps.Marker({
        title: 'ISS',
        position: initialCoords,
        map: map,
        clickable: true,
        icon: {
            url: 'images/sat.png',
            scaledSize: new google.maps.Size(40, 40)
        }
    });
    */

    var satIcon = L.icon({
        iconUrl: 'images/sat.png',
        shadowUrl: 'images/sat.png',

        iconSize: [40, 40],
        shadowSize: [0, 0],
        iconAnchor: [22, 94],
        shadowAnchor: [4, 62],
        popupAnchor: [-3, -76]        
    });

    var map = L.map('map').setView([initialCoords.lat, initialCoords.lng], 4);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'}).addTo(map);
    var marker = L.marker([initialCoords.lat, initialCoords.lng], {icon: satIcon}).addTo(map).bindPopup('This is where the ISS is right now!');

    // Do this every 1.5 secs:
    setInterval(() => {
        const fullData = getSatData(); // Get data from API
        fullData.then(satData => {
            const coordinates = { lat: satData.lat, lng: satData.lng };
            map.setView([coordinates.lat, coordinates.lng], 4);
            // displayISSData(satData.lat.toFixed(2), satData.lng.toFixed(2), satData.alt.toFixed(2), satData.vel.toFixed(2));
            marker.setLatLng([coordinates.lat, coordinates.lng]);
        });
    }, 3000);
}

window.onload = () => update();