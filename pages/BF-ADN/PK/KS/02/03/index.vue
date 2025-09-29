<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />

    <!-- Title + Button -->
    <div class="flex justify-between items-center mb-4">
      <h2 class="text-xl font-bold">Butiran Permohonan SLA</h2>
      <rs-button variant="primary" size="sm" @click="showForm = true">
        + Tambah Status
      </rs-button>
    </div>

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

    <!-- Modal Form -->
    <div
      v-if="showForm"
      class="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50"
    >
      <div class="bg-white rounded-lg shadow-lg w-full max-w-lg p-6">
        <h3 class="text-lg font-semibold mb-4">Tambah Status Baru</h3>

        <!-- Form fields -->
        <div class="mb-4">
          <label class="block font-medium mb-1">Status Permohonan</label>
          <select v-model="newStatus.status" class="w-full border rounded p-2">
            <option value="">-- Pilih Status --</option>
            <option value="Diluluskan">Diluluskan</option>
            <option value="Menunggu Kelulusan">Menunggu Kelulusan</option>
            <option value="Ditolak">Ditolak</option>
          </select>
        </div>

        <div class="mb-4">
          <label class="block font-medium mb-1">Ulasan Ketua Jabatan</label>
          <textarea
            v-model="newStatus.ulasan"
            rows="3"
            class="w-full border rounded p-2"
            placeholder="Masukkan ulasan..."
          ></textarea>
        </div>

        <div class="mb-4">
          <label class="block font-medium mb-1">Tarikh</label>
          <input
            type="date"
            v-model="newStatus.tarikh"
            class="w-full border rounded p-2"
          />
        </div>

        <!-- Action buttons -->
        <div class="flex justify-end space-x-3">
          <rs-button variant="secondary" @click="showForm = false">Batal</rs-button>
          <rs-button variant="primary" @click="simpanStatus">Simpan</rs-button>
        </div>
      </div>
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

// Maklumat Kelulusan
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

// State for modal form
const showForm = ref(false);
const newStatus = ref({
  status: "",
  ulasan: "",
  tarikh: "",
});

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

// Save new status
const simpanStatus = () => {
  if (!newStatus.value.status || !newStatus.value.tarikh) {
    alert("Sila isi semua maklumat wajib.");
    return;
  }

  kelulusanList.value.push({
    status: newStatus.value.status,
    ulasan: newStatus.value.ulasan,
    tarikhKelulusan:
      newStatus.value.status === "Diluluskan" ? newStatus.value.tarikh : null,
    tarikhSemakan:
      newStatus.value.status !== "Diluluskan" ? newStatus.value.tarikh : null,
  });

  // Reset form
  newStatus.value = { status: "", ulasan: "", tarikh: "" };
  showForm.value = false;
};
</script>
