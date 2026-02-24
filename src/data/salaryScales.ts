export interface SalaryStep {
  step: number
  salary: number
}

export interface HEOLevel {
  level: string
  steps: SalaryStep[]
}

export const SALARY_SCALES: HEOLevel[] = [
  { level: "HEO 1", steps: [
    { step: 1, salary: 57266 },
    { step: 2, salary: 58527 },
    { step: 3, salary: 59815 },
    { step: 4, salary: 61132 },
  ]},
  { level: "HEO 2", steps: [
    { step: 1, salary: 61587 },
    { step: 2, salary: 63410 },
    { step: 3, salary: 65287 },
    { step: 4, salary: 67219 },
  ]},
  { level: "HEO 3", steps: [
    { step: 1, salary: 68466 },
    { step: 2, salary: 70519 },
    { step: 3, salary: 72633 },
    { step: 4, salary: 74811 },
    { step: 5, salary: 77054 },
  ]},
  { level: "HEO 4", steps: [
    { step: 1, salary: 78592 },
    { step: 2, salary: 80144 },
    { step: 3, salary: 81655 },
    { step: 4, salary: 83246 },
    { step: 5, salary: 84858 },
  ]},
  { level: "HEO 5", steps: [
    { step: 1, salary: 85702 },
    { step: 2, salary: 88297 },
    { step: 3, salary: 90971 },
    { step: 4, salary: 93725 },
    { step: 5, salary: 96563 },
  ]},
  { level: "HEO 6", steps: [
    { step: 1, salary: 97459 },
    { step: 2, salary: 98955 },
    { step: 3, salary: 100474 },
    { step: 4, salary: 102017 },
    { step: 5, salary: 103583 },
  ]},
  { level: "HEO 7", steps: [
    { step: 1, salary: 104564 },
    { step: 2, salary: 107328 },
    { step: 3, salary: 110166 },
    { step: 4, salary: 113078 },
    { step: 5, salary: 116068 },
  ]},
  { level: "HEO 8", steps: [
    { step: 1, salary: 117246 },
    { step: 2, salary: 120483 },
    { step: 3, salary: 123809 },
    { step: 4, salary: 127227 },
    { step: 5, salary: 130739 },
  ]},
  { level: "HEO 9", steps: [
    { step: 1, salary: 132705 },
    { step: 2, salary: 135725 },
    { step: 3, salary: 138815 },
    { step: 4, salary: 141974 },
  ]},
  { level: "HEO 10", steps: [
    { step: 1, salary: 142228 },
    { step: 2, salary: 146743 },
    { step: 3, salary: 151402 },
    { step: 4, salary: 156209 },
  ]},
]

export const WORKING_SECONDS_PER_YEAR = 250 * 7.5 * 60 * 60

export function costPerSecond(annualSalary: number): number {
  return annualSalary / WORKING_SECONDS_PER_YEAR
}

export function levelMinSalary(level: HEOLevel): number {
  return level.steps[0].salary
}

export function levelMaxSalary(level: HEOLevel): number {
  return level.steps[level.steps.length - 1].salary
}
