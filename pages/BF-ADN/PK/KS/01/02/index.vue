<template>
  <div>
    <!-- Breadcrumb -->
    <LayoutsBreadcrumb :items="breadcrumb" />

    <!-- SLA Detail Card -->
    <rs-card class="mb-6">
      <template #header>
        <div class="flex justify-between items-center">
          <span>Butiran SLA – Tahap Aduan: <b>{{ slaDetail.tahapAduan }}</b></span>
          <NuxtLink to="/BF-ADN/PK/KS/01/03">
            <rs-button variant="primary" size="sm">
              Kemaskini
            </rs-button>
          </NuxtLink>
        </div>
      </template>

      <template #body>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div><b>Tahap Aduan:</b> {{ slaDetail.tahapAduan }}</div>
          <div><b>Nama SLA:</b> {{ slaDetail.namaSla }}</div>
          <div><b>Tempoh SLA (Jam):</b> {{ slaDetail.tempoh }}</div>
          <div><b>Tarikh Mula Kuasa:</b> {{ formatDate(slaDetail.tarikhMula) }}</div>
          <div>
            <b>Status:</b>
            <rs-badge :variant="getStatusVariant(slaDetail.status)">
              {{ slaDetail.status }}
            </rs-badge>
          </div>
        </div>
      </template>
    </rs-card>

    <!-- SLA History Table -->
    <rs-card>
      <template #header>Senarai Sejarah Perubahan SLA</template>

      <template #body>
        <p class="text-sm mb-3">
          Berikut merupakan sejarah versi konfigurasi SLA bagi tahap aduan ini.
        </p>
        <rs-table
          :data="slaHistory"
          :pageSize="5"
          :showNoColumn="true"
          :options="{ variant: 'default', hover: true, bordered: true, striped: true, sortable: true }"
        >
          <!-- Custom headers -->
          <template #head.tempoh><span class="font-bold">Tempoh (Jam)</span></template>
          <template #head.tarikhMula><span class="font-bold">Tarikh Mula</span></template>
          <template #head.status><span class="font-bold">Status</span></template>
          <template #head.dikemaskiniOleh><span class="font-bold">Dikemaskini Oleh</span></template>
          <template #head.tarikhKemaskini><span class="font-bold">Tarikh Kemaskini</span></template>
          <template #head.catatan><span class="font-bold">Catatan</span></template>
          <template #head.statusKelulusan><span class="font-bold">Status Kelulusan</span></template>
          <template #head.diluluskanOleh><span class="font-bold">Diluluskan Oleh</span></template>
          <template #head.tarikhDiluluskan><span class="font-bold">Tarikh Diluluskan</span></template>

          <!-- Custom cells -->
          <template #status="{ text }">
            <rs-badge :variant="getStatusVariant(text)">
              {{ text }}
            </rs-badge>
          </template>

          <template #tarikhMula="{ text }">{{ formatDate(text) }}</template>
          <template #tarikhKemaskini="{ text }">{{ formatDate(text) }}</template>
          <template #tarikhDiluluskan="{ text }">{{ formatDate(text) }}</template>

          <template #statusKelulusan="{ text }">
            <rs-badge :variant="text === 'Diluluskan' ? 'success' : 'warning'">
              {{ text }}
            </rs-badge>
          </template>
        </rs-table>
      </template>
    </rs-card>
  </div>
</template>

<script setup>
import { ref } from "vue";

definePageMeta({
  title: "Butiran SLA",
  path: "/BF-ADN/PK/KS/01/02",
});

const breadcrumb = ref([
  { name: "Pengurusan SLA", type: "link", path: `/BF-ADN/SLA` },
  { name: "Senarai SLA", type: "link", path: `/BF-ADN/PK/KS/01/01` },
  { name: "Butiran SLA", type: "current", path: "/BF-ADN/PK/KS/01/02" },
]);

// SLA detail
const slaDetail = ref({
  tahapAduan: "Kelas 1 (Merah)",
  namaSla: "Siasatan Awal",
  tempoh: 48,
  tarikhMula: "2025-09-01",
  status: "Aktif",
});

// SLA history data
const slaHistory = ref([
  {
    tempoh: 48,
    tarikhMula: "2025-09-01",
    status: "Aktif",
    dikemaskiniOleh: "Eksekutif A",
    tarikhKemaskini: "2025-08-28",
    catatan: "Kemaskini nilai SLA untuk kes kritikal",
    statusKelulusan: "Diluluskan",
    diluluskanOleh: "Pengurus A",
    tarikhDiluluskan: "2025-08-29",
  },
  {
    tempoh: 24,
    tarikhMula: "2025-06-01",
    status: "Tidak Aktif",
    dikemaskiniOleh: "Eksekutif B",
    tarikhKemaskini: "2025-05-28",
    catatan: "Konfigurasi awal sistem",
    statusKelulusan: "Tidak Diluluskan",
    diluluskanOleh: "Pengurus B",
    tarikhDiluluskan: "2025-05-29",
  },
]);

// Badge coloring
const getStatusVariant = (status) => {
  return status === "Aktif" ? "success" : "danger";
};

// Date formatting
const formatDate = (date) => {
  return new Date(date).toLocaleDateString("ms-MY", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
};
</script>
