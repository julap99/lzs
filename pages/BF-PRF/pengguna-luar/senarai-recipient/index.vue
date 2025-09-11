<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />

    <rs-card class="mt-4">
      <template #header>
        <div class="flex justify-between items-center">
          <div>
            <h2 class="text-xl font-semibold">Senarai Recipient</h2>
            <p class="text-gray-600 mt-1">Senarai recipient di bawah pengurusan anda</p>
          </div>
        </div>
      </template>

      <!-- Search and Filter Section -->
      <div class="mb-6">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormKit
            type="text"
            name="search"
            placeholder="Cari recipient..."
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
            name="jenisRecipientFilter"
            placeholder="Pilih jenis recipient"
            :options="jenisRecipientOptions"
            v-model="jenisRecipientFilter"
            @input="handleFilter"
          />
        </div>
      </div>

      <!-- Data Table -->
      <rs-table
        :data="filteredRecipientList"
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

        <template v-slot:statusNPS="{ text }">
          <rs-badge :variant="getNPSStatusVariant(text)">
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
  { title: 'Senarai Recipient', path: '' }
]

// Data
const loading = ref(false)
const searchQuery = ref('')
const statusFilter = ref('')
const jenisRecipientFilter = ref('')

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

const jenisRecipientOptions = [
  { label: 'Semua Jenis Recipient', value: '' },
  { label: 'Individu', value: 'Individu' },
  { label: 'Syarikat', value: 'Syarikat' }
]

// Table columns
const columns = [
  { key: 'noRujukan', label: 'No. Rujukan', sortable: true },
  { key: 'namaRecipient', label: 'Nama Recipient', sortable: true },
  { key: 'jenisRecipient', label: 'Jenis Recipient', sortable: true },
  { key: 'tarikhPermohonan', label: 'Tarikh Permohonan', sortable: true },
  { key: 'status', label: 'Status', sortable: true },
  { key: 'statusNPS', label: 'Status NPS', sortable: true },
  { key: 'tindakan', label: 'Tindakan', sortable: false },
]

// Mock data - filtered for Pengguna Luar (only their recipients)
const recipientList = ref([
  {
    noRujukan: 'RE-202507-0011',
    namaRecipient: 'Ahmad Bin Abdullah',
    jenisRecipient: 'Individu',
    tarikhPermohonan: '23/7/2025',
    status: 'Menunggu Pengesahan',
    statusNPS: 'Verified',
    tindakan: { id: 'RE-202507-0011', status: 'Menunggu Pengesahan' },
  },
  {
    noRujukan: 'RE-202507-0012',
    namaRecipient: 'Siti Fatimah Binti Ali',
    jenisRecipient: 'Individu',
    tarikhPermohonan: '24/7/2025',
    status: 'Dalam Pembetulan',
    statusNPS: 'Tidak Verified',
    tindakan: { id: 'RE-202507-0012', status: 'Dalam Pembetulan' },
  },
  {
    noRujukan: 'RE-202507-0013',
    namaRecipient: 'Muhammad Bin Hassan',
    jenisRecipient: 'Individu',
    tarikhPermohonan: '25/7/2025',
    status: 'Telah Diluluskan',
    statusNPS: 'Verified',
    tindakan: { id: 'RE-202507-0013', status: 'Telah Diluluskan' },
  },
  {
    noRujukan: 'RE-202507-0014',
    namaRecipient: 'ABC Sdn Bhd',
    jenisRecipient: 'Syarikat',
    tarikhPermohonan: '26/7/2025',
    status: 'Menunggu Pengesahan',
    statusNPS: 'Verified',
    tindakan: { id: 'RE-202507-0014', status: 'Menunggu Pengesahan' },
  },
])

// Computed
const filteredRecipientList = computed(() => {
  let filtered = recipientList.value

  // Search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(item => 
      item.namaRecipient.toLowerCase().includes(query) ||
      item.noRujukan.toLowerCase().includes(query)
    )
  }

  // Status filter
  if (statusFilter.value) {
    filtered = filtered.filter(item => item.status === statusFilter.value)
  }

  // Jenis Recipient filter
  if (jenisRecipientFilter.value) {
    filtered = filtered.filter(item => item.jenisRecipient === jenisRecipientFilter.value)
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

const getNPSStatusVariant = (status) => {
  const variants = {
    'Verified': 'success',
    'Tidak Verified': 'warning'
  }
  return variants[status] || 'default'
}

const handleLihat = (id) => {
  router.push(`/BF-PRF/TP/PP/view/${id}`)
}

const handleKemaskini = (id) => {
  router.push(`/BF-PRF/TP/PP/kemaskini/${id}`)
}

// Lifecycle
onMounted(() => {
  // Initialize data
  pagination.value.total = recipientList.value.length
})
</script>
