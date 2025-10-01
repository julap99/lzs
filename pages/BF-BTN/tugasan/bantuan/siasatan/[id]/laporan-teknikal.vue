<template>
  <div class="min-h-screen">
    <div class="">
      <LayoutsBreadcrumb :items="breadcrumb" />

      <!-- Page Header -->
      <div class="mt-6 mb-8">
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <!-- <h1 class="text-2xl font-bold text-gray-900">
              Laporan Teknikal
            </h1>
            <p class="mt-1 text-sm text-gray-600">
              Analisis teknikal dan cadangan kerja berdasarkan siasatan lapangan
            </p> -->
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
                <div class="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center">
                  <Icon name="ph:file-doc" class="w-6 h-6 text-teal-600" />
                </div>
              </div>
              <div>
                <h2 class="text-lg font-semibold text-gray-900">
                  Laporan Teknikal
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

                <!-- B400: Institutional Information -->
                <div v-if="isB400" class="space-y-6">
                  <!-- Institutional Details -->
                  <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <FormKit
                      type="text"
                      name="namaInstitusi"
                      label="NAMA INSTITUSI"
                      v-model="formData.namaInstitusi"
                      placeholder="Masukkan nama institusi..."
                    />

                    <FormKit
                      type="text"
                      name="noBantuan"
                      label="No Bantuan"
                      v-model="formData.noBantuan"
                      placeholder="Masukkan no bantuan..."
                    />
                  </div>

                  <div>
                    <FormKit
                      type="textarea"
                      name="alamatInstitusi"
                      label="ALAMAT"
                      v-model="formData.alamatInstitusi"
                      rows="3"
                      placeholder="Masukkan alamat lengkap institusi..."
                    />
                  </div>
                </div>

                <!-- Non-B400: Status Kediaman and Tapak Rumah - Side by Side -->
                <div v-if="!isB400" class="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <FormKit
                    type="text"
                    name="StatusKediaman"
                    label="Status Kediaman"
                    v-model="formData.StatusKediaman"
                    rows="6"
                    placeholder="Masukkan status kediaman berdasarkan pemerhatian di lokasi..."
                    readonly
                  />

                  <FormKit
                    type="text"
                    name="TapakRumah"
                    label="Tapak Rumah"
                    v-model="formData.TapakRumah"
                    rows="6"
                    placeholder="Masukkan status tapak rumah berdasarkan pemerhatian di lokasi..."
                    readonly
                  />
                </div>

                <!-- Non-B400: Binaan Rumah and Keadaan Rumah - Side by Side -->
                <div v-if="!isB400" class="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <FormKit
                    type="select"
                    name="BinaanRumah"
                    label="Binaan Rumah"
                    v-model="formData.BinaanRumah"
                    validation="required"
                    placeholder="Pilih jenis binaan rumah..."
                    :options="[
                      { label: 'Separa Batu', value: 'Separa Batu' },
                      { label: 'Rumah Kayu', value: 'Rumah Kayu' },
                      { label: 'Rumah Batu', value: 'Rumah Batu' },
                      { label: 'Rumah Kayu & Batu', value: 'Rumah Kayu & Batu' },
                      { label: 'Rumah Papan', value: 'Rumah Papan' },
                      { label: 'Rumah Zink', value: 'Rumah Zink' },
                      { label: 'Rumah Konkrit', value: 'Rumah Konkrit' },
                      { label: 'Rumah Campuran', value: 'Rumah Campuran' }
                    ]"
                  />

                  <FormKit
                    type="select"
                    name="KeadaanRumah"
                    label="Keadaan Rumah"
                    v-model="formData.KeadaanRumah"
                    validation="required"
                    placeholder="Pilih keadaan rumah..."
                    :options="[
                      { label: 'Separa Uzur', value: 'Separa Uzur' },
                      { label: 'Baik', value: 'Baik' },
                      { label: 'Sangat Baik', value: 'Sangat Baik' },
                      { label: 'Uzur', value: 'Uzur' },
                      { label: 'Sangat Uzur', value: 'Sangat Uzur' },
                      { label: 'Rosak Teruk', value: 'Rosak Teruk' },
                      { label: 'Tidak Selamat Didiami', value: 'Tidak Selamat Didiami' },
                      { label: 'Memerlukan Baik Pulih Segera', value: 'Memerlukan Baik Pulih Segera' }
                    ]"
                  />
                </div>

                <!-- Non-B400: Latar Belakang -->
                <div v-if="!isB400" class="space-y-2">
                  <FormKit
                    type="textarea"
                    name="latarBelakang"
                    label="Latar Belakang"
                    v-model="formData.latarBelakang"
                    rows="6"
                    help="" 
                    placeholder="Masukkan latar belakang kes..."
                  />
                  <div class="text-xs text-gray-500">
                    <Icon name="ph:info" class="w-4 h-4 inline mr-1" />
                    Maklumat ini diringkaskan daripada profiling dan boleh dikemaskini mengikut keperluan.
                  </div>
                </div>

                <!-- Non-B400: Keperluan -->
                <FormKit
                  v-if="!isB400"
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
                    Nilai ini dikira secara automatik berdasarkan jumlah dalam Bill of Quantity (BQ).
                  </div>
                </div>

                <!-- Dokumentasi Tambahan -->
                <div class="border-t pt-6">
                  <h3 class="text-lg font-medium text-gray-900 mb-4">Dokumentasi Tambahan</h3>
                  
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

                    <FormKit
                    v-if="formData.keadaanLokasi === 'lain-lain'"
                      type="text"
                      name="lainLainLokasi"
                      label="Lain-lain Lokasi"
                      v-model="formData.lainLainLokasi"
                      validation="required"
                    />
                  </div>

                  <div class="mt-6">
                    <FormKit
                      type="textarea"
                      name="LokasiTapak"
                      label="Lokasi Tapak"
                      v-model="formData.LokasiTapak"
                      rows="4"
                      placeholder="Lokasi Tapak"
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
                      placeholder="Catatan Tambahan"
                    />
                  </div>
                </div>
              </div>
            </FormKit>
          </template>
        </rs-card>


        <!-- Action Buttons -->
        <rs-card class="shadow-sm border-0 bg-white">
          <template #body>
            <div class="flex flex-col sm:flex-row gap-3 justify-end">
              <rs-button
                variant="primary-outline"
                @click="handleSave"
                :disabled="processing"
                class="!py-3 text-sm font-medium"
              >
                <Icon name="ph:floppy-disk" class="w-5 h-5 mr-2" />
                Simpan
              </rs-button>

              <rs-button
                variant="success-outline"
                @click="handleGeneratePDF"
                :disabled="processing"
                class="!py-3 text-sm font-medium"
              >
                <Icon name="ph:file-pdf" class="w-5 h-5 mr-2" />
                Jana PDF
              </rs-button>

              <rs-button
                variant="primary"
                @click="handleSaveAndReturn"
                :disabled="processing"
                :loading="processing"
                class="!py-3 text-sm font-medium"
              >
                <Icon name="ph:check" class="w-5 h-5 mr-2" />
                Simpan & Kembali
              </rs-button>
            </div>
          </template>
        </rs-card>
      </div>
    </div>

    <!-- PDF Preview Modal -->
    <div v-if="showPDFModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <!-- Modal Header -->
        <div class="flex items-center justify-between p-6 border-b border-gray-200">
          <h3 class="text-lg font-semibold text-gray-900">Preview Laporan Teknikal</h3>
          <button @click="showPDFModal = false" class="text-gray-400 hover:text-gray-600">
            <Icon name="ph:x" class="w-6 h-6" />
          </button>
        </div>

        <!-- Modal Body -->
        <div class="p-6">
          <div class="space-y-6 border rounded-lg p-6 bg-gray-50">
            <div class="text-center border-b pb-4">
              <h3 class="text-xl font-bold text-gray-900">LAPORAN TEKNIKAL</h3>
              <p class="text-sm text-gray-600 mt-2">
                ID Permohonan: {{ route.params.id }}
              </p>
            </div>

            <!-- Two-column layout for main content -->
            <div class="space-y-2">
              
              <div class="grid grid-cols-1 lg:grid-cols-4 gap-1">
                <div class="border-b pb-1">
                  <h4 class="font-semibold text-gray-900 text-sm">MAKLUMAT ASNAF</h4>
                </div>
                <div class="lg:col-span-3 border-b pb-2">
                  <p class="text-sm text-gray-700 whitespace-pre-wrap">
                    Nama Asnaf : Mohd Rosli Bin Saad<br>
                    Jenis Pengenalan : MyKad<br>
                    No Pengenalan : 770319035991<br>
                    Umur : 50 Tahun<br>
                    Pendapatan : RM 670.00 <br>
                    Kesihatan : Sihat <br>
                    Status Kediaman : Milik Sendiri Tidak Berbayar <br>
                    Tapak Rumah : {{ formData.TapakRumah || 'Belum diisi' }}<br>
                    Binaan Rumah : {{ formData.BinaanRumah || 'Belum diisi' }}<br>
                    Keadaan Rumah : {{ formData.KeadaanRumah || 'Belum diisi' }}<br>
                    Bilangan Isirumah : 2 Orang
                  </p>
                </div>
              </div>

              <div class="grid grid-cols-1 lg:grid-cols-4 gap-1">
                <div class="border-b pb-1">
                  <h4 class="font-semibold text-gray-900 text-sm">JENIS BANTUAN</h4>
                </div>
                <div class="lg:col-span-3 border-b pb-2">
                  <p class="text-sm text-gray-700 whitespace-pre-wrap">
                    Bantuan Baikpulih Rumah (Fakir)
                  </p>
                </div>
              </div>
              <!-- Non-B400: LATAR BELAKANG Section -->
              <div v-if="!isB400" class="grid grid-cols-1 lg:grid-cols-4 gap-1">
                <div class="border-b pb-1">
                  <h4 class="font-semibold text-gray-900 text-sm">LATAR BELAKANG</h4>
                </div>
                <div class="lg:col-span-3 border-b pb-2">
                  <p class="text-sm text-gray-700 whitespace-pre-wrap">
                    {{ formData.latarBelakang || 'Belum diisi' }}
                  </p>
                </div>
              </div>

              <!-- Non-B400: KEPERLUAN Section -->
              <div v-if="!isB400" class="grid grid-cols-1 lg:grid-cols-4 gap-1">
                <div class="border-b pb-1">
                  <h4 class="font-semibold text-gray-900 text-sm">KEPERLUAN</h4>
                </div>
                <div class="lg:col-span-3 border-b pb-2">
                  <p class="text-sm text-gray-700 whitespace-pre-wrap">
                    {{ formData.keperluan || 'Belum diisi' }}
                  </p>
                </div>
              </div>

              <!-- CADANGAN Section -->
              <div class="grid grid-cols-1 lg:grid-cols-4 gap-1">
                <div class="border-b pb-1">
                  <h4 class="font-semibold text-gray-900 text-sm">CADANGAN</h4>
                </div>
                <div class="lg:col-span-3 border-b pb-2">
                  <p class="text-sm text-gray-700 whitespace-pre-wrap">
                    {{ formData.cadangan || 'Belum diisi' }}
                  </p>
                </div>
              </div>

              <!-- LOKASI TAPAK Section -->
              <div class="grid grid-cols-1 lg:grid-cols-4 gap-1">
                <div class="border-b pb-1">
                  <h4 class="font-semibold text-gray-900 text-sm">LOKASI TAPAK</h4>
                </div>
                <div class="lg:col-span-3 border-b pb-2">
                  <p class="text-sm text-gray-700">
                    {{ formData.LokasiTapak || 'Belum diisi' }}
                  </p>
                </div>
              </div>

              <!-- NILAI KERJA Section -->
              <div class="grid grid-cols-1 lg:grid-cols-4 gap-1">
                <div class="border-b pb-1">
                  <h4 class="font-semibold text-gray-900 text-sm">NILAI KERJA</h4>
                </div>
                <div class="lg:col-span-3 border-b pb-2">
                  <div class="space-y-1">
                    <div class="flex justify-between">
                      <span class="text-sm font-medium text-gray-900">NILAI KERJA BANGUNAN:</span>
                      <span class="text-sm text-gray-700">RM {{ formData.nilaiKerja.toLocaleString() }}</span>
                    </div>
                    <div class="flex justify-between">
                      <span class="text-sm font-medium text-gray-900">NILAI KERJA TAMBAHAN:</span>
                      <span class="text-sm text-gray-700">RM 0.00</span>
                    </div>
                    <div class="flex justify-between">
                      <span class="text-sm font-medium text-gray-900">GST 6%:</span>
                      <span class="text-sm text-gray-700">RM 0.00</span>
                    </div>
                    <div class="flex justify-between border-t pt-1">
                      <span class="text-sm font-bold text-gray-900">JUMLAH:</span>
                      <span class="text-sm font-bold text-gray-900">RM {{ formData.nilaiKerja.toLocaleString() }}</span>
                    </div>
                    <div class="mt-2">
                      <p class="text-sm text-gray-700">
                        {{ formData.catatanTambahan || 'Belum diisi' }}
                      </p>
                    </div>
                    <div class="mt-1">
                      <p class="text-sm font-bold text-gray-900">
                        <strong>Ringgit Malaysia : {{ numberToWords(formData.nilaiKerja).toUpperCase() }}</strong>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Signature Section -->
            <div class="mt-8 pt-6 border-t border-gray-200">
              <div class="text-left">
                <p class="text-sm text-gray-700 mb-8">Disediakan Oleh</p>
                
                  <p class="text-sm font-semibold text-gray-900">Ahmad bin Ali</p>
                  <p class="text-sm text-gray-700">Eksekutif Teknikal Daerah Kuala Selangor</p>
                  <p class="text-sm text-gray-700">Jabatan Pengurusan Operasi Agihan Daerah</p>
                
              </div>
            </div>
          </div>
        </div>

        <!-- Modal Footer -->
        <div class="flex items-center justify-end space-x-3 p-6 border-t border-gray-200">
          <rs-button variant="secondary" @click="showPDFModal = false">
            Tutup
          </rs-button>
          <rs-button variant="primary" @click="generateActualPDF">
            <Icon name="ph:file-pdf" class="w-4 h-4 mr-2" />
            Cetak PDF
          </rs-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useToast } from "vue-toastification";

const route = useRoute();
const router = useRouter();
const toast = useToast();
const processing = ref(false);
const showPDFModal = ref(false);

// Check if current bantuan is B400
const isB400 = computed(() => String(route.params.id || '').toUpperCase() === 'B400');

definePageMeta({
  title: "Laporan Teknikal - Siasatan Lapangan",
});

const breadcrumb = ref([
  {
    name: "Permohonan Bantuan",
    type: "link",
    path: "/BF-BTN/permohonan/senarai",
  },
  {
    name: "Siasatan ke Lapangan",
    type: "link",
    path: "/BF-BTN/permohonan/senarai-siasatan-lapangan",
  },
  {
    name: "Kemaskini Siasatan",
    type: "link",
    path: `/BF-BTN/tugasan/bantuan/siasatan/${route.params.id}`,
  },
  {
    name: "Laporan Teknikal",
    type: "current",
    path: `/BF-BTN/permohonan/senarai-siasatan-lapangan/${route.params.id}/laporan-teknikal`,
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
  LokasiTapak: "",
  StatusKediaman: "Milik Sendiri Tidak Berbayar",
  TapakRumah: "Milik Sendiri",
  BinaanRumah: "Separa Batu",
  // B400 specific fields
  namaInstitusi: "Masjid At-Taqwa",
  alamatInstitusi: "Jalan Masjid, Kampung Seri Melati, 45800 Kuala Selangor, Selangor",
  noBantuan: "NAS-2025-0006",
  KeadaanRumah: "Separa Uzur",
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
  { label: "Lain-lain", value: "lain-lain" },
]);

// Helper methods
const getCuacaLabel = (value) => {
  const option = cuacaOptions.value.find(opt => opt.value === value);
  return option ? option.label : 'Belum dipilih';
};

const getKeadaanLokasiLabel = (value) => {
  const option = keadaanLokasiOptions.value.find(opt => opt.value === value);
  return option ? option.label : 'Belum dipilih';
};

// Methods
const handleSubmit = async (data) => {
  // This will be called when form is submitted
  console.log("Form submitted:", data);
};

const handleSave = async () => {
  try {
    processing.value = true;
    
    // Validate required fields based on bantuan type
    const requiredFields = [
      { field: 'cadangan', label: 'Cadangan' },
    ];

    // Add non-B400 specific required fields
    if (!isB400.value) {
      requiredFields.push(
        { field: 'keperluan', label: 'Keperluan' },
        { field: 'BinaanRumah', label: 'Binaan Rumah' },
        { field: 'KeadaanRumah', label: 'Keadaan Rumah' },
        { field: 'TapakRumah', label: 'Tapak Rumah' }
      );
    }
    
    const missingFields = requiredFields.filter(field => !formData.value[field.field]);
    
    if (missingFields.length > 0) {
      const fieldNames = missingFields.map(field => field.label).join(', ');
      toast.error(`Sila lengkapkan medan-medan yang diperlukan: ${fieldNames}`);
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
    
    // Open PDF preview modal
    showPDFModal.value = true;
    
    toast.success("Preview laporan teknikal dibuka");
  } catch (error) {
    toast.error("Ralat semasa membuka preview");
    console.error(error);
  } finally {
    processing.value = false;
  }
};

const generateActualPDF = async () => {
  try {
    processing.value = true;
    
    // Implement actual PDF generation functionality
    console.log("Generating actual PDF for:", formData.value);
    
    toast.success("PDF laporan teknikal telah dijana");
    showPDFModal.value = false;
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
  router.push(`/BF-BTN/tugasan/bantuan/siasatan/${route.params.id}`);
};

// Load existing data on mount
onMounted(async () => {
  try {
    // Load existing data from API
    // This is mock data for now
    if (isB400.value) {
      // B400: Institutional aid default data
      formData.value = {
        namaInstitusi: "Masjid At-Taqwa",
        alamatInstitusi: "Jalan Masjid, Kampung Seri Melati, 45800 Kuala Selangor, Selangor",
        noBantuan: "NAS-2025-0006",
        cadangan: `Dicadangkan sumbangan untuk kerja-kerja baikpulih institusi berikut :

1. Baik pulih struktur bangunan masjid yang rosak.
2. Mengganti bahan binaan yang uzur dan tidak selamat.
3. Menaik taraf kemudahan asas masjid untuk keselesaan jemaah.`,
        nilaiKerja: 43000, // This would be calculated from BQ
        tarikhSiasatan: new Date().toISOString().split('T')[0], // Today's date
        masaSiasatan: "",
        cuacaSiasatan: "",
        keadaanLokasi: "",
        catatanTambahan: "Tempoh masa kerja yang dicadangkan tidak termasuk kerja-kerja tambahan adalah selama 8 MINGGU",
        LokasiTapak: "Jalan Masjid, Kampung Seri Melati, 45800 Kuala Selangor, Selangor",
      };
    } else {
      // Non-B400: Individual housing aid default data
      formData.value = {
        StatusKediaman: "Milik Sendiri Tidak Berbayar",
        TapakRumah: "Milik Sendiri",
        latarBelakang: `1. Keterangan Harta Benda:
Binaan rumah daripada separa batu dan kayu.

2. Status hakmilik tanah seperti berikut :
No Lot : 3439
Mukim : JERAM
Daerah : KUALA SELANGOR
Nama Pemilik : MOHD ROSLI BIN SAAD
ANG Bahagian : 1/14
Luas : 1.1635 HEKTAR
Lain-lain : - NIL-

3. Maklumat Isirumah :
Ketua Keluarga : Pemohon (MISKIN)
Pasangan : 1 orang isteri tinggal bersama
Tanggungan : - NIL-
Lain-lain : - NIL-`,
        keperluan: `Keadaan rumah separa uzur. Sebahagian besar struktur rumah yang dibina daripada kayu telah uzur dan reput dimakan anal-anal.
Keadaan rumah tidak sempuma.

Pemohon tidak mepunyai pendapatan yang mencukupi untuk membaiki kerosakan yang berlaku dirumahnya.
Untuk rekod, rumah masih dalam keadaan baik untuk diduduki dan sesuai untuk dibaikpulih.`,
        cadangan: `Dicadangkan kerja-kerja baikpulih berikut :

1. Meroboh bahagian rumah yang rosak dan retak.
2. Membina semula struktur bangunan rumah yang baru.
3. Membaikpulih dan menaiktaraf pendawalan elektrik bahagian rumah yang terlibat.`,
        nilaiKerja: 43000, // This would be calculated from BQ
        tarikhSiasatan: new Date().toISOString().split('T')[0], // Today's date
        masaSiasatan: "",
        cuacaSiasatan: "",
        keadaanLokasi: "",
        catatanTambahan: "Tempoh masa kerja yang dicadangkan tidak termasuk kerja-kerja tambahan adalah selama 8 MINGGU",
        LokasiTapak: "Jalan Rajawali, Kampung Bukit Kuching, 45800 Jeram",
        BinaanRumah: "Separa Batu",
        KeadaanRumah: "Separa Uzur",
      };
    }
  } catch (error) {
    toast.error("Ralat semasa memuatkan data laporan teknikal");
    console.error(error);
  }
});

const numberToWords = (amount) => {
  if (!amount || amount === 0) return "TIADA RINGGIT SAHAJA";
  const num = Math.round(amount);
  const ones = ['', 'SATU', 'DUA', 'TIGA', 'EMPAT', 'LIMA', 'ENAM', 'TUJUH', 'LAPAN', 'SEMBILAN'];
  const teens = ['SEPULUH', 'SEBELAS', 'DUA BELAS', 'TIGA BELAS', 'EMPAT BELAS', 'LIMA BELAS', 'ENAM BELAS', 'TUJUH BELAS', 'LAPAN BELAS', 'SEMBILAN BELAS'];
  const tens = ['', '', 'DUA PULUH', 'TIGA PULUH', 'EMPAT PULUH', 'LIMA PULUH', 'ENAM PULUH', 'TUJUH PULUH', 'LAPAN PULUH', 'SEMBILAN PULUH'];

  const convertToWords = (n) => {
    if (n === 0) return '';
    if (n < 10) return ones[n];
    if (n < 20) return teens[n - 10];
    if (n < 100) {
      const ten = Math.floor(n / 10);
      const one = n % 10;
      return tens[ten] + (one > 0 ? ' ' + ones[one] : '');
    }
    if (n < 1000) {
      const hundred = Math.floor(n / 100);
      const remainder = n % 100;
      return (hundred === 1 ? 'SERATUS' : ones[hundred] + ' RATUS') +
             (remainder > 0 ? ' ' + convertToWords(remainder) : '');
    }
    if (n < 1000000) {
      const thousand = Math.floor(n / 1000);
      const remainder = n % 1000;
      return (thousand === 1 ? 'SERIBU' : convertToWords(thousand) + ' RIBU') +
             (remainder > 0 ? ' ' + convertToWords(remainder) : '');
    }
    if (n < 1000000000) {
      const million = Math.floor(n / 1000000);
      const remainder = n % 1000000;
      return (million === 1 ? 'SEJUTA' : convertToWords(million) + ' JUTA') +
             (remainder > 0 ? ' ' + convertToWords(remainder) : '');
    }
    return 'NOMBOR TERLALU BESAR';
  };

  return convertToWords(num) + ' RINGGIT SAHAJA';
};
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