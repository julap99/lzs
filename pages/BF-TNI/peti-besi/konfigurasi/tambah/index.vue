<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />

    <rs-card class="mt-4">
      <template #header>
        <div class="flex justify-between items-center">
          <h2 class="text-xl font-semibold">Borang Tambah Tabung</h2>
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
              Hantar
            </rs-button>
          </div>
        </FormKit>
      </template>
    </rs-card>
  </div>
</template>

<script setup>
import { ref } from "vue";

definePageMeta({
  title: "Borang Tambah Tabung",
  description: "Tambah rekod tabung baru",
});

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
    name: "Tambah Tabung",
    type: "current",
    path: "/BF-TNI/peti-besi/konfigurasi/tambah",
  },
]);

const isSubmitting = ref(false);

const formData = ref({
  namaAkaun: "",
  jenisAkaun: "",
  nilaiAsas: "",
  hadMinimumBaki: "",
  kaedahPemindahan: "",
});

const handleSubmit = async (formData) => {
  try {
    isSubmitting.value = true;
    
    // Log tindakan ke console untuk mockup
    console.log("Form submitted:", formData);
    console.log("TNI-KO-PB-01_2: Borang Tambah Tabung - Data berjaya disimpan");
    
    // Show success message
    alert("Tabung berjaya ditambah");
    
    // Navigate back to list page
    navigateTo("/BF-TNI/peti-besi/konfigurasi/senarai");
  } catch (error) {
    console.error("Error submitting form:", error);
    alert("Ralat semasa menyimpan data");
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
