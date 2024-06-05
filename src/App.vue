<script>
import File from "./Views/File.vue";

export default {
  name: "App",
  components: {
    File,
  },
};
</script>

<template>
  <section class="main">
    <h1>Upload and Download files ⚡</h1>

    <article class="files">
      <File/>
    </article>
  </section>
</template>

<style scoped>
.main {
  display: flex;
  flex-direction: column;
  width: 100%;
  align-items: center;
  gap: 16px;
  padding: 8rem;
}

.main > h1 {
  font-size: 34px;
  color: white;
}

.files {
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 8px;
  align-self: flex-start;
}

@media (max-width: 800px) {
  section {
    padding: 1rem;
  }
}
</style>
