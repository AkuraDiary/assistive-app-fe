import type { ActivityEntry } from '@/types/activity.types'
import type { Course } from '@/types/course.types'

// Mock Students for Teacher/Institution
export const mockStudents = [
  { _id: 's1', fullName: 'Budiman', gender: 'L', dateOfBirth: '20 Mei 2016', parentName: 'Agus Dermawan', teacherName: 'Riya Wijaya', teacherId: 't1', status: 'aktif', jenisTerapi: 'Lembaga', lembagaTerapi: 'Klinik Tumbuh Kembang Anak' },
  { _id: 's2', fullName: 'Komang', gender: 'L', dateOfBirth: '20 Mei 2016', parentName: 'Rinaawati', teacherName: 'Riya Wijaya', teacherId: 't1', status: 'aktif', jenisTerapi: 'Lembaga', lembagaTerapi: '-' },
  { _id: 's3', fullName: 'Bumandi', gender: 'P', dateOfBirth: '20 Mei 2016', parentName: 'Joko Susilo', teacherName: 'Riya Wijaya', teacherId: 't1', status: 'aktif', jenisTerapi: 'Individu', lembagaTerapi: '-' },
  { _id: 's4', fullName: 'Amelia Rosa', gender: 'P', dateOfBirth: '25 November 2017', parentName: 'Sari Indah', teacherName: 'Riya Wijaya', teacherId: 't1', status: 'nonaktif', jenisTerapi: 'Lembaga', lembagaTerapi: 'Klinik Tumbuh Kembang Anak' },
  { _id: 's5', fullName: 'Kevin Sanjaya', gender: 'L', dateOfBirth: '09 Juli 2016', parentName: 'Rudi Hermawan', teacherName: 'Mamang Hermanto', teacherId: 't2', status: 'nonaktif', jenisTerapi: 'Individu', lembagaTerapi: '-' },
]

export const mockTeachers = [
  { _id: 't1', fullName: 'Riya Wijaya', gender: 'P', dateOfBirth: '15 Januari 1990', phone: '08123456789', address: 'Jl. Sukarejo' },
  { _id: 't2', fullName: 'Mamang Hermanto', gender: 'L', dateOfBirth: '20 Maret 1988', phone: '08987654321', address: 'Jl. Kebon Kacang' },
]

export const mockActivities: ActivityEntry[] = [
  {
    id: 'a1',
    childId: 's1',
    topic: 'Latihan membedakan huruf mirip',
    status: 'dipelajari',
    progress: 80,
    durationMinutes: 2,
    date: new Date(Date.now() - 1000 * 60 * 2).toISOString(), // 2 mins ago
  },
  {
    id: 'a2',
    childId: 's1',
    topic: 'Mengenal huruf vokal',
    status: 'dipelajari',
    progress: 76,
    durationMinutes: 10,
    date: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
  },
  {
    id: 'a3',
    childId: 's1',
    topic: 'Latihan membaca suku kata',
    status: 'selesai',
    progress: 100,
    durationMinutes: 15,
    date: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(), // 2 days ago
  },
]

export const mockCourses: Course[] = [
  {
    id: 'c1',
    name: 'Course 1',
    progress: 80,
    completedSessions: 8,
    totalSessions: 10,
    status: 'dipelajari',
    exercises: [
      { id: 'e1', title: 'Mengenal huruf konsonan dasar', progress: 100 },
      { id: 'e2', title: 'Mengenal huruf vokal', progress: 76 },
      { id: 'e3', title: 'Latihan membedakan huruf mirip', progress: 80 },
    ],
  },
  {
    id: 'c2',
    name: 'Course 2',
    progress: 0,
    completedSessions: 0,
    totalSessions: 5,
    status: 'belum',
    exercises: [
      { id: 'e4', title: 'Membaca kata dasar', progress: 0 },
    ],
  },
  {
    id: 'c3',
    name: 'Course 3',
    progress: 0,
    completedSessions: 0,
    totalSessions: 5,
    status: 'belum',
    exercises: [],
  },
  {
    id: 'c4',
    name: 'Course 4',
    progress: 0,
    completedSessions: 0,
    totalSessions: 5,
    status: 'belum',
    exercises: [],
  },
  {
    id: 'c5',
    name: 'Course 5',
    progress: 0,
    completedSessions: 0,
    totalSessions: 5,
    status: 'belum',
    exercises: [],
  },
]

export interface RecentActivity {
  id: string
  title: string
  description: string
  date: string
}

export const mockInstitutionActivities: RecentActivity[] = [
  {
    id: 'ia1',
    title: 'Hermanto Budiman',
    description: 'mengakses modul pembelajaran Baca Tulis',
    date: new Date(Date.now() - 1000 * 60 * 2).toISOString(),
  },
  {
    id: 'ia2',
    title: 'Hermanto Budiman',
    description: 'mengakses modul pembelajaran Baca Tulis',
    date: new Date(Date.now() - 1000 * 60 * 2).toISOString(),
  },
  {
    id: 'ia3',
    title: 'Hermanto Budiman',
    description: 'mengakses modul pembelajaran Baca Tulis',
    date: new Date(Date.now() - 1000 * 60 * 2).toISOString(),
  },
]

export const mockAdminActivities: RecentActivity[] = [
  {
    id: 'aa1',
    title: 'Klinik Tumbuh Kembang Anak',
    description: 'Menerima siswa baru',
    date: new Date(Date.now() - 1000 * 60 * 2).toISOString(),
  },
  {
    id: 'aa2',
    title: 'Yayasan Disleksia',
    description: 'Menambahkan guru baru',
    date: new Date(Date.now() - 1000 * 60 * 2).toISOString(),
  },
  {
    id: 'aa3',
    title: 'Yayasan Peduli Anak Spesial',
    description: 'Menambahkan modul baru',
    date: new Date(Date.now() - 1000 * 60 * 2).toISOString(),
  },
]

export const mockInstitutionStats = {
  totalSiswa: 59,
  modul: 59,
  dikerjakan: 59,
  selesai: 59,
}

export const mockApplications = [
  { id: 'app1', name: 'Budiman', gender: 'Laki-laki', dob: '20 Mei 2016', status: 'menunggu' },
  { id: 'app2', name: 'Ahmad Fauzi', gender: 'Laki-laki', dob: '12 Maret 2015', status: 'menunggu' },
  { id: 'app3', name: 'Siti Nurhaliza', gender: 'Perempuan', dob: '05 Agustus 2017', status: 'menunggu' },
  { id: 'app4', name: 'Rian Hidayat', gender: 'Laki-laki', dob: '22 Oktober 2016', status: 'menunggu' },
  { id: 'app5', name: 'Putri Lestari', gender: 'Perempuan', dob: '14 Januari 2015', status: 'menunggu' },
]

export const mockAdminChartData = {
  labels: ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'],
  datasets: [
    {
      label: 'Modul Dikerjakan',
      data: [30, 140, 65, 100, 70, 80, 42, 105, 49, 70, 46, 105],
      borderColor: '#3b82f6', // blue
      tension: 0.4
    },
    {
      label: 'Modul Ditambahkan',
      data: [28, 20, 5, 6, 18, 14, 25, 10, 26, 8, 12, 30],
      borderColor: '#8b5cf6', // purple
      tension: 0.4
    },
    {
      label: 'Siswa Diterima',
      data: [5, 30, 24, 49, 42, 30, 52, 25, 8, 50, 28, 38],
      borderColor: '#eab308', // yellow
      tension: 0.4
    }
  ]
}

export const mockInstitutions = [
  {
    _id: 'inst1',
    name: 'Klinik Tumbuh Kembang Anak',
    description: 'Fokus pada autisme dan speech delay',
    address: 'Jakarta Selatan',
    phone: '021-1234567',
    email: 'kliniktumbuhkembang@gmail.com',
    status: 'aktif',
    username: 'kliniktumbuhkembanganak'
  },
  {
    _id: 'inst2',
    name: 'Pusat Terapi Disleksia',
    description: 'Terapi membaca dan menulis',
    address: 'Bandung',
    phone: '022-7654321',
    email: 'pusatterapidisleksia@gmail.com',
    status: 'aktif',
    username: 'pusatterapidisleksia'
  },
  {
    _id: 'inst3',
    name: 'Yayasan Peduli Anak Spesial',
    description: 'Dukungan komprehensif ABK',
    address: 'Surabaya',
    phone: '031-5556667',
    email: 'yayasanpedulianakspesial@gmail.com',
    status: 'aktif',
    username: 'yayasanpedulianakspesial'
  },
  {
    _id: 'inst4',
    name: 'Klinik Psikologi Anak',
    description: 'Konseling dan terapi perilaku',
    address: 'Yogyakarta',
    phone: '0274-888999',
    email: 'klinikpsikologianak@gmail.com',
    status: 'aktif',
    username: 'klinikpsikologianak'
  },
  {
    _id: 'inst5',
    name: 'Sentra Terapi Bermain',
    description: 'Pendekatan melalui bermain terarah',
    address: 'Medan',
    phone: '061-222333',
    email: 'sentraterapibermain@gmail.com',
    status: 'aktif',
    username: 'sentraterapibermain'
  },
]

export const mockModules = [
  { id: 'mod1', name: 'Dashboard' },
  { id: 'mod2', name: 'Lembaga' },
  { id: 'mod3', name: 'Paket Penjualan' },
  { id: 'mod4', name: 'Manajemen Pengguna' },
  { id: 'mod5', name: 'Siswa' },
  { id: 'mod6', name: 'Guru' }
]

const generateDefaultAccess = () => {
  return mockModules.map(m => ({
    moduleId: m.id,
    moduleName: m.name,
    canView: true,
    canAdd: false,
    canEdit: false,
    canDelete: false,
    canDetail: true
  }))
}

export const mockRoles = [
  {
    _id: 'role1',
    name: 'Admin',
    description: 'Role paling jago',
    status: 'aktif',
    access: mockModules.map(m => ({
      moduleId: m.id,
      moduleName: m.name,
      canView: true,
      canAdd: true,
      canEdit: true,
      canDelete: true,
      canDetail: true
    }))
  },
  {
    _id: 'role2',
    name: 'Lembaga',
    description: 'Akun lembaga',
    status: 'aktif',
    access: generateDefaultAccess()
  },
  {
    _id: 'role3',
    name: 'Guru',
    description: 'Akun guru dari lembaga',
    status: 'aktif',
    access: generateDefaultAccess()
  },
  {
    _id: 'role4',
    name: 'Orang Tua',
    description: 'Akun orang tua',
    status: 'aktif',
    access: generateDefaultAccess()
  }
]
