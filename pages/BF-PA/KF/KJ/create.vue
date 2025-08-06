<!-- 
  RTMF SCREEN: PA-KF-KJ-01_04 (Create Form)
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
              placeholder="Contoh: Penolong Amil Fitrah"
              validation="required"
              :validation-messages="{
                required: 'Kategori penolong amil diperlukan',
              }"
            />
            <FormKit
              type="text"
              name="kodSingkatan"
              label="Kod Singkatan"
              placeholder="Contoh: PAF"
              validation="required"
              :validation-messages="{
                required: 'Kod singkatan diperlukan',
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
              placeholder="Contoh: Penolong Amil Fitrah"
              validation="required"
              :validation-messages="{
                required: 'Nama jawatan diperlukan',
              }"
            />
            <FormKit
              type="text"
              name="kodJawatan"
              label="Kod Jawatan"
              placeholder="Contoh: PAF001"
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
          </div>
        </template>
      </rs-card>

      <!-- Maklumat Sesi Section -->
      <rs-card class="mb-6">
        <template #header>
          <h3 class="text-lg font-semibold text-gray-900 flex items-center">
            <Icon name="ph:calendar" class="w-5 h-5 mr-2" />
            Maklumat Sesi
          </h3>
        </template>
        <template #body>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormKit
              type="text"
              name="sesi"
              label="Sesi"
              placeholder="Contoh: Sesi 1 - 2024"
              validation="required"
              :validation-messages="{
                required: 'Sesi diperlukan',
              }"
            />
            <FormKit
              type="select"
              name="statusSesi"
              label="Status Sesi"
              :options="[
                { label: 'Aktif', value: 'Aktif' },
                { label: 'Tidak Aktif', value: 'Tidak Aktif' },
              ]"
              validation="required"
              :validation-messages="{
                required: 'Status sesi diperlukan',
              }"
            />
            <FormKit
              type="date"
              name="tarikhMula"
              label="Tarikh Mula"
              validation="required"
              :validation-messages="{
                required: 'Tarikh mula diperlukan',
              }"
            />
            <FormKit
              type="date"
              name="tarikhTamat"
              label="Tarikh Tamat"
              validation="required"
              :validation-messages="{
                required: 'Tarikh tamat diperlukan',
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
  if (currentUserRole !== "pt" && currentUserRole !== "eksekutif") {
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
    const approvalStatus = "Menunggu Kelulusan";
    const approvalMessage = `Kategori penolong amil berjaya ditambah dengan status: ${approvalStatus}. 
    Permintaan akan dihantar kepada Ketua Jabatan untuk kelulusan.`;
    
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