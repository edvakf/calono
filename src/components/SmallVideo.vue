<template>
  <video ref="video" class="small-video" autoplay></video>
</template>

<script>
export default {
  name: 'SmallVideo',
  props: ['stream', 'isLocal'],
  mounted () {
    this.$refs.video.srcObject = this.stream
    if (this.isLocal) {
      this.$refs.video.muted = true
    }
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
