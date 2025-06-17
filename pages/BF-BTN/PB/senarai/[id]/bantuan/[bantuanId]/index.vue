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
            <h1 class="text-2xl font-bold text-gray-900">
              Semakan & Input Maklumat Bantuan
            </h1>
            <p class="mt-1 text-sm text-gray-600">
              {{ formData.jenisBantuan }}
            </p>
          </div>
          <rs-badge
            :variant="getStatusVariant(formData.statusPermohonan)"
            class="text-sm px-4 py-2"
          >
            {{ formData.statusPermohonan }}
          </rs-badge>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Main Content -->
        <div class="lg:col-span-2 space-y-6">
          <!-- Section 1: Maklumat Bantuan -->
          <rs-card class="shadow-sm border-0 bg-white">
            <template #header>
              <div class="flex items-center space-x-3">
                <div class="flex-shrink-0">
                  <div
                    class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center"
                  >
                    <Icon name="ph:info" class="w-6 h-6 text-blue-600" />
                  </div>
                </div>
                <div>
                  <h2 class="text-lg font-semibold text-gray-900">
                    Maklumat Bantuan
                  </h2>
                  <p class="text-sm text-gray-500">
                    Butiran asas jenis bantuan
                  </p>
                </div>
              </div>
            </template>

            <template #body>
              <FormKit
                type="form"
                :actions="false"
                v-model="formData"
              >
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div class="space-y-1">
                    <label class="text-sm font-medium text-gray-700">
                      Jenis Bantuan
                    </label>
                    <div class="mt-1 p-3 bg-gray-50 rounded-lg border">
                      <span class="text-sm text-gray-900">{{
                        formData.jenisBantuan
                      }}</span>
                    </div>
                  </div>

                  <div class="space-y-1">
                    <FormKit
                      type="text"
                      name="aidProduct"
                      label="Aid Product"
                      placeholder="Contoh: Bantuan Sewaan/Ansuran Rumah (Miskin)"
                      validation="required"
                      :validation-messages="{
                        required: 'Aid Product diperlukan'
                      }"
                      :classes="{ outer: 'mb-0' }"
                      v-model="formData.aidProduct"
                    />
                  </div>

                  <div class="space-y-1">
                    <FormKit
                      type="text"
                      name="productPackage"
                      label="Product Package"
                      placeholder="Contoh: Sewaan Rumah Bulanan (Miskin)"
                      validation="required"
                      :validation-messages="{
                        required: 'Product Package diperlukan'
                      }"
                      :classes="{ outer: 'mb-0' }"
                      v-model="formData.productPackage"
                    />
                  </div>

                  <div class="space-y-1">
                    <FormKit
                      type="text"
                      name="entitlementProduct"
                      label="Entitlement Product"
                      placeholder="Contoh: Sewaan Rumah Bulanan (Miskin)"
                      validation="required"
                      :validation-messages="{
                        required: 'Entitlement Product diperlukan'
                      }"
                      :classes="{ outer: 'mb-0' }"
                      v-model="formData.entitlementProduct"
                    />
                  </div>

                  <div class="space-y-1 md:col-span-2">
                    <FormKit
                      type="checkbox"
                      name="segera"
                      label="SEGERA"
                      :classes="{ outer: 'mb-0' }"
                    />
                  </div>
                </div>
              </FormKit>
            </template>
          </rs-card>

          <!-- Section 2: Dokumen Sokongan -->
          <rs-card class="shadow-sm border-0 bg-white">
            <template #header>
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
                    Semak status dokumen yang diperlukan
                  </p>
                </div>
              </div>
            </template>

            <template #body>
              <div class="overflow-x-auto">
                <table class="w-full divide-y divide-gray-200">
                  <thead class="bg-gray-50">
                    <tr>
                      <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Dokumen
                      </th>
                       <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Action
                      </th>
                      <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                     
                    </tr>
                  </thead>
                  <tbody class="bg-white divide-y divide-gray-200">
                    <tr
                      v-for="(dokumen, index) in formData.dokumenSokongan"
                      :key="index"
                      class="hover:bg-gray-50"
                    >
                      <td class="px-6 py-4">
                        <div class="text-sm font-medium text-gray-900">
                          {{ dokumen.nama }}
                        </div>
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap">
                        <div class="flex gap-2">
                          <rs-button
                            variant="primary-outline"
                            size="sm"
                            @click="viewDocument(dokumen.id)"
                            :disabled="!dokumen.url"
                          >
                            <Icon name="ph:eye" class="w-4 h-4" />
                          </rs-button>
                          <rs-button
                            variant="primary-outline"
                            size="sm"
                            @click="downloadDocument(dokumen.id)"
                            :disabled="!dokumen.url"
                          >
                            <Icon name="ph:download" class="w-4 h-4" />
                          </rs-button>
                        </div>
                      </td>
                      
                      <td class="px-6 py-4 whitespace-nowrap">
                        <div class="w-48">
                          <FormKit
                            type="select"
                            :name="`dokumenSokongan.${index}.status`"
                            :options="statusDokumenOptions"
                            placeholder="Pilih status"
                            validation="required"
                            :validation-messages="{
                              required: 'Status dokumen diperlukan'
                            }"
                            :classes="{ outer: 'mb-0' }"
                          />
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </template>
          </rs-card>

          <!-- Section 3: Status & Catatan Semakan (moved from sidebar, replaces Hasil Siasatan) -->
          <rs-card class="shadow-sm border-0 bg-white">
            <template #header>
              <div class="flex items-center space-x-3">
                <div class="flex-shrink-0">
                  <div
                    class="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center"
                  >
                    <Icon
                      name="ph:clipboard-text"
                      class="w-6 h-6 text-red-600"
                    />
                  </div>
                </div>
                <div>
                  <h2 class="text-lg font-semibold text-gray-900">
                    Status & Catatan Semakan
                  </h2>
                  <p class="text-sm text-gray-500">
                    Kemaskini status dan catatan
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
                      required: 'Status permohonan diperlukan'
                    }"
                    placeholder="Pilih status"
                    :classes="{ outer: 'mb-0' }"
                  />
                </div>

                <!-- Catatan Pegawai -->
                <div class="space-y-1">
                  <FormKit
                    type="textarea"
                    name="catatanPegawai"
                    label="Catatan Pegawai"
                    rows="4"
                    :validation="formData.statusPermohonanBaru === 'Tidak Lengkap' ? 'required' : ''"
                    :validation-messages="{
                      required: 'Catatan diperlukan untuk status Tidak Lengkap'
                    }"
                    placeholder="Masukkan catatan pegawai (wajib jika Tidak Lengkap)"
                    :classes="{ outer: 'mb-0' }"
                  />
                </div>

                <!-- Tarikh Semak -->
                <div class="space-y-1">
                  <label class="text-sm font-medium text-gray-700">
                    Tarikh Semak
                  </label>
                  <div class="mt-1 p-3 bg-gray-50 rounded-lg border">
                    <span class="text-sm text-gray-900">
                      {{ formatDateTime(formData.tarikhSemak) }}
                    </span>
                  </div>
                </div>

                <!-- Section 7: Action Buttons -->
                <div class="space-y-3 pt-4 border-t">

                  <rs-button
                    variant="primary"
                    @click="handleSimpan"
                    class="w-full !py-3 text-sm font-medium"
                  >
                    <Icon name="ph:check-circle" class="w-5 h-5 mr-2" />
                    Simpan
                  </rs-button>

                  <rs-button
                    variant="success"
                    @click="handleSimpanHantar"
                    class="w-full !py-3 text-sm font-medium"
                  >
                    <Icon name="ph:paper-plane" class="w-5 h-5 mr-2" />
                    Simpan & Hantar
                  </rs-button>

                  <rs-button
                    variant="primary-outline"
                    @click="handleBatal"
                    class="w-full !py-3 text-sm font-medium"
                  >
                    <Icon name="ph:arrow-left" class="w-5 h-5 mr-2" />
                    Kembali
                  </rs-button>
                </div>

                <!-- Information Note -->
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
                        Sekiranya bantuan tanpa siasatan, sistem akan terus ke "Untuk Siasatan".
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </template>
          </rs-card>

          <!-- Section 4: Input Maklumat Bantuan -->
          <rs-card v-if="showBantuanDetails" class="shadow-sm border-0 bg-white">
            <template #header>
              <CardHeader title="Input Maklumat Bantuan" icon="ph:currency-circle-dollar" color="purple" />
            </template>
            <template #body>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <!-- Kadar Bantuan -->
                <FormKit
                  type="number"
                  name="kadarBantuan"
                  label="Kadar Bantuan (RM)"
                  placeholder="800"
                  v-model="formData.kadarBantuan"
                  validation="required|number|min:0"
                  :validation-messages="{
                    required: 'Kadar bantuan diperlukan',
                    number: 'Sila masukkan nombor',
                    min: 'Minimum RM0'
                  }"
                  @input="calculateTotal"
                  :classes="{ outer: 'mb-0' }"
                />

                <!-- Tempoh -->
                <FormKit
                  type="number"
                  name="tempohBantuan"
                  label="Tempoh / Kekerapan Bantuan (bulan)"
                  placeholder="6"
                  v-model="formData.tempohBantuan"
                  validation="required|number|min:1"
                  @input="calculateTotal"
                  :classes="{ outer: 'mb-0' }"
                />
              </div>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">

                <!-- Tarikh Mula -->
                <FormKit
                  type="date"
                  name="tarikhMula"
                  label="Tarikh Mula"
                  v-model="formData.tarikhMula"
                  validation="required"
                  :classes="{ outer: 'mb-0' }"
                />

                <!-- Tarikh Tamat -->
                <FormKit
                  type="date"
                  name="tarikhTamat"
                  label="Tarikh Tamat"
                  v-model="formData.tarikhTamat"
                  validation="required"
                  :classes="{ outer: 'mb-0' }"
                />

                <!-- Jumlah Keseluruhan -->
                <div class="space-y-1 md:col-span-3">
                  <label class="text-sm font-medium text-gray-700">
                    Jumlah Keseluruhan Bantuan (RM)
                  </label>
                  <div class="mt-1 p-3 bg-green-50 rounded-lg border border-green-200">
                    <span class="text-sm font-semibold text-green-800">
                      {{ formData.jumlahKeseluruhan.toLocaleString() }}
                    </span>
                  </div>
                </div>
              </div>
            </template>
          </rs-card>


          <!-- Section 5: Input Maklumat Pembayaran -->
          <rs-card v-if="showBantuanDetails" class="shadow-sm border-0 bg-white">
            <template #header>
              <CardHeader title="Input Maklumat Pembayaran" icon="ph:bank" color="indigo" />
            </template>
            <template #body>
              <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                <!-- Penerima -->
                <FormKit
                  type="select"
                  name="penerima"
                  label="Penerima"
                  v-model="formData.penerima"
                  :options="[
                    { label: 'Asnaf', value: 'Asnaf' },
                    { label: 'Third Party', value: 'Third Party' },
                    { label: 'Organisasi', value: 'Organisasi' },
                    { label: 'PAK', value: 'PAK' }
                  ]"
                  validation="required"
                  :classes="{ outer: 'mb-0' }"
                />

                <!-- Nama Penerima -->
                <FormKit
                  type="text"
                  name="namaPenerima"
                  label="Nama Penerima"
                  v-model="formData.namaPenerima"
                  validation="required"
                  placeholder="Masukkan nama penerima"
                  :classes="{ outer: 'mb-0' }"
                />

                <!-- Kaedah Pembayaran -->
                <FormKit
                  type="select"
                  name="kaedahPembayaran"
                  label="Kaedah Pembayaran"
                  v-model="formData.kaedahPembayaran"
                  :options="[
                    { label: 'EFT', value: 'EFT' },
                    { label: 'VCash', value: 'VCash' },
                    { label: 'Tunai', value: 'Tunai' },
                    { label: 'Cek', value: 'Cek' }
                  ]"
                  validation="required"
                  :classes="{ outer: 'mb-0' }"
                />

                <!-- Nama Bank -->
                <FormKit
                  type="text"
                  name="namaBank"
                  label="Nama Bank"
                  v-model="formData.namaBank"
                  validation="required"
                  placeholder="Contoh: CIMB, Maybank"
                  :classes="{ outer: 'mb-0' }"
                />

                <!-- No Akaun Bank -->
                <FormKit
                  type="text"
                  name="noAkaunBank"
                  label="No Akaun Bank"
                  v-model="formData.noAkaunBank"
                  validation="required"
                  placeholder="Contoh: 1234567890"
                  :classes="{ outer: 'mb-0' }"
                />
              </div>
            </template>
          </rs-card>

        </div>

        <!-- Sidebar -->
        <div class="lg:col-span-1 space-y-6">
          <!-- Section 6: Status & Catatan Semakan -->
          <!-- Removed from sidebar as per new requirements -->
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
              Maklumat bantuan telah berjaya dikemaskini.
            </p>
          </div>

          <div class="bg-gray-50 p-4 rounded-lg space-y-3">
            <div class="flex justify-between items-center">
              <span class="text-sm font-medium text-gray-700">Bantuan:</span>
              <span class="text-sm text-gray-900">{{ formData.jenisBantuan }}</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-sm font-medium text-gray-700">Status:</span>
              <rs-badge
                :variant="getStatusVariant(formData.statusPermohonanBaru)"
                class="text-xs"
              >
                {{ formData.statusPermohonanBaru }}
              </rs-badge>
            </div>
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
import { ref, computed, watch } from "vue";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();

definePageMeta({
  title: "Semakan & Input Maklumat Bantuan",
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
    type: "link",
    path: `/BF-BTN/permohonan/senarai-untuk-disemak/${route.params.id}`,
  },
  {
    name: "Semakan Bantuan",
    type: "current",
    path: `/BF-BTN/permohonan/senarai-untuk-disemak/${route.params.id}/bantuan/${route.params.bantuanId}`,
  },
]);

// Form data
const formData = ref({
  // Section 1: Maklumat Bantuan
  jenisBantuan: "B112 - Bantuan Sewaan/Ansuran Rumah (Miskin)",
  aidProduct: "BANTUAN SEWAAN/ANSURAN RUMAH (MISKIN)",
  productPackage: "SEWAAN RUMAH BULANAN (MISKIN)",
  entitlementProduct: "SEWAAN RUMAH BULANAN (MISKIN)",
  segera: false,

  // Section 2: Dokumen Sokongan
  dokumenSokongan: [
    { 
      id: "surat-sewa", 
      nama: "Surat Perjanjian Sewa", 
      status: "",
      url: "/path/to/doc1.pdf" // Mock URL for demo
    },
    { 
      id: "bank-tuan-rumah", 
      nama: "Maklumat Bank Tuan Rumah", 
      status: "",
      url: "/path/to/doc2.pdf"
    },
    { 
      id: "bukti-pemilikan", 
      nama: "Bukti Pemilikan (Salinan bil utiliti: Air, Api, Cukai Pintu, atau lain-lain)", 
      status: "",
      url: "/path/to/doc3.pdf"
    },
    { 
      id: "surat-kuasa", 
      nama: "Surat Kuasa Wakil (jika bilik/rumah diurus wakil/ejen, bukan tuan rumah sendiri)", 
      status: "",
      url: "/path/to/doc4.pdf"
    },
  ],

  // Section 3: Hasil Siasatan
  statusSokongan: "",
  catatanPengesyoran: `
    Status: Balu
    Jenis Pekerjaan : Bekerja sebagai tukang sapu di sekolah
    Pendapatan KK : RM1200
    Status Kediaman : Rumah Sewa
    Jumlah bayaran rumah : RM800
    Status Kesihatan KK : Sihat
    Bantuan Agensi Lain : - 
    Bil Tanggungan : 2 Orang(Anak)
    Status Tanggungan : Masih Bersekolah , Tidak Bekerja`,

  // Section 4: Input Maklumat Bantuan
  kadarBantuan: null,
  tempohBantuan: "",
  jumlahKeseluruhan: 0,
  tarikhMula: "",
  tarikhTamat: "",
  jumlahKeseluruhan: 0,

  // Section 5: Input Maklumat Pembayaran
  penerima: "",
  namaPenerima: "",
  kaedahPembayaran: "",
  namaBank: "",
  noAkaunBank: "",

  // Section 6: Status & Catatan
  statusPermohonan: "Dalam Semakan",
  statusPermohonanBaru: "",
  catatanPegawai: "",
  tarikhSemak: new Date(),
});

// Configuration data
const statusDokumenOptions = [
  { label: "-- Pilih Status --", value: "", disabled: true },
  { label: "Lengkap", value: "Lengkap" },
  { label: "Tidak Lengkap", value: "Tidak Lengkap" },
  { label: "Tiada", value: "Tiada" },
];

const statusSokonganOptions = [
  { label: "-- Pilih Status --", value: "", disabled: true },
  { label: "Sokong", value: "Sokong" },
  { label: "Tidak Sokong", value: "Tidak Sokong" },
];

const statusPermohonanOptions = [
  { label: "-- Pilih Status --", value: "", disabled: true },
  { label: "Lengkap", value: "Lengkap" },
  { label: "Tidak Lengkap", value: "Tidak Lengkap" },
];

// Modals
const showSuccessModal = ref(false);

// Computed
const showSiasatanSection = computed(() => {
  // Show if not "Bantuan Tanpa Siasatan"
  return !formData.value.jenisBantuan.toLowerCase().includes("tanpa siasatan");
});

const showBantuanDetails = computed(() => {
  // Show if:
  // 1. No siasatan needed (Bantuan Tanpa Siasatan) OR
  // 2. If siasatan is needed and status sokongan is "Sokong"
  return !showSiasatanSection.value || formData.value.statusSokongan === "Sokong";
});

// Watch for changes in statusSokongan
watch(() => formData.value.statusSokongan, (newValue) => {
  // If status changes to "Sokong", reset bantuan details fields
  if (newValue === "Sokong") {
    formData.value.kadarBantuan = null;
    formData.value.tempohBantuan = "";
    formData.value.jumlahKeseluruhan = 0;
    formData.value.namaPenerima = "";
    formData.value.namaBank = "";
    formData.value.noAkaunBank = "";
  }
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
  const doc = formData.value.dokumenSokongan.find(d => d.id === docId);
  if (doc?.url) {
    window.open(doc.url, '_blank');
  }
};

const downloadDocument = (docId) => {
  const doc = formData.value.dokumenSokongan.find(d => d.id === docId);
  if (doc?.url) {
    const link = document.createElement('a');
    link.href = doc.url;
    link.download = doc.nama;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};

const calculateTotal = () => {
  const kadar = formData.value.kadarBantuan || 0;
  const tempoh = formData.value.tempohBantuan;
  
  // Extract number from tempoh (e.g., "6 bulan" -> 6)
  const bulan = parseInt(tempoh) || 1;
  formData.value.jumlahKeseluruhan = kadar * bulan;
};

const validateForm = () => {
  // Basic validation
  if (formData.value.statusPermohonanBaru === "Tidak Lengkap" && !formData.value.catatanPegawai) {
    return false;
  }

  // Document validation
  const allDocsHaveStatus = formData.value.dokumenSokongan.every(doc => doc.status);
  if (!allDocsHaveStatus) {
    return false;
  }

  // If showing bantuan details, validate those fields
  if (showBantuanDetails.value) {
    if (!formData.value.kadarBantuan || !formData.value.tempohBantuan || 
        !formData.value.namaPenerima || !formData.value.namaBank || !formData.value.noAkaunBank) {
      return false;
    }
  }

  return true;
};

const handleSimpanHantar = () => {
  
};

const handleSimpan = () => {
  router.push('/BF-BTN/PB/senarai');
};

const handleBatal = () => {
  router.push(`/BF-BTN/permohonan/senarai-untuk-disemak/${route.params.id}`);
};

const handleBackToList = () => {
  showSuccessModal.value = false;
  router.push(`/BF-BTN/permohonan/senarai-untuk-disemak/${route.params.id}`);
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