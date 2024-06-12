<script>
import { storage } from "../services/firebase";
import { uploadBytes, listAll, ref } from "firebase/storage";
import FilesCard from "./FilesCard.vue";
import FolderCard from "./FolderCard.vue";

export default {
  name: "ColorChangeDiv",
  props: {
    id: String,
    method: String,
  },
  components: {
    FilesCard,
    FolderCard,
  },
  data() {
    return {
      color: this.changeColor(),
      folder: "",
      listAllFolder: [],
      listAllFiles: [],
    };
  },
  computed: {
    nameMethod() {
      if (this.method === "uploadFile") {
        return "Upload file";
      }

      if (this.method === "loadFile") {
        return "Load files";
      }

      return null;
    },
  },
  methods: {
    changeColor() {
      let r = Math.floor(Math.random() * 255);
      let g = Math.floor(Math.random() * 255);
      let b = Math.floor(Math.random() * 255);

      const color = `rgb(${r}, ${g}, ${b})`;
      return color;
    },

    getFunction() {
      if (this.method === "loadFile") {
        return this.loadFiles("myFiles/");
      }

      return null;
    },

    getColor() {
      this.color = this.changeColor();
      this.getFunction();
    },

    uploadFile() {
      const file = this.$refs.myfile.files[0];
      console.log(file);

      const storageRef = ref(storage, `myFiles/${this.folder}/${file.name}`);
      uploadBytes(storageRef, file)
        .then((res) => {
          console.log({ res });
          this.loadFiles("myFiles/");
        })
        .catch((err) => {
          console.log(err);
        });
    },

    loadFiles(path) {
      const listRef = ref(storage, path);
      listAll(listRef)
        .then((res) => {
          this.listAllFiles = [];
          this.listAllFolder = [];
          console.log(res);
          res.prefixes.forEach((folderRef) => {
            this.listAllFolder.push(folderRef);
          });

          res.items.forEach((itemRef) => {
            this.listAllFiles.push(itemRef);
          });
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },
};
</script>

<template>
  <div
    class="color-change-container"
    :style="{ backgroundColor: color }"
    @click="getColor"
  >
    <label class="color-change-content">
      <h1>{{ nameMethod }}</h1>
      <div v-if="id === '1'">
        <input type="file" ref="myfile" />
        folder: <input type="text" placeholder="newFolder" v-model="folder" />
        <button @click="uploadFile">upload</button>
      </div>

      <div v-if="id === '2'" class="results">
        <FolderCard
          v-for="folder in listAllFolder"
          :key="folder._location.path_"
          :name="folder._location.path_"
          :loadFiles="loadFiles"
        />

        <FilesCard
          v-for="file in listAllFiles"
          :key="file._location.path_"
          :name="file._location.path_"
          :loadFiles="loadFiles"
        />

        <h1 v-if="listAllFiles.length === 0">Folder empty</h1>
      </div>
    </label>
  </div>
</template>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.color-change-container {
  display: flex;
  border-radius: 8px;
  width: 100%;
  height: 100%;
  cursor: pointer;
  background-color: aquamarine;
  transition: all 0.3s;

  &:hover {
    transform: scale(1.01);
  }
}

.color-change-content {
  display: flex;
  gap: 8px;
  padding: 16px;
  flex-direction: column;
  justify-content: center;
  width: 100%;
  height: 100%;

  & div {
    display: flex;
    flex-direction: column;
    gap: 4px;

    & button {
      padding: 5px;
    }
  }

  & input {
    padding: 3px;
  }
}
</style>
