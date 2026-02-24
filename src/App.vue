<script setup lang="ts">
import { ref, computed } from 'vue'
import { Clock, Calculator } from 'lucide-vue-next'
import { useTimer } from './composables/useTimer'
import { useCost } from './composables/useCost'
import type { Participant } from './composables/useCost'
import ParticipantList from './components/ParticipantList.vue'
import TimerPanel from './components/TimerPanel.vue'
import ReflectivePanel from './components/ReflectivePanel.vue'

const activeTab = ref<'live' | 'reflective'>('live')
const participants = ref<Participant[]>([])

// Timer Logic
const { display, totalSeconds, isRunning, start, pause, reset: resetTimer } = useTimer()
const { totalMinCost, totalMaxCost, totalMinCostPerSecond, totalMaxCostPerSecond } = useCost(participants, totalSeconds)

const hasParticipants = computed(() => participants.value.length > 0)

// Summary Logic
const showSummary = ref(false)
const summaryCostMin = ref(0)
const summaryCostMax = ref(0)
const summaryDuration = ref('')

function handleEnd() {
  pause()
  summaryCostMin.value = totalMinCost.value
  summaryCostMax.value = totalMaxCost.value
  summaryDuration.value = display.value
  showSummary.value = true
}

function handleReset() {
  resetTimer()
  showSummary.value = false
  summaryCostMin.value = 0
  summaryCostMax.value = 0
}

function handleStart() {
  if (showSummary.value) {
    // If starting a new session after summary
    handleReset()
  }
  start()
}

</script>

<template>
  <div class="min-h-screen bg-background font-sans antialiased text-foreground selection:bg-accent selection:text-accent-foreground pb-20">
    
    <!-- Header -->
    <header class="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
      <div class="container max-w-3xl mx-auto px-4 h-16 flex items-center justify-between">
        <div class="flex items-center gap-2">
          <div class="w-8 h-8 rounded-lg bg-primary text-primary-foreground flex items-center justify-center font-bold font-mono">
            $
          </div>
          <h1 class="font-semibold tracking-tight text-lg">Meeting Calculator</h1>
        </div>
        <div class="px-2 py-1 rounded-md bg-secondary text-secondary-foreground text-xs font-medium border border-border">
          AU Salary Scales
        </div>
      </div>
    </header>

    <main class="container max-w-3xl mx-auto px-4 py-8 space-y-8">
      
      <!-- Mode Toggle -->
      <div class="flex justify-center">
        <div class="inline-flex items-center rounded-full border border-border bg-card p-1 shadow-sm">
          <button
            @click="activeTab = 'live'"
            class="flex items-center gap-2 px-6 py-2 rounded-full text-sm font-medium transition-all duration-200"
            :class="activeTab === 'live' ? 'bg-accent text-accent-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'"
          >
            <Clock class="w-4 h-4" />
            Live Timer
          </button>
          <button
            @click="activeTab = 'reflective'"
            class="flex items-center gap-2 px-6 py-2 rounded-full text-sm font-medium transition-all duration-200"
            :class="activeTab === 'reflective' ? 'bg-accent text-accent-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'"
          >
            <Calculator class="w-4 h-4" />
            Reflective
          </button>
        </div>
      </div>

      <!-- Main Panel -->
      <div class="relative">
        <Transition
          mode="out-in"
          enter-active-class="transition duration-200 ease-out"
          enter-from-class="opacity-0 scale-95"
          enter-to-class="opacity-100 scale-100"
          leave-active-class="transition duration-150 ease-in"
          leave-from-class="opacity-100 scale-100"
          leave-to-class="opacity-0 scale-95"
        >
          <div v-if="activeTab === 'live'" key="live">
            <div class="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
              <TimerPanel
                :time-display="display"
                :total-min-cost="totalMinCost"
                :total-max-cost="totalMaxCost"
                :min-cost-per-second="totalMinCostPerSecond"
                :max-cost-per-second="totalMaxCostPerSecond"
                :is-running="isRunning"
                :has-participants="hasParticipants"
                @start="handleStart"
                @pause="pause"
                @reset="handleEnd"
              />

              <!-- Meeting Summary (only shown when ended) -->
              <div v-if="showSummary" class="border-t border-border bg-secondary/30 p-6 animate-in slide-in-from-top-4">
                <div class="flex items-center justify-between mb-4">
                  <h3 class="text-lg font-semibold">Meeting Summary</h3>
                  <button @click="handleReset" class="text-sm text-muted-foreground hover:text-destructive transition-colors">
                    Dismiss & Reset
                  </button>
                </div>
                <div class="grid grid-cols-2 gap-4">
                  <div class="p-4 bg-background rounded-lg border border-border">
                    <div class="text-sm text-muted-foreground uppercase tracking-wider">Total Duration</div>
                    <div class="text-2xl font-mono font-medium mt-1">{{ summaryDuration }}</div>
                  </div>
                  <div class="p-4 bg-background rounded-lg border border-border">
                    <div class="text-sm text-muted-foreground uppercase tracking-wider">Final Cost Range</div>
                    <div class="text-lg font-mono font-semibold text-primary mt-1 tabular-nums">
                      {{ summaryCostMin.toLocaleString('en-AU', { style: 'currency', currency: 'AUD', maximumFractionDigits: 2 }) }}
                      –
                      {{ summaryCostMax.toLocaleString('en-AU', { style: 'currency', currency: 'AUD', maximumFractionDigits: 2 }) }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div v-else key="reflective">
            <ReflectivePanel :participants="participants" />
          </div>
        </Transition>
      </div>

      <!-- Participants Section -->
      <div class="border-t border-border pt-8">
        <ParticipantList v-model:participants="participants" />
      </div>

    </main>
  </div>
</template>
