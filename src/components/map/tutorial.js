// @flow
import Vue from 'vue'
import VueCookie from 'vue-cookie'
import TutorialModal from './Modal.vue'

Vue.use(VueCookie)

// // add custom control for popup
// var geolocate = require('./geolocate_control')
// map.addControl( new geolocate() )

module.exports = function ( map: Object ) {
  let tutorialDiv = document.createElement('div')
  tutorialDiv.id='tutorial'
  document.body.appendChild(tutorialDiv)

  new Vue( {
      template: `<modal></modal>`,
      el: '#tutorial',
      data() {
          return {

          }
      },
      components: {'modal': TutorialModal}
  } )
}
