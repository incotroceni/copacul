<template lang="html">
  <div class="uploadSection">
    <figure id="popupFigure" class="image is-3by4">
      <span id="loadingIcon" v-show="isUploading" class="icon is-overlay is-large">
        <i class="fa fa-circle-o-notch fa-spin fa-fw is-success"></i><br/>
        <progress class="progress is-success" :value="uploadProgress" max="100">{{uploadProgress}}%</progress>
      </span>
      <img ref="uploadedImage" class="imageUpload" @load="isUploading=false"
        :src="arborePozaThumb || 'static/img/placeholder.jpg'">
    </figure>
    <div class="fileUploadButton button is-outline is-centered" :class="{pulse: isPulsing}">
      <span class="icon is-small"><i class="fa fa-camera"></i></span>
      <span>{{buttonMessage}}</span>
    </div>
    <input type="file" class="upload" accept="image/*" @change="uploadPhoto"/>
  </div>
</template>

<script>
// @flow
import dataURLtoBlob from 'blueimp-canvas-to-blob'
import Promise from 'bluebird'
import Toast from 'vue-toast-mobile'
let toastMessage = {
  message: 'Poză trimisă!',
  position: 'top',
  duration: 1500,
  className: "notification is-success is-custom",
  iconClass: "fa fa-check fa-2x"
}

export default {
  data() {
    return {
      uploadProgress: 0,
      isUploading: true
    }
  },
  props: ['arborePozaThumb', 'reportDetails', 'reportId'],
  computed: {
    buttonMessage() {
      return this.arborePozaThumb ? "Schimbă poza" : "Adaugă poză"
    },
    isPulsing(){
      return !this.arborePozaThumb
    }
  },
  mounted() {

  },
  methods: {
    uploadPhoto(evt) {
      evt.preventDefault()
        // read image
      let image = new FileReader()
      image.onload = (e) => {
        if (e.target.result) {
          // show preview and change button text
          this.$refs.uploadedImage.src = e.target.result
            // show spinner and start uploading image
          this.isUploading = true

          // in parallel (map Promises)
          Promise.all([
              // upload full-size image
              uploadFullImage(e.target.result, this),
              // generate and upload thumb
              generateThumb(e.target.result, {
                width: 200,
                height: 150
              }).then((blob) => {
                return uploadThumb(blob, this)
              })
              // Promise.resolve("thumbUrl")
            ])
            // then, create or update record
            .then((urls) => {
              if (this.reportId !== null) {
                let updates = {}
                updates['/arborePoza'] = urls[0]
                updates['/arborePozaThumb'] = urls[1]
                this.arborePozaThumb = urls[1]
                window.firebase.database().ref(this.reportId).update(updates)
              } else {
                let createPayload = {
                  arboreId: this.reportDetails.arboreId,
                  arboreLngLat: this.reportDetails.arboreLngLat,
                  reportLngLat: this.reportDetails.reportLngLat,
                  createdAt: firebase.database.ServerValue.TIMESTAMP,
                  arborePoza: urls[0],
                  arborePozaThumb: urls[1]
                }
                let reportId = `/trees-users/${this.reportDetails.arboreId}/${this.reportDetails.userId}`
                window.firebase.database().ref(reportId).set(createPayload)
              }
            })
            // then, set uploadFinished
            .then((res) => {
              this.isUploading = false
              Toast(toastMessage)
            })
            .catch((err) => {
              console.log(err)
            })
        }
      }

      // begin loading image if selected in dialog
      if (evt.target.files[0]) {
        image.readAsDataURL(evt.target.files[0])
      }
    }
  },
  components: {

  }
}


function uploadFullImage(url: String, vm: Object): Promise < String > {
  vm.arborePoza = url

  // get storage ref for files
  let pozaId = `arbori/${vm.reportDetails.arboreId}/${vm.reportDetails.userId}/fullsize.jpg`
  let arborePozaRef = window.firebase.storage().ref(pozaId)

  let file = dataURLtoBlob(url)
  let uploadRef = arborePozaRef.put(file)

  return new Promise((resolve, reject) => {
    uploadRef.on('state_changed',
      (snapshot) => {
        vm.isUploading = true
        let progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        vm.uploadProgress = progress
          // console.log('Upload is ' + progress + '% done');
        switch (snapshot.state) {
          case window.firebase.storage.TaskState.PAUSED: // or 'paused'
            console.log('Upload is paused');
            break;
          case window.firebase.storage.TaskState.RUNNING: // or 'running'
            console.log('Upload is running');
            break;
        }
      },
      (error) => {
        // Handle unsuccessful uploads
        // console.log(error)
        reject(error)
      },
      () => {
        loadImage.parseMetaData(file, (data) => {
          // console.log(data)
          if (data.exif) {
            let metadata= {}
            metadata['customMetadata'] = data.exif.getAll()
            // console.log(metadata.customMetadata)
            arborePozaRef.updateMetadata(metadata)
              .then((meta) => {
                // done
                resolve(uploadRef.snapshot.downloadURL)
              })
              .catch((err) => {
                console.log(err)
                  // done
                resolve(uploadRef.snapshot.downloadURL)
              })
          } else {
            resolve(uploadRef.snapshot.downloadURL)
          }
        }, {
          disableImageHead: true
        })
      })
  })
}

function generateThumb(imageDataURI: String, maxDimensions: {
  width: number,
  height: number
}): Promise < Blob > {
  return new Promise((resolve, reject) => {
    let image = loadImage(dataURLtoBlob(imageDataURI), (img) => {
      if (img.type === "error") {
        reject(img)
      }

      // document.getElementById('popupFigure').appendChild(img)
      // console.log("Thumb resized")

      img.toBlob((blob) => {
        resolve(blob)
      })
    }, {
      orientation: true,
      maxWidth: maxDimensions.width,
      maxHeight: maxDimensions.height,
      contain: true
    })
  })
}

function uploadThumb(blob: Blob, vm: Object): Promise < String > {
  let pozaThumbId = `arbori/${vm.reportDetails.arboreId}/${vm.reportDetails.userId}/thumb.jpg`
  let arborePozaThumbRef = window.firebase.storage().ref(pozaThumbId)
  let uploadThumbRef = arborePozaThumbRef.put(blob)

  return new Promise((resolve, reject) => {
    uploadThumbRef.on('state_changed',
      (snapshot) => {
        vm.isUploading = true
      },
      (error) => {
        reject(error)
      },
      () => {
        (resolve(uploadThumbRef.snapshot.downloadURL))
      })
  })
}

// UTILS

function dataURItoBlob(dataURI) {
  var binary = atob(dataURI.split(',')[1]);
  var array = [];
  for (var i = 0; i < binary.length; i++) {
    array.push(binary.charCodeAt(i));
  }
  return new Blob([new Uint8Array(array)], {
    type: 'image/jpeg'
  });
}

function blobToDataURI(blob, callback) {
  var a = new FileReader();
  a.onload = function(e) {
    callback(e.target.result);
  }
  a.readAsDataURL(blob);
}


/**
 * Conserve aspect ratio of the orignal region. Useful when shrinking/enlarging
 * images to fit into a certain area.
 *
 * @param {Number} srcWidth Source area width
 * @param {Number} srcHeight Source area height
 * @param {Number} maxWidth Fittable area maximum available width
 * @param {Number} maxHeight Fittable area maximum available height
 * @return {Object} { width, heigth }
 */
function calculateAspectRatioFit(srcWidth, srcHeight, maxWidth, maxHeight) {
  var ratio = Math.min(maxWidth / srcWidth, maxHeight / srcHeight);
  return {
    width: srcWidth * ratio,
    height: srcHeight * ratio
  };
}
</script>

<style lang="css">
.uploadSection {
  display: flex;
  flex-direction: column;
  overflow: hidden;
  position: relative;
}

.imageUpload {
  max-width: 150px;
  /*width: 100%;*/
  margin: auto;
}

.fileUploadButton {
  overflow: hidden;
  margin-top: 10px;
}

input.upload {
  position: absolute;
  right: 0;
  bottom: 0;
  left: 0;
  margin: 0;
  padding: 0;
  font-size: 26px;
  cursor: pointer;
  opacity: 0;
  filter: alpha(opacity=0);
}

#loadingIcon {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: rgba(222,222,222,0.5);
  padding: 5px;
}

.is-3by4 {
  max-width: 150px;
  max-height: 200px;
}

.image img {
  width: inherit;
}

.pulse {
  box-shadow: inset 0px 0px 10px 10px rgba(35, 209, 96, 0.3);
  animation: pulse 2.5s infinite;
}

.pulse:hover {
  animation: none;
}

@keyframes pulse {
  0% {
    box-shadow: inset 0px 0px 5px 5px rgba(35, 209, 96, 0);
  }
  20% {
    box-shadow: inset 0px 0px 5px 5px rgba(35, 209, 96, 0.3);
  }
  70% {
      box-shadow: inset 0px 0px 5px 5px rgba(35, 209, 96, 0);
  }
  100% {
      box-shadow: inset 0px 0px 5px 5px rgba(35, 209, 96, 0);
  }
}
</style>
