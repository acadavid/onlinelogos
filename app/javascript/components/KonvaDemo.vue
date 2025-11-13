<template>
  <div class="konva-demo">
    <h3 class="text-xl font-semibold mb-3">Konva Canvas Demo</h3>
    <p class="text-gray-600 mb-4">
      Drag the shapes around! Click the circle to change its color.
    </p>

    <v-stage
      :config="stageConfig"
      @mousedown="handleStageMouseDown"
      @touchstart="handleStageMouseDown"
      class="border-2 border-gray-300 rounded"
    >
      <v-layer>
        <!-- Background rectangle -->
        <v-rect :config="backgroundConfig" />

        <!-- Draggable circle -->
        <v-circle
          :config="circleConfig"
          @click="changeCircleColor"
          @tap="changeCircleColor"
        />

        <!-- Draggable star -->
        <v-star :config="starConfig" />

        <!-- Draggable rectangle -->
        <v-rect :config="rectConfig" />

        <!-- Text label -->
        <v-text :config="textConfig" />
      </v-layer>
    </v-stage>

    <div class="mt-4 text-sm text-gray-500">
      <p>This demonstrates Konva.js working with Vue 3</p>
      <p>Stage size: {{ stageConfig.width }}x{{ stageConfig.height }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'

const stageConfig = reactive({
  width: 600,
  height: 400
})

const backgroundConfig = reactive({
  x: 0,
  y: 0,
  width: 600,
  height: 400,
  fill: '#f0f0f0'
})

const circleConfig = reactive({
  x: 100,
  y: 100,
  radius: 50,
  fill: '#00D2FF',
  stroke: '#0066CC',
  strokeWidth: 4,
  draggable: true,
  shadowBlur: 10,
  shadowColor: 'black',
  shadowOpacity: 0.3
})

const starConfig = reactive({
  x: 300,
  y: 200,
  numPoints: 5,
  innerRadius: 30,
  outerRadius: 60,
  fill: '#FFD700',
  stroke: '#FF8C00',
  strokeWidth: 4,
  draggable: true,
  rotation: 0,
  shadowBlur: 10,
  shadowColor: 'black',
  shadowOpacity: 0.3
})

const rectConfig = reactive({
  x: 450,
  y: 100,
  width: 100,
  height: 80,
  fill: '#FF6B6B',
  stroke: '#C92A2A',
  strokeWidth: 4,
  cornerRadius: 10,
  draggable: true,
  shadowBlur: 10,
  shadowColor: 'black',
  shadowOpacity: 0.3
})

const textConfig = reactive({
  x: 20,
  y: 350,
  text: 'Interactive Konva Canvas',
  fontSize: 20,
  fontFamily: 'Arial',
  fill: '#333'
})

const colors = ['#00D2FF', '#4ECDC4', '#FF6B6B', '#95E1D3', '#F38181', '#AA96DA']
let colorIndex = 0

function changeCircleColor() {
  colorIndex = (colorIndex + 1) % colors.length
  circleConfig.fill = colors[colorIndex]
}

function handleStageMouseDown(e) {
  if (e.target === e.target.getStage()) {
    console.log('Clicked on empty space')
  }
}
</script>

<style scoped>
.konva-demo {
  padding: 1.5rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}
</style>
