<template>
  <div class="welcome">
    <el-card class="box-card">
      <form class="card-body" v-on:submit="submit">
        <img src="../assets/logo.png" class="logo card-content">
        <el-input placeholder="Please enter the room name" class="card-content" v-model="room"></el-input>
        <el-button type="primary" class="card-content go" native-type="submit">Go</el-button>
      </form>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'Welcome',
  data () {
    return {
      room: ''
    }
  },
  methods: {
    submit: function (ev) {
      if (/[^A-Za-z0-9_]/.test(this.room)) { // conforms Vue's parameter regexp: https://github.com/pillarjs/path-to-regexp#parameters
        this.$message.error('Room name can contain only alphanumeric + underscore!')
      } else {
        this.$router.push(this.room)
      }
      ev.preventDefault()
    }
  }
}
</script>

<style scoped>
.welcome {
  display: flex;
  flex-direction: column; /* 子要素をflexboxにより縦方向に揃える */
  justify-content: center; /* 子要素をflexboxにより中央に配置する */
  align-items: center;  /* 子要素をflexboxにより中央に配置する */
  height: 100%;
}
.card-content {
  margin-top: 10px;
  margin-bottom: 10px;
}
.logo {
  display: block;
  margin-left: auto;
  margin-right: auto;
  width: 200px;
}
.go {
  width: 100%;
}
@media screen and (max-width: 500px) {
  .box-card {
    width: 95%;
  }
}
@media screen and (min-width: 500px) {
  .box-card {
    width: 480px;
  }
}
</style>
