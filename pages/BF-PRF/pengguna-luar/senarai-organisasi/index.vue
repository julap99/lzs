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
        :pageSize="10"
        :showNoColumn="true"
        :options="{ variant: 'default', hover: true, striped: true }"
        :options-advanced="{ sortable: true, filterable: false }"
        advanced
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

        <template v-slot:tindakan="{ text }">
          <div class="flex space-x-3">
            <!-- View Button - Always available -->
            <button
              @click="handleLihat(text.id)"
              title="Lihat"
              class="flex items-center justify-center w-8 h-8 p-0 hover:bg-gray-100 rounded-full transition-colors duration-200"
            >
              <Icon name="ic:baseline-visibility" size="20" class="text-primary" />
            </button>
            
            <!-- Edit Button - Only for "Dalam Pembetulan" status -->
            <button
              v-if="text.status === 'Dalam Pembetulan'"
              @click="handleKemaskini(text.id)"
              title="Kemaskini"
              class="flex items-center justify-center w-8 h-8 p-0 hover:bg-gray-100 rounded-full transition-colors duration-200"
            >
              <Icon name="ic:outline-edit" size="20" class="text-warning" />
            </button>
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
const breadcrumb = ref([
  {
    name: "Pengguna Luar",
    type: "link",
    path: "/BF-PRF/pengguna-luar/dashboard",
  },
  {
    name: "Senarai Organisasi",
    type: "current",
    path: "/BF-PRF/pengguna-luar/senarai-organisasi",
  }
])

// Data
const searchQuery = ref('')
const statusFilter = ref('')
const jenisStrukturFilter = ref('')

// Filter options
const statusOptions = [
  { label: 'Semua Status', value: '' },
  { label: 'Menunggu Pengesahan', value: 'Menunggu Pengesahan' },
  { label: 'Dalam Pembetulan', value: 'Dalam Pembetulan' },
  { label: 'Disahkan', value: 'Disahkan' },
  { label: 'Perlu Pembetulan', value: 'Perlu Pembetulan' },
  { label: 'Tidak Sah', value: 'Tidak Sah' }
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
// This represents a user from Pusat Asuhan OKU As-Solihin
const organisasiList = ref([
  {
    noRujukan: 'ORG-202507-0001',
    namaOrganisasi: 'Pusat Asuhan OKU As-Solihin',
    jenisOrganisasi: 'NGO',
    jenisStruktur: 'HQ',
    tarikhPermohonan: '15/7/2025',
    status: 'Disahkan',
    tindakan: { id: 'ORG-202507-0001', status: 'Disahkan' },
  },
  {
    noRujukan: 'ORG-202506-0002',
    namaOrganisasi: 'Pusat Asuhan OKU As-Solihin - Cawangan Bangi',
    jenisOrganisasi: 'NGO',
    jenisStruktur: 'Cawangan',
    tarikhPermohonan: '16/7/2025',
    status: 'Disahkan',
    tindakan: { id: 'ORG-202506-0002', status: 'Disahkan' },
  },
  {
    noRujukan: 'ORG-202505-0003',
    namaOrganisasi: 'Pusat Asuhan OKU As-Solihin - Cawangan Shah Alam',
    jenisOrganisasi: 'NGO',
    jenisStruktur: 'Cawangan',
    tarikhPermohonan: '17/7/2025',
    status: 'Menunggu Pengesahan',
    tindakan: { id: 'ORG-202505-0003', status: 'Menunggu Pengesahan' },
  },
  {
    noRujukan: 'ORG-202507-0004',
    namaOrganisasi: 'Pusat Asuhan OKU As-Solihin - Cawangan Klang',
    jenisOrganisasi: 'NGO',
    jenisStruktur: 'Cawangan',
    tarikhPermohonan: '18/7/2025',
    status: 'Disahkan',
    tindakan: { id: 'ORG-202507-0004', status: 'Disahkan' },
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

  return filtered
})

// Methods
const handleSearch = () => {
  // Search is handled by computed property
}

const handleFilter = () => {
  // Filtering is handled by computed property
}


const getStatusVariant = (status) => {
  const variants = {
    'Menunggu Pengesahan': 'warning',
    'Dalam Pembetulan': 'warning',
    'Disahkan': 'success',
    'Perlu Pembetulan': 'warning',
    'Tidak Sah': 'danger'
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
})
</script>
