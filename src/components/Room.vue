<template>
  <el-container class="room">
    <el-container>
      <el-header class="main" height="60vh">
        <video ref="video" class="main-video" autoplay></video>
      </el-header>
      <el-footer class="footer" height="40vh">
        <small-video v-for="(stream, peerId) in streams" :key="peerId" :stream="stream"/>
      </el-footer>
    </el-container>
  </el-container>
</template>

<script>
import Vue from 'vue'
import Peer from 'skyway-js'
import SmallVideo from '@/components/SmallVideo'
import Config from '@/config.js'

export default {
  name: 'Room',
  components: {
    'small-video': SmallVideo
  },
  data () {
    return {
      name: this.$route.params.name,
      peer: null,
      myPeerId: null,
      streams: {},
      localStream: null,
      room: null
    }
  },
  mounted () {
    navigator.mediaDevices.getUserMedia({video: true, audio: true})
      .then(stream => {
        this.$refs.video.srcObject = stream
        this.localStream = stream

        this.peer = new Peer({key: Config.SKYWAY_API_KEY, debug: 3})

        // successfully connected to a signaling server
        this.peer.on('open', id => {
          console.log('my peerId ' + id)
          this.myPeerId = id

          // enter a mesh room
          this.room = this.peer.joinRoom(this.name, {
            mode: 'mesh',
            stream: this.localStream
          })

          // a peer has left
          this.room.on('peerLeave', peerId => {
            console.log('peerLeave: peer id ' + peerId)
            Vue.delete(this.streams, peerId)
          })

          // received other peers' stream
          this.room.on('stream', stream => {
            console.log('stream: peer id ' + stream.peerId)
            Vue.set(this.streams, stream.peerId, stream)
          })
        })
      })
      .catch(err => {
        console.error('mediaDevice.getUserMedia() error:', err)
      })
  },
  beforeDestroy () {
    if (this.room) {
      this.room.close()
    }
  },
  methods: {
  }
}
</script>

<style scoped>
.aside {
  background-color: green;
}
.main {
  background-color: orange;
  padding: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.footer {
  background-color: yellow;
}
.main-video {
  width: 100%;
  height: 100%;
}
</style>
