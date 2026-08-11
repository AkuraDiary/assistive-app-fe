import type { ScreeningQuestion, ScreeningResult } from '@/types/screening.types'

export const mockScreeningQuestionsOrtu: ScreeningQuestion[] = [
  { id: 'q1', order: 1, text: 'Apakah beliau mengalami kesulitan dalam mengeja?', required: true },
  {
    id: 'q2',
    order: 2,
    text: 'Apakah beliau mengalami kesulitan dalam penamaan huruf?',
    required: true,
  },
  {
    id: 'q3',
    order: 3,
    text: 'Apakah beliau mengalami kesulitan dalam pelafalan bunyi huruf?',
    required: true,
  },
  { id: 'q4', order: 4, text: 'Apakah beliau membaca dengan lambat?', required: true },
  { id: 'q5', order: 5, text: 'Apakah beliau sering membalik huruf saat menulis?', required: true },
]

export const mockScreeningQuestionsAnak: ScreeningQuestion[] = [
  { id: 'q1', order: 1, text: '', required: true, questionType: 'tap', mediaLabel: 'Animasi' },
  {
    id: 'q2',
    order: 2,
    text: '',
    required: true,
    questionType: 'tap',
    mediaLabel: 'Animasi',
    options: ['A', 'I', 'U'],
  },
  {
    id: 'q3',
    order: 3,
    text: 'Ini dibaca apa?',
    required: true,
    questionType: 'voice',
    mediaLabel: 'Huruf/Teks',
  },
  {
    id: 'q4',
    order: 4,
    text: 'Tulislah jawaban Anda di kertas, lalu unggah sebagai foto/gambar.',
    required: true,
    questionType: 'upload',
    mediaLabel: 'Huruf/Teks',
  },
]

export const mockScreeningResults: ScreeningResult[] = []
