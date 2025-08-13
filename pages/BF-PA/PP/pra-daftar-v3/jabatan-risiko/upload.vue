<!-- 
  RTMF SCREEN: PA-PP-PD-02_03
  PURPOSE: Screening Upload - Skrin Muat Naik Fail Keputusan Saringan
  DESCRIPTION: Skrin untuk memuat naik fail keputusan saringan
  ROUTE: /BF-PA/PP/pra-daftar-v3/jabatan-risiko/upload
-->
<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />
    <rs-card class="mt-4">
      <template #header>
        <div class="flex justify-between items-center">
          <h2 class="text-xl font-semibold">
            Muat Naik Hasil Tapisan Penolong Amil
          </h2>
        </div>
      </template>
      <template #body>
        <div class="p-4">
          <!-- Upload Instructions -->
          <div class="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div class="flex items-center mb-3">
              <Icon name="ph:info" class="text-blue-600 mr-2" size="20" />
              <h3 class="text-lg font-semibold text-blue-900">Arahan Muat Naik</h3>
            </div>
            <ul class="text-blue-800 text-sm space-y-1">
              <li>• Format fail yang diterima: Excel (.xlsx, .xls) atau CSV (.csv)</li>
              <li>• Saiz maksimum fail: 10MB</li>
              <li>• Pastikan format data mengikut template yang disediakan</li>
              <li>• Semak semula data sebelum muat naik</li>
            </ul>
          </div>

          <!-- Upload Form -->
          <div class="mb-6 p-6 border border-gray-200 rounded-lg">
            <h3 class="text-lg font-semibold mb-4 text-gray-900">Muat Naik Fail Tapisan</h3>
            <FormKit type="form" id="uploadForm" :actions="false" @submit="handleSubmit">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="md:col-span-2">
                  <FormKit 
                    type="file" 
                    name="screeningFile" 
                    label="Fail Tapisan" 
                    accept=".xlsx,.xls,.csv"
                    validation="required"
                    :validation-messages="{ required: 'Fail tapisan diperlukan' }"
                    v-model="formData.screeningFile"
                    :classes="{ input: '!py-2' }"
                  />
                </div>
                <div class="md:col-span-2">
                  <FormKit 
                    type="select" 
                    name="screeningType" 
                    label="Jenis Tapisan"
                    :options="screeningTypeOptions"
                    validation="required"
                    :validation-messages="{ required: 'Jenis tapisan diperlukan' }"
                    v-model="formData.screeningType"
                  />
                </div>
                <div class="md:col-span-2">
                  <FormKit 
                    type="textarea" 
                    name="uploadNotes" 
                    label="Nota Muat Naik (Opsional)"
                    placeholder="Sila berikan sebarang nota berkaitan muat naik ini..."
                    v-model="formData.uploadNotes"
                    :classes="{ input: 'min-h-[100px]' }"
                  />
                </div>
              </div>
              <div class="flex justify-end gap-4 mt-6">
                <rs-button type="button" variant="secondary-outline" @click="handleCancel">
                  Batal
                </rs-button>
                              <rs-button type="button" variant="primary" @click="handleSubmitDirect" :disabled="isSubmitting">
                <Icon v-if="isSubmitting" name="ph:spinner" class="w-4 h-4 mr-2 animate-spin" />
                {{ isSubmitting ? 'Memuat Naik...' : 'Muat Naik Fail' }}
              </rs-button>
              </div>
            </FormKit>
          </div>

          <!-- Template Download Section -->
          <div class="mb-6 p-6 border border-green-200 rounded-lg bg-green-50">
            <h3 class="text-lg font-semibold mb-4 text-green-900">Template Fail Tapisan</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="p-4 border border-green-300 rounded-lg bg-white">
                <div class="flex items-center justify-between mb-2">
                  <h4 class="font-semibold text-green-800">Template Excel</h4>
                  <Icon name="ph:file-xls" class="text-green-600" size="20" />
                </div>
                <p class="text-sm text-green-700 mb-3">Template standard untuk muat naik hasil tapisan dalam format Excel</p>
                <rs-button variant="secondary" size="sm" @click="downloadTemplate('excel')">
                  <Icon name="ph:download" class="w-4 h-4 mr-1" />
                  Muat Turun Template Excel
                </rs-button>
              </div>
              <div class="p-4 border border-green-300 rounded-lg bg-white">
                <div class="flex items-center justify-between mb-2">
                  <h4 class="font-semibold text-green-800">Template CSV</h4>
                  <Icon name="ph:file-csv" class="text-green-600" size="20" />
                </div>
                <p class="text-sm text-green-700 mb-3">Template untuk muat naik hasil tapisan dalam format CSV</p>
                <rs-button variant="secondary" size="sm" @click="downloadTemplate('csv')">
                  <Icon name="ph:download" class="w-4 h-4 mr-1" />
                  Muat Turun Template CSV
                </rs-button>
              </div>
            </div>
          </div>

          <!-- Recent Uploads -->
          <div class="mb-6 p-6 border border-gray-200 rounded-lg">
            <h3 class="text-lg font-semibold mb-4 text-gray-900">Muat Naik Terkini</h3>
            <rs-table :data="recentUploads" :columns="uploadColumns" :pageSize="5" :options="{ variant: 'default', hover: true, striped: true }">
              <template v-slot:status="{ text }">
                <rs-badge :variant="getUploadStatusVariant(text)">{{ text }}</rs-badge>
              </template>
              <template v-slot:tindakan="{ text }">
                <div class="flex justify-center items-center gap-2">
                  <rs-button variant="primary" size="sm" @click="viewUploadDetails(text)">
                    <Icon name="ph:eye" class="w-4 h-4 mr-1" />
                    Lihat
                  </rs-button>
                </div>
              </template>
            </rs-table>
          </div>
        </div>
      </template>
    </rs-card>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";

definePageMeta({
  title: "Muat Naik Hasil Tapisan Penolong Amil",
  description: "Halaman untuk memuat naik hasil tapisan penolong amil",
});

const breadcrumb = ref([
  { name: "Penolong Amil", type: "link", path: "/BF-PA/PP/PM/01" },
  { name: "Pendaftaran", type: "link", path: "/BF-PA/PP/PM/01" },
  { name: "Pra Daftar V3", type: "link", path: "/BF-PA/PP/pra-daftar-v3" },
  { name: "Jabatan Risiko", type: "link", path: "/BF-PA/PP/pra-daftar-v3/jabatan-risiko" },
  { name: "Muat Naik", type: "current", path: "/BF-PA/PP/pra-daftar-v3/jabatan-risiko/upload" },
]);

const screeningTypeOptions = [
  { label: "Tapisan Latar Belakang", value: "background" },
  { label: "Tapisan Keselamatan", value: "security" },
  { label: "Tapisan Kesihatan", value: "health" },
  { label: "Tapisan Komprehensif", value: "comprehensive" },
];

const formData = ref({
  screeningFile: null,
  screeningType: "",
  uploadNotes: "",
});

const isSubmitting = ref(false);

const uploadColumns = [
  { key: "no", label: "No", sortable: true, width: "60px" },
  { key: "tarikhMuatNaik", label: "Tarikh Muat Naik", sortable: true },
  { key: "namaFail", label: "Nama Fail", sortable: true },
  { key: "jenisTapisan", label: "Jenis Tapisan", sortable: true },
  { key: "bilanganRekod", label: "Bilangan Rekod", sortable: true },
  { key: "status", label: "Status", sortable: true },
  { key: "tindakan", label: "Tindakan", sortable: false },
];

const recentUploads = ref([
  {
    no: 1,
    tarikhMuatNaik: "15-01-2024 14:30:00",
    namaFail: "tapisan_background_jan2024.xlsx",
    jenisTapisan: "Tapisan Latar Belakang",
    bilanganRekod: 45,
    status: "Berjaya",
    tindakan: { id: 1, status: "Berjaya" },
  },
  {
    no: 2,
    tarikhMuatNaik: "14-01-2024 09:15:00",
    namaFail: "tapisan_security_jan2024.csv",
    jenisTapisan: "Tapisan Keselamatan",
    bilanganRekod: 38,
    status: "Berjaya",
    tindakan: { id: 2, status: "Berjaya" },
  },
  {
    no: 3,
    tarikhMuatNaik: "14-01-2024 16:45:00",
    namaFail: "tapisan_health_jan2024.xlsx",
    jenisTapisan: "Tapisan Kesihatan",
    bilanganRekord: 52,
    status: "Gagal",
    tindakan: { id: 3, status: "Gagal" },
  },
]);

const getUploadStatusVariant = (status) => {
  switch (status) {
    case "Berjaya":
      return "success";
    case "Gagal":
      return "danger";
    case "Dalam Proses":
      return "warning";
    default:
      return "default";
  }
};

const handleSubmit = async (formData) => {
  // Form submission handler
};

const handleSubmitDirect = async () => {
  isSubmitting.value = true;
  
  try {
    // Simulate upload process
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Show success message
    alert("Fail berjaya dimuat naik!");
    
    // Reset form
    formData.value.screeningFile = null;
    formData.value.screeningType = "";
    formData.value.uploadNotes = "";
    
  } catch (error) {
    alert("Ralat semasa memuat naik fail. Sila cuba lagi.");
  } finally {
    isSubmitting.value = false;
  }
};

const handleCancel = () => {
  navigateTo("/BF-PA/PP/pra-daftar-v3/jabatan-risiko");
};

const downloadTemplate = (type) => {
  // Simulate template download
  const filename = type === 'excel' ? 'template_tapisan.xlsx' : 'template_tapisan.csv';
  alert(`Muat turun template ${filename} bermula...`);
};

const viewUploadDetails = (uploadData) => {
  // Navigate to upload details view
  navigateTo(`/BF-PA/PP/pra-daftar-v3/jabatan-risiko/upload-details/${uploadData.id}`);
};
</script> 
