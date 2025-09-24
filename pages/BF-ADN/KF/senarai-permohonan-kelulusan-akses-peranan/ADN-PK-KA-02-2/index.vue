<template>
  <div>
    <layouts-breadcrumb :items="breadcrumb" />

    <h1 class="text-xl font-bold mt-4">Semakan Dan Kelulusan Akses Peranan</h1>

    <!-- LAYOUT: 2 kolum, tindakan di kolum kanan pada baris bawah -->
    <div class="grid gap-6 md:grid-cols-2 mt-4">

      <!-- KIRI: Konfigurasi Semasa -->
      <rs-card class="mt-0">
        <template #header>
          <h2 class="text-lg font-semibold">Konfigurasi Semasa</h2>
        </template>
        <template #body>
          <div class="space-y-2">
            <div class="flex gap-3">
              <div class="w-48 font-semibold">Status Tugasan:</div>
              <div class="flex-1">{{ currentConfig.statusTugasan || '-' }}</div>
            </div>

            <div class="flex gap-3">
              <div class="w-48 font-semibold">Mod Akses:</div>
              <div class="flex-1">{{ currentConfig.modAkses || '-' }}</div>
            </div>

            <div v-if="currentConfig.modAkses === 'Kumpulan'" class="flex gap-3">
              <div class="w-48 font-semibold">Senarai Peranan:</div>
              <div class="flex-1">{{ (currentConfig.senaraiPeranan || []).join(', ') || '-' }}</div>
            </div>

            <div v-if="currentConfig.modAkses === 'Per Individu'" class="flex gap-3">
              <div class="w-48 font-semibold">Senarai Pegawai:</div>
              <div class="flex-1">{{ (currentConfig.senaraiPegawai || []).join(', ') || '-' }}</div>
            </div>

            <div class="flex gap-3">
              <div class="w-48 font-semibold">Tarikh Mula Kuasa:</div>
              <div class="flex-1">{{ formatDate(currentConfig.tarikhMulaKuasa) || '-' }}</div>
            </div>

            <div class="flex gap-3">
              <div class="w-48 font-semibold">Status Konfigurasi:</div>
              <div class="flex-1">
                <rs-badge :variant="getStatusKonfigurasiVariant(currentConfig.status)">
                  {{ currentConfig.status || '-' }}
                </rs-badge>
              </div>
            </div>
          </div>
        </template>
      </rs-card>

      <!-- KANAN: Permohonan Baru -->
      <rs-card class="mt-0">
        <template #header>
          <h2 class="text-lg font-semibold">Permohonan Baru</h2>
        </template>
        <template #body>
          <div class="space-y-2">
            <div class="flex gap-3">
              <div class="w-48 font-semibold">Status Tugasan:</div>
              <div class="flex-1">{{ record.statusTugasan }}</div>
            </div>

            <div class="flex gap-3">
              <div class="w-48 font-semibold">Mod Akses:</div>
              <div class="flex-1">{{ record.modAkses }}</div>
            </div>

            <div v-if="record.modAkses === 'Kumpulan'" class="flex gap-3">
              <div class="w-48 font-semibold">Senarai Peranan:</div>
              <div class="flex-1">{{ record.perananIndividu }}</div>
            </div>

            <div v-if="record.modAkses === 'Per Individu'" class="flex gap-3">
              <div class="w-48 font-semibold">Senarai Pegawai:</div>
              <div class="flex-1">{{ record.perananIndividu }}</div>
            </div>

            <div class="flex gap-3">
              <div class="w-48 font-semibold">Status Konfigurasi:</div>
              <div class="flex-1">
                <rs-badge :variant="getStatusKonfigurasiVariant(record.statusKonfigurasi)">
                  {{ record.statusKonfigurasi }}
                </rs-badge>
              </div>
            </div>

            <div class="flex gap-3">
              <div class="w-48 font-semibold">Tarikh Mula Kuasa:</div>
              <div class="flex-1">{{ formatDate(record.tarikhMulaKuasa) }}</div>
            </div>

            <div class="flex gap-3">
              <div class="w-48 font-semibold">Catatan Kemaskini:</div>
              <div class="flex-1">{{ record.catatanKemaskini || '-' }}</div>
            </div>

            <div class="flex gap-3">
              <div class="w-48 font-semibold">Dikemukakan oleh:</div>
              <div class="flex-1">{{ record.dikemukakanOleh }}</div>
            </div>

            <div class="flex gap-3">
              <div class="w-48 font-semibold">Tarikh Permohonan:</div>
              <div class="flex-1">{{ formatDate(record.tarikhPermohonan) }}</div>
            </div>

            <div class="flex gap-3">
              <div class="w-48 font-semibold">Status Permohonan:</div>
              <div class="flex-1">
                <rs-badge :variant="getStatusPermohonanVariant(record.statusPermohonan)">
                  {{ record.statusPermohonan }}
                </rs-badge>
              </div>
            </div>
          </div>
        </template>
      </rs-card>

      <!-- BAWAH: Tindakan (align ke kolum kanan pada md+) -->
      <div class="md:col-start-2">
        <rs-card class="mt-0">
          <template #header>
            <h2 class="text-lg font-semibold">Tindakan</h2>
          </template>
          <template #body>
            <FormKit
              type="textarea"
              v-model="ulasanPelulus"
              label="Ulasan Ketua Jabatan:"
              placeholder="Masukkan ulasan jika permohonan ditolak atau catatan lain..."
              validation="required"
              :validation-messages="{ required: 'Ulasan pelulus diperlukan.' }"
              :rows="4"
            />
            <div class="flex flex-wrap gap-3 mt-4">
              <rs-button variant="success" :disabled="!isValidUlasan" @click="openConfirm('approve')">
                Sahkan Kelulusan
              </rs-button>
              <rs-button variant="danger" :disabled="!isValidUlasan" @click="openConfirm('reject')">
                Tolak Permohonan
              </rs-button>
              <rs-button variant="light" @click="goBack">
                Kembali
              </rs-button>
            </div>
          </template>
        </rs-card>
      </div>
    </div>

    <!-- Popup Pengesahan -->
    <rs-modal v-model="showConfirm" :title="confirmTitle">
      <p class="mb-4">
        Adakah anda pasti untuk {{ confirmMode === 'approve' ? 'meluluskan' : 'menolak' }} permohonan ini?
      </p>
      <template #footer>
        <div class="flex gap-2">
          <rs-button variant="primary" @click="confirmAction">Ya, teruskan</rs-button>
          <rs-button variant="light" @click="showConfirm = false">Batal</rs-button>
        </div>
      </template>
    </rs-modal>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'

definePageMeta({ title: 'Semakan Dan Kelulusan Akses Peranan' })

const breadcrumb = [
  { name: 'Akses Peranan', type: 'link', path: '/BF-ADN/KF'   },
  { name: 'Senarai Permohonan Kelulusan', type: 'link', path: '/BF-ADN/F/senarai-permohonan-kelulusan akses-peranan' },
  { name: 'Semakan Dan Kelulusan Akses Peranan', path: '/BF-ADN/KA/ADN-PK-KA-02_2' },
]

/* ===== Mock dataset (selari dgn senarai — id 1 & 2) ===== */
const listData = [
  {
    id: 1,
    statusTugasan: 'Siasatan Ringkas',
    modAkses: 'Kumpulan',
    perananIndividu: 'KOAD, EPOAD',
    statusKonfigurasi: 'Aktif',
    tarikhMulaKuasa: '2025-09-15',
    statusPermohonan: 'Menunggu Kelulusan',
    catatanKemaskini: 'Permohonan baru dikemukakan untuk semakan',
    dikemukakanOleh: 'admin2',
    tarikhPermohonan: '2025-09-14',
  },
  {
    id: 2,
    statusTugasan: 'Quick Assessment',
    modAkses: 'Per Individu',
    perananIndividu: 'Nazri Bin Ali',
    statusKonfigurasi: 'Aktif',
    tarikhMulaKuasa: '2025-09-18',
    statusPermohonan: 'Diluluskan',
    catatanKemaskini: 'Tambah akses individu.',
    dikemukakanOleh: 'Siti Sarah',
    tarikhPermohonan: '2025-09-19',
  },
]

/* Konfigurasi semasa (contoh) */
const currentConfig = {
  statusTugasan: 'Siasatan Ringkas',
  modAkses: 'Kumpulan',
  senaraiPeranan: ['KOAD', 'EPOAD'],
  senaraiPegawai: [],
  status: 'Aktif',
  tarikhMulaKuasa: '2025-09-01',
}

/* Ambil id dari route/query */
const route = useRoute()
const selectedId = computed(() => Number(route.params.id || route.query.id || 0))

/* Rekod yang dipaparkan */
const record = computed(() => {
  return listData.find(r => r.id === selectedId.value) || listData[0]
})

/* Form state */
const ulasanPelulus = ref('')
const isValidUlasan = computed(() => (ulasanPelulus.value || '').trim().length > 0)

/* Confirm modal */
const showConfirm = ref(false)
const confirmMode = ref('approve') // 'approve' | 'reject'
const confirmTitle = computed(() =>
  confirmMode.value === 'approve' ? 'Sahkan Kelulusan' : 'Sahkan Penolakan'
)

function openConfirm(mode) {
  confirmMode.value = mode
  showConfirm.value = true
}

async function confirmAction() {
  showConfirm.value = false
  // Demo update setempat; produksi -> panggil API
  const idx = listData.findIndex(r => r.id === record.value.id)
  if (idx > -1) {
    listData[idx].statusPermohonan = confirmMode.value === 'approve' ? 'Diluluskan' : 'Ditolak'
    listData[idx].catatanKemaskini = `Pelulus: ${ulasanPelulus.value}`
  }
  await navigateTo(`/BF-ADN/KA/ADN-PK-KA-02_3?id=${record.value.id}`)
}

function goBack() {
  history.length > 1 ? window.history.back() : navigateTo('/BF-ADN/F/senarai-permohonan-kelulusan-akses-peranan')
}

/* Helpers */
function formatDate(iso) {
  if (!iso) return ''
  const d = new Date(iso)
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${day}/${m}/${y}` // ikut contoh screenshot (dd/mm/yyyy)
}
function getStatusKonfigurasiVariant(t) {
  if (t === 'Aktif') return 'success'
  if (t === 'Tidak Aktif') return 'danger'
  return 'secondary'
}
function getStatusPermohonanVariant(t) {
  if (t === 'Diluluskan') return 'success'
  if (t === 'Ditolak') return 'danger'
  if (t === 'Menunggu Kelulusan') return 'warning'
  return 'secondary'
}
</script>

<style scoped>
/* Laraskan lebar label; boleh ubah ke w-56/w-64 jika perlu */
</style>
