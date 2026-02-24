<script setup lang="ts">
import { SALARY_SCALES, levelMinSalary, levelMaxSalary } from '../data/salaryScales'
import type { Participant } from '../composables/useCost'
import { X } from 'lucide-vue-next'

const props = defineProps<{
  participant: Participant
}>()

const emit = defineEmits<{
  (e: 'update', p: Participant): void
  (e: 'remove', id: string): void
}>()

function updateLevel(event: Event) {
  const levelName = (event.target as HTMLSelectElement).value
  const levelData = SALARY_SCALES.find(l => l.level === levelName)
  if (!levelData) return
  emit('update', {
    ...props.participant,
    heoLevel: levelName,
    minSalary: levelMinSalary(levelData),
    maxSalary: levelMaxSalary(levelData),
  })
}

function updateLabel(event: Event) {
  emit('update', {
    ...props.participant,
    label: (event.target as HTMLInputElement).value
  })
}

const fmt = (amount: number) =>
  amount.toLocaleString('en-AU', { style: 'currency', currency: 'AUD', maximumFractionDigits: 0 })
</script>

<template>
  <div class="group relative flex flex-col sm:flex-row items-start sm:items-center gap-3 p-4 bg-card rounded-lg border border-border shadow-sm hover:shadow-md transition-shadow">
    <button
      @click="$emit('remove', participant.id)"
      class="absolute -top-2 -right-2 sm:top-2 sm:right-2 p-1 bg-destructive text-destructive-foreground rounded-full opacity-0 group-hover:opacity-100 transition-opacity focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring"
      aria-label="Remove participant"
    >
      <X class="w-3 h-3" />
    </button>

    <!-- Optional name -->
    <div class="flex-1 w-full sm:w-auto">
      <input
        type="text"
        :value="participant.label"
        @input="updateLabel"
        placeholder="Name or role (optional)"
        class="w-full bg-transparent border-b border-transparent hover:border-border focus:border-ring focus:outline-none text-sm font-medium placeholder:text-muted-foreground py-1 transition-colors"
      />
    </div>

    <!-- HEO level selector -->
    <select
      :value="participant.heoLevel"
      @change="updateLevel"
      class="h-9 w-[110px] rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
    >
      <option v-for="level in SALARY_SCALES" :key="level.level" :value="level.level">
        {{ level.level }}
      </option>
    </select>

    <!-- Salary range -->
    <div class="text-sm font-mono text-muted-foreground tabular-nums whitespace-nowrap text-right">
      {{ fmt(participant.minSalary) }} – {{ fmt(participant.maxSalary) }}
    </div>
  </div>
</template>
