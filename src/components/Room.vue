<template>
  <div class="room">
    {{ name }}
  </div>
</template>

<script>
export default {
  name: 'Room',
  data () {
    return {
      name: this.$route.params.name
    }
  },
  methods: {
  }
}
</script>

<style scoped>
</style>
