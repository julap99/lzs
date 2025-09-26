<template>
  <div>
    <layouts-breadcrumb :items="breadcrumb" />

    <!-- Header + Button Kembali -->
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-2xl font-bold">
        Semakan & Kelulusan Kategori Masalah
      </h1>

      <rs-button variant="secondary" @click="goBack" class="whitespace-nowrap">
        <Icon name="ic:round-arrow-back" class="mr-1" />
        Kembali
      </rs-button>
    </div>

    <!-- Grid utama: Kiri (2 kad), Kanan (Ulasan & Tindakan) -->
    <div class="grid grid-cols-1 xl:grid-cols-2 gap-6">
      <!-- Kiri: Konfigurasi Semasa + Permohonan Baharu -->
      <div class="space-y-6">
        <!-- Konfigurasi Semasa (read-only) -->
        <rs-card>
          <template #header>
            <div class="text-lg font-semibold">Konfigurasi Semasa</div>
          </template>
          <template #body>
            <div v-if="currentConfig || permohonan" class="grid md:grid-cols-2 gap-4">
              <div>
                <div class="text-sm text-gray-500">Kategori Masalah</div>
                <div class="mt-1 px-3 py-2 rounded-md border bg-gray-50">
                  {{ (currentConfig && currentConfig.kategoriMasalah) || permohonan?.kategoriMasalah || '-' }}
                </div>
              </div>

              <div>
                <div class="text-sm text-gray-500">Tahap Aduan</div>
                <div class="mt-1 px-3 py-2 rounded-md border bg-gray-50">
                  {{ (currentConfig && currentConfig.tahapAduan) || permohonan?.tahapAduan || '-' }}
                </div>
              </div>

              <div>
                <div class="text-sm text-gray-500">Status</div>
                <div class="mt-1 px-3 py-2 rounded-md border bg-gray-50">
                  {{ (currentConfig && currentConfig.statusKonfigurasi) || permohonan?.statusKonfigurasi || '-' }}
                </div>
              </div>

              <div>
                <div class="text-sm text-gray-500">Tarikh Mula Kuasa (Semasa)</div>
                <div class="mt-1 px-3 py-2 rounded-md border bg-gray-50">
                  {{ formatDate(permohonan?.tarikhMulaKuasa) }}
                </div>
              </div>
            </div>
            <div v-else class="text-gray-500">Tiada konfigurasi sedia ada.</div>
          </template>
        </rs-card>

        <!-- Permohonan Baharu (read-only) -->
        <rs-card>
          <template #header>
            <div class="text-lg font-semibold">Permohonan Baharu</div>
          </template>
          <template #body>
            <div v-if="permohonan" class="grid md:grid-cols-2 gap-4">
              <div>
                <div class="text-sm text-gray-500">No Permohonan</div>
                <div class="mt-1 px-3 py-2 rounded-md border bg-gray-50">
                  {{ permohonan.noPermohonan || '-' }}
                </div>
              </div>

              <div>
                <div class="text-sm text-gray-500">Jenis Permohonan</div>
                <div class="mt-1 px-3 py-2 rounded-md border bg-gray-50">
                  {{ permohonan.jenisPermohonan || '-' }}
                </div>
              </div>

              <div>
                <div class="text-sm text-gray-500">Tahap Aduan</div>
                <div class="mt-1 px-3 py-2 rounded-md border bg-gray-50">
                  {{ permohonan.tahapAduan || '-' }}
                </div>
              </div>

              <div>
                <div class="text-sm text-gray-500">Kategori Masalah</div>
                <div class="mt-1 px-3 py-2 rounded-md border bg-gray-50">
                  {{ permohonan.kategoriMasalah || '-' }}
                </div>
              </div>

              <div>
                <div class="text-sm text-gray-500">Status Dimohon</div>
                <div class="mt-1 px-3 py-2 rounded-md border bg-gray-50">
                  {{ permohonan.statusDimohon || permohonan.statusKonfigurasi || '-' }}
                </div>
              </div>

              <div>
                <div class="text-sm text-gray-500">Tarikh Mula Kuasa</div>
                <div class="mt-1 px-3 py-2 rounded-md border bg-gray-50">
                  {{ formatDate(permohonan.tarikhMulaKuasa) }}
                </div>
              </div>

              <div class="md:col-span-2">
                <div class="text-sm text-gray-500">Catatan Kemaskini</div>
                <div class="mt-1 px-3 py-2 rounded-md border bg-gray-50 whitespace-pre-line">
                  {{ permohonan.catatan || '-' }}
                </div>
              </div>

              <div>
                <div class="text-sm text-gray-500">Dikemukakan Oleh</div>
                <div class="mt-1 px-3 py-2 rounded-md border bg-gray-50">
                  {{ permohonan.dikemukakanOleh || '-' }}
                </div>
              </div>

              <div>
                <div class="text-sm text-gray-500">Tarikh Permohonan</div>
                <div class="mt-1 px-3 py-2 rounded-md border bg-gray-50">
                  {{ formatDate(permohonan.tarikhPermohonan) }}
                </div>
              </div>
            </div>
            <div v-else class="text-gray-500">Rekod permohonan tidak dijumpai.</div>
          </template>
        </rs-card>
      </div>

      <!-- Kanan: Ulasan & Tindakan -->
      <div>
        <rs-card class="xl:sticky xl:top-4">
          <template #header>
            <div class="text-lg font-semibold">Ulasan & Tindakan</div>
          </template>
          <template #body>
            <div class="space-y-4">
              <!-- 1) Keputusan -->
              <FormKit
                type="select"
                label="Status Permohonan"
                :options="[
                  { label: 'Lulus', value: 'approve' },
                  { label: 'Tidak Lulus', value: 'reject' }
                ]"
                placeholder="Pilih status..."
                v-model="keputusan"
                :disabled="!permohonan || isProcessing"
                @input="onDecision"
              />

              <!-- 2) Ulasan (wajib jika Tidak Lulus) -->
              <div>
                <label class="block font-medium mb-2">
                  Ulasan
                  <span v-if="keputusan === 'reject'" class="text-danger">*</span>
                </label>
                <textarea
                  v-model="ulasan"
                  class="w-full min-h-[140px] border rounded-md px-3 py-2 outline-none"
                  :placeholder="keputusan === 'reject' ? 'Nyatakan sebab tidak lulus...' : 'Ulasan (opsyenal)'"
                />
              </div>

              <!-- 3) Tarikh Disemak -->
              <FormKit
                type="date"
                label="Tarikh Disemak"
                v-model="tarikhDisemak"
                :max="today"
              />

              <div v-if="statusSemasa" class="text-right">
                <span class="mr-2 font-medium">Status Permohonan:</span>
                <rs-badge :variant="badgeVariant(statusSemasa)">{{ statusSemasa }}</rs-badge>
              </div>
            </div>
          </template>
        </rs-card>
      </div>
    </div>

    <!-- Modal Pengesahan -->
    <rs-modal v-model="showConfirm" :title="modalTitle">
      <template #body>
        <p>{{ modalText }}</p>
        <div v-if="mode==='reject' && !ulasanValid" class="mt-3 text-danger text-sm">
          * Ulasan diperlukan untuk tindakan tolak.
        </div>
      </template>
      <template #footer>
        <div class="flex gap-2 justify-end">
          <rs-button variant="secondary" @click="showConfirm=false">Batal</rs-button>
          <rs-button :variant="mode==='approve' ? 'primary' : 'danger'" @click="confirmAction">
            Ya, teruskan
          </rs-button>
        </div>
      </template>
    </rs-modal>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, defineComponent } from 'vue'
import { useRoute, useRouter } from '#imports'

definePageMeta({ title: 'Semakan Kelulusan Kategori Masalah' })

/* Breadcrumb */
const breadcrumb = [
  { name: 'Mengurus Konfigurasi', type: 'link', path: '/BF-ADN/KF' },
  { name: 'Senarai Semakan Kelulusan', type: 'link', path: '/BF-ADN/KF/semakan-kelulusan-kategori-masalah' },
  { name: 'Semakan & Kelulusan Kategori Masalah', type: 'text', path: '' },
]

/* (Opsyenal) Komponen baris label:nilai ringkas - tidak digunakan dalam layout semasa */
const Row = defineComponent({
  name: 'Row',
  props: { label: String, value: [String, Number] },
  template: `
    <div class="flex gap-3">
      <div class="font-semibold min-w-[190px]">{{ label }}</div>
      <div class="flex-1">{{ value ?? '-' }}</div>
    </div>
  `,
})

/* Router, Route & state */
const router = useRouter()
const route = useRoute()

const goBack = () => router.push('/BF-ADN/KF/semakan-kelulusan-kategori-masalah')

const noPermohonan = computed(() => route.query.noPermohonan || '')

const permohonan = ref(null)       // data permohonan baharu
const currentConfig = ref(null)    // konfigurasi semasa
const statusSemasa = ref('')       // preview status

const ulasan = ref('')
const keputusan = ref(null)        // 'approve' | 'reject'
const tarikhDisemak = ref('')      // YYYY-MM-DD
const isProcessing = ref(false)

/* Tarikh util */
const today = computed(() => todayISO())

/* Modal */
const showConfirm = ref(false)
const mode = ref('approve') // 'approve' | 'reject'
const modalTitle = computed(() =>
  mode.value === 'approve' ? 'Sahkan Kelulusan' : 'Sahkan Penolakan'
)
const modalText = computed(() =>
  mode.value === 'approve'
    ? 'Adakah anda pasti untuk meluluskan permohonan ini?'
    : 'Adakah anda pasti untuk menolak permohonan ini?'
)
/* Ulasan hanya wajib jika Tidak Lulus */
const ulasanValid = computed(() => mode.value === 'approve' || (ulasan.value && ulasan.value.trim().length > 0))

function openModal(type) {
  mode.value = type
  showConfirm.value = true
}

/* Select handler (gantikan dua butang) */
function onDecision(val) {
  if (!val) return
  mode.value = val // 'approve' | 'reject'
  showConfirm.value = true
}

/* Contoh fetch — ganti dengan API sebenar */
function fetchByNoPermohonan(id) {
  const data = [
    {
      noPermohonan: 'KM-PR-0012',
      jenisPermohonan: 'Baru',
      tahapAduan: 'Kelas 1 (Merah)',
      kategoriMasalah: 'Tiada Tempat Tinggal',
      statusKonfigurasi: 'Aktif',
      statusPermohonan: 'Menunggu Kelulusan',
      statusDimohon: 'Aktif',
      tarikhMulaKuasa: '2025-09-14',
      tarikhPermohonan: '2025-09-14',
      dikemukakanOleh: 'Eksekutif_A',
      catatan: '—',
      current: { tahapAduan: 'Kelas 1 (Merah)', kategoriMasalah: 'Tiada Tempat Tinggal', statusKonfigurasi: 'Aktif' },
    },
    {
      noPermohonan: 'KM-PR-0013',
      jenisPermohonan: 'Kemaskini',
      tahapAduan: 'Kelas 2 (Kuning)',
      kategoriMasalah: 'Kekurangan Sumber Pendapatan',
      statusKonfigurasi: 'Tidak Aktif',
      statusPermohonan: 'Diluluskan',
      statusDimohon: 'Tidak Aktif',
      tarikhMulaKuasa: '2025-09-13',
      tarikhPermohonan: '2025-09-13',
      dikemukakanOleh: 'Eksekutif_B',
      catatan: 'Pelarasan kadar.',
      current: { tahapAduan: 'Kelas 2 (Kuning)', kategoriMasalah: 'Kekurangan Sumber Pendapatan', statusKonfigurasi: 'Tidak Aktif' },
    },
  ]
  return data.find(x => x.noPermohonan === id) || null
}

onMounted(() => {
  const id = String(noPermohonan.value)
  const rec = fetchByNoPermohonan(id)
  if (rec) {
    permohonan.value = rec
    currentConfig.value = rec.current || null
    statusSemasa.value = rec.statusPermohonan
  }
  // set default tarikh disemak = hari ini
  tarikhDisemak.value = todayISO()
})

/* Tindakan */
async function confirmAction() {
  if (mode.value === 'reject' && !ulasanValid.value) return
  isProcessing.value = true
  try {
    // TODO: panggil API sebenar (submit kelulusan/penolakan + ulasan + tarikhDisemak).
    // contoh payload:
    // {
    //   noPermohonan: noPermohonan.value,
    //   keputusan: mode.value,             // 'approve' | 'reject'
    //   ulasan: ulasan.value,
    //   tarikhDisemak: tarikhDisemak.value // 'YYYY-MM-DD'
    // }
    statusSemasa.value = mode.value === 'approve' ? 'Diluluskan' : 'Ditolak'
    showConfirm.value = false
  } finally {
    isProcessing.value = false
  }
}

/* Util */
function todayISO() {
  const d = new Date()
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

function formatDate(iso) {
  if (!iso) return '-'
  const d = new Date(iso)
  if (isNaN(d)) return '-'
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}
function badgeVariant(status) {
  if (status === 'Diluluskan') return 'success'
  if (status === 'Ditolak') return 'danger'
  if (status === 'Menunggu Kelulusan') return 'warning'
  return 'secondary'
}
</script>

<style scoped>
/* Guna utiliti Tailwind; tiada CSS khusus diperlukan */
</style>
