<template lang="html">
  <a class="button is-outline stareButton"
      :class="stareActuala == stare ? 'is-success': (stareUpdating == stare ? 'is-loading': '')"
      :key="stare">
    <span>{{ stare }}</span>
  </a>
</template>

<script>
export default {
  data() {
    return {

    }
  },
  props: ['stare', 'stareActuala', 'stareUpdating'],
  computed: {},
  mounted() {},
  methods: {
  },
  components: {}
}
</script>

<style lang="css">
.stareButton {
  min-width: 100%;
}
</style>
