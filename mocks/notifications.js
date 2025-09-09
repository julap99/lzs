// ~/mocks/notifications.js
import { ref, computed } from 'vue'

/**
 * Shape:
 * - id: string
 * - type: 'TUNTUTAN_IMPROVEMENT' | 'TUNTUTAN_APPROVAL' | 'TUNTUTAN_UPDATE' | 'KEWANGAN' | 'TUGASAN' | etc.
 * - title: string
 * - message: string (can contain \n, use `whitespace-pre-line` to display)
 * - status: 'UNREAD' | 'READ'
 * - createdAt: ISO string
 * - link?: deep-link in your app
 * - email?: payload to preview “Email Notification” (RTMF)
 */
export const notifications = ref([
  // RTMF: Bell Notification + Email Notification (Penambahbaikan)
  {
    id: 'N-3001',
    type: 'TUNTUTAN_IMPROVEMENT',
    title: 'Tuntutan perlu penambahbaikan',
    message:
      'Tuntutan bagi No. Tuntutan: TUN-2024-002 perlu buat penambahbaikan.\nTarikh: 01/08/2025',
    status: 'UNREAD',
    createdAt: '2025-08-01T08:30:00+08:00',
    link: '/BF-BTN/tuntutan-dengan-siasatan/senarai-tuntutan-eoad/TUN-2024-002/pengesahan',
    email: {
      // for preview page (optional)
      namaPemohon: 'Masjid Al-Hidayah',
      noTuntutan: 'TUN-2024-002',
      amaun: 8000.0,
      tarikhMohon: '31/07/2025',
      catatan: 'Dokumen tidak lengkap.',
      linkNas: '/auth/login',
    },
  },

  // Bell samples used in your header mock
{
  id: 'N-3002',
  type: 'TNI_TAMBAH_NILAI',
  title: 'Permohonan Tambah Nilai Tunai – Menunggu Semakan',
  message:
    'Permohonan ID: TNI-2024-00321 (Cawangan Johor Bahru)\nKaedah: eWallet • Jumlah: RM 30,000.00\nTarikh Mohon: 19/03/2024',
  status: 'UNREAD',
  createdAt: new Date(Date.now() - 5 * 60 * 1000).toISOString(), // 5 min ago
  link: '/BF-TNI/tambah-nilai-tunai/mohon-tambah-nilai-tunai/view/TNI-2024-00321',
},
{
  id: 'N-3003',
  type: 'TNI_TAMBAH_NILAI',
  title: 'Tunai Diterima – Menunggu Pengesahan',
  message:
    'Permohonan ID: TNI-2024-00321\nTarikh & Masa Terima: 21/03/2024 14:30\nJumlah Tunai Terima: RM 30,000.00\nPenerima: Ahmad bin Abdullah',
  status: 'UNREAD',
  createdAt: new Date(Date.now() - 60 * 60 * 1000).toISOString(), // 1 hour ago
  link: '/BF-TNI/tambah-nilai-tunai/mohon-tambah-nilai-tunai/view/TNI-2024-00321',
}
,

  // Extra examples tied to your TUN mock list
  {
  id: 'N-3004',
  type: 'TUGASAN',
  title: 'Tugasan siasatan baharu',
  message: 'Aduan Kelas 1 telah diagihkan kepada anda.\nNo. Aduan: ADN-2025-889',
  status: 'READ',
  createdAt: '2025-07-22T09:00:00+08:00',
  link: '/BF-ADN/PA/AT/02',
}
,

  {
    id: 'N-3005',
    type: 'TUNTUTAN_APPROVAL',
    title: 'Tuntutan untuk kelulusan',
    message:
      'Tuntutan bagi No. Tuntutan: TUN-2024-005 untuk kelulusan KOAD.',
    status: 'UNREAD',
    createdAt: '2025-07-31T14:00:00+08:00',
    link: '/BF-BTN/tuntutan-dengan-siasatan/senarai-tuntutan-eoad/TUN-2024-005/pengesahan',
  },
  {
    id: 'N-3006',
    type: 'TUNTUTAN_UPDATE',
    title: 'Status tuntutan dikemas kini',
    message:
      'Tuntutan TUN-2024-003 kini berada pada status: Dalam Semakan.',
    status: 'READ',
    createdAt: '2025-07-21T16:00:00+08:00',
    link: '/BF-BTN/tuntutan-dengan-siasatan/senarai-tuntutan-eoad/TUN-2024-003/pengesahan',
  },
])

/* ─────────── Helpers for UI (bell + “Lihat Semua”) ─────────── */

export const unreadCount = computed(
  () => notifications.value.filter(n => n.status === 'UNREAD').length
)

export const latest = computed(() =>
  [...notifications.value].sort(
    (a, b) => +new Date(b.createdAt) - +new Date(a.createdAt)
  )
)

export function markRead(id) {
  const it = notifications.value.find(n => n.id === id)
  if (it) it.status = 'READ'
}

export function toggleRead(id) {
  const it = notifications.value.find(n => n.id === id)
  if (it) it.status = it.status === 'UNREAD' ? 'READ' : 'UNREAD'
}

export function markAllRead() {
  notifications.value.forEach(n => (n.status = 'READ'))
}

export function remove(id) {
  const i = notifications.value.findIndex(n => n.id === id)
  if (i >= 0) notifications.value.splice(i, 1)
}

export function add(n) {
  // minimal guard; ensure id + createdAt exist
  notifications.value.unshift({
    status: 'UNREAD',
    createdAt: new Date().toISOString(),
    ...n,
  })
}
