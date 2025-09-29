<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />

    <rs-card>
      <template #header>Senarai Permohonan Kelulusan SLA</template>

      <template #body>
        <rs-table
          :data="rows"
          :field="fields"               
          :columns="columns"            
          :pageSize="10"
          :showNoColumn="true"
          :advanced="true"
          :showSearch="true"
          :showFilter="true"
          :optionsAdvanced="{
            sortable: true,
            filterable: true,
            responsive: false,
            outsideBorder: true
          }"
          :sort="{ column: 'tarikhMula', direction: 'desc' }"
        >
          <!-- Optional: custom header labels (override 'columns' label) -->
          <template #header-jenisPermohonan="{ columnKey }">
            <span class="uppercase tracking-wide">{{ columnLabel(columnKey) }}</span>
          </template>

          <!-- Status badge -->
          <template #status="{ text }">
            <div class="flex justify-center">
              <rs-badge :variant="statusVariant(text)">{{ text }}</rs-badge>
            </div>
          </template>

          <!-- Tindakan buttons: show conditionally -->
          <template #tindakan="{ value }">
            <div class="flex items-center justify-center gap-2">
              <!-- Only if Menunggu Kelulusan -->
              <NuxtLink
                v-if="value.status === 'Menunggu Kelulusan'"
                :to="`/BF-ADN/PK/KS/02/02?id=${value.id}`"
              >
                <rs-button variant="primary" size="sm">Semakan & Kelulusan</rs-button>
              </NuxtLink>

              <!-- Only if NOT Menunggu Kelulusan -->
              <NuxtLink
                v-if="value.status !== 'Menunggu Kelulusan'"
                :to="`/BF-ADN/PK/KS/02/03?id=${value.id}`"
              >
                <rs-button variant="secondary" size="sm">Lihat</rs-button>
              </NuxtLink>
            </div>
          </template>
        </rs-table>
      </template>
    </rs-card>
  </div>
</template>

<script setup>
import { ref } from 'vue';

definePageMeta({
  title: 'Senarai Permohonan Kelulusan SLA',
  path: '/BF-ADN/PK/KS/02/01',
});

const breadcrumb = ref([
  { name: 'Pengurusan SLA', type: 'link', path: '/BF-ADN/SLA' },
  { name: 'Senarai Permohonan Kelulusan SLA', type: 'current', path: '/BF-ADN/PK/KS/02/01' },
]);

/**
 * Column order in the table – must match keys on your row objects.
 * (If you omit this, rs-table will infer order from the 1st row.)
 */
const fields = [
  'jenisPermohonan',
  'tahapAduan',
  'tempohSla',
  'tarikhMula',
  'status',
  'tindakan',
];

/**
 * Custom labels for columns (optional).
 * These map to rs-table’s `columns` prop ({ key, label }).
 */
const columns = [
  { key: 'jenisPermohonan', label: 'Jenis Permohonan' },
  { key: 'tahapAduan',      label: 'Tahap Aduan' },
  { key: 'tempohSla',       label: 'Tempoh SLA (Jam)' },
  { key: 'tarikhMula',      label: 'Tarikh Mula' },
  { key: 'status',          label: 'Status Konfigurasi' },
  { key: 'tindakan',        label: 'Tindakan' },
];

const rows = ref([
  {
    id: 1,
    jenisPermohonan: 'Baru',
    tahapAduan: 'Kelas 1 (Merah)',
    tempohSla: 48,
    tarikhMula: '2025-09-15',
    status: 'Menunggu Kelulusan',
  },
  {
    id: 2,
    jenisPermohonan: 'Kemaskini',
    tahapAduan: 'Kelas 2 (Kuning)',
    tempohSla: 72,
    tarikhMula: '2025-09-20',
    status: 'Diluluskan',
  },
  {
    id: 3,
    jenisPermohonan: 'Kemaskini',
    tahapAduan: 'Kelas 3 (Hijau)',
    tempohSla: 96,
    tarikhMula: '2025-09-10',
    status: 'Ditolak',
  },
]);

const statusVariant = (s) => {
  if (s === 'Menunggu Kelulusan') return 'warning';
  if (s === 'Diluluskan') return 'success';
  if (s === 'Ditolak') return 'danger';
  return 'secondary';
};

// Helper to return the custom label from `columns`
const columnLabel = (key) => columns.find(c => c.key === key)?.label ?? key;

// (Optional) date formatter for a custom cell – if you want formatted date:
// Use a cell slot:
// <template #tarikhMula="{ text }">{{ formatDate(text) }}</template>
const formatDate = (date) =>
  new Date(date).toLocaleDateString('ms-MY', { year: 'numeric', month: '2-digit', day: '2-digit' });
</script>
