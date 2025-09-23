<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />

    <h2 class="text-xl font-bold mb-4 text-center">Butiran Permohonan SLA</h2>

    <!-- Butiran Permohonan -->
    <rs-card class="mb-4 border-l-4 border-blue-500">
      <template #header>
        <span class="font-semibold">Butiran Permohonan</span>
      </template>
      <template #body>
        <div class="space-y-2">
          <p><b>Tahap Aduan:</b> {{ permohonan.tahapAduan }}</p>
          <p><b>Tempoh Dimohon:</b> {{ permohonan.tempoh }}</p>
          <p><b>Catatan Permohonan:</b> {{ permohonan.catatan }}</p>
          <p><b>Tarikh Permohonan:</b> {{ formatDate(permohonan.tarikhPermohonan) }}</p>
        </div>
      </template>
    </rs-card>

    <!-- Maklumat Kelulusan (looped) -->
    <div v-for="(kelulusan, index) in kelulusanList" :key="index" class="mb-4">
      <rs-card>
        <template #header>
          <span class="font-semibold">Maklumat Kelulusan</span>
        </template>
        <template #body>
          <div class="space-y-2">
            <p v-if="kelulusan.diluluskanOleh"><b>Diluluskan Oleh:</b> {{ kelulusan.diluluskanOleh }}</p>
            <p v-if="kelulusan.tarikhKelulusan"><b>Tarikh Kelulusan:</b> {{ formatDate(kelulusan.tarikhKelulusan) }}</p>
            <p v-if="kelulusan.disemakOleh"><b>Disemak Oleh:</b> {{ kelulusan.disemakOleh }}</p>
            <p v-if="kelulusan.tarikhSemakan"><b>Tarikh Semakan:</b> {{ formatDate(kelulusan.tarikhSemakan) }}</p>

            <p><b>Status:</b>
              <rs-badge
                :variant="getStatusVariant(kelulusan.status)"
                class="ml-2"
              >
                {{ kelulusan.status }}
              </rs-badge>
            </p>

            <p v-if="kelulusan.ulasan"><b>Ulasan Ketua Jabatan:</b> {{ kelulusan.ulasan }}</p>
            <p v-if="kelulusan.catatanTambahan" class="bg-gray-100 p-2 rounded">
              {{ kelulusan.catatanTambahan }}
            </p>
          </div>
        </template>
      </rs-card>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

definePageMeta({
  title: "Butiran Permohonan SLA",
});

const breadcrumb = ref([
  { name: "Pengurusan SLA", type: "link", path: `/BF-ADN/SLA` },
  { name: "Butiran Permohonan", type: "current", path: "/BF-ADN/PK/KS/04" },
]);

// Butiran Permohonan
const permohonan = ref({
  tahapAduan: "Kelas 1 (Merah)",
  tempoh: "48 jam",
  catatan: "Kes kecemasan meningkat, mohon panjangkan SLA kepada 48 jam.",
  tarikhPermohonan: "2025-09-10",
});

// Maklumat Kelulusan (array to allow multiple cards)
const kelulusanList = ref([
  {
    diluluskanOleh: "En. Muhammad Zaki (Ketua Jabatan)",
    tarikhKelulusan: "2025-09-13",
    status: "Diluluskan",
    ulasan: "Diluluskan untuk penyesuaian kes semasa.",
  },
  {
    status: "Menunggu Kelulusan",
    catatanTambahan: "Permohonan ini sedang dalam semakan Ketua Jabatan.",
  },
  {
    disemakOleh: "En. Muhammad Zaki (Ketua Jabatan)",
    tarikhSemakan: "2025-09-13",
    status: "Ditolak",
  },
]);

// Badge coloring
const getStatusVariant = (status) => {
  if (status === "Diluluskan") return "success";
  if (status === "Menunggu Kelulusan") return "warning";
  if (status === "Ditolak") return "danger";
  return "secondary";
};

// Format date
const formatDate = (date) => {
  return new Date(date).toLocaleDateString("ms-MY", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
};
</script>
