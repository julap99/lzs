<!-- 
  RTMF SCREEN: BTN-Bantuan-Detail
  PURPOSE: Paparan terperinci maklumat bantuan dengan tab interface
  DESCRIPTION: Detailed view for aid information with tabbed interface for different sections
  ROUTE: /BF-BTN/bantuan/[id]
-->
<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />

    <!-- Header Section -->
    <div class="mb-6">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold text-gray-900 flex items-center">
            <Icon name="ph:hand-heart" class="w-6 h-6 mr-3 text-primary" />
            Bantuan
          </h1>
          <p class="text-gray-600 mt-1">Maklumat lengkap bantuan dan agihan</p>
        </div>
        <div class="flex gap-2">
          <rs-button variant="info" @click="handlePrintLetter">
            <Icon name="ph:printer" class="w-4 h-4 mr-1" />
            Cetak Surat
          </rs-button>
          <rs-button variant="secondary-outline" @click="handleBack">
            <Icon name="ph:arrow-left" class="w-4 h-4 mr-1" />
            Kembali
          </rs-button>
        </div>
      </div>
    </div>

    <!-- Maklumat Pemohon Section -->
    <rs-card class="mb-6">
      <template #header>
        <h3 class="text-lg font-semibold text-gray-900">Maklumat Pemohon</h3>
      </template>
      <template #body>
        <div class="p-6">
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Nama Penuh
              </label>
              <p class="text-gray-900">{{ applicantInfo.namaPenuh }}</p>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                No. Kad Pengenalan/No Syarikat
              </label>
              <p class="text-gray-900">{{ applicantInfo.noKadPengenalan }}</p>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                No. Telefon
              </label>
              <p class="text-gray-900">{{ applicantInfo.noTelefon }}</p>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Emel
              </label>
              <p class="text-gray-900">{{ applicantInfo.emel }}</p>
            </div>

            <div class="md:col-span-2 lg:col-span-3">
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Alamat
              </label>
              <p class="text-gray-900">{{ applicantInfo.alamat }}</p>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Status Household
              </label>
              <rs-badge
                :variant="getStatusVariant(applicantInfo.statusHousehold)"
              >
                {{ applicantInfo.statusHousehold }}
              </rs-badge>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Status Individu
              </label>
              <rs-badge
                :variant="getStatusVariant(applicantInfo.statusIndividu)"
              >
                {{ applicantInfo.statusIndividu }}
              </rs-badge>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Status Multidimensi
              </label>
              <rs-badge
                :variant="getStatusVariant(applicantInfo.statusMultidimensi)"
              >
                {{ applicantInfo.statusMultidimensi }}
              </rs-badge>
            </div>
          </div>
        </div>
      </template>
    </rs-card>

    <!-- Tabbed Interface for Maklumat Bantuan -->
    <rs-card>
      <template #header>
        <div class="flex justify-between items-center">
          <!-- <h3 class="text-lg font-semibold text-gray-900">
            Maklumat Bantuan
          </h3> -->
        </div>
      </template>
      <template #body>
        <!-- Custom Tabs Component -->
        <div class="bg-gray-50 p-6 rounded-lg">
          <!-- Tab Header -->
          <div class="flex items-center gap-3 mb-2">
            <div
              class="w-6 h-6 bg-teal-500 rounded flex items-center justify-center"
            >
              <svg
                class="w-4 h-4 text-white"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"
                />
              </svg>
            </div>
            <h3 class="text-lg font-semibold text-gray-800">
              Maklumat Bantuan
            </h3>
          </div>

          <!-- Tab Description -->
          <!-- <p class="text-gray-600 mb-6">Tabs are used to organize content into different sections.</p> -->

          <!-- Tab Navigation -->
          <div class="flex flex-wrap border-b border-gray-200 mb-6">
            <button
              v-for="(tab, index) in tabs"
              :key="index"
              @click="activeTab = tab.id"
              :class="[
                'px-6 py-3 text-sm font-medium transition-colors duration-200',
                activeTab === tab.id
                  ? 'text-teal-600 border-b-2 border-teal-600'
                  : 'text-gray-700 hover:text-gray-900',
              ]"
            >
              {{ tab.title }}
            </button>
          </div>

          <!-- Tab Content -->
          <div class="tab-content">
            <!-- Agihan Bantuan Tab -->
            <div v-if="activeTab === 'agihan'" class="space-y-4">
              <!-- <h4 class="text-lg font-semibold text-gray-800">Agihan Bantuan</h4> -->
              <!-- <p class="text-gray-600">This tab displays the aid distribution information.</p> -->

              <!-- Maklumat Agihan Bantuan -->
              <div class="mb-6">
                <h4 class="text-md font-semibold text-gray-800 mb-4">
                  Maklumat Agihan Bantuan
                </h4>

                <div
                  class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">
                      Aid
                    </label>
                    <p class="text-gray-900">{{ aidInfo.aid }}</p>
                  </div>

                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">
                      Aid Product
                    </label>
                    <p class="text-gray-900">{{ aidInfo.aidProduct }}</p>
                  </div>

                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">
                      Product Package
                    </label>
                    <p class="text-gray-900">{{ aidInfo.productPackage }}</p>
                  </div>

                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">
                      Entitlement Product
                    </label>
                    <p class="text-gray-900">
                      {{ aidInfo.entitlementProduct }}
                    </p>
                  </div>

                  <div class="md:col-span-2 lg:col-span-3">
                    <label class="block text-sm font-medium text-gray-700 mb-1">
                      Catatan Sebab Memohon Bantuan
                    </label>
                    <p class="text-gray-900">
                      {{ aidInfo.catatanSebabMemohon }}
                    </p>
                  </div>

                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">
                      Kadar Bantuan
                    </label>
                    <p class="text-gray-900 font-semibold">
                      RM {{ aidInfo.kadarBantuan }}
                    </p>
                  </div>

                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">
                      Tempoh / Kekerapan Bantuan
                    </label>
                    <p class="text-gray-900">{{ aidInfo.tempohKekerapan }}</p>
                  </div>

                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">
                      Tarikh Mula
                    </label>
                    <p class="text-gray-900">
                      {{ formatDate(aidInfo.tarikhMula) }}
                    </p>
                  </div>

                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">
                      Tarikh Tamat
                    </label>
                    <p class="text-gray-900">
                      {{ formatDate(aidInfo.tarikhTamat) }}
                    </p>
                  </div>

                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">
                      Jumlah Keseluruhan Bantuan Diterima
                    </label>
                    <p class="text-gray-900 font-semibold text-lg">
                      RM {{ aidInfo.jumlahKeseluruhan }}
                    </p>
                  </div>

                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">
                      Kod Bajet
                    </label>
                    <p class="text-gray-900">{{ aidInfo.kodBajet }}</p>
                  </div>

                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">
                      Penerima
                    </label>
                    <rs-badge :variant="getRecipientVariant(aidInfo.penerima)">
                      {{ aidInfo.penerima }}
                    </rs-badge>
                  </div>

                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">
                      Nama Penerima
                    </label>
                    <p class="text-gray-900">{{ aidInfo.namaPenerima }}</p>
                  </div>

                  <!-- Conditional fields based on payment method -->
                  <div v-if="aidInfo.kaedahPembayaran !== 'Tunai'">
                    <label class="block text-sm font-medium text-gray-700 mb-1">
                      Nama Pemegang Akaun
                    </label>
                    <p class="text-gray-900">{{ aidInfo.namaPemegangAkaun }}</p>
                  </div>

                  <div v-if="aidInfo.kaedahPembayaran !== 'Tunai'">
                    <label class="block text-sm font-medium text-gray-700 mb-1">
                      Bank
                    </label>
                    <p class="text-gray-900">{{ aidInfo.bank }}</p>
                  </div>

                  <div v-if="aidInfo.kaedahPembayaran !== 'Tunai'">
                    <label class="block text-sm font-medium text-gray-700 mb-1">
                      No. Akaun Bank
                    </label>
                    <p class="text-gray-900">{{ aidInfo.noAkaunBank }}</p>
                  </div>

                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">
                      SAP Code
                    </label>
                    <p class="text-gray-900">{{ aidInfo.sapCode }}</p>
                  </div>
                </div>
              </div>

              <!-- Distribution Item List -->
              <div>
                <h4 class="text-md font-semibold text-gray-800 mb-4">
                  Senarai Distribution Item
                </h4>

                <rs-table
                  :data="distributionItems"
                  :field="distributionItemFieldKeys"
                  :columns="distributionItemFields"
                  :options="{
                    variant: 'default',
                    striped: true,
                    bordered: true,
                    hover: true,
                  }"
                  :showNoColumn="true"
                />
              </div>
            </div>

            <!-- Tuntutan Tab -->
            <div v-if="activeTab === 'tuntutan'" class="space-y-4">
              <h4 class="text-lg font-semibold text-gray-800">Tuntutan</h4>
              <p class="text-gray-600">
                This tab displays the claim information.
              </p>

              <div class="p-4 text-center text-gray-500">
                <Icon name="ph:file-text" class="w-12 h-12 mx-auto mb-2" />
                <p>Maklumat Tuntutan akan dipaparkan di sini</p>
              </div>
            </div>

            <!-- Payment Advice Tab -->
            <div v-if="activeTab === 'payment'" class="space-y-4">
              <h4 class="text-lg font-semibold text-gray-800">
                Payment Advice
              </h4>

              <rs-table
                :data="paymentAdviceData"
                :columns="paymentAdviceColumns"
                :showNoColumn="true"
                :options="{
                  variant: 'default',
                  hover: false,
                  striped: false,
                  bordered: false,
                }"
              >
                <template v-slot:status="{ text }">
                  <rs-badge :variant="getPaymentStatusVariant(text)">
                    {{ text }}
                  </rs-badge>
                </template>
                <template v-slot:tindakan="{ text }">
                  <div class="flex justify-center items-center gap-2">
                    <rs-button
                      variant="primary"
                      size="sm"
                      class="p-1 flex gap-2"
                      @click="handleReviewPayment(text)"
                    >
                      Semak
                    </rs-button>
                  </div>
                </template>
              </rs-table>
            </div>

            <!-- Cash Issuance Tab -->
            <div v-if="activeTab === 'cash'" class="space-y-4">
              <h4 class="text-lg font-semibold text-gray-800">Cash Issuance</h4>

              <rs-table
                :data="cashIssuanceData"
                :columns="cashIssuanceColumns"
                :showNoColumn="true"
                :options="{
                  variant: 'default',
                  hover: false,
                  striped: false,
                  bordered: false,
                }"
              >
                <template v-slot:status="{ text }">
                  <rs-badge :variant="getPaymentStatusVariant(text)">
                    {{ text }}
                  </rs-badge>
                </template>
                <template v-slot:tindakan="{ text }">
                  <div class="flex justify-center items-center gap-2">
                    <rs-button
                      variant="primary"
                      size="sm"
                      class="p-1 flex gap-2"
                      @click="handleReviewCash(text)"
                    >
                      Semak
                    </rs-button>
                  </div>
                </template>
              </rs-table>
            </div>

            <!-- Purchase Requisition Tab -->
            <div v-if="activeTab === 'purchase'" class="space-y-4">
              <h4 class="text-lg font-semibold text-gray-800">
                Purchase Requisition
              </h4>

              <rs-table
                :data="purchaseReqData"
                :columns="purchaseReqColumns"
                :showNoColumn="true"
                :options="{
                  variant: 'default',
                  hover: false,
                  striped: false,
                  bordered: false,
                }"
              >
                <template v-slot:status="{ text }">
                  <rs-badge :variant="getPaymentStatusVariant(text)">{{
                    text
                  }}</rs-badge>
                </template>
                <template v-slot:tindakan="{ text }">
                  <div class="flex justify-center items-center gap-2">
                    <rs-button
                      variant="primary"
                      size="sm"
                      class="p-1 flex gap-2"
                      @click="handleReviewPR(text)"
                    >
                      Semak
                    </rs-button>
                  </div>
                </template>
              </rs-table>
            </div>

            <!-- Lampiran Tab -->
            <div v-if="activeTab === 'lampiran'" class="space-y-4">
              <h4 class="text-lg font-semibold text-gray-800">Lampiran</h4>

              <rs-table
                :data="lampiranData"
                :columns="lampiranColumns"
                :showNoColumn="true"
                :options="{
                  variant: 'default',
                  hover: false,
                  striped: false,
                  bordered: false,
                }"
              >
                <template v-slot:dokumen="{ text }">
                  <div class="text-sm text-gray-800">{{ text }}</div>
                </template>
                <template v-slot:aksi="{ row }">
                  <div class="flex items-center gap-2">
                    <rs-button
                      variant="secondary-outline"
                      size="sm"
                      class="p-1"
                      @click="previewDokumen(row)"
                      >Viewable</rs-button
                    >
                    <rs-button
                      variant="primary-outline"
                      size="sm"
                      class="p-1"
                      @click="downloadDokumen(row)"
                      >Download</rs-button
                    >
                  </div>
                </template>
                <template v-slot:statusDokumen="{ text, row }">
                  <div v-if="row">
                    <FormKit
                      v-model="row.statusDokumen"
                      type="select"
                      :options="statusDokumenOptions"
                      :classes="{ input: '!rounded-lg !py-1 !text-sm' }"
                    />
                  </div>
                  <span v-else class="text-gray-400 text-sm">-</span>
                </template>
                <template v-slot:catatan="{ row }">
                  <div v-if="row">
                    <FormKit
                      v-if="row.statusDokumen === 'Tidak Lengkap'"
                      v-model="row.catatan"
                      type="text"
                      placeholder="Nyatakan ketidaklengkapan"
                      :classes="{ input: '!rounded-lg !py-1 !text-sm' }"
                    />
                    <span v-else class="text-gray-400 text-sm">-</span>
                  </div>
                  <span v-else class="text-gray-400 text-sm">-</span>
                </template>
              </rs-table>
            </div>
          </div>
        </div>
      </template>
    </rs-card>

    <!-- Maklumat Laluan Proses Permohonan -->
    <rs-card class="mt-6">
      <template #header>
        <div class="flex justify-between items-center">
          <h3 class="text-lg font-semibold text-gray-900">
            Maklumat Laluan Proses Permohonan
          </h3>
          <rs-button variant="primary" @click="handleCheck">
            <Icon name="ph:check-circle" class="w-4 h-4 mr-1" />
            Semak
          </rs-button>
        </div>
      </template>
      <template #body>
        <div class="p-6">
          <div class="space-y-4">
            <div
              v-for="(process, index) in processFlow"
              :key="index"
              class="border-l-4 border-primary pl-4 pb-4"
            >
              <div class="flex items-center justify-between mb-2">
                <rs-badge :variant="getProcessStatusVariant(process.status)">
                  {{ process.status }}
                </rs-badge>
                <span class="text-sm text-gray-500">
                  {{ formatDateTime(process.tarikhMasa) }}
                </span>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">
                    Nama Pegawai
                  </label>
                  <p class="text-gray-900">{{ process.namaPegawai }}</p>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">
                    Catatan
                  </label>
                  <p class="text-gray-900">{{ process.catatan }}</p>
                </div>
              </div>
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

// Route params
const route = useRoute();
const aidId = route.params.id;

// Breadcrumb
const breadcrumb = ref([
  {
    name: "Bantuan",
    type: "link",
    path: "/BF-BTN/bantuan",
  },
  {
    name: "Senarai",
    type: "current",
    path: "/BF-BTN/bantuan",
  },
  {
    name: "Maklumat Bantuan",
    type: "current",
    path: `/BF-BTN/bantuan/${route.params.id}`,
  },
]);

// Tab configuration
const tabs = [
  { id: "agihan", title: "Agihan Bantuan" },
  { id: "tuntutan", title: "Tuntutan" },
  { id: "payment", title: "Payment Advice" },
  { id: "cash", title: "Cash Issuance" },
  { id: "purchase", title: "Purchase Requisition" },
  { id: "lampiran", title: "Lampiran" },
];

const activeTab = ref("agihan");

// Sample data - replace with actual API calls
const applicantInfo = ref({
  namaPenuh: "Ahmad bin Abdullah",
  noKadPengenalan: "800101-01-1234",
  noTelefon: "+60123456789",
  emel: "ahmad@example.com",
  alamat: "No. 123, Jalan Merdeka, Taman Merdeka, 50000 Kuala Lumpur",
  statusHousehold: "Aktif",
  statusIndividu: "Lulus",
  statusMultidimensi: "Miskin",
});

const aidInfo = ref({
  aid: "Bantuan Asnaf",
  aidProduct: "Bantuan Kewangan Bulanan",
  productPackage: "Paket Asnaf Standard",
  entitlementProduct: "Bantuan RM 500/bulan",
  catatanSebabMemohon:
    "Memerlukan bantuan kewangan untuk keperluan asas keluarga",
  kadarBantuan: "500.00",
  tempohKekerapan: "Bulanan",
  tarikhMula: "2024-01-01",
  tarikhTamat: "2024-12-31",
  jumlahKeseluruhan: "6000.00",
  kodBajet: "BUD-2024-001",
  penerima: "Asnaf",
  namaPenerima: "Ahmad bin Abdullah",
  kaedahPembayaran: "Bank Transfer",
  namaPemegangAkaun: "Ahmad bin Abdullah",
  bank: "Maybank",
  noAkaunBank: "1234567890",
  sapCode: "SAP-001",
});

const distributionItems = ref([
  {
    diNo: "DI-2024-001",
    entitlementProduct: "Bantuan RM 500/bulan",
    penerima: "Ahmad bin Abdullah",
    bulan: "Januari",
    tahun: "2024",
    status: "Dibayar",
    amaun: "500.00",
  },
  {
    diNo: "DI-2024-002",
    entitlementProduct: "Bantuan RM 500/bulan",
    penerima: "Ahmad bin Abdullah",
    bulan: "Februari",
    tahun: "2024",
    status: "Dibayar",
    amaun: "500.00",
  },
  {
    diNo: "DI-2024-003",
    entitlementProduct: "Bantuan RM 500/bulan",
    penerima: "Ahmad bin Abdullah",
    bulan: "Mac",
    tahun: "2024",
    status: "Menunggu",
    amaun: "500.00",
  },
]);

const distributionItemFields = [
  { key: "diNo", label: "DI No" },
  { key: "entitlementProduct", label: "Entitlement Product" },
  { key: "penerima", label: "Penerima" },
  { key: "bulan", label: "Bulan" },
  { key: "tahun", label: "Tahun" },
  { key: "status", label: "Status" },
  { key: "amaun", label: "Amaun (RM)" },
];

const distributionItemFieldKeys = [
  "diNo",
  "entitlementProduct",
  "penerima",
  "bulan",
  "tahun",
  "status",
  "amaun",
];

const processFlow = ref([
  {
    status: "Permohonan",
    namaPegawai: "Siti binti Ali",
    tarikhMasa: "2024-01-01 09:00:00",
    catatan: "Permohonan diterima dan sedang diproses",
  },
  {
    status: "Semak",
    namaPegawai: "Ahmad bin Hassan",
    tarikhMasa: "2024-01-02 14:30:00",
    catatan: "Dokumen lengkap, layak untuk bantuan",
  },
  {
    status: "Sokong",
    namaPegawai: "Fatimah binti Omar",
    tarikhMasa: "2024-01-03 11:15:00",
    catatan: "Menyokong permohonan bantuan",
  },
  {
    status: "Lulus",
    namaPegawai: "Mohd bin Ibrahim",
    tarikhMasa: "2024-01-04 16:45:00",
    catatan: "Permohonan diluluskan untuk bantuan bulanan",
  },
]);

// Utility functions
const formatDate = (dateString) => {
  if (!dateString) return "-";
  const date = new Date(dateString);
  return date.toLocaleDateString("ms-MY");
};

const formatDateTime = (dateTimeString) => {
  if (!dateTimeString) return "-";
  const date = new Date(dateTimeString);
  return date.toLocaleString("ms-MY");
};

const getStatusVariant = (status) => {
  const variants = {
    Aktif: "success",
    Lulus: "success",
    Miskin: "warning",
    "Tidak Aktif": "danger",
    "Tidak Lulus": "danger",
  };
  return variants[status] || "primary";
};

const getRecipientVariant = (recipient) => {
  const variants = {
    Asnaf: "warning",
    "Third Party": "info",
    Organisasi: "primary",
    PAK: "success",
  };
  return variants[recipient] || "primary";
};

const getProcessStatusVariant = (status) => {
  const variants = {
    Permohonan: "info",
    Semak: "warning",
    Sokong: "primary",
    Lulus: "success",
  };
  return variants[status] || "primary";
};

// Payment Advice mock data and helpers
const paymentAdviceData = ref([
  {
    paNo: "PA-2024-001",
    diNo: "DI-2024-001",
    dateCreated: "2024-02-01",
    penerimaBayaran: "Ahmad bin Abdullah",
    status: "Selesai",
    invoiceNo: "INV-0001",
    amaun: "500.00",
    tindakan: "PA-2024-001",
  },
  {
    paNo: "PA-2024-002",
    diNo: "DI-2024-002",
    dateCreated: "2024-03-01",
    penerimaBayaran: "Ahmad bin Abdullah",
    status: "Dalam Proses",
    invoiceNo: "INV-0002",
    amaun: "500.00",
    tindakan: "PA-2024-002",
  },
]);

const paymentAdviceColumns = [
  { key: "paNo", label: "PA No" },
  { key: "diNo", label: "DI No" },
  { key: "dateCreated", label: "Date Created" },
  { key: "penerimaBayaran", label: "Penerima Bayaran" },
  { key: "status", label: "Status" },
  { key: "invoiceNo", label: "Invoice No" },
  { key: "amaun", label: "Amaun (RM)" },
  { key: "tindakan", label: "Tindakan" },
];

const getPaymentStatusVariant = (status) => {
  const variants = {
    Selesai: "success",
    "Dalam Proses": "warning",
    Dibatalkan: "danger",
  };
  return variants[status] || "primary";
};

const handleReviewPayment = (paNo) => {
  console.log("Semak Payment Advice:", paNo);
};

// Cash Issuance mock data and helpers (follow same columns as Payment Advice image)
const cashIssuanceData = ref([
  {
    ciNo: "CI-2024-001",
    diNo: "DI-2024-004",
    dateCreated: "2024-04-01",
    penerimaBayaran: "Ahmad bin Abdullah",
    status: "Selesai",
    invoiceNo: "INV-0101",
    amaun: "500.00",
    tindakan: "CI-2024-001",
  },
  {
    ciNo: "CI-2024-002",
    diNo: "DI-2024-005",
    dateCreated: "2024-05-01",
    penerimaBayaran: "Ahmad bin Abdullah",
    status: "Dalam Proses",
    invoiceNo: "INV-0102",
    amaun: "500.00",
    tindakan: "CI-2024-002",
  },
]);

const cashIssuanceColumns = [
  { key: "ciNo", label: "CI No" },
  { key: "diNo", label: "DI No" },
  { key: "dateCreated", label: "Date Created" },
  { key: "penerimaBayaran", label: "Penerima Bayaran" },
  { key: "status", label: "Status" },
  { key: "invoiceNo", label: "Invoice No" },
  { key: "amaun", label: "Amaun (RM)" },
  { key: "tindakan", label: "Tindakan" },
];

const handleReviewCash = (ciNo) => {
  console.log("Semak Cash Issuance:", ciNo);
};

// Purchase Requisition data and helpers
const purchaseReqData = ref([
  {
    prNo: "PR-2024-001",
    diNo: "DI-2024-006",
    dateCreated: "2024-06-01",
    penerimaBayaran: "Ahmad bin Abdullah",
    status: "Selesai",
    paNo: "PA-2024-010",
    invoiceNo: "INV-0201",
    amaun: "500.00",
    tindakan: "PR-2024-001",
  },
]);

const purchaseReqColumns = [
  { key: "prNo", label: "PR No" },
  { key: "diNo", label: "DI No" },
  { key: "dateCreated", label: "Date Created" },
  { key: "penerimaBayaran", label: "Penerima Bayaran" },
  { key: "status", label: "Status" },
  { key: "paNo", label: "PA No" },
  { key: "invoiceNo", label: "Invoice No" },
  { key: "amaun", label: "Amaun (RM)" },
  { key: "tindakan", label: "Tindakan" },
];

const handleReviewPR = (prNo) => {
  console.log("Semak Purchase Requisition:", prNo);

  navigateTo(`/BF-BTN/permohonan/pemantauan/${prNo}`);
};

// Lampiran data and helpers
const statusDokumenOptions = [
  { label: "Lengkap", value: "Lengkap" },
  { label: "Tidak Lengkap", value: "Tidak Lengkap" },
  { label: "Tiada Keperluan", value: "Tiada Keperluan" },
];

const lampiranData = ref([
  { dokumen: "Kad Pengenalan.pdf", statusDokumen: "Lengkap", catatan: "" },
  {
    dokumen: "Bukti Pendapatan.pdf",
    statusDokumen: "Tidak Lengkap",
    catatan: "",
  },
  { dokumen: "Bil Utiliti.pdf", statusDokumen: "Tiada Keperluan", catatan: "" },
]);

const lampiranColumns = [
  { key: "dokumen", label: "Dokumen" },
  { key: "aksi", label: "Tindakan" },
  { key: "statusDokumen", label: "Status Dokumen" },
  { key: "catatan", label: "Catatan" },
];

const previewDokumen = (row) => {
  console.log("Preview dokumen:", row.nama);
};

const downloadDokumen = (row) => {
  console.log("Download dokumen:", row.nama);
};

// Event handlers
const handleBack = () => {
  navigateTo("/BF-BTN/bantuan");
};

const handlePrintLetter = () => {
  // Implement print letter functionality
  console.log("Print letter for aid ID:", aidId);
  navigateTo(`/BF-BTN/bantuan/${aidId}/cetak-surat`);
};

const handleCheck = () => {
  // Implement check functionality
  console.log("Check process for aid ID:", aidId);
};

// Fetch data on mount
onMounted(async () => {
  try {
    // Replace with actual API calls
    // const response = await $fetch(`/api/bantuan/${aidId}`)
    // applicantInfo.value = response.applicantInfo
    // aidInfo.value = response.aidInfo
    // distributionItems.value = response.distributionItems
    // processFlow.value = response.processFlow
  } catch (error) {
    console.error("Error fetching aid information:", error);
  }
});
</script>

<style lang="scss" scoped>
// Custom styles if needed
</style>
