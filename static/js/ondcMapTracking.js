function initializeMap(divId) {
    var map_init = window.L.map(divId,{
        center: [28.657147231414474, 77.23440006902206],
        zoom:5
    });
    return map_init
}

function drawRoute(routingPath, colorsList, showPlottings){
    var map_init = window.map_init
    map_init.eachLayer(function (layer) {
        map_init.removeLayer(layer);
    });
    map_init = window.map_init
    var osm = window.L.tileLayer ('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo (map_init);

    var startIcon = L.icon({
        // iconUrl: "http://leafletjs.com/examples/custom-icons/leaf-green.png",
        iconUrl: "static/icons/icon_map_star.png",
        iconSize: [35, 50],
        iconAnchor: [22, 50],
        popupAnchor: [-3, -76],
        shadowSize: [68, 95],
        shadowAnchor: [22, 94],
        className: "text-primary"
    });

    var endIcon = L.icon({
        iconUrl: "static/icons/icon_map_e.png",
        iconSize: [35, 50],
        iconAnchor: [22, 50],
        popupAnchor: [-3, -76],
        shadowSize: [68, 95],
        shadowAnchor: [22, 94],
        className: "text-primary"
        
    });
    
    if(showPlottings){
        for(let i=0; i < routingPath.length; i++){
            selected_route_waypoints = routingPath[i].map((item, index) => {
                return [item[0], item[1]]
            })
            var polyline = window.L.polyline(selected_route_waypoints, {color: colorsList[i], weight: 4}).addTo(map_init);
            plotMarkers(selected_route_waypoints, i)
        }
     
        function plotMarkers(selectedRoute, currentRouteIndex){
            selectedRoute.forEach((item, index) => {
                let markerTitle = ""
                let markerContent = ""
                if (index === 0){
                    markerTitle = "Start"
                    markerContent = "Route "+ (currentRouteIndex + 1) + " start"
                } else if( index === selectedRoute.length - 1){
                    markerTitle = "End"
                    markerContent = "Route "+ (currentRouteIndex + 1) + " end"
                }
                if (markerTitle){
                    // (window.L.marker([item[0], item[1]], {icon: markerTitle === "Start" ? startIcon : endIcon}).addTo(map_init)).bindPopup("<b>" + markerTitle+ "</b><br></br>" + markerContent, {autoClose: markerTitle === "Start" ? true : false}).openPopup();
                    (window.L.marker([item[0], item[1]], {icon: markerTitle === "Start" ? startIcon : endIcon}).addTo(map_init)).bindPopup("<b>" + markerTitle+ "</b><br></br>" + markerContent, {autoClose: markerTitle === "Start" ? true : false});
                } else {
                    window.L.marker([item[0], item[1]]).addTo(map_init)
                }
        })
        }
    
    }
    
}


// function generateRandomColor(){
//     return '#' + Math.floor(Math.random()*16777215).toString(16).padStart(6, '0');
// }

function clearMapContents(){
    var map_init = window.map_init
    map_init.eachLayer(function (layer) {
        map_init.removeLayer(layer);
    });
    drawRoute([], [], false)
    $("#problemOutputSection").hide()
}

function generateRandomColor() {
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += Math.floor(Math.random() * 10);
    }
    return color;
}