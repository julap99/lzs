<template>
  <div>
    <!-- Breadcrumb -->
    <LayoutsBreadcrumb :items="breadcrumb" />

    <!-- Title -->
    <h2 class="text-xl font-bold mb-6 text-center">
      Semakan & Kelulusan Kategori Masalah
    </h2>

    <!-- Two-column layout -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      <!-- Konfigurasi Semasa -->
      <div class="border-l-4 border-blue-600 bg-white shadow rounded p-4">
        <h3 class="font-bold mb-4">Konfigurasi Semasa</h3>
        <p><span class="font-medium">Kategori Masalah:</span> {{ konfigurasi.kategori }}</p>
        <p><span class="font-medium">Tahap Aduan:</span> {{ konfigurasi.tahap }}</p>
        <p><span class="font-medium">Status:</span> {{ konfigurasi.status }}</p>
      </div>

      <!-- Permohonan Baharu -->
      <div class="border-l-4 border-blue-600 bg-white shadow rounded p-4">
        <h3 class="font-bold mb-4">Permohonan Baharu</h3>
        <p><span class="font-medium">Kategori Masalah:</span> {{ permohonan.kategori }}</p>
        <p><span class="font-medium">Tahap Aduan:</span> {{ permohonan.tahap }}</p>
        <p><span class="font-medium">Penerangan:</span> {{ permohonan.penerangan }}</p>
        <p><span class="font-medium">Status Dimohon:</span> {{ permohonan.status }}</p>
        <p><span class="font-medium">Dikemukakan Oleh:</span> {{ permohonan.dikemukakanOleh }}</p>
        <p><span class="font-medium">Tarikh Permohonan:</span> {{ permohonan.tarikh }}</p>
      </div>
    </div>

    <!-- Ulasan & Tindakan -->
    <div class="bg-white shadow rounded p-4">
      <h3 class="font-bold mb-4">Ulasan & Tindakan</h3>
      <label class="block font-medium mb-2">Ulasan (wajib jika tolak):</label>
      <textarea
        v-model="ulasan"
        rows="3"
        placeholder="Tulis ulasan anda di sini..."
        class="w-full border rounded px-3 py-2"
      ></textarea>

      <!-- Action Buttons -->
      <div class="flex justify-end space-x-3 mt-4">
        <button
          class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
          @click="openModal('approve')"
        >
          Luluskan
        </button>
        <button
          class="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
          @click="openModal('reject')"
        >
          Tolak Permohonan
        </button>
      </div>
    </div>

    <!-- Confirmation Modal -->
    <div
      v-if="showModal"
      class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
    >
      <div class="bg-white rounded shadow-lg w-full max-w-md p-6">
        <h3 class="text-lg font-bold mb-4 text-center">
          {{ modalMessage }}
        </h3>
        <div class="flex justify-center space-x-4">
          <button
            class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
            @click="confirmAction"
          >
            Ya, teruskan
          </button>
          <button
            class="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded"
            @click="cancelAction"
          >
            Batal
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

definePageMeta({
  title: "Semakan & Kelulusan Kategori Masalah",
  path: "/BF-ADN/PK/KT/02/02",
});

const breadcrumb = ref([
  { name: "Pengurusan SLA", type: "link", path: "/BF-ADN/SLA" },
  { name: "Senarai Permohonan Kelulusan", type: "link", path: "/BF-ADN/PK/02/01" },
  { name: "Semakan & Kelulusan", type: "current", path: "/BF-ADN/PK/02/02" },
]);

// Example data
const konfigurasi = ref({
  kategori: "Tiada Tempat Tinggal",
  tahap: "Kelas 1 (Merah)",
  status: "Aktif",
});

const permohonan = ref({
  kategori: "Tiada Tempat Tinggal",
  tahap: "Kelas 1 (Merah)",
  penerangan: "Pemohon kehilangan tempat tinggal kekal akibat bencana atau isu keluarga.",
  status: "Aktif",
  dikemukakanOleh: "Eksekutif_A",
  tarikh: "2025-09-14",
});

const ulasan = ref("");

// Modal state
const showModal = ref(false);
const modalMessage = ref("");
let actionType = "";

// Open modal with message
const openModal = (type) => {
  actionType = type;
  if (type === "approve") {
    modalMessage.value = "Adakah anda pasti untuk meluluskan permohonan ini?";
  } else if (type === "reject") {
    modalMessage.value = "Adakah anda pasti untuk membatalkan permohonan ini?";
  }
  showModal.value = true;
};

// Confirm action
const confirmAction = () => {
  showModal.value = false;
  if (actionType === "approve") {
    alert("Permohonan telah diluluskan!");
  } else if (actionType === "reject") {
    alert("Permohonan telah ditolak!");
  }
};

// Cancel modal
const cancelAction = () => {
  showModal.value = false;
};
</script>
