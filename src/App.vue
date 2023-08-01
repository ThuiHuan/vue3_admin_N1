<script setup lang="ts">
import HelloWorld from './components/HelloWorld.vue'
const str = 'i love you'
console.log(str)
</script>

<template>
  <div class="box">
    <h1>asdsa</h1>
  </div>
  <HelloWorld msg="Vite + Vue" />
</template>

<style scoped lang="sass">
.box{
  width: 600px;
  height: 400px;
  background-color: red;
  h1{
    color: black
    }
  }
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}

.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}

.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
