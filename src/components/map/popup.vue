<template lang="html">
  <div id="popupContent" v-if="reportReady" class="columns">
    <div class="imageSection column">
      <popup-upload :reportId='reportId' :reportDetails='reportDetails' :arborePozaThumb='arborePozaThumb'></popup-upload>
      <small><b>Arbore #{{reportDetails.arboreId}}</b></small>
      <small class="has-text-centered" v-if="updatedAt"><em><abbr :title="updatedAtLong">raport actualizat<br/> acum {{updatedAt}}</abbr></em></small>
    </div>
    <div class="stareCopac column is-half">
      <div class="control" v-for="stare in listaStari" v-on:click="setStare(stare)">
        <popup-button :stare="stare" :stareActuala="stareActuala" :stareUpdating="stareUpdating"></popup-button>
      </div>
    </div>
  </div>
</template>

<script>
import PopupButton from './PopupButton.vue'
import PopupUpload from './PopupUpload.vue'
import moment from 'moment'
// set locale
moment.locale('ro')

import Toast from 'vue-toast-mobile'
let toastMessage = {
  message: 'Raport trimis!',
  position: 'top',
  duration: 1500,
  className: "notification is-success is-custom",
  iconClass: "fa fa-check fa-2x"
}

const LISTA_STARI = [
  "Sănătos",
  "Uscat",
  "Buturugă",
  "De toaletat",
  "Alveolă goală",
  "Poziție incorectă",
  "Alta"
]

export default {
  data() {
    return {
      arborePozaThumb: '',
      stareActuala: '',
      stareUpdating: '',
      listaStari: LISTA_STARI,
      reportId: null,
      updatedAt: null,
      updatedAtLong: null,
      reportReady: false
    }
  },
  props: ['reportDetails'],
  name: 'popup',
  computed: {},
  mounted() {
    // try to read existing ref
    let reportId = `/trees-users/${this.reportDetails.arboreId}/${this.reportDetails.userId}`
    let existingReport = window.firebase.database().ref(reportId).once('value')
      .then(function(snapshot) {
        if (snapshot.val() !== null) {
          // set local data
          this.reportId = reportId
          this.stareActuala = snapshot.val().stareArbore
          this.arborePozaThumb = snapshot.val().arborePozaThumb || ''
          this.updatedAt = moment(snapshot.val().updatedAt || snapshot.val().createdAt).fromNow(true)
          this.updatedAtLong = moment(snapshot.val().updatedAt || snapshot.val().createdAt).format('LLLL')
          console.log("Report found!")
          this.reportReady = true
        } else {
          console.log(`Report for tree ${this.reportDetails.arboreId} by user ${this.reportDetails.userId} not found.`)
          this.reportReady = true
        }
      }.bind(this))
  },
  methods: {
    setStare(stare) {
      this.stareUpdating = stare
      this.stareActuala = ''

      // build the payload
      let createPayload = {
        arboreId: this.reportDetails.arboreId,
        arboreLngLat: this.reportDetails.arboreLngLat,
        reportLngLat: this.reportDetails.reportLngLat,
        stareArbore: stare,
        createdAt: firebase.database.ServerValue.TIMESTAMP
      }

      // if new report, update
      if (this.reportId !== null) {
        let updates = {}
        updates['/reportLngLat'] = this.reportDetails.reportLngLat
        updates['/stareArbore'] = stare
        updates['/updatedAt'] = firebase.database.ServerValue.TIMESTAMP
        window.firebase.database().ref(this.reportId).update(updates)
          .then(function() {
            this.stareActuala = stare
            this.updatedAt = moment(Date.now()).fromNow(true)
            this.updatedAtLong = moment(Date.now()).format('LLLL')

            Toast(toastMessage)

          }.bind(this))
      } else {
        // else, create new report
        // write the data and save as reportId
        this.reportId = `/trees-users/${this.reportDetails.arboreId}/${this.reportDetails.userId}`
        window.firebase.database().ref(this.reportId).set(createPayload)
          .then(function() {
            this.stareActuala = stare
            this.updatedAt = moment(Date.now()).fromNow(true)
            this.updatedAtLong = moment(Date.now()).format('LLLL')

            Toast(toastMessage)

          }.bind(this))
      }
    }
  },
  components: {
    'popup-button': PopupButton,
    'popup-upload': PopupUpload
  }
}

</script>

<style scoped lang="css">

#popupContent {
  font-size: 16px;
  display: flex;
  width: 100%;
  height: 100%;
}

.imageSection {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
}

.stareCopac {
  flex-direction: column;
}

small {
  line-height: 1em;
  margin-top: 1em;
}
</style>
