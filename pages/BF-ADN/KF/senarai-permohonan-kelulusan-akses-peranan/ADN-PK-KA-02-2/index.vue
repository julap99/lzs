<template>
  <div>
    <layouts-breadcrumb :items="breadcrumb" />

    <div class="flex justify-between items-center mb-3">
      <h1 class="text-2xl font-semibold flex items-center gap-2">
        <Icon name="ic:outline-info" />
        Semakan Dan Kelulusan Akses Peranan
      </h1>

      <!-- BUTANG KEMBALI (baru) -->
      <rs-button variant="secondary" @click="goBack" class="whitespace-nowrap">
        <Icon name="ic:round-arrow-back" class="mr-1" />
        Kembali
      </rs-button>
    </div>

    <!-- Grid utama: kiri (2 kad bertindan), kanan (Ulasan & Tindakan) -->
    <div class="grid grid-cols-1 xl:grid-cols-2 gap-6 mt-4">
      <!-- KIRI: stack dua kad -->
      <div class="space-y-6">
        <!-- Konfigurasi Semasa -->
        <rs-card>
          <template #header>
            <div class="text-lg font-semibold">Konfigurasi Semasa</div>
          </template>
          <template #body>
            <div class="grid md:grid-cols-2 gap-4">
              <div>
                <div class="text-sm text-gray-500">Status Tugasan</div>
                <div class="mt-1 px-3 py-2 rounded-md border bg-gray-50">
                  {{ currentConfig.statusTugasan || '-' }}
                </div>
              </div>

              <div>
                <div class="text-sm text-gray-500">Mod Akses</div>
                <div class="mt-1 px-3 py-2 rounded-md border bg-gray-50">
                  {{ currentConfig.modAkses || '-' }}
                </div>
              </div>

              <div v-if="currentConfig.modAkses === 'Kumpulan'">
                <div class="text-sm text-gray-500">Senarai Peranan</div>
                <div class="mt-1 px-3 py-2 rounded-md border bg-gray-50">
                  {{ (currentConfig.senaraiPeranan || []).join(', ') || '-' }}
                </div>
              </div>

              <div v-if="currentConfig.modAkses === 'Per Individu'">
                <div class="text-sm text-gray-500">Senarai Pegawai</div>
                <div class="mt-1 px-3 py-2 rounded-md border bg-gray-50">
                  {{ (currentConfig.senaraiPegawai || []).join(', ') || '-' }}
                </div>
              </div>

              <div>
                <div class="text-sm text-gray-500">Tarikh Mula Kuasa</div>
                <div class="mt-1 px-3 py-2 rounded-md border bg-gray-50">
                  {{ formatDate(currentConfig.tarikhMulaKuasa) || '-' }}
                </div>
              </div>

              <div>
                <div class="text-sm text-gray-500">Status Konfigurasi</div>
                <div class="mt-1">
                  <rs-badge :variant="getStatusKonfigurasiVariant(currentConfig.status)">
                    {{ currentConfig.status || '-' }}
                  </rs-badge>
                </div>
              </div>
            </div>
          </template>
        </rs-card>

        <!-- Permohonan Baharu -->
        <rs-card>
          <template #header>
            <div class="text-lg font-semibold">Permohonan Baharu</div>
          </template>
          <template #body>
            <div class="grid md:grid-cols-2 gap-4">
              <div>
                <div class="text-sm text-gray-500">Status Tugasan</div>
                <div class="mt-1 px-3 py-2 rounded-md border bg-gray-50">
                  {{ record.statusTugasan || '-' }}
                </div>
              </div>

              <div>
                <div class="text-sm text-gray-500">Mod Akses</div>
                <div class="mt-1 px-3 py-2 rounded-md border bg-gray-50">
                  {{ record.modAkses || '-' }}
                </div>
              </div>

              <div v-if="record.modAkses === 'Kumpulan'">
                <div class="text-sm text-gray-500">Senarai Peranan</div>
                <div class="mt-1 px-3 py-2 rounded-md border bg-gray-50">
                  {{ record.perananIndividu || '-' }}
                </div>
              </div>

              <div v-if="record.modAkses === 'Per Individu'">
                <div class="text-sm text-gray-500">Senarai Pegawai</div>
                <div class="mt-1 px-3 py-2 rounded-md border bg-gray-50">
                  {{ record.perananIndividu || '-' }}
                </div>
              </div>

              <div>
                <div class="text-sm text-gray-500">Status Konfigurasi</div>
                <div class="mt-1">
                  <rs-badge :variant="getStatusKonfigurasiVariant(record.statusKonfigurasi)">
                    {{ record.statusKonfigurasi || '-' }}
                  </rs-badge>
                </div>
              </div>

              <div>
                <div class="text-sm text-gray-500">Tarikh Mula Kuasa</div>
                <div class="mt-1 px-3 py-2 rounded-md border bg-gray-50">
                  {{ formatDate(record.tarikhMulaKuasa) || '-' }}
                </div>
              </div>

              <div class="md:col-span-2">
                <div class="text-sm text-gray-500">Catatan Kemaskini</div>
                <div class="mt-1 px-3 py-2 rounded-md border bg-gray-50 whitespace-pre-line">
                  {{ record.catatanKemaskini || '-' }}
                </div>
              </div>

              <div>
                <div class="text-sm text-gray-500">Dikemukakan Oleh</div>
                <div class="mt-1 px-3 py-2 rounded-md border bg-gray-50">
                  {{ record.dikemukakanOleh || '-' }}
                </div>
              </div>

              <div>
                <div class="text-sm text-gray-500">Tarikh Permohonan</div>
                <div class="mt-1 px-3 py-2 rounded-md border bg-gray-50">
                  {{ formatDate(record.tarikhPermohonan) || '-' }}
                </div>
              </div>

              <div class="md:col-span-2 text-right">
                <span class="mr-2 font-medium">Status Permohonan:</span>
                <rs-badge :variant="getStatusPermohonanVariant(record.statusPermohonan)">
                  {{ record.statusPermohonan || '-' }}
                </rs-badge>
              </div>
            </div>
          </template>
        </rs-card>
      </div>

      <!-- KANAN: Ulasan & Tindakan -->
      <div>
        <rs-card class="xl:sticky xl:top-4">
          <template #header>
            <div class="text-lg font-semibold">Ulasan & Tindakan</div>
          </template>
          <template #body>
            <div class="space-y-4">
              <!-- 1) Keputusan (FormKit Select) -->
              <FormKit
                type="select"
                label="Status Permohonan"
                placeholder="Pilih status..."
                :options="[
                  { label: 'Lulus', value: 'approve' },
                  { label: 'Tidak Lulus', value: 'reject' }
                ]"
                v-model="keputusan"
                @input="onDecision"
              />

              <!-- 2) Ulasan -->
              <div>
                <label class="block font-medium mb-2">
                  Ulasan
                  <span v-if="keputusan === 'reject'" class="text-danger">*</span>
                </label>
                <textarea
                  v-model="ulasanPelulus"
                  class="w-full min-h-[140px] border rounded-md px-3 py-2 outline-none"
                  :placeholder="keputusan === 'reject' ? 'Nyatakan sebab tidak lulus...' : 'Masukkan catatan kelulusan...'"
                  :required="keputusan === 'reject'"
                />
              </div>

              <!-- 3) Tarikh Semakan -->
              <FormKit
                type="date"
                label="Tarikh Semakan"
                v-model="tarikhSemakan"
                :max="today"
              />
            </div>
          </template>
        </rs-card>
      </div>
    </div>

    <!-- Popup Pengesahan (kekal) -->
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
  { name: 'Akses Peranan', type: 'link', path: '/BF-ADN/KF' },
  { name: 'Senarai Permohonan Kelulusan', type: 'link', path: '/BF-ADN/F/senarai-permohonan-kelulusan akses-peranan' },
  { name: 'Semakan Dan Kelulusan Akses Peranan', path: '/BF-ADN/KA/ADN-PK-KA-02_2' },
]

/* Mock data (kekal) */
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

/* Route/record */
const route = useRoute()
const selectedId = computed(() => Number(route.params.id || route.query.id || 0))
const record = computed(() => listData.find(r => r.id === selectedId.value) || listData[0])

/* Ulasan & tindakan */
const ulasanPelulus = ref('')

/* Select & tarikh semakan */
const keputusan = ref(null)                 // 'approve' | 'reject'
const tarikhSemakan = ref(todayISO())
const today = computed(() => todayISO())

/* Modal pengesahan (fungsi kekal) */
const showConfirm = ref(false)
const confirmMode = ref('approve')
const confirmTitle = computed(() =>
  confirmMode.value === 'approve' ? 'Sahkan Kelulusan' : 'Sahkan Penolakan'
)

function onDecision(val) {
  if (!val) return
  confirmMode.value = val
  showConfirm.value = true
}

async function confirmAction() {
  showConfirm.value = false
  const idx = listData.findIndex(r => r.id === record.value.id)
  if (idx > -1) {
    listData[idx].statusPermohonan = confirmMode.value === 'approve' ? 'Diluluskan' : 'Ditolak'
    listData[idx].catatanKemaskini = `Pelulus (${tarikhSemakan.value}): ${ulasanPelulus.value}`
  }
  await navigateTo(`/BF-ADN/KA/ADN-PK-KA-02_3?id=${record.value.id}`)
}

/* BUTANG KEMBALI (baru) */
function goBack() {
  navigateTo('/BF-ADN/KF/senarai-permohonan-kelulusan-akses-peranan')
}

/* Helpers */
function formatDate(iso) {
  if (!iso) return ''
  const d = new Date(iso)
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${day}/${m}/${y}`
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
function todayISO() {
  const d = new Date()
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}
</script>

<style scoped>
/* Guna utiliti Tailwind; tiada CSS khusus diperlukan */
</style>
