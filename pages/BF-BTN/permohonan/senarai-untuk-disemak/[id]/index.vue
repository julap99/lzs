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
            <h1 class="text-2xl font-bold text-gray-900">Semakan Permohonan</h1>
            <p class="mt-1 text-sm text-gray-600">
              Semak dan kemaskini status permohonan bantuan
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
          <!-- Application Information Card -->
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
                    Butiran asas permohonan bantuan
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
                      >Nama Pemohon (Hab/Cawangan)</label
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
                      >Segera</label
                    >
                    <FormKit
                      type="select"
                      name="segera"
                      :options="[
                        { label: 'Ya', value: true },
                        { label: 'Tidak', value: false },
                      ]"
                      :classes="{ wrapper: 'mt-1' }"
                    />
                  </div>

                  <div class="space-y-1">
                    <label class="text-sm font-medium text-gray-700"
                      >Tarikh Permohonan</label
                    >
                    <div class="mt-1 p-3 bg-gray-50 rounded-lg border">
                      <span class="text-sm text-gray-900">{{
                        formData.tarikhPermohonan
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
              </FormKit>
            </template>
          </rs-card>

          <!-- Application Details Card -->
          <rs-card class="shadow-sm border-0 bg-white">
            <template #header>
              <div class="flex items-center space-x-3">
                <div class="flex-shrink-0">
                  <div
                    class="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center"
                  >
                    <Icon
                      name="ph:user-circle"
                      class="w-6 h-6 text-purple-600"
                    />
                  </div>
                </div>
                <div>
                  <h2 class="text-lg font-semibold text-gray-900">
                    Butiran Permohonan
                  </h2>
                  <p class="text-sm text-gray-500">
                    Maklumat lengkap pemohon dan bantuan
                  </p>
                </div>
              </div>
            </template>

            <template #body>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="space-y-1">
                  <label class="text-sm font-medium text-gray-700"
                    >Nama Pemohon</label
                  >
                  <div class="mt-1 p-3 bg-gray-50 rounded-lg border">
                    <span class="text-sm text-gray-900">{{
                      formData.namaPemohonDetail
                    }}</span>
                  </div>
                </div>

                <div class="space-y-1">
                  <label class="text-sm font-medium text-gray-700">No IC</label>
                  <div class="mt-1 p-3 bg-gray-50 rounded-lg border">
                    <span class="text-sm font-mono text-gray-900">{{
                      formData.noIC
                    }}</span>
                  </div>
                </div>

                <div class="space-y-1 md:col-span-2">
                  <label class="text-sm font-medium text-gray-700"
                    >Alamat</label
                  >
                  <div class="mt-1 p-3 bg-gray-50 rounded-lg border">
                    <span class="text-sm text-gray-900">{{
                      formData.alamat
                    }}</span>
                  </div>
                </div>

                <div class="space-y-1">
                  <label class="text-sm font-medium text-gray-700"
                    >Jenis Bantuan</label
                  >
                  <div class="mt-1 p-3 bg-gray-50 rounded-lg border">
                    <span class="text-sm text-gray-900">{{
                      formData.jenisBantuanDetail
                    }}</span>
                  </div>
                </div>

                <div class="space-y-1">
                  <label class="text-sm font-medium text-gray-700"
                    >Kaedah Pembayaran</label
                  >
                  <div class="mt-1 p-3 bg-gray-50 rounded-lg border">
                    <span class="text-sm text-gray-900">{{
                      formData.kaedahPembayaran
                    }}</span>
                  </div>
                </div>

                <div class="space-y-1">
                  <label class="text-sm font-medium text-gray-700"
                    >Jumlah Bantuan</label
                  >
                  <div
                    class="mt-1 p-3 bg-green-50 rounded-lg border border-green-200"
                  >
                    <span class="text-sm font-semibold text-green-800">{{
                      formData.jumlahBantuan
                    }}</span>
                  </div>
                </div>

                <div class="space-y-1 md:col-span-2">
                  <label class="text-sm font-medium text-gray-700"
                    >Keterangan Permohonan</label
                  >
                  <div class="mt-1 p-3 bg-gray-50 rounded-lg border">
                    <span class="text-sm text-gray-900">{{
                      formData.keteranganPermohonan
                    }}</span>
                  </div>
                </div>
              </div>
            </template>
          </rs-card>

          <!-- Document Review Card -->
          <rs-card class="shadow-sm border-0 bg-white">
            <template #header>
              <div class="flex items-center justify-between">
                <div class="flex items-center space-x-3">
                  <div class="flex-shrink-0">
                    <div
                      class="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center"
                    >
                      <Icon name="ph:files" class="w-6 h-6 text-green-600" />
                    </div>
                  </div>
                  <div>
                    <h2 class="text-lg font-semibold text-gray-900">
                      Semakan Dokumen Sokongan
                    </h2>
                    <p class="text-sm text-gray-500">
                      Semak status dan beri catatan untuk setiap dokumen
                    </p>
                  </div>
                </div>
                <div class="text-right">
                  <div class="text-sm font-medium text-gray-900">
                    {{ reviewedDocuments }} / {{ senaraiDokumen.length }}
                  </div>
                  <div class="text-xs text-gray-500">Dokumen disemak</div>
                </div>
              </div>
            </template>

            <template #body>
              <div class="space-y-4">
                <!-- Progress Bar -->
                <div class="mb-6">
                  <div class="flex justify-between text-sm text-gray-600 mb-2">
                    <span>Progress Semakan Dokumen</span>
                    <span
                      >{{
                        Math.round(
                          (reviewedDocuments / senaraiDokumen.length) * 100
                        )
                      }}%</span
                    >
                  </div>
                  <div class="w-full bg-gray-200 rounded-full h-2">
                    <div
                      class="bg-blue-500 h-2 rounded-full transition-all duration-300"
                      :style="{
                        width: `${
                          (reviewedDocuments / senaraiDokumen.length) * 100
                        }%`,
                      }"
                    ></div>
                  </div>
                </div>

                <!-- Document List -->
                <div class="space-y-4">
                  <div
                    v-for="(dokumen, index) in senaraiDokumen"
                    :key="index"
                    class="group bg-white border-2 rounded-xl transition-all duration-200 hover:shadow-md"
                    :class="getDocumentBorderClass(index)"
                  >
                    <div class="p-5">
                      <div class="flex items-start gap-4">
                        <!-- Document Info -->
                        <div class="flex-1 min-w-0">
                          <div class="flex items-center justify-between mb-4">
                            <h4
                              class="text-base font-semibold text-gray-900 group-hover:text-blue-600 transition-colors"
                            >
                              {{ dokumen.nama }}
                            </h4>
                            <div class="flex gap-2">
                              <rs-button
                                variant="primary-outline"
                                size="sm"
                                @click="viewDocument(dokumen.id)"
                                class="!px-3 !py-2"
                              >
                                <Icon name="ph:eye" class="w-4 h-4" />
                              </rs-button>
                              <rs-button
                                variant="primary-outline"
                                size="sm"
                                @click="downloadDocument(dokumen.id)"
                                class="!px-3 !py-2"
                              >
                                <Icon name="ph:download" class="w-4 h-4" />
                              </rs-button>
                            </div>
                          </div>

                          <!-- Status and Notes Grid -->
                          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div class="space-y-1">
                              <label class="text-sm font-medium text-gray-700"
                                >Status Dokumen</label
                              >
                              <FormKit
                                type="select"
                                :name="`dokumen.${index}.status`"
                                :options="statusDokumenOptions"
                                placeholder="Pilih status dokumen"
                                :classes="{ outer: 'mb-0' }"
                              />
                            </div>

                            <div class="space-y-1">
                              <label class="text-sm font-medium text-gray-700">
                                Catatan Pegawai
                                <span
                                  v-if="
                                    formData.dokumen?.[index]?.status ===
                                    'SEGERA'
                                  "
                                  class="text-red-500"
                                  >*</span
                                >
                              </label>
                              <FormKit
                                type="textarea"
                                :name="`dokumen.${index}.catatan`"
                                :validation="
                                  formData.dokumen?.[index]?.status === 'SEGERA'
                                    ? 'required'
                                    : ''
                                "
                                :validation-messages="{
                                  required:
                                    'Catatan diperlukan untuk status SEGERA',
                                }"
                                rows="3"
                                placeholder="Masukkan catatan (jika perlu)"
                                :classes="{ outer: 'mb-0' }"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <!-- Status Indicator -->
                    <div
                      v-if="formData.dokumen?.[index]?.status"
                      class="absolute top-3 right-3"
                    >
                      <div
                        class="w-6 h-6 rounded-full flex items-center justify-center"
                        :class="
                          getStatusIndicatorClass(
                            formData.dokumen[index]?.status
                          )
                        "
                      >
                        <Icon
                          :name="getStatusIcon(formData.dokumen[index]?.status)"
                          class="w-4 h-4 text-white"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </template>
          </rs-card>
        </div>

        <!-- Sidebar -->
        <div class="lg:col-span-1 space-y-6">
          <!-- Status Update Card -->
          <rs-card class="shadow-sm border-0 bg-white sticky top-6">
            <template #header>
              <div class="flex items-center space-x-3">
                <div class="flex-shrink-0">
                  <div
                    class="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center"
                  >
                    <Icon
                      name="ph:clipboard-text"
                      class="w-6 h-6 text-orange-600"
                    />
                  </div>
                </div>
                <div>
                  <h2 class="text-lg font-semibold text-gray-900">
                    Kemaskini Status
                  </h2>
                  <p class="text-sm text-gray-500">
                    Status dan catatan permohonan
                  </p>
                </div>
              </div>
            </template>

            <template #body>
              <div class="space-y-6">
                <!-- Status Selection -->
                <div class="space-y-1">
                  <FormKit
                    type="select"
                    name="statusPermohonanBaru"
                    label="Status Permohonan"
                    :options="statusPermohonanOptions"
                    validation="required"
                    :validation-messages="{
                      required: 'Sila pilih status permohonan',
                    }"
                    placeholder="Pilih status baharu"
                    :classes="{ outer: 'mb-0' }"
                  />
                </div>

                <!-- General Notes -->
                <div class="space-y-1">
                  <FormKit
                    type="textarea"
                    name="catatanUmumPegawai"
                    label="Catatan Umum Pegawai"
                    rows="4"
                    placeholder="Masukkan catatan umum (pilihan)"
                    :classes="{ outer: 'mb-0' }"
                  />
                </div>

                <!-- Action Buttons -->
                <div class="space-y-3 pt-4 border-t">
                  <rs-button
                    variant="primary"
                    @click="handleSubmit"
                    class="w-full !py-3 text-sm font-medium"
                  >
                    <Icon name="ph:check-circle" class="w-5 h-5 mr-2" />
                    Simpan & Kemaskini Status
                  </rs-button>

                  <rs-button
                    variant="primary-outline"
                    @click="handleCancel"
                    class="w-full !py-3 text-sm font-medium"
                  >
                    <Icon name="ph:arrow-left" class="w-5 h-5 mr-2" />
                    Kembali ke Senarai
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
                        Status Diperlukan
                      </h3>
                      <p class="mt-1 text-xs text-yellow-700">
                        Sila pilih status permohonan baharu sebelum menyimpan.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </template>
          </rs-card>
        </div>
      </div>
    </div>

    <!-- Success Modal -->
    <rs-modal
      v-model="showSuccessModal"
      title="Kemaskini Berjaya"
      size="md"
      position="center"
    >
      <template #body>
        <div class="space-y-6">
          <div class="text-center">
            <div
              class="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100"
            >
              <Icon name="ph:check-circle" class="h-8 w-8 text-green-600" />
            </div>
            <h3 class="mt-4 text-lg font-semibold text-gray-900">
              Kemaskini Berjaya
            </h3>
            <p class="mt-2 text-sm text-gray-600">
              Status permohonan telah berjaya dikemaskini.
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
                >Status Baharu:</span
              >
              <rs-badge
                :variant="getStatusVariant(formData.statusPermohonanBaru)"
                class="text-xs"
              >
                {{ formData.statusPermohonanBaru }}
              </rs-badge>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-sm font-medium text-gray-700"
                >Tarikh Kemaskini:</span
              >
              <span class="text-sm text-gray-900">{{
                formatDateTime(new Date())
              }}</span>
            </div>
          </div>

          <div class="p-4 bg-green-50 border border-green-200 rounded-lg">
            <p class="text-sm text-green-800 flex items-center">
              <Icon
                name="ph:check-circle"
                class="w-5 h-5 mr-2 flex-shrink-0 text-green-600"
              />
              Permohonan telah dikemaskini dan siap untuk langkah seterusnya.
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
  title: "Semakan Permohonan",
});

const breadcrumb = ref([
  {
    name: "Permohonan Bantuan",
    type: "link",
    path: "/BF-BTN/permohonan/senarai-untuk-disemak",
  },
  {
    name: "Senarai untuk Disemak",
    type: "link",
    path: "/BF-BTN/permohonan/senarai-untuk-disemak",
  },
  {
    name: "Semakan Permohonan",
    type: "current",
    path: `/BF-BTN/permohonan/senarai-untuk-disemak/${route.params.id}`,
  },
]);

// Mock data - would be replaced with API call
const permohonanData = ref({
  status: "Dalam Semakan",
});

// Form data
const formData = ref({
  // Section 1: Maklumat Permohonan (Read-only)
  idPermohonan: "NAS-2025-0001",
  namaPemohon: "Ahmad bin Abdullah / Cawangan Klang",
  jenisBantuan: "Bantuan Kebajikan",
  segera: false,
  tarikhPermohonan: "15 Januari 2025",
  statusPermohonan: "Dalam Semakan",

  // Section 2: Semakan Permohonan (Read-only)
  namaPemohonDetail: "Ahmad bin Abdullah",
  noIC: "800101-01-1234",
  alamat: "No. 123, Jalan ABC, Taman XYZ, 50000 Kuala Lumpur",
  jenisBantuanDetail: "Bantuan Kebajikan",
  kaedahPembayaran: "Bank Transfer",
  jumlahBantuan: "RM 1,000.00",
  keteranganPermohonan: "Permohonan bantuan untuk keperluan keluarga...",

  // Section 3: Dokumen
  dokumen: [
    { status: "", catatan: "" },
    { status: "", catatan: "" },
    { status: "", catatan: "" },
    { status: "", catatan: "" },
    { status: "", catatan: "" },
  ],

  // Section 4: Status update
  statusPermohonanBaru: "",
  catatanUmumPegawai: "",
});

// Configuration data
const senaraiDokumen = ref([
  { id: "geran", nama: "Geran Tanah" },
  { id: "carian", nama: "Carian Rasmi Tanah" },
  { id: "akuan", nama: "Akuan Sumpah" },
  { id: "borang", nama: "Borang Permohonan Rasmi" },
  { id: "surat", nama: "Surat Kelulusan" },
]);

const statusDokumenOptions = [
  { label: "-- Pilih Status --", value: "", disabled: true },
  { label: "Lengkap", value: "lengkap" },
  { label: "Tidak Lengkap", value: "tidak_lengkap" },
  { label: "SEGERA", value: "SEGERA" },
];

const statusPermohonanOptions = [
  { label: "-- Pilih Status --", value: "", disabled: true },
  { label: "Lengkap", value: "lengkap" },
  { label: "Tidak Lengkap", value: "tidak_lengkap" },
];

// Modals
const showSuccessModal = ref(false);

// Computed
const isFormValid = computed(() => {
  return formData.value.statusPermohonanBaru !== "";
});

const reviewedDocuments = computed(() => {
  return (
    formData.value.dokumen?.filter((doc) => doc.status && doc.status !== "")
      .length || 0
  );
});

// Methods
const getStatusVariant = (status) => {
  const variants = {
    baru: "info",
    "dalam semakan": "warning",
    "tidak lengkap": "danger",
    "untuk siasatan": "secondary",
    lengkap: "success",
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

const viewDocument = (docId) => {
  // Implement document viewing logic
  console.log(`Viewing document: ${docId}`);
};

const downloadDocument = (docId) => {
  // Implement document download logic
  console.log(`Downloading document: ${docId}`);
};

const handleSubmit = () => {
  // Implement form submission
  console.log("Submitting form:", formData.value);

  // Show success modal
  showSuccessModal.value = true;
};

const handleCancel = () => {
  router.push("/BF-BTN/permohonan/senarai-untuk-disemak");
};

const handleBackToList = () => {
  showSuccessModal.value = false;
  router.push("/BF-BTN/permohonan/senarai-untuk-disemak");
};

const getDocumentBorderClass = (index) => {
  const status = formData.value.dokumen?.[index]?.status;
  if (!status || status === "") return "border-gray-200";

  switch (status) {
    case "lengkap":
      return "border-green-200 bg-green-50 ring-2 ring-green-500 ring-opacity-20";
    case "tidak_lengkap":
      return "border-red-200 bg-red-50";
    case "SEGERA":
      return "border-orange-200 bg-orange-50";
    default:
      return "border-gray-200";
  }
};

const getStatusIndicatorClass = (status) => {
  switch (status) {
    case "lengkap":
      return "bg-green-500";
    case "tidak_lengkap":
      return "bg-red-500";
    case "SEGERA":
      return "bg-orange-500";
    default:
      return "bg-gray-500";
  }
};

const getStatusIcon = (status) => {
  switch (status) {
    case "lengkap":
      return "ph:check";
    case "tidak_lengkap":
      return "ph:x";
    case "SEGERA":
      return "ph:warning";
    default:
      return "ph:circle";
  }
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
