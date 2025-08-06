<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />

    <rs-card class="mt-4">
      <template #header>
        <div class="flex justify-between items-center">
          <h2 class="text-xl font-semibold">Ulasan KJ Selepas Sokongan</h2>
          <rs-badge variant="success">Sokong KJ</rs-badge>
        </div>
      </template>

      <template #body>
        <div class="space-y-6">
          <!-- Ringkasan Permohonan -->
          <div class="bg-gray-50 p-4 rounded-lg">
            <h3 class="text-lg font-semibold mb-4">Ringkasan Permohonan</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700">ID Permohonan</label>
                <p class="mt-1">{{ applicationData.id }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">Nama Tabung</label>
                <p class="mt-1">{{ applicationData.namaTabung }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">Pemohon</label>
                <p class="mt-1">{{ applicationData.pemohon }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">Tarikh Mohon</label>
                <p class="mt-1">{{ formatDate(applicationData.tarikhMohon) }}</p>
              </div>
            </div>
          </div>

          <!-- Butiran Tabung -->
          <div class="bg-gray-50 p-4 rounded-lg">
            <h3 class="text-lg font-semibold mb-4">Butiran Tabung</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700">Jenis Akaun</label>
                <p class="mt-1">{{ applicationData.jenisAkaun }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">Nilai Asas (RM)</label>
                <p class="mt-1">RM {{ formatNumber(applicationData.nilaiAsas) }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">Had Minimum Baki (RM)</label>
                <p class="mt-1">RM {{ formatNumber(applicationData.hadMinimumBaki) }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">Kaedah Pemindahan</label>
                <p class="mt-1">{{ applicationData.kaedahPemindahan }}</p>
              </div>
            </div>
          </div>

          <!-- Ulasan Tambahan -->
          <div class="bg-white border border-gray-200 p-4 rounded-lg">
            <h3 class="text-lg font-semibold mb-4">Ulasan Tambahan</h3>
            <FormKit
              type="form"
              @submit="handleSubmit"
              :actions="false"
              v-model="formData"
            >
              <FormKit
                type="textarea"
                name="catatanTambahan"
                label="Catatan Tambahan"
                placeholder="Masukkan ulasan atau catatan tambahan untuk permohonan ini..."
                validation="required"
                :validation-messages="{
                  required: 'Catatan tambahan adalah wajib',
                }"
                rows="6"
              />

              <div class="flex justify-end gap-4 mt-6">
                <rs-button variant="secondary" @click="handleCancel">
                  Batal
                </rs-button>
                <rs-button type="submit" variant="primary" :loading="isSubmitting">
                  Hantar
                </rs-button>
              </div>
            </FormKit>
          </div>
        </div>
      </template>
    </rs-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";

definePageMeta({
  title: "Ulasan KJ Selepas Sokongan",
  description: "Ketua Jabatan memberi ulasan tambahan selepas sokongan",
});

const route = useRoute();
const isSubmitting = ref(false);

const breadcrumb = ref([
  {
    name: "Tabung",
    type: "link",
    path: "/BF-TNI/peti-besi/konfigurasi/senarai",
  },
  {
    name: "Konfigurasi",
    type: "link",
    path: "/BF-TNI/peti-besi/konfigurasi/senarai",
  },
  {
    name: "Ulasan KJ",
    type: "current",
    path: `/BF-TNI/peti-besi/konfigurasi/ulasan/${route.params.id}`,
  },
]);

// Mock application data
const applicationData = ref({
  id: "TB-2024-001",
  tarikhMohon: "2024-03-20",
  namaTabung: "Tabung Bantuan Kecemasan",
  pemohon: "Ahmad bin Abdullah",
  jenisAkaun: "Bantuan",
  nilaiAsas: 50000,
  hadMinimumBaki: 10000,
  kaedahPemindahan: "Tunai",
});

const formData = ref({
  catatanTambahan: "",
});

onMounted(async () => {
  try {
    // Load application data based on ID
    console.log("TNI-KO-PB-02_3: Ulasan KJ Selepas Sokongan - Memuatkan data untuk ID:", route.params.id);
  } catch (error) {
    console.error("Error loading application data:", error);
  }
});

const formatDate = (date) => {
  return new Date(date).toLocaleDateString("ms-MY", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const formatNumber = (number) => {
  return new Intl.NumberFormat('ms-MY').format(number);
};

const handleSubmit = async (formData) => {
  try {
    isSubmitting.value = true;
    
    // Set status to "Sokong KJ"
    console.log("TNI-KO-PB-02_3: Ulasan KJ Selepas Sokongan - Status diset kepada 'Sokong KJ'");
    console.log("Catatan tambahan:", formData.catatanTambahan);
    
    // Show success message
    alert("Ulasan berjaya dihantar");
    
    // Navigate back to list
    navigateTo("/BF-TNI/peti-besi/konfigurasi/senarai");
  } catch (error) {
    console.error("Error submitting review:", error);
    alert("Ralat semasa menghantar ulasan");
  } finally {
    isSubmitting.value = false;
  }
};

const handleCancel = () => {
  navigateTo("/BF-TNI/peti-besi/konfigurasi/senarai");
};
</script>

<style lang="scss" scoped>
// Add any custom styles here if needed
</style> 