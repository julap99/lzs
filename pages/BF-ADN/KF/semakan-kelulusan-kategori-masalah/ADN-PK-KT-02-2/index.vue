<template>
  <div>
    <layouts-breadcrumb :items="breadcrumb" />

    <h1 class="text-2xl font-bold text-center mb-6">
      Semakan & Kelulusan Kategori Masalah
    </h1>

    <div class="grid grid-cols-1 xl:grid-cols-2 gap-6">
      <!-- Konfigurasi Semasa -->
      <rs-card>
        <template #header>
          <div class="text-lg font-semibold">Konfigurasi Semasa</div>
        </template>
        <template #body>
          <div v-if="currentConfig || permohonan" class="space-y-3">
            <div class="flex gap-3">
              <div class="font-semibold min-w-[190px]">Kategori Masalah:</div>
              <div class="flex-1">
                {{ (currentConfig && currentConfig.kategoriMasalah) || permohonan?.kategoriMasalah || '-' }}
              </div>
            </div>
            <div class="flex gap-3">
              <div class="font-semibold min-w-[190px]">Tahap Aduan:</div>
              <div class="flex-1">
                {{ (currentConfig && currentConfig.tahapAduan) || permohonan?.tahapAduan || '-' }}
              </div>
            </div>
            <div class="flex gap-3">
              <div class="font-semibold min-w-[190px]">Status:</div>
              <div class="flex-1">
                {{ (currentConfig && currentConfig.statusKonfigurasi) || permohonan?.statusKonfigurasi || '-' }}
              </div>
            </div>
            <div class="flex gap-3">
              <div class="font-semibold min-w-[190px]">Tarikh Mula Kuasa (Semasa):</div>
              <div class="flex-1">
                {{ formatDate(permohonan?.tarikhMulaKuasa) }}
              </div>
            </div>
          </div>
          <div v-else class="text-gray-500">Tiada konfigurasi sedia ada.</div>
        </template>
      </rs-card>

      <!-- Permohonan Baharu -->
      <rs-card>
        <template #header>
          <div class="text-lg font-semibold">Permohonan Baharu</div>
        </template>
        <template #body>
          <div v-if="permohonan" class="space-y-3">
            <div class="flex gap-3">
              <div class="font-semibold min-w-[190px]">No Permohonan:</div>
              <div class="flex-1">{{ permohonan.noPermohonan || '-' }}</div>
            </div>
            <div class="flex gap-3">
              <div class="font-semibold min-w-[190px]">Jenis Permohonan:</div>
              <div class="flex-1">{{ permohonan.jenisPermohonan || '-' }}</div>
            </div>
            <div class="flex gap-3">
              <div class="font-semibold min-w-[190px]">Tahap Aduan:</div>
              <div class="flex-1">{{ permohonan.tahapAduan || '-' }}</div>
            </div>
            <div class="flex gap-3">
              <div class="font-semibold min-w-[190px]">Kategori Masalah:</div>
              <div class="flex-1">{{ permohonan.kategoriMasalah || '-' }}</div>
            </div>
            <div class="flex gap-3">
              <div class="font-semibold min-w-[190px]">Status Dimohon:</div>
              <div class="flex-1">
                {{ permohonan.statusDimohon || permohonan.statusKonfigurasi || '-' }}
              </div>
            </div>
            <div class="flex gap-3">
              <div class="font-semibold min-w-[190px]">Tarikh Mula Kuasa:</div>
              <div class="flex-1">{{ formatDate(permohonan.tarikhMulaKuasa) }}</div>
            </div>
            <div class="flex gap-3">
              <div class="font-semibold min-w-[190px]">Catatan Kemaskini:</div>
              <div class="flex-1">{{ permohonan.catatan || '-' }}</div>
            </div>
            <div class="flex gap-3">
              <div class="font-semibold min-w-[190px]">Dikemukakan Oleh:</div>
              <div class="flex-1">{{ permohonan.dikemukakanOleh || '-' }}</div>
            </div>
            <div class="flex gap-3">
              <div class="font-semibold min-w-[190px]">Tarikh Permohonan:</div>
              <div class="flex-1">{{ formatDate(permohonan.tarikhPermohonan) }}</div>
            </div>
          </div>
          <div v-else class="text-gray-500">Rekod permohonan tidak dijumpai.</div>
        </template>
      </rs-card>
    </div>

    <!-- Ulasan & Tindakan -->
    <rs-card class="mt-8">
      <template #header>
        <div class="text-lg font-semibold">Ulasan & Tindakan</div>
      </template>
      <template #body>
        <div class="space-y-4">
          <div>
            <label class="block font-medium mb-2">Ulasan (wajib jika tolak):</label>
            <textarea
              v-model="ulasan"
              class="w-full min-h-[140px] border rounded-md px-3 py-2 outline-none"
              placeholder="Tulis ulasan anda di sini..."
            />
          </div>

          <div class="flex flex-wrap gap-3 justify-end">
            <rs-button
              variant="success"
              :disabled="!permohonan || isProcessing"
              @click="openModal('approve')"
            >
              Luluskan
            </rs-button>

            <rs-button
              variant="danger"
              :disabled="!permohonan || isProcessing"
              @click="openModal('reject')"
            >
              Tolak Permohonan
            </rs-button>
          </div>

          <div v-if="statusSemasa" class="text-right">
            <span class="mr-2 font-medium">Status Permohonan:</span>
            <rs-badge :variant="badgeVariant(statusSemasa)">{{ statusSemasa }}</rs-badge>
          </div>
        </div>
      </template>
    </rs-card>

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
import { useRoute } from '#imports'

definePageMeta({ title: 'Semakan Kelulusan Kategori Masalah' })

/* Breadcrumb */
const breadcrumb = [
  { name: 'Mengurus Konfigurasi', type: 'link', path: '/BF-ADN/KF' },
  { name: 'Senarai Semakan Kelulusan', type: 'link', path: '/BF-ADN/KF/semakan-kelulusan-kategori-masalah' },
  { name: 'Semakan & Kelulusan Kategori Masalah', type: 'text', path: '' },
]

/* Komponen baris label:nilai ringkas */
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

/* Route & state */
const route = useRoute()
const noPermohonan = computed(() => route.query.noPermohonan || '')

const permohonan = ref(null)       // data permohonan baharu
const currentConfig = ref(null)    // konfigurasi semasa
const statusSemasa = ref('')       // preview status

const ulasan = ref('')
const isProcessing = ref(false)

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
const ulasanValid = computed(() => mode.value === 'approve' || (ulasan.value && ulasan.value.trim().length > 0))

function openModal(type) {
  mode.value = type
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
})

/* Tindakan */
async function confirmAction() {
  if (mode.value === 'reject' && !ulasanValid.value) return
  isProcessing.value = true
  try {
    // TODO: panggil API sebenar (submit kelulusan/penolakan + ulasan).
    statusSemasa.value = mode.value === 'approve' ? 'Diluluskan' : 'Ditolak'
    showConfirm.value = false
  } finally {
    isProcessing.value = false
  }
}

/* Util */
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
/* gunakan utiliti Tailwind untuk susun atur; tiada CSS khas diperlukan */
</style>
