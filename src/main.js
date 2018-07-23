// @flow
import Vue from 'vue'
import firebase from 'firebase'

window.firebase = firebase

window.firebase.initializeApp( {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.FIREBASE_DATABASE_URL,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID
} )

window.firebase.auth().onAuthStateChanged( ( user ) => {
  if ( user ) {
    // User is already signed in.
    console.log("Loading session for user "+user.uid)
    window.userId = user.uid
  } else {
    console.log( "Not signed in, creating new session" )
    window.firebase.auth().signInAnonymously().catch( function ( error ) {
      // Handle Errors here.
      var errorCode = error.code
      var errorMessage = error.message
      console.log( errorCode + " " + errorMessage )
    } )
  }
} )


// init loading screen
window.loading_screen = window.pleaseWait( {
  logo: "static/img/logo-app.png",
  backgroundColor: '#00918e',
  loadingHtml: `
    <div class="loadingDetails">
      <div class="loadingMessage">
        <h1 class="title">Te localizăm pe hartă...</h1>
        <div class="spinner">
          <div class="double-bounce1"></div><div class="double-bounce2"></div>
        </div>
      </div>
      <div class="sponsorsMessage">
        <p><small>
          Copacul Încotroceni este un proiect cultural produs prin linia Generator de proiecte comunitare la firul ierbii, în cadrul candidaturii Bucureşti 2021 Oraşul In-Vizibil.
        </small></p>
      </div>
      <div class="sponsors columns is-mobile">
        <figure class="image column has-text-centered">
          <img src="static/img/pmb.png">
        </figure>
        <figure class="image column has-text-centered">
          <img src="static/img/arcub.png">
        </figure>
        <figure class="image column has-text-centered">
          <img src="static/img/B2021.png">
        </figure>
        <figure class="image column has-text-centered">
          <img src="static/img/logo-alt.png">
        </figure>
      </div>
    </div>
    `
} );

require( './components/map/map.js' )
