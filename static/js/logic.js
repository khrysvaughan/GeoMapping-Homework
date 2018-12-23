// Adding tile layer to the map
var streetmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "mapbox.streets",
  accessToken: API_KEY
});

var darkmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "mapbox.dark",
  accessToken: API_KEY
});

// Link to GeoJSON
//var url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_week.geojson";

// Link to All Earthquakes in the Past 7 Days
var url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";


// Grab the data with d3
d3.json(url, function (response) {

  var featuredata = response.features;
  // Create a new marker cluster group
  var markers = L.markerClusterGroup();

  // Define a function we want to run once for each feature in the features array
  // Give each feature a popup describing the place and time of the earthquake
  function onEachFeature(feature, layer) {
    var location = feature.geometry;

    // Check for location property
    if (location) {
      layer.bindPopup("<h3>" + feature.properties.place +
        "</h3><hr><p>" + new Date(feature.properties.time) + "</p>");
    }
  };

  var earthquakes = L.geoJSON(featuredata, {
    onEachFeature: onEachFeature,
    pointToLayer: function (feature, latlng) {

      var geojsonMarkerOptions = {
        radius: feature.properties.mag * 5,
        fillColor: getColor(feature.properties.mag),
        color: "white",
        weight: 1,
        opacity: 1,
        fillOpacity: 0.8
      };
      return L.circleMarker(latlng, geojsonMarkerOptions);
    }
  });

  // Define a baseMaps object to hold our base layers
  var baseMaps = {
    "Street Map": streetmap,
    "Dark Map": darkmap
  };

  // Create overlay object to hold our overlay layer
  var overlayMaps = {
    Earthquakes: earthquakes
  };

  function getColor(d) {
    return d < 1.0 ? '#800026' :
      d < 1.5 && d >= 1.0 ? '#BD0026' :
        d < 2.0 && d >= 1.5 ? '#E31A1C' :
          d < 2.5 && d >= 2.0 ? '#FC4E2A' :
            d < 3.5 && d >= 2.5 ? '#FD8D3C' :
              d < 5.0 && d >= 3.5 ? '#FEB24C' :
                d < 7.0 && d >= 5.0 ? '#FED976' :
                  'FFEEDA0';
  }

  var myMap = L.map("map", {
    center: [
      37.09, -95.71
    ],
    zoom: 5,
    layers: [streetmap, earthquakes]
  });

     // Add the layer control to the map
     L.control.layers(baseMaps, overlayMaps, {
      collapsed: false
    }).addTo(myMap);

  var legend = L.control({ position: "bottomright" });

});
