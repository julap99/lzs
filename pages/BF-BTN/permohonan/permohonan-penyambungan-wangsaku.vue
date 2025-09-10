<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />

    <rs-card class="mb-6">
      <template #header>
        <div class="flex items-center justify-between">
          <h1 class="text-xl font-semibold">Permohonan Penyambungan Wangsaku Pelajar Tajaan LZS</h1>
          <div class="flex gap-2">
            <rs-button variant="secondary-outline" @click="handlePrint">
              <Icon name="ph:printer" class="w-4 h-4 mr-1" /> Cetak
            </rs-button>
            <rs-button variant="primary" @click="handleSubmit">
              <Icon name="ph:check-circle" class="w-4 h-4 mr-1" /> Simpan
            </rs-button>
          </div>
        </div>
      </template>
      <template #body>
        <div class="p-6 space-y-6">
          <!-- Header Section -->
          <div class="text-center mb-8">
            <h2 class="text-2xl font-bold text-gray-800 mb-2">
              PERMOHONAN PENYAMBUNGAN WANGSAKU
            </h2>
            <h3 class="text-xl font-bold text-gray-800 mb-4">
              PELAJAR TAJAAN LZS
            </h3>
            <p class="text-gray-600">
              Bagi Pelajar Semester Ke 2 dan Ke atas Sahaja
            </p>
          </div>

          <!-- Important Notice -->
          <div class="bg-red-50 border border-red-200 rounded-lg p-6">
            <h3 class="text-lg font-semibold text-red-800 mb-3 text-center">
              PERINGATAN PENTING!!
            </h3>
            <p class="text-sm leading-6 text-gray-800">
              Kami mendapati ramai pelajar yang memohon wangsaku tidak memberikan surat 
              pengesahan belajar dan surat pengesahan tajaan dari Pusat Pengajian yang TERKINI. 
              Ini menyebabkan banyak permohonan terpaksa ditolak kerana tidak mematuhi Garis 
              panduan Yang Ditetapkan. Jika anda telah ada semua dokumen yang dikehendaki, 
              anda boleh teruskan mengisi borang Permohonan Wangsaku Ini. Anda dilarang 
              membuat permohonan yang berulang ataupun yang sama bagi mengelakkan risiko 
              proses bertindan.
            </p>
          </div>

          <!-- Form Questions -->
          <div class="space-y-6">
            <!-- Question 1 -->
            <div>
              <h4 class="text-sm font-medium text-gray-900 mb-3">
                Adakah Anda Mempunyai Surat Pengesahan Belajar TERKINI dari Pusat Pengajian Anda? 
                <span class="text-red-500">*</span>
              </h4>
              <div class="space-y-2">
                <label class="flex items-center">
                  <input
                    v-model="form.suratPengesahanBelajar"
                    type="radio"
                    value="ya"
                    class="h-4 w-4 text-primary focus:ring-primary border-gray-300"
                  />
                  <span class="ml-2 text-sm text-gray-700">Ya</span>
                </label>
                <label class="flex items-center">
                  <input
                    v-model="form.suratPengesahanBelajar"
                    type="radio"
                    value="tidak"
                    class="h-4 w-4 text-primary focus:ring-primary border-gray-300"
                  />
                  <span class="ml-2 text-sm text-gray-700">Tidak</span>
                </label>
              </div>
            </div>

            <!-- Date 1 -->
            <div>
              <h4 class="text-sm font-medium text-gray-900 mb-3">
                Surat Pengesahan Belajar Yang Dikeluarkan Oleh Pusat Pengajian Anda Bertarikh Bila? 
                <span class="text-red-500">*</span>
              </h4>
              <FormKit
                v-model="form.tarikhSuratBelajar"
                type="date"
                placeholder="dd-mm-yyyy"
                :classes="dateInputClasses"
              />
            </div>

            <!-- Question 2 -->
            <div>
              <h4 class="text-sm font-medium text-gray-900 mb-3">
                Adakah Anda Mempunyai Surat Pengesahan Tajaan TERKINI dari Pusat Pengajian Anda? 
                <span class="text-red-500">*</span>
              </h4>
              <div class="space-y-2">
                <label class="flex items-center">
                  <input
                    v-model="form.suratPengesahanTajaan"
                    type="radio"
                    value="ya"
                    class="h-4 w-4 text-primary focus:ring-primary border-gray-300"
                  />
                  <span class="ml-2 text-sm text-gray-700">Ya</span>
                </label>
                <label class="flex items-center">
                  <input
                    v-model="form.suratPengesahanTajaan"
                    type="radio"
                    value="tidak"
                    class="h-4 w-4 text-primary focus:ring-primary border-gray-300"
                  />
                  <span class="ml-2 text-sm text-gray-700">Tidak</span>
                </label>
              </div>
            </div>

            <!-- Date 2 -->
            <div>
              <h4 class="text-sm font-medium text-gray-900 mb-3">
                Surat Pengesahan Pengesahan Tajaan Yang Dikeluarkan Oleh Pusat Pengajian Anda Bertarikh Bila? 
                <span class="text-red-500">*</span>
              </h4>
              <FormKit
                v-model="form.tarikhSuratTajaan"
                type="date"
                placeholder="dd-mm-yyyy"
                :classes="dateInputClasses"
              />
            </div>

            <!-- Question 3 -->
            <div>
              <h4 class="text-sm font-medium text-gray-900 mb-3">
                Adakah Anda Mempunyai Keputusan Peperiksaan TERKINI? 
                <span class="text-red-500">*</span>
              </h4>
              <div class="space-y-2">
                <label class="flex items-center">
                  <input
                    v-model="form.keputusanPeriksa"
                    type="radio"
                    value="ya"
                    class="h-4 w-4 text-primary focus:ring-primary border-gray-300"
                  />
                  <span class="ml-2 text-sm text-gray-700">Ya</span>
                </label>
                <label class="flex items-center">
                  <input
                    v-model="form.keputusanPeriksa"
                    type="radio"
                    value="tidak"
                    class="h-4 w-4 text-primary focus:ring-primary border-gray-300"
                  />
                  <span class="ml-2 text-sm text-gray-700">Tidak</span>
                </label>
              </div>
            </div>

            <!-- Date 3 -->
            <div>
              <h4 class="text-sm font-medium text-gray-900 mb-3">
                Keputusan Peperiksaan Anda Bertarikh Bila? 
                <span class="text-red-500">*</span>
              </h4>
              <FormKit
                v-model="form.tarikhKeputusan"
                type="date"
                placeholder="dd-mm-yyyy"
                :classes="dateInputClasses"
              />
            </div>

            <!-- Final Confirmation -->
            <div class="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <label class="flex items-start">
                <input
                  v-model="form.semuaDokumenTerkini"
                  type="checkbox"
                  class="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded mt-1"
                />
                <span class="ml-3 text-sm text-gray-700">
                  Semua Dokumen TERKINI Telah Ada. Saya ingin mengisi .permohonan
                </span>
              </label>
            </div>
          </div>
        </div>
      </template>
    </rs-card>
  </div>
</template>

<script setup>
// Page meta
definePageMeta({
  layout: "default",
  middleware: "auth",
});

// Breadcrumb
const breadcrumb = ref([
  {
    name: "Permohonan",
    type: "link",
    path: "/BF-BTN/permohonan",
  },
  {
    name: "Penyambungan Wangsaku",
    type: "current",
    path: "/BF-BTN/permohonan/permohonan-penyambungan-wangsaku",
  },
]);

// Form data
const form = reactive({
  suratPengesahanBelajar: '',
  tarikhSuratBelajar: '',
  suratPengesahanTajaan: '',
  tarikhSuratTajaan: '',
  keputusanPeriksa: '',
  tarikhKeputusan: '',
  semuaDokumenTerkini: false,
});

// FormKit classes
const dateInputClasses = {
  outer: 'max-w-xs',
  label: 'block text-sm font-medium text-gray-700 mb-1',
  input: '!rounded-lg !border-gray-300 !py-2',
  messages: 'text-xs text-red-600 mt-1'
};

// Handlers
const handleSubmit = () => {
  // Validate form
  if (!form.suratPengesahanBelajar || !form.suratPengesahanTajaan || !form.keputusanPeriksa) {
    alert('Sila lengkapkan semua medan yang diperlukan');
    return;
  }

  if (!form.semuaDokumenTerkini) {
    alert('Sila sahkan bahawa semua dokumen terkini telah ada');
    return;
  }

  // TODO: integrate with backend when available
  console.log('Submit Permohonan Penyambungan Wangsaku:', JSON.parse(JSON.stringify(form)));
  
  // Show success message or redirect
  alert('Permohonan telah berjaya dihantar');
};

const handlePrint = () => {
  window.print();
};
</script>

<style lang="scss" scoped>
@media print {
  .no-print { display: none !important; }
}
</style>