var map; // Declare map variable globally

function initMap() {
    var location = {lat: 37.7749, lng: -122.4194}; // Coordinates for San Francisco
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

    marker.addListener('click', function() {
        infowindow.open(map, marker);
    });

    addMarkers();
    initDrawingManager();
    initHeatmap();
}

function searchLocation() {
    var address = document.getElementById('location-search').value;
    var geocoder = new google.maps.Geocoder();
    geocoder.geocode({ 'address': address }, function(results, status) {
        if (status === 'OK') {
            map.setCenter(results[0].geometry.location);
            var marker = new google.maps.Marker({
                map: map,
                position: results[0].geometry.location
            });
        } else {
            alert('Geocode was not successful for the following reason: ' + status);
        }
    });
}

var locations = [
    {lat: 37.7749, lng: -122.4194, title: 'San Francisco', info: 'Aerial view of San Francisco.'},
    {lat: 34.0522, lng: -118.2437, title: 'Los Angeles', info: 'Aerial view of Los Angeles.'},
    // Add more locations
];

function addMarkers() {
    locations.forEach(function(location) {
        var marker = new google.maps.Marker({
            position: {lat: location.lat, lng: location.lng},
            map: map,
            title: location.title
        });

        var infowindow = new google.maps.InfoWindow({
            content: '<h3>' + location.title + '</h3><p>' + location.info + '</p>'
        });

        marker.addListener('click', function() {
            infowindow.open(map, marker);
        });
    });
}

function centerOnUser() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            var userLocation = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };
            map.setCenter(userLocation);
            var marker = new google.maps.Marker({
                position: userLocation,
                map: map,
                title: 'Your Location'
            });
        });
    } else {
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

function toggleDrawing() {
    var drawingManager = new google.maps.drawing.DrawingManager();
    if (drawingManager.map) {
        drawingManager.setMap(null);
    } else {
        drawingManager.setMap(map);
    }
}

function initHeatmap() {
    var heatmapData = [
        {location: new google.maps.LatLng(37.7749, -122.4194), weight: 3},
        {location: new google.maps.LatLng(34.0522, -118.2437), weight: 2},
        // Add more data points
    ];

    var heatmap = new google.maps.visualization.HeatmapLayer({
        data: heatmapData
    });
    heatmap.setMap(map);
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

var reviews = [];

function submitReview() {
    var reviewText = document.getElementById('review-text').value;
    if (reviewText) {
        reviews.push(reviewText);
        document.getElementById('review-text').value = '';
        displayReviews();
    }
}

function displayReviews() {
    var reviewsDiv = document.getElementById('reviews');
    reviewsDiv.innerHTML = '';
    reviews.forEach(function(review) {
        var reviewElement = document.createElement('p');
        reviewElement.textContent = review;
        reviewsDiv.appendChild(reviewElement);

    });
}

