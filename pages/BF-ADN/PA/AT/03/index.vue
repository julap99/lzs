<<<<<<< HEAD
<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />
    <rs-card>
      <template #header>
        <CardHeader icon="mdi:calendar-search" title="Senarai Aduan" subtitle="Aduan yang belum diambil oleh mana-mana pegawai" />
      </template>
      <template #body>
        <rs-table :columns="columns" :data="aduanList">
          <template #actions="{ row }">
            <rs-button size="sm" @click="handleTerima(row)">Terima Tugasan</rs-button>
          </template>
        </rs-table>
      </template>
    </rs-card>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const breadcrumb = [
  { name: 'Pengurusan Aduan', path: '/BF-ADN/PA', type: 'link' },
  { name: 'Senarai Aduan', type: 'current' }
];

const columns = [
  { label: 'No. Aduan', key: 'noAduan' },
  { label: 'Nama Pemohon', key: 'nama' },
  { label: 'Kategori', key: 'kelas' },
  { label: 'Status', key: 'statusAduan' },
  { label: 'Tindakan', key: 'actions' }
];

const aduanList = ref([
  { noAduan: 'ADN-2025-001', nama: 'Ali bin Ahmad', kelas: 'Kelas 1', statusAduan: 'Telah Diagih' },
  { noAduan: 'ADN-2025-002', nama: 'Siti Aisyah', kelas: 'Kelas 2', statusAduan: 'Telah Diagih' }
]);

const handleTerima = (row) => {
  alert(`Tugasan untuk ${row.noAduan} telah diterima.`);
};
=======
<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />
    <rs-card>
      <template #header>
        <CardHeader icon="mdi:calendar-search" title="Senarai Aduan" subtitle="Aduan yang belum diambil oleh mana-mana pegawai" />
      </template>
      <template #body>
        <rs-table :columns="columns" :data="aduanList">
          <template #actions="{ row }">
            <rs-button size="sm" @click="handleTerima(row)">Terima Tugasan</rs-button>
          </template>
        </rs-table>
      </template>
    </rs-card>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const breadcrumb = [
  { name: 'Pengurusan Aduan', path: '/BF-ADN/PA', type: 'link' },
  { name: 'Senarai Aduan', type: 'current' }
];

const columns = [
  { label: 'No. Aduan', key: 'noAduan' },
  { label: 'Nama Pemohon', key: 'nama' },
  { label: 'Kategori', key: 'kelas' },
  { label: 'Status', key: 'statusAduan' },
  { label: 'Tindakan', key: 'actions' }
];

const aduanList = ref([
  { noAduan: 'ADN-2025-001', nama: 'Ali bin Ahmad', kelas: 'Kelas 1', statusAduan: 'Telah Diagih' },
  { noAduan: 'ADN-2025-002', nama: 'Siti Aisyah', kelas: 'Kelas 2', statusAduan: 'Telah Diagih' }
]);

const handleTerima = (row) => {
  alert(`Tugasan untuk ${row.noAduan} telah diterima.`);
};
>>>>>>> 3dcc227fdaa7aaa5e054a6ffebfa8addde014eae
</script>