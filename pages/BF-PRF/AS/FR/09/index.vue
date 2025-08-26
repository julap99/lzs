<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />

    <rs-card class="mt-4">
      <template #header>
        <div class="flex justify-between items-center">
          <h2 class="text-xl font-semibold">Maklumat Pemohon</h2>
          <rs-badge
            v-if="formData.status"
            :variant="getStatusVariant(formData.status)"
          >
            {{ formData.status }}
          </rs-badge>
        </div>
      </template>

      <template #body>
        <FormKit
          type="form"
          :actions="false"
          @submit="handleSubmit"
          v-model="formData"
        >
          <!-- Section 1: Maklumat Pemohon -->
          <rs-fieldset class="mb-6">
            <template #legend>
              <h3 class="text-lg font-medium">Information</h3>
            </template>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Nama</label>
                <p class="text-gray-900">{{ formData.nama }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Alamat</label>
                <p class="text-gray-900">{{ formData.alamat }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Jenis Pengenalan</label>
                <p class="text-gray-900">{{ formData.jenisPengenalan }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">No Pengenalan</label>
                <p class="text-gray-900">{{ formData.noPengenalan }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">No Telefon</label>
                <p class="text-gray-900">{{ formData.noTelefon }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">E-mel</label>
                <p class="text-gray-900">{{ formData.email }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Status Keluarga</label>
                <p class="text-gray-900">{{ formData.statusKeluarga }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Status Individu</label>
                <p class="text-gray-900">{{ formData.statusIndividu }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Status Multidimensi</label>
                <p class="text-gray-900">{{ formData.statusMultidimensi }}</p>
              </div>
            </div>
          </rs-fieldset>
        </FormKit>
      </template>
    </rs-card>

    <div class="flex flex-col lg:flex-row gap-4 mt-4">
      <rs-card class="flex-1">
        <template #header>
          <div class="flex justify-between items-center">
            <h2 class="text-xl font-semibold">Maklumat Bantuan</h2>
          </div>
        </template>

        <template #body>
          <!-- Main Tabs -->
          <rs-tab variant="primary" type="card">
            <rs-tab-item title="Profiling" active>
              <!-- Profiling Tab Content -->
              <div class="space-y-6">
                <h3 class="text-lg font-semibold mb-4 text-gray-800">Pengesahan Status</h3>

                <!-- Profiling Form -->
                <div class="bg-white border border-gray-200 rounded-lg overflow-hidden">
                  <FormKit
                    type="form"
                    :actions="false"
                    @submit="handleProfilingSubmit"
                    v-model="profilingData"
                    class="divide-y divide-gray-200"
                  >
                    <!-- Section 1: Search & Basic Info -->
                    <div class="p-6 bg-gray-50">
                      <h4 class="text-md font-semibold text-gray-900 mb-4 flex items-center" v-if="false">
                        <Icon name="ph:magnifying-glass" class="w-5 h-5 mr-2 text-blue-600" />
                        Carian Maklumat
                      </h4>
                      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <!-- Pengenalan ID with Search (hidden) -->
                        <div class="lg:col-span-2" v-if="false">
                          <div class="flex gap-3">
                            <FormKit
                              type="text"
                              name="pengenalanId"
                              label="Pengenalan ID"
                              placeholder="Masukkan nombor pengenalan"
                              :classes="{
                                outer: 'flex-1',
                                input: '!py-2.5',
                                label: 'text-sm font-medium text-gray-700',
                              }"
                            />
                            <rs-button
                              variant="primary"
                              class="mt-7 px-6 h-fit"
                              @click="searchPengenalanId"
                              :loading="searchingId"
                            >
                              <Icon name="ph:magnifying-glass" class="w-4 h-4 mr-1" />
                              Cari
                            </rs-button>
                          </div>
                        </div>

                        <!-- Nama -->
                        <div class="lg:col-span-2" v-if="false">
                          <FormKit
                            type="text"
                            name="nama"
                            label="Nama Penuh"
                            placeholder="Nama akan dipaparkan setelah carian"
                            :classes="{
                              input: '!py-2.5',
                              label: 'text-sm font-medium text-gray-700',
                            }"
                            :disabled="!profilingData.pengenalanId"
                          />
                        </div>
                      </div>
                    </div>

                    <!-- Section 2: Maklumat Syor -->
                    <div class="p-6">
                      <h4 class="text-md font-semibold text-gray-900 mb-4 flex items-center">
                        <Icon name="ph:clipboard-text" class="w-5 h-5 mr-2 text-green-600" />
                        Maklumat Syor
                      </h4>
                      <div class="grid grid-cols-1 lg:grid-cols-1 gap-6">
                        <!-- Left Column - Syor -->
                        <div class="space-y-4">
                          <FormKit
                            type="number"
                            name="hadKifayahSyor"
                            label="%Had Kifayah (Syor)"
                            placeholder="0"
                            :classes="{
                              input: '!py-2.5',
                              label: 'text-sm font-medium text-gray-700',
                            }"
                            min="0"
                            max="100"
                            step="0.01"
                          />

                          <FormKit
                            type="text"
                            name="kategoriKeluargaAsnafSyor"
                            label="Kategori Keluarga Asnaf (Syor)"
                            placeholder="Kategori keluarga"
                            :classes="{
                              input: '!py-2.5',
                              label: 'text-sm font-medium text-gray-700',
                            }"
                          />

                          <FormKit
                            type="text"
                            name="kategoriAsnafSyor"
                            label="Kategori Asnaf (Syor)"
                            placeholder="Kategori asnaf"
                            :classes="{
                              input: '!py-2.5',
                              label: 'text-sm font-medium text-gray-700',
                            }"
                          />

                          <FormKit
                            type="date"
                            name="tarikhPengesyoran"
                            label="Tarikh Pengesyoran"
                            :classes="{
                              input: '!py-2.5',
                              label: 'text-sm font-medium text-gray-700',
                            }"
                          />
                        </div>

                        <!-- Right Column - Tanggungan Syor -->
                        <div class="space-y-4">
                          <FormKit
                            type="text"
                            name="kategoriTanggunganSyor"
                            label="Kategori Tanggungan (Syor)"
                            placeholder="Kategori tanggungan"
                            :classes="{
                              input: '!py-2.5',
                              label: 'text-sm font-medium text-gray-700',
                            }"
                          />

                          <!-- Pengenalan ID Tanggungan Group -->
                          <div class="bg-gray-50 p-4 rounded-lg border">
                            <label class="block text-sm font-medium text-gray-700 mb-3">
                              Pengenalan ID Tanggungan
                            </label>
                            <div class="space-y-3">
                              <FormKit
                                type="text"
                                name="pengenalanIdTanggungan1"
                                placeholder="ID Tanggungan 1"
                                :classes="{
                                  outer: 'mb-0',
                                  input: '!py-2 text-sm',
                                }"
                              />
                              <FormKit
                                type="text"
                                name="pengenalanIdTanggungan2"
                                placeholder="ID Tanggungan 2"
                                :classes="{
                                  outer: 'mb-0',
                                  input: '!py-2 text-sm',
                                }"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </FormKit>
                </div>
              </div>
            </rs-tab-item>

            <rs-tab-item title="Bantuan">
              <!-- Bantuan Tab Content -->
              <div>
                <h3 class="text-lg font-semibold mb-4 text-gray-800">Maklumat Bantuan</h3>
                <p>Bantuan content will go here</p>
              </div>
            </rs-tab-item>
          </rs-tab>
        </template>
      </rs-card>

      <!-- Maklumat Lawatan & Siasatan section -->
      <rs-card class="flex-1">
        <template #header>
          <div class="flex justify-between items-center">
            <h2 class="text-xl font-semibold">Maklumat Lawatan & Siasatan</h2>
          </div>
        </template>

        <template #body>
          <FormKit
            type="form"
            :actions="false"
            @submit="handleSubmitLawatan"
            v-model="investigationData"
          >
            <div class="space-y-6">
              <!-- Ringkasan Profil -->
              <div class="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <h4 class="text-sm font-semibold text-blue-900 mb-3">Ringkasan Profil</h4>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span class="font-medium text-blue-800">Jenis Pekerjaan:</span>
                    <p class="mt-1 text-gray-900">{{ investigationData.jenisPekerjaan }}</p>
                  </div>
                  <div>
                    <span class="font-medium text-blue-800">Status Kediaman:</span>
                    <p class="mt-1 text-gray-900">{{ investigationData.statusKediaman }}</p>
                  </div>
                  <div>
                    <span class="font-medium text-blue-800">Jumlah Bayaran Rumah:</span>
                    <p class="mt-1 text-gray-900">{{ investigationData.jumlahBayaranRumah }}</p>
                  </div>
                  <div>
                    <span class="font-medium text-blue-800">Bilangan Tanggungan:</span>
                    <p class="mt-1 text-gray-900">{{ investigationData.bilTanggungan }}</p>
                  </div>
                  <div class="md:col-span-2">
                    <span class="font-medium text-blue-800">Status Tanggungan:</span>
                    <p class="mt-1 text-gray-900">{{ investigationData.statusTanggungan }}</p>
                  </div>
                </div>
              </div>

              <!-- Keadaan Siasatan -->
              <div>
                <h4 class="text-sm font-semibold text-gray-900 mb-3">Keadaan Siasatan</h4>
                <FormKit
                  type="select"
                  name="keadaanSiasatan"
                  placeholder="Pilih keadaan siasatan"
                  :options="keadaanSiasatanOptions"
                  :classes="{
                    input: '!py-2.5',
                  }"
                />
              </div>

              <!-- Tarikh & Masa Lawatan -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 class="text-sm font-semibold text-gray-900 mb-3">Tarikh Lawatan</h4>
                  <FormKit
                    type="date"
                    name="tarikhLawatan"
                    :classes="{
                      input: '!py-2.5',
                    }"
                  />
                </div>
                <div>
                  <h4 class="text-sm font-semibold text-gray-900 mb-3">Masa Lawatan</h4>
                  <FormKit
                    type="time"
                    name="masaLawatan"
                    :classes="{
                      input: '!py-2.5',
                    }"
                  />
                </div>
              </div>

              <!-- Catatan Penilaian Awal -->
              <div>
                <h4 class="text-sm font-semibold text-gray-900 mb-3">Catatan Penilaian Awal</h4>
                <FormKit
                  type="textarea"
                  name="catatanPenilianAwal"
                  placeholder="Catatan penilaian awal..."
                  rows="4"
                  :classes="{
                    input: '!py-2.5',
                  }"
                />
              </div>

              <!-- Catatan Lawatan ETD -->
              <div>
                <h4 class="text-sm font-semibold text-gray-900 mb-3">Catatan Lawatan ETD</h4>
                <FormKit
                  type="textarea"
                  name="catatanLawatanETD"
                  placeholder="Catatan lawatan ETD..."
                  rows="3"
                  :classes="{
                    input: '!py-2.5',
                  }"
                />
              </div>

              <!-- Status Lawatan -->
              <div>
                <h4 class="text-sm font-semibold text-gray-900 mb-3">Status Lawatan</h4>
                <FormKit
                  type="select"
                  name="statusLawatan"
                  placeholder="Pilih status lawatan"
                  :options="statusLawatanOptions"
                  :classes="{
                    input: '!py-2.5',
                  }"
                />
              </div>

              <!-- Action Buttons -->
              <div class="flex justify-end gap-3 pt-4 border-t">
                <rs-button
                  variant="secondary"
                  @click="saveDraftLawatan"
                  :loading="savingDraft"
                >
                  <Icon name="ph:floppy-disk" class="w-4 h-4 mr-1" />
                  Simpan Draft
                </rs-button>
                <rs-button
                  variant="danger"
                  @click="clearSubmittedLawatan"
                >
                  <Icon name="ph:trash" class="w-4 h-4 mr-1" />
                  Clear Submission
                </rs-button>
                <rs-button
                  variant="primary"
                  @click="submitLawatan"
                  :loading="submittingProfile"
                >
                  <Icon name="ph:check" class="w-4 h-4 mr-1" />
                  Hantar
                </rs-button>
              </div>
            </div>
          </FormKit>
        </template>
      </rs-card>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useInvestigationStore } from "~/stores/investigation";

definePageMeta({
  title: "Maklumat Pemohon - Siasatan EOAD",
});

const breadcrumb = ref([
  {
    name: "Tugasan",
    type: "link",
    path: "/BF-BTN/tugasan",
  },
  {
    name: "Siasatan",
    type: "link",
    path: "/BF-BTN/tugasan",
  },
  {
    name: "Maklumat Pemohon",
    type: "current",
    path: "/BF-BTN/tugasan/siasatan-eoad",
  },
]);

// Form data
const formData = ref({
  // Personal Information
  nama: "Adnan bin Abu",
  alamat: "No. 123, Jalan Merdeka, Taman Sejahtera, 50000 Kuala Lumpur",
  jenisPengenalan: "MyKad",
  noPengenalan: "770319035991",
  noTelefon: "0123456789",
  email: "adnan@gmail.com",
  statusKeluarga: "Fakir",
  statusIndividu: "Fakir",
  statusMultidimensi: "Asnaf Tidak Produktif",
  status: "Dalam Siasatan",

  // Investigation fields
  keputusanSiasatan: "",
  tarikhLawatan: "",
  masaLawatan: "",
  catatanPenilianAwal: "",
  gambarLokasi: null,
});

// Investigation form data
const investigationData = ref({
  jenisPekerjaan: "",
  statusKediaman: "",
  jumlahBayaranRumah: "",
  bilTanggungan: "",
  statusTanggungan: "",
  keadaanSiasatan: "",
  tarikhLawatan: "",
  masaLawatan: "",
  catatanPenilianAwal: "",
  gambarLokasi: [],
  catatanLawatanETD: "",
  statusLawatan: "",
});

// Profiling form data
const profilingData = ref({
  pengenalanId: "770319035991",
  nama: "Adnan Bin Abu",
  hadKifayahSyor: "50",
  kategoriKeluargaAsnafSyor: "Fakir",
  kategoriAsnafSyor: "Miskin",
  tarikhPengesyoran: "2025-08-23",
  pengenalanIdTanggungan1: "990101015555",
  pengenalanIdTanggungan2: "030303030333",
  kategoriTanggunganSyor: "Anak sekolah rendah",
  assignSiasatan: "Ustaz Karim",
  hadKifayahSah: "45",
  kategoriKeluargaAsnafSah: "Fakir",
  kategoriAsnafSah: "Miskin Tegar",
  pengenalanIdTanggunganSah1: "990101015555",
  pengenalanIdTanggunganSah2: "030303030333",
  kategoriTanggunganSah1: "Pelajar Sekolah Rendah",
  kategoriTanggunganSah2: "Pelajar Universiti",
  komenPengesahan: "Layak menerima bantuan kewangan bulanan.",
  tarikhPengesyoranBottom: "2025-08-30",
});

// State for profiling form
const searchingId = ref(false);
const savingDraft = ref(false);
const submittingProfile = ref(false);

// Dropdown options
const keadaanSiasatanOptions = [
  { label: "Boleh ditemui", value: "boleh_ditemui" },
  { label: "Tidak dapat ditemui", value: "tidak_dapat_ditemui" },
  { label: "Alamat tidak tepat", value: "alamat_tidak_tepat" },
  { label: "Berpindah alamat", value: "berpindah_alamat" },
];

const statusLawatanOptions = [
  { label: "Lengkap", value: "lengkap" },
  { label: "Tidak lengkap", value: "tidak_lengkap" },
  { label: "Perlu lawatan semula", value: "perlu_lawatan_semula" },
];

// Methods
const handleSubmit = (formData) => {
  console.log("Form submitted:", formData);
  // Handle form submission
};

const getStatusVariant = (status) => {
  const variants = {
    "dalam siasatan": "warning",
    "selesai siasatan": "success",
    "menunggu siasatan": "info",
  };
  return variants[status.toLowerCase()] || "default";
};

// Computed property for profiling form validation
const isProfilingFormValid = computed(() => {
  return (
    profilingData.value.pengenalanId &&
    profilingData.value.nama &&
    profilingData.value.hadKifayahSyor &&
    profilingData.value.assignSiasatan
  );
});

// Form submission methods
const handleSubmitLawatan = (formData) => {
  console.log("Investigation form submitted:", formData);
  // Handle form submission
};

const saveDraftLawatan = async () => {
  try {
    savingDraft.value = true;
    console.log("Saving investigation draft...", investigationData.value);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    console.log("Investigation draft saved successfully");
  } catch (error) {
    console.error("Error saving investigation draft:", error);
  } finally {
    savingDraft.value = false;
  }
};

const submitLawatan = async () => {
  try {
    submittingProfile.value = true;
    console.log("Submitting investigation data...", investigationData.value);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Save into shared store
    const invStore = useInvestigationStore();
    invStore.setSubmission(investigationData.value);

    console.log("Investigation data submitted successfully");

    // Simple success popup
    if (typeof window !== "undefined") {
      window.alert("Hantar berjaya. Data siasatan telah disimpan.");
    }
  } catch (error) {
    console.error("Error submitting investigation data:", error);
  } finally {
    submittingProfile.value = false;
  }
};

const clearSubmittedLawatan = () => {
  const invStore = useInvestigationStore();
  invStore.clearSubmission();
  if (typeof window !== "undefined") {
    window.alert("Data siasatan yang dihantar telah dikosongkan.");
  }
};

// Profiling form methods
const handleProfilingSubmit = (formData) => {
  console.log("Profiling form submitted:", formData);
  // Handle profiling form submission
};

const searchPengenalanId = async () => {
  if (!profilingData.value.pengenalanId) {
    console.error("Please enter an ID to search");
    return;
  }

  try {
    searchingId.value = true;
    console.log(
      "Searching for Pengenalan ID:",
      profilingData.value.pengenalanId
    );

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Mock data population (replace with actual API response)
    profilingData.value.nama = "Mohd Ahmad bin Abdullah";
    profilingData.value.hadKifayahSyor = "75.5";
    profilingData.value.kategoriKeluargaAsnafSyor = "Fakir";
    profilingData.value.kategoriAsnafSyor = "Asnaf Produktif";

    console.log("Search completed successfully");
  } catch (error) {
    console.error("Error searching for ID:", error);
  } finally {
    searchingId.value = false;
  }
};

const resetProfilingForm = () => {
  // Reset all form fields to initial state
  Object.keys(profilingData.value).forEach((key) => {
    profilingData.value[key] = "";
  });
  console.log("Profiling form reset");
};

const saveProfilingDraft = async () => {
  try {
    savingDraft.value = true;
    console.log("Saving profiling draft...", profilingData.value);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    console.log("Draft saved successfully");
  } catch (error) {
    console.error("Error saving draft:", error);
  } finally {
    savingDraft.value = false;
  }
};

const submitProfiling = async () => {
  if (!isProfilingFormValid.value) {
    console.error("Please complete all required fields");
    return;
  }

  try {
    submittingProfile.value = true;
    console.log("Submitting profiling data...", profilingData.value);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));

    console.log("Profiling data submitted successfully");
  } catch (error) {
    console.error("Error submitting profiling data:", error);
  } finally {
    submittingProfile.value = false;
  }
};
</script>

<style lang="scss" scoped>
/* Custom styles */
</style>