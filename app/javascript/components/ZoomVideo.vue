<template>
  <div class="zoom-video h-full flex flex-col">
    <div class="p-4 bg-gray-800 border-b border-gray-700">
      <h3 class="text-lg font-semibold text-white mb-2">Video Call</h3>

      <div v-if="!joined" class="space-y-3">
        <input
          v-model="userName"
          type="text"
          placeholder="Your name"
          class="w-full px-3 py-2 bg-gray-700 text-white rounded border border-gray-600 focus:outline-none focus:border-blue-500"
        />

        <button
          @click="joinSession"
          :disabled="joining || !userName.trim()"
          class="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-medium rounded transition-colors"
        >
          {{ joining ? 'Joining...' : 'Join Video Call' }}
        </button>

        <p v-if="error" class="text-xs text-red-400">{{ error }}</p>
      </div>

      <div v-else class="text-green-400 text-sm">
        ✓ Connected as {{ userName }}
      </div>
    </div>

    <!-- Zoom Video Container -->
    <div id="sessionContainer" class="flex-1 bg-black"></div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  sessionName: {
    type: String,
    required: true
  }
})

const userName = ref('')
const joined = ref(false)
const joining = ref(false)
const error = ref(null)
let uitoolkit = null

async function joinSession() {
  if (!userName.value.trim()) {
    error.value = 'Please enter your name'
    return
  }

  joining.value = true
  error.value = null

  try {
    const response = await fetch('/zoom/generate_jwt', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-Token': document.querySelector('meta[name="csrf-token"]')?.content || ''
      },
      body: JSON.stringify({
        session_name: props.sessionName,
        user_name: userName.value
      })
    })

    if (!response.ok) {
      throw new Error(`Failed to get JWT: ${response.statusText}`)
    }

    const data = await response.json()

    const config = {
      videoSDKJWT: data.signature,
      sessionName: props.sessionName,
      userName: userName.value,
      sessionPasscode: '',
      features: ['video', 'audio', 'share', 'chat', 'users']
    }

    console.log('Joining Zoom session with config:', config)

    uitoolkit = window.uitoolkit
    const sessionContainer = document.getElementById('sessionContainer')
    await uitoolkit.joinSession(sessionContainer, config)

    joined.value = true
    console.log('Successfully joined Zoom session')
  } catch (e) {
    console.error('Failed to join Zoom session:', e)
    error.value = `Failed to join: ${e.message}`
  } finally {
    joining.value = false
  }
}

onUnmounted(() => {
  if (uitoolkit && joined.value) {
    try {
      const sessionContainer = document.getElementById('sessionContainer')
      if (sessionContainer) {
        uitoolkit.closeSession(sessionContainer)
      }
    } catch (e) {
      console.error('Error closing Zoom session:', e)
    }
  }
})
</script>

<style scoped>
.zoom-video {
  height: 100%;
}

#sessionContainer {
  width: 100%;
}
</style>
