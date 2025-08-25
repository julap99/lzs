<template>
  <div class="min-h-screen">
    <div class="">
      <LayoutsBreadcrumb :items="breadcrumb" />

      <!-- Page Header -->
      <div class="mt-6 mb-8">
        <div
          class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
        >
          <div>
            <h1 class="text-2xl font-bold text-gray-900">
              Kelulusan Laporan Teknikal
            </h1>
            <p class="mt-1 text-sm text-gray-600">
              Semak analisis teknikal dan cadangan kerja berdasarkan siasatan
              lapangan untuk kelulusan
            </p>
          </div>
          <rs-button
            variant="primary-outline"
            @click="handleBack"
            class="text-sm"
          >
            <Icon name="ph:arrow-left" class="w-4 h-4 mr-2" />
            Kembali
          </rs-button>
        </div>
      </div>

      <div class="space-y-6">
        <!-- Laporan Teknikal Form -->
        <rs-card class="shadow-sm border-0 bg-white">
          <template #header>
            <div class="flex items-center space-x-3">
              <div class="flex-shrink-0">
                <div
                  class="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center"
                >
                  <Icon name="ph:file-doc" class="w-6 h-6 text-teal-600" />
                </div>
              </div>
              <div>
                <h2 class="text-lg font-semibold text-gray-900">
                  Laporan Teknikal Siasatan
                </h2>
                <p class="text-sm text-gray-500">
                  Lengkapkan analisis teknikal berdasarkan dapatan lapangan
                </p>
              </div>
            </div>
          </template>

          <template #body>
            <FormKit
              type="form"
              :actions="false"
              @submit="handleSubmit"
              v-model="formData"
            >
              <div class="space-y-6">
                <!-- Latar Belakang -->
                <div class="space-y-2">
                  <FormKit
                    type="textarea"
                    name="latarBelakang"
                    label="Latar Belakang"
                    v-model="formData.latarBelakang"
                    rows="6"
                    help="Maklumat dari profiling, boleh diedit jika perlu"
                    placeholder="Masukkan latar belakang kes..."
                  />
                  <div class="text-xs text-gray-500">
                    <Icon name="ph:info" class="w-4 h-4 inline mr-1" />
                    Maklumat ini diambil dari profiling dan boleh dikemaskini
                    mengikut keperluan.
                  </div>
                </div>

                <!-- Keperluan -->
                <FormKit
                  type="textarea"
                  name="keperluan"
                  label="Keperluan"
                  v-model="formData.keperluan"
                  rows="6"
                  validation="required"
                  help="Pemerhatian dan keperluan yang dikenal pasti di lokasi"
                  placeholder="Masukkan keperluan berdasarkan pemerhatian di lokasi..."
                />

                <!-- Cadangan -->
                <FormKit
                  type="textarea"
                  name="cadangan"
                  label="Cadangan"
                  v-model="formData.cadangan"
                  rows="6"
                  validation="required"
                  help="Ringkasan dan cadangan kerja yang perlu dilakukan"
                  placeholder="Masukkan cadangan kerja dan penyelesaian..."
                />

                <!-- Nilai Kerja Dicadangkan (Auto-calculated from BQ) -->
                <div class="space-y-2">
                  <label class="block text-sm font-medium text-gray-700">
                    Nilai Kerja Dicadangkan
                  </label>
                  <div class="mt-1 p-4 bg-gray-50 rounded-lg border">
                    <div class="flex items-center justify-between">
                      <span class="text-lg font-semibold text-gray-900">
                        RM {{ formData.nilaiKerja.toLocaleString() }}
                      </span>
                      <span class="text-sm text-gray-500">
                        (Dikira automatik dari BQ)
                      </span>
                    </div>
                  </div>
                  <div class="text-xs text-gray-500">
                    <Icon name="ph:calculator" class="w-4 h-4 inline mr-1" />
                    Nilai ini dikira secara automatik berdasarkan jumlah dalam
                    Bill of Quantity (BQ).
                  </div>
                </div>

                <!-- Dokumentasi Tambahan -->
                <div class="border-t pt-6">
                  <h3 class="text-lg font-medium text-gray-900 mb-4">
                    Dokumentasi Tambahan
                  </h3>

                  <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <!-- Tarikh Siasatan -->
                    <FormKit
                      type="date"
                      name="tarikhSiasatan"
                      label="Tarikh Siasatan"
                      v-model="formData.tarikhSiasatan"
                      validation="required"
                    />

                    <!-- Masa Siasatan -->
                    <FormKit
                      type="time"
                      name="masaSiasatan"
                      label="Masa Siasatan"
                      v-model="formData.masaSiasatan"
                      validation="required"
                    />

                    <!-- Cuaca Semasa Siasatan -->
                    <FormKit
                      type="select"
                      name="cuacaSiasatan"
                      label="Cuaca Semasa Siasatan"
                      :options="cuacaOptions"
                      v-model="formData.cuacaSiasatan"
                      validation="required"
                    />

                    <!-- Keadaan Lokasi -->
                    <FormKit
                      type="select"
                      name="keadaanLokasi"
                      label="Keadaan Lokasi"
                      :options="keadaanLokasiOptions"
                      v-model="formData.keadaanLokasi"
                      validation="required"
                    />
                  </div>

                  <!-- Catatan Tambahan -->
                  <div class="mt-6">
                    <FormKit
                      type="textarea"
                      name="catatanTambahan"
                      label="Catatan Tambahan"
                      v-model="formData.catatanTambahan"
                      rows="4"
                      placeholder="Catatan tambahan yang relevan..."
                    />
                  </div>
                </div>
              </div>
            </FormKit>
          </template>
        </rs-card>

        <!-- Preview Laporan -->
        <rs-card class="shadow-sm border-0 bg-white">
          <template #header>
            <div class="flex items-center space-x-3">
              <div class="flex-shrink-0">
                <div
                  class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center"
                >
                  <Icon name="ph:eye" class="w-6 h-6 text-blue-600" />
                </div>
              </div>
              <div>
                <h2 class="text-lg font-semibold text-gray-900">
                  Preview Laporan Teknikal
                </h2>
                <p class="text-sm text-gray-500">
                  Paparan laporan untuk semakan sebelum disimpan
                </p>
              </div>
            </div>
          </template>

          <template #body>
            <div class="space-y-6 border rounded-lg p-6 bg-gray-50">
              <div class="text-center border-b pb-4">
                <h3 class="text-xl font-bold text-gray-900">
                  LAPORAN TEKNIKAL SIASATAN LAPANGAN
                </h3>
                <p class="text-sm text-gray-600 mt-2">
                  ID Permohonan: {{ route.params.id }}
                </p>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                <div>
                  <strong>Tarikh Siasatan:</strong>
                  {{ formData.tarikhSiasatan || "Belum diisi" }}
                </div>
                <div>
                  <strong>Masa Siasatan:</strong>
                  {{ formData.masaSiasatan || "Belum diisi" }}
                </div>
                <div>
                  <strong>Cuaca:</strong>
                  {{ getCuacaLabel(formData.cuacaSiasatan) }}
                </div>
                <div>
                  <strong>Keadaan Lokasi:</strong>
                  {{ getKeadaanLokasiLabel(formData.keadaanLokasi) }}
                </div>
              </div>

              <div class="space-y-4">
                <div>
                  <h4 class="font-semibold text-gray-900">1. LATAR BELAKANG</h4>
                  <p class="text-sm text-gray-700 mt-2">
                    {{ formData.latarBelakang || "Belum diisi" }}
                  </p>
                </div>

                <div>
                  <h4 class="font-semibold text-gray-900">2. KEPERLUAN</h4>
                  <p class="text-sm text-gray-700 mt-2">
                    {{ formData.keperluan || "Belum diisi" }}
                  </p>
                </div>

                <div>
                  <h4 class="font-semibold text-gray-900">3. CADANGAN</h4>
                  <p class="text-sm text-gray-700 mt-2">
                    {{ formData.cadangan || "Belum diisi" }}
                  </p>
                </div>

                <div>
                  <h4 class="font-semibold text-gray-900">
                    4. NILAI KERJA DICADANGKAN
                  </h4>
                  <p class="text-lg font-bold text-gray-900 mt-2">
                    RM {{ formData.nilaiKerja.toLocaleString() }}
                  </p>
                </div>

                <div v-if="formData.catatanTambahan">
                  <h4 class="font-semibold text-gray-900">
                    5. CATATAN TAMBAHAN
                  </h4>
                  <p class="text-sm text-gray-700 mt-2">
                    {{ formData.catatanTambahan }}
                  </p>
                </div>
              </div>
            </div>
          </template>
        </rs-card>

        <!-- Action Buttons -->
        <rs-card class="p-4">
            <div class="flex flex-col sm:flex-row gap-3 justify-end">
              <rs-button
                variant="primary"
                @click="handleBack"
              >
                Kembali
              </rs-button>

              <rs-button
                variant="success-outline"
                @click="handleGeneratePDF"
              >
                Jana PDF
              </rs-button>

              <rs-button
                variant="primary"
                @click="handleSaveAndReturn"
              >
                Simpan & Kembali
              </rs-button>
            </div>
        </rs-card>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useToast } from "vue-toastification";

const route = useRoute();
const router = useRouter();
const toast = useToast();
const processing = ref(false);

definePageMeta({
  title: "Kelulusan - Laporan Teknikal",
});

const breadcrumb = ref([
  {
    name: "Tugasan",
    type: "link",
    path: "/BF-BTN/tugasan",
  },
  {
    name: "Kelulusan Siasatan",
    type: "link",
    path: `/BF-BTN/tugasan/bantuan/kelulusan/${route.params.id}`,
  },
  {
    name: "Laporan Teknikal",
    type: "current",
    path: `/BF-BTN/tugasan/bantuan/kelulusan/${route.params.id}/laporan-teknikal`,
  },
]);

// Form data
const formData = ref({
  latarBelakang: "",
  keperluan: "",
  cadangan: "",
  nilaiKerja: 0,
  tarikhSiasatan: "",
  masaSiasatan: "",
  cuacaSiasatan: "",
  keadaanLokasi: "",
  catatanTambahan: "",
});

// Dropdown options
const cuacaOptions = ref([
  { label: "Cerah", value: "cerah" },
  { label: "Berawan", value: "berawan" },
  { label: "Hujan Ringan", value: "hujan_ringan" },
  { label: "Hujan Lebat", value: "hujan_lebat" },
  { label: "Ribut", value: "ribut" },
]);

const keadaanLokasiOptions = ref([
  { label: "Mudah Diakses", value: "mudah_akses" },
  { label: "Sukar Diakses", value: "sukar_akses" },
  { label: "Memerlukan Kenderaan Khas", value: "kenderaan_khas" },
  { label: "Kawasan Terpencil", value: "terpencil" },
  { label: "Kawasan Bandar", value: "bandar" },
]);

// Helper methods
const getCuacaLabel = (value) => {
  const option = cuacaOptions.value.find((opt) => opt.value === value);
  return option ? option.label : "Belum dipilih";
};

const getKeadaanLokasiLabel = (value) => {
  const option = keadaanLokasiOptions.value.find((opt) => opt.value === value);
  return option ? option.label : "Belum dipilih";
};

// Methods
const handleSubmit = async (data) => {
  // This will be called when form is submitted
  console.log("Form submitted:", data);
};

const handleSave = async () => {
  try {
    processing.value = true;

    // Validate required fields
    if (!formData.value.keperluan || !formData.value.cadangan) {
      toast.error("Sila lengkapkan medan-medan yang diperlukan");
      return;
    }

    // Implement save functionality
    console.log("Saving laporan teknikal:", formData.value);

    toast.success("Laporan teknikal telah disimpan");
  } catch (error) {
    toast.error("Ralat semasa menyimpan laporan teknikal");
    console.error(error);
  } finally {
    processing.value = false;
  }
};

const handleGeneratePDF = async () => {
  try {
    processing.value = true;

    // Implement PDF generation functionality
    console.log("Generating PDF for:", formData.value);

    toast.success("PDF laporan teknikal telah dijana");
  } catch (error) {
    toast.error("Ralat semasa menjana PDF");
    console.error(error);
  } finally {
    processing.value = false;
  }
};

const handleSaveAndReturn = async () => {
  try {
    await handleSave();
    handleBack();
  } catch (error) {
    console.error(error);
  }
};

const handleBack = () => {
  router.push(`/BF-BTN/tugasan/bantuan/kelulusan/${route.params.id}`);
};

// Load existing data on mount
onMounted(async () => {
  try {
    // Load existing data from API
    // This is mock data for now
    formData.value = {
      latarBelakang:
        "Berdasarkan profiling, pemohon tinggal di rumah yang memerlukan kerja-kerja baik pulih bumbung dan dinding yang rosak akibat cuaca. Pemohon merupakan seorang balu dengan 2 orang anak yang masih bersekolah.",
      keperluan: "",
      cadangan: "",
      nilaiKerja: 25000, // This would be calculated from BQ
      tarikhSiasatan: new Date().toISOString().split("T")[0], // Today's date
      masaSiasatan: "",
      cuacaSiasatan: "",
      keadaanLokasi: "",
      catatanTambahan: "",
    };
  } catch (error) {
    toast.error("Ralat semasa memuatkan data laporan teknikal");
    console.error(error);
  }
});
</script>

<style lang="scss" scoped>
// Custom print styles for PDF generation
@media print {
  .no-print {
    display: none !important;
  }

  .print-only {
    display: block !important;
  }
}

// Enhanced form styling
.formkit-wrapper {
  margin-bottom: 1rem;
}

// Preview section styling
.preview-section {
  background-color: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  padding: 1.5rem;
}
</style>
