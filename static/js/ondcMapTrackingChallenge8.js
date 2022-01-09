function initializeMap(divId) {
    var map_init = window.L.map(divId,{
        center: [12.908827037393776, 77.97771785510469],
        zoom:11
    });
    return map_init
}

function drawRoute(schemaObject, selectedIndex){
    var map_init = window.map_init
    map_init.eachLayer(function (layer) {
        map_init.removeLayer(layer);
    });
    map_init = window.map_init
    var osm = window.L.tileLayer ('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo (map_init);
    
    selected_route_path_index = selectedIndex
    selected_route_waypoints = schemaObject.routes[selected_route_path_index].map((item, index) => {
        return [item.lat, item.lng, item.ts]
    })

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
        
    // var polyline = window.L.polyline(selected_route_waypoints, {color: '#3388ff', weight: 3}).addTo(map_init);
    var polyline = window.L.polyline(selected_route_waypoints, {weight: 5});
    // PLOTTING THE POLYLINES
    setPolylineColors(polyline,['#00FF00','#808080'])
    function setPolylineColors(line,colors){
      selected_route_waypoints.forEach((lat_lng, index) => {
          console.log('lat lng is ', lat_lng)
          var current_path_lat_lngs = {"lat": lat_lng[0], "lng": lat_lng[1]}
          var next_selected_route_index = index === selected_route_waypoints.length - 1 ? index : index + 1
          var next_path_lat_lngs = {"lat": selected_route_waypoints[next_selected_route_index][0], "lng": selected_route_waypoints[next_selected_route_index][1]}
        //var poly =  L.polyline([current_path_lat_lngs,next_path_lat_lngs],{color: colors[index%2 === 0 ? 0 : 1], weight: 5}).addTo(map_init);
        var poly =  L.polyline([current_path_lat_lngs,next_path_lat_lngs],{weight: 5}).addTo(map_init);
      })

    }

    plotMarkers()
    
    function plotMarkers(){
        selected_route_waypoints.forEach((item, index) => {
            let markerTitle = ""
            if (index === 0){
                markerTitle = "Start"
            } else if( index === selected_route_waypoints.length - 1){
                markerTitle = "End"
            }
            if (markerTitle){
                //(window.L.marker([item[0], item[1]], {icon: markerTitle === "Start" ? startIcon : endIcon}).addTo(map_init)).bindPopup("<b>" + markerTitle+ "</b><br></br>" + item[2]).openPopup();
                (window.L.marker([item[0], item[1]], {icon: markerTitle === "Start" ? startIcon : endIcon}).addTo(map_init)).bindPopup("<b>" + markerTitle+ "</b><br></br>" + item[2]);
            } else {
                window.L.marker([item[0], item[1]]).addTo(map_init)
            }
    })
    }

}
