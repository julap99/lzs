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
              Semak Dokumen & Buat Pengesahan
            </h1>
            <p class="mt-1 text-sm text-gray-600">
              Semak dan sahkan dokumen permohonan sebelum siasatan lapangan
            </p>
          </div>
          <rs-badge
            v-if="formData.status"
            :variant="getStatusVariant(formData.status)"
            class="text-sm px-4 py-2"
          >
            {{ getStatusText(formData.status) }}
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
                    <Icon name="ph:user-circle" class="w-6 h-6 text-blue-600" />
                  </div>
                </div>
                <div>
                  <h2 class="text-lg font-semibold text-gray-900">
                    Maklumat Permohonan
                  </h2>
                  <p class="text-sm text-gray-500">
                    Butiran pemohon dan jenis bantuan
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
                      >Nama Pemohon</label
                    >
                    <div class="mt-1 p-3 bg-gray-50 rounded-lg border">
                      <span class="text-sm text-gray-900">{{
                        formData.namaPemohon
                      }}</span>
                    </div>
                  </div>

                  <div class="space-y-1">
                    <label class="text-sm font-medium text-gray-700"
                      >No KP Pemohon</label
                    >
                    <div class="mt-1 p-3 bg-gray-50 rounded-lg border">
                      <span class="text-sm font-mono text-gray-900">{{
                        formData.noKpPemohon
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

                  <div class="space-y-1 md:col-span-2">
                    <label class="text-sm font-medium text-gray-700"
                      >Kategori Bantuan & Asnaf</label
                    >
                    <div class="mt-1 p-3 bg-gray-50 rounded-lg border">
                      <span class="text-sm text-gray-900">{{
                        formData.kategoriBantuan
                      }}</span>
                    </div>
                  </div>
                </div>
              </FormKit>
            </template>
          </rs-card>

          <!-- Document Verification Card -->
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
                      Dokumen Sokongan
                    </h2>
                    <p class="text-sm text-gray-500">
                      Semak dan sahkan semua dokumen yang diperlukan
                    </p>
                  </div>
                </div>
                <div class="text-right">
                  <div class="text-sm font-medium text-gray-900">
                    {{ verifiedDocuments }} / {{ totalRequiredDocuments }}
                  </div>
                  <div class="text-xs text-gray-500">Dokumen disahkan</div>
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
                          (verifiedDocuments / totalRequiredDocuments) * 100
                        )
                      }}%</span
                    >
                  </div>
                  <div class="w-full bg-gray-200 rounded-full h-2">
                    <div
                      class="bg-green-500 h-2 rounded-full transition-all duration-300"
                      :style="{
                        width: `${
                          (verifiedDocuments / totalRequiredDocuments) * 100
                        }%`,
                      }"
                    ></div>
                  </div>
                </div>

                <!-- Document List -->
                <div class="space-y-3">
                  <div
                    v-for="(doc, index) in documents"
                    :key="index"
                    class="group relative bg-white border-2 rounded-xl transition-all duration-200 hover:shadow-md"
                    :class="{
                      'border-green-200 bg-green-50': doc.isVerified,
                      'border-red-200 bg-red-50':
                        !doc.isVerified && doc.required,
                      'border-gray-200': !doc.isVerified && !doc.required,
                      'ring-2 ring-green-500 ring-opacity-20': doc.isVerified,
                    }"
                  >
                    <div class="p-5">
                      <div class="flex items-start gap-4">
                        <!-- Verification Checkbox -->
                        <div class="flex-shrink-0 mt-1">
                          <FormKit
                            type="checkbox"
                            :name="`documents.${index}.isVerified`"
                            :validation="doc.required ? 'required' : ''"
                            :validation-messages="{
                              required: 'Dokumen ini perlu disahkan',
                            }"
                            class="!mb-0 scale-125"
                          />
                        </div>

                        <!-- Document Info -->
                        <div class="flex-1 min-w-0">
                          <div class="flex items-start justify-between">
                            <div class="flex-1">
                              <h4
                                class="text-base font-semibold text-gray-900 group-hover:text-blue-600 transition-colors"
                              >
                                {{ doc.name }}
                                <span
                                  v-if="doc.required"
                                  class="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800"
                                >
                                  Wajib
                                </span>
                              </h4>
                              <p class="mt-1 text-sm text-gray-600">
                                {{ doc.description }}
                              </p>

                              <!-- Verification Status -->
                              <div class="mt-3 flex items-center">
                                <div
                                  v-if="doc.isVerified"
                                  class="flex items-center text-sm text-green-700"
                                >
                                  <Icon
                                    name="ph:check-circle-fill"
                                    class="w-4 h-4 mr-1"
                                  />
                                  Dokumen telah disahkan
                                </div>
                                <div
                                  v-else-if="doc.required"
                                  class="flex items-center text-sm text-red-600"
                                >
                                  <Icon
                                    name="ph:warning-circle-fill"
                                    class="w-4 h-4 mr-1"
                                  />
                                  Menunggu pengesahan
                                </div>
                                <div
                                  v-else
                                  class="flex items-center text-sm text-gray-500"
                                >
                                  <Icon name="ph:circle" class="w-4 h-4 mr-1" />
                                  Pilihan
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        <!-- Document Actions -->
                        <div class="flex-shrink-0 flex gap-2">
                          <rs-button
                            variant="primary-outline"
                            size="sm"
                            @click="viewDocument(doc)"
                            :disabled="!doc.url"
                            class="!px-3 !py-2"
                          >
                            <Icon name="ph:eye" class="w-4 h-4" />
                          </rs-button>
                          <rs-button
                            variant="primary-outline"
                            size="sm"
                            @click="downloadDocument(doc)"
                            :disabled="!doc.url"
                            class="!px-3 !py-2"
                          >
                            <Icon name="ph:download" class="w-4 h-4" />
                          </rs-button>
                        </div>
                      </div>
                    </div>

                    <!-- Verification Indicator -->
                    <div v-if="doc.isVerified" class="absolute top-3 right-3">
                      <div
                        class="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center"
                      >
                        <Icon name="ph:check" class="w-4 h-4 text-white" />
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
          <!-- Status & Progress Card -->
          <rs-card class="shadow-sm border-0 bg-white sticky top-6">
            <template #header>
              <div class="flex items-center space-x-3">
                <div class="flex-shrink-0">
                  <div
                    class="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center"
                  >
                    <Icon
                      name="ph:clipboard-text"
                      class="w-6 h-6 text-purple-600"
                    />
                  </div>
                </div>
                <div>
                  <h2 class="text-lg font-semibold text-gray-900">
                    Status & Catatan
                  </h2>
                  <p class="text-sm text-gray-500">Maklumat semakan</p>
                </div>
              </div>
            </template>

            <template #body>
              <div class="space-y-6">
                <!-- Notes Section -->
                <div>
                  <FormKit
                    type="textarea"
                    name="catatanStatus"
                    label="Catatan Status Dokumen"
                    placeholder="Masukkan catatan status dokumen..."
                    rows="4"
                    v-model="formData.catatanStatus"
                    class="!mb-0"
                  />
                </div>

                <!-- Review Info -->
                <div class="space-y-4 pt-4 border-t">
                  <div class="space-y-1">
                    <label class="text-sm font-medium text-gray-700"
                      >Tarikh & Masa Semakan</label
                    >
                    <div class="mt-1 p-3 bg-gray-50 rounded-lg border">
                      <span class="text-sm text-gray-900">{{
                        formData.tarikhSemakan
                      }}</span>
                    </div>
                  </div>

                  <div class="space-y-1">
                    <label class="text-sm font-medium text-gray-700"
                      >Nama Pegawai EOAD</label
                    >
                    <div class="mt-1 p-3 bg-gray-50 rounded-lg border">
                      <span class="text-sm text-gray-900">{{
                        formData.namaPegawai
                      }}</span>
                    </div>
                  </div>
                </div>

                <!-- Action Buttons -->
                <div class="space-y-3 pt-4 border-t">
                  <rs-button
                    variant="primary"
                    @click="showVerifyConfirm = true"
                    :disabled="processing || !allRequiredDocumentsVerified"
                    class="w-full !py-3 text-sm font-medium"
                  >
                    <Icon name="ph:check-circle" class="w-5 h-5 mr-2" />
                    Disahkan - Siap untuk Siasatan Lapangan
                  </rs-button>

                  <rs-button
                    variant="warning"
                    @click="showNeedReviewConfirm = true"
                    :disabled="processing"
                    class="w-full !py-3 text-sm font-medium"
                  >
                    <Icon name="ph:warning-circle" class="w-5 h-5 mr-2" />
                    Perlu Semakan Semula Dokumen
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

                <!-- Verification Status -->
                <div
                  v-if="!allRequiredDocumentsVerified"
                  class="p-4 bg-yellow-50 border border-yellow-200 rounded-lg"
                >
                  <div class="flex">
                    <Icon
                      name="ph:warning"
                      class="w-5 h-5 text-yellow-400 mt-0.5"
                    />
                    <div class="ml-3">
                      <h3 class="text-sm font-medium text-yellow-800">
                        Dokumen Belum Lengkap
                      </h3>
                      <p class="mt-1 text-xs text-yellow-700">
                        Sila sahkan semua dokumen wajib sebelum meneruskan ke
                        siasatan lapangan.
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

    <!-- Need Review Confirmation Modal -->
    <rs-modal
      v-model="showNeedReviewConfirm"
      title="Pengesahan Semakan Semula"
      size="md"
      position="center"
    >
      <template #body>
        <div class="space-y-6">
          <div class="text-center">
            <div
              class="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-yellow-100"
            >
              <Icon name="ph:warning-circle" class="h-8 w-8 text-yellow-600" />
            </div>
            <h3 class="mt-4 text-lg font-semibold text-gray-900">
              Sahkan Semakan Semula
            </h3>
            <p class="mt-2 text-sm text-gray-600">
              Adakah anda pasti untuk menandakan permohonan ini perlu disemak
              semula?
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
                >Nama Pemohon:</span
              >
              <span class="text-sm text-gray-900">{{
                formData.namaPemohon
              }}</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-sm font-medium text-gray-700"
                >Status Semasa:</span
              >
              <rs-badge
                :variant="getStatusVariant(formData.status)"
                class="text-xs"
              >
                {{ getStatusText(formData.status) }}
              </rs-badge>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-sm font-medium text-gray-700"
                >Status Selepas:</span
              >
              <rs-badge variant="warning" class="text-xs"
                >Untuk Siasatan</rs-badge
              >
            </div>
          </div>
        </div>
      </template>

      <template #footer>
        <div class="flex justify-end gap-3">
          <rs-button
            variant="primary-outline"
            @click="showNeedReviewConfirm = false"
            :disabled="processing"
          >
            Batal
          </rs-button>
          <rs-button
            variant="warning"
            @click="handleNeedReview"
            :loading="processing"
          >
            Sahkan
          </rs-button>
        </div>
      </template>
    </rs-modal>

    <!-- Verify Confirmation Modal -->
    <rs-modal
      v-model="showVerifyConfirm"
      title="Pengesahan Dokumen"
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
              Sahkan Dokumen
            </h3>
            <p class="mt-2 text-sm text-gray-600">
              Adakah anda pasti untuk mengesahkan semua dokumen dan menandakan
              permohonan ini siap untuk siasatan lapangan?
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
                >Nama Pemohon:</span
              >
              <span class="text-sm text-gray-900">{{
                formData.namaPemohon
              }}</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-sm font-medium text-gray-700"
                >Status Semasa:</span
              >
              <rs-badge
                :variant="getStatusVariant(formData.status)"
                class="text-xs"
              >
                {{ getStatusText(formData.status) }}
              </rs-badge>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-sm font-medium text-gray-700"
                >Status Selepas:</span
              >
              <rs-badge variant="success" class="text-xs"
                >Siap untuk Siasatan Lapangan</rs-badge
              >
            </div>
          </div>

          <div class="p-4 bg-green-50 border border-green-200 rounded-lg">
            <p class="text-sm text-green-800 flex items-center">
              <Icon
                name="ph:check-circle"
                class="w-5 h-5 mr-2 flex-shrink-0 text-green-600"
              />
              Semua dokumen yang diperlukan telah disahkan dan siap untuk
              siasatan lapangan.
            </p>
          </div>
        </div>
      </template>

      <template #footer>
        <div class="flex justify-end gap-3">
          <rs-button
            variant="primary-outline"
            @click="showVerifyConfirm = false"
            :disabled="processing"
          >
            Batal
          </rs-button>
          <rs-button
            variant="primary"
            @click="handleVerify"
            :loading="processing"
          >
            Sahkan
          </rs-button>
        </div>
      </template>
    </rs-modal>
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

definePageMeta({
  title: "Semak Dokumen & Buat Pengesahan",
});

const breadcrumb = ref([
  {
    name: "Permohonan Bantuan",
    type: "link",
    path: "/BF-BTN/permohonan/senarai",
  },
  {
    name: "Untuk Siasatan",
    type: "link",
    path: "/BF-BTN/permohonan/senarai-untuk-siasatan",
  },
  {
    name: "Semak Dokumen",
    type: "current",
    path: `/BF-BTN/permohonan/senarai-untuk-siasatan/${route.params.id}`,
  },
]);

// Form data
const formData = ref({
  idPermohonan: "",
  namaPemohon: "",
  noKpPemohon: "",
  jenisBantuan: "",
  kategoriBantuan: "",
  status: "untuk_siasatan",
  catatanStatus: "",
  tarikhSemakan: "",
  namaPegawai: "",
  documents: [],
});

// Document list
const documents = ref([
  {
    name: "Surat Kelulusan",
    description: "Surat kelulusan rasmi dari pihak berkuasa",
    required: true,
    isVerified: false,
    url: "#",
  },
  {
    name: "Sebutharga / Invois",
    description: "Dokumen rasmi yang menunjukkan nilai bantuan",
    required: true,
    isVerified: false,
    url: "#",
  },
  {
    name: "Gambar Premis / Lokasi",
    description: "Gambar lokasi atau premis yang berkaitan dengan permohonan",
    required: true,
    isVerified: false,
    url: "#",
  },
  {
    name: "Salinan Pemilikan",
    description: "Dokumen yang mengesahkan pemilikan atau hak",
    required: true,
    isVerified: false,
    url: "#",
  },
]);

// Add confirmation dialog refs
const showNeedReviewConfirm = ref(false);
const showVerifyConfirm = ref(false);

// Methods
const getStatusVariant = (status) => {
  const variants = {
    untuk_siasatan: "warning",
    siap_siasatan_lapangan: "success",
  };
  return variants[status.toLowerCase()] || "default";
};

const viewDocument = (doc) => {
  // Implement document viewing logic
  console.log("Viewing document:", doc);
};

const downloadDocument = (doc) => {
  // Implement document download logic
  console.log("Downloading document:", doc);
};

const handleCancel = () => {
  router.push("/BF-BTN/permohonan/senarai-untuk-siasatan");
};

const handleNeedReview = async () => {
  try {
    processing.value = true;
    // Implement API call to update status
    formData.value.status = "untuk_siasatan";
    toast.success("Status permohonan telah dikemaskini");
    router.push("/BF-BTN/permohonan/senarai-untuk-siasatan");
  } catch (error) {
    toast.error("Ralat semasa mengemaskini status");
    console.error(error);
  } finally {
    processing.value = false;
    showNeedReviewConfirm.value = false;
  }
};

const handleVerify = async () => {
  try {
    processing.value = true;
    // Implement API call to update status
    formData.value.status = "siap_siasatan_lapangan";
    toast.success("Dokumen telah disahkan");
    router.push("/BF-BTN/permohonan/senarai-untuk-siasatan");
  } catch (error) {
    toast.error("Ralat semasa mengesahkan dokumen");
    console.error(error);
  } finally {
    processing.value = false;
    showVerifyConfirm.value = false;
  }
};

// Fetch application data on mount
onMounted(async () => {
  try {
    // Implement API call to fetch application data
    // This is mock data for now
    formData.value = {
      ...formData.value,
      idPermohonan: route.params.id,
      namaPemohon: "Ahmad bin Abdullah",
      noKpPemohon: "880101-12-1234",
      jenisBantuan: "Bantuan Kewangan",
      kategoriBantuan: "Fakir",
      tarikhSemakan: new Date().toLocaleString(),
      namaPegawai: "Siti binti Ali",
    };
  } catch (error) {
    toast.error("Ralat semasa memuatkan data permohonan");
    console.error(error);
  }
});

// Computed properties for document verification
const verifiedDocuments = computed(() => {
  return documents.value.filter((doc) => doc.isVerified && doc.required).length;
});

const totalRequiredDocuments = computed(() => {
  return documents.value.filter((doc) => doc.required).length;
});

const allRequiredDocumentsVerified = computed(() => {
  return documents.value
    .filter((doc) => doc.required)
    .every((doc) => doc.isVerified);
});

// Enhanced status text method
const getStatusText = (status) => {
  const statusMap = {
    untuk_siasatan: "Untuk Siasatan",
    siap_siasatan_lapangan: "Siap untuk Siasatan Lapangan",
  };
  return statusMap[status] || status;
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
