// @flow

module.exports = function ( accessToken: string ) {
    window.mapboxgl.accessToken = accessToken;

    if ( !window.mapboxgl.supported() ) {
        window.loading_screen.updateLoadingHtml( "Din păcate, browserul folosit nu este compatibil cu aplicația noastră. Vă rugăm să încercați din nou cu un browser modern." )
    } else {

        const map = new window.mapboxgl.Map( {
            container: 'map',
            // style: process.env.MAPBOX_STYLE_REGULAR, // regular
            style: process.env.MAPBOX_STYLE_LIGHT, // light
            minZoom: 14,
            maxZoom: 19,
            zoom: 18,
            center: [ 26.076633, 44.430495 ],
            maxBounds: [
                    [ 25.920958, 44.333765 ],
                    [ 26.267103, 44.544219 ]
                ] // only Sector 5
        } )

        window.map = map
        initToCurrentLocation( map )
    }
}

// fly map to current location on first load
function initToCurrentLocation( map ) {
    var options = {
        enableHighAccuracy: true,
        timeout: Infinity,
        maximumAge: 0
    };

    function success( pos ) {
        map.flyTo( {
            center: [ pos.coords.longitude, pos.coords.latitude ]
        } )

        // hide loading screen
        window.loading_screen.finish();

        var crd = pos.coords;

        console.log( 'Your current position is:' );
        console.log( 'Latitude : ' + crd.latitude );
        console.log( 'Longitude: ' + crd.longitude );
        console.log( 'More or less ' + crd.accuracy + ' meters.' );
    };

    function error( err ) {
        console.warn( 'ERROR(' + err.code + '): ' + err.message );
    };

    navigator.geolocation.getCurrentPosition( success, error, options );

}
