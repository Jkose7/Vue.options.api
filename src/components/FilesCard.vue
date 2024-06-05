<script>
import { storage } from "../services/firebase";
import { ref, getDownloadURL, deleteObject } from "firebase/storage";
//import { getBlob } from "firebase/storage";

export default {
  name: "filesCard",
  props: {
    name: String,
    loadFiles: Function,
  },
  data() {
    return {
      openURL: "",
      downloadURL: "",
    };
  },
  computed: {
    shortName() {
      return this.name.split("").slice(0, 20).join("");
    },
  },
  methods: {
    deleteFile() {
      const fileRef = ref(storage, this.name);

      deleteObject(fileRef)
        .then((res) => {
          console.log("delete", res);
          this.loadFiles("myFiles/");
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },
  mounted() {
    getDownloadURL(ref(storage, this.name))
      .then((URL) => {
        this.openURL = URL;
      })
      .catch((err) => {
        console.log(err);
      });

    // getBlob(ref(storage, this.name))
    //   .then((URL) => {
    //     this.downloadURL = URL;
    //   })
    //   .catch((err) => {
    //     console.log(err);
    //   });
  },
};
</script>

<template>
  <div class="file-card">
    <h3>📃 {{ shortName }}</h3>
    <div class="file-card-buttons">
      <button>
        <a :download="name" :href="openURL" target="_blank">download</a>
      </button>
      <button @click="deleteFile">remove</button>
    </div>
  </div>
</template>

<style scoped>
.file-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #fff;
  border-radius: 4px;
  color: #000;
  padding: 8px;
  width: 100%;
}

.file-card p {
  background-color: transparent;
  color: #000;
}

.file-card-buttons {
  display: flex;
  gap: 8px;
}

.file-card-buttons button {
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

a {
  text-decoration: none;
  background-color: transparent;
  color: black;
}

@media (max-width: 800px) {
  .file-card h3 {
    font-size: 15px;
  }

  .file-card-buttons button {
    padding: 2px 2px;
    border: none;
    background-color: rgba(192, 192, 192, 0.99);
    border-radius: 4px;
    cursor: pointer;
    transition: all 0.3s;
    font-size: 10px;
    font-weight: bold;

    &:hover {
      transform: scale(1.02);
    }
  }
}
</style>
