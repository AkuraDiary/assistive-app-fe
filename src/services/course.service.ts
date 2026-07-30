import type { Course, CourseDetail } from '@/types/course.types'
import { apiService, USE_MOCK } from './api'

const MOCK_COURSES: Course[] = [
  {
    id: 'cr1',
    name: 'Pengenalan Huruf',
    level: 'Level : 2 (Dua)',
    progress: 80,
    completedSessions: 3,
    totalSessions: 4,
    tanggalMulai: '2026-05-20',
    status: 'dipelajari',
    exercises: [
      { id: 'ex1', title: 'Mengenal Huruf Vocal', progress: 70 },
      { id: 'ex2', title: 'Mengenal Huruf Konsonan', progress: 85 },
      { id: 'ex3', title: 'Membaca Suku Kata', progress: 90 },
    ],
  },
  {
    id: 'cr2',
    name: 'Pengenalan Huruf',
    level: 'Level : 3 (Tiga)',
    progress: 0,
    completedSessions: 0,
    totalSessions: 5,
    tanggalMulai: '2026-05-20',
    status: 'belum',
    exercises: [
      { id: 'ex4', title: 'Mengenal Huruf Vocal', progress: 0 },
      { id: 'ex5', title: 'Mengenal Huruf Konsonan', progress: 0 },
    ],
  },
  {
    id: 'cr3',
    name: 'Pengenalan Huruf',
    level: 'Level : 1 (Satu)',
    progress: 100,
    completedSessions: 4,
    totalSessions: 4,
    tanggalMulai: '2026-05-20',
    status: 'selesai',
    exercises: [
      { id: 'ex6', title: 'Mengenal Huruf Vocal', progress: 100 },
      { id: 'ex7', title: 'Mengenal Huruf Konsonan', progress: 100 },
      { id: 'ex8', title: 'Membaca Suku Kata', progress: 100 },
    ],
  },
  {
    id: 'cr4',
    name: 'Pengenalan Huruf',
    level: 'Level : 3 (Tiga)',
    progress: 0,
    completedSessions: 0,
    totalSessions: 5,
    tanggalMulai: '2026-05-20',
    status: 'belum',
  },
  {
    id: 'cr5',
    name: 'Berhitung',
    level: 'Level : 1 (Satu)',
    progress: 40,
    completedSessions: 2,
    totalSessions: 5,
    tanggalMulai: '2026-05-20',
    status: 'dipelajari',
    exercises: [
      { id: 'ex9', title: 'Mengenal Angka', progress: 80 },
      { id: 'ex10', title: 'Penjumlahan Dasar', progress: 40 },
    ],
  },
  {
    id: 'cr6',
    name: 'Berhitung',
    level: 'Level : 2 (Dua)',
    progress: 20,
    completedSessions: 1,
    totalSessions: 5,
    tanggalMulai: '2026-05-20',
    status: 'dipelajari',
  },
  {
    id: 'cr7',
    name: 'Menulis',
    level: 'Level : 1 (Satu)',
    progress: 60,
    completedSessions: 3,
    totalSessions: 5,
    tanggalMulai: '2026-05-20',
    status: 'dipelajari',
  },
  {
    id: 'cr8',
    name: 'Menulis',
    level: 'Level : 2 (Dua)',
    progress: 0,
    completedSessions: 0,
    totalSessions: 5,
    tanggalMulai: '2026-05-20',
    status: 'belum',
  },
  {
    id: 'cr9',
    name: 'Mendengar',
    level: 'Level : 1 (Satu)',
    progress: 55,
    completedSessions: 2,
    totalSessions: 4,
    tanggalMulai: '2026-05-20',
    status: 'dipelajari',
  },
  {
    id: 'cr10',
    name: 'Mendengar',
    level: 'Level : 2 (Dua)',
    progress: 100,
    completedSessions: 4,
    totalSessions: 4,
    tanggalMulai: '2026-05-20',
    status: 'selesai',
  },
]

const MOCK_COURSE_DETAIL: CourseDetail[] = [
  {
    id: 'cr1',
    name: 'Course 1 bebek',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do ei',
    level: 'Level : 2 (Dua)',
    progress: 76,
    completedSessions: 3,
    totalSessions: 4,
    tanggalMulai: '2026-05-20',
    status: 'dipelajari',
    totalModul: 3,
    totalAssessment: 1,
   
    exercises: [
      { id: 'ex1', title: 'Mengenal Huruf Vocal', progress: 70 },
      { id: 'ex2', title: 'Mengenal Huruf Konsonan', progress: 85 },
    ],
    moduls: [
      {
        id: 'm1',
        label: 'Modul 1',
        description:
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et',
        latihan: [
          {
            id: 'l1',
            title: 'Latihan Mengenal huruf Vocal (A, I, U, E, O)',
            description:
              'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et (Deskripsi)',
            progress: 70,
            tanggalDikerjakan: '2026-04-10',
            isLocked: false,
            materi: [
              {
                id: 'mat1',
                metodeBelajar: 'membaca',
                title: 'Mimi Sang Kucing',
                subtitle: 'Sentuh Untuk Mendengarkan saaranya dan perhatikan Suku kata',
                mediaUrl: undefined,
                words: [
                  {
                    id: 'w1',
                    text: 'MIMI',
                    syllables: [
                      { text: 'MI', color: 'blue' },
                      { text: 'MI', color: 'green' },
                    ],
                  },
                  {
                    id: 'w2',
                    text: 'ADALAH',
                    syllables: [
                      { text: 'A', color: 'default' },
                      { text: 'DA', color: 'blue' },
                      { text: 'LAH', color: 'green' },
                    ],
                  },
                  {
                    id: 'w3',
                    text: 'KUCING',
                    syllables: [
                      { text: 'KU', color: 'default' },
                      { text: 'CI', color: 'blue' },
                      { text: 'NG', color: 'green' },
                    ],
                  },
                  {
                    id: 'w4',
                    text: 'LUCU',
                    syllables: [
                      { text: 'LU', color: 'default' },
                      { text: 'CU', color: 'default' },
                    ],
                  },
                ],
                focusHuruf: 'M',
                focusInstruction: 'Tekan huruf M untuk mendengarkan Bunyinya',
                tips: 'Klik pada setiap kata yang berwarna biru dan hijau. Warna ini membantu kamu melihat pemisahan suku kata agar lebih mudah dibaca.',
              },
              {
                id: 'mat2',
                metodeBelajar: 'membaca',
                title: 'Budi Sang Anjing',
                subtitle: 'Sentuh Untuk Mendengarkan saara dan perhatikan Suku kata',
                words: [
                  {
                    id: 'w5',
                    text: 'BUDI',
                    syllables: [
                      { text: 'BU', color: 'blue' },
                      { text: 'DI', color: 'green' },
                    ],
                  },
                ],
                focusHuruf: 'B',
                focusInstruction: 'Tekan huruf B untuk mendengarkan Bunyinya',
                tips: 'Perhatikan setiap suku kata dengan seksama.',
              },
            ],
          },
          {
            id: 'l2',
            title: 'Latihan Mengenal huruf Vocal (A, I, U, E, O)',
            progress: 80,
            tanggalDikerjakan: '2026-04-10',
            isLocked: false,
          },
          {
            id: 'l3',
            title: 'Latihan Mengenal huruf Vocal (A, I, U, E, O)',
            progress: 80,
            tanggalDikerjakan: '2026-04-10',
            isLocked: false,
          },
        ],
      },
      {
        id: 'm2',
        label: 'Modul 2',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
        latihan: [
          {
            id: 'l4',
            title: 'Latihan Mengenal huruf Vocal (A, I, U, E, O)',
            progress: 50,
            tanggalDikerjakan: '2026-04-12',
            isLocked: false,
          },
        ],
      },
      {
        id: 'm3',
        label: 'Modul 3',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
        latihan: [
          {
            id: 'l5',
            title: 'Latihan Mengenal huruf Vocal (A, I, U, E, O)',
            progress: 0,
            isLocked: true,
          },
        ],
      },
    ],
    assessments: [
      {
        id: 'as1',
        title: 'Mengenal huruf Vocal (A, I, U, E, O)',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
        level: 'Level 1',
        skills: ['Mendengar', 'Menulis', 'Membaca'],
        tanggalDikerjakan: '2026-04-12',
        isLocked: true,
      },
    ],
  },
  {
    id: 'cr2',
    name: 'Course 2 bebek',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do ei',
    level: 'Level : 2 (Dua)',
    progress: 76,
    completedSessions: 3,
    totalSessions: 4,
    tanggalMulai: '2026-05-20',
    status: 'dipelajari',
    totalModul: 3,
    totalAssessment: 1,
    exercises: [
      { id: 'ex1', title: 'Mengenal Huruf Vocal', progress: 70 },
      { id: 'ex2', title: 'Mengenal Huruf Konsonan', progress: 85 },
    ],
    moduls: [
      {
        id: 'm1',
        label: 'Modul 1',
        description:
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et',
        latihan: [
          {
            id: 'l1',
            title: 'Latihan Mengenal huruf Vocal (A, I, U, E, O)',
            description:
              'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et (Deskripsi)',
            progress: 70,
            tanggalDikerjakan: '2026-04-10',
            isLocked: false,
            materi: [
              {
                id: 'mat1',
                metodeBelajar: 'membaca',
                title: 'Mimi Sang Kucing',
                subtitle: 'Sentuh Untuk Mendengarkan saaranya dan perhatikan Suku kata',
                mediaUrl: undefined,
                words: [
                  {
                    id: 'w1',
                    text: 'MIMI',
                    syllables: [
                      { text: 'MI', color: 'blue' },
                      { text: 'MI', color: 'green' },
                    ],
                  },
                  {
                    id: 'w2',
                    text: 'ADALAH',
                    syllables: [
                      { text: 'A', color: 'default' },
                      { text: 'DA', color: 'blue' },
                      { text: 'LAH', color: 'green' },
                    ],
                  },
                  {
                    id: 'w3',
                    text: 'KUCING',
                    syllables: [
                      { text: 'KU', color: 'default' },
                      { text: 'CI', color: 'blue' },
                      { text: 'NG', color: 'green' },
                    ],
                  },
                  {
                    id: 'w4',
                    text: 'LUCU',
                    syllables: [
                      { text: 'LU', color: 'default' },
                      { text: 'CU', color: 'default' },
                    ],
                  },
                ],
                focusHuruf: 'M',
                focusInstruction: 'Tekan huruf M untuk mendengarkan Bunyinya',
                tips: 'Klik pada setiap kata yang berwarna biru dan hijau. Warna ini membantu kamu melihat pemisahan suku kata agar lebih mudah dibaca.',
              },
              {
                id: 'mat2',
                metodeBelajar: 'membaca',
                title: 'Budi Sang Anjing',
                subtitle: 'Sentuh Untuk Mendengarkan saara dan perhatikan Suku kata',
                words: [
                  {
                    id: 'w5',
                    text: 'BUDI',
                    syllables: [
                      { text: 'BU', color: 'blue' },
                      { text: 'DI', color: 'green' },
                    ],
                  },
                ],
                focusHuruf: 'B',
                focusInstruction: 'Tekan huruf B untuk mendengarkan Bunyinya',
                tips: 'Perhatikan setiap suku kata dengan seksama.',
              },
            ],
          },
          {
            id: 'l2',
            title: 'Latihan Mengenal huruf Vocal (A, I, U, E, O)',
            progress: 80,
            tanggalDikerjakan: '2026-04-10',
            isLocked: false,
          },
          {
            id: 'l3',
            title: 'Latihan Mengenal huruf Vocal (A, I, U, E, O)',
            progress: 80,
            tanggalDikerjakan: '2026-04-10',
            isLocked: false,
          },
        ],
      },
      {
        id: 'm2',
        label: 'Modul 2',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
        latihan: [
          {
            id: 'l4',
            title: 'Latihan Mengenal huruf Vocal (A, I, U, E, O)',
            progress: 50,
            tanggalDikerjakan: '2026-04-12',
            isLocked: false,
          },
        ],
      },
      {
        id: 'm3',
        label: 'Modul 3',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
        latihan: [
          {
            id: 'l5',
            title: 'Latihan Mengenal huruf Vocal (A, I, U, E, O)',
            progress: 0,
            isLocked: true,
          },
        ],
      },
    ],
    assessments: [
      {
        id: 'as1',
        title: 'Mengenal huruf Vocal (A, I, U, E, O)',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
        level: 'Level 1',
        skills: ['Mendengar', 'Menulis', 'Membaca'],
        tanggalDikerjakan: '2026-04-12',
        isLocked: true,
      },
    ],
  },
]

export const courseService = {
  async getCourses(childId: string): Promise<Course[]> {
    if (USE_MOCK) return MOCK_COURSES
    const res = await apiService.get<Course[]>(`/children/${childId}/courses`)
    return res.data ?? []
  },

  async getCourseDetail(childId: string, courseId: string): Promise<CourseDetail> {
    if (USE_MOCK) {
      const courseDetail = MOCK_COURSE_DETAIL.find((l) => l.id === courseId)
      if (courseDetail) return { ...courseDetail, id: courseId }
    }
    const res = await apiService.get<CourseDetail>(`/children/${childId}/courses/${courseId}`)
    return res.data!
  },
}
