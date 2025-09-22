<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />
    <!-- Dynamic Page For Pengesahan Pendaftaran Organisasi -->
    <rs-card class="mt-4 p-6">
      <template #body>
        <!-- Status Summary Card -->
        <div class="mb-8 p-4 bg-gray-50 border border-gray-200 rounded-lg">
          <div class="flex justify-between items-start">
            <div>
              <h1 class="text-2xl font-bold text-gray-800 mb-2">Pengesahan Pendaftaran Organisasi</h1>
              <p class="text-sm text-gray-600">No. Rujukan: {{ applicationData.refNumber }}</p>
            </div>
            <div class="flex gap-2">
              <rs-badge :variant="getStatusBadgeVariant()">{{ applicationData.status }}</rs-badge>
            </div>
          </div>
        </div>

        <!-- Content Sections -->
        <div class="space-y-6 mb-8">
          <!-- Maklumat Permohonan -->
          <h3 class="text-lg font-semibold mb-4 text-gray-900">Maklumat Permohonan</h3>
          <div class="mb-8 p-6 border border-gray-200 rounded-lg">
            <div class="grid grid-cols-2 gap-4">
              <FormKit type="text" label="Tarikh Permohonan" v-model="applicationData.applicationDate" readonly :classes="{ input: '!py-2' }" />
              <FormKit type="text" label="Jenis Organisasi" v-model="applicationData.organizationType" readonly :classes="{ input: '!py-2' }" />
            </div>
          </div>

          <!-- Maklumat Organisasi -->
          <h3 class="text-lg font-semibold mb-4 text-gray-900">Maklumat Organisasi</h3>
          <div class="mb-8 p-6 border border-gray-200 rounded-lg">
            <div class="grid grid-cols-2 gap-4">
              <FormKit type="text" label="Nama Organisasi" v-model="applicationData.organizationName" readonly :classes="{ input: '!py-2' }" />
              <FormKit type="text" label="No. Pendaftaran" v-model="applicationData.registrationNumber" readonly :classes="{ input: '!py-2' }" />
              <FormKit type="text" label="Email" v-model="applicationData.email" readonly :classes="{ input: '!py-2' }" />
            </div>
          </div>

          <!-- Alamat -->
          <h3 class="text-lg font-semibold mb-4 text-gray-900">Alamat</h3>
          <div class="mb-8 p-6 border border-gray-200 rounded-lg">
            <div class="grid grid-cols-2 gap-4">
              <FormKit type="text" label="Alamat 1" v-model="applicationData.addressLine1" readonly :classes="{ input: '!py-2' }" />
              <FormKit type="text" label="Negeri" v-model="applicationData.state" readonly :classes="{ input: '!py-2' }" />
              <FormKit type="text" label="Alamat 2" v-model="applicationData.addressLine2" readonly :classes="{ input: '!py-2' }" />
              <FormKit type="text" label="Bandar" v-model="applicationData.city" readonly :classes="{ input: '!py-2' }" />
              <FormKit type="text" label="Alamat 3" v-model="applicationData.addressLine3" readonly :classes="{ input: '!py-2' }" />
              <FormKit type="text" label="Poskod" v-model="applicationData.postcode" readonly :classes="{ input: '!py-2' }" />
            </div>
          </div>

          <!-- Maklumat Pegawai Dihubungi -->
          <h3 class="text-lg font-semibold mb-4 text-gray-900">Maklumat Pegawai Dihubungi</h3>
          <div class="mb-8 p-6 border border-gray-200 rounded-lg">
            <div class="grid grid-cols-2 gap-4">
              <FormKit type="text" label="Nama Pegawai" v-model="applicationData.contactPerson" readonly :classes="{ input: '!py-2' }" />
              <FormKit type="text" label="Telefon" v-model="applicationData.contactPhone" readonly :classes="{ input: '!py-2' }" />
              <FormKit type="text" label="Email" v-model="applicationData.contactEmail" readonly :classes="{ input: '!py-2' }" />
            </div>
          </div>

          <!-- Maklumat Bank -->
          <h3 class="text-lg font-semibold mb-4 text-gray-900">Maklumat Bank</h3>
          <div class="mb-8 p-6 border border-gray-200 rounded-lg">
            <div class="grid grid-cols-2 gap-4">
              <FormKit type="text" label="Nama Bank" v-model="applicationData.bankName" readonly :classes="{ input: '!py-2' }" />
              <FormKit type="text" label="Nombor Akaun Bank" v-model="applicationData.bankAccountNumber" readonly :classes="{ input: '!py-2' }" />
              <FormKit type="text" label="Penama Akaun Bank" v-model="applicationData.penamaBank" readonly :classes="{ input: '!py-2' }" />
              <FormKit type="text" label="Kaedah Pembayaran" v-model="applicationData.paymentMethod" readonly :classes="{ input: '!py-2' }" />
            </div>
          </div>

          <!-- Dokumen Sokongan -->
          <h3 class="text-lg font-semibold mb-4 text-gray-900">Dokumen Sokongan</h3>
          <div class="mb-8 p-6 border border-gray-200 rounded-lg">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div v-for="(doc, index) in applicationData.documents" :key="index" class="p-4 border border-gray-200 rounded-lg flex items-center justify-between">
                <div class="flex items-center">
                  <Icon name="mdi:file-document-outline" class="text-blue-600 mr-3" size="1.25rem" />
                  <div>
                    <p class="font-medium text-gray-900">{{ doc.name }}</p>
                    <p class="text-sm text-gray-600">{{ doc.filename }}</p>
                    <p class="text-xs text-gray-500" v-if="doc.size">{{ doc.size }}</p>
                  </div>
                </div>
                <div class="flex items-center gap-2" v-if="doc.filename">
                  <rs-button variant="secondary-outline" size="sm" class="!p-1 !w-8 !h-8" :title="`Muat Turun`" @click="handleDownload(doc)">
                    <Icon name="ph:download" size="1rem" />
                  </rs-button>
                  <rs-button variant="secondary-outline" size="sm" class="!p-1 !w-8 !h-8" :title="`Lihat`" @click="handleView(doc)">
                    <Icon name="ph:eye" size="1rem" />
                  </rs-button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Keputusan Pengesahan Section -->
        <rs-card class="border-2 border-orange-200 bg-orange-50">
          <template #header>
            <h2 class="text-lg font-semibold text-gray-900">Keputusan Pengesahan</h2>
          </template>
          <template #body>
            <div class="space-y-6">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-3">Status Pengesahan <span class="text-red-500">*</span></label>
                <div class="space-y-2">
                  <label class="flex items-center">
                    <input v-model="approvalData.status" type="radio" value="Disahkan" class="mr-2 text-green-600 focus:ring-green-500" />
                    <span class="text-sm font-medium text-gray-900">Disahkan</span>
                  </label>
                  <label class="flex items-center">
                    <input v-model="approvalData.status" type="radio" value="Perlu Pembetulan" class="mr-2 text-yellow-600 focus:ring-yellow-500" />
                    <span class="text-sm font-medium text-gray-900">Perlu Pembetulan</span>
                  </label>
                  <label class="flex items-center">
                    <input v-model="approvalData.status" type="radio" value="Tidak Sah" class="mr-2 text-red-600 focus:ring-red-500" />
                    <span class="text-sm font-medium text-gray-900">Tidak Sah</span>
                  </label>
                </div>
                <div v-if="!approvalData.status" class="mt-1 text-sm text-red-600">Status pengesahan adalah wajib</div>
              </div>

              <div v-if="approvalData.status === 'Perlu Pembetulan' || approvalData.status === 'Tidak Sah'">
                <label class="block text-sm font-medium text-gray-700 mb-2">{{ approvalData.status === 'Perlu Pembetulan' ? 'Ulasan Pembetulan' : 'Justifikasi Penolakan' }} <span class="text-red-500">*</span></label>
                <textarea v-model="approvalData.justification" :placeholder="approvalData.status === 'Perlu Pembetulan' ? 'Sila nyatakan perkara yang perlu diperbetulkan' : 'Sila nyatakan sebab penolakan permohonan ini'" class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 min-h-[100px]" rows="4"></textarea>
                <div v-if="!approvalData.justification" class="mt-1 text-sm text-red-600">Ulasan diperlukan untuk status ini</div>
              </div>
            </div>
          </template>
        </rs-card>

        <!-- Action Buttons Outside Section -->
        <div class="mt-6 flex justify-end gap-4">
          <rs-button variant="secondary" @click="goBack">
            <Icon name="ph:arrow-left" class="mr-1" size="1rem" />
            Kembali
          </rs-button>
          <rs-button variant="primary" @click="showConfirmationModal = true" :disabled="processing" class="px-8 py-3">
            <template v-if="processing">
              <Icon name="eos-icons:loading" class="animate-spin mr-2" size="1rem" /> Memproses...
            </template>
            <template v-else>
              <Icon name="material-symbols:check-circle" class="mr-2" size="1rem" /> Hantar Keputusan
            </template>
          </rs-button>
        </div>
      </template>
    </rs-card>

    <!-- Confirmation Modal -->
    <rs-modal v-model="showConfirmationModal" title="Sahkan Keputusan Pengesahan" size="md">
      <template #body>
        <div class="text-center">
          <h3 class="text-lg font-semibold text-gray-900 mb-2">Adakah anda pasti?</h3>
          <p class="text-gray-600 mb-4">Anda akan menghantar keputusan pengesahan untuk permohonan ini. Tindakan ini tidak boleh dibatalkan.</p>
          <div class="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
            <p class="text-sm text-blue-800"><strong>Keputusan:</strong> {{ approvalData.status || 'Belum dipilih' }}</p>
            <p v-if="approvalData.justification" class="text-sm text-blue-800 mt-1">
              <strong>Ulasan:</strong> {{ approvalData.justification.substring(0, 100) }}{{ approvalData.justification.length > 100 ? '...' : '' }}
            </p>
          </div>
        </div>
      </template>
      <template #footer>
        <div class="flex justify-end gap-3">
          <rs-button variant="secondary-outline" @click="showConfirmationModal = false">Batal</rs-button>
          <rs-button variant="primary" @click="confirmSubmit" :loading="processing">
            <Icon name="ph:check" class="w-4 h-4 mr-2" />
            Ya, Hantar Keputusan
          </rs-button>
        </div>
      </template>
    </rs-modal>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import { useRoute } from "vue-router";
import { useToast } from "vue-toastification";

definePageMeta({ title: "Pengesahan Pendaftaran Organisasi" });

const route = useRoute();
const toast = useToast();
const processing = ref(false);
const showConfirmationModal = ref(false);

const breadcrumb = ref([
  { name: "Pengesahan", type: "link", path: "/BF-PRF/OR/PP" },
  { name: "Pengesahan Pendaftaran Organisasi", type: "current" },
]);

const approvalData = ref({ status: "", justification: "" });

const applicationData = ref({
  refNumber: "",
  applicationDate: "",
  status: "Menunggu Pengesahan",
  organizationType: "",
  organizationName: "",
  registrationNumber: "",
  email: "",
  addressLine1: "",
  addressLine2: "",
  addressLine3: "",
  city: "",
  postcode: "",
  state: "",
  contactPerson: "",
  contactPhone: "",
  contactEmail: "",
  bankName: "",
  bankAccountNumber: "",
  penamaBank: "",
  paymentMethod: "",
  documents: [],
});

const dataset = {
  'ORG-202507-0001': {
    refNumber: 'ORG-202507-0001',
    applicationDate: '23/7/2025',
    status: 'Disahkan',
    organizationType: 'Masjid',
    organizationName: 'Masjid Sultan Salahuddin Abdul Aziz Shah',
    registrationNumber: 'PPM-2021-001',
    email: 'admin@masjid-selangor.gov.my',
    addressLine1: 'No. 1, Jalan Masjid',
    addressLine2: 'Seksyen 14',
    addressLine3: '',
    city: 'Shah Alam',
    postcode: '40000',
    state: 'Selangor',
    contactPerson: 'Ustaz Ahmad bin Hassan',
    contactPhone: '03-55123456',
    contactEmail: 'ahmad.hassan@masjid-selangor.gov.my',
    bankName: 'Bank Islam',
    bankAccountNumber: '1234567890123456',
    penamaBank: 'Masjid Sultan Salahuddin Abdul Aziz Shah',
    paymentMethod: 'Bank Transfer',
    documents: [
      { name: 'Sijil Pendaftaran Masjid', filename: 'sijil_pendaftaran_masjid.pdf', size: '2.4 MB' },
      { name: 'Surat Perwakilan Kuasa', filename: 'surat_perwakilan_kuasa.pdf', size: '1.8 MB' },
      { name: 'Laporan Tahunan', filename: 'laporan_tahunan_masjid_2025.pdf', size: '5.2 MB' },
      { name: 'Penyata Bank', filename: 'penyata_bank_disember_2024.pdf', size: '1.1 MB' },
    ],
  },
  'ORG-202506-0002': {
    refNumber: 'ORG-202506-0002',
    applicationDate: '15/6/2025',
    status: 'Disahkan',
    organizationType: 'Masjid',
    organizationName: 'Masjid Sultan Salahuddin Abdul Aziz Shah - Cawangan Petaling Jaya',
    registrationNumber: 'PPM-2021-002',
    email: 'info@masjid-pj-selangor.gov.my',
    addressLine1: 'No. 88, Jalan Masjid PJ',
    addressLine2: 'Taman Masjid Jaya',
    addressLine3: '',
    city: 'Petaling Jaya',
    postcode: '46000',
    state: 'Selangor',
    contactPerson: 'Ustaz Ibrahim bin Yusof',
    contactPhone: '03-22345678',
    contactEmail: 'ibrahim@masjid-pj-selangor.gov.my',
    bankName: 'Maybank',
    bankAccountNumber: '5123456789012',
    penamaBank: 'Masjid Sultan Salahuddin Abdul Aziz Shah - Cawangan PJ',
    paymentMethod: 'Bank Transfer',
    documents: [
      { name: 'Sijil Pendaftaran Cawangan', filename: 'sijil_cawangan_2023.pdf', size: '2.0 MB' },
      { name: 'Surat Perwakilan Kuasa', filename: 'surat_perwakilan_2025.pdf', size: '1.5 MB' },
      { name: 'Surat Pengesahan Bank', filename: 'bank_confirmation_letter.pdf', size: '0.9 MB' },
    ],
  },
  'ORG-202505-0003': {
    refNumber: 'ORG-202505-0003',
    applicationDate: '8/5/2025',
    status: 'Menunggu Pengesahan',
    organizationType: 'Masjid',
    organizationName: 'Masjid Sultan Salahuddin Abdul Aziz Shah - Cawangan Klang',
    registrationNumber: 'PPM-2021-003',
    email: 'info@masjid-klang-selangor.gov.my',
    addressLine1: 'No. 15, Jalan Masjid Klang',
    addressLine2: 'Taman Masjid Klang',
    addressLine3: 'Seksyen 5',
    city: 'Klang',
    postcode: '41000',
    state: 'Selangor',
    contactPerson: 'Dr. Ahmad Fauzi bin Abdul Rahman',
    contactPhone: '03-33456789',
    contactEmail: 'fauzi@masjid-klang-selangor.gov.my',
    bankName: 'Bank Islam',
    bankAccountNumber: '2098765432109',
    penamaBank: 'Masjid Sultan Salahuddin Abdul Aziz Shah - Cawangan Klang',
    paymentMethod: 'Bank Transfer',
    documents: [
      { name: 'Sijil Pendaftaran Cawangan', filename: 'sijil_cawangan_klang.pdf', size: '2.0 MB' },
      { name: 'Surat Perwakilan Kuasa', filename: 'surat_perwakilan_klang.pdf', size: '1.5 MB' },
      { name: 'Surat Pengesahan Bank', filename: 'bank_confirmation_klang.pdf', size: '0.9 MB' },
    ],
  },
  'ORG-202506-0005': {
    refNumber: 'ORG-202506-0005',
    applicationDate: '12/6/2025',
    status: 'Tidak Sah',
    organizationType: 'NGO',
    organizationName: 'Pertubuhan Kebajikan Islam Selangor',
    registrationNumber: 'PPM-2022-001',
    email: 'info@pki-selangor.org.my',
    addressLine1: 'No. 77, Jalan Kebajikan 2/4',
    addressLine2: 'Pusat Kebajikan Islam',
    addressLine3: 'Tingkat 15',
    city: 'Puchong',
    postcode: '47100',
    state: 'Selangor',
    contactPerson: 'Azman bin Abdullah',
    contactPhone: '03-21234567',
    contactEmail: 'azman@pki-selangor.org.my',
    bankName: 'Public Bank',
    bankAccountNumber: '4567890123456',
    penamaBank: 'Pertubuhan Kebajikan Islam Selangor',
    paymentMethod: 'Bank Transfer',
    documents: [
      { name: 'Sijil Pendaftaran NGO', filename: 'sijil_ngo_2022.pdf', size: '2.0 MB' },
      { name: 'Surat Perwakilan Kuasa', filename: 'surat_perwakilan_ngo.pdf', size: '1.5 MB' },
      { name: 'Surat Pengesahan Bank', filename: 'bank_confirmation_ngo.pdf', size: '0.9 MB' },
    ],
  },
  'ORG-202508-0008': {
    refNumber: 'ORG-202508-0008',
    applicationDate: '05/8/2025',
    status: 'Dalam Pembetulan',
    organizationType: 'Kesihatan',
    organizationName: 'Pusat Dialisis As-Salam Shah Alam',
    registrationNumber: 'PPM-2021-015',
    email: 'info@dialisis-as-salam-selangor.gov.my',
    addressLine1: 'No. 88, Jalan Kesihatan 2/1',
    addressLine2: 'Taman Kesihatan Jaya',
    addressLine3: 'Seksyen 2',
    city: 'Shah Alam',
    postcode: '40000',
    state: 'Selangor',
    contactPerson: 'Dato Dr. Siti Aisyah binti Hassan',
    contactPhone: '03-55123456',
    contactEmail: 'aisyah@dialisis-as-salam-selangor.gov.my',
    bankName: 'Bank Islam',
    bankAccountNumber: '1234567890123',
    penamaBank: 'Pusat Dialisis As-Salam Shah Alam',
    paymentMethod: 'Bank Transfer',
    documents: [
      { name: 'Sijil Pendaftaran Kesihatan', filename: 'sijil_kesihatan_2021.pdf', size: '2.0 MB' },
      { name: 'Surat Perwakilan Kuasa', filename: 'surat_perwakilan_kesihatan.pdf', size: '1.5 MB' },
      { name: 'Surat Pengesahan Bank', filename: 'bank_confirmation_kesihatan.pdf', size: '0.9 MB' },
    ],
  },
};

const getStatusBadgeVariant = () => {
  switch (applicationData.value.status) {
    case 'Disahkan':
      return 'success';
    case 'Perlu Pembetulan':
      return 'warning';
    case 'Tidak Sah':
      return 'danger';
    case 'Menunggu Pengesahan':
      return 'warning';
    default:
      return 'info';
  }
};

const confirmSubmit = async () => {
  showConfirmationModal.value = false;
  await handleApprovalSubmit();
};

const handleApprovalSubmit = async () => {
  if (!approvalData.value.status) {
    toast.error('Sila pilih status pengesahan');
    return;
  }
  if ((approvalData.value.status === 'Perlu Pembetulan' || approvalData.value.status === 'Tidak Sah') && !approvalData.value.justification) {
    toast.error('Ulasan diperlukan untuk status ini');
    return;
  }

  processing.value = true;
  try {
    await new Promise((r) => setTimeout(r, 1000));
    applicationData.value.status = approvalData.value.status;
    toast.success('Keputusan telah direkodkan');
    setTimeout(() => {
      processing.value = false;
      goBack();
    }, 800);
  } catch (e) {
    processing.value = false;
    console.error(e);
  }
};

const goBack = () => {
  navigateTo('/BF-PRF/OR/PP');
};

const handleDownload = (doc) => {
  toast.success(`Memuat turun ${doc.name} telah berjaya`);
};
const handleView = (doc) => {
  toast.success(`Melihat dokumen ${doc.name}`);
};

const loadApplicationData = () => {
  const id = route.params.id;
  
  if (dataset[id]) {
    // Direct assignment to ensure data is loaded
    Object.assign(applicationData.value, dataset[id]);
  } else {
    // Fallback minimal mock using id
    applicationData.value.refNumber = id;
  }
};

onMounted(() => {
  loadApplicationData();
});

// Watch for route changes
watch(() => route.params.id, (newId) => {
  if (newId) {
    loadApplicationData();
  }
});
</script>


