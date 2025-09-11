<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />

    <rs-card class="mt-4">
      <template #header>
        <div class="flex justify-between items-center">
          <div>
            <h2 class="text-xl font-semibold">Senarai Organisasi</h2>
            <p class="text-gray-600 mt-1">Senarai organisasi di bawah pengurusan anda</p>
          </div>
        </div>
      </template>

      <!-- Search and Filter Section -->
      <div class="mb-6">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormKit
            type="text"
            name="search"
            placeholder="Cari organisasi..."
            v-model="searchQuery"
            @input="handleSearch"
          />
          <FormKit
            type="select"
            name="statusFilter"
            placeholder="Pilih status"
            :options="statusOptions"
            v-model="statusFilter"
            @input="handleFilter"
          />
          <FormKit
            type="select"
            name="jenisStrukturFilter"
            placeholder="Pilih jenis struktur"
            :options="jenisStrukturOptions"
            v-model="jenisStrukturFilter"
            @input="handleFilter"
          />
        </div>
      </div>

      <!-- Data Table -->
      <rs-table
        :data="filteredOrganisasiList"
        :columns="columns"
        :loading="loading"
        :pagination="pagination"
        @page-change="handlePageChange"
        @sort="handleSort"
      >
        <template v-slot:status="{ text }">
          <rs-badge :variant="getStatusVariant(text)">
            {{ text }}
          </rs-badge>
        </template>

        <template v-slot:jenisStruktur="{ text }">
          <rs-badge :variant="text === 'HQ' ? 'primary' : 'secondary'">
            {{ text }}
          </rs-badge>
        </template>

        <template v-slot:tindakan="{ row }">
          <div class="flex gap-2">
            <rs-button
              size="sm"
              variant="primary-outline"
              @click="handleLihat(row.tindakan.id)"
            >
              <Icon name="heroicons:eye" class="w-4 h-4" />
            </rs-button>
            <rs-button
              v-if="row.status === 'Dalam Pembetulan'"
              size="sm"
              variant="warning-outline"
              @click="handleKemaskini(row.tindakan.id)"
            >
              <Icon name="heroicons:pencil" class="w-4 h-4" />
            </rs-button>
          </div>
        </template>
      </rs-table>
    </rs-card>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// Breadcrumb
const breadcrumb = [
  { title: 'Dashboard', path: '/BF-PRF/pengguna-luar/dashboard' },
  { title: 'Senarai Organisasi', path: '' }
]

// Data
const loading = ref(false)
const searchQuery = ref('')
const statusFilter = ref('')
const jenisStrukturFilter = ref('')

// Pagination
const pagination = ref({
  page: 1,
  perPage: 10,
  total: 0
})

// Filter options
const statusOptions = [
  { label: 'Semua Status', value: '' },
  { label: 'Menunggu Pengesahan', value: 'Menunggu Pengesahan' },
  { label: 'Dalam Pembetulan', value: 'Dalam Pembetulan' },
  { label: 'Telah Diluluskan', value: 'Telah Diluluskan' },
  { label: 'Telah Ditolak', value: 'Telah Ditolak' }
]

const jenisStrukturOptions = [
  { label: 'Semua Jenis Struktur', value: '' },
  { label: 'HQ', value: 'HQ' },
  { label: 'Cawangan', value: 'Cawangan' }
]

// Table columns
const columns = [
  { key: 'noRujukan', label: 'No. Rujukan', sortable: true },
  { key: 'namaOrganisasi', label: 'Nama Organisasi', sortable: true },
  { key: 'jenisOrganisasi', label: 'Jenis Organisasi', sortable: true },
  { key: 'jenisStruktur', label: 'Jenis Struktur', sortable: true },
  { key: 'tarikhPermohonan', label: 'Tarikh Permohonan', sortable: true },
  { key: 'status', label: 'Status', sortable: true },
  { key: 'tindakan', label: 'Tindakan', sortable: false },
]

// Mock data - filtered for Pengguna Luar (only their organization and branches)
const organisasiList = ref([
  {
    noRujukan: 'ORG-202507-0001',
    namaOrganisasi: 'Masjid Al-Ikhlas',
    jenisOrganisasi: 'Masjid',
    jenisStruktur: 'HQ',
    tarikhPermohonan: '15/7/2025',
    status: 'Telah Diluluskan',
    tindakan: { id: 'ORG-202507-0001', status: 'Telah Diluluskan' },
  },
  {
    noRujukan: 'ORG-202507-0002',
    namaOrganisasi: 'Masjid Al-Ikhlas - Cawangan Shah Alam',
    jenisOrganisasi: 'Masjid',
    jenisStruktur: 'Cawangan',
    tarikhPermohonan: '16/7/2025',
    status: 'Dalam Pembetulan',
    tindakan: { id: 'ORG-202507-0002', status: 'Dalam Pembetulan' },
  },
  {
    noRujukan: 'ORG-202507-0003',
    namaOrganisasi: 'Masjid Al-Ikhlas - Cawangan Petaling Jaya',
    jenisOrganisasi: 'Masjid',
    jenisStruktur: 'Cawangan',
    tarikhPermohonan: '17/7/2025',
    status: 'Menunggu Pengesahan',
    tindakan: { id: 'ORG-202507-0003', status: 'Menunggu Pengesahan' },
  },
  {
    noRujukan: 'ORG-202507-0004',
    namaOrganisasi: 'Masjid Al-Ikhlas - Cawangan Klang',
    jenisOrganisasi: 'Masjid',
    jenisStruktur: 'Cawangan',
    tarikhPermohonan: '18/7/2025',
    status: 'Telah Diluluskan',
    tindakan: { id: 'ORG-202507-0004', status: 'Telah Diluluskan' },
  },
])

// Computed
const filteredOrganisasiList = computed(() => {
  let filtered = organisasiList.value

  // Search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(item => 
      item.namaOrganisasi.toLowerCase().includes(query) ||
      item.noRujukan.toLowerCase().includes(query)
    )
  }

  // Status filter
  if (statusFilter.value) {
    filtered = filtered.filter(item => item.status === statusFilter.value)
  }

  // Jenis Struktur filter
  if (jenisStrukturFilter.value) {
    filtered = filtered.filter(item => item.jenisStruktur === jenisStrukturFilter.value)
  }

  // Update pagination total
  pagination.value.total = filtered.length

  return filtered
})

// Methods
const handleSearch = () => {
  // Search is handled by computed property
}

const handleFilter = () => {
  // Filtering is handled by computed property
}

const handlePageChange = (page) => {
  pagination.value.page = page
}

const handleSort = (column, direction) => {
  // Sorting logic can be implemented here
  console.log('Sort by:', column, direction)
}

const getStatusVariant = (status) => {
  const variants = {
    'Menunggu Pengesahan': 'warning',
    'Dalam Pembetulan': 'danger',
    'Telah Diluluskan': 'success',
    'Telah Ditolak': 'danger'
  }
  return variants[status] || 'default'
}

const handleLihat = (id) => {
  router.push(`/BF-PRF/OR/PP/view/${id}`)
}

const handleKemaskini = (id) => {
  router.push(`/BF-PRF/OR/PP/kemaskini/${id}`)
}

// Lifecycle
onMounted(() => {
  // Initialize data
  pagination.value.total = organisasiList.value.length
})
</script>
