// @flow

module.exports = function(map: Object){
    // Add zoom and rotation controls to the map.
    map.addControl( new window.mapboxgl.Navigation() )

    var geolocate = require('./geolocate_control')
    map.addControl( new geolocate() )

    var scale = map.addControl( new window.mapboxgl.Scale( {
        position: 'bottom-left',
        maxWidth: 80,
        unit: 'metric'
    } ) )

    map.on('geolocate', (data)=>{
      console.log("Geolocated: ")
      console.log(data)

      // map.zoomTo(18)
      map.getSource( "current_location" ).setData( {
          "type": "FeatureCollection",
          "features": [ {
              "type": "Feature",
              "geometry": {
                  "type": "Point",
                  "coordinates": [ data.coords.longitude, data.coords.latitude ]
              }
          } ]
      } )
    })

    window.map = map
}
