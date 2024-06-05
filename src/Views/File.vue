<script>
import { storage } from "../services/firebase";
import { ref, listAll, uploadBytes } from "firebase/storage";

import FilesCard from "../components/FilesCard.vue";
import FolderCard from "../components/FolderCard.vue";

export default {
  name: "filesCard",
  components: {
    FilesCard,
    FolderCard,
  },
  data() {
    return {
      folder: "",
      openURL: "",
      listAllFiles: [],
      listAllFolder: [],
    };
  },
  methods: {
    uploadFile() {
      const file = this.$refs.myfile.files[0];
      console.log(file);

      console.log(this.folder)

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

  mounted() {
    this.loadFiles("myFiles/");
  },
};
</script>

<template>
  <section class="files-section">
    <div class="upload-file-container">
      <div class="folder-selection">
        folder: <input type="text" placeholder="/NewFolder/" v-model="folder" />
        <input type="file" ref="myfile" />

      </div>
      <button @click.prevent="uploadFile">upload file</button>
    </div>

    <h1 class="back">
      <span class="back-arrow" @click="loadFiles('myFiles/')">⬅️</span> Your
      files:
    </h1>

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

    <h1 class="empty" v-if="listAllFiles.length === 0">folder is empty</h1>
  </section>
</template>

<style scoped>
.files-section {
  width: 100%;
  color: #fff;
  display: flex;
  gap: 16px;
  flex-direction: column;
}

.upload-file-container {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.upload-file-container button{
  padding: 5px;
  font-weight: 600;
  font-size: 16px;
  border: none;
  border-radius: 4px;
  background-color: rgb(167, 221, 252);
  transition: all .3s ease-in-out;

  &:hover{
    transform: scale(1.02);
    background-color: rgb(130, 205, 249);
  }
}

.folder-selection {
  display: flex;
  align-items: center;
  gap: 4px;
}

.folder-selection input{
  padding: 5px 5px;
  border-radius: 4px;
  border: none;
}

a {
  text-decoration: none;
  background-color: transparent;
  color: black;
}

.empty {
  align-self: flex-end;
}

.back-arrow,
.back {
  cursor: pointer;
  font-size: 24px;
}
</style>
