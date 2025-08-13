<!-- 
  RTMF SCREEN: PA-KF-KJ-01_03 (Edit Form)
  PURPOSE: Kemaskini maklumat kategori penolong amil
  DESCRIPTION: Edit form for existing Penolong Amil category with tabbed interface (Eksekutif only)
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

    <!-- Form with Tabbed Interface -->
    <FormKit
      type="form"
      id="editCategoryForm"
      :actions="false"
      @submit="handleSubmit"
    >
      <rs-card>
        <template #header>
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-semibold text-gray-900">Kemaskini Maklumat</h3>
            <div class="text-sm text-gray-500">
              <Icon name="ph:info-fill" class="w-4 h-4 inline mr-1" />
              {{ formData.kategoriPenolongAmil }} - {{ formData.kodSingkatan }}
            </div>
          </div>
        </template>
        
        <template #body>
          <rs-tab v-model="activeTab">
            <!-- Maklumat Kategori Tab -->
            <rs-tab-item title="Maklumat Kategori">
              <div class="p-6">
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
                    :disabled="formData.isDefault"
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
                  <div class="md:col-span-2">
                    <FormKit
                      type="textarea"
                      name="penerangan"
                      label="Penerangan Kategori"
                      placeholder="Huraian ringkas tentang kategori ini..."
                      rows="3"
                      :value="formData.penerangan"
                    />
                  </div>
                </div>
              </div>
            </rs-tab-item>

            <!-- Maklumat Jawatan Tab -->
            <rs-tab-item title="Maklumat Jawatan">
              <div class="p-6">
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
                  <div class="md:col-span-2">
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
                      :value="formData.maklumatJawatan.tanggungjawab"
                    />
                  </div>
                  <div class="md:col-span-2">
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
                      :value="formData.maklumatJawatan.kelayakan"
                    />
                  </div>
                </div>
              </div>
            </rs-tab-item>

            <!-- Maklumat Elaun Tab -->
            <rs-tab-item title="Maklumat Elaun">
              <div class="p-6">
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
                  <div class="md:col-span-2">
                    <FormKit
                      type="textarea"
                      name="catatanElaun"
                      label="Catatan Elaun"
                      placeholder="Maklumat tambahan tentang elaun..."
                      rows="2"
                      :value="formData.maklumatElaun.catatanElaun"
                    />
                  </div>
                </div>
              </div>
            </rs-tab-item>

            <!-- Maklumat Sesi Tab -->
            <rs-tab-item title="Maklumat Sesi">
              <div class="p-6">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormKit
                    type="select"
                    name="jenisSesi"
                    label="Jenis Sesi"
                    :options="[
                      { label: 'Sesi Pengajian', value: 'Sesi Pengajian' },
                      { label: 'Sesi Latihan', value: 'Sesi Latihan' },
                      { label: 'Sesi Mesyuarat', value: 'Sesi Mesyuarat' },
                      { label: 'Sesi Lain-lain', value: 'Sesi Lain-lain' },
                    ]"
                    validation="required"
                    :validation-messages="{
                      required: 'Jenis sesi diperlukan',
                    }"
                    :value="formData.maklumatSesi.jenisSesi"
                  />
                  <FormKit
                    type="text"
                    name="tempohSesi"
                    label="Tempoh Sesi"
                    placeholder="Contoh: 1 jam"
                    validation="required"
                    :validation-messages="{
                      required: 'Tempoh sesi diperlukan',
                    }"
                    :value="formData.maklumatSesi.tempohSesi"
                  />
                  <FormKit
                    type="select"
                    name="statusSesi"
                    label="Status Sesi"
                    :options="[
                      { label: 'Belum Bermula', value: 'Belum Bermula' },
                      { label: 'Sedang Berjalan', value: 'Sedang Berjalan' },
                      { label: 'Selesai', value: 'Selesai' },
                      { label: 'Dibatalkan', value: 'Dibatalkan' },
                    ]"
                    validation="required"
                    :validation-messages="{
                      required: 'Status sesi diperlukan',
                    }"
                    :value="formData.maklumatSesi.status"
                  />
                  <div class="md:col-span-2">
                    <FormKit
                      type="textarea"
                      name="catatanSesi"
                      label="Catatan Sesi"
                      placeholder="Maklumat tambahan tentang sesi..."
                      rows="2"
                      :value="formData.maklumatSesi.catatanSesi"
                    />
                  </div>
                </div>
              </div>
            </rs-tab-item>
          </rs-tab>
        </template>
      </rs-card>

      <!-- Maklumat Pegawai Section (Separate from tabs) -->
      <rs-card class="mt-6">
        <template #header>
          <h3 class="text-lg font-semibold text-gray-900 flex items-center">
            <Icon name="ph:user" class="w-5 h-5 mr-2" />
            Maklumat Pegawai (Audit Trail)
          </h3>
        </template>
        <template #body>
          <div class="p-6">
            <div class="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <div class="flex items-center">
                <Icon name="ph:info" class="w-5 h-5 text-blue-600 mr-2" />
                <span class="text-sm text-blue-800 font-medium">Maklumat Audit Trail (Tidak Boleh Diedit)</span>
              </div>
            </div>
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
          </div>
        </template>
      </rs-card>

      <!-- Submit Buttons -->
      <div class="flex justify-end gap-3 mt-6">
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
    name: "Kemaskini Maklumat",
    type: "current",
    path: "/BF-PA/KF/KJ/edit"
  }
]);

// Form state
const isSubmitting = ref(false);
const activeTab = ref('kategori');

// Mock form data (would be fetched from API in real app)
const formData = ref({
  kategoriPenolongAmil: "Penolong Amil Fitrah",
  kodSingkatan: "PAF",
  status: "Aktif",
  tarikhKuatkuasa: "01-01-2024",
  penerangan: "Kategori untuk menguruskan zakat fitrah",
  isDefault: true,
  maklumatJawatan: {
    namaJawatan: "Penolong Amil Fitrah",
    kodJawatan: "PAF001",
    status: "Aktif",
    tarikhKuatkuasa: "01-01-2024",
    tanggungjawab: "Menguruskan kutipan dan pengagihan zakat fitrah",
    kelayakan: "Sijil SPM, pengalaman dalam kerja sosial",
  },
  maklumatElaun: {
    jenisElaun: "Elaun Bulanan",
    amaun: "500.00",
    kodBajet: "B001",
    status: "Aktif",
    catatanElaun: "Elaun bulanan termasuk elaun perjalanan",
  },
  maklumatSesi: {
    jenisSesi: "Sesi Pengajian",
    tempohSesi: "1 jam",
    status: "Belum Bermula",
    catatanSesi: "Sesi pengajian tentang zakat fitrah",
  },
  maklumatPegawai: {
    diciptaOleh: "Admin User",
    tarikhCipta: "27-10-2023",
    diluluskanOleh: "Manager",
    tarikhLulus: "28-10-2023",
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