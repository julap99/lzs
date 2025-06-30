<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />

    <rs-card>
      <template #header>Pengesahan Permohonan Cawangan</template>
      <template #body>
        <rs-table
          class="mt-8"
          :data="filteredData"
          :pageSize="10"
          :showNoColumn="true"
          :options="{ variant: 'default', hover: true }"
        >
          <template v-slot:status="data">
            <rs-badge :variant="getStatusVariant(data.text)" size="sm">
              {{ data.text }}
            </rs-badge>
          </template>

          <template v-slot:tarikhPermohonan="data">
            <span class="font-medium">{{ formatDate(data.text) }}</span>
          </template>

          <template v-slot:aksi="data">
            <rs-button
              variant="primary"
              size="sm"
              class="!px-2 !py-1"
              @click="navigateTo(`/BF-PRF/OR/PB/03/${data.row.id}`)"
            >
              Semak
              <Icon name="mdi:chevron-right" class="ml-1" size="1rem" />
            </rs-button>
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

const data = ref([
  {
    id: 'PB-2025-001',
    namaCawangan: 'Cawangan Seri Damai',
    namaInduk: 'Yayasan Insan',
    tarikhPermohonan: '2025-06-01',
    status: 'Menunggu Pengesahan'
  },
  {
    id: 'PB-2025-002',
    namaCawangan: 'Cawangan Taman Ilmu',
    namaInduk: 'Pertubuhan Amal Jariah',
    tarikhPermohonan: '2025-06-02',
    status: 'Menunggu Pengesahan'
  }
]);

const filteredData = ref([...data.value]);

const getStatusVariant = (status) => {
  const variants = {
    'Menunggu Pengesahan': 'warning',
    'Disahkan': 'success',
    'Tidak Sah': 'danger'
  };
  return variants[status] || 'default';
};

const formatDate = (date) => {
  return new Date(date).toLocaleDateString('ms-MY', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });
};
</script>

<style scoped></style>
