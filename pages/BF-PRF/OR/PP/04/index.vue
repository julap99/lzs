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
          <p class="text-sm text-gray-600">No. Rujukan: ORG{{ applicationData.refNumber }}</p>
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
                <p class="text-xs text-gray-500">{{ doc.size }}</p>
              </div>
            </div>
            <div class="flex items-center gap-2">
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
                <input
                  v-model="approvalData.status"
                  type="radio"
                  value="Disahkan"
                  class="mr-2 text-green-600 focus:ring-green-500"
                />
                <span class="text-sm font-medium text-gray-900">Disahkan</span>
              </label>
              <label class="flex items-center">
                <input
                  v-model="approvalData.status"
                  type="radio"
                  value="Perlu Pembetulan"
                  class="mr-2 text-yellow-600 focus:ring-yellow-500"
                />
                <span class="text-sm font-medium text-gray-900">Perlu Pembetulan</span>
              </label>
              <label class="flex items-center">
                <input
                  v-model="approvalData.status"
                  type="radio"
                  value="Tidak Sah"
                  class="mr-2 text-red-600 focus:ring-red-500"
                />
                <span class="text-sm font-medium text-gray-900">Tidak Sah</span>
              </label>
            </div>
            <div v-if="!approvalData.status" class="mt-1 text-sm text-red-600">
              Status pengesahan adalah wajib
            </div>
          </div>
          
          <div v-if="approvalData.status === 'Perlu Pembetulan' || approvalData.status === 'Tidak Sah'">
            <label class="block text-sm font-medium text-gray-700 mb-2">
              {{ approvalData.status === 'Perlu Pembetulan' ? 'Ulasan Pembetulan' : 'Justifikasi Penolakan' }} <span class="text-red-500">*</span>
            </label>
            <textarea
              v-model="approvalData.justification"
              :placeholder="approvalData.status === 'Perlu Pembetulan' ? 'Sila nyatakan perkara yang perlu diperbetulkan' : 'Sila nyatakan sebab penolakan permohonan ini'"
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 min-h-[100px]"
              rows="4"
            ></textarea>
            <div v-if="!approvalData.justification" class="mt-1 text-sm text-red-600">
              Ulasan diperlukan untuk status ini
            </div>
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
    <rs-modal
      v-model="showConfirmationModal"
      title="Sahkan Keputusan Pengesahan"
      size="md"
    >
      <template #body>
        <div class="text-center">
          
          <h3 class="text-lg font-semibold text-gray-900 mb-2">
            Adakah anda pasti?
          </h3>
          <p class="text-gray-600 mb-4">
            Anda akan menghantar keputusan pengesahan untuk permohonan ini. 
            Tindakan ini tidak boleh dibatalkan.
          </p>
          <div class="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
            <p class="text-sm text-blue-800">
              <strong>Keputusan:</strong> {{ approvalData.status || 'Belum dipilih' }}
            </p>
            <p v-if="approvalData.justification" class="text-sm text-blue-800 mt-1">
              <strong>Ulasan:</strong> {{ approvalData.justification.substring(0, 100) }}{{ approvalData.justification.length > 100 ? '...' : '' }}
            </p>
          </div>
        </div>
      </template>
      <template #footer>
        <div class="flex justify-end gap-3">
          <rs-button
            variant="secondary-outline"
            @click="showConfirmationModal = false"
          >
            Batal
          </rs-button>
          <rs-button
            variant="primary"
            @click="confirmSubmit"
            :loading="processing"
          >
            <Icon name="ph:check" class="w-4 h-4 mr-2" />
            Ya, Hantar Keputusan
          </rs-button>
        </div>
      </template>
    </rs-modal>
  </div>
</template>



<script setup>
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import { useToast } from "vue-toastification";

definePageMeta({
  title: "Pengesahan Pendaftaran Organisasi",
});

const toast = useToast();
const router = useRouter();
const processing = ref(false);
const showConfirmationModal = ref(false);

const breadcrumb = ref([
  {
    name: "Pengesahan",
    type: "link",
    path: "/BF-PRF/OR/AP/01",
  },
  {
    name: "Pengesahan Pendaftaran Organisasi",
    type: "current",
  },
]);

// Mock application data - in real implementation this would be fetched from API
const applicationData = ref({
  refNumber: "2405001",
  applicationDate: "15 Mei 2025",
  status: "Menunggu Pengesahan",
  organizationType: "Swasta",
  organizationName: "Syarikat Teknologi Maju Sdn Bhd",
  registrationNumber: "200301012345",
  email: "admin@tekmas.com.my",
  addressLine1: "No. 123, Jalan Teknologi 3/5",
  addressLine2: "Tingkat 5, Blok A",
  addressLine3: "Taman Teknologi Malaysia",
  city: "Cyberjaya",
  postcode: "63000",
  state: "Selangor",
  contactPerson: "Ahmad Bin Abdullah",
  contactPhone: "012-3456789",
  contactEmail: "ahmad@tekmas.com.my",
  bankName: "CIMB Bank",
  bankAccountNumber: "8001234567890",
  penamaBank: "Syarikat Teknologi Maju Sdn Bhd",
  paymentMethod: "Bank Transfer",
  documents: [
    { name: "Sijil Pendaftaran Syarikat", filename: "sijil_pendaftaran_ssm.pdf", size: "2.4 MB" },
    { name: "Surat Perwakilan Kuasa", filename: "surat_perwakilan_kuasa.pdf", size: "1.8 MB" },
    { name: "Laporan Tahunan", filename: "laporan_tahunan_teknologi_maju_2025.pdf", size: "5.2 MB" },
    { name: "Penyata Bank", filename: "penyata_bank_disember_2024.pdf", size: "1.1 MB" },
  ],
});

const approvalData = ref({
  status: "",
  justification: "",
});

const getStatusBadgeVariant = () => {
  switch (applicationData.value.status) {
    case "Diluluskan":
      return "success";
    case "Ditolak":
      return "danger";
    case "Menunggu Pengesahan":
      return "warning";
    default:
      return "info";
  }
};

const confirmSubmit = async () => {
  showConfirmationModal.value = false;
  await handleApprovalSubmit();
};

const handleApprovalSubmit = async () => {
  // Validate justification if rejection
  if (
    approvalData.value.status === "rejected" &&
    !approvalData.value.justification
  ) {
    return;
  }

  processing.value = true;

  // Simulate API call to submit approval decision
  try {
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Update application status based on approval decision
    if (approvalData.value.status === "approved") {
      applicationData.value.status = "Diluluskan";

      toast.success("Permohonann telah berjaya diluluskan");
    } else {
      applicationData.value.status = "Ditolak";

      toast.success("Keputusan penolakan telah direkodkan");
    }

    // In real implementation, we would redirect to a list page after a short delay
    setTimeout(() => {
      processing.value = false;
      goBack();
    }, 1000);
  } catch (error) {
    processing.value = false;
    showErrorNotification("Ralat semasa memproses keputusan");
  }
};

const showErrorNotification = (message) => {
  // In real implementation, this would show a toast notification
  console.error("Error:", message);
};

const goBack = () => {
  // Navigate back to dashboard
  router.push("/BF-PRF/OR/PP");
};

// Mock handlers for document actions
const handleDownload = (doc) => {
  toast.success(`Memuat turun ${doc.name} telah berjaya`);
};

const handleView = (doc) => {
  toast.success(`Melihat dokumen ${doc.name}`);
};
</script>

