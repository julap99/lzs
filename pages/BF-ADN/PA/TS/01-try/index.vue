<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />
    <rs-card>
      <template #header>
        <CardHeader icon="mdi:clipboard-list" title="Tugasan Saya" subtitle="Senarai tugasan yang telah diambil" />
      </template>
      <template #body>
        <rs-table :columns="columns" :data="tugasanList">
          <template #actions="{ row }">
            <rs-button size="sm" variant="primary" @click="goToTask(row)">Lihat</rs-button>
          </template>
        </rs-table>
      </template>
    </rs-card>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const breadcrumb = [
  { name: 'Pengurusan Aduan', path: '/BF-ADN/PA', type: 'link' },
  { name: 'Tugasan Saya', type: 'current' }
];

const columns = [
  { label: 'No. Aduan', key: 'noAduan' },
  { label: 'Nama Pemohon', key: 'nama' },
  { label: 'Aktiviti', key: 'aktiviti' },
  { label: 'Status Tugasan', key: 'statusTugasan' },
  { label: 'Tindakan', key: 'actions' }
];

const tugasanList = ref([
  { noAduan: 'ADN-2025-001', nama: 'Ali bin Ahmad', aktiviti: 'Siasatan Ringkas', statusTugasan: 'Dalam Tindakan' },
  { noAduan: 'ADN-2025-003', nama: 'Zainab binti Ali', aktiviti: 'Siasatan Lapangan', statusTugasan: 'Selesai' }
]);

const goToTask = (row) => {
  router.push(`/BF-ADN/PA/tugasan/${row.noAduan}`);
};
</script>