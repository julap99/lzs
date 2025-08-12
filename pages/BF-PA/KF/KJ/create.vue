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
              name="status"
              label="Status"
              :options="[
                { label: 'Menunggu Pengesahan', value: 'Menunggu Pengesahan' },
              ]"
              validation="required"
              :validation-messages="{
                required: 'Status diperlukan',
              }"
              readonly
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

      <!-- Submit Buttons -->
      <div class="flex justify-end gap-3">
        <rs-button
          variant="secondary-outline"
          @click="navigateTo('/BF-PA/KF/KJ')"
        >
          Kembali
        </rs-button>
        <rs-button
          variant="primary"
          type="submit"
          :loading="isSubmitting"
        >
          <Icon name="ph:check" class="w-4 h-4 mr-2" />
          Simpan
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
    name: "Utama",
    type: "link",
    path: "/"
  },
  {
    name: "BF-PA",
    type: "link",
    path: "/BF-PA"
  },
  {
    name: "Konfigurasi",
    type: "link",
    path: "/BF-PA/KF/KJ"
  },
  {
    name: "Tambah Kategori",
    type: "current",
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
    const approvalMessage = `Maklumat kategori penolong amil berjaya ditambah dengan status: ${approvalStatus}. 
    Permintaan akan dihantar kepada Ketua Jabatan untuk pengesahan. 
    Maklumat lanjut boleh dikemaskini selepas pengesahan.`;
    
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