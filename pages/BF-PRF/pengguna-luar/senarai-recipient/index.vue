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

        <template v-slot:statusNPS="{ text }">
          <rs-badge :variant="getNPSStatusVariant(text)">
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
    name: "Senarai Recipient",
    type: "current",
    path: "/BF-PRF/pengguna-luar/senarai-recipient",
  }
])

// Data
const searchQuery = ref('')
const statusFilter = ref('')
const jenisRecipientFilter = ref('')

// Filter options
const statusOptions = [
  { label: 'Semua Status', value: '' },
  { label: 'Menunggu Pengesahan', value: 'Menunggu Pengesahan' },
  { label: 'Dalam Pembetulan', value: 'Dalam Pembetulan' },
  { label: 'Disahkan', value: 'Disahkan' },
  { label: 'Perlu Pembetulan', value: 'Perlu Pembetulan' },
  { label: 'Tidak Sah', value: 'Tidak Sah' }
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
// This represents recipients related to Masjid Sultan Salahuddin Abdul Aziz Shah
const recipientList = ref([
  {
    noRujukan: 'RE-202507-0011',
    namaRecipient: 'Ahmad Bin Abdullah',
    jenisRecipient: 'Individu',
    tarikhPermohonan: '23/7/2025',
    status: 'Menunggu Pengesahan',
    statusNPS: 'Telah Disahkan',
    tindakan: { id: 'RE-202507-0011', status: 'Menunggu Pengesahan' },
  },
  {
    noRujukan: 'RE-202506-0012',
    namaRecipient: 'Pusat Dialisis As-Salam Shah Alam',
    jenisRecipient: 'Syarikat',
    tarikhPermohonan: '15/6/2025',
    status: 'Disahkan',
    statusNPS: 'Telah Disahkan',
    tindakan: { id: 'RE-202506-0012', status: 'Disahkan' },
  },
  {
    noRujukan: 'RE-202505-0013',
    namaRecipient: 'Siti Fatimah Binti Ali',
    jenisRecipient: 'Individu',
    tarikhPermohonan: '8/5/2025',
    status: 'Tidak Sah',
    statusNPS: 'Belum Disahkan',
    tindakan: { id: 'RE-202505-0013', status: 'Tidak Sah' },
  },
  {
    noRujukan: 'RE-202507-0014',
    namaRecipient: 'Klinik Kesihatan Al-Ikhlas',
    jenisRecipient: 'Syarikat',
    tarikhPermohonan: '30/7/2025',
    status: 'Perlu Pembetulan',
    statusNPS: 'Telah Disahkan',
    tindakan: { id: 'RE-202507-0014', status: 'Perlu Pembetulan' },
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

const getNPSStatusVariant = (status) => {
  const variants = {
    'Telah Disahkan': 'success',
    'Belum Disahkan': 'warning'
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
})
</script>
