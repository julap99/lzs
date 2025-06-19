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
          <!-- Maklumat Bantuan Card -->
          <rs-card class="shadow-sm border-0 bg-white">
            <template #header>
              <div class="flex items-center space-x-3">
                <div class="flex-shrink-0">
                  <div
                    class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center"
                  >
                    <Icon name="ph:gift" class="w-6 h-6 text-blue-600" />
                  </div>
                </div>
                <div>
                  <h2 class="text-lg font-semibold text-gray-900">
                    Maklumat Bantuan
                  </h2>
                  <p class="text-sm text-gray-500">
                    Butiran bantuan dan konfigurasi produk
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
                      >Aid Product</label
                    >
                    <FormKit
                      type="text"
                      name="aidProduct"
                      placeholder="Contoh: Bantuan Sewaan/Ansuran Rumah"
                      :classes="{ outer: 'mb-0' }"
                    />
                  </div>

                  <div class="space-y-1">
                    <label class="text-sm font-medium text-gray-700"
                      >Product Package</label
                    >
                    <FormKit
                      type="text"
                      name="productPackage"
                      placeholder="Contoh: Sewaan Rumah Bulanan (Miskin)"
                      :classes="{ outer: 'mb-0' }"
                    />
                  </div>

                  <div class="space-y-1">
                    <label class="text-sm font-medium text-gray-700"
                      >Entitlement Product</label
                    >
                    <FormKit
                      type="text"
                      name="entitlementProduct"
                      placeholder="Contoh: Sewaan Rumah Bulanan (Miskin)"
                      :classes="{ outer: 'mb-0' }"
                    />
                  </div>

                  <div class="space-y-1">
                    <FormKit
                      type="checkbox"
                      name="segera"
                      label="SEGERA"
                      help="Tanda jika bantuan perlu diproses segera"
                      :classes="{ outer: 'mb-0' }"
                    />
                  </div>

                  <div class="space-y-1">
                    <FormKit
                      type="checkbox"
                      name="kelulusanKhas"
                      label="Kelulusan Khas"
                      help="Tanda jika tertakluk kepada kelulusan khas"
                      :classes="{ outer: 'mb-0' }"
                    />
                  </div>
                </div>
              </FormKit>
            </template>
          </rs-card>

          <!-- Hasil Siasatan Card -->
          <rs-card class="shadow-sm border-0 bg-white">
            <template #header>
              <div class="flex items-center space-x-3">
                <div class="flex-shrink-0">
                  <div
                    class="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center"
                  >
                    <Icon
                      name="ph:magnifying-glass"
                      class="w-6 h-6 text-purple-600"
                    />
                  </div>
                </div>
                <div>
                  <h2 class="text-lg font-semibold text-gray-900">
                    Hasil Siasatan
                  </h2>
                  <p class="text-sm text-gray-500">
                    Status sokongan dan catatan pengesyoran
                  </p>
                </div>
              </div>
            </template>

            <template #body>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="space-y-1">
                  <label class="text-sm font-medium text-gray-700"
                    >Status Sokongan</label
                  >
                  <FormKit
                    type="select"
                    name="statusSokongan"
                    :options="[
                      { label: '-- Pilih Status --', value: '', disabled: true },
                      { label: 'Sokong', value: 'sokong' },
                      { label: 'Tidak Sokong', value: 'tidak_sokong' }
                    ]"
                    placeholder="Pilih status sokongan"
                    :classes="{ outer: 'mb-0' }"
                  />
                </div>

                <div class="space-y-1 md:col-span-2">
                  <label class="text-sm font-medium text-gray-700"
                    >Catatan Pengesyoran</label
                  >
                  <FormKit
                    type="textarea"
                    name="catatanPengesyoran"
                    rows="4"
                    placeholder="Contoh: Bapa tunggal, 4 tanggungan, Menyewa rumah, Tukang sapu sekolah, Anak OKU"
                    :classes="{ outer: 'mb-0' }"
                  />
                  <p class="text-xs text-gray-500 mt-1">
                    Masukkan catatan hasil siasatan dan pengesyoran
                  </p>
                </div>
              </div>
            </template>
          </rs-card>

          <!-- Input Maklumat Bantuan Card -->
          <rs-card class="shadow-sm border-0 bg-white">
            <template #header>
              <div class="flex items-center space-x-3">
                <div class="flex-shrink-0">
                  <div
                    class="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center"
                  >
                    <Icon
                      name="ph:currency-circle-dollar"
                      class="w-6 h-6 text-green-600"
                    />
                  </div>
                </div>
                <div>
                  <h2 class="text-lg font-semibold text-gray-900">
                    Input Maklumat Bantuan
                  </h2>
                  <p class="text-sm text-gray-500">
                    Kadar dan tempoh bantuan yang akan diberikan
                  </p>
                </div>
              </div>
            </template>

            <template #body>
              <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div class="space-y-1">
                  <label class="text-sm font-medium text-gray-700"
                    >Kadar Bantuan (RM)</label
                  >
                  <FormKit
                    type="number"
                    name="kadarBantuan"
                    placeholder="800"
                    step="0.01"
                    min="0"
                    @input="calculateJumlahBantuan"
                    :classes="{ outer: 'mb-0' }"
                  />
                </div>

                <div class="space-y-1">
                  <label class="text-sm font-medium text-gray-700"
                    >Tempoh / Kekerapan (Bulan)</label
                  >
                  <FormKit
                    type="number"
                    name="tempohBantuan"
                    placeholder="6"
                    min="1"
                    @input="calculateJumlahBantuan"
                    :classes="{ outer: 'mb-0' }"
                  />
                </div>

                <div class="space-y-1">
                  <label class="text-sm font-medium text-gray-700"
                    >Jumlah Bantuan Keseluruhan</label
                  >
                  <div class="mt-1 p-3 bg-green-50 rounded-lg border border-green-200">
                    <span class="text-sm font-semibold text-green-800">
                      RM {{ formatCurrency(jumlahBantuanKeseluruhan) }}
                    </span>
                  </div>
                </div>
              </div>
            </template>
          </rs-card>

          <!-- Input Maklumat Pembayaran Card -->
          <rs-card class="shadow-sm border-0 bg-white">
            <template #header>
              <div class="flex items-center space-x-3">
                <div class="flex-shrink-0">
                  <div
                    class="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center"
                  >
                    <Icon
                      name="ph:credit-card"
                      class="w-6 h-6 text-indigo-600"
                    />
                  </div>
                </div>
                <div>
                  <h2 class="text-lg font-semibold text-gray-900">
                    Input Maklumat Pembayaran
                  </h2>
                  <p class="text-sm text-gray-500">
                    Maklumat bank dan penerima pembayaran
                  </p>
                </div>
              </div>
            </template>

            <template #body>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="space-y-1 md:col-span-2">
                  <label class="text-sm font-medium text-gray-700"
                    >Nama Penerima</label
                  >
                  <FormKit
                    type="text"
                    name="namaPenerima"
                    placeholder="Masukkan nama penuh penerima bayaran"
                    :classes="{ outer: 'mb-0' }"
                  />
                </div>

                <div class="space-y-1">
                  <label class="text-sm font-medium text-gray-700"
                    >Nama Bank</label
                  >
                  <FormKit
                    type="select"
                    name="namaBank"
                    :options="[
                      { label: '-- Pilih Bank --', value: '', disabled: true },
                      { label: 'Maybank', value: 'maybank' },
                      { label: 'CIMB Bank', value: 'cimb' },
                      { label: 'Public Bank', value: 'public' },
                      { label: 'RHB Bank', value: 'rhb' },
                      { label: 'Hong Leong Bank', value: 'hongleong' },
                      { label: 'AmBank', value: 'ambank' },
                      { label: 'Bank Islam', value: 'bankislam' },
                      { label: 'BSN', value: 'bsn' },
                      { label: 'Bank Rakyat', value: 'bankrakyat' },
                      { label: 'Lain-lain', value: 'others' }
                    ]"
                    placeholder="Pilih bank"
                    :classes="{ outer: 'mb-0' }"
                  />
                </div>

                <div class="space-y-1">
                  <label class="text-sm font-medium text-gray-700"
                    >No Akaun Bank</label
                  >
                  <FormKit
                    type="text"
                    name="noAkaunBank"
                    placeholder="Masukkan nombor akaun bank"
                    :classes="{ outer: 'mb-0' }"
                  />
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
                                    'tidak_lengkap'
                                  "
                                  class="text-red-500"
                                  >*</span
                                >
                              </label>
                              <FormKit
                                type="textarea"
                                :name="`dokumen.${index}.catatan`"
                                :validation="
                                  formData.dokumen?.[index]?.status === 'tidak_lengkap'
                                    ? 'required'
                                    : ''
                                "
                                :validation-messages="{
                                  required:
                                    'Catatan diperlukan untuk status Tidak Lengkap',
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
          <!-- Action Card -->
          <rs-card class="shadow-sm border-0 bg-white sticky top-6">
            <template #header>
              <div class="flex items-center space-x-3">
                <div class="flex-shrink-0">
                  <div
                    class="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center"
                  >
                    <Icon
                      name="ph:floppy-disk"
                      class="w-6 h-6 text-orange-600"
                    />
                  </div>
                </div>
                <div>
                  <h2 class="text-lg font-semibold text-gray-900">
                    Tindakan
                  </h2>
                  <p class="text-sm text-gray-500">
                    Simpan maklumat dan kembali ke senarai
                  </p>
                </div>
              </div>
            </template>

            <template #body>
              <div class="space-y-6">
                <!-- Action Buttons -->
                <div class="space-y-3">
                  <rs-button
                    variant="success"
                    @click="handleSimpan"
                    class="w-full !py-3 text-sm font-medium"
                  >
                    <Icon name="ph:floppy-disk" class="w-5 h-5 mr-2" />
                    Simpan
                  </rs-button>

                  <rs-button
                    variant="primary-outline"
                    @click="handleCancel"
                    class="w-full !py-3 text-sm font-medium"
                  >
                    <Icon name="ph:arrow-left" class="w-5 h-5 mr-2" />
                    Kembali
                  </rs-button>
                </div>

                <!-- Info Box -->
                <div class="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div class="flex">
                    <Icon
                      name="ph:info"
                      class="w-5 h-5 text-blue-400 mt-0.5"
                    />
                    <div class="ml-3">
                      <h3 class="text-sm font-medium text-blue-800">
                        Maklumat
                      </h3>
                      <p class="mt-1 text-xs text-blue-700">
                        Setelah menyimpan, status permohonan akan berubah kepada "Dalam Proses".
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
      :title="getModalTitle()"
      size="md"
      position="center"
    >
      <template #body>
        <div class="space-y-6">
          <div class="text-center">
            <div
              class="mx-auto flex items-center justify-center h-16 w-16 rounded-full"
              :class="getModalIconClass()"
            >
              <Icon
                :name="getModalIcon()"
                class="h-8 w-8"
                :class="getModalIconColor()"
              />
            </div>
            <h3 class="mt-4 text-lg font-semibold text-gray-900">
              {{ getModalTitle() }}
            </h3>
            <p class="mt-2 text-sm text-gray-600">
              {{ getModalMessage() }}
            </p>
          </div>

          <div class="bg-gray-50 p-4 rounded-lg space-y-3">
            <div class="flex justify-between items-center">
              <span class="text-sm font-medium text-gray-700"
                >Status Sokongan:</span
              >
              <span class="text-sm text-gray-900">{{
                formData.statusSokongan || 'Belum ditetapkan'
              }}</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-sm font-medium text-gray-700"
                >Jumlah Bantuan:</span
              >
              <span class="text-sm font-semibold text-green-800">
                RM {{ formatCurrency(jumlahBantuanKeseluruhan) }}
              </span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-sm font-medium text-gray-700"
                >Status Permohonan:</span
              >
              <rs-badge
                variant="info"
                class="text-xs"
              >
                Dalam Proses
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
    path: "/BF-BTN/permohonan/semakan-sokongan",
  },
  {
    name: "Senarai Permohonan - Untuk Semakan",
    type: "link",
    path: `/BF-BTN/permohonan/semakan-sokongan/${route.params.id}`,
  },
  {
    name: "Semakan Permohonan (Panel Hartanah)",
    type: "current",
    path: `/BF-BTN/permohonan/semakan-sokongan/${route.params.id}`,
  },
]);

// Mock data - would be replaced with API call
const permohonanData = ref({
  status: "Dalam Semakan",
});

// Form data
const formData = ref({
  // Section 1: Maklumat Bantuan
  jenisBantuan: "B112 - Bantuan Sewaan/Ansuran Rumah (Miskin)",
  aidProduct: "Bantuan Sewaan/Ansuran Rumah",
  productPackage: "Sewaan Rumah Bulanan (Miskin)",
  entitlementProduct: "Sewaan Rumah Bulanan (Miskin)",
  segera: false,
  kelulusanKhas: false,

  // Section 2: Dokumen
  dokumen: [
    { status: "lengkap", catatan: "" },
    { status: "lengkap", catatan: "" },
    { status: "tiada", catatan: "" },
    { status: "tiada", catatan: "" },
  ],

  // Section 3: Hasil Siasatan
  statusSokongan: "",
  catatanPengesyoran: "",

  // Section 4: Input Maklumat Bantuan
  kadarBantuan: 800,
  tempohBantuan: 6,

  // Section 5: Input Maklumat Pembayaran  
  namaPenerima: "",
  namaBank: "",
  noAkaunBank: "",
});

// Configuration data
const senaraiDokumen = ref([
  { id: "surat_perjanjian_sewa", nama: "Surat Perjanjian Sewa" },
  { id: "maklumat_bank_tuan_rumah", nama: "Maklumat Bank Tuan Rumah" },
  { id: "bukti_pemilikan", nama: "Bukti Pemilikan (Bil Utiliti: Api / Air / Cukai Pintu, dll.)" },
  { id: "surat_kuasa_wakil", nama: "Surat Kuasa Wakil (Pengurusan bilik/rumah oleh wakil/ejen)" },
]);

const statusDokumenOptions = [
  { label: "-- Pilih Status --", value: "", disabled: true },
  { label: "Lengkap", value: "lengkap" },
  { label: "Tidak Lengkap", value: "tidak_lengkap" },
  { label: "Tiada", value: "tiada" },
];



// Modals
const showSuccessModal = ref(false);
const actionType = ref("");

// Computed
const jumlahBantuanKeseluruhan = computed(() => {
  const kadar = parseFloat(formData.value.kadarBantuan) || 0;
  const tempoh = parseInt(formData.value.tempohBantuan) || 0;
  return kadar * tempoh;
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
    "dalam proses": "info",
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

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('ms-MY', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
};

const calculateJumlahBantuan = () => {
  // This will be automatically calculated by the computed property
  // but we can add additional logic here if needed
};

const viewDocument = (docId) => {
  // Implement document viewing logic
  console.log(`Viewing document: ${docId}`);
};

const downloadDocument = (docId) => {
  // Implement document download logic
  console.log(`Downloading document: ${docId}`);
};

const handleSimpan = () => {
  // Save all form data and update status
  console.log("Saving form data:", formData.value);

  // Set action type for modal display
  actionType.value = "simpan";

  // Show success modal
  showSuccessModal.value = true;
};

const handleSubmit = () => {
  // This function can be used as a fallback or for other form submissions
  handleSimpan();
};

const handleCancel = () => {
  router.push("/BF-BTN/permohonan/semakan-sokongan");
};

const handleBackToList = () => {
  showSuccessModal.value = false;
  router.push("/BF-BTN/permohonan/semakan-sokongan");
};

const getDocumentBorderClass = (index) => {
  const status = formData.value.dokumen?.[index]?.status;
  if (!status || status === "") return "border-gray-200";

  switch (status) {
    case "lengkap":
      return "border-green-200 bg-green-50 ring-2 ring-green-500 ring-opacity-20";
    case "tidak_lengkap":
      return "border-red-200 bg-red-50";
    case "tiada":
      return "border-gray-200 bg-gray-50";
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
    case "tiada":
      return "bg-gray-500";
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
    case "tiada":
      return "ph:minus";
    default:
      return "ph:circle";
  }
};

// Modal helper functions
const getModalTitle = () => {
  switch (actionType.value) {
    case "simpan":
      return "Data Disimpan";
    default:
      return "Kemaskini Berjaya";
  }
};

const getModalMessage = () => {
  switch (actionType.value) {
    case "simpan":
      return "Maklumat bantuan dan hasil siasatan telah berjaya disimpan.";
    default:
      return "Status permohonan telah berjaya dikemaskini.";
  }
};

const getModalIconClass = () => {
  switch (actionType.value) {
    case "simpan":
      return "bg-green-100";
    default:
      return "bg-green-100";
  }
};

const getModalIcon = () => {
  switch (actionType.value) {
    case "simpan":
      return "ph:check-circle";
    default:
      return "ph:check-circle";
  }
};

const getModalIconColor = () => {
  switch (actionType.value) {
    case "simpan":
      return "text-green-600";
    default:
      return "text-green-600";
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
