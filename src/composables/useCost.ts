import { computed } from 'vue'
import type { Ref } from 'vue'
import { costPerSecond } from '../data/salaryScales'

export interface Participant {
  id: string
  label: string
  heoLevel: string
  minSalary: number
  maxSalary: number
}

export function useCost(participants: Ref<Participant[]>, totalSeconds: Ref<number>) {
  const totalMinCostPerSecond = computed(() =>
    participants.value.reduce((sum, p) => sum + costPerSecond(p.minSalary), 0)
  )

  const totalMaxCostPerSecond = computed(() =>
    participants.value.reduce((sum, p) => sum + costPerSecond(p.maxSalary), 0)
  )

  const totalMinCost = computed(() => totalSeconds.value * totalMinCostPerSecond.value)
  const totalMaxCost = computed(() => totalSeconds.value * totalMaxCostPerSecond.value)

  return { totalMinCost, totalMaxCost, totalMinCostPerSecond, totalMaxCostPerSecond }
}
