<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />

    <!-- Two-column layout -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
      <!-- Konfigurasi SLA Semasa -->
      <rs-card>
        <template #header>
          <span class="font-semibold">Konfigurasi SLA Semasa</span>
        </template>
        <template #body>
          <div class="space-y-2">
            <p><b>Tahap Aduan:</b> {{ slaSemasa.tahapAduan }}</p>
            <p><b>Tempoh SLA (Jam):</b> {{ slaSemasa.tempoh }}</p>
            <p><b>Status:</b> {{ slaSemasa.status }}</p>
          </div>
        </template>
      </rs-card>

      <!-- Permohonan Baharu -->
      <rs-card>
        <template #header>
          <span class="font-semibold">Permohonan Baharu</span>
        </template>
        <template #body>
          <div class="space-y-2">
            <p><b>Tahap Aduan:</b> {{ slaBaru.tahapAduan }}</p>
            <p>
              <b>Tempoh SLA (Jam):</b>
              <span class="bg-yellow-100 px-2 py-1 rounded">{{ slaBaru.tempoh }}</span>
            </p>
            <p><b>Status:</b> {{ slaBaru.status }}</p>
            <p>
              <b>Tarikh Mula:</b>
              <span class="bg-yellow-100 px-2 py-1 rounded font-semibold">
                {{ formatDate(slaBaru.tarikhMula) }}
              </span>
            </p>
            <p><b>Catatan:</b> {{ slaBaru.catatan }}</p>
          </div>

          <!-- Action Buttons -->
          <div class="flex justify-end space-x-3 mt-4">
            <rs-button variant="success" @click="confirmAction('lulus')">
              Luluskan
            </rs-button>
            <rs-button variant="danger" @click="confirmAction('batal')">
              Tolak
            </rs-button>
          </div>
        </template>
      </rs-card>
    </div>

    <!-- Confirmation Modal -->
    <div
      v-if="showConfirm"
      class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50"
    >
      <div class="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
        <h2 class="text-lg font-semibold mb-4">Pengesahan</h2>
        <p class="mb-6">{{ confirmMessage }}</p>
        <div class="flex justify-end space-x-3">
          <button
            class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
            @click="proceedAction"
          >
            Ya, teruskan
          </button>
          <button
            class="bg-gray-300 hover:bg-gray-400 text-black px-4 py-2 rounded"
            @click="showConfirm = false"
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
  title: "Semakan & Kelulusan SLA",
});

const breadcrumb = ref([
  { name: "Pengurusan SLA", type: "link", path: `/BF-ADN/SLA` },
  { name: "Semakan & Kelulusan SLA", type: "current", path: "/BF-ADN/PK/KS/02" },
]);

// SLA sekarang
const slaSemasa = ref({
  tahapAduan: "Kelas 1 (Merah)",
  tempoh: 24,
  status: "Aktif",
});

// SLA baru
const slaBaru = ref({
  tahapAduan: "Kelas 1 (Merah)",
  tempoh: 48,
  status: "Aktif",
  tarikhMula: "2025-09-15",
  catatan: "Peningkatan tempoh SLA kerana bilangan kes bertambah",
});

// Modal state
const showConfirm = ref(false);
const confirmMessage = ref("");
let actionType = null;

// Open confirmation modal
const confirmAction = (type) => {
  actionType = type;
  if (type === "lulus") {
    confirmMessage.value = "Adakah anda pasti untuk meluluskan permohonan ini?";
  } else {
    confirmMessage.value = "Adakah anda pasti untuk membatalkan permohonan ini?";
  }
  showConfirm.value = true;
};

// Proceed with action
const proceedAction = () => {
  showConfirm.value = false;
  if (actionType === "lulus") {
    console.log("✅ Permohonan diluluskan.");
    // TODO: letakkan API call / update state di sini
  } else if (actionType === "batal") {
    console.log("❌ Permohonan dibatalkan.");
    // TODO: letakkan API call / update state di sini
  }
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
