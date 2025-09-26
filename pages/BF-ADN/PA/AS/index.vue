<!-- <template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />

    <rs-card>
      <template #header>Senarai Aduan Saya</template>
      <template #body>
        <rs-table
          class="mt-8"
          :data="aduanPengadu"
          :pageSize="10"
          :showNoColumn="true"
          :options="{
            variant: 'default',
            hover: true,
          }"
        >
          <template v-slot:noRujukan="data">
            <span class="font-medium">{{ data.text }}</span>
          </template>

          <template v-slot:tarikhAduan="data">
            <span class="font-medium">{{ formatDate(data.text) }}</span>
          </template>

          <template v-slot:kategori="data">
            <rs-badge :variant="getKategoriVariant(data.text)">{{ data.text }}</rs-badge>
          </template>

          <template v-slot:status="data">
            <rs-badge :variant="getStatusVariant(data.text)">{{ data.text }}</rs-badge>
          </template>

          <template v-slot:remarks="data">
              {{ data.text }}
          </template>

          <template v-slot:aksi="data">
            <rs-button variant="primary" size="sm" class="!px-3 !py-1" @click="lihatAduan(data.row.noRujukan)">
              Lihat
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
  { name: 'Pengurusan Aduan', path: '/BF-ADN/PA', type: 'link' },
  { name: 'Senarai Aduan Saya', type: 'current' },
]);

const aduanPengadu = ref([
  {
    noRujukan: 'ADN-2025-101',
    tarikhAduan: '2025-06-10',
    kategori: 'Kelas 1',
    status: 'Aduan Baru',
    remarks: '',
  },
  {
    noRujukan: 'ADN-2025-102',
    tarikhAduan: '2025-06-05',
    kategori: 'Kelas 2',
    status: 'Dalam Proses - Siasatan Ringkas',
    remarks: '',
  },
  {
    noRujukan: 'ADN-2025-103',
    tarikhAduan: '2025-05-28',
    kategori: 'Kelas 3',
    status: 'Selesai',
    remarks: 'Individu telah berdaftar dgn asnaf dan telah mendapat bantuan.',
  }
]);

const getStatusVariant = (status) => {
  const variants = {
    'Aduan Baru': 'warning',
    'Dalam Proses - Siasatan Ringkas': 'primary',
    'Dalam Proses - Quick Assessment': 'primary',
    'Dalam Proses - Siasatan Lapangan': 'primary',
    'Menunggu Kelulusan Bantuan': 'info',
    'Selesai': 'success',
    'Ditutup': 'danger',
    'Ditamatkan – Tukar Kategori': 'info'
  };
  return variants[status] || 'default';
};

const getKategoriVariant = (kategori) => {
  const variants = {
    'Kelas 1': 'danger',
    'Kelas 2': 'warning',
    'Kelas 3': 'success'
  };
  return variants[kategori] || 'default';
};

const formatDate = (date) => {
  return new Date(date).toLocaleDateString('ms-MY', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
};

const lihatAduan = (noRujukan) => {
  // Redirect to detail view, contohnya:
  navigateTo(`/BF-ADN/PENGADU/ADUAN/${noRujukan}`);
};
</script>

<style scoped></style> -->

<template>
  <iframe 
    src="https://bp.corrad.ai/workflow/7635e4be-ed80-443a-ae57-e495e977f3c6?debug=false&hideComplete=true&theme=light"
    width="100%" 
    height="600px"
    style="border: none; border-radius: 8px;">
  </iframe>
</template>