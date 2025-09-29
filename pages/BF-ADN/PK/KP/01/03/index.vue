<template>
  <div>
    <!-- Breadcrumb + Top Bar -->
    <div class="flex justify-between items-center mb-6">
      <LayoutsBreadcrumb :items="breadcrumb" />
      <NuxtLink to="/BF-ADN/PK/KP/01/04">
        <rs-button variant="warning" size="sm">Kemaskini</rs-button>
      </NuxtLink>
    </div>

    <!-- Title -->
    <h2 class="text-xl font-bold mb-6">Butiran Konfigurasi Penutupan Aduan</h2>

    <!-- Maklumat Konfigurasi Semasa -->
    <rs-card class="mb-6">
      <template #header>Maklumat Konfigurasi Semasa</template>
      <template #body>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <p><b>Sebab Penutupan:</b> {{ current.sebab }}</p>
          <p><b>Tarikh Mula Kuasa:</b> {{ formatDate(current.tarikhMula) }}</p>
          <p>
            <b>Status:</b>
            <rs-badge :variant="statusVariant(current.status)">
              {{ current.status }}
            </rs-badge>
          </p>
          <p><b>Catatan:</b> {{ current.catatan }}</p>
        </div>
      </template>
    </rs-card>

    <!-- Senarai Sejarah Perubahan -->
    <rs-card>
      <template #header>Senarai Sejarah Perubahan</template>
      <template #body>
        <rs-table
          :data="rows"
          :pageSize="5"
          :showNoColumn="true"
          :options="{ variant: 'default', hover: true, striped: true }"
        >
          <!-- Status Konfigurasi badge -->
          <template #status="data">
            <rs-badge :variant="statusVariant(data.text)">
              {{ data.text }}
            </rs-badge>
          </template>

          <!-- Status Kelulusan badge -->
          <template #statusKelulusan="data">
            <rs-badge :variant="approvalVariant(data.text)">
              {{ data.text }}
            </rs-badge>
          </template>

          <!-- Tarikh formatting -->
          <template #tarikhMula="data">{{ formatDate(data.text) }}</template>
          <template #tarikhKemaskini="data">{{ formatDate(data.text) }}</template>
          <template #tarikhDiluluskan="data">{{ formatDate(data.text) }}</template>
        </rs-table>
      </template>
    </rs-card>
  </div>
</template>

<script setup>
import { ref } from "vue";

definePageMeta({
  title: "Butiran Konfigurasi Penutupan Aduan",
  path: "/BF-ADN/PK/KP/01/03",
});

const breadcrumb = ref([
  { name: "Pengurusan SLA", type: "link", path: "/BF-ADN/SLA" },
  { name: "Senarai Konfigurasi Penutupan Aduan", type: "link", path: "/BF-ADN/PK/KP/01/01" },
  { name: "Butiran Konfigurasi", type: "current", path: "/BF-ADN/PK/KP/01/03" },
]);

// Current config
const current = ref({
  sebab: "Bantuan telah diterima daripada agensi lain",
  status: "Aktif",
  tarikhMula: "2025-10-05",
  catatan: "Konfigurasi ini digunakan untuk situasi bantuan luar diterima.",
});

// History rows
const rows = ref([
  {
    sebab: "Bantuan telah diterima daripada agensi lain",
    tarikhMula: "2025-09-01",
    status: "Tidak Aktif",
    dikemaskiniOleh: "admin1",
    tarikhKemaskini: "2025-08-30",
    catatanKemaskini: "Kemaskini ulasan tambahan diperlukan",
    statusKelulusan: "Diluluskan",
    diluluskanOleh: "Ketua Jabatan",
    tarikhDiluluskan: "2025-09-01",
  },
  {
    sebab: "Masalah telah diselesaikan oleh pengadu sendiri",
    tarikhMula: "2025-08-15",
    status: "Tidak Aktif",
    dikemaskiniOleh: "admin2",
    tarikhKemaskini: "2025-08-10",
    catatanKemaskini: "Menambah konfigurasi baru untuk keselesaan pengadu",
    statusKelulusan: "Diluluskan",
    diluluskanOleh: "Pengarah",
    tarikhDiluluskan: "2025-08-12",
  },
  {
    sebab: "Maklumat tidak lengkap atau tidak tepat",
    tarikhMula: "2025-07-20",
    status: "Menunggu Kelulusan",
    dikemaskiniOleh: "admin3",
    tarikhKemaskini: "2025-07-18",
    catatanKemaskini: "Kemaskini format catatan untuk lebih terperinci",
    statusKelulusan: "Dalam Proses",
    diluluskanOleh: "-",
    tarikhDiluluskan: "-",
  },
]);

// Badge coloring
const statusVariant = (status) => {
  if (status === "Aktif") return "success";
  if (status === "Tidak Aktif") return "danger";
  if (status === "Menunggu Kelulusan") return "warning";
  return "secondary";
};

const approvalVariant = (status) => {
  if (status === "Diluluskan") return "success";
  if (status === "Dalam Proses") return "warning";
  if (status === "Tidak Diluluskan") return "danger";
  return "secondary";
};

// Date formatting
const formatDate = (date) => {
  if (!date || date === "-") return "-";
  return new Date(date).toLocaleDateString("ms-MY", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
};
</script>
