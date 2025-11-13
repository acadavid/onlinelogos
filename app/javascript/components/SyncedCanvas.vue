<template>
  <div class="synced-canvas">
    <h3 class="text-xl font-semibold mb-3">Real-Time Synchronized Canvas</h3>

    <div v-if="!connected" class="mb-4 p-4 bg-yellow-100 border border-yellow-400 rounded">
      <p class="text-yellow-800">
        <span v-if="connecting">Connecting to game server...</span>
        <span v-else-if="error">{{ error }}</span>
        <span v-else>Not connected</span>
      </p>
    </div>

    <div v-else class="mb-4 p-3 bg-green-100 border border-green-400 rounded">
      <p class="text-green-800 text-sm">
        ✓ Connected to room: {{ roomIdDisplay }}
        <br>
        Players online: {{ playerCount }}
      </p>
    </div>

    <p class="text-gray-600 mb-4 text-sm">
      Drag the circles! All connected clients see the same state in real-time.
    </p>

    <v-stage
      :config="stageConfig"
      class="border-2 border-gray-300 rounded bg-white"
    >
      <v-layer>
        <!-- Render all shapes from Colyseus state -->
        <v-circle
          v-for="shape in shapes"
          :key="shape.id"
          :config="{
            id: shape.id,
            x: shape.x,
            y: shape.y,
            radius: shape.radius,
            fill: shape.color,
            stroke: shape.draggedBy ? '#000' : '#666',
            strokeWidth: shape.draggedBy ? 3 : 1,
            draggable: !shape.draggedBy || shape.draggedBy === sessionId,
            opacity: shape.draggedBy && shape.draggedBy !== sessionId ? 0.5 : 1
          }"
          @dragstart="handleDragStart(shape.id)"
          @dragmove="handleDragMove(shape.id, $event)"
          @dragend="handleDragEnd(shape.id)"
        />
      </v-layer>
    </v-stage>

    <div class="mt-4 text-xs text-gray-500">
      <p>Open this page in multiple browser windows to see real-time sync!</p>
      <p v-if="sessionId">Your session ID: {{ sessionId }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, onUnmounted } from 'vue'
import { Client, Room } from 'colyseus.js'

const props = defineProps({
  roomId: {
    type: String,
    required: true
  }
})

const stageConfig = reactive({
  width: 700,
  height: 400
})

const client = new Client('ws://localhost:2567')
let room = null

const connected = ref(false)
const connecting = ref(false)
const error = ref(null)
const roomIdDisplay = ref('')
const sessionId = ref('')
const playerCount = ref(0)
const shapes = ref([])

async function connectToRoom() {
  connecting.value = true
  error.value = null

  try {
    room = await client.joinOrCreate('game_room', { customRoomId: props.roomId })

    connected.value = true
    roomIdDisplay.value = room.id
    sessionId.value = room.sessionId

    console.log('Connected to room:', room.id)

    room.onStateChange((state) => {
      console.log('State changed, updating shapes')
      updateShapes()
    })

    room.onMessage('message', (message) => {
      console.log('Message from server:', message)
    })

    room.onLeave((code) => {
      console.log('Left room with code:', code)
      connected.value = false
    })

    room.onError((code, message) => {
      console.error('Room error:', code, message)
      error.value = `Connection error: ${message}`
    })
  } catch (e) {
    console.error('Failed to connect:', e)
    error.value = `Failed to connect: ${e.message}`
    connected.value = false
  } finally {
    connecting.value = false
  }
}

function updateShapes() {
  if (!room || !room.state || !room.state.shapes) {
    console.log('Room or state not ready yet')
    return
  }

  const shapeList = []
  room.state.shapes.forEach((shape, key) => {
    shapeList.push({
      id: key,
      x: shape.x,
      y: shape.y,
      radius: shape.radius,
      color: shape.color,
      type: shape.type,
      draggedBy: shape.draggedBy
    })
  })

  shapes.value = shapeList
  playerCount.value = room.state.playerCount || 0
}

function handleDragStart(shapeId) {
  if (room) {
    room.send('dragStart', { shapeId })
  }
}

function handleDragMove(shapeId, event) {
  if (room) {
    const shape = event.target
    room.send('move', {
      shapeId,
      x: shape.x(),
      y: shape.y()
    })
  }
}

function handleDragEnd(shapeId) {
  if (room) {
    room.send('dragEnd', { shapeId })
  }
}

onMounted(() => {
  connectToRoom()
})

onUnmounted(() => {
  if (room) {
    room.leave()
  }
})
</script>

<style scoped>
.synced-canvas {
  padding: 1.5rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}
</style>
