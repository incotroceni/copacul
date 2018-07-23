// @flow

module.exports = function ( map: Object, markerEl: string ) {
  // find marker element on page
  const el = document.getElementById( markerEl )

  map.on( 'load', function () {
    // enable constant geolocation
    navigator.geolocation.watchPosition( render, function ( error ) {
      if ( error.code === 1 ) {
        // display instructions
        window.loading_screen.updateLoadingHtml( "Pentru a accesa aplicația, vă rugăm să reîncărcați pagina și să acordați permisiunile de localizare." )
      } else {
        console.log( error )
      }
    }, {
      enableHighAccuracy: true,
      maximumAge: 0,
      timeout: Infinity
    } )

    // add a new data source, init to map center
    map.addSource( "current_location", {
      "type": "geojson",
      "data": {
        "type": "FeatureCollection",
        "features": [ {
          "type": "Feature",
          "geometry": {
            "type": "Point",
            "coordinates": map.getCenter()
          }
        } ]
      }
    } )

    // add accuracy radius at marker
    map.addLayer( {
      "id": "location_accuracy_radius",
      "type": "circle",
      "source": "current_location",
      "paint": {
        "circle-radius": {
          stops: [
            [ 14, 15 ],
            [ 19, metersToPixelsAtMaxZoom( 800, map.getCenter().lat ) ]
          ],
          base: 2
        },
        "circle-color": "blue",
        "circle-opacity": 0.10
      }
    } )

    // add current location marker
    map.addLayer( {
      "id": "location_marker",
      "type": "circle",
      "source": "current_location",
      "paint": {
        "circle-radius": {
          stops: [
            [ 14, 5 ],
            [ 19, 10 ]
          ],
          base: 2
        },
        "circle-color": "orange",
        "circle-opacity": 0.6
      }
    } )

    if ( window.DeviceOrientationEvent ) {
      // show bearing/heading

      map.addLayer( {
        "id": "drone",
        "type": "symbol",
        "source": "current_location",
        "layout": {
          "icon-image": "triangle-11",
          "symbol-placement": "point",
          "icon-offset": {
            stops: [
              [ 14, [ 0, -12 ] ],
              [ 19, [ 0, -15 ] ]
            ]
          },
        },
        "paint": {
          "icon-opacity": 0.5
        }
      } )

      let orientation

      window.addEventListener( 'deviceorientation', function ( eventData ) {
        let newOrientation
        if ( eventData.webkitCompassHeading ) {
          // Apple works only with this, alpha doesn't work
          newOrientation = eventData.webkitCompassHeading
        } else { newOrientation = eventData.alpha }
        
        if(newOrientation != orientation){
          orientation = newOrientation
          map.setLayoutProperty( 'drone', 'icon-rotate', orientation - map.getBearing() )
        }
      } )

      map.on( 'rotate', function () {
        map.setLayoutProperty( 'drone', 'icon-rotate', orientation - map.getBearing() )
      } )
    }

    // callback for each geolocation update
    function render( pos ) {
      var lat = pos.coords.latitude
      var lng = pos.coords.longitude

      map.getSource( "current_location" ).setData( {
        "type": "FeatureCollection",
        "features": [ {
          "type": "Feature",
          "geometry": {
            "type": "Point",
            "coordinates": [ lng, lat ]
          }
        } ]
      } )

      // use global to set state (ugly!)
      window.currentLocation = [ lng, lat ]

      // var currentLocation = new window.mapboxgl.Marker( el, {
      //   offset: [ -9, -15 ] // hard-coded according to marker image size
      // } )
      // currentLocation.setLngLat( [ lng, lat ] ).addTo( map )

      var radiusInMeters = pos.coords.accuracy / 2

      console.log( metersToPixelsAtMaxZoom( radiusInMeters, lat ) )
      console.log( 'Accuracy is more or less ' + pos.coords.accuracy + ' meters.' )

      // update radius according to zoom
      map.setPaintProperty( 'location_accuracy_radius', 'circle-radius', {
        stops: [
          [ 14, 15 ],
          [ 20, metersToPixelsAtMaxZoom( radiusInMeters, lat ) ]
        ],
        base: 2
      } )
    }
  } )

  window.map = map
}

function metersToPixelsAtMaxZoom( meters, latitude ) {
  return meters / 0.075 / Math.cos( latitude * Math.PI / 180 )
}
