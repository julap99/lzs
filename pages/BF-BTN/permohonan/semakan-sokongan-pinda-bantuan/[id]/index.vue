<template>
  <div class="min-h-screen">
    <div class="">
      <LayoutsBreadcrumb :items="breadcrumb" />

      <!-- Page Header -->
      <div class="mt-6 mb-8">
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 class="text-2xl font-bold text-gray-900">
              Semakan Sokongan Pinda Bantuan
            </h1>
            <p class="mt-1 text-sm text-gray-600">
              Semak dan berikan sokongan untuk permohonan pinda bantuan
            </p>
          </div>
          <rs-badge
            :variant="getStatusVariant(applicationData.statusPermohonan)"
            class="text-sm px-4 py-2"
          >
            {{ applicationData.statusPermohonan }}
          </rs-badge>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Main Content -->
        <div class="lg:col-span-2 space-y-6">
          <!-- Section 1: Maklumat Permohonan (Read-only) -->
          <rs-card class="shadow-sm border-0 bg-white">
            <template #header>
              <div class="flex items-center space-x-3">
                <div class="flex-shrink-0">
                  <div class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Icon name="ph:clipboard-text" class="w-6 h-6 text-blue-600" />
                  </div>
                </div>
                <div>
                  <h2 class="text-lg font-semibold text-gray-900">
                    Maklumat Permohonan
                  </h2>
                  <p class="text-sm text-gray-500">
                    Butiran lengkap permohonan bantuan
                  </p>
                </div>
              </div>
            </template>

            <template #body>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="space-y-1">
                  <label class="text-sm font-medium text-gray-700">ID Permohonan</label>
                  <div class="mt-1 p-3 bg-gray-50 rounded-lg border">
                    <span class="text-sm font-mono text-gray-900">{{
                      applicationData.idPermohonan
                    }}</span>
                  </div>
                </div>

                <div class="space-y-1">
                  <label class="text-sm font-medium text-gray-700">Nama Pemohon / Institusi</label>
                  <div class="mt-1 p-3 bg-gray-50 rounded-lg border">
                    <span class="text-sm text-gray-900">{{
                      applicationData.namaPemohon
                    }}</span>
                  </div>
                </div>

                <div class="space-y-1">
                  <label class="text-sm font-medium text-gray-700">Jenis Bantuan</label>
                  <div class="mt-1">
                    <FormKit
                      v-model="applicationData.jenisBantuan"
                      type="select"
                      :options="jenisBantuanOptions"
                      :classes="{
                        input: '!py-2',
                      }"
                    />
                  </div>
                </div>

                <div class="space-y-1">
                  <label class="text-sm font-medium text-gray-700">Status Permohonan</label>
                  <div class="mt-1 p-3 bg-gray-50 rounded-lg border">
                    <rs-badge
                      :variant="getStatusVariant(applicationData.statusPermohonan)"
                      class="text-sm"
                    >
                      {{ applicationData.statusPermohonan }}
                    </rs-badge>
                  </div>
                </div>

                <div class="space-y-1 md:col-span-2">
                  <label class="text-sm font-medium text-gray-700">Alamat Lokasi</label>
                  <div class="mt-1 p-3 bg-gray-50 rounded-lg border">
                    <span class="text-sm text-gray-900">{{
                      applicationData.alamatLokasi
                    }}</span>
                  </div>
                </div>
              </div>
            </template>
          </rs-card>

          <!-- Section 2: BQ Actions -->
          <rs-card class="shadow-sm border-0 bg-white">
            <template #header>
              <div class="flex items-center justify-between">
                <div class="flex items-center space-x-3">
                  <div class="flex-shrink-0">
                    <div class="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                      <Icon name="ph:calculator" class="w-6 h-6 text-indigo-600" />
                    </div>
                  </div>
                  <div>
                    <h2 class="text-lg font-semibold text-gray-900">
                      Bill of Quantities (BQ)
                    </h2>
                    <p class="text-sm text-gray-500">
                      Semak BQ dan berikan tandatangan sokongan
                    </p>
                  </div>
                </div>
                <rs-button
                  variant="primary-outline"
                  @click="handleViewBQ"
                  class="flex items-center gap-2"
                >
                  <Icon name="ph:eye" class="w-4 h-4" />
                  Lihat BQ
                </rs-button>
              </div>
            </template>

            <template #body>
              <div class="space-y-4">
                <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div class="flex items-start space-x-3">
                    <Icon name="ph:info" class="w-5 h-5 text-blue-600 mt-0.5" />
                    <div>
                      <h4 class="font-medium text-blue-900">
                        Maklumat BQ
                      </h4>
                      <p class="text-sm text-blue-700 mt-1">
                        Klik butang "Lihat BQ" untuk membuka halaman BQ lengkap dengan jadual dan butiran tandatangan sokongan.
                      </p>
                    </div>
                  </div>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div class="space-y-1">
                    <label class="text-sm font-medium text-gray-700">Jumlah Item BQ</label>
                    <div class="mt-1 p-3 bg-gray-50 rounded-lg border">
                      <span class="text-sm text-gray-900">{{ applicationData.jumlahItemBQ }}</span>
                    </div>
                  </div>

                  <div class="space-y-1">
                    <label class="text-sm font-medium text-gray-700">Status Tandatangan</label>
                    <div class="mt-1 p-3 bg-gray-50 rounded-lg border">
                      <rs-badge
                        :variant="applicationData.statusTandatangan === 'Belum Ditandatangani' ? 'warning' : 'success'"
                        class="text-sm"
                      >
                        {{ applicationData.statusTandatangan }}
                      </rs-badge>
                    </div>
                  </div>
                </div>
              </div>
            </template>
          </rs-card>

          <!-- Section 3: Laporan Gambar -->
          <rs-card class="shadow-sm border-0 bg-white">
            <template #header>
              <div class="flex items-center justify-between">
                <div class="flex items-center space-x-3">
                  <div class="flex-shrink-0">
                    <div class="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                      <Icon name="ph:images" class="w-6 h-6 text-green-600" />
                    </div>
                  </div>
                  <div>
                    <h2 class="text-lg font-semibold text-gray-900">
                      Laporan Gambar
                    </h2>
                    <p class="text-sm text-gray-500">
                      Lihat semua gambar lokasi dan catatan
                    </p>
                  </div>
                </div>
                <rs-button
                  variant="secondary-outline"
                  @click="handleViewImages"
                  class="flex items-center gap-2"
                >
                  <Icon name="ph:camera" class="w-4 h-4" />
                  Laporan Gambar
                </rs-button>
              </div>
            </template>

            <template #body>
              <div class="space-y-4">
                <div class="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div class="flex items-start space-x-3">
                    <Icon name="ph:info" class="w-5 h-5 text-green-600 mt-0.5" />
                    <div>
                      <h4 class="font-medium text-green-900">
                        Gambar Lokasi Tersedia
                      </h4>
                      <p class="text-sm text-green-700 mt-1">
                        Terdapat gambar-gambar lokasi dan catatan untuk permohonan ini. Klik butang untuk melihat laporan lengkap.
                      </p>
                    </div>
                  </div>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div class="space-y-1">
                    <label class="text-sm font-medium text-gray-700">Jumlah Gambar</label>
                    <div class="mt-1 p-3 bg-gray-50 rounded-lg border">
                      <span class="text-sm text-gray-900">{{ applicationData.jumlahGambar }} gambar</span>
                    </div>
                  </div>

                  <div class="space-y-1">
                    <label class="text-sm font-medium text-gray-700">Tarikh Gambar</label>
                    <div class="mt-1 p-3 bg-gray-50 rounded-lg border">
                      <span class="text-sm text-gray-900">{{ applicationData.tarikhGambar }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </template>
          </rs-card>

          <!-- Section 4: Laporan Teknikal -->
          <rs-card class="shadow-sm border-0 bg-white">
            <template #header>
              <div class="flex items-center justify-between">
                <div class="flex items-center space-x-3">
                  <div class="flex-shrink-0">
                    <div class="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                      <Icon name="ph:file-text" class="w-6 h-6 text-orange-600" />
                    </div>
                  </div>
                  <div>
                    <h2 class="text-lg font-semibold text-gray-900">
                      Laporan Teknikal
                    </h2>
                    <p class="text-sm text-gray-500">
                      Lihat laporan teknikal lengkap
                    </p>
                  </div>
                </div>
                <rs-button
                  variant="secondary-outline"
                  @click="handleViewTechnicalReport"
                  class="flex items-center gap-2"
                >
                  <Icon name="ph:file-pdf" class="w-4 h-4" />
                  Laporan Teknikal
                </rs-button>
              </div>
            </template>

            <template #body>
              <div class="space-y-4">
                <div class="bg-orange-50 border border-orange-200 rounded-lg p-4">
                  <div class="flex items-start space-x-3">
                    <Icon name="ph:info" class="w-5 h-5 text-orange-600 mt-0.5" />
                    <div>
                      <h4 class="font-medium text-orange-900">
                        Laporan Teknikal Tersedia
                      </h4>
                      <p class="text-sm text-orange-700 mt-1">
                        Laporan teknikal mengandungi latar belakang, keperluan, cadangan, dan nilai kerja yang dicadangkan.
                      </p>
                    </div>
                  </div>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div class="space-y-1">
                    <label class="text-sm font-medium text-gray-700">Nilai Kerja Dicadangkan</label>
                    <div class="mt-1 p-3 bg-gray-50 rounded-lg border">
                      <span class="text-sm font-semibold text-gray-900">{{ applicationData.nilaiKerjaDicadangkan }}</span>
                    </div>
                  </div>

                  <div class="space-y-1">
                    <label class="text-sm font-medium text-gray-700">Status Laporan</label>
                    <div class="mt-1 p-3 bg-gray-50 rounded-lg border">
                      <rs-badge variant="success" class="text-sm">
                        Lengkap
                      </rs-badge>
                    </div>
                  </div>
                </div>
              </div>
            </template>
          </rs-card>

          <!-- Section 5: Catatan Sokongan / Ulasan -->
          <rs-card class="shadow-sm border-0 bg-white">
            <template #header>
              <div class="flex items-center space-x-3">
                <div class="flex-shrink-0">
                  <div class="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Icon name="ph:chat-text" class="w-6 h-6 text-purple-600" />
                  </div>
                </div>
                <div>
                  <h2 class="text-lg font-semibold text-gray-900">
                    Catatan Sokongan / Ulasan
                  </h2>
                  <p class="text-sm text-gray-500">
                    Berikan catatan atau ulasan untuk permohonan ini
                  </p>
                </div>
              </div>
            </template>

            <template #body>
              <div class="space-y-4">
                <div class="space-y-2">
                  <label class="text-sm font-medium text-gray-700">
                    Catatan Sokongan / Ulasan
                    <span v-if="requiresComments" class="text-red-500">*</span>
                  </label>
                  <FormKit
                    v-model="form.catatanSokongan"
                    type="textarea"
                    :placeholder="requiresComments 
                      ? 'Sila berikan catatan atau ulasan (Wajib untuk Rework atau Pinda)'
                      : 'Catatan atau ulasan tambahan (Pilihan)'"
                    rows="5"
                    :validation="requiresComments ? 'required' : ''"
                    :classes="{
                      input: 'min-h-[120px] resize-y',
                    }"
                  />
                </div>

                <div
                  v-if="requiresComments"
                  class="bg-yellow-50 border border-yellow-200 rounded-lg p-4"
                >
                  <div class="flex items-start space-x-3">
                    <Icon name="ph:warning" class="w-5 h-5 text-yellow-600 mt-0.5" />
                    <div>
                      <h4 class="font-medium text-yellow-800">
                        Catatan Diperlukan
                      </h4>
                      <p class="text-sm text-yellow-700 mt-1">
                        Catatan sokongan atau ulasan adalah wajib apabila memilih tindakan Rework atau Pinda.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </template>
          </rs-card>

          <!-- Section 8: Log Audit -->
          <rs-card class="shadow-sm border-0 bg-white">
            <template #header>
              <div class="flex items-center space-x-3">
                <div class="flex-shrink-0">
                  <div class="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                    <Icon name="ph:clock-clockwise" class="w-6 h-6 text-gray-600" />
                  </div>
                </div>
                <div>
                  <h2 class="text-lg font-semibold text-gray-900">
                    Log Audit
                  </h2>
                  <p class="text-sm text-gray-500">
                    Sejarah tindakan dan perubahan
                  </p>
                </div>
              </div>
            </template>

            <template #body>
              <div class="space-y-4">
                <div
                  v-for="(log, index) in auditLogs"
                  :key="index"
                  class="border-l-4 border-blue-500 pl-4 py-2"
                >
                  <div class="flex items-start justify-between">
                    <div>
                      <h4 class="font-medium text-gray-900">{{ log.tindakan }}</h4>
                      <p class="text-sm text-gray-600 mt-1">{{ log.catatan }}</p>
                      <div class="flex items-center gap-4 mt-2 text-xs text-gray-500">
                        <span>Oleh: {{ log.oleh }}</span>
                        <span>{{ log.masa }}</span>
                      </div>
                    </div>
                    <rs-badge
                      :variant="getAuditStatusVariant(log.status)"
                      class="text-xs"
                    >
                      {{ log.status }}
                    </rs-badge>
                  </div>
                </div>
              </div>
            </template>
          </rs-card>
        </div>

        <!-- Sidebar - Action Panel -->
        <div class="lg:col-span-1 space-y-6">
          <rs-card class="shadow-sm border-0 bg-white sticky top-6">
            <template #header>
              <div class="flex items-center space-x-3">
                <div class="flex-shrink-0">
                  <div class="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                    <Icon name="ph:gear" class="w-6 h-6 text-red-600" />
                  </div>
                </div>
                <div>
                  <h2 class="text-lg font-semibold text-gray-900">Tindakan</h2>
                  <p class="text-sm text-gray-500">Pilih tindakan yang sesuai</p>
                </div>
              </div>
            </template>

            <template #body>
              <div class="space-y-4">
                <!-- Status Info -->
                <div class="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div class="flex items-center space-x-2">
                    <Icon name="ph:info" class="w-5 h-5 text-blue-600" />
                    <span class="font-medium text-blue-800">Status Semasa</span>
                  </div>
                  <p class="text-sm text-blue-700 mt-1">
                    {{ applicationData.statusPermohonan }}
                  </p>
                </div>

                <!-- SLA Timer -->
                <div class="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div class="flex items-center space-x-2">
                    <Icon name="ph:timer" class="w-5 h-5 text-yellow-600" />
                    <span class="font-medium text-yellow-800">SLA Timer</span>
                  </div>
                  <p class="text-sm text-yellow-700 mt-1">
                    {{ slaInfo.timeRemaining }} hari lagi
                  </p>
                  <div class="w-full bg-yellow-200 rounded-full h-2 mt-2">
                    <div
                      class="bg-yellow-600 h-2 rounded-full transition-all duration-300"
                      :style="{ width: slaInfo.progressPercentage + '%' }"
                    ></div>
                  </div>
                </div>

                <!-- Action Buttons -->
                <div class="space-y-3 pt-4 border-t">
                  <rs-button
                    variant="danger"
                    @click="handleRework"
                    :disabled="processing"
                    :loading="processing && selectedAction === 'rework'"
                    class="w-full !py-3 text-sm font-medium"
                  >
                    <Icon name="ph:arrow-counter-clockwise" class="w-5 h-5 mr-2" />
                    Rework
                  </rs-button>

                  <rs-button
                    variant="primary"
                    @click="handleApproveSupport"
                    :disabled="processing"
                    :loading="processing && selectedAction === 'approve'"
                    class="w-full !py-3 text-sm font-medium"
                  >
                    <Icon name="ph:check" class="w-5 h-5 mr-2" />
                    Sahkan Sokongan
                  </rs-button>

                  <rs-button
                    variant="primary-outline"
                    @click="handleBack"
                    class="w-full !py-3 text-sm font-medium"
                  >
                    <Icon name="ph:arrow-left" class="w-5 h-5 mr-2" />
                    Kembali
                  </rs-button>
                </div>

                <!-- Validation Messages -->
                <div
                  v-if="showValidation && requiresComments && !form.catatanSokongan"
                  class="p-3 bg-red-50 border border-red-200 rounded-lg"
                >
                  <div class="flex items-start space-x-2">
                    <Icon name="ph:warning" class="w-4 h-4 text-red-600 mt-0.5" />
                    <p class="text-sm text-red-700">
                      Sila berikan catatan sokongan sebelum meneruskan tindakan.
                    </p>
                  </div>
                </div>
              </div>
            </template>
          </rs-card>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useToast } from "vue-toastification";

const route = useRoute();
const router = useRouter();
const toast = useToast();

const processing = ref(false);
const selectedAction = ref("");
const showValidation = ref(false);

definePageMeta({
  title: "Semakan Sokongan Pinda Bantuan",
});

const breadcrumb = ref([
  {
    name: "Senarai Permohonan",
    type: "link",
    path: "/BF-BTN/permohonan/semakan-sokongan-pinda-bantuan",
  },
  {
    name: "Semak Permohonan",
    type: "current",
    path: `/BF-BTN/permohonan/semakan-sokongan-pinda-bantuan/${route.params.id}`,
  },
]);

// Form data
const form = ref({
  catatanSokongan: "",
});

// Application data - would be fetched from API based on route.params.id
const applicationData = ref({
  idPermohonan: "",
  namaPemohon: "",
  jenisBantuan: "",
  statusPermohonan: "",
  alamatLokasi: "",
  jumlahItemBQ: 0,
  statusTandatangan: "Belum Ditandatangani",
  jumlahGambar: 0,
  tarikhGambar: "",
  nilaiKerjaDicadangkan: "",
});

// SLA Information
const slaInfo = ref({
  timeRemaining: 5,
  progressPercentage: 60,
});

// Audit Logs
const auditLogs = ref([]);

// Options
const jenisBantuanOptions = [
  { label: "Bantuan Masjid", value: "bantuan_masjid" },
  { label: "Bantuan Rumah", value: "bantuan_rumah" },
  { label: "Bantuan Perniagaan", value: "bantuan_perniagaan" },
  { label: "Bantuan Pendidikan", value: "bantuan_pendidikan" },
];

// Computed
const requiresComments = computed(() => {
  return selectedAction.value === 'rework' || selectedAction.value === 'pinda';
});

// Methods
const getStatusVariant = (status) => {
  const variants = {
    "Menunggu Semakan": "warning",
    "Dalam Semakan": "info",
    "Diluluskan": "success",
    "Ditolak": "danger",
    "Rework Required": "danger",
  };
  return variants[status] || "default";
};

const getAuditStatusVariant = (status) => {
  const variants = {
    "Selesai": "success",
    "Dalam Proses": "info",
    "Rework": "warning",
    "Ditolak": "danger",
  };
  return variants[status] || "default";
};

const handleViewBQ = () => {
  // Open BQ page in new tab or navigate
  window.open(`/BF-BTN/permohonan/semakan-sokongan-pinda-bantuan/${route.params.id}/bq`, '_blank');
};

const handleViewImages = () => {
  // Open images report page
  window.open(`/BF-BTN/permohonan/semakan-sokongan-pinda-bantuan/${route.params.id}/laporan-gambar`, '_blank');
};

const handleViewTechnicalReport = () => {
  // Open technical report page
  window.open(`/BF-BTN/permohonan/semakan-sokongan-pinda-bantuan/${route.params.id}/laporan-teknikal`, '_blank');
};

const handleRework = async () => {
  selectedAction.value = 'rework';
  
  if (!form.value.catatanSokongan) {
    showValidation.value = true;
    toast.error("Sila berikan catatan sokongan untuk tindakan Rework");
    return;
  }

  try {
    processing.value = true;

    const reworkData = {
      applicationId: applicationData.value.idPermohonan,
      catatan: form.value.catatanSokongan,
      tindakan: "Rework",
      timestamp: new Date().toISOString(),
    };

    // Simulate API call
    console.log("Processing Rework:", reworkData);
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Update status
    applicationData.value.statusPermohonan = "Rework Required";

    // Add audit log
    auditLogs.value.unshift({
      tindakan: "Rework Dihantar",
      catatan: form.value.catatanSokongan,
      oleh: "Panel Hartanah",
      masa: new Date().toLocaleString("ms-MY"),
      status: "Rework",
    });

    toast.success("Permohonan telah dihantar untuk Rework ke ETD");
    
    // Navigate back to list after delay
    setTimeout(() => {
      router.push("/BF-BTN/permohonan/semakan-sokongan-pinda-bantuan");
    }, 1500);
  } catch (error) {
    toast.error("Ralat semasa memproses Rework");
    console.error(error);
  } finally {
    processing.value = false;
    selectedAction.value = "";
  }
};

const handleApproveSupport = async () => {
  selectedAction.value = 'approve';

  try {
    processing.value = true;

    const approvalData = {
      applicationId: applicationData.value.idPermohonan,
      catatan: form.value.catatanSokongan || "Tiada catatan tambahan",
      tindakan: "Sahkan Sokongan",
      timestamp: new Date().toISOString(),
    };

    // Simulate API call
    console.log("Processing Approval:", approvalData);
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Update status
    applicationData.value.statusPermohonan = "Sokongan Disahkan";

    // Add audit log
    auditLogs.value.unshift({
      tindakan: "Sokongan Disahkan",
      catatan: form.value.catatanSokongan || "Tiada catatan tambahan",
      oleh: "Panel Hartanah",
      masa: new Date().toLocaleString("ms-MY"),
      status: "Selesai",
    });

    toast.success("Sokongan telah berjaya disahkan dan dihantar ke peringkat Kelulusan");
    
    // Navigate back to list after delay
    setTimeout(() => {
      router.push("/BF-BTN/permohonan/semakan-sokongan-pinda-bantuan");
    }, 1500);
  } catch (error) {
    toast.error("Ralat semasa mengesahkan sokongan");
    console.error(error);
  } finally {
    processing.value = false;
    selectedAction.value = "";
  }
};

const handleBack = () => {
  router.push("/BF-BTN/permohonan/semakan-sokongan-pinda-bantuan");
};

// Fetch application data on mount
onMounted(async () => {
  try {
    const applicationId = route.params.id;

    // Mock data - would be API call in real implementation
    applicationData.value = {
      idPermohonan: applicationId,
      namaPemohon: "Ahmad bin Abdullah",
      jenisBantuan: "bantuan_masjid",
      statusPermohonan: "Menunggu Semakan",
      alamatLokasi: "No. 123, Jalan Merdeka, Taman Sejahtera, 50000 Kuala Lumpur",
      jumlahItemBQ: 25,
      statusTandatangan: "Belum Ditandatangani",
      jumlahGambar: 12,
      tarikhGambar: "20 Nov 2024",
      nilaiKerjaDicadangkan: "RM 150,000.00",
    };

    // Mock audit logs
    auditLogs.value = [
      {
        tindakan: "Permohonan Diterima",
        catatan: "Permohonan baru diterima dari ETD",
        oleh: "Sistem",
        masa: "19 Nov 2024, 10:30 AM",
        status: "Selesai",
      },
      {
        tindakan: "Dokumen Diupload",
        catatan: "BQ dan laporan teknikal telah diupload",
        oleh: "Pegawai ETD",
        masa: "19 Nov 2024, 2:15 PM",
        status: "Selesai",
      },
    ];
  } catch (error) {
    toast.error("Ralat semasa memuatkan data permohonan");
    console.error(error);
  }
});
</script>

<style lang="scss" scoped>
// Custom styling for the support review page
.support-review-page {
  .status-badge {
    @apply inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium;
  }

  .action-button {
    @apply transition-all duration-200 hover:transform hover:scale-105;
  }

  .audit-timeline {
    .timeline-item {
      @apply relative;
      
      &:not(:last-child)::after {
        content: '';
        @apply absolute left-0 top-8 w-0.5 h-full bg-gray-200;
      }
    }
  }
}

// Enhanced focus states
.focus\:ring-2:focus {
  outline: none;
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.5);
}

// Custom background colors for status
.bg-blue-50 {
  background-color: #eff6ff;
}

.bg-green-50 {
  background-color: #f0fdf4;
}

.bg-yellow-50 {
  background-color: #fefce8;
}

.bg-orange-50 {
  background-color: #fff7ed;
}

.bg-purple-50 {
  background-color: #faf5ff;
}

.bg-red-50 {
  background-color: #fef2f2;
}

// Border colors
.border-blue-200 {
  border-color: #bfdbfe;
}

.border-green-200 {
  border-color: #bbf7d0;
}

.border-yellow-200 {
  border-color: #fef3c7;
}

.border-orange-200 {
  border-color: #fed7aa;
}

.border-purple-200 {
  border-color: #e9d5ff;
}

.border-red-200 {
  border-color: #fecaca;
}

// Text colors
.text-blue-600 {
  color: #2563eb;
}

.text-blue-700 {
  color: #1d4ed8;
}

.text-blue-800 {
  color: #1e40af;
}

.text-blue-900 {
  color: #1e3a8a;
}

.text-green-600 {
  color: #16a34a;
}

.text-green-700 {
  color: #15803d;
}

.text-green-800 {
  color: #166534;
}

.text-green-900 {
  color: #14532d;
}

.text-yellow-600 {
  color: #ca8a04;
}

.text-yellow-700 {
  color: #a16207;
}

.text-yellow-800 {
  color: #854d0e;
}

.text-orange-600 {
  color: #ea580c;
}

.text-orange-700 {
  color: #c2410c;
}

.text-orange-800 {
  color: #9a3412;
}

.text-orange-900 {
  color: #7c2d12;
}

.text-purple-600 {
  color: #9333ea;
}

.text-purple-700 {
  color: #7c3aed;
}

.text-purple-800 {
  color: #6b21a8;
}

.text-purple-900 {
  color: #581c87;
}

.text-red-600 {
  color: #dc2626;
}

.text-red-700 {
  color: #b91c1c;
}

.text-red-800 {
  color: #991b1b;
}

.text-red-900 {
  color: #7f1d1d;
}
</style>
