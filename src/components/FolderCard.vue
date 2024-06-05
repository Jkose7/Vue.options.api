<script>
export default {
  name: "FolderCard",
  props: {
    name: String,
    loadFiles: Function,
  },
};
</script>

<template>
  <div class="folder-card">
    <h3>📒 {{ name }}</h3>
    <div class="folder-card-buttons">
      <button @click="loadFiles(name)">open</button>
    </div>
  </div>
</template>

<style scoped>
.folder-card {
  display: flex;
  justify-content: space-between;
  border-radius: 4px;
  align-items: center;
  align-self: flex-end;
  background-color: #a8a6a6;
  color: #000;
  padding: 10px;
  width: 95%;
}

.folder-card p {
  background-color: transparent;
  color: #000;
}

.folder-card-buttons {
  display: flex;
  gap: 8px;
}

.folder-card-buttons button {
  padding: 5px 5px;
  border: none;
  background-color: rgba(192, 192, 192, 0.99);
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s;

  &:hover {
    transform: scale(1.02);
  }
}

@media (max-width: 800px) {  
  .folder-card h3 {
    font-size: 15px;
  }
}
</style>
