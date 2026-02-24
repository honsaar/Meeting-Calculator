export interface PresetEntry {
  heoLevel: string
  count: number
}

export interface MeetingPreset {
  id: string
  name: string
  entries: PresetEntry[]
}

export const PRESETS: MeetingPreset[] = [
  {
    id: 'multimedia-team',
    name: 'Multimedia Team',
    entries: [
      { heoLevel: 'HEO 8', count: 1 },
      { heoLevel: 'HEO 7', count: 5 },
      { heoLevel: 'HEO 6', count: 13 },
      { heoLevel: 'HEO 5', count: 9 },
    ],
  },
  {
    id: 'learning-systems',
    name: 'Learning Systems',
    entries: [
      { heoLevel: 'HEO 8', count: 1 },
      { heoLevel: 'HEO 5', count: 10 },
    ],
  },
  {
    id: 'learning-technologies',
    name: 'Learning Technologies',
    entries: [
      { heoLevel: 'HEO 8', count: 1 },
      { heoLevel: 'HEO 7', count: 4 },
    ],
  },
  {
    id: 'curriculum',
    name: 'Curriculum',
    entries: [
      { heoLevel: 'HEO 9', count: 3 },
      { heoLevel: 'HEO 8', count: 9 },
      { heoLevel: 'HEO 7', count: 50 },
      { heoLevel: 'HEO 6', count: 16 },
    ],
  },
  {
    id: 'pd-projects',
    name: 'Professional Development & Projects',
    entries: [
      { heoLevel: 'HEO 8', count: 3 },
      { heoLevel: 'HEO 7', count: 13 },
      { heoLevel: 'HEO 6', count: 5 },
    ],
  },
  {
    id: 'whole-team',
    name: 'Whole Team',
    entries: [
      { heoLevel: 'HEO 10', count: 4 },
      { heoLevel: 'HEO 9', count: 3 },
      { heoLevel: 'HEO 8', count: 15 },
      { heoLevel: 'HEO 7', count: 72 },
      { heoLevel: 'HEO 6', count: 34 },
      { heoLevel: 'HEO 5', count: 19 },
    ],
  },
]

export function presetHeadcount(preset: MeetingPreset): number {
  return preset.entries.reduce((sum, e) => sum + e.count, 0)
}
