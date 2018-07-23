// @flow

// load Vue and Vuex
import Vue from 'vue'
import Popup from './Popup.vue'

module.exports = function ( map: Object ) {

    // show popup for each tree
    map.on( 'click', function ( e ) {
        let features = map.queryRenderedFeatures( e.point, {
            layers: [ 'arbori' ]
        } )

        if ( !features.length ) {
            return
        }

        let feature = features[ 0 ];

        let reportDetails = {
            arboreId: feature.id,
            userId: window.userId,
            arboreLngLat: feature.geometry.coordinates,
            reportLngLat: window.currentLocation
        }

        let popup = new window.mapboxgl.Popup()
            .setLngLat( feature.geometry.coordinates )
            .setHTML( `
                <div id="popup-${reportDetails.arboreId}">
                </div>
            ` ).addTo( map )

        addVue( reportDetails )

        map.easeTo( {
            center: feature.geometry.coordinates,
            duration: 200,
            offset: [ 0, 150 ]
        } )
    } )

    window.map = map
}

function addVue( reportDetails: Object ) {
    new Vue( {
        template: `<popup :reportDetails="reportDetails"></popup>`,
        el: `#popup-${reportDetails.arboreId}`,
        data() {
            return {
                reportDetails: reportDetails
            }
        },
        components: {'popup': Popup}
    } )
}

// reverse geocode address of tree
// function fetchAddress( lng: number, lat: number ): Promise < string > {
//     let reverseGeocodeUrl = "https://nominatim.openstreetmap.org/reverse?format=json&lon=" + lng + "&lat=" + lat + "&zoom=18&addressdetails=1"
//     return fetch( reverseGeocodeUrl )
//         .then( function ( res ) {
//             return res.json()
//         } ).then( function ( json ) {
//             return json.address.road + " nr. " + json.address.house_number + ", " + json.address.state_district + ", " + json.address.postcode
//         } ).catch( function ( ex ) {
//             console.log( 'parsing failed', ex )
//             return "N/A"
//         } )
// }
//
// function buildPopup( data: {
//     arboreId: number,
//     userId: string,
//     arboreLngLat: number[],
//     reportLngLat: number[]
// } ) {
//
//     // fetch existing report by arboreId and userId, if exists
//
//     // if not, build data for a new report
//
//     fetchAddress( data.arboreLngLat[ 0 ], data.arboreLngLat[ 1 ] ).then( ( address ) => {
//         // console.log ( `
//         // <b>${data.arboreId}</b><br>
//         // ${data.arboreLngLat[0]} - ${data.arboreLngLat[1]}<br>
//         // ${data.reportLngLat[0]} - ${data.reportLngLat[1]}<br>
//         // ${address}<br>
//         // ` )
//     } )
//
//     return
//
// }
