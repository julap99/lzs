<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />

    <rs-card class="mt-4">
      <template #header>
        <div class="flex justify-between items-center">
          <h2 class="text-xl font-semibold">Borang Kemaskini Tabung</h2>
        </div>
      </template>

      <template #body>
        <FormKit
          type="form"
          @submit="handleSubmit"
          :actions="false"
          class="max-w-2xl mx-auto"
          v-model="formData"
        >
          <div class="grid grid-cols-1 gap-4">
            <!-- Nama Akaun -->
            <FormKit
              type="text"
              name="namaAkaun"
              label="Nama Akaun"
              placeholder="Masukkan nama akaun tabung"
              validation="required"
              :validation-messages="{
                required: 'Nama akaun adalah wajib',
              }"
            />

            <!-- Jenis Akaun -->
            <FormKit
              type="select"
              name="jenisAkaun"
              label="Jenis Akaun"
              placeholder="Pilih jenis akaun"
              validation="required"
              :validation-messages="{
                required: 'Jenis akaun adalah wajib',
              }"
              :options="[
                { label: 'Cawangan', value: 'Cawangan' },
                { label: 'Amil', value: 'Amil' },
                { label: 'Operasi Daerah', value: 'Operasi Daerah' },
                { label: 'Baitul', value: 'Baitul' },
              ]"
            />

            <!-- Nilai Asas -->
            <FormKit
              type="number"
              name="nilaiAsas"
              label="Nilai Asas (RM)"
              placeholder="Masukkan nilai asas"
              validation="required|min:0"
              :validation-messages="{
                required: 'Nilai asas adalah wajib',
                min: 'Nilai asas mesti lebih besar daripada 0',
              }"
              step="0.01"
              min="0"
            />

            <!-- Had Minimum Baki -->
            <FormKit
              type="number"
              name="hadMinimumBaki"
              label="Had Minimum Baki (RM)"
              placeholder="Masukkan had minimum baki"
              validation="required|min:0"
              :validation-messages="{
                required: 'Had minimum baki adalah wajib',
                min: 'Had minimum baki mesti lebih besar daripada 0',
              }"
              step="0.01"
              min="0"
            />

            <!-- Kaedah Pemindahan -->
            <FormKit
              type="select"
              name="kaedahPemindahan"
              label="Kaedah Pemindahan"
              placeholder="Pilih kaedah pemindahan"
              validation="required"
              :validation-messages="{
                required: 'Kaedah pemindahan adalah wajib',
              }"
              :options="[
                { label: 'Tunai', value: 'Tunai' },
                { label: 'eWallet', value: 'eWallet' },
              ]"
            />
          </div>

          <!-- Form Actions -->
          <div class="flex justify-end gap-4 mt-6">
            <rs-button variant="secondary" @click="handleCancel">
              Batal
            </rs-button>
            <rs-button type="submit" variant="primary" :loading="isSubmitting">
              Simpan
            </rs-button>
          </div>
        </FormKit>
      </template>
    </rs-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";

definePageMeta({
  title: "Borang Kemaskini Tabung",
  description: "Kemaskini maklumat tabung sedia ada",
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
    name: "Kemaskini Tabung",
    type: "current",
    path: `/BF-TNI/peti-besi/konfigurasi/kemaskini/${route.params.id}`,
  },
]);

const formData = ref({
  namaAkaun: "",
  jenisAkaun: "",
  nilaiAsas: "",
  hadMinimumBaki: "",
  kaedahPemindahan: "",
});

// Load existing data when component mounts
onMounted(async () => {
  try {
    // Mock data based on ID - replace with actual API call
    const mockData = {
      namaAkaun: "Tabung Utama",
      jenisAkaun: "Cawangan",
      nilaiAsas: 10000,
      hadMinimumBaki: 5000,
      kaedahPemindahan: "Tunai",
    };
    
    // Pre-populate form with existing data
    formData.value = mockData;
    
    console.log("TNI-KO-PB-01_3: Borang Kemaskini Tabung - Data dipopulate berdasarkan ID:", route.params.id);
  } catch (error) {
    console.error("Error loading data:", error);
    alert("Ralat semasa memuatkan data");
  }
});

const handleSubmit = async (formData) => {
  try {
    isSubmitting.value = true;
    
    // Log tindakan ke console untuk mockup
    console.log("Form submitted:", formData);
    console.log("TNI-KO-PB-01_3: Borang Kemaskini Tabung - Perubahan berjaya disimpan");
    
    // Simpan perubahan ke local state/mock
    // In a real implementation, this would update the backend
    
    // Show success message
    alert("Tabung berjaya dikemaskini");
    
    // Navigate back to list page
    navigateTo("/BF-TNI/peti-besi/konfigurasi/senarai");
  } catch (error) {
    console.error("Error updating data:", error);
    alert("Ralat semasa mengemaskini data");
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