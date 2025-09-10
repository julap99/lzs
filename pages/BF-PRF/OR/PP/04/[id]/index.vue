<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />

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
              <FormKit type="text" label="Tarikh Permohonan" :value="applicationData.applicationDate" readonly :classes="{ input: '!py-2' }" />
              <FormKit type="text" label="Jenis Organisasi" :value="applicationData.organizationType" readonly :classes="{ input: '!py-2' }" />
            </div>
          </div>

          <!-- Maklumat Organisasi -->
          <h3 class="text-lg font-semibold mb-4 text-gray-900">Maklumat Organisasi</h3>
          <div class="mb-8 p-6 border border-gray-200 rounded-lg">
            <div class="grid grid-cols-2 gap-4">
              <FormKit type="text" label="Nama Organisasi" :value="applicationData.organizationName" readonly :classes="{ input: '!py-2' }" />
              <FormKit type="text" label="No. Pendaftaran" :value="applicationData.registrationNumber" readonly :classes="{ input: '!py-2' }" />
              <FormKit type="text" label="Email" :value="applicationData.email" readonly :classes="{ input: '!py-2' }" />
            </div>
          </div>

          <!-- Alamat -->
          <h3 class="text-lg font-semibold mb-4 text-gray-900">Alamat</h3>
          <div class="mb-8 p-6 border border-gray-200 rounded-lg">
            <div class="grid grid-cols-2 gap-4">
              <FormKit type="text" label="Alamat 1" :value="applicationData.addressLine1" readonly :classes="{ input: '!py-2' }" />
              <FormKit type="text" label="Negeri" :value="applicationData.state" readonly :classes="{ input: '!py-2' }" />
              <FormKit type="text" label="Alamat 2" :value="applicationData.addressLine2" readonly :classes="{ input: '!py-2' }" />
              <FormKit type="text" label="Bandar" :value="applicationData.city" readonly :classes="{ input: '!py-2' }" />
              <FormKit type="text" label="Alamat 3" :value="applicationData.addressLine3" readonly :classes="{ input: '!py-2' }" />
              <FormKit type="text" label="Poskod" :value="applicationData.postcode" readonly :classes="{ input: '!py-2' }" />
            </div>
          </div>

          <!-- Maklumat Pegawai Dihubungi -->
          <h3 class="text-lg font-semibold mb-4 text-gray-900">Maklumat Pegawai Dihubungi</h3>
          <div class="mb-8 p-6 border border-gray-200 rounded-lg">
            <div class="grid grid-cols-2 gap-4">
              <FormKit type="text" label="Nama Pegawai" :value="applicationData.contactPerson" readonly :classes="{ input: '!py-2' }" />
              <FormKit type="text" label="Telefon" :value="applicationData.contactPhone" readonly :classes="{ input: '!py-2' }" />
              <FormKit type="text" label="Email" :value="applicationData.contactEmail" readonly :classes="{ input: '!py-2' }" />
            </div>
          </div>

          <!-- Maklumat Bank -->
          <h3 class="text-lg font-semibold mb-4 text-gray-900">Maklumat Bank</h3>
          <div class="mb-8 p-6 border border-gray-200 rounded-lg">
            <div class="grid grid-cols-2 gap-4">
              <FormKit type="text" label="Nama Bank" :value="applicationData.bankName" readonly :classes="{ input: '!py-2' }" />
              <FormKit type="text" label="Nombor Akaun Bank" :value="applicationData.bankAccountNumber" readonly :classes="{ input: '!py-2' }" />
              <FormKit type="text" label="Penama Akaun Bank" :value="applicationData.penamaBank" readonly :classes="{ input: '!py-2' }" />
              <FormKit type="text" label="Kaedah Pembayaran" :value="applicationData.paymentMethod" readonly :classes="{ input: '!py-2' }" />
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
import { ref, onMounted } from "vue";
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
    status: 'Menunggu Pengesahan',
    organizationType: 'Swasta',
    organizationName: 'Syarikat Teknologi Maju Sdn Bhd',
    registrationNumber: '200301012345',
    email: 'admin@tekmas.com.my',
    addressLine1: 'No. 123, Jalan Teknologi 3/5',
    addressLine2: 'Tingkat 5, Blok A',
    addressLine3: 'Taman Teknologi Malaysia',
    city: 'Cyberjaya',
    postcode: '63000',
    state: 'Selangor',
    contactPerson: 'Ahmad Bin Abdullah',
    contactPhone: '012-3456789',
    contactEmail: 'ahmad@tekmas.com.my',
    bankName: 'CIMB Bank',
    bankAccountNumber: '8001234567890',
    penamaBank: 'Syarikat Teknologi Maju Sdn Bhd',
    paymentMethod: 'Bank Transfer',
    documents: [
      { name: 'Sijil Pendaftaran Syarikat', filename: 'sijil_pendaftaran_ssm.pdf', size: '2.4 MB' },
      { name: 'Surat Perwakilan Kuasa', filename: 'surat_perwakilan_kuasa.pdf', size: '1.8 MB' },
      { name: 'Laporan Tahunan', filename: 'laporan_tahunan_teknologi_maju_2025.pdf', size: '5.2 MB' },
      { name: 'Penyata Bank', filename: 'penyata_bank_disember_2024.pdf', size: '1.1 MB' },
    ],
  },
  'ORG-202506-0002': {
    refNumber: 'ORG-202506-0002',
    applicationDate: '15/6/2025',
    status: 'Disahkan',
    organizationType: 'NGO',
    organizationName: 'Pertubuhan Amal Iman Malaysia',
    registrationNumber: 'PPM-2023-001',
    email: 'info@amaliman.org',
    addressLine1: 'No. 456, Jalan Amal 2/3',
    addressLine2: 'Taman Amal Jaya',
    addressLine3: '',
    city: 'Shah Alam',
    postcode: '40000',
    state: 'Selangor',
    contactPerson: 'Ustaz Mohd Zaki',
    contactPhone: '03-98765432',
    contactEmail: 'zaki@amaliman.org',
    bankName: 'Maybank',
    bankAccountNumber: '5123456789012',
    penamaBank: 'Pertubuhan Amal Iman Malaysia',
    paymentMethod: 'Bank Transfer',
    documents: [
      { name: 'Sijil Pendaftaran ROS', filename: 'sijil_ros_2023.pdf', size: '2.0 MB' },
      { name: 'Surat Perwakilan Kuasa', filename: 'surat_perwakilan_2025.pdf', size: '1.5 MB' },
      { name: 'Surat Pengesahan Bank', filename: 'bank_confirmation_letter.pdf', size: '0.9 MB' },
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

onMounted(() => {
  const id = route.params.id;
  if (dataset[id]) {
    applicationData.value = { ...applicationData.value, ...dataset[id] };
  } else {
    // Fallback minimal mock using id
    applicationData.value.refNumber = id;
  }
});
</script>


