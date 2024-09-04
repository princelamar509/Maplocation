var map; // Declare map variable globally
var heatmap; // Declare heatmap variable globally

function initMap() {
    var location = { lat: 37.7749, lng: -122.4194 }; // Coordinates for San Francisco
    map = new google.maps.Map(document.getElementById('map'), {
        center: location,
        zoom: 15,
        mapTypeId: 'satellite'
    });

    var marker = new google.maps.Marker({
        position: location,
        map: map,
        title: 'San Francisco'
    });

    var infowindow = new google.maps.InfoWindow({
        content: '<h3>San Francisco</h3><p>Aerial view of San Francisco.</p>'
    });

    marker.addListener('click', function () {
        infowindow.open(map, marker);
    });

    addMarkers();
    initDrawingManager();
    initHeatmap();
}

function searchLocation() {
    const address = document.getElementById('location-search').value;
    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({ address }, (results, status) => {
        if (status === 'OK') {
            map.setCenter(results[0].geometry.location);
            const marker = new google.maps.Marker({
                map,
                position: results[0].geometry.location,
                title: address
            });
        } 
    });
}

var locations = [
    { lat: 37.7749, lng: -122.4194, title: 'San Francisco', info: 'Aerial view of San Francisco.' },
    { lat: 34.0522, lng: -118.2437, title: 'Los Angeles', info: 'Aerial view of Los Angeles.' },
    // Add more locations as needed
];

function addMarkers() {
    locations.forEach(function (location) {
        var marker = new google.maps.Marker({
            position: { lat: location.lat, lng: location.lng },
            map: map,
            title: location.title
        });

    
        marker.addListener('click', function () {
            infowindow.open(map, marker);
        });
    });
}
function centerOnUser() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            function (position) {
                var userLocation = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                };
                map.setCenter(userLocation);
            },
            function (error) {
                // Handle errors with a switch statement for different cases
                switch (error.code) {
                    case error.PERMISSION_DENIED:
                        alert("User denied the request for Geolocation.");
                        break;
                    case error.POSITION_UNAVAILABLE:
                        alert("Location information is unavailable.");
                        break;
                    case error.TIMEOUT:
                        alert("The request to get user location timed out.");
                        break;
                    case error.UNKNOWN_ERROR:
                        alert("An unknown error occurred.");
                        break;
                }
            }
        );
    } else {
        // This will only run if the browser does not support geolocation
        alert("Geolocation is not supported by this browser.");
    }
}


function initDrawingManager() {
    var drawingManager = new google.maps.drawing.DrawingManager({
        drawingMode: google.maps.drawing.OverlayType.MARKER,
        drawingControl: true,
        drawingControlOptions: {
            position: google.maps.ControlPosition.TOP_CENTER,
            drawingModes: [
                google.maps.drawing.OverlayType.MARKER,
                google.maps.drawing.OverlayType.CIRCLE,
                google.maps.drawing.OverlayType.POLYGON,
                google.maps.drawing.OverlayType.POLYLINE,
                google.maps.drawing.OverlayType.RECTANGLE
            ]
        }
    });
    drawingManager.setMap(map);
}

var drawingManager; // Move this declaration outside of functions to avoid reinitialization

function toggleDrawing() {
    if (!drawingManager) {
        drawingManager = new google.maps.drawing.DrawingManager();
    }
    if (drawingManager.getMap()) {
        drawingManager.setMap(null);
    } else {
        drawingManager.setMap(map);
    }
}

function initHeatmap() {
    var heatmapData = [
        { location: new google.maps.LatLng(37.7749, -122.4194), weight: 3 },
        { location: new google.maps.LatLng(34.0522, -118.2437), weight: 2 },

        // Add more data points as needed
    ];

    heatmap = new google.maps.visualization.HeatmapLayer({
        data: heatmapData
    });
    heatmap.setMap(map);
}

function toggleHeatmap() {
    if (heatmap.getMap()) {
        heatmap.setMap(null);
    } else {
        heatmap.setMap(map);
    }
}

function toggleStreetView() {
    var toggle = map.getStreetView();
    if (toggle.getVisible()) {
        toggle.setVisible(false);
    } else {
        var panorama = new google.maps.StreetViewPanorama(
            document.getElementById('map'), {
                position: map.getCenter(),
                pov: {
                    heading: 34,
                    pitch: 10
                }
            });
        map.setStreetView(panorama);
    }
}


function backToDefault() {
    map.setCenter(new google.maps.LatLng(37.7749, -122.4194));
    map.setZoom(15);

    if (drawingManager) {
        drawingManager.setMap(null);
    }
    if (heatmap) {
        heatmap.setMap(null);
    }else{
        heatmap.setMap(map);
    }
}

// Get the button element
const backButton = document.querySelector('button[onclick="backToDefault()"]');

// Add an event listener to the Street View toggle event
// Replace with your actual logic to detect when Street View is toggled
document.addEventListener('streetViewToggled', () => {
  // Simulate a click on the button
  backButton.dispatchEvent(new MouseEvent('click', { bubbles: true }));
});



