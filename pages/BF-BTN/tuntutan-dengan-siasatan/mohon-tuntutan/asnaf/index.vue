<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />

    <div class="mt-2">
      <h3 class="text-lg font-semibold">Senarai Bantuan untuk Tuntutan</h3>
    </div>

    <rs-card class="mt-4">
      <template #header>
        <div class="flex justify-between items-center">
          <h2 class="text-xl font-semibold">Senarai Bantuan</h2>
        </div>
      </template>

      <template #body>
        <RsTable
          :data="pagedRows"
          :columns="columns"
          advanced
          :showSearch="true"
          :showFilter="true"
          :showNoColumn="false"
          :options="{
            variant: 'default',
            striped: true,
            bordered: false,
            borderless: false,
            hover: true
          }"
          :optionsAdvanced="{
            sortable: true,
            filterable: true,
            responsive: true,
            outsideBorder: true
          }"
        >
          <!-- No -->
          <template #no="{ value }">
            <div class="flex items-center gap-2">
              <span>{{ value.no }}</span>
            </div>
          </template>

          <!-- Lain-lain kolum -->
          <template #maklumatBantuan="{ text }">
            <div>{{ text }}</div>
          </template>

          <template #pemohon="{ text }">
            <div>{{ text || '-' }}</div>
          </template>

          <template #namaPenerimaManfaat="{ text }">
            <div>{{ text }}</div>
          </template>

          <template #noKPPemohon="{ text }">
            <div>{{ text }}</div>
          </template>

          <template #namaPenerima="{ text }">
            <div>{{ text }}</div>
          </template>

          <template #tarikhMohon="{ text }">
            <div>{{ formatDate(text) }}</div>
          </template>

          <!-- Tindakan -->
          <template #tindakan="{ text, value }">
            <div class="relative inline-flex group">
              <rs-button
                variant="ghost"
                size="sm"
                class="p-1 bg-transparent border-0 shadow-none text-blue-600 hover:text-blue-800"
                @click="saveSelectedAndGo(value || text)"
                title="Mohon Tuntutan"
              >
                <Icon name="material-symbols:add" size="24" />
              </rs-button>
            </div>
          </template>
        </RsTable>

        <!-- Pagination -->
        <div class="flex items-center justify-between px-5 mt-4">
          <div class="flex items-center gap-2">
            <span class="text-sm text-gray-700">Baris per halaman:</span>
            <FormKit
              v-model="pageSize"
              type="select"
              :options="[10, 25, 50]"
              :classes="{
                wrapper: 'w-20',
                outer: 'mb-0',
                input: '!rounded-lg',
              }"
            />
          </div>

          <div class="flex items-center gap-2">
            <span class="text-sm text-gray-700">
              Menunjukkan {{ paginationStart }} hingga
              {{ paginationEnd }} daripada {{ totalBantuan }} entri
            </span>
            <div class="flex gap-1">
              <rs-button
                variant="primary-outline"
                class="!p-1 !w-8 !h-8"
                :disabled="currentPage === 1"
                @click="currentPage--"
              >
                <Icon name="ic:round-keyboard-arrow-left" />
              </rs-button>
              <rs-button
                variant="primary-outline"
                class="!p-1 !w-8 !h-8"
                :disabled="currentPage === totalPages"
                @click="currentPage++"
              >
                <Icon name="ic:round-keyboard-arrow-right" />
              </rs-button>
            </div>
          </div>
        </div>
      </template>
    </rs-card>

    <!-- Divider and Back Action -->
    <div class="border-t border-gray-200 my-6"></div>
    <div class="flex items-center justify-between mt-4">
      <div>
        <rs-button type="button" variant="primary-outline" @click="navigateTo('/BF-BTN/tuntutan-dengan-siasatan')">
          <Icon name="material-symbols:arrow-back" class="w-4 h-4 mr-1" /> Kembali
        </rs-button>
      </div>
      <div></div>
    </div>

    <!-- (Opsyenal) Butang Bulk; biar kekal jika diperlukan -->
    <div v-if="selectedRows.length > 0" class="mt-4 flex justify-end">
      <rs-button variant="success" @click="handleBulkApproval" :disabled="processing">
        <Icon name="material-symbols:approval" class="w-4 h-4 mr-1" />
        Pengesahan (Bulk) ({{ selectedRows.length }})
      </rs-button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { navigateTo } from '#app'

definePageMeta({
  title: 'Borang Tambah Carian',
  description: 'Tambah rekod carian baru',
})

/** =========================
 *  Kolum: buang 'status', tukar label 'No'
 *  ======================= */
const columns = [
  { key: 'no', label: 'No' },
  { key: 'noBantuan', label: 'No. Bantuan', sortable: true },
  { key: 'maklumatBantuan', label: 'Jenis Bantuan', sortable: true },
  { key: 'pemohon', label: 'Pemohon', sortable: true }, // Ayah
  { key: 'namaPenerimaManfaat', label: 'Nama Penerima Manfaat', sortable: true },
  { key: 'noKPPemohon', label: 'No. KP Pemohon', sortable: true },
  { key: 'namaPenerima', label: 'Nama Penerima', sortable: true },
  { key: 'tarikhMohon', label: 'Tarikh Mohon', sortable: true },
  { key: 'tindakan', label: 'Tindakan', sortable: false },
]

/** =========================
 *  Data: TEPAT ikut spesifikasi (4 baris)
 *  ======================= */
const AYAH = 'ALI BIN MOHAMED'
const TARIKH_NOW = new Date().toISOString()

const bantuanList = ref([
  // 1. BANTUAN SUMBANGAN PERALATAN & BINA/BAIKPULIH INSTITUSI AGAMA
  {
    noBantuan: 'APP-2025-001481',
    maklumatBantuan: 'BANTUAN SUMBANGAN PERALATAN & BINA/BAIKPULIH INSTITUSI AGAMA',
    pemohon: 'ALI BIN MOHAMED',
    namaPenerimaManfaat: 'MOHD FARHAN BIN ALI',
    noKPPemohon: '940511146045',
    namaPenerima: 'MASJID AL-HIDAYAH',
    tarikhMohon: '2025-03-20T00:00:00.000Z',
    tindakan: { noBantuan: 'APP-2025-001481' },
  },
  {
    noBantuan: 'APP-2025-001487',
    maklumatBantuan: 'BANTUAN SUMBANGAN PERALATAN & BINA/BAIKPULIH INSTITUSI AGAMA',
    pemohon: 'HASSAN BIN ABDULLAH',
    namaPenerimaManfaat: 'ZAINAB BINTI HASSAN',
    noKPPemohon: '920511146555',
    namaPenerima: 'SURAU KAMPUNG BARU',
    tarikhMohon: '2025-03-18T00:00:00.000Z',
    tindakan: { noBantuan: 'APP-2025-001487' },
  },

  // 2. BANTUAN PERUBATAN DIALISI
  {
    noBantuan: 'APP-2025-001483',
    maklumatBantuan: 'BANTUAN PERUBATAN DIALISI',
    pemohon: 'ALI BIN MOHAMED',
    namaPenerimaManfaat: 'AHMAD BIN HASSAN',
    noKPPemohon: '850315123456',
    namaPenerima: 'PUSAT HEMODIALISIS PERMATA SDN. BHD.',
    tarikhMohon: '2025-03-15T00:00:00.000Z',
    tindakan: { noBantuan: 'APP-2025-001483' },
  },
  {
    noBantuan: 'APP-2025-001488',
    maklumatBantuan: 'BANTUAN PERUBATAN DIALISI',
    pemohon: 'FATIMAH BINTI MOHAMED',
    namaPenerimaManfaat: 'FARID BIN ABDUL',
    noKPPemohon: '880420234567',
    namaPenerima: 'KLINIK KASIH',
    tarikhMohon: '2025-03-12T00:00:00.000Z',
    tindakan: { noBantuan: 'APP-2025-001488' },
  },

  // 3. BANTUAN HUTANG PERUBATAN
  {
    noBantuan: 'APP-2025-001485',
    maklumatBantuan: 'BANTUAN HUTANG PERUBATAN',
    pemohon: 'ALI BIN MOHAMED',
    namaPenerimaManfaat: 'MOHD YUSRI BIN ABDULLAH',
    noKPPemohon: '810101145678',
    namaPenerima: 'PERSATUAN PESAKIT KRONIK',
    tarikhMohon: '2025-03-10T00:00:00.000Z',
    tindakan: { noBantuan: 'APP-2025-001485' },
  },
  {
    noBantuan: 'APP-2025-001489',
    maklumatBantuan: 'BANTUAN HUTANG PERUBATAN',
    pemohon: 'AHMAD BIN HASSAN',
    namaPenerimaManfaat: 'SITI NUR BINTI HASSAN',
    noKPPemohon: '820212145679',
    namaPenerima: 'PUSAT RAWATAN ISLAM',
    tarikhMohon: '2025-03-08T00:00:00.000Z',
    tindakan: { noBantuan: 'APP-2025-001489' },
  },

  // 4. BANTUAN PROGRAM PENERAPAN NILAI ISLAM
  {
    noBantuan: 'APP-2025-001486',
    maklumatBantuan: 'BANTUAN PROGRAM PENERAPAN NILAI ISLAM',
    pemohon: 'ALI BIN MOHAMED',
    namaPenerimaManfaat: 'NURUL AIN BINTI MOHD',
    noKPPemohon: '900202145432',
    namaPenerima: 'SEKOLAH RENDAH ISLAM INTEGRASI',
    tarikhMohon: '2025-03-08T00:00:00.000Z',
    tindakan: { noBantuan: 'APP-2025-001486' },
  },
  {
    noBantuan: 'APP-2025-001490',
    maklumatBantuan: 'BANTUAN PROGRAM PENERAPAN NILAI ISLAM',
    pemohon: 'FATIMAH BINTI MOHAMED',
    namaPenerimaManfaat: 'AMIR BIN MOHD',
    noKPPemohon: '910303145433',
    namaPenerima: 'SEKOLAH MENENGAH ISLAM',
    tarikhMohon: '2025-03-05T00:00:00.000Z',
    tindakan: { noBantuan: 'APP-2025-001490' },
  },

  // 5. Add duplicate rows for realism
  {
    noBantuan: 'APP-2025-001491',
    maklumatBantuan: 'BANTUAN SUMBANGAN PERALATAN & BINA/BAIKPULIH INSTITUSI AGAMA',
    pemohon: 'MUHAMMAD BIN SALLEH',
    namaPenerimaManfaat: 'ZAKARIA BIN SALLEH',
    noKPPemohon: '930101145440',
    namaPenerima: 'MASJID AN-NAIM',
    tarikhMohon: '2025-03-03T00:00:00.000Z',
    tindakan: { noBantuan: 'APP-2025-001491' },
  },
  {
    noBantuan: 'APP-2025-001492',
    maklumatBantuan: 'BANTUAN PERUBATAN DIALISI',
    pemohon: 'AHMAD BIN SALLEH',
    namaPenerimaManfaat: 'FARAH BINTI SALLEH',
    noKPPemohon: '940202145441',
    namaPenerima: 'KLINIK HIDAYAH',
    tarikhMohon: '2025-03-02T00:00:00.000Z',
    tindakan: { noBantuan: 'APP-2025-001492' },
  },
]);

/** =========================
 *  Carian & Pagination ringkas
 *  ======================= */
const searchQuery = ref('')
const pageSize = ref(10)
const currentPage = ref(1)
const selectedRows = ref([])
const processing = ref(false)

const filteredBantuan = computed(() => {
  // Carian mudah (No Bantuan / Nama Penerima Manfaat / Nama Penerima / Pemohon)
  let base = bantuanList.value
  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase()
    base = base.filter(
      (item) =>
        item.noBantuan.toLowerCase().includes(q) ||
        (item.namaPenerimaManfaat || '').toLowerCase().includes(q) ||
        (item.namaPenerima || '').toLowerCase().includes(q) ||
        (item.pemohon || '').toLowerCase().includes(q)
    )
  }
  return base
})

const totalBantuan = computed(() => filteredBantuan.value.length)
const totalPages = computed(() => Math.max(1, Math.ceil(totalBantuan.value / pageSize.value)))
const paginationStart = computed(() =>
  totalBantuan.value === 0 ? 0 : (currentPage.value - 1) * pageSize.value + 1
)
const paginationEnd = computed(() =>
  Math.min(currentPage.value * pageSize.value, totalBantuan.value)
)

// Data dengan kolum "No" dan slice ikut halaman semasa
const tableDataWithNo = computed(() =>
  filteredBantuan.value.map((row, idx) => Object.assign({ no: idx + 1 }, row))
)

// Baris yang dipaparkan pada halaman semasa
const pagedRows = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return tableDataWithNo.value.slice(start, end)
})

// Pastikan currentPage valid bila pageSize berubah atau totalBantuan berubah
watch([pageSize, totalBantuan], () => {
  const newTotalPages = Math.max(1, Math.ceil(totalBantuan.value / pageSize.value))
  if (currentPage.value > newTotalPages) currentPage.value = newTotalPages
  if (currentPage.value < 1) currentPage.value = 1
})

/** =========================
 *  Util & Tindakan
 *  ======================= */
const formatDate = (dateString) => new Date(dateString).toLocaleDateString('ms-MY')

const saveSelectedAndGo = (row) => {
  let payload = typeof row === 'object' && row?.noBantuan ? row : { noBantuan: String(row) }
  try {
    sessionStorage.setItem('NAS_SELECTED_BANTUAN', JSON.stringify(payload))
  } catch (e) {
    console.warn('Unable to save selected bantuan in sessionStorage', e)
  }
  const id = payload.noBantuan || String(payload)
  navigateTo(`/BF-BTN/tuntutan-dengan-siasatan/mohon-tuntutan/asnaf/${encodeURIComponent(id)}`)
}

const handleBulkApproval = async () => {
  // kekalkan jika masih diperlukan oleh aliran kerja anda
}

/** =========================
 *  Breadcrumb & formData (dikekalkan)
 *  ======================= */
const breadcrumb = ref([
  {
    name: 'Pengurusan Bantuan',
    type: 'link',
    path: '/BF-BTN/tuntutan-dengan-siasatan/senarai-tuntutan/pelulus',
  },
  {
    name: 'Tuntutan',
    type: 'link',
    path: '/BF-BTN/tuntutan-dengan-siasatan/senarai-tuntutan/pelulus',
  },
  {
    name: 'Mohon Tuntutan',
    type: 'current',
    path: '/BF-BTN/tuntutan-dengan-siasatan/mohon-tuntutan/asnaf',
  },
])

const formData = ref({
  noBantuan: '',
  namaAsnaf: '',
  noKpAsnaf: '',
})

const handleSubmit = async () => {
  // Form submission logic
}

const handleCancel = () => {
  // Handle cancel logic
}
</script>

<style scoped>
/* Letakkan gaya tersuai jika perlu */
</style>
