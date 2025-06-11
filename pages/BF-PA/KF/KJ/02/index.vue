<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />

    <rs-card class="mt-4">
      <template #header>
        <div class="flex justify-between items-center">
          <h2 class="text-xl font-semibold">
            Semakan Dan Kelulusan
          </h2>
        </div>
      </template>

      <template #body>
        <div class="p-4">
          <p class="mb-4 text-gray-700">
            Sila semak maklumat jawatan yang dimasukkan:
          </p>

          <!-- Review Form -->
          <FormKit
            type="form"
            id="reviewForm"
            :actions="false"
          >
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <!-- Nama Jawatan -->
              <FormKit
                type="text"
                name="namaJawatan"
                label="Nama Jawatan"
                :disabled="true"
                :value="formData.namaJawatan"
              />

              <!-- Kategori Amil -->
              <FormKit
                type="select"
                name="kategoriAmil"
                label="Kategori Amil"
                :options="[
                  { label: 'Fitrah', value: 'FITRAH' },
                  { label: 'Padi', value: 'PADI' },
                  { label: 'Kariah', value: 'KARIAH' },
                  { label: 'Komuniti', value: 'KOMUNITI' },
                ]"
                :disabled="true"
                :value="formData.kategoriAmil"
              />

              <!-- Status -->
              <FormKit
                type="select"
                name="status"
                label="Status"
                :options="[
                  { label: 'Aktif', value: 'AKTIF' },
                  { label: 'Tidak Aktif', value: 'TIDAK_AKTIF' },
                ]"
                :disabled="true"
                :value="formData.status"
              />

              <!-- Tempoh Perkhidmatan -->
              <FormKit
                type="date"
                name="tempohPerkhidmatan"
                label="Tempoh Perkhidmatan"
                :disabled="true"
                :value="formData.tempohPerkhidmatan"
              />
            </div>

            <!-- Action Buttons -->
            <div class="mt-6 flex justify-end space-x-3">
              <rs-button
                variant="danger"
                @click="handleReject"
              >
                Tolak
              </rs-button>
              <rs-button
                variant="success"
                @click="handleApprove"
              >
                Lulus
              </rs-button>
            </div>
          </FormKit>
        </div>
      </template>
    </rs-card>

    <!-- Rejection Modal -->
    <rs-modal
      v-model="showRejectModal"
      title="Tolak Konfigurasi"
      size="md"
    >
      <template #body>
        <FormKit
          type="form"
          :actions="false"
        >
          <FormKit
            type="textarea"
            name="rejectionReason"
            label="Sebab Penolakan"
            validation="required"
            :validation-messages="{
              required: 'Sila masukkan sebab penolakan',
            }"
          />
          <div class="mt-4 flex justify-end space-x-3">
            <rs-button
              variant="secondary"
              @click="showRejectModal = false"
            >
              Batal
            </rs-button>
            <rs-button
              variant="danger"
              @click="submitRejection"
            >
              Hantar
            </rs-button>
          </div>
        </FormKit>
      </template>
    </rs-modal>
  </div>
</template>

<script setup>
import { ref } from "vue";

definePageMeta({
  title: "Semakan Dan Kelulusan",
  description: "Semakan dan kelulusan maklumat jawatan",
});

const breadcrumb = ref([
  {
    name: "Konfigurasi",
    type: "link",
    path: "/BF-PA/KF/KJ/01",
  },
  {
    name: "Jawatan",
    type: "link",
    path: "/BF-PA/KF/KJ/01",
  },
  {
    name: "Semakan Dan Kelulusan",
    type: "current",
    path: "/BF-PA/KF/KJ/02",
  },
]);

// Form data (would be populated from API/store in real app)
const formData = ref({
  namaJawatan: "Ketua Penolong Amil Komuniti",
  kategoriAmil: "KOMUNITI",
  status: "AKTIF",
  tempohPerkhidmatan: "2025-05-13",
});

// Modal state
const showRejectModal = ref(false);

// Handle approval
const handleApprove = () => {
  alert("Konfigurasi jawatan tersebut telah diluluskan");
  navigateTo("/BF-PA/KF/KJ/01");
};

// Handle rejection
const handleReject = () => {
  showRejectModal.value = true;
};

// Submit rejection
const submitRejection = () => {
  alert("Konfigurasi jawatan tersebut telah ditolak");
  showRejectModal.value = false;
  navigateTo("/BF-PA/KF/KJ/01");
};
</script> 