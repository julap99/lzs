<template>
  <div>
    <!-- Breadcrumb -->
    <LayoutsBreadcrumb :items="breadcrumb" />

    <!-- Title -->
    <h2 class="text-xl font-bold mb-6">Kelulusan Konfigurasi Penutupan Aduan</h2>

    <!-- Config & Application Details -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <!-- Current Config -->
      <div class="border rounded-lg shadow p-4 bg-white">
        <h3 class="font-semibold mb-4">Butiran Konfigurasi Semasa</h3>
        <p><b>Sebab Penutupan:</b> Bantuan telah diterima daripada agensi lain</p>
        <p><b>Tarikh Mula Kuasa:</b> 10/05/2025</p>
        <p>
          <b>Status Konfigurasi:</b>
          <span class="bg-green-500 text-white px-2 py-1 text-xs rounded">Aktif</span>
        </p>
      </div>

      <!-- Application Details -->
      <div class="border rounded-lg shadow p-4 bg-white">
        <h3 class="font-semibold mb-4">Butiran Permohonan</h3>
        <p><b>Sebab Penutupan (Baharu):</b> Bantuan telah diterima daripada agensi lain</p>
        <p><b>Tarikh Mula Kuasa:</b> 25/10/2025</p>
        <p>
          <b>Status Konfigurasi:</b>
          <span class="bg-green-500 text-white px-2 py-1 text-xs rounded">Aktif</span>
        </p>
        <p><b>Catatan Permohonan:</b> Konfigurasi tambahan untuk menyokong standardisasi proses penutupan aduan.</p>
        <p><b>Tarikh Permohonan:</b> 15-09-2025</p>
        <p><b>Dimohon Oleh:</b> Siti Norlia</p>
      </div>
    </div>

    <!-- Actions -->
    <div class="border rounded-lg shadow p-4 bg-white mt-6">
      <h3 class="font-semibold mb-4">Tindakan</h3>
      <label class="block mb-2 font-medium">Catatan Kelulusan</label>
      <textarea
        v-model="catatan"
        placeholder="Masukkan catatan..."
        class="border rounded w-full p-2 mb-4"
      ></textarea>
      <div class="flex gap-4">
        <button
          class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
          @click="confirmAction('lulus')"
        >
          Luluskan
        </button>
        <button
          class="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
          @click="confirmAction('tolak')"
        >
          Tolak Permohonan
        </button>
      </div>
    </div>

    <!-- Modal -->
    <div
      v-if="showModal"
      class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
    >
      <div class="bg-white rounded-lg p-6 w-96 shadow-lg">
        <h3 class="text-lg font-semibold mb-4">Pengesahan</h3>
        <p class="mb-6">
          {{ modalMessage }}
        </p>
        <div class="flex justify-end gap-4">
          <button
            class="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded"
            @click="closeModal"
          >
            Batal
          </button>
          <button
            class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
            @click="proceedAction"
          >
            Ya, teruskan
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

definePageMeta({
  title: "Kelulusan Konfigurasi Penutupan Aduan",
  path: "/BF-ADN/PK/KP/02/02",
});

const breadcrumb = ref([
  { name: "Pengurusan SLA", type: "link", path: "/BF-ADN/SLA" },
  { name: "Senarai Permohonan Kelulusan", type: "link", path: "/BF-ADN/PK/KP/02/01" },
  { name: "Kelulusan Konfigurasi Penutupan Aduan", type: "current" },
]);

const catatan = ref("");
const showModal = ref(false);
const modalMessage = ref("");
const pendingAction = ref(null);

const confirmAction = (action) => {
  pendingAction.value = action;
  if (action === "lulus") {
    modalMessage.value = "Adakah anda pasti untuk meluluskan permohonan ini?";
  } else {
    modalMessage.value = "Adakah anda pasti untuk menolak permohonan ini?";
  }
  showModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
  pendingAction.value = null;
};

const proceedAction = () => {
  if (pendingAction.value === "lulus") {
    alert("Status telah dikemaskini kepada: Diluluskan ✅");
  } else if (pendingAction.value === "tolak") {
    alert("Status telah dikemaskini kepada: Ditolak ❌");
  }
  closeModal();
};
</script>
