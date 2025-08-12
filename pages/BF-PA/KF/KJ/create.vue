<!-- 
  RTMF SCREEN: PA-KF-KJ-01_04 (Create Category Form)
  PURPOSE: Tambah maklumat kategori penolong amil baharu
  DESCRIPTION: Create form for new Penolong Amil category (Eksekutif only)
  ROUTE: /BF-PA/KF/KJ/create
-->
<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />

    <!-- Enhanced Header Section -->
    <div class="mb-6">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold text-gray-900 flex items-center">
            <Icon name="ph:plus-circle" class="w-6 h-6 mr-3 text-primary" />
            Tambah Kategori Penolong Amil Baharu
          </h1>
          <p class="text-gray-600 mt-1">Tambah maklumat kategori penolong amil baharu</p>
        </div>
        <div class="flex gap-2">
          <rs-button
            variant="secondary-outline"
            @click="navigateTo('/BF-PA/KF/KJ')"
            class="flex items-center"
          >
            <Icon name="ph:arrow-left" class="w-4 h-4 mr-2" />
            Batal
          </rs-button>
        </div>
      </div>
    </div>

    <!-- Form -->
    <FormKit
      type="form"
      id="createCategoryForm"
      :actions="false"
      @submit="handleSubmit"
    >
      <!-- Maklumat Kategori Section -->
      <rs-card class="mb-6">
        <template #header>
          <h3 class="text-lg font-semibold text-gray-900 flex items-center">
            <Icon name="ph:info-fill" class="w-5 h-5 mr-2" />
            Maklumat Kategori
          </h3>
        </template>
        <template #body>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormKit
              type="text"
              name="kategoriPenolongAmil"
              label="Kategori Penolong Amil"
              placeholder="Contoh: Penolong Amil Wakaf"
              validation="required"
              :validation-messages="{
                required: 'Kategori penolong amil diperlukan',
              }"
            />
            <FormKit
              type="text"
              name="kodSingkatan"
              label="Kod Singkatan"
              placeholder="Contoh: PAW"
              validation="required"
              :validation-messages="{
                required: 'Kod singkatan diperlukan',
              }"
            />
            <FormKit
              type="select"
              name="jenisKategori"
              label="Jenis Kategori"
              :options="[
                { label: 'Custom', value: 'Custom' },
                { label: 'Default', value: 'Default' },
              ]"
              validation="required"
              :validation-messages="{
                required: 'Jenis kategori diperlukan',
              }"
            />
            <FormKit
              type="select"
              name="status"
              label="Status"
              :options="[
                { label: 'Aktif', value: 'Aktif' },
                { label: 'Tidak Aktif', value: 'Tidak Aktif' },
              ]"
              validation="required"
              :validation-messages="{
                required: 'Status diperlukan',
              }"
            />
            <FormKit
              type="date"
              name="tarikhKuatkuasa"
              label="Tarikh Kuatkuasa"
              validation="required"
              :validation-messages="{
                required: 'Tarikh kuatkuasa diperlukan',
              }"
            />
            <FormKit
              type="textarea"
              name="penerangan"
              label="Penerangan Kategori"
              placeholder="Huraian ringkas tentang kategori ini..."
              rows="3"
            />
          </div>
        </template>
      </rs-card>

      <!-- Maklumat Jawatan Section -->
      <rs-card class="mb-6">
        <template #header>
          <h3 class="text-lg font-semibold text-gray-900 flex items-center">
            <Icon name="ph:briefcase" class="w-5 h-5 mr-2" />
            Maklumat Jawatan
          </h3>
        </template>
        <template #body>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormKit
              type="text"
              name="namaJawatan"
              label="Nama Jawatan"
              placeholder="Contoh: Penolong Amil Wakaf"
              validation="required"
              :validation-messages="{
                required: 'Nama jawatan diperlukan',
              }"
            />
            <FormKit
              type="text"
              name="kodJawatan"
              label="Kod Jawatan"
              placeholder="Contoh: PAW001"
              validation="required"
              :validation-messages="{
                required: 'Kod jawatan diperlukan',
              }"
            />
            <FormKit
              type="select"
              name="statusJawatan"
              label="Status Jawatan"
              :options="[
                { label: 'Aktif', value: 'Aktif' },
                { label: 'Tidak Aktif', value: 'Tidak Aktif' },
              ]"
              validation="required"
              :validation-messages="{
                required: 'Status jawatan diperlukan',
              }"
            />
            <FormKit
              type="date"
              name="tarikhKuatkuasaJawatan"
              label="Tarikh Kuatkuasa Jawatan"
              validation="required"
              :validation-messages="{
                required: 'Tarikh kuatkuasa jawatan diperlukan',
              }"
            />
            <FormKit
              type="textarea"
              name="tanggungjawab"
              label="Tanggungjawab Jawatan"
              placeholder="Senaraikan tanggungjawab utama..."
              rows="3"
              validation="required"
              :validation-messages="{
                required: 'Tanggungjawab jawatan diperlukan',
              }"
            />
            <FormKit
              type="textarea"
              name="kelayakan"
              label="Kelayakan Minimum"
              placeholder="Syarat kelayakan minimum..."
              rows="3"
              validation="required"
              :validation-messages="{
                required: 'Kelayakan minimum diperlukan',
              }"
            />
          </div>
        </template>
      </rs-card>

      <!-- Maklumat Elaun Section -->
      <rs-card class="mb-6">
        <template #header>
          <h3 class="text-lg font-semibold text-gray-900 flex items-center">
            <Icon name="ph:money" class="w-5 h-5 mr-2" />
            Maklumat Elaun
          </h3>
        </template>
        <template #body>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormKit
              type="select"
              name="jenisElaun"
              label="Jenis Elaun"
              :options="[
                { label: 'Elaun Bulanan', value: 'Elaun Bulanan' },
                { label: 'Elaun Tahunan', value: 'Elaun Tahunan' },
                { label: 'Elaun Khas', value: 'Elaun Khas' },
                { label: 'Elaun Perjalanan', value: 'Elaun Perjalanan' },
              ]"
              validation="required"
              :validation-messages="{
                required: 'Jenis elaun diperlukan',
              }"
            />
            <FormKit
              type="number"
              name="amaun"
              label="Amaun (RM)"
              placeholder="0.00"
              validation="required|number"
              :validation-messages="{
                required: 'Amaun diperlukan',
                number: 'Amaun mestilah nombor',
              }"
            />
            <FormKit
              type="text"
              name="kodBajet"
              label="Kod Bajet"
              placeholder="Contoh: B001"
              validation="required"
              :validation-messages="{
                required: 'Kod bajet diperlukan',
              }"
            />
            <FormKit
              type="select"
              name="statusElaun"
              label="Status Elaun"
              :options="[
                { label: 'Aktif', value: 'Aktif' },
                { label: 'Tidak Aktif', value: 'Tidak Aktif' },
              ]"
              validation="required"
              :validation-messages="{
                required: 'Status elaun diperlukan',
              }"
            />
            <FormKit
              type="textarea"
              name="catatanElaun"
              label="Catatan Elaun"
              placeholder="Maklumat tambahan tentang elaun..."
              rows="2"
            />
          </div>
        </template>
      </rs-card>

      <!-- Maklumat Tambahan Section -->
      <rs-card class="mb-6">
        <template #header>
          <h3 class="text-lg font-semibold text-gray-900 flex items-center">
            <Icon name="ph:gear" class="w-5 h-5 mr-2" />
            Maklumat Tambahan
          </h3>
        </template>
        <template #body>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormKit
              type="number"
              name="tempohPerkhidmatan"
              label="Tempoh Perkhidmatan (Bulan)"
              placeholder="12"
              validation="required|number"
              :validation-messages="{
                required: 'Tempoh perkhidmatan diperlukan',
                number: 'Tempoh mestilah nombor',
              }"
            />
            <FormKit
              type="select"
              name="tahapKesukaran"
              label="Tahap Kesukaran"
              :options="[
                { label: 'Mudah', value: 'Mudah' },
                { label: 'Sederhana', value: 'Sederhana' },
                { label: 'Sukar', value: 'Sukar' },
                { label: 'Sangat Sukar', value: 'Sangat Sukar' },
              ]"
              validation="required"
              :validation-messages="{
                required: 'Tahap kesukaran diperlukan',
              }"
            />
            <FormKit
              type="textarea"
              name="catatanTambahan"
              label="Catatan Tambahan"
              placeholder="Maklumat lain yang berkaitan..."
              rows="3"
            />
          </div>
        </template>
      </rs-card>

      <!-- Submit Buttons -->
      <div class="flex justify-end gap-3">
        <rs-button
          variant="secondary-outline"
          @click="navigateTo('/BF-PA/KF/KJ')"
        >
          Batal
        </rs-button>
        <rs-button
          variant="primary"
          type="submit"
          :loading="isSubmitting"
        >
          <Icon name="ph:check" class="w-4 h-4 mr-2" />
          Tambah Kategori
        </rs-button>
      </div>
    </FormKit>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";

const route = useRoute();

definePageMeta({
  title: "Tambah Kategori Penolong Amil",
});

// Role-based access control
onMounted(() => {
  const currentUserRole = "eksekutif"; // This would come from auth system
  if (currentUserRole !== "eksekutif") {
    alert("Anda tidak mempunyai kebenaran untuk menambah kategori");
    navigateTo('/BF-PA/KF/KJ');
  }
});

const breadcrumb = ref([
  {
    title: "Utama",
    path: "/"
  },
  {
    title: "BF-PA",
    path: "/BF-PA"
  },
  {
    title: "Konfigurasi",
    path: "/BF-PA/KF/KJ"
  },
  {
    title: "Tambah Kategori",
    path: "/BF-PA/KF/KJ/create"
  }
]);

// Form state
const isSubmitting = ref(false);

const handleSubmit = async (formData) => {
  isSubmitting.value = true;
  
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Enhanced approval workflow
    const approvalStatus = "Menunggu Pengesahan";
    const approvalMessage = `Kategori penolong amil berjaya ditambah dengan status: ${approvalStatus}. 
    Permintaan akan dihantar kepada Ketua Jabatan untuk pengesahan.`;
    
    // Show success message with approval workflow
    alert(approvalMessage);
    
    // Navigate back to list
    navigateTo('/BF-PA/KF/KJ');
  } catch (error) {
    console.error('Error creating category:', error);
    alert("Ralat semasa menambah kategori");
  } finally {
    isSubmitting.value = false;
  }
};
</script> 