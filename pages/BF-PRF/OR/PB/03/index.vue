<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />

    <div class="mt-6 mb-4 p-4 bg-gray-50 border border-gray-200 rounded-lg">
      <div class="flex justify-between items-start">
        <div>
          <h1 class="text-2xl font-bold text-gray-800">Pengesahan Pendaftaran Cawangan</h1>
          <p class="text-sm text-gray-500">No. Rujukan: {{ applicationData.refNumber }}</p>
        </div>
        <rs-badge :variant="getStatusBadgeVariant()">{{ applicationData.status }}</rs-badge>
      </div>
    </div>

    <div class="space-y-6">
        <!-- Maklumat Permohonan -->
        <rs-card>
          <template #header>
            <h2 class="text-md font-semibold text-gray-900">Maklumat Permohonan</h2>
          </template>
          <template #body>
            <div class="space-y-4">
              <FormKit type="text" label="Tarikh Permohonan" :value="applicationData.applicationDate" disabled />
              <FormKit type="text" label="Jenis Permohonan" :value="'Pendaftaran Cawangan'" disabled />
            </div>
          </template>
        </rs-card>

        <!-- Maklumat Cawangan -->
        <rs-card>
          <template #header>
            <h2 class="text-md font-semibold text-gray-900">Maklumat Cawangan</h2>
          </template>
          <template #body>
            <div class="space-y-4">
              <FormKit type="text" label="Nama Cawangan" :value="applicationData.namaCawangan" disabled />
              <FormKit type="text" label="Nama Organisasi Induk" :value="applicationData.namaHQ" disabled />
              <FormKit type="text" label="Pengurus Cawangan" :value="applicationData.pengurusCawangan" disabled />
            </div>
          </template>
        </rs-card>

        <!-- Alamat Cawangan -->
        <rs-card>
          <template #header>
            <h2 class="text-md font-semibold text-gray-900">Alamat Cawangan</h2>
          </template>
          <template #body>
            <div class="space-y-4">
              <FormKit type="text" label="Alamat" :value="applicationData.alamat.jalan" disabled />
              <FormKit type="text" label="Bandar / Poskod" :value="`${applicationData.alamat.bandar} - ${applicationData.alamat.poskod}`" disabled />
              <FormKit type="text" label="Negeri" :value="applicationData.alamat.negeri" disabled />
            </div>
          </template>
        </rs-card>

        <!-- Maklumat Hubungan -->
        <rs-card>
          <template #header>
            <h2 class="text-md font-semibold text-gray-900">Maklumat Hubungan</h2>
          </template>
          <template #body>
            <div class="space-y-4">
              <FormKit type="text" label="Emel" :value="applicationData.emel" disabled />
              <FormKit type="text" label="No. Telefon" :value="applicationData.noTelefon" disabled />
              <FormKit type="text" label="Daerah" :value="applicationData.daerah" disabled />
            </div>
          </template>
        </rs-card>

        <!-- Dokumen Sokongan -->
        <rs-card>
          <template #header>
            <h2 class="text-md font-semibold text-gray-900">Dokumen Sokongan</h2>
          </template>
          <template #body>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div v-for="(doc, index) in documents" :key="index" class="p-4 border border-gray-200 rounded-lg flex items-center justify-between">
                <div class="flex items-center">
                  <Icon name="mdi:file-document-outline" class="text-blue-600 mr-3" size="1.25rem" />
                  <div>
                    <p class="font-medium text-gray-900">{{ doc.name }}</p>
                    <p class="text-sm text-gray-600" v-if="doc.filename">{{ doc.filename }}</p>
                    <p class="text-xs text-gray-500" v-if="doc.size">{{ doc.size }}</p>
                    <rs-badge v-if="!doc.filename && !doc.size" variant="warning">Tiada</rs-badge>
                  </div>
                </div>
                <div class="flex items-center gap-2" v-if="doc.filename">
                  <rs-button variant="secondary-outline" size="sm" class="!p-1 !w-8 !h-8" title="Muat Turun" @click="viewDocument(doc.name)">
                    <Icon name="ph:download" size="1rem" />
                  </rs-button>
                  <rs-button variant="secondary-outline" size="sm" class="!p-1 !w-8 !h-8" title="Lihat" @click="viewDocument(doc.name)">
                    <Icon name="ph:eye" size="1rem" />
                  </rs-button>
                </div>
              </div>
            </div>
          </template>
        </rs-card>

        <!-- Keputusan Pengesahan -->
        <rs-card class="border-2 border-orange-200 bg-orange-50">
          <template #header>
            <h2 class="text-md font-semibold text-gray-900">Keputusan Pengesahan</h2>
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
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  {{ approvalData.status === 'Perlu Pembetulan' ? 'Ulasan Pembetulan' : 'Justifikasi Penolakan' }} <span class="text-red-500">*</span>
                </label>
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
    </div>

    <!-- Confirmation Modal -->
    <rs-modal
      v-model="showConfirmationModal"
      title="Sahkan Keputusan Pengesahan"
      size="md"
    >
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
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useToast } from 'vue-toastification';

definePageMeta({ 
  title: 'Pengesahan Pendaftaran Cawangan' 
});

const toast = useToast();
const router = useRouter();
const processing = ref(false);
const showConfirmationModal = ref(false);

const breadcrumb = ref([
  { name: 'Pengesahan', type: 'link', path: '/BF-PRF/OR/PB' },
  { name: 'Senarai Cawangan', type: 'link', path: '/BF-PRF/OR/PB' },
  { name: 'Pengesahan Pendaftaran Cawangan', type: 'current' },
]);

// Application data (mock data - in real implementation this would be fetched from API)
const applicationData = ref({
  refNumber: 'CB-240501',
  applicationDate: '25 Jun 2025',
  status: 'Menunggu Pengesahan',
  namaCawangan: 'Masjid Sultan Salahuddin Abdul Aziz Shah - Cawangan Petaling Jaya',
  namaHQ: 'Masjid Sultan Salahuddin Abdul Aziz Shah',
  pengurusCawangan: 'Ustaz Ibrahim bin Yusof',
  daerah: 'Petaling',
  emel: 'ibrahim@masjid-pj-selangor.gov.my',
  noTelefon: '03-22345678',
  alamat: {
    jalan: 'No. 88, Jalan Masjid PJ',
    poskod: '46000',
    bandar: 'Petaling Jaya',
    negeri: 'Selangor'
  },
  documents: [
    { id: 1, name: 'Surat Sokongan HQ', size: '2.3 MB' },
    { id: 2, name: 'Surat Kebenaran Premis', size: '1.8 MB' },
    { id: 3, name: 'Sijil Syarikat Cawangan', size: '1.2 MB' },
    { id: 4, name: 'Pelan Lantai Premis', size: '3.1 MB' }
  ]
});

const approvalData = ref({
  status: '',
  justification: '',
  comments: ''
});

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

const viewDocument = (documentId) => {
  // Mock function to view document
  console.log('View document:', documentId);
  // In real implementation, this would open the document in a new tab or modal
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
    await new Promise((resolve) => setTimeout(resolve, 1500));

    applicationData.value.status = approvalData.value.status;
    if (approvalData.value.status === 'Disahkan') {
      toast.success('Permohonan cawangan telah berjaya disahkan');
    } else if (approvalData.value.status === 'Perlu Pembetulan') {
      toast.success('Ulasan pembetulan telah direkodkan');
    } else {
      toast.success('Keputusan tidak sah telah direkodkan');
    }

    setTimeout(() => {
      processing.value = false;
      goBack();
    }, 1000);
  } catch (error) {
    processing.value = false;
    showErrorNotification('Ralat semasa memproses keputusan');
  }
};

const showErrorNotification = (message) => {
  toast.error(message);
};

const goBack = () => {
  navigateTo('/BF-PRF/OR/PB');
};
</script>

<style scoped></style>
