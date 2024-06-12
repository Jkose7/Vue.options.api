<script>
import ColorChangeDiv from "@/components/ColorChangeDiv.vue";

export default {
  name: "FileDiv",
  components: {
    ColorChangeDiv,
  },
  data() {
    return {
      divOptions: [
        {
          id: "1",
          method: "uploadFile",
        },
        {
          id: "2",
          method: "loadFile",
        },
        {
          id: "3",
          method: null,
        },
      ],
    };
  },
};
</script>

<template>
  <section class="main-container">
    <ColorChangeDiv
      v-for="div in divOptions"
      :key="div.id"
      :id="div.id"
      :method="div.method"
    />
  </section>
</template>

<style>
.main-container {
  display: flex;
  height: 100vh;
  width: 100%;
  padding: 2rem;
  gap: 2rem;
}

@media (max-width: 1000px) {
  .main-container {
    flex-direction: column;
    height: 100%;
  }
}
</style>
