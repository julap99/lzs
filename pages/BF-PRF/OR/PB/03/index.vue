<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />

    <rs-card>
      <template #header>Pengesahan Permohonan Cawangan</template>
      <template #body>
        <rs-table
          class="mt-8"
          :data="filteredData"
          :columns="columns"
          :pageSize="10"
          :showNoColumn="true"
          :options="{ variant: 'default', hover: true, striped: true }"
        >
          <template v-slot:status="data">
            <rs-badge :variant="getStatusVariant(data.text)" size="sm">
              {{ data.text }}
            </rs-badge>
          </template>

          <template v-slot:tarikhPermohonan="{ text }">
            <div>
              <div class="font-medium">{{ formatDate(text) }}</div>
              <div class="text-sm text-gray-500">{{ formatTime(text) }}</div>
            </div>
          </template>

          <template v-slot:aksi="{ text }">
            <rs-button
              v-if="text.status === 'Menunggu Pengesahan'"
              variant="primary"
              size="sm"
              class="!px-2 !py-1"
              @click="navigateTo(`/BF-PRF/OR/PB/03/${text.id}`)"
            >
              <Icon name="ph:check" class="w-4 h-4 mr-1" />
              Semak
            </rs-button>
            <span v-else class="text-gray-500 text-sm">-</span>
          </template>
        </rs-table>
      </template>
    </rs-card>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const breadcrumb = ref([
  { name: 'Profil Organisasi', type: 'link', path: '/BF-PRF/OR/PB/01' },
  { name: 'Senarai Permohonan Cawangan', type: 'current', path: '/BF-PRF/OR/PB/03' }
]);

// Columns definition
const columns = [
  { key: 'id', label: 'ID Permohonan', sortable: true },
  { key: 'namaCawangan', label: 'Nama Cawangan', sortable: true },
  { key: 'namaInduk', label: 'Nama HQ', sortable: true },
  { key: 'tarikhPermohonan', label: 'Tarikh Permohonan', sortable: true },
  { key: 'status', label: 'Status', sortable: true },
  { key: 'aksi', label: 'Aksi', sortable: false },
];

const data = ref([
  {
    id: 'PB-2025-001',
    namaCawangan: 'Cawangan Seri Damai',
    namaInduk: 'Yayasan Insan',
    tarikhPermohonan: '2025-06-01T10:30:00',
    status: 'Menunggu Pengesahan',
    aksi: { id: 'PB-2025-001', status: 'Menunggu Pengesahan' }
  },
  {
    id: 'PB-2025-002',
    namaCawangan: 'Cawangan Taman Ilmu',
    namaInduk: 'Pertubuhan Amal Jariah',
    tarikhPermohonan: '2025-06-02T14:15:00',
    status: 'Diluluskan',
    aksi: { id: 'PB-2025-002', status: 'Diluluskan' }
  },
  {
    id: 'PB-2025-003',
    namaCawangan: 'Cawangan Bandar Baru',
    namaInduk: 'Yayasan Pendidikan Islami Malaysia',
    tarikhPermohonan: '2025-06-03T09:45:00',
    status: 'Ditolak',
    aksi: { id: 'PB-2025-003', status: 'Ditolak' }
  }
]);

const filteredData = ref([...data.value]);

const getStatusVariant = (status) => {
  const variants = {
    'Menunggu Pengesahan': 'warning',
    'Diluluskan': 'success',
    'Ditolak': 'danger'
  };
  return variants[status] || 'default';
};

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('ms-MY', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
};

const formatTime = (dateString) => {
  return new Date(dateString).toLocaleTimeString('ms-MY', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });
};
</script>

<style scoped></style>
