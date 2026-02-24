<script setup lang="ts">
import { computed } from 'vue'
import { Play, Pause, Square, AlertCircle } from 'lucide-vue-next'

const props = defineProps<{
  timeDisplay: string
  totalMinCost: number
  totalMaxCost: number
  minCostPerSecond: number
  maxCostPerSecond: number
  isRunning: boolean
  hasParticipants: boolean
}>()

defineEmits<{
  (e: 'start'): void
  (e: 'pause'): void
  (e: 'reset'): void
}>()

const minPerMinute = computed(() => props.minCostPerSecond * 60)
const maxPerMinute = computed(() => props.maxCostPerSecond * 60)

const fmt = (n: number) =>
  n.toLocaleString('en-AU', { style: 'currency', currency: 'AUD', minimumFractionDigits: 2 })

const fmtInt = (n: number) =>
  n.toLocaleString('en-AU', { style: 'currency', currency: 'AUD', maximumFractionDigits: 0 })
</script>

<template>
  <div class="flex flex-col items-center justify-center p-6 space-y-8 min-h-[400px]">

    <!-- Timer display -->
    <div class="relative text-center space-y-3">
      <div class="text-7xl sm:text-9xl font-mono font-bold tracking-tighter tabular-nums text-foreground select-none">
        {{ timeDisplay }}
      </div>

      <!-- Cost range -->
      <div
        class="transition-opacity duration-200"
        :class="hasParticipants ? 'opacity-100' : 'opacity-30'"
      >
        <div class="text-3xl sm:text-4xl font-semibold tabular-nums text-accent">
          {{ fmt(totalMinCost) }} – {{ fmt(totalMaxCost) }}
        </div>
        <div class="text-xs font-medium text-muted-foreground uppercase tracking-wider mt-1">
          ~{{ fmtInt(minPerMinute) }} – {{ fmtInt(maxPerMinute) }} per minute
        </div>
      </div>
    </div>

    <!-- Validation -->
    <div
      v-if="!hasParticipants"
      class="flex items-center gap-2 text-destructive bg-destructive/10 px-4 py-2 rounded-md"
    >
      <AlertCircle class="w-4 h-4 shrink-0" />
      <span class="text-sm font-medium">Add participants to start tracking cost</span>
    </div>

    <!-- Controls -->
    <div class="flex items-center gap-4">
      <template v-if="!isRunning">
        <button
          @click="$emit('start')"
          :disabled="!hasParticipants"
          class="group inline-flex items-center justify-center rounded-full bg-accent px-8 py-3 text-lg font-semibold text-accent-foreground transition-all hover:bg-accent/90 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0"
        >
          <Play class="mr-2 w-5 h-5 fill-current" />
          Start
        </button>
      </template>

      <template v-else>
        <button
          @click="$emit('pause')"
          class="inline-flex items-center justify-center rounded-full border-2 border-primary bg-transparent px-8 py-3 text-lg font-semibold text-primary transition-all hover:bg-primary/5 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
        >
          <Pause class="mr-2 w-5 h-5 fill-current" />
          Pause
        </button>
      </template>

      <button
        @click="$emit('reset')"
        :disabled="totalMinCost === 0 && !isRunning"
        class="inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive focus:outline-none focus:ring-2 focus:ring-destructive focus:ring-offset-2 disabled:opacity-0"
      >
        <Square class="mr-2 w-4 h-4 fill-current" />
        End
      </button>
    </div>
  </div>
</template>
