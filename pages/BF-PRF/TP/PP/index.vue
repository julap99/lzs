<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />

    <rs-card class="mt-4">
      <template #header>
        <div class="flex justify-between items-center">
          <div>
            <h2 class="text-xl font-semibold">Senarai Pengesahan Recipient</h2>
          </div>
        </div>
      </template>

      <template #body>
        <!-- Smart Filter Section -->
        <div class="mb-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormKit
              v-model="searchQuery"
              type="text"
              placeholder="Cari No Rujukan, Nama Recipient, atau ID Pengenalan..."
              :classes="{ input: '!py-2' }"
            />
            <rs-button
              variant="primary"
              @click="performSearch"
              class="!py-2 !px-4"
            >
              <Icon name="ic:baseline-search" class="w-4 h-4 mr-2" />
              Cari
            </rs-button>
          </div>
        </div>

        <!-- Tabbed Table Section -->
        <rs-tab v-model="activeTab" class="mt-4">
          <rs-tab-item title="Menunggu Pengesahan">
            <div class="p-4">
              <rs-table
                :key="`table-${tableKey}-pending`"
                :data="getTableDataByStatus(['Menunggu Pengesahan'])"
                :columns="columns"
                :pageSize="pageSize"
                :showNoColumn="true"
                :options="{ variant: 'default', hover: true, striped: true }"
                :options-advanced="{ sortable: true, filterable: false }"
                advanced
              >
                <template v-slot:noRujukan="{ text }">
                  <a href="#" class="text-primary-600 hover:text-primary-800" @click.prevent="viewRecipient(text)">
                    {{ text }}
                  </a>
                </template>

                <template v-slot:tarikhPermohonan="{ text }">
                  <div>
                    <div class="font-medium">{{ formatDate(text) }}</div>
                    <div class="text-sm text-gray-500">{{ formatTime(text) }}</div>
                  </div>
                </template>

                <template v-slot:status="{ text }">
                  <rs-badge :variant="getStatusVariant(text)">
                    {{ text }}
                  </rs-badge>
                </template>

                <template v-slot:tindakan="{ text }">
                  <div class="flex space-x-2">
                    <rs-button
                      v-if="canPerformAction(text.status)"
                      variant="primary"
                      size="sm"
                      class="!px-2 !py-1"
                      @click="handleSemakPengesahan(text.id)"
                    >
                      <Icon name="ph:check" class="w-4 h-4 mr-1" /> Semak
                    </rs-button>
                  </div>
                </template>
              </rs-table>
            </div>
          </rs-tab-item>

          <rs-tab-item title="Diluluskan">
            <div class="p-4">
              <rs-table
                :key="`table-${tableKey}-approved`"
                :data="getTableDataByStatus(['Diluluskan'])"
                :columns="columns"
                :pageSize="pageSize"
                :showNoColumn="true"
                :options="{ variant: 'default', hover: true, striped: true }"
                :options-advanced="{ sortable: true, filterable: false }"
                advanced
              >
                <template v-slot:noRujukan="{ text }">
                  <a href="#" class="text-primary-600 hover:text-primary-800" @click.prevent="viewRecipient(text)">
                    {{ text }}
                  </a>
                </template>

                <template v-slot:tarikhPermohonan="{ text }">
                  <div>
                    <div class="font-medium">{{ formatDate(text) }}</div>
                    <div class="text-sm text-gray-500">{{ formatTime(text) }}</div>
                  </div>
                </template>

                <template v-slot:status="{ text }">
                  <rs-badge :variant="getStatusVariant(text)">
                    {{ text }}
                  </rs-badge>
                </template>

                <template v-slot:tindakan="{ text }">
                  <div class="flex space-x-2">
                    <rs-button
                      v-if="canPerformAction(text.status)"
                      variant="primary"
                      size="sm"
                      class="!px-2 !py-1"
                      @click="handleSemakPengesahan(text.id)"
                    >
                      <Icon name="ph:check" class="w-4 h-4 mr-1" /> Semak
                    </rs-button>
                  </div>
                </template>
              </rs-table>
            </div>
          </rs-tab-item>

          <rs-tab-item title="Ditolak">
            <div class="p-4">
              <rs-table
                :key="`table-${tableKey}-rejected`"
                :data="getTableDataByStatus(['Ditolak'])"
                :columns="columns"
                :pageSize="pageSize"
                :showNoColumn="true"
                :options="{ variant: 'default', hover: true, striped: true }"
                :options-advanced="{ sortable: true, filterable: false }"
                advanced
              >
                <template v-slot:noRujukan="{ text }">
                  <a href="#" class="text-primary-600 hover:text-primary-800" @click.prevent="viewRecipient(text)">
                    {{ text }}
                  </a>
                </template>

                <template v-slot:tarikhPermohonan="{ text }">
                  <div>
                    <div class="font-medium">{{ formatDate(text) }}</div>
                    <div class="text-sm text-gray-500">{{ formatTime(text) }}</div>
                  </div>
                </template>

                <template v-slot:status="{ text }">
                  <rs-badge :variant="getStatusVariant(text)">
                    {{ text }}
                  </rs-badge>
                </template>

                <template v-slot:tindakan="{ text }">
                  <div class="flex space-x-2">
                    <rs-button
                      v-if="canPerformAction(text.status)"
                      variant="primary"
                      size="sm"
                      class="!px-2 !py-1"
                      @click="handleSemakPengesahan(text.id)"
                    >
                      <Icon name="ph:check" class="w-4 h-4 mr-1" /> Semak
                    </rs-button>
                  </div>
                </template>
              </rs-table>
            </div>
          </rs-tab-item>
        </rs-tab>

        <div class="flex items-center justify-between px-5 mt-4">
          <div class="flex items-center gap-2">
            <span class="text-sm text-gray-700">Baris per halaman:</span>
            <FormKit
              v-model="pageSize"
              type="select"
              :options="[10, 25, 50]"
              :classes="{ wrapper: 'w-20', outer: 'mb-0', input: '!rounded-lg' }"
            />
          </div>
          <div class="flex items-center gap-2">
            <span class="text-sm text-gray-700">
              Menunjukkan {{ paginationStart }} hingga {{ paginationEnd }} daripada {{ totalRecipients }} entri
            </span>
            <div class="flex gap-1">
              <rs-button variant="primary-outline" class="!p-1 !w-8 !h-8" :disabled="currentPage === 1" @click="currentPage--">
                <Icon name="ic:round-keyboard-arrow-left" />
              </rs-button>
              <rs-button variant="primary-outline" class="!p-1 !w-8 !h-8" :disabled="currentPage === totalPages" @click="currentPage++">
                <Icon name="ic:round-keyboard-arrow-right" />
              </rs-button>
            </div>
          </div>
        </div>
      </template>
    </rs-card>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

definePageMeta({ title: 'Senarai Pengesahan Recipient' });

const breadcrumb = ref([
  { name: 'Pengesahan', type: 'link', path: '/BF-PRF/TP/PP' },
  { name: 'Senarai Recipient', type: 'current', path: '/BF-PRF/TP/PP' },
]);

// Columns definition
const columns = [
  { key: 'noRujukan', label: 'No. Rujukan', sortable: true },
  { key: 'namaRecipient', label: 'Nama Recipient', sortable: true },
  { key: 'jenisRecipient', label: 'Jenis Recipient', sortable: true },
  { key: 'jenisPengenalan', label: 'Jenis Pengenalan', sortable: true },
  { key: 'tarikhPermohonan', label: 'Tarikh Permohonan', sortable: true },
  { key: 'status', label: 'Status', sortable: true },
  { key: 'tindakan', label: 'Tindakan', sortable: false },
];

// Tab and table state
const activeTab = ref(0);
const tableKey = ref(0);

const searchQuery = ref('');
const pageSize = ref(10);
const currentPage = ref(1);

const recipientList = ref([
  {
    noRujukan: 'RE-240511',
    namaRecipient: 'Ahmad Bin Abdullah',
    jenisRecipient: 'Individu',
    jenisPengenalan: 'MyKad',
    tarikhPermohonan: new Date().toISOString(),
    status: 'Menunggu Pengesahan',
    tindakan: { id: 'RE-240511', status: 'Menunggu Pengesahan' },
  },
  {
    noRujukan: 'RE-240512',
    namaRecipient: 'Pusat Dialisis Al-Falah Sdn Bhd',
    jenisRecipient: 'Syarikat',
    jenisPengenalan: 'ID Syarikat',
    tarikhPermohonan: new Date().toISOString(),
    status: 'Diluluskan',
    tindakan: { id: 'RE-240512', status: 'Diluluskan' },
  },
  {
    noRujukan: 'RE-240513',
    namaRecipient: 'Siti Fatimah Binti Ali',
    jenisRecipient: 'Individu',
    jenisPengenalan: 'Foreign ID',
    tarikhPermohonan: new Date().toISOString(),
    status: 'Ditolak',
    tindakan: { id: 'RE-240513', status: 'Ditolak' },
  },
  {
    noRujukan: 'RE-240514',
    namaRecipient: 'Klinik Kesihatan Sejahtera',
    jenisRecipient: 'Syarikat',
    jenisPengenalan: 'ID Syarikat',
    tarikhPermohonan: new Date().toISOString(),
    status: 'Menunggu Pengesahan',
    tindakan: { id: 'RE-240514', status: 'Menunggu Pengesahan' },
  },
  {
    noRujukan: 'RE-240515',
    namaRecipient: 'Zainab Binti Hassan',
    jenisRecipient: 'Individu',
    jenisPengenalan: 'MyKad',
    tarikhPermohonan: new Date().toISOString(),
    status: 'Diluluskan',
    tindakan: { id: 'RE-240515', status: 'Diluluskan' },
  },
  {
    noRujukan: 'RE-240516',
    namaRecipient: 'Pembekal Makanan Halal Sdn Bhd',
    jenisRecipient: 'Syarikat',
    jenisPengenalan: 'ID Syarikat',
    tarikhPermohonan: new Date().toISOString(),
    status: 'Ditolak',
    tindakan: { id: 'RE-240516', status: 'Ditolak' },
  },
]);

// Filter table data based on status
const getTableDataByStatus = (statuses) => {
  let result = recipientList.value.filter(recipient => 
    statuses.includes(recipient.status)
  );
  
  // Apply search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    result = result.filter(recipient => 
      recipient.noRujukan.toLowerCase().includes(query) ||
      recipient.namaRecipient.toLowerCase().includes(query)
    );
  }
  
  return result;
};

const filteredRecipients = computed(() => {
  let filtered = [...recipientList.value];

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter(item =>
      item.noRujukan.toLowerCase().includes(query) ||
      item.namaRecipient.toLowerCase().includes(query)
    );
  }

  return filtered;
});

const totalRecipients = computed(() => filteredRecipients.value.length);
const totalPages = computed(() => Math.ceil(totalRecipients.value / pageSize.value));
const paginationStart = computed(() => ((currentPage.value - 1) * pageSize.value) + 1);
const paginationEnd = computed(() => Math.min(currentPage.value * pageSize.value, totalRecipients.value));

const formatDate = (dateString) => new Date(dateString).toLocaleDateString('ms-MY');
const formatTime = (dateString) => new Date(dateString).toLocaleTimeString('ms-MY');

const getStatusVariant = (status) => {
  const variants = {
    'Menunggu Pengesahan': 'warning',
    'Diluluskan': 'success',
    'Ditolak': 'danger'
  };
  return variants[status] || 'default';
};

// Action capabilities - only allow action for pending status
const canPerformAction = (status) => {
  return ['Menunggu Pengesahan'].includes(status);
};

// Search function
const performSearch = () => {
  // Force table re-render when search is performed
  tableKey.value++;
  currentPage.value = 1;
};

const viewRecipient = (id) => navigateTo(`/BF-PRF/TP/PP/${id}`);
const handleSemakPengesahan = (id) => navigateTo(`/BF-PRF/TP/PP/03`);
</script>
