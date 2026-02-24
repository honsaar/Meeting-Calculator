<script setup lang="ts">
import { ref, computed } from 'vue'
import { Calculator } from 'lucide-vue-next'
import type { Participant } from '../composables/useCost'
import { costPerSecond } from '../data/salaryScales'

const props = defineProps<{
  participants: Participant[]
}>()

const hours = ref<number | null>(null)
const minutes = ref<number | null>(null)
const seconds = ref<number | null>(null)
const calculatedMin = ref<number | null>(null)
const calculatedMax = ref<number | null>(null)

const hasParticipants = computed(() => props.participants.length > 0)

const minRatePerSecond = computed(() =>
  props.participants.reduce((sum, p) => sum + costPerSecond(p.minSalary), 0)
)
const maxRatePerSecond = computed(() =>
  props.participants.reduce((sum, p) => sum + costPerSecond(p.maxSalary), 0)
)

function calculate() {
  if (!hasParticipants.value) return
  const totalSecs = ((hours.value || 0) * 3600) + ((minutes.value || 0) * 60) + (seconds.value || 0)
  calculatedMin.value = totalSecs * minRatePerSecond.value
  calculatedMax.value = totalSecs * maxRatePerSecond.value
}

const fmt = (n: number) =>
  n.toLocaleString('en-AU', { style: 'currency', currency: 'AUD', minimumFractionDigits: 2 })
</script>

<template>
  <div class="max-w-xl mx-auto space-y-8 p-6 bg-card rounded-xl border border-border shadow-sm">
    <div class="text-center space-y-2">
      <h2 class="text-2xl font-semibold tracking-tight">Reflective Calculator</h2>
      <p class="text-muted-foreground text-sm">Enter the meeting duration to calculate its cost</p>
    </div>

    <div v-if="!hasParticipants" class="text-center py-8 bg-muted/30 rounded-lg border-2 border-dashed border-muted">
      <p class="text-muted-foreground font-medium">Add participants below to use the calculator</p>
    </div>

    <div v-else class="space-y-6">
      <div class="grid grid-cols-3 gap-4">
        <div class="space-y-2">
          <label class="text-sm font-medium">Hours</label>
          <input v-model.number="hours" type="number" min="0" placeholder="0"
            class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
        </div>
        <div class="space-y-2">
          <label class="text-sm font-medium">Minutes</label>
          <input v-model.number="minutes" type="number" min="0" placeholder="0"
            class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
        </div>
        <div class="space-y-2">
          <label class="text-sm font-medium">Seconds</label>
          <input v-model.number="seconds" type="number" min="0" placeholder="0"
            class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
        </div>
      </div>

      <button
        @click="calculate"
        class="w-full inline-flex items-center justify-center rounded-md bg-accent px-8 py-3 text-sm font-medium text-accent-foreground shadow transition-colors hover:bg-accent/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
      >
        <Calculator class="mr-2 h-4 w-4" />
        Calculate Cost
      </button>

      <div v-if="calculatedMin !== null && calculatedMax !== null"
        class="p-6 bg-secondary/50 rounded-lg border border-secondary text-center space-y-1"
      >
        <div class="text-xs font-medium text-muted-foreground uppercase tracking-wider">Estimated Cost Range</div>
        <div class="text-3xl font-bold tracking-tight text-primary tabular-nums font-mono">
          {{ fmt(calculatedMin) }} – {{ fmt(calculatedMax) }}
        </div>
        <div class="text-xs text-muted-foreground">Based on {{ participants.length }} participant{{ participants.length === 1 ? '' : 's' }}</div>
      </div>
    </div>
  </div>
</template>
