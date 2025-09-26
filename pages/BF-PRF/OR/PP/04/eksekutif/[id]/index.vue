<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />
    <!-- Eksekutif: Pengesahan (Semak) -->
    <rs-card class="mt-4 p-6">
      <template #body>
        <!-- Status Summary Card -->
        <div class="mb-8 p-4 bg-gray-50 border border-gray-200 rounded-lg">
          <div class="flex justify-between items-start">
            <div>
              <h1 class="text-2xl font-bold text-gray-800 mb-2">Pengesahan (Semak) - Eksekutif</h1>
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

        <!-- Keputusan Pengesahan (Eksekutif - Semak) -->
        <rs-card class="border-2 border-orange-200 bg-orange-50">
          <template #header>
            <h2 class="text-lg font-semibold text-gray-900">Keputusan Pengesahan (Semak)</h2>
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
    <rs-modal v-model="showConfirmationModal" title="Sahkan Keputusan Pengesahan (Eksekutif)" size="md">
      <template #body>
        <div class="text-center">
          <h3 class="text-lg font-semibold text-gray-900 mb-2">Adakah anda pasti?</h3>
          <p class="text-gray-600 mb-4">Anda akan menghantar keputusan pengesahan (Semak) untuk permohonan ini.</p>
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

definePageMeta({ title: 'Pengesahan (Semak) - Eksekutif' })

const route = useRoute()
const toast = useToast()
const processing = ref(false)
const showConfirmationModal = ref(false)

const breadcrumb = ref([
  { name: 'Pengesahan', type: 'link', path: '/BF-PRF/OR/PP' },
  { name: 'Eksekutif - Semak', type: 'current' },
])

const approvalData = ref({ status: '', justification: '' })

const applicationData = ref({
  refNumber: '',
  applicationDate: '',
  status: 'Menunggu Pengesahan',
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

const dataset = {}

// Local mock dataset keyed by reference ID to populate read-only fields
// This UI mockup has no backend; we hydrate using this structure for demo purposes
const mockData = {
  'ORG-202507-0001': {
    applicationDate: '12-09-2025',
    status: 'Menunggu Pengesahan',
    organizationType: 'masjid',
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
  },
  'ORG-202506-0002': {
    applicationDate: '05-09-2025',
    status: 'Menunggu Pengesahan',
    organizationType: 'masjid',
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
  },
}

const getStatusBadgeVariant = () => {
  switch (applicationData.value.status) {
    case 'Disahkan':
      return 'success'
    case 'Perlu Pembetulan':
      return 'warning'
    case 'Tidak Sah':
      return 'danger'
    case 'Menunggu Pengesahan':
      return 'warning'
    default:
      return 'info'
  }
}

const confirmSubmit = async () => {
  showConfirmationModal.value = false
  await handleApprovalSubmit()
}

const handleApprovalSubmit = async () => {
  if (!approvalData.value.status) {
    toast.error('Sila pilih status pengesahan')
    return
  }
  if ((approvalData.value.status === 'Perlu Pembetulan' || approvalData.value.status === 'Tidak Sah') && !approvalData.value.justification) {
    toast.error('Ulasan diperlukan untuk status ini')
    return
  }
  processing.value = true
  await new Promise(r => setTimeout(r, 800))
  // After Eksekutif (Semak), forward to Ketua Jabatan stage
  applicationData.value.status = 'Dalam Semakan Pelulus'
  toast.success('Keputusan semakan telah dihantar kepada Ketua Jabatan')
  processing.value = false
  goBack()
}

const goBack = () => {
  navigateTo('/BF-PRF/OR/PP')
}

const handleDownload = (doc) => toast.success(`Memuat turun ${doc.name} telah berjaya`)
const handleView = (doc) => toast.success(`Melihat dokumen ${doc.name}`)

onMounted(() => {
  const id = route.params.id
  applicationData.value.refNumber = id
  if (mockData[id]) {
    // Hydrate fields from mock dataset for a realistic read-only view
    applicationData.value = { ...applicationData.value, ...mockData[id], refNumber: id }
  }
})
</script>


