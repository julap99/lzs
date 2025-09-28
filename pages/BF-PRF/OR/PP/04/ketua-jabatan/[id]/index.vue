<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />
    <!-- Ketua Jabatan: Kelulusan (Lulus) -->
    <rs-card class="mt-4 p-6">
      <template #body>
        <!-- Status Summary Card -->
        <div class="mb-8 p-4 bg-gray-50 border border-gray-200 rounded-lg">
          <div class="flex justify-between items-start">
            <div>
              <h1 class="text-2xl font-bold text-gray-800 mb-2">Kelulusan (Lulus) - Ketua Jabatan</h1>
              <p class="text-sm text-gray-600">No. Rujukan: {{ applicationData.refNumber }}</p>
            </div>
            <div class="flex gap-2">
              <rs-badge :variant="getStatusBadgeVariant()">{{ applicationData.status }}</rs-badge>
            </div>
          </div>
        </div>

        <!-- Sections (read-only view of data) -->
        <div class="space-y-6 mb-8">
          <h3 class="text-lg font-semibold mb-4 text-gray-900">Maklumat Permohonan</h3>
          <div class="mb-8 p-6 border border-gray-200 rounded-lg">
            <div class="grid grid-cols-2 gap-4">
              <FormKit type="text" label="Tarikh Permohonan" v-model="applicationData.applicationDate" readonly :classes="{ input: '!py-2' }" />
              <FormKit type="text" label="Jenis Organisasi" v-model="applicationData.organizationType" readonly :classes="{ input: '!py-2' }" />
            </div>
          </div>

          <h3 class="text-lg font-semibold mb-4 text-gray-900">Maklumat Organisasi</h3>
          <div class="mb-8 p-6 border border-gray-200 rounded-lg">
            <div class="grid grid-cols-2 gap-4">
              <FormKit type="text" label="Nama Organisasi" v-model="applicationData.organizationName" readonly :classes="{ input: '!py-2' }" />
              <FormKit type="text" label="No. Pendaftaran" v-model="applicationData.registrationNumber" readonly :classes="{ input: '!py-2' }" />
              <FormKit type="text" label="Email" v-model="applicationData.email" readonly :classes="{ input: '!py-2' }" />
            </div>
          </div>

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

          <h3 class="text-lg font-semibold mb-4 text-gray-900">Maklumat Pegawai Dihubungi</h3>
          <div class="mb-8 p-6 border border-gray-200 rounded-lg">
            <div class="grid grid-cols-2 gap-4">
              <FormKit type="text" label="Nama Pegawai" v-model="applicationData.contactPerson" readonly :classes="{ input: '!py-2' }" />
              <FormKit type="text" label="Telefon" v-model="applicationData.contactPhone" readonly :classes="{ input: '!py-2' }" />
              <FormKit type="text" label="Email" v-model="applicationData.contactEmail" readonly :classes="{ input: '!py-2' }" />
            </div>
          </div>

          <h3 class="text-lg font-semibold mb-4 text-gray-900">Maklumat Bank</h3>
          <div class="mb-8 p-6 border border-gray-200 rounded-lg">
            <div class="grid grid-cols-2 gap-4">
              <FormKit type="text" label="Nama Bank" v-model="applicationData.bankName" readonly :classes="{ input: '!py-2' }" />
              <FormKit type="text" label="Nombor Akaun Bank" v-model="applicationData.bankAccountNumber" readonly :classes="{ input: '!py-2' }" />
              <FormKit type="text" label="Penama Akaun Bank" v-model="applicationData.penamaBank" readonly :classes="{ input: '!py-2' }" />
              <FormKit type="text" label="Kaedah Pembayaran" v-model="applicationData.paymentMethod" readonly :classes="{ input: '!py-2' }" />
            </div>
          </div>

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
                  <rs-button variant="secondary-outline" size="sm" class="!p-1 !w-8 !h-8" @click="handleDownload(doc)">
                    <Icon name="ph:download" size="1rem" />
                  </rs-button>
                  <rs-button variant="secondary-outline" size="sm" class="!p-1 !w-8 !h-8" @click="handleView(doc)">
                    <Icon name="ph:eye" size="1rem" />
                  </rs-button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Eksekutif Review Results -->
        <rs-card class="border-2 border-blue-200 bg-blue-50 mb-6">
          <template #header>
            <h2 class="text-lg font-semibold text-gray-900">Keputusan Pengesahan Eksekutif</h2>
          </template>
          <template #body>
            <div class="space-y-4">
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Status Pengesahan</label>
                  <rs-badge :variant="getEksekutifStatusVariant()">{{ eksekutifReview.status }}</rs-badge>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Tarikh Semakan</label>
                  <p class="text-sm text-gray-900">{{ eksekutifReview.reviewDate }}</p>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Nama Eksekutif</label>
                  <p class="text-sm text-gray-900">{{ eksekutifReview.reviewerName }}</p>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Jawatan</label>
                  <p class="text-sm text-gray-900">{{ eksekutifReview.reviewerPosition }}</p>
                </div>
              </div>
              <div v-if="eksekutifReview.comments">
                <label class="block text-sm font-medium text-gray-700 mb-2">Ulasan Eksekutif</label>
                <div class="p-3 bg-white border border-gray-200 rounded-md">
                  <p class="text-sm text-gray-900">{{ eksekutifReview.comments }}</p>
                </div>
              </div>
            </div>
          </template>
        </rs-card>

        <!-- Keputusan Kelulusan -->
        <rs-card class="border-2 border-green-200 bg-green-50">
          <template #header>
            <h2 class="text-lg font-semibold text-gray-900">Keputusan Kelulusan</h2>
          </template>
          <template #body>
            <div class="space-y-6">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-3">Keputusan <span class="text-red-500">*</span></label>
                <div class="space-y-2">
                  <label class="flex items-center">
                    <input v-model="approvalData.status" type="radio" value="Lulus" class="mr-2 text-green-600 focus:ring-green-500" />
                    <span class="text-sm font-medium text-gray-900">Lulus</span>
                  </label>
                  <label class="flex items-center">
                    <input v-model="approvalData.status" type="radio" value="Tidak Lulus" class="mr-2 text-red-600 focus:ring-red-500" />
                    <span class="text-sm font-medium text-gray-900">Tidak Lulus</span>
                  </label>
                </div>
                <div v-if="!approvalData.status" class="mt-1 text-sm text-red-600">Keputusan adalah wajib</div>
              </div>
              <div v-if="approvalData.status === 'Tidak Lulus'">
                <label class="block text-sm font-medium text-gray-700 mb-2">Justifikasi Tidak Lulus <span class="text-red-500">*</span></label>
                <textarea v-model="approvalData.justification" class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 min-h-[100px]" rows="4"></textarea>
                <div v-if="!approvalData.justification" class="mt-1 text-sm text-red-600">Ulasan diperlukan untuk status ini</div>
              </div>
            </div>
          </template>
        </rs-card>

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
    <rs-modal v-model="showConfirmationModal" title="Sahkan Keputusan Kelulusan (Ketua Jabatan)" size="md">
      <template #body>
        <div class="space-y-4">
          <div class="text-center">
            <h3 class="text-lg font-semibold text-gray-900 mb-2">Adakah anda pasti?</h3>
            <p class="text-gray-600 mb-4">Anda akan menghantar keputusan kelulusan untuk permohonan ini.</p>
          </div>
          
          <div class="bg-gray-50 p-4 rounded-lg">
            <h4 class="font-medium text-gray-900 mb-2">Ringkasan Keputusan:</h4>
            <div class="space-y-2 text-sm">
              <div class="flex justify-between">
                <span class="text-gray-600">No. Rujukan:</span>
                <span class="font-medium">{{ applicationData.refNumber }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Nama Organisasi:</span>
                <span class="font-medium">{{ applicationData.organizationName }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Keputusan:</span>
                <rs-badge :variant="approvalData.status === 'Lulus' ? 'success' : 'danger'">
                  {{ approvalData.status }}
                </rs-badge>
              </div>
              <div v-if="approvalData.status === 'Tidak Lulus'" class="mt-2">
                <span class="text-gray-600">Justifikasi:</span>
                <p class="text-sm text-gray-900 mt-1">{{ approvalData.justification }}</p>
              </div>
            </div>
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
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useToast } from 'vue-toastification'

definePageMeta({ title: 'Kelulusan (Lulus) - Ketua Jabatan' })

const route = useRoute()
const toast = useToast()
const processing = ref(false)
const showConfirmationModal = ref(false)

const breadcrumb = ref([
  { name: 'Pengesahan', type: 'link', path: '/BF-PRF/OR/PP' },
  { name: 'Ketua Jabatan - Lulus', type: 'current' },
])

const approvalData = ref({ status: '', justification: '' })

const applicationData = ref({
  refNumber: '',
  applicationDate: '',
  status: 'Dalam Semakan Pelulus',
  organizationType: '',
  organizationName: '',
  registrationNumber: '',
  email: '',
  addressLine1: '',
  addressLine2: '',
  addressLine3: '',
  city: '',
  postcode: '',
  state: '',
  contactPerson: '',
  contactPhone: '',
  contactEmail: '',
  bankName: '',
  bankAccountNumber: '',
  penamaBank: '',
  paymentMethod: '',
  documents: [
    { name: 'Sijil Pendaftaran SSM / ROS', filename: 'ssm_ros.pdf', size: '2.1 MB' },
    { name: 'Bukti Pemilikan Akaun Bank', filename: 'bank_proof.pdf', size: '0.9 MB' },
    { name: 'Surat Perwakilan Kuasa', filename: 'surat_perwakilan.pdf', size: '1.2 MB' },
  ],
})

// Eksekutif Review Results
const eksekutifReview = ref({
  status: '',
  reviewDate: '',
  reviewerName: '',
  reviewerPosition: '',
  comments: ''
})

// Mock data for demonstration
const mockData = {
  'ORG-202507-0001': {
    applicationDate: '12-09-2025',
    status: 'Dalam Semakan Pelulus',
    organizationType: 'Masjid',
    organizationName: 'Masjid Sultan Salahuddin Abdul Aziz Shah',
    registrationNumber: 'PPM-2021-001',
    email: 'info@masjidnegeriselangor.my',
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
    paymentMethod: 'EFT',
    documents: [
      { name: 'Sijil Pendaftaran SSM / ROS', filename: 'ssm_ros.pdf', size: '2.1 MB' },
      { name: 'Bukti Pemilikan Akaun Bank', filename: 'bank_proof.pdf', size: '0.9 MB' },
      { name: 'Surat Perwakilan Kuasa', filename: 'surat_perwakilan.pdf', size: '1.2 MB' },
    ],
    eksekutifReview: {
      status: 'Disahkan',
      reviewDate: '15-09-2025',
      reviewerName: 'Encik Ahmad Fauzi bin Ismail',
      reviewerPosition: 'Eksekutif Pengesahan',
      comments: 'Semua dokumen lengkap dan sah. Maklumat organisasi adalah tepat dan memenuhi syarat pendaftaran. Disyorkan untuk kelulusan.'
    }
  },
  'ORG-202506-0002': {
    applicationDate: '05-09-2025',
    status: 'Dalam Semakan Pelulus',
    organizationType: 'Masjid',
    organizationName: 'Masjid Al-Hidayah - Cawangan',
    registrationNumber: 'PPM-2021-002',
    email: 'info@alhidayah.my',
    addressLine1: 'Jalan 2/1',
    addressLine2: 'Taman Maju Jaya',
    addressLine3: '',
    city: 'Petaling Jaya',
    postcode: '46000',
    state: 'Selangor',
    contactPerson: 'Encik Faizal',
    contactPhone: '03-77112233',
    contactEmail: 'faizal@alhidayah.my',
    bankName: 'Maybank',
    bankAccountNumber: '987654321000',
    penamaBank: 'Masjid Al-Hidayah - Cawangan',
    paymentMethod: 'EFT',
    documents: [
      { name: 'Sijil Pendaftaran SSM / ROS', filename: 'ssm_ros.pdf', size: '2.0 MB' },
      { name: 'Bukti Pemilikan Akaun Bank', filename: 'bank_proof.pdf', size: '0.8 MB' },
      { name: 'Surat Perwakilan Kuasa', filename: 'surat_perwakilan.pdf', size: '1.1 MB' },
    ],
    eksekutifReview: {
      status: 'Disahkan',
      reviewDate: '08-09-2025',
      reviewerName: 'Puan Siti Nurul Aini binti Hassan',
      reviewerPosition: 'Eksekutif Pengesahan',
      comments: 'Permohonan cawangan masjid telah disemak. Semua dokumen sah dan maklumat adalah tepat. Status cawangan telah disahkan dengan HQ.'
    }
  },
}

const getStatusBadgeVariant = () => {
  switch (applicationData.value.status) {
    case 'Lulus':
      return 'success'
    case 'Tidak Lulus':
      return 'danger'
    case 'Dalam Semakan Pelulus':
      return 'warning'
    default:
      return 'info'
  }
}

const getEksekutifStatusVariant = () => {
  switch (eksekutifReview.value.status) {
    case 'Disahkan':
      return 'success'
    case 'Perlu Pembetulan':
      return 'warning'
    case 'Tidak Sah':
      return 'danger'
    default:
      return 'info'
  }
}

const handleDownload = (doc) => toast.success(`Memuat turun ${doc.name} telah berjaya`)
const handleView = (doc) => toast.success(`Melihat dokumen ${doc.name}`)

const confirmSubmit = async () => {
  showConfirmationModal.value = false
  await handleApprovalSubmit()
}

const handleApprovalSubmit = async () => {
  if (!approvalData.value.status) {
    toast.error('Sila pilih keputusan kelulusan')
    return
  }
  if (approvalData.value.status === 'Tidak Lulus' && !approvalData.value.justification) {
    toast.error('Ulasan diperlukan untuk Tidak Lulus')
    return
  }
  processing.value = true
  await new Promise(r => setTimeout(r, 800))
  applicationData.value.status = approvalData.value.status === 'Lulus' ? 'Lulus' : 'Tidak Lulus'
  toast.success('Keputusan kelulusan telah direkodkan')
  processing.value = false
  goBack()
}

const goBack = () => navigateTo('/BF-PRF/OR/PP')

onMounted(() => {
  const id = route.params.id
  applicationData.value.refNumber = id
  
  // Load application data and Eksekutif review results
  if (mockData[id]) {
    const data = mockData[id]
    applicationData.value = { ...applicationData.value, ...data }
    eksekutifReview.value = data.eksekutifReview
  }
})
</script>


