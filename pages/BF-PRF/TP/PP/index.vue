<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />

    <rs-card class="mt-4">
      <template #header>
        <div class="flex justify-between items-center">
          <h2 class="text-xl font-semibold">Senarai Pengesahan Recipient</h2>
        </div>
      </template>

      <template #body>
        <div class="mb-6">
          <div class="flex flex-col md:flex-row gap-4">
            <div class="flex-1">
              <FormKit
                v-model="searchQuery"
                type="text"
                placeholder="Cari No Rujukan, Nama Recipient, atau ID Pengenalan..."
                :classes="{ input: '!py-2' }"
              />
            </div>
            <div class="flex gap-2">
              <FormKit
                v-model="filters.status"
                type="select"
                :options="statusOptions"
                :classes="{ input: '!py-2' }"
              />
            </div>
          </div>
        </div>

        <rs-table
          :data="filteredRecipients"
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
                v-if="text.status === 'Menunggu Pengesahan'"
                variant="primary"
                size="sm"
                class="!px-2 !py-1"
                @click="handleSemakPengesahan(text.id)"
              >
                <Icon name="ph:check" class="w-4 h-4 mr-1" /> Semak & Buat Pengesahan
              </rs-button>
            </div>
          </template>
        </rs-table>

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

const columns = [
  { key: 'noRujukan', label: 'No. Rujukan', sortable: true },
  { key: 'namaRecipient', label: 'Nama Recipient', sortable: true },
  { key: 'jenisRecipient', label: 'Jenis Recipient', sortable: true },
  { key: 'jenisPengenalan', label: 'Jenis Pengenalan', sortable: true },
  { key: 'tarikhPermohonan', label: 'Tarikh Permohonan', sortable: true },
  { key: 'status', label: 'Status', sortable: true },
  { key: 'pegawai', label: 'Pegawai Bertugas', sortable: true },
  { key: 'tindakan', label: 'Tindakan', sortable: false },
];

const searchQuery = ref('');
const filters = ref({ status: '' });
const pageSize = ref(10);
const currentPage = ref(1);

const statusOptions = [
  { label: 'Menunggu Pengesahan', value: 'menunggu_pengesahan' },
  { label: 'Diluluskan', value: 'diluluskan' },
  { label: 'Ditolak', value: 'ditolak' },
];

const recipientList = ref([
  {
    noRujukan: 'TP-240511',
    namaRecipient: 'Ahmad Bin Abdullah',
    jenisRecipient: 'Individu',
    jenisPengenalan: 'MyKad',
    tarikhPermohonan: new Date().toISOString(),
    status: 'Menunggu Pengesahan',
    pegawai: 'Noraini Binti Azman',
    tindakan: { id: 'TP-240511', status: 'Menunggu Pengesahan' },
  },
  {
    noRujukan: 'TP-240512',
    namaRecipient: 'Pusat Dialisis Al-Falah Sdn Bhd',
    jenisRecipient: 'Syarikat',
    jenisPengenalan: 'ID Syarikat',
    tarikhPermohonan: new Date().toISOString(),
    status: 'Diluluskan',
    pegawai: 'Abdul Razak Bin Yusof',
    tindakan: { id: 'TP-240512', status: 'Diluluskan' },
  },
  {
    noRujukan: 'TP-240513',
    namaRecipient: 'Siti Fatimah Binti Ali',
    jenisRecipient: 'Individu',
    jenisPengenalan: 'Foreign ID',
    tarikhPermohonan: new Date().toISOString(),
    status: 'Ditolak',
    pegawai: 'Zarina Binti Kamal',
    tindakan: { id: 'TP-240513', status: 'Ditolak' },
  },
]);

const filteredRecipients = computed(() => {
  let filtered = [...recipientList.value];

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter(item =>
      item.noRujukan.toLowerCase().includes(query) ||
      item.namaRecipient.toLowerCase().includes(query) ||
      item.pegawai.toLowerCase().includes(query)
    );
  }

  if (filters.value.status) {
    filtered = filtered.filter(item =>
      item.status.toLowerCase().replace(/\s+/g, '_') === filters.value.status
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

const viewRecipient = (id) => navigateTo(`/BF-PRF/TP/PP/${id}`);
const handleSemakPengesahan = (id) => navigateTo(`/BF-PRF/TP/PP/03`);
</script>
