import { ref, computed } from 'vue'

export function useTimer() {
  const totalMs = ref(0)
  const isRunning = ref(false)
  let intervalId: ReturnType<typeof setInterval> | null = null

  const hours = computed(() => Math.floor(totalMs.value / 3600000))
  const minutes = computed(() => Math.floor((totalMs.value % 3600000) / 60000))
  const seconds = computed(() => Math.floor((totalMs.value % 60000) / 1000))

  const display = computed(() => {
    const h = String(hours.value).padStart(2, '0')
    const m = String(minutes.value).padStart(2, '0')
    const s = String(seconds.value).padStart(2, '0')
    return `${h}:${m}:${s}`
  })

  const totalSeconds = computed(() => totalMs.value / 1000)

  function start() {
    if (isRunning.value) return
    isRunning.value = true
    const startTime = Date.now() - totalMs.value
    intervalId = setInterval(() => {
      totalMs.value = Date.now() - startTime
    }, 100)
  }

  function pause() {
    if (!isRunning.value) return
    isRunning.value = false
    if (intervalId) {
      clearInterval(intervalId)
      intervalId = null
    }
  }

  function reset() {
    pause()
    totalMs.value = 0
  }

  return { display, totalSeconds, isRunning, start, pause, reset }
}
