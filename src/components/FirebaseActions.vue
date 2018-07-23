<template lang="html">

</template>

<script>
export default {
  data() {
    return {}
  },
  computed: {},
  mounted() {
    bus.$on('updateReport', function(data) {
      console.log("Writing report to Firebase")
    })

    bus.$on('uploadPhoto', function(data) {
      console.log("Uploading photo to Firebase")
    })
  },
  methods: {},
  components: {}
}
</script>

<style lang="css">
</style>
