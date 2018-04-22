<template>
  <video ref="video" class="small-video" autoplay></video>
</template>

<script>
export default {
  name: 'SmallVideo',
  props: ['stream'],
  mounted () {
    this.$refs.video.srcObject = this.stream
  },
  data () {
    return {
      // room: ''
    }
  }
}
</script>

<style scoped>
video {
  width: 200px;
  height: 200px;
}
</style>
