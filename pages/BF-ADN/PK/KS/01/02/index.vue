<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />

    <!-- SLA Detail Card -->
    <rs-card class="mb-6">
      <template #header>
        Butiran SLA – Tahap Aduan: <b>{{ slaDetail.tahapAduan }}</b>
      </template>
      <template #body>
        <div class="overflow-x-auto">
          <table class="table-auto w-full border">
            <tbody>
              <tr>
                <td class="font-medium p-2 border">Tahap Aduan</td>
                <td class="p-2 border">{{ slaDetail.tahapAduan }}</td>
              </tr>
              <tr>
                <td class="font-medium p-2 border">Nama SLA</td>
                <td class="p-2 border">{{ slaDetail.namaSla }}</td>
              </tr>
              <tr>
                <td class="font-medium p-2 border">Tempoh SLA (Jam)</td>
                <td class="p-2 border">{{ slaDetail.tempoh }}</td>
              </tr>
              <tr>
                <td class="font-medium p-2 border">Tarikh Mula Kuasa</td>
                <td class="p-2 border">{{ formatDate(slaDetail.tarikhMula) }}</td>
              </tr>
              <tr>
                <td class="font-medium p-2 border">Status</td>
                <td class="p-2 border">
                  <rs-badge :variant="getStatusVariant(slaDetail.status)">
                    {{ slaDetail.status }}
                  </rs-badge>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Edit Button -->
<div class="mt-4 text-right">
  <NuxtLink to="/BF-ADN/PK/KS/01/03">
    <rs-button variant="primary">
      Edit
    </rs-button>
  </NuxtLink>
</div>

      </template>
    </rs-card>

    <!-- SLA History Table -->
    <rs-card>
      <template #header>Senarai Sejarah SLA</template>
      <template #body>
        <p class="text-sm mb-3">
          Berikut merupakan sejarah versi konfigurasi SLA bagi tahap aduan ini.
        </p>
        <rs-table
          :data="slaHistory"
          :showNoColumn="true"
          :options="{ variant: 'default', hover: true }"
        >
          <!-- Status Konfigurasi badge -->
          <template v-slot:status="data">
            <rs-badge :variant="getStatusVariant(data.text)">
              {{ data.text }}
            </rs-badge>
          </template>

          <!-- Tarikh formatting -->
          <template v-slot:tarikhMula="data">
            {{ formatDate(data.text) }}
          </template>
          <template v-slot:tarikhKemaskini="data">
            {{ formatDate(data.text) }}
          </template>
          <template v-slot:tarikhDiluluskan="data">
            {{ formatDate(data.text) }}
          </template>

          <!-- Status Kelulusan badge -->
          <template v-slot:statusKelulusan="data">
            <rs-badge :variant="data.text === 'Diluluskan' ? 'success' : 'warning'">
              {{ data.text }}
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
});

const breadcrumb = ref([
  { name: "Pengurusan SLA", type: "link", path: `/BF-ADN/SLA` },
  { name: "Senarai SLA", type: "link", path: `/BF-ADN/SLA` },
  { name: "Butiran SLA", type: "current", path: "/BF-ADN/PK/KT/02" },
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
    "#": 1,
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
    "#": 2,
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
