<!-- 
  RTMF SCREEN: PA-KF-KJ-01_03 (Edit Form)
  PURPOSE: Kemaskini maklumat kategori penolong amil
  DESCRIPTION: Edit form for existing Penolong Amil category (Eksekutif only)
  ROUTE: /BF-PA/KF/KJ/edit/[id]
-->
<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />

    <!-- Enhanced Header Section -->
    <div class="mb-6">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold text-gray-900 flex items-center">
            <Icon name="ph:pencil" class="w-6 h-6 mr-3 text-primary" />
            Kemaskini Kategori Penolong Amil
          </h1>
          <p class="text-gray-600 mt-1">Kemaskini maklumat kategori penolong amil</p>
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
      id="editCategoryForm"
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
              :value="formData.kategoriPenolongAmil"
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
              :value="formData.kodSingkatan"
              readonly
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
              :value="formData.status"
            />
            <FormKit
              type="date"
              name="tarikhKuatkuasa"
              label="Tarikh Kuatkuasa"
              validation="required"
              :validation-messages="{
                required: 'Tarikh kuatkuasa diperlukan',
              }"
              :value="formData.tarikhKuatkuasa"
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
              :value="formData.maklumatJawatan.namaJawatan"
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
              :value="formData.maklumatJawatan.kodJawatan"
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
              :value="formData.maklumatJawatan.status"
            />
            <FormKit
              type="date"
              name="tarikhKuatkuasaJawatan"
              label="Tarikh Kuatkuasa Jawatan"
              validation="required"
              :validation-messages="{
                required: 'Tarikh kuatkuasa jawatan diperlukan',
              }"
              :value="formData.maklumatJawatan.tarikhKuatkuasa"
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
              :value="formData.maklumatSesi.sesi"
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
              :value="formData.maklumatSesi.status"
            />
            <FormKit
              type="date"
              name="tarikhMula"
              label="Tarikh Mula"
              validation="required"
              :validation-messages="{
                required: 'Tarikh mula diperlukan',
              }"
              :value="formData.maklumatSesi.tarikhMula"
            />
            <FormKit
              type="date"
              name="tarikhTamat"
              label="Tarikh Tamat"
              validation="required"
              :validation-messages="{
                required: 'Tarikh tamat diperlukan',
              }"
              :value="formData.maklumatSesi.tarikhTamat"
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
              :value="formData.maklumatElaun.jenisElaun"
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
              :value="formData.maklumatElaun.amaun"
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
              :value="formData.maklumatElaun.kodBajet"
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
              :value="formData.maklumatElaun.status"
            />
          </div>
        </template>
      </rs-card>

      <!-- Maklumat Pegawai Section (Read-Only) -->
      <rs-card class="mb-6">
        <template #header>
          <h3 class="text-lg font-semibold text-gray-900 flex items-center">
            <Icon name="ph:user" class="w-5 h-5 mr-2" />
            Maklumat Pegawai (Audit Trail)
          </h3>
        </template>
        <template #body>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Dicipta Oleh</label>
              <div class="text-sm text-gray-900 bg-gray-50 px-3 py-2 rounded-md">
                {{ formData.maklumatPegawai.diciptaOleh }}
              </div>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Tarikh Cipta</label>
              <div class="text-sm text-gray-900 bg-gray-50 px-3 py-2 rounded-md">
                {{ formatDate(formData.maklumatPegawai.tarikhCipta) }}
              </div>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Diluluskan Oleh</label>
              <div class="text-sm text-gray-900 bg-gray-50 px-3 py-2 rounded-md">
                {{ formData.maklumatPegawai.diluluskanOleh || 'Belum diluluskan' }}
              </div>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Tarikh Lulus</label>
              <div class="text-sm text-gray-900 bg-gray-50 px-3 py-2 rounded-md">
                {{ formData.maklumatPegawai.tarikhLulus ? formatDate(formData.maklumatPegawai.tarikhLulus) : 'Belum diluluskan' }}
              </div>
            </div>
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
          Simpan Perubahan
        </rs-button>
      </div>
    </FormKit>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";

const route = useRoute();

definePageMeta({
  title: "Kemaskini Kategori Penolong Amil",
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
    title: "Kemaskini Kategori",
    path: "/BF-PA/KF/KJ/edit"
  }
]);

// Form state
const isSubmitting = ref(false);

// Mock form data (would be fetched from API in real app)
const formData = ref({
  kategoriPenolongAmil: "Penolong Amil Fitrah",
  kodSingkatan: "PAF",
  status: "Aktif",
  tarikhKuatkuasa: "2024-01-01",
  maklumatJawatan: {
    namaJawatan: "Penolong Amil Fitrah",
    kodJawatan: "PAF001",
    status: "Aktif",
    tarikhKuatkuasa: "2024-01-01",
  },
  maklumatSesi: {
    sesi: "Sesi 1 - 2024",
    status: "Aktif",
    tarikhMula: "2024-01-01",
    tarikhTamat: "2024-12-31",
  },
  maklumatElaun: {
    jenisElaun: "Elaun Bulanan",
    amaun: "500.00",
    kodBajet: "B001",
    status: "Aktif",
  },
  maklumatPegawai: {
    diciptaOleh: "Admin User",
    tarikhCipta: "2023-10-27",
    diluluskanOleh: "Manager",
    tarikhLulus: "2023-10-28",
  },
});

const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('ms-MY');
};

const handleSubmit = async (formData) => {
  isSubmitting.value = true;
  
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Show success message
    alert("Kategori penolong amil berjaya dikemaskini");
    
    // Navigate back to list
    navigateTo('/BF-PA/KF/KJ');
  } catch (error) {
    console.error('Error updating category:', error);
    alert("Ralat semasa mengemaskini kategori");
  } finally {
    isSubmitting.value = false;
  }
};

onMounted(() => {
  // In real app, fetch category data based on route.params.id
  console.log("Loading category data for editing ID:", route.params.id);
  
  // Role-based access control
  const currentUserRole = "eksekutif"; // This would come from auth system
  if (currentUserRole !== "pt" && currentUserRole !== "eksekutif") {
    alert("Anda tidak mempunyai kebenaran untuk mengemaskini kategori");
    navigateTo('/BF-PA/KF/KJ');
  }
});
</script> 