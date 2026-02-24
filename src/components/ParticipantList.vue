<script setup lang="ts">
import { ref } from 'vue'
import { Users, Plus, Zap } from 'lucide-vue-next'
import ParticipantCard from './ParticipantCard.vue'
import type { Participant } from '../composables/useCost'
import { SALARY_SCALES, levelMinSalary, levelMaxSalary } from '../data/salaryScales'
import { PRESETS, presetHeadcount } from '../data/presets'

const props = defineProps<{
  participants: Participant[]
}>()

const emit = defineEmits<{
  (e: 'update:participants', val: Participant[]): void
}>()

const selectedPresetId = ref('')

function addParticipant() {
  const defaultLevel = SALARY_SCALES[4] // HEO 5
  const newParticipant: Participant = {
    id: crypto.randomUUID(),
    label: '',
    heoLevel: defaultLevel.level,
    minSalary: levelMinSalary(defaultLevel),
    maxSalary: levelMaxSalary(defaultLevel),
  }
  emit('update:participants', [...props.participants, newParticipant])
}

function applyPreset() {
  const preset = PRESETS.find(p => p.id === selectedPresetId.value)
  if (!preset) return

  const generated: Participant[] = []
  for (const entry of preset.entries) {
    const levelData = SALARY_SCALES.find(l => l.level === entry.heoLevel)
    if (!levelData) continue
    for (let i = 0; i < entry.count; i++) {
      generated.push({
        id: crypto.randomUUID(),
        label: '',
        heoLevel: entry.heoLevel,
        minSalary: levelMinSalary(levelData),
        maxSalary: levelMaxSalary(levelData),
      })
    }
  }
  emit('update:participants', generated)
  selectedPresetId.value = ''
}

function updateParticipant(updated: Participant) {
  emit('update:participants', props.participants.map(p =>
    p.id === updated.id ? updated : p
  ))
}

function removeParticipant(id: string) {
  emit('update:participants', props.participants.filter(p => p.id !== id))
}
</script>

<template>
  <section class="space-y-4">

    <!-- Header row -->
    <div class="flex items-center justify-between">
      <h2 class="text-sm font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-2">
        <Users class="w-4 h-4" />
        Participants
        <span class="bg-secondary text-secondary-foreground px-2 py-0.5 rounded-full text-xs font-mono">
          {{ participants.length }}
        </span>
      </h2>
      <button
        @click="addParticipant"
        class="inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-accent transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-md px-2 py-1"
      >
        <Plus class="w-4 h-4" />
        Add person
      </button>
    </div>

    <!-- Preset picker -->
    <div class="flex items-center gap-2 p-3 rounded-lg bg-secondary/40 border border-border">
      <Zap class="w-4 h-4 text-accent shrink-0" />
      <span class="text-xs font-medium text-muted-foreground uppercase tracking-wider shrink-0">Quick fill</span>
      <select
        v-model="selectedPresetId"
        class="flex-1 h-8 rounded-md border border-input bg-background px-2 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring min-w-0"
      >
        <option value="" disabled>Choose a preset…</option>
        <option
          v-for="preset in PRESETS"
          :key="preset.id"
          :value="preset.id"
        >
          {{ preset.name }} ({{ presetHeadcount(preset) }} people)
        </option>
      </select>
      <button
        @click="applyPreset"
        :disabled="!selectedPresetId"
        class="shrink-0 h-8 px-3 rounded-md bg-accent text-accent-foreground text-sm font-medium shadow-sm transition-all hover:bg-accent/90 disabled:opacity-40 disabled:cursor-not-allowed"
      >
        Load
      </button>
    </div>

    <!-- Disclaimer -->
    <p class="text-xs text-muted-foreground flex items-start gap-1.5 -mt-1">
      <span class="mt-px shrink-0">~</span>
      <span>Calculations are estimates only. Salary step levels vary between individuals, so actual costs may differ from the figures shown.</span>
    </p>

    <!-- Empty state -->
    <div v-if="participants.length === 0" class="flex flex-col items-center justify-center p-8 border-2 border-dashed border-muted rounded-xl bg-muted/20 text-center">
      <div class="bg-background p-3 rounded-full mb-3 shadow-sm">
        <Users class="w-6 h-6 text-muted-foreground" />
      </div>
      <h3 class="text-base font-semibold text-foreground">No participants yet</h3>
      <p class="text-sm text-muted-foreground mt-1 max-w-xs">
        Use a quick fill preset above, or add people one by one.
      </p>
      <button
        @click="addParticipant"
        class="mt-4 px-4 py-2 bg-primary text-primary-foreground text-sm font-medium rounded-md shadow hover:bg-primary/90 transition-colors"
      >
        Add first participant
      </button>
    </div>

    <!-- Participant cards -->
    <div v-else class="grid gap-3 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
      <TransitionGroup
        enter-active-class="transition duration-300 ease-out"
        enter-from-class="opacity-0 -translate-y-2"
        enter-to-class="opacity-100 translate-y-0"
        leave-active-class="transition duration-200 ease-in absolute w-full"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0 scale-95"
        move-class="transition duration-300 ease-in-out"
      >
        <ParticipantCard
          v-for="p in participants"
          :key="p.id"
          :participant="p"
          @update="updateParticipant"
          @remove="removeParticipant"
        />
      </TransitionGroup>
    </div>

  </section>
</template>
