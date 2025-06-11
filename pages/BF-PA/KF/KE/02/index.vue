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
            Sila semak maklumat kadar elaun yang dimasukkan:
          </p>

          <!-- Review Form -->
          <FormKit
            type="form"
            id="reviewForm"
            @submit="handleSubmit"
            :actions="false"
          >
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <!-- Kategori Amil -->
              <FormKit
                type="select"
                name="kategoriAmil"
                label="Kategori Amil"
                placeholder="Pilih kategori amil"
                :options="[
                  { label: 'Fitrah', value: 'FITRAH' },
                  { label: 'Padi', value: 'PADI' },
                  { label: 'Kariah', value: 'KARIAH' },
                  { label: 'Komuniti', value: 'KOMUNITI' },
                ]"
                :disabled="true"
                :value="formData.kategoriAmil"
              />

              <!-- Jawatan -->
              <FormKit
                type="text"
                name="jawatan"
                label="Jawatan"
                :disabled="true"
                :value="formData.jawatan"
              />

              <!-- Jenis Aktiviti -->
              <FormKit
                type="select"
                name="jenisAktiviti"
                label="Jenis Aktiviti"
                :options="[
                  { label: 'Mesyuarat', value: 'MESYUARAT' },
                  { label: 'Program Luar', value: 'PROGRAM_LUAR' },
                  { label: 'Bancian', value: 'BANCIAN' },
                  { label: 'Aktiviti Rasmi Lain', value: 'AKTIVITI_RASMI' },
                ]"
                :disabled="true"
                :value="formData.jenisAktiviti"
              />

              <!-- Kadar Elaun -->
              <FormKit
                type="number"
                name="kadarElaun"
                label="Kadar Elaun (RM)"
                :disabled="true"
                :value="formData.kadarElaun"
              />
            </div>

            <!-- Action Buttons -->
            <div class="mt-6 flex justify-end space-x-3">
              <rs-button
                variant="danger"
                :loading="isRejecting"
                @click="handleReject"
              >
                Tolak
              </rs-button>
              <rs-button
                variant="success"
                :loading="isApproving"
                @click="handleApprove"
              >
                Diluluskan
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
          @submit="submitRejection"
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
              type="submit"
              variant="danger"
              :loading="isRejecting"
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
  description: "Semakan dan kelulusan kadar elaun Penolong Amil",
});

const breadcrumb = ref([
  {
    name: "Konfigurasi",
    type: "link",
    path: "/BF-PA/KF",
  },
  {
    name: "Elaun",
    type: "link",
    path: "/BF-PA/KF/KE",
  },
  {
    name: "Semakan Dan Kelulusan",
    type: "current",
    path: "/BF-PA/KF/KE/02",
  },
]);

// Form data (would be populated from API/store in real app)
const formData = ref({
  kategoriAmil: "FITRAH",
  jawatan: "Penolong Amil Fitrah",
  jenisAktiviti: "MESYUARAT",
  kadarElaun: 50.00,
});

// Modal and loading states
const showRejectModal = ref(false);
const isApproving = ref(false);
const isRejecting = ref(false);

// Handle approval
const handleApprove = async () => {
  try {
    isApproving.value = true;
    
    // Mock API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    // Show success message
    alert("Konfigurasi elaun telah diluluskan");
    
    // Navigate back to list or next page
    navigateTo("/BF-PA/KF/KE");
  } catch (error) {
    console.error("Error approving:", error);
    alert("Ralat semasa meluluskan konfigurasi. Sila cuba lagi.");
  } finally {
    isApproving.value = false;
  }
};

// Handle rejection
const handleReject = () => {
  showRejectModal.value = true;
};

// Submit rejection
const submitRejection = async (formData) => {
  try {
    isRejecting.value = true;
    
    // Mock API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    // Show success message
    alert("Konfigurasi elaun telah ditolak");
    
    // Close modal and navigate
    showRejectModal.value = false;
    navigateTo("/BF-PA/KF/KE");
  } catch (error) {
    console.error("Error rejecting:", error);
    alert("Ralat semasa menolak konfigurasi. Sila cuba lagi.");
  } finally {
    isRejecting.value = false;
  }
};
</script> 