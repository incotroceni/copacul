<style lang="css">
.modal {
    display: flex;
}

.modal-card-foot {
    justify-content: center;
}

.mapboxgl-ctrl-info {
  background-repeat: no-repeat;
  background-position: center center;
  background-image: url(data:image/svg+xml,%3C%3Fxml%20version%3D%221.0%22%20encoding%3D%22utf-8%22%3F%3E%0A%3C%21--%20Generator%3A%20Adobe%20Illustrator%2019.2.1%2C%20SVG%20Export%20Plug-In%20.%20SVG%20Version%3A%206.00%20Build%200%29%20%20--%3E%0A%3C%21DOCTYPE%20svg%20PUBLIC%20%22-%2F%2FW3C%2F%2FDTD%20SVG%201.1%2F%2FEN%22%20%22http%3A%2F%2Fwww.w3.org%2FGraphics%2FSVG%2F1.1%2FDTD%2Fsvg11.dtd%22%3E%0A%3Csvg%20version%3D%221.1%22%0A%09%20id%3D%22svg4619%22%20inkscape%3Aversion%3D%220.91%20r13725%22%20sodipodi%3Adocname%3D%22information-15.svg%22%20xmlns%3Acc%3D%22http%3A%2F%2Fcreativecommons.org%2Fns%23%22%20xmlns%3Adc%3D%22http%3A%2F%2Fpurl.org%2Fdc%2Felements%2F1.1%2F%22%20xmlns%3Ainkscape%3D%22http%3A%2F%2Fwww.inkscape.org%2Fnamespaces%2Finkscape%22%20xmlns%3Ardf%3D%22http%3A%2F%2Fwww.w3.org%2F1999%2F02%2F22-rdf-syntax-ns%23%22%20xmlns%3Asodipodi%3D%22http%3A%2F%2Fsodipodi.sourceforge.net%2FDTD%2Fsodipodi-0.dtd%22%20xmlns%3Asvg%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%0A%09%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20xmlns%3Axlink%3D%22http%3A%2F%2Fwww.w3.org%2F1999%2Fxlink%22%20x%3D%220px%22%20y%3D%220px%22%20width%3D%2215px%22%20height%3D%2215px%22%0A%09%20viewBox%3D%220%200%2015%2015%22%20style%3D%22enable-background%3Anew%200%200%2015%2015%3B%22%20xml%3Aspace%3D%22preserve%22%3E%0A%3Cpath%20id%3D%22rect8399%22%20inkscape%3Aconnector-curvature%3D%220%22%20sodipodi%3Anodetypes%3D%22ssssscccccccccccc%22%20style%3D%22fill%3A%23010101%3B%22%20d%3D%22M7.5%2C1%0A%09C6.7%2C1%2C6%2C1.7%2C6%2C2.5S6.7%2C4%2C7.5%2C4S9%2C3.3%2C9%2C2.5S8.3%2C1%2C7.5%2C1z%20M4%2C5v1c0%2C0%2C2%2C0%2C2%2C2v2c0%2C2-2%2C2-2%2C2v1h7v-1c0%2C0-2%2C0-2-2V6c0-0.5-0.5-1-1-1H4%0A%09z%22%2F%3E%0A%3C%2Fsvg%3E%0A);
  background-repeat: 0;
}

</style>

<template lang="html">
<div class="modal" v-if="firstVisit">
    <div class="modal-background"></div>
    <div class="modal-card">
        <header class="modal-card-head has-text-centered">
            <p class="modal-card-title">Copacul ÎnCotroceni</p>
        </header>
        <section class="modal-card-body">
            <!-- <h1 class="title is-3">Bine ai venit!</h1> -->
            <h2 class="subtitle is-5">Mulțumim pentru implicarea în acest proiect!</h2>
            <div class="content box">
                <!-- <p>
                    Ajută-ne să păstrăm un cartier sănătos prin întreținerea spațiului verde reprezentat de copacii din aliniamentul stradal.
                </p> -->
                <p>
                    <b>Ghid rapid pentru un cartier verde:</b>
                </p>
                <ol>
                    <li>
                        Alege un copac din preajmă (cerc verde).
                    </li>
                    <li>
                        Selectează starea lui actuală.
                    </li>
                    <li>
                        Încarcă o poză care îi arată starea. <br /><small>(aplicația îți va arăta când aceasta se termină de încărcat)</small>
                    </li>
                </ol>
            </div>
            <p>
                Noi centralizăm rapoartele și le trimitem autorităților competente, pentru o soluționare cât mai rapidă a problemei.
            </p>
        </section>
        <footer class="modal-card-foot is-flex">
            <a class="button is-primary is-medium" @click="setFirstVisit">Am înțeles</a>
        </footer>
    </div>
</div>
</template>

<script>
export default {
  data() {
    return {
      firstVisit: true
    }
  },
  mounted() {
    this.firstVisit = !this.$cookie.get('firstVisit')
    let info = document.createElement('div')
    info.innerHTML = '<div class="mapboxgl-ctrl-group mapboxgl-ctrl"><button id="showInfo" class="mapboxgl-ctrl-icon mapboxgl-ctrl-info" type="button"></button></div>'
    document.getElementsByClassName('mapboxgl-ctrl-top-right')[0].appendChild(info)
    document.getElementById('showInfo').onclick = (evt)=>{
      this.firstVisit = true
    }
  },
  methods: {
    setFirstVisit() {
      this.$cookie.set('firstVisit', 'true', 365) // days
      this.firstVisit = false
    }
  }
}
</script>
