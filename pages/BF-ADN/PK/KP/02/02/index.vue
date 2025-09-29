<template>
  <div>
    <!-- Breadcrumb + Kembali -->
    <div class="flex justify-between items-center mb-6">
      <LayoutsBreadcrumb :items="breadcrumb" />
      <NuxtLink to="/BF-ADN/PK/KP/02/01">
        <rs-button variant="secondary" size="sm">Kembali</rs-button>
      </NuxtLink>
    </div>

    <!-- Title -->
    <h2 class="text-xl font-bold mb-6">Semakan & Kelulusan Penutupan Aduan</h2>

    <!-- Main Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <!-- Left Column: Tindakan -->
      <rs-card>
        <template #header>Tindakan</template>
        <template #body>
          <div class="space-y-4">
            <div>
              <label class="block mb-2 font-medium">Ulasan Pelulus</label>
              <textarea
                v-model="catatan"
                placeholder="Masukkan catatan..."
                class="w-full border rounded px-3 py-2"
                rows="3"
              ></textarea>
            </div>
            <div class="flex gap-3 justify-end">
              <rs-button variant="success" @click="confirmAction('lulus')">
                Luluskan
              </rs-button>
              <rs-button variant="danger" @click="confirmAction('tolak')">
                Tolak Permohonan
              </rs-button>
            </div>
          </div>
        </template>
      </rs-card>

      <!-- Right Column: Konfigurasi + Permohonan stacked -->
      <div class="flex flex-col gap-6">
        <!-- Konfigurasi Semasa -->
        <rs-card>
          <template #header>Butiran Konfigurasi Semasa</template>
          <template #body>
            <p><b>Sebab Penutupan:</b> Bantuan telah diterima daripada agensi lain</p>
            <p><b>Tarikh Mula Kuasa:</b> 10/05/2025</p>
            <p>
              <b>Status Konfigurasi:</b>
              <rs-badge variant="success" size="sm">Aktif</rs-badge>
            </p>
          </template>
        </rs-card>

        <!-- Permohonan Baharu -->
        <rs-card>
          <template #header>Butiran Permohonan Baharu</template>
          <template #body>
            <div class="space-y-2">
              <p><b>Sebab Penutupan (Baharu):</b> Bantuan telah diterima daripada agensi lain</p>
              <p><b>Tarikh Mula Kuasa:</b> 25/10/2025</p>
              <p>
                <b>Status Konfigurasi:</b>
                <rs-badge variant="success" size="sm">Aktif</rs-badge>
              </p>
              <p>
                <b>Catatan Permohonan:</b> Konfigurasi tambahan untuk menyokong standardisasi proses penutupan aduan.
              </p>
              <p><b>Tarikh Permohonan:</b> 15/09/2025</p>
              <p><b>Dikemukakan Oleh:</b> Siti Norlia</p>
            </div>
          </template>
        </rs-card>
      </div>
    </div>

    <!-- Confirmation Modal -->
    <div
      v-if="showModal"
      class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
    >
      <div class="bg-white rounded-lg p-6 w-full max-w-md shadow-lg">
        <h3 class="text-lg font-semibold mb-4">Pengesahan</h3>
        <p class="mb-6">{{ modalMessage }}</p>
        <div class="flex justify-end gap-3">
          <rs-button variant="secondary" @click="closeModal">Batal</rs-button>
          <rs-button variant="primary" @click="proceedAction">Ya, teruskan</rs-button>
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
  modalMessage.value =
    action === "lulus"
      ? "Adakah anda pasti untuk meluluskan permohonan ini?"
      : "Adakah anda pasti untuk menolak permohonan ini?";
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
