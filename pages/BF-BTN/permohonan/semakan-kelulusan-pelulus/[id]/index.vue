<template>
  <div class="min-h-screen">
    <div class="  ">
      <LayoutsBreadcrumb :items="breadcrumb" />

      <!-- Page Header -->
      <div class="mt-6 mb-8">
        <div
          class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
        >
          <div>
            <h1 class="text-2xl font-bold text-gray-900">Pengesahan & Kelulusan Permohonan</h1>
            <p class="mt-1 text-sm text-gray-600">
              Panel kelulusan untuk menyemak dokumen dan membuat keputusan rasmi terhadap permohonan
            </p>
          </div>
          <rs-badge
            :variant="getStatusVariant(permohonanData.status)"
            class="text-sm px-4 py-2"
          >
            {{ permohonanData.status }}
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
                  <div
                    class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center"
                  >
                    <Icon name="ph:file-text" class="w-6 h-6 text-blue-600" />
                  </div>
                </div>
                <div>
                  <h2 class="text-lg font-semibold text-gray-900">
                    Maklumat Permohonan
                  </h2>
                  <p class="text-sm text-gray-500">
                    Butiran asas permohonan bantuan (Paparan sahaja)
                  </p>
                </div>
              </div>
            </template>

            <template #body>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="space-y-1">
                  <label class="text-sm font-medium text-gray-700"
                    >ID Permohonan</label
                  >
                  <div class="mt-1 p-3 bg-gray-50 rounded-lg border">
                    <span class="text-sm font-mono text-gray-900">{{
                      formData.idPermohonan
                    }}</span>
                  </div>
                </div>

                <div class="space-y-1">
                  <label class="text-sm font-medium text-gray-700"
                    >Nama Pemohon / Institusi</label
                  >
                  <div class="mt-1 p-3 bg-gray-50 rounded-lg border">
                    <span class="text-sm text-gray-900">{{
                      formData.namaPemohon
                    }}</span>
                  </div>
                </div>

                <div class="space-y-1">
                  <label class="text-sm font-medium text-gray-700"
                    >Jenis Bantuan</label
                  >
                  <div class="mt-1 p-3 bg-gray-50 rounded-lg border">
                    <span class="text-sm text-gray-900">{{
                      formData.jenisBantuan
                    }}</span>
                  </div>
                </div>

                <div class="space-y-1">
                  <label class="text-sm font-medium text-gray-700"
                    >Status Permohonan</label
                  >
                  <div class="mt-1 p-3 bg-gray-50 rounded-lg border">
                    <span class="text-sm text-gray-900">{{
                      formData.statusPermohonan
                    }}</span>
                  </div>
                </div>
              </div>
            </template>
          </rs-card>

          <!-- Section 2: Dokumen & Catatan (Read-only) -->
          <rs-card class="shadow-sm border-0 bg-white">
            <template #header>
              <div class="flex items-center space-x-3">
                <div class="flex-shrink-0">
                  <div
                    class="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center"
                  >
                    <Icon
                      name="ph:files"
                      class="w-6 h-6 text-purple-600"
                    />
                  </div>
                </div>
                <div>
                  <h2 class="text-lg font-semibold text-gray-900">
                    Dokumen & Catatan
                  </h2>
                  <p class="text-sm text-gray-500">
                    Akses dokumen berkaitan dan catatan pengesyoran
                  </p>
                </div>
              </div>
            </template>

            <template #body>
              <div class="space-y-6">
                <!-- Document Access Section -->
                <div>
                  <h3 class="text-sm font-medium text-gray-900 mb-4">Dokumen Berkaitan</h3>
                  <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <rs-button
                      variant="primary-outline"
                      @click="viewBQ"
                      class="!p-4 !h-auto flex flex-col items-center space-y-2"
                    >
                      <Icon name="ph:file-text" class="w-6 h-6" />
                      <span class="text-sm font-medium">BQ</span>
                      <span class="text-xs text-gray-500">Paparan Penuh</span>
                    </rs-button>
                    
                    <rs-button
                      variant="primary-outline"
                      @click="viewLaporanGambar"
                      class="!p-4 !h-auto flex flex-col items-center space-y-2"
                    >
                      <Icon name="ph:image" class="w-6 h-6" />
                      <span class="text-sm font-medium">Laporan Gambar</span>
                      <span class="text-xs text-gray-500">Paparan</span>
                    </rs-button>
                    
                    <rs-button
                      variant="primary-outline"
                      @click="viewLaporanTeknikal"
                      class="!p-4 !h-auto flex flex-col items-center space-y-2"
                    >
                      <Icon name="ph:file-doc" class="w-6 h-6" />
                      <span class="text-sm font-medium">Laporan Teknikal</span>
                      <span class="text-xs text-gray-500">Paparan</span>
                    </rs-button>
                  </div>
                </div>

                <!-- Notes Section -->
                <div class="space-y-4">
                  <h3 class="text-sm font-medium text-gray-900">Catatan & Ulasan</h3>
                  
                  <!-- ETD Notes -->
                  <div class="space-y-1">
                    <label class="text-sm font-medium text-gray-700 flex items-center">
                      <Icon name="ph:note" class="w-4 h-4 mr-2 text-blue-600" />
                      Catatan Pengesyoran ETD
                    </label>
                    <div class="mt-1 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <div class="text-sm text-blue-800">
                        {{ formData.catatanETD || 'Tiada catatan dari ETD' }}
                      </div>
                    </div>
                  </div>
                  
                  <!-- Property Support Notes -->
                  <div class="space-y-1">
                    <label class="text-sm font-medium text-gray-700 flex items-center">
                      <Icon name="ph:buildings" class="w-4 h-4 mr-2 text-green-600" />
                      Catatan Sokongan Hartanah
                    </label>
                    <div class="mt-1 p-4 bg-green-50 border border-green-200 rounded-lg">
                      <div class="text-sm text-green-800">
                        {{ formData.catatanHartanah || 'Tiada catatan sokongan hartanah' }}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </template>
          </rs-card>
        </div>

        <!-- Sidebar - Section 3: Keputusan Kelulusan -->
        <div class="lg:col-span-1 space-y-6">
          <rs-card class="shadow-sm border-0 bg-white sticky top-6">
            <template #header>
              <div class="flex items-center space-x-3">
                <div class="flex-shrink-0">
                  <div
                    class="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center"
                  >
                    <Icon
                      name="ph:gavel"
                      class="w-6 h-6 text-orange-600"
                    />
                  </div>
                </div>
                <div>
                  <h2 class="text-lg font-semibold text-gray-900">
                    Keputusan Kelulusan
                  </h2>
                  <p class="text-sm text-gray-500">
                    Buat keputusan dan catatan rasmi
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
                  <!-- Decision Selection -->
                  <div class="space-y-1">
                    <FormKit
                      type="select"
                      name="keputusanKelulusan"
                      label="Keputusan Kelulusan"
                      :options="keputusanOptions"
                      validation="required"
                      :validation-messages="{
                        required: 'Sila pilih keputusan kelulusan',
                      }"
                      placeholder="Pilih keputusan"
                      :classes="{ outer: 'mb-0' }"
                    />
                  </div>

                  <!-- Approval Notes -->
                  <div class="space-y-1">
                    <FormKit
                      type="textarea"
                      name="catatanKelulusan"
                      :label="getCatatanLabel()"
                      :validation="getCatatanValidation()"
                      :validation-messages="{
                        required: 'Catatan diperlukan untuk keputusan ini',
                      }"
                      rows="5"
                      :placeholder="getCatatanPlaceholder()"
                      :classes="{ outer: 'mb-0' }"
                    />
                  </div>

                  <!-- Decision Status Display -->
                  <div 
                    v-if="formData.keputusanKelulusan"
                    class="p-4 rounded-lg border"
                    :class="getDecisionDisplayClass()"
                  >
                    <div class="flex items-center space-x-2">
                      <Icon 
                        :name="getDecisionIcon()" 
                        class="w-5 h-5"
                        :class="getDecisionIconClass()"
                      />
                      <span class="text-sm font-medium" :class="getDecisionTextClass()">
                        Keputusan: {{ formData.keputusanKelulusan }}
                      </span>
                    </div>
                  </div>

                  <!-- Action Buttons -->
                  <div class="space-y-3 pt-4 border-t">
                    <rs-button
                      variant="primary"
                      @click="handleSubmit"
                      :disabled="!isFormValid"
                      class="w-full !py-3 text-sm font-medium"
                    >
                      <Icon name="ph:check-circle" class="w-5 h-5 mr-2" />
                      Simpan Keputusan
                    </rs-button>

                    <rs-button
                      variant="primary-outline"
                      @click="handleCancel"
                      class="w-full !py-3 text-sm font-medium"
                    >
                      <Icon name="ph:x" class="w-5 h-5 mr-2" />
                      Batal
                    </rs-button>
                  </div>

                  <!-- Form Validation Status -->
                  <div
                    v-if="!isFormValid"
                    class="p-4 bg-yellow-50 border border-yellow-200 rounded-lg"
                  >
                    <div class="flex">
                      <Icon
                        name="ph:warning"
                        class="w-5 h-5 text-yellow-400 mt-0.5"
                      />
                      <div class="ml-3">
                        <h3 class="text-sm font-medium text-yellow-800">
                          Keputusan Diperlukan
                        </h3>
                        <p class="mt-1 text-xs text-yellow-700">
                          Sila buat keputusan kelulusan sebelum menyimpan.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </FormKit>
            </template>
          </rs-card>
        </div>
      </div>
    </div>

    <!-- Success Modal -->
    <rs-modal
      v-model="showSuccessModal"
      title="Keputusan Disimpan"
      size="md"
      position="center"
    >
      <template #body>
        <div class="space-y-6">
          <div class="text-center">
            <div
              class="mx-auto flex items-center justify-center h-16 w-16 rounded-full"
              :class="getSuccessModalIconClass()"
            >
              <Icon :name="getSuccessModalIcon()" class="h-8 w-8" />
            </div>
            <h3 class="mt-4 text-lg font-semibold text-gray-900">
              Keputusan Disimpan
            </h3>
            <p class="mt-2 text-sm text-gray-600">
              Keputusan kelulusan telah berjaya disimpan dan direkodkan.
            </p>
          </div>

          <div class="bg-gray-50 p-4 rounded-lg space-y-3">
            <div class="flex justify-between items-center">
              <span class="text-sm font-medium text-gray-700"
                >ID Permohonan:</span
              >
              <span class="text-sm font-mono text-gray-900">{{
                formData.idPermohonan
              }}</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-sm font-medium text-gray-700"
                >Keputusan:</span
              >
              <rs-badge
                :variant="getDecisionBadgeVariant(formData.keputusanKelulusan)"
                class="text-xs"
              >
                {{ formData.keputusanKelulusan }}
              </rs-badge>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-sm font-medium text-gray-700"
                >Tarikh Keputusan:</span
              >
              <span class="text-sm text-gray-900">{{
                formatDateTime(new Date())
              }}</span>
            </div>
          </div>

          <div class="p-4 border rounded-lg" :class="getSuccessModalMessageClass()">
            <p class="text-sm flex items-center">
              <Icon
                :name="getSuccessModalIcon()"
                class="w-5 h-5 mr-2 flex-shrink-0"
              />
              {{ getSuccessMessage() }}
            </p>
          </div>
        </div>
      </template>

      <template #footer>
        <div class="flex justify-center">
          <rs-button variant="primary" @click="handleBackToList">
            OK
          </rs-button>
        </div>
      </template>
    </rs-modal>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();

definePageMeta({
  title: "Pengesahan & Kelulusan Permohonan",
});

const breadcrumb = ref([
  {
    name: "Permohonan Bantuan",
    type: "link",
    path: "/BF-BTN/permohonan/senarai-untuk-disemak",
  },
  {
    name: "Panel Kelulusan",
    type: "link",
    path: "/BF-BTN/permohonan/panel-kelulusan",
  },
  {
    name: "Pengesahan & Kelulusan",
    type: "current",
    path: `/BF-BTN/permohonan/semakan-kelulusan-pelulus/${route.params.id}`,
  },
]);

// Mock data - would be replaced with API call
const permohonanData = ref({
  status: "Untuk Kelulusan",
});

// Form data
const formData = ref({
  // Section 1: Maklumat Permohonan (Read-only)
  idPermohonan: "NAS-2025-0001",
  namaPemohon: "Masjid Al-Ikhlas / Selangor",
  jenisBantuan: "Bantuan Pembaikan & Penyelenggaraan",
  statusPermohonan: "Untuk Kelulusan",

  // Section 2: Catatan dari bahagian lain (Read-only)
  catatanETD: "Permohonan ini telah disemak dan disokong oleh ETD. Semua dokumen lengkap dan anggaran kos adalah munasabah. Projek ini memenuhi kriteria bantuan yang ditetapkan.",
  catatanHartanah: "Panel Hartanah menyokong permohonan ini. Tanah adalah milik pemohon dengan dokumentasi yang sah. Tiada isu berkaitan status tanah atau hakmilik.",

  // Section 3: Keputusan Kelulusan (Editable)
  keputusanKelulusan: "",
  catatanKelulusan: "",
});

// Configuration data
const keputusanOptions = [
  { label: "-- Pilih Keputusan --", value: "", disabled: true },
  { label: "Lulus", value: "Lulus" },
  { label: "Tolak", value: "Tolak" },
  { label: "Tindakan Lanjut", value: "Tindakan Lanjut" },
];

// Modals
const showSuccessModal = ref(false);

// Computed
const isFormValid = computed(() => {
  return formData.value.keputusanKelulusan !== "";
});

// Methods for catatan label and validation based on decision
const getCatatanLabel = () => {
  const decision = formData.value.keputusanKelulusan;
  if (decision === "Tolak" || decision === "Tindakan Lanjut") {
    return "Catatan Kelulusan / Alasan *";
  }
  return "Catatan Kelulusan / Alasan";
};

const getCatatanValidation = () => {
  const decision = formData.value.keputusanKelulusan;
  if (decision === "Tolak" || decision === "Tindakan Lanjut") {
    return "required";
  }
  return "";
};

const getCatatanPlaceholder = () => {
  const decision = formData.value.keputusanKelulusan;
  if (decision === "Lulus") {
    return "Masukkan catatan kelulusan (pilihan)";
  } else if (decision === "Tolak") {
    return "Masukkan alasan penolakan (wajib)";
  } else if (decision === "Tindakan Lanjut") {
    return "Masukkan butiran tindakan lanjut diperlukan (wajib)";
  }
  return "Masukkan catatan";
};

// Decision display methods
const getDecisionDisplayClass = () => {
  const decision = formData.value.keputusanKelulusan;
  switch (decision) {
    case "Lulus":
      return "bg-green-50 border-green-200";
    case "Tolak":
      return "bg-red-50 border-red-200";
    case "Tindakan Lanjut":
      return "bg-yellow-50 border-yellow-200";
    default:
      return "bg-gray-50 border-gray-200";
  }
};

const getDecisionIcon = () => {
  const decision = formData.value.keputusanKelulusan;
  switch (decision) {
    case "Lulus":
      return "ph:check-circle";
    case "Tolak":
      return "ph:x-circle";
    case "Tindakan Lanjut":
      return "ph:clock";
    default:
      return "ph:circle";
  }
};

const getDecisionIconClass = () => {
  const decision = formData.value.keputusanKelulusan;
  switch (decision) {
    case "Lulus":
      return "text-green-600";
    case "Tolak":
      return "text-red-600";
    case "Tindakan Lanjut":
      return "text-yellow-600";
    default:
      return "text-gray-600";
  }
};

const getDecisionTextClass = () => {
  const decision = formData.value.keputusanKelulusan;
  switch (decision) {
    case "Lulus":
      return "text-green-800";
    case "Tolak":
      return "text-red-800";
    case "Tindakan Lanjut":
      return "text-yellow-800";
    default:
      return "text-gray-800";
  }
};

const getDecisionBadgeVariant = (decision) => {
  switch (decision) {
    case "Lulus":
      return "success";
    case "Tolak":
      return "danger";
    case "Tindakan Lanjut":
      return "warning";
    default:
      return "default";
  }
};

// Success modal methods
const getSuccessModalIcon = () => {
  const decision = formData.value.keputusanKelulusan;
  switch (decision) {
    case "Lulus":
      return "ph:check-circle";
    case "Tolak":
      return "ph:x-circle";
    case "Tindakan Lanjut":
      return "ph:clock";
    default:
      return "ph:check-circle";
  }
};

const getSuccessModalIconClass = () => {
  const decision = formData.value.keputusanKelulusan;
  switch (decision) {
    case "Lulus":
      return "bg-green-100 text-green-600";
    case "Tolak":
      return "bg-red-100 text-red-600";
    case "Tindakan Lanjut":
      return "bg-yellow-100 text-yellow-600";
    default:
      return "bg-green-100 text-green-600";
  }
};

const getSuccessModalMessageClass = () => {
  const decision = formData.value.keputusanKelulusan;
  switch (decision) {
    case "Lulus":
      return "bg-green-50 border-green-200 text-green-800";
    case "Tolak":
      return "bg-red-50 border-red-200 text-red-800";
    case "Tindakan Lanjut":
      return "bg-yellow-50 border-yellow-200 text-yellow-800";
    default:
      return "bg-green-50 border-green-200 text-green-800";
  }
};

const getSuccessMessage = () => {
  const decision = formData.value.keputusanKelulusan;
  switch (decision) {
    case "Lulus":
      return "Permohonan telah diluluskan dan siap untuk proses seterusnya.";
    case "Tolak":
      return "Permohonan telah ditolak. Pemohon akan dimaklumkan dengan alasan penolakan.";
    case "Tindakan Lanjut":
      return "Permohonan memerlukan tindakan lanjut sebelum keputusan muktamad.";
    default:
      return "Keputusan telah disimpan dan direkodkan dalam sistem.";
  }
};

const getStatusVariant = (status) => {
  const variants = {
    baru: "info",
    "dalam semakan": "warning",
    "tidak lengkap": "danger",
    "untuk kelulusan": "secondary",
    "untuk siasatan": "secondary",
    lengkap: "success",
    lulus: "success",
    tolak: "danger",
    "tindakan lanjut": "warning",
  };
  return variants[status.toLowerCase()] || "default";
};

const formatDateTime = (date) => {
  return new Date(date).toLocaleString("ms-MY", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

// Document viewing methods
const viewBQ = () => {
  // Navigate to BQ viewing page
  console.log("Opening BQ document viewer");
  // router.push(`/BF-BTN/permohonan/view-bq/${route.params.id}`);
};

const viewLaporanGambar = () => {
  // Navigate to image report page
  console.log("Opening image report viewer");
  // router.push(`/BF-BTN/permohonan/view-laporan-gambar/${route.params.id}`);
};

const viewLaporanTeknikal = () => {
  // Navigate to technical report page
  console.log("Opening technical report viewer");
  // router.push(`/BF-BTN/permohonan/view-laporan-teknikal/${route.params.id}`);
};

const handleSubmit = () => {
  // Validate form
  if (!isFormValid.value) {
    return;
  }

  // Additional validation for required notes
  const decision = formData.value.keputusanKelulusan;
  if ((decision === "Tolak" || decision === "Tindakan Lanjut") && !formData.value.catatanKelulusan.trim()) {
    return;
  }

  // Implement form submission
  console.log("Submitting approval decision:", formData.value);

  // Update permohonan status based on decision
  permohonanData.value.status = formData.value.keputusanKelulusan;

  // Show success modal
  showSuccessModal.value = true;

  // Here you would typically:
  // 1. Save data to database
  // 2. Insert audit trail
  // 3. Update application status
  // 4. Trigger next workflow step
  // 5. Send notifications
};

const handleCancel = () => {
  router.push("/BF-BTN/permohonan/semakan-kelulusan-pelulus");
};

const handleBackToList = () => {
  showSuccessModal.value = false;
  router.push("/BF-BTN/permohonan/semakan-kelulusan-pelulus");
};
</script>

<style lang="scss" scoped>
// Custom animations and transitions
.group:hover .group-hover\:text-blue-600 {
  transition: color 0.2s ease-in-out;
}

// Enhanced focus states
.focus\:ring-2:focus {
  outline: none;
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.5);
}

// Progress bar animation
.transition-all {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
</style>
