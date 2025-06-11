<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />

    <rs-card class="mt-4">
      <template #header>
        <div class="flex justify-between items-center">
          <h2 class="text-xl font-semibold">Sahkan Pemulangan Tunai (PT-06)</h2>
          <rs-badge variant="warning">Tunai Dipulangkan</rs-badge>
        </div>
      </template>

      <template #body>
        <FormKit
          type="form"
          :actions="false"
          @submit="handleSubmit"
          v-model="formData"
        >
          <!-- Header Info Section -->
          <div class="space-y-6">
            <h3 class="text-lg font-medium">Maklumat Permohonan</h3>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormKit
                type="text"
                name="idPermohonan"
                label="ID Permohonan Pemulangan Tunai"
                :disabled="true"
              />

              <FormKit
                type="text"
                name="namaPIC"
                label="Nama PIC Peti Besi"
                :disabled="true"
              />

              <FormKit
                type="text"
                name="jumlahTunai"
                label="Jumlah Tunai Dipulangkan (RM)"
                :disabled="true"
              />

              <FormKit
                type="text"
                name="tarikhMasaPemulangan"
                label="Tarikh & Masa Pemulangan Fizikal"
                :disabled="true"
              />

              <FormKit
                type="textarea"
                name="catatanPemulangan"
                label="Catatan Pemulangan (jika ada)"
                :disabled="true"
                class="md:col-span-2"
              />
            </div>
          </div>

          <!-- Confirmation Section -->
          <div class="space-y-6 mt-8">
            <h3 class="text-lg font-medium">Pengesahan</h3>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormKit
                type="radio"
                name="statusPengesahan"
                :options="[
                  { label: 'Disahkan', value: 'confirmed' },
                  { label: 'Tidak Disahkan', value: 'rejected' }
                ]"
                validation="required"
              />

              <FormKit
                type="text"
                name="tarikhMasaPengesahan"
                label="Tarikh & Masa Pengesahan"
                :disabled="true"
              />

              <FormKit
                type="textarea"
                name="catatanPengesahan"
                label="Catatan Pengesahan (jika ada)"
                placeholder="Masukkan catatan pengesahan..."
                class="md:col-span-2"
              />
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="flex justify-end gap-2 mt-8">
            <rs-button
              variant="secondary"
              @click="navigateBack"
            >
              Kembali ke Senarai
            </rs-button>
            <rs-button
              type="submit"
              variant="primary"
              :loading="isSubmitting"
              @click="showConfirmationModal = true"
            >
              Simpan Pengesahan
            </rs-button>
          </div>
        </FormKit>
      </template>
    </rs-card>

    <!-- Confirmation Modal -->
    <rs-modal
      v-model="showConfirmationModal"
      title="Pengesahan Pemulangan Tunai"
      size="md"
      position="center"
    >
      <template #body>
        <div class="space-y-4">
          <div class="text-center">
            <Icon
              name="ph:warning-circle"
              class="mx-auto text-warning"
              size="3rem"
            />
            <h3 class="mt-4 text-lg font-medium text-gray-900">
              Sahkan Pemulangan Tunai
            </h3>
            <p class="mt-2 text-sm text-gray-500">
              Adakah anda pasti untuk mengesahkan pemulangan tunai ini?
            </p>
          </div>
          
          <div class="bg-gray-50 p-4 rounded-lg space-y-2">
            <div class="flex justify-between">
              <span class="font-medium">ID Permohonan:</span>
              <span>{{ formData.idPermohonan }}</span>
            </div>
            <div class="flex justify-between">
              <span class="font-medium">Nama PIC:</span>
              <span>{{ formData.namaPIC }}</span>
            </div>
            <div class="flex justify-between">
              <span class="font-medium">Jumlah Tunai:</span>
              <span>RM {{ formData.jumlahTunai }}</span>
            </div>
            <div class="flex justify-between">
              <span class="font-medium">Status Pengesahan:</span>
              <span>{{ formData.statusPengesahan === 'confirmed' ? 'Disahkan' : 'Tidak Disahkan' }}</span>
            </div>
          </div>
        </div>
      </template>

      <template #footer>
        <div class="flex justify-end gap-3">
          <rs-button
            variant="primary-outline"
            @click="showConfirmationModal = false"
            :disabled="isSubmitting"
          >
            Batal
          </rs-button>
          <rs-button
            variant="primary"
            @click="handleSubmit"
            :loading="isSubmitting"
          >
            Sahkan
          </rs-button>
        </div>
      </template>
    </rs-modal>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";

definePageMeta({
  title: "Sahkan Pemulangan Tunai",
  description: "Form pengesahan pemulangan tunai",
});

const route = useRoute();
const router = useRouter();

// Breadcrumb
const breadcrumb = ref([
  {
    name: "Pemulangan Tunai",
    type: "link",
    path: "/BF-TNI/pemulangan-tunai",
  },
  {
    name: "Senarai Sahkan",
    type: "link",
    path: "/BF-TNI/pemulangan-tunai/senarai-sah",
  },
  {
    name: "Sahkan Pemulangan",
    type: "current",
    path: route.path,
  },
]);

// Form state
const isSubmitting = ref(false);
const showConfirmationModal = ref(false);
const formData = ref({
  idPermohonan: "",
  namaPIC: "",
  jumlahTunai: "",
  tarikhMasaPemulangan: "",
  catatanPemulangan: "",
  statusPengesahan: "",
  tarikhMasaPengesahan: "",
  catatanPengesahan: ""
});

// Methods
const fetchApplicationData = async () => {
  try {
    // TODO: Implement API call to fetch application data
    // For now, using mock data
    formData.value = {
      idPermohonan: route.params.id,
      namaPIC: "John Doe", // This should come from logged-in user
      jumlahTunai: "5,000.00",
      tarikhMasaPemulangan: "20 Mac 2024, 10:30 AM",
      catatanPemulangan: "Pemulangan tunai telah dibuat",
      statusPengesahan: "",
      tarikhMasaPengesahan: new Date().toLocaleString("ms-MY"),
      catatanPengesahan: ""
    };
  } catch (error) {
    console.error("Error fetching application data:", error);
  }
};

const handleSubmit = async () => {
  isSubmitting.value = true;
  try {
    // TODO: Implement API call to save confirmation
    console.log("Saving confirmation:", formData.value);
    
    // Close modal and navigate back to list on success
    showConfirmationModal.value = false;
    router.push("/BF-TNI/pemulangan-tunai/senarai-sah");
  } catch (error) {
    console.error("Error saving confirmation:", error);
  } finally {
    isSubmitting.value = false;
  }
};

const navigateBack = () => {
  router.push("/BF-TNI/pemulangan-tunai/senarai-sah");
};

// Lifecycle hooks
onMounted(() => {
  fetchApplicationData();
});
</script>

<style lang="scss" scoped>
// Add any custom styles here if needed
</style> 