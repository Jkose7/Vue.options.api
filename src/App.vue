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
  <section>
    <h1>Click to change color</h1>
    <main class="color-change-section">
      <ColorChangeDiv />
      <ColorChangeDiv />
      <ColorChangeDiv />
    </main>
  </section>
</template>

<style>

section{
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100vh;
  justify-content: center;
  align-items: center;
}

section h1{
  padding: 20px;
  color:white
}


.color-change-section {
  display: flex;
  gap: 2rem;
  padding: 0rem 2rem 2rem;
  width: 100%;
  height: 100%;
}
</style>
