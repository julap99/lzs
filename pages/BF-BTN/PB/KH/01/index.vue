<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />

    <rs-card class="mt-4">
      <template #header>
        <div class="flex justify-between items-center">
          <h2 class="text-xl font-semibold">
            Senarai Permohonan Kelulusan Khas
          </h2>
        </div>
      </template>

      <template #body>
        <!-- Smart Filter Section -->
        <div class="mb-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormKit
              v-model="search"
              type="text"
              placeholder="Cari nama atau no. rujukan…"
              :classes="{
                input: '!py-2',
              }"
            />
            <rs-button
              variant="primary"
              @click="handleSearch"
              class="!py-2 !px-4"
            >
              <Icon name="ic:baseline-search" class="w-4 h-4 mr-2" />
              Cari
            </rs-button>
          </div>
        </div>

        <!-- Tabbed Table Section -->
        <rs-tab v-model="activeTab" class="mt-4">
          <rs-tab-item title="Menunggu">
            <div class="pt-2">
              <rs-table
                :key="`table-${tableKey}-menunggu`"
                :data="getTableDataByStatus(['Menunggu'])"
                :columns="tableColumns"
                :pageSize="10"
                :show-search="false"
                :show-filter="false"
                :options="{
                  variant: 'default',
                  hover: true,
                  striped: true,
                }"
                :options-advanced="{
                  sortable: true,
                  filterable: false,
                }"
                advanced
              >
                <template v-slot:status="{ text }">
                  <rs-badge :variant="getStatusVariant(text)">
                    {{ text }}
                  </rs-badge>
                </template>

                <template v-slot:tindakan="{ text }">
                  <div class="flex justify-center items-center gap-2">
                    <!-- Lihat button - for all statuses -->
                    <button
                      @click="lihat(text.noRujukan)"
                      title="Lihat"
                      class="flex items-center justify-center w-8 h-8 p-0 hover:bg-gray-100 rounded-full transition-colors duration-200"
                    >
                      <Icon name="heroicons:eye" class="w-5 h-5 text-primary" />
                    </button>
                    
                    <!-- Semak button - only for Menunggu status -->
                    <button
                      v-if="text.status === 'Menunggu'"
                      @click="semak(text.noRujukan)"
                      title="Semak"
                      class="flex items-center justify-center w-8 h-8 p-0 hover:bg-gray-100 rounded-full transition-colors duration-200"
                    >
                      <Icon name="iconamoon:arrow-right-2" class="w-5 h-5 text-info" />
                    </button>
                    
                    <!-- Notifikasi button - only for Lulus status -->
                    <button
                      v-if="text.status === 'Lulus'"
                      @click="notifikasiKeputusan(text.noRujukan)"
                      title="Notifikasi"
                      class="flex items-center justify-center w-8 h-8 p-0 hover:bg-gray-100 rounded-full transition-colors duration-200"
                    >
                      <Icon name="heroicons:bell" class="w-5 h-5 text-secondary" />
                    </button>
                    
                    <!-- Pembayaran button - only for Lulus status -->
                    <button
                      v-if="text.status === 'Lulus'"
                      @click="notifikasiPembayaran(text.noRujukan)"
                      title="Pembayaran"
                      class="flex items-center justify-center w-8 h-8 p-0 hover:bg-gray-100 rounded-full transition-colors duration-200"
                    >
                      <Icon name="heroicons:currency-dollar" class="w-5 h-5 text-success" />
                    </button>
                  </div>
                </template>
              </rs-table>
            </div>
          </rs-tab-item>
          
          <rs-tab-item title="Lulus">
            <div class="pt-2">
              <rs-table
                :key="`table-${tableKey}-lulus`"
                :data="getTableDataByStatus(['Lulus'])"
                :columns="tableColumns"
                :pageSize="10"
                :show-search="false"
                :show-filter="false"
                :options="{
                  variant: 'default',
                  hover: true,
                  striped: true,
                }"
                :options-advanced="{
                  sortable: true,
                  filterable: false,
                }"
                advanced
              >
                <template v-slot:status="{ text }">
                  <rs-badge :variant="getStatusVariant(text)">
                    {{ text }}
                  </rs-badge>
                </template>

                <template v-slot:tindakan="{ text }">
                  <div class="flex justify-center items-center gap-2">
                    <!-- Lihat button - for all statuses -->
                    <button
                      @click="lihat(text.noRujukan)"
                      title="Lihat"
                      class="flex items-center justify-center w-8 h-8 p-0 hover:bg-gray-100 rounded-full transition-colors duration-200"
                    >
                      <Icon name="heroicons:eye" class="w-5 h-5 text-primary" />
                    </button>
                    
                    <!-- Semak button - only for Menunggu status -->
                    <button
                      v-if="text.status === 'Menunggu'"
                      @click="semak(text.noRujukan)"
                      title="Semak"
                      class="flex items-center justify-center w-8 h-8 p-0 hover:bg-gray-100 rounded-full transition-colors duration-200"
                    >
                      <Icon name="iconamoon:arrow-right-2" class="w-5 h-5 text-info" />
                    </button>
                    
                    <!-- Notifikasi button - only for Lulus status -->
                    <button
                      v-if="text.status === 'Lulus'"
                      @click="notifikasiKeputusan(text.noRujukan)"
                      title="Notifikasi"
                      class="flex items-center justify-center w-8 h-8 p-0 hover:bg-gray-100 rounded-full transition-colors duration-200"
                    >
                      <Icon name="heroicons:bell" class="w-5 h-5 text-secondary" />
                    </button>
                    
                    <!-- Pembayaran button - only for Lulus status -->
                    <button
                      v-if="text.status === 'Lulus'"
                      @click="notifikasiPembayaran(text.noRujukan)"
                      title="Pembayaran"
                      class="flex items-center justify-center w-8 h-8 p-0 hover:bg-gray-100 rounded-full transition-colors duration-200"
                    >
                      <Icon name="heroicons:currency-dollar" class="w-5 h-5 text-success" />
                    </button>
                  </div>
                </template>
              </rs-table>
            </div>
          </rs-tab-item>
          
          <rs-tab-item title="Tidak Lulus">
            <div class="pt-2">
              <rs-table
                :key="`table-${tableKey}-tidak-lulus`"
                :data="getTableDataByStatus(['Tidak Lulus'])"
                :columns="tableColumns"
                :pageSize="10"
                :show-search="false"
                :show-filter="false"
                :options="{
                  variant: 'default',
                  hover: true,
                  striped: true,
                }"
                :options-advanced="{
                  sortable: true,
                  filterable: false,
                }"
                advanced
              >
                <template v-slot:status="{ text }">
                  <rs-badge :variant="getStatusVariant(text)">
                    {{ text }}
                  </rs-badge>
                </template>

                <template v-slot:tindakan="{ text }">
                  <div class="flex justify-center items-center gap-2">
                    <!-- Lihat button - for all statuses -->
                    <button
                      @click="lihat(text.noRujukan)"
                      title="Lihat"
                      class="flex items-center justify-center w-8 h-8 p-0 hover:bg-gray-100 rounded-full transition-colors duration-200"
                    >
                      <Icon name="heroicons:eye" class="w-5 h-5 text-primary" />
                    </button>
                    
                    <!-- Semak button - only for Menunggu status -->
                    <button
                      v-if="text.status === 'Menunggu'"
                      @click="semak(text.noRujukan)"
                      title="Semak"
                      class="flex items-center justify-center w-8 h-8 p-0 hover:bg-gray-100 rounded-full transition-colors duration-200"
                    >
                      <Icon name="iconamoon:arrow-right-2" class="w-5 h-5 text-info" />
                    </button>
                    
                    <!-- Notifikasi button - only for Lulus status -->
                    <button
                      v-if="text.status === 'Lulus'"
                      @click="notifikasiKeputusan(text.noRujukan)"
                      title="Notifikasi"
                      class="flex items-center justify-center w-8 h-8 p-0 hover:bg-gray-100 rounded-full transition-colors duration-200"
                    >
                      <Icon name="heroicons:bell" class="w-5 h-5 text-secondary" />
                    </button>
                    
                    <!-- Pembayaran button - only for Lulus status -->
                    <button
                      v-if="text.status === 'Lulus'"
                      @click="notifikasiPembayaran(text.noRujukan)"
                      title="Pembayaran"
                      class="flex items-center justify-center w-8 h-8 p-0 hover:bg-gray-100 rounded-full transition-colors duration-200"
                    >
                      <Icon name="heroicons:currency-dollar" class="w-5 h-5 text-success" />
                    </button>
                  </div>
                </template>
              </rs-table>
            </div>
          </rs-tab-item>
        </rs-tab>
      </template>
    </rs-card>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { navigateTo } from '#app'

definePageMeta({
  title: "Senarai Permohonan Kelulusan Khas",
  description: "Senarai permohonan kelulusan khas untuk semakan dan kelulusan",
});

const breadcrumb = ref([
  {
    name: "Bantuan",
    type: "link",
    path: "/BF-BTN",
  },
  {
    name: "Permohonan Bantuan",
    type: "link",
    path: "/BF-BTN/PB",
  },
  {
    name: "Kelulusan Khas",
    type: "current",
    path: "/BF-BTN/PB/KH/01",
  },
]);

// Table columns configuration
const tableColumns = [
  {
    key: "noRujukan",
    label: "No Rujukan",
    sortable: true,
  },
  {
    key: "namaPemohon",
    label: "Nama Pemohon",
    sortable: true,
  },
  {
    key: "tarikhTerima",
    label: "Tarikh Terima",
    sortable: true,
  },
  {
    key: "status",
    label: "Status Permohonan",
    sortable: true,
  },
  {
    key: "pegawai",
    label: "Pegawai",
    sortable: true,
  },
  {
    key: "tindakan",
    label: "Tindakan",
    sortable: false,
    width: "120px",
  },
];

// Mock list lives inside this page
const rows = ref([
  {
    noRujukan: 'KH20250721001',
    namaPemohon: 'Ahmad Bin Ali',
    tarikhTerima: '2025-07-21',
    status: 'Menunggu',
    pegawai: 'Noraini',
    tindakan: { noRujukan: 'KH20250721001', status: 'Menunggu' },
  },
  {
    noRujukan: 'KH20250722005',
    namaPemohon: 'Siti Aminah',
    tarikhTerima: '2025-07-22',
    status: 'Menunggu',
    pegawai: 'Hafiz',
    tindakan: { noRujukan: 'KH20250722005', status: 'Menunggu' },
  },
  {
    noRujukan: 'KH20250723003',
    namaPemohon: 'Mohd Razak bin Ibrahim',
    tarikhTerima: '2025-07-23',
    status: 'Lulus',
    pegawai: 'Aminah',
    tindakan: { noRujukan: 'KH20250723003', status: 'Lulus' },
  },
  {
    noRujukan: 'KH20250724004',
    namaPemohon: 'Fatimah binti Omar',
    tarikhTerima: '2025-07-24',
    status: 'Tidak Lulus',
    pegawai: 'Zul',
    tindakan: { noRujukan: 'KH20250724004', status: 'Tidak Lulus' },
  },
  {
    noRujukan: 'KH20250725001',
    namaPemohon: 'Rashid Bin Omar',
    tarikhTerima: '2025-07-25',
    status: 'Menunggu',
    pegawai: 'Noraini',
    tindakan: { noRujukan: 'KH20250725001', status: 'Menunggu' },
  },
  {
    noRujukan: 'KH20250726002',
    namaPemohon: 'Aishah Bt Abdullah',
    tarikhTerima: '2025-07-26',
    status: 'Lulus',
    pegawai: 'Hafiz',
    tindakan: { noRujukan: 'KH20250726002', status: 'Lulus' },
  },
  {
    noRujukan: 'KH20250727003',
    namaPemohon: 'Ismail Bin Ahmad',
    tarikhTerima: '2025-07-27',
    status: 'Tidak Lulus',
    pegawai: 'Zul',
    tindakan: { noRujukan: 'KH20250727003', status: 'Tidak Lulus' },
  },
])

const search = ref('')
const activeTab = ref(0)
const tableKey = ref(0)

const formatDate = (iso) => {
  const [y,m,d] = iso.split('-')
  return `${d}-${m}-${y}`
}

// Status badge variant helper
const getStatusVariant = (status) => {
  const variants = {
    'Lulus': 'success',
    'Tidak Lulus': 'danger',
    'Menunggu': 'warning',
  };
  return variants[status] || 'secondary';
}

const getTableDataByStatus = (statuses) => {
  let data = rows.value.slice()
  
  // Filter by status
  data = data.filter(r => statuses.includes(r.status))
  
  // Apply search filter
  const q = search.value.trim().toLowerCase()
  if (q) {
    data = data.filter(r =>
      r.namaPemohon.toLowerCase().includes(q) ||
      r.noRujukan.toLowerCase().includes(q)
    )
  }
  
  // Apply automatic sorting (newest first - descending order)
  data.sort((a,b) => {
    const av = a.tarikhTerima, bv = b.tarikhTerima
    return bv.localeCompare(av) // Descending order (newest first)
  })
  
  return data
}

function handleSearch() {
  // Trigger table refresh by updating the key
  tableKey.value++
}

function resetFilters() {
  search.value = ''
  activeTab.value = 0
  tableKey.value++
}

function lihat(noRujukan) {
  navigateTo(`/BF-BTN/PB/KH/05/${encodeURIComponent(noRujukan)}`)
}

function semak(noRujukan) {
  navigateTo(`/BF-BTN/PB/KH/02/${encodeURIComponent(noRujukan)}`)
}

function notifikasiKeputusan(noRujukan) {
  navigateTo(`/BF-BTN/PB/KH/03/${encodeURIComponent(noRujukan)}`)
}

function notifikasiPembayaran(noRujukan) {
  navigateTo(`/BF-BTN/PB/KH/04/${encodeURIComponent(noRujukan)}`)
}
</script>
