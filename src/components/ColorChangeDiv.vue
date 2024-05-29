<script>
export default {
  name: 'ColorChangeDiv',
  data() {
    return {
      color: this.changeColor()
    }
  },
  methods: {
    changeColor() {
      let r = Math.floor(Math.random() * 255)
      let g = Math.floor(Math.random() * 255)
      let b = Math.floor(Math.random() * 255)

      const color = `rgb(${r}, ${g}, ${b})`
      return color
    },
    getColor() {
      this.color = this.changeColor() 
    }
  }
}
</script>


<template>
  <div class="color-change-container" :style="{backgroundColor: color}" @click="getColor">
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
  transition: all .3s;

  &:hover {
    transform: scale(1.01);
  }
}
</style>
