<script>
import ColorChangeDiv from './components/ColorChangeDiv.vue'

export default {
  name: 'App',
  components: {
    ColorChangeDiv
  }
}

</script>

<template>
  <main class="color-change-section">
    <ColorChangeDiv />
    <ColorChangeDiv />
    <ColorChangeDiv />
  </main>
</template>

<style>
.color-change-section {
  display: flex;
  gap: 2rem;
  padding: 2rem;
  width: 100%;
  height: 100vh;
}
</style>
