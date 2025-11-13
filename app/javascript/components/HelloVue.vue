<template>
  <div class="hello-vue">
    <h2 class="text-2xl font-bold mb-4">{{ message }}</h2>
    <button
      @click="count++"
      class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
    >
      Clicked {{ count }} times
    </button>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const message = ref('Hello from Vue 3!')
const count = ref(0)
</script>

<style scoped>
.hello-vue {
  padding: 2rem;
  border: 2px solid #42b883;
  border-radius: 8px;
  background-color: #f9f9f9;
}
</style>
