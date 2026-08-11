export type MetodeBelajar = 'membaca' | 'mendengar' | 'menulis'

export interface MateriSyllable {
  text: string
  color?: 'blue' | 'green' | 'default'
}

export interface MateriWord {
  id: string
  text: string
  syllables: MateriSyllable[]
}

export interface MateriContent {
  id: string
  metodeBelajar: MetodeBelajar
  title: string
  subtitle?: string
  mediaUrl?: string
  words: MateriWord[]
  focusHuruf?: string
  focusInstruction?: string
  tips?: string
}
