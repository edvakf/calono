<template>
  <el-container class="room">
    <div class="controls">
      <div>
        <button @click="startBroadcasting" v-if="!broadcasting">Start Broadcasting</button>
        <button @click="stopBroadcasting" v-if="broadcasting">Stop Broadcasting</button>
      </div>
    </div>
    <el-container>
      <el-header class="main" height="60vh">
        <video ref="video" class="main-video" autoplay muted></video>
      </el-header>
      <el-footer class="footer" height="40vh">
        <small-video v-for="(stream, peerId) in streams" :is-local="peerId === myPeerId" :stream="stream" :key="peerId"/>
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
      room: null,
      broadcasting: false
    }
  },
  mounted () {
    this.peer = new Peer({key: Config.SKYWAY_API_KEY, debug: 2})

    // successfully connected to a signaling server
    this.peer.on('open', myPeerId => {
      // console.log('my peerId ' + myPeerId)
      this.myPeerId = myPeerId

      // enter a mesh room
      this.room = this.peer.joinRoom(this.name, {
        mode: 'mesh'
        // stream: this.localStream
      })

      // a peer has joined
      this.room.on('peerJoin', peerId => {
        console.log('peerJoin: peer id ' + peerId) // TODO: とりあえずプレースホルダーだけは表示する？
        Vue.delete(this.streams, peerId)
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

      // other peers' stream was removed
      this.room.on('removeStream', stream => {
        console.log('removeStream: peer id ' + stream.peerId)
        Vue.set(this.streams, stream.peerId, null) // TODO: とりあえずプレースホルダーだけは表示する？
      })
    })

    this.peer.on('error', err => {
      console.log(err)
    })

    this.peer.on('disconnected', peerId => {
      console.log(peerId)
    })
  },
  beforeDestroy () {
    if (this.room) {
      this.room.close()
    }
  },
  methods: {
    startBroadcasting () {
      this.broadcasting = true
      navigator.mediaDevices.getUserMedia({video: true, audio: true})
        .then(stream => {
          this.$refs.video.srcObject = stream
          this.localStream = stream

          if (this.myPeerId) {
            Vue.set(this.streams, this.myPeerId, stream)
          }

          if (this.room) {
            this.room.replaceStream(stream)
          }
        })
        .catch(err => {
          console.error('mediaDevice.getUserMedia() error:', err)
        })
    },
    stopBroadcasting () {
      this.broadcasting = false

      this.$refs.video.pause()
      this.$refs.video.srcObject = null

      if (this.localStream) {
        this.localStream.getAudioTracks()[0].stop()
        this.localStream.getVideoTracks()[0].stop()
      }

      if (this.room) {
        this.room.replaceStream(new MediaStream())
      }

      if (this.myPeerId) {
        Vue.delete(this.streams, this.myPeerId)
      }
    }
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
.controls {
  position: fixed;
  left: 0;
  top: 0;
  z-index: 1;
}
</style>
