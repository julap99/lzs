<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />

    <!-- Loading State -->
    <div v-if="isLoading" class="mt-4">
      <rs-card>
        <template #body>
          <div class="flex items-center justify-center py-8">
            <Icon name="ph:spinner" class="w-8 h-8 text-blue-600 animate-spin mr-3" />
            <span class="text-gray-600">Memuatkan maklumat organisasi...</span>
          </div>
        </template>
      </rs-card>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="mt-4">
      <rs-card>
        <template #body>
          <div class="flex items-center justify-center py-8">
            <div class="text-center">
              <Icon name="ph:warning" class="w-12 h-12 text-red-500 mx-auto mb-4" />
              <h3 class="text-lg font-semibold text-gray-900 mb-2">Ralat Memuatkan Data</h3>
              <p class="text-gray-600 mb-4">{{ error }}</p>
              <rs-button variant="primary" @click="retryLoad">
                <Icon name="ph:arrow-clockwise" class="w-4 h-4 mr-2" />
                Cuba Lagi
              </rs-button>
            </div>
          </div>
        </template>
      </rs-card>
    </div>

    <!-- Main Content -->
    <rs-card v-else class="mt-4">
      <template #header>
        <div class="flex justify-between items-center">
          <h2 class="text-xl font-semibold">Maklumat Organisasi Terperinci</h2>
        </div>
      </template>

      <template #body>
        <div class="p-4">
          <!-- Status Summary Card -->
          <div class="mb-8 p-4 bg-gray-50 border border-gray-200 rounded-lg">
            <div class="flex justify-between items-start">
              <div>
                <h3 class="text-lg font-semibold text-gray-900">Status Permohonan</h3>
                <p class="text-sm text-gray-600">Rujukan: {{ organisasiData.noRujukan }}</p>
                <p class="text-sm text-gray-600">Tarikh Permohonan: {{ formatDate(organisasiData.tarikhPermohonan) }}</p>
              </div>
              <div class="flex gap-2">
                  <rs-badge :variant="getStatusVariant(organisasiData.status)">
                    {{ organisasiData.status }}
                  </rs-badge>
                </div>
            </div>
          </div>

                
          <!-- Maklumat Asas -->
          <h3 class="text-lg font-semibold mb-4 text-gray-900">Maklumat Asas</h3>
          <div class="mb-8 p-6 border border-gray-200 rounded-lg">
            <div class="grid grid-cols-2 gap-4">
              <div class="py-2 border-b border-gray-100">
                <span class="font-medium text-gray-600">Nama Organisasi:</span>
                <span class="text-gray-900 ml-2">{{ organisasiData.organizationName }}</span>
              </div>
              <div class="py-2 border-b border-gray-100">
                <span class="font-medium text-gray-600">Jenis Organisasi:</span>
                <span class="text-gray-900 ml-2">{{ organisasiData.organizationType }}</span>
              </div>
              <div class="py-2 border-b border-gray-100">
                <span class="font-medium text-gray-600">No. Pendaftaran:</span>
                <span class="text-gray-900 ml-2">{{ organisasiData.registrationNumber }}</span>
                </div>
              <div class="py-2 border-b border-gray-100">
                  <span class="font-medium text-gray-600">Status Pendaftaran:</span>
                <span class="text-gray-900 ml-2">{{ organisasiData.registrationStatus }}</span>
              </div>
              <div v-if="organisasiData.struktur" class="py-2 border-b border-gray-100">
                <span class="font-medium text-gray-600">Struktur:</span>
                <span class="text-gray-900 ml-2">{{ organisasiData.struktur }}</span>
              </div>
              <div v-if="organisasiData.hq" class="py-2 border-b border-gray-100">
                <span class="font-medium text-gray-600">HQ:</span>
                <span class="text-gray-900 ml-2">{{ organisasiData.hq }}</span>
              </div>
              <div v-if="organisasiData.kariah" class="py-2 border-b border-gray-100">
                <span class="font-medium text-gray-600">Kariah:</span>
                <span class="text-gray-900 ml-2">{{ organisasiData.kariah }}</span>
                </div>
              <div v-if="organisasiData.zone" class="py-2 border-b border-gray-100">
                <span class="font-medium text-gray-600">Kawasan/Zon:</span>
                <span class="text-gray-900 ml-2">{{ organisasiData.zone }}</span>
              </div>
            </div>
          </div>

          <!-- Maklumat Alamat -->
          <h3 class="text-lg font-semibold mb-4 text-gray-900">Maklumat Alamat</h3>
          <div class="mb-8 p-6 border border-gray-200 rounded-lg">
            <div class="grid grid-cols-2 gap-4">
              <div class="py-2 border-b border-gray-100">
                  <span class="font-medium text-gray-600">Alamat 1:</span>
                <span class="text-gray-900 ml-2">{{ organisasiData.alamat?.addressLine1 || '-' }}</span>
                </div>
              <div v-if="organisasiData.alamat?.addressLine2" class="py-2 border-b border-gray-100">
                  <span class="font-medium text-gray-600">Alamat 2:</span>
                <span class="text-gray-900 ml-2">{{ organisasiData.alamat?.addressLine2 }}</span>
                </div>
              <div v-if="organisasiData.alamat?.addressLine3" class="py-2 border-b border-gray-100">
                  <span class="font-medium text-gray-600">Alamat 3:</span>
                <span class="text-gray-900 ml-2">{{ organisasiData.alamat?.addressLine3 }}</span>
              </div>
              <div class="py-2 border-b border-gray-100">
                  <span class="font-medium text-gray-600">Poskod:</span>
                <span class="text-gray-900 ml-2">{{ organisasiData.alamat?.postcode || '-' }}</span>
                </div>
              <div class="py-2 border-b border-gray-100">
                  <span class="font-medium text-gray-600">Bandar:</span>
                <span class="text-gray-900 ml-2">{{ organisasiData.alamat?.city || '-' }}</span>
              </div>
              <div class="py-2 border-b border-gray-100">
                <span class="font-medium text-gray-600">Daerah:</span>
                <span class="text-gray-900 ml-2">{{ organisasiData.alamat?.district || '-' }}</span>
              </div>
              <div class="py-2 border-b border-gray-100">
                <span class="font-medium text-gray-600">Negeri:</span>
                <span class="text-gray-900 ml-2">{{ organisasiData.alamat?.state || '-' }}</span>
              </div>
            </div>
          </div>

          <!-- Maklumat Perhubungan -->
          <div v-if="organisasiData.wakil && organisasiData.wakil.length > 0">
            <h3 class="text-lg font-semibold mb-4 text-gray-900">Maklumat Perhubungan</h3>
            <div class="mb-8 p-6 border border-gray-200 rounded-lg">
              <div class="space-y-6">
                <div v-for="(wakil, index) in organisasiData.wakil" :key="index" class="p-4 bg-gray-50 rounded-lg">
                  <h4 class="font-medium text-gray-900 mb-3">Wakil {{ index + 1 }}</h4>
                  <div class="grid grid-cols-2 gap-4">
                    <div class="py-2 border-b border-gray-100">
                      <span class="font-medium text-gray-600">Nama:</span>
                      <span class="text-gray-900 ml-2">{{ wakil.name }}</span>
                    </div>
                    <div class="py-2 border-b border-gray-100">
                      <span class="font-medium text-gray-600">No. IC:</span>
                      <span class="text-gray-900 ml-2">{{ wakil.ic }}</span>
                    </div>
                    <div class="py-2 border-b border-gray-100">
                      <span class="font-medium text-gray-600">No. Telefon:</span>
                      <span class="text-gray-900 ml-2">{{ wakil.phoneNumber }}</span>
                    </div>
                    <div class="py-2 border-b border-gray-100">
                      <span class="font-medium text-gray-600">Emel:</span>
                      <span class="text-gray-900 ml-2">{{ wakil.email }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Maklumat Bank -->
          <h3 class="text-lg font-semibold mb-4 text-gray-900">Maklumat Bank</h3>
          <div class="mb-8 p-6 border border-gray-200 rounded-lg">
            <div class="grid grid-cols-2 gap-4">
              <div v-if="organisasiData.bank?.bankSameAsHQ" class="py-2 border-b border-gray-100">
                <span class="font-medium text-gray-600">Sama seperti HQ:</span>
                <span class="text-gray-900 ml-2">{{ organisasiData.bank?.bankSameAsHQ === 'ya' ? 'Ya' : 'Tidak' }}</span>
              </div>
              <div class="py-2 border-b border-gray-100">
                <span class="font-medium text-gray-600">Nama Bank:</span>
                <span class="text-gray-900 ml-2">{{ organisasiData.bank?.bankName || '-' }}</span>
              </div>
              <div class="py-2 border-b border-gray-100">
                <span class="font-medium text-gray-600">No. Akaun Bank:</span>
                <span class="text-gray-900 ml-2">{{ organisasiData.bank?.bankAccountNumber || '-' }}</span>
              </div>
              <div class="py-2 border-b border-gray-100">
                <span class="font-medium text-gray-600">Nama Pemegang Akaun:</span>
                <span class="text-gray-900 ml-2">{{ organisasiData.bank?.penamaBank || '-' }}</span>
              </div>
              <div class="py-2 border-b border-gray-100">
                <span class="font-medium text-gray-600">Kaedah Pembayaran:</span>
                <span class="text-gray-900 ml-2">{{ organisasiData.bank?.paymentMethod || '-' }}</span>
              </div>
            </div>
          </div>

          <!-- Dokumen Sokongan -->
          <h3 class="text-lg font-semibold mb-4 text-gray-900">Dokumen Sokongan</h3>
          <div class="mb-8 p-6 border border-gray-200 rounded-lg">
            <div class="grid grid-cols-2 gap-4">
              <div v-for="(doc, index) in supportDocuments" :key="index" class="p-4 border border-gray-200 rounded-lg flex items-center justify-between">
                <div class="flex items-center">
                  <Icon name="mdi:file-document-outline" class="text-blue-600 mr-3" />
                  <div>
                    <p class="font-medium text-gray-900">{{ doc.name }}</p>
                    <template v-if="doc.has">
                      <p class="text-sm text-gray-600">{{ doc.filename }}</p>
                      <p v-if="doc.size" class="text-xs text-gray-500">{{ doc.size }}</p>
                    </template>
                    <rs-badge v-else variant="warning">Tiada</rs-badge>
                  </div>
                </div>
                <div class="flex items-center gap-2" v-if="doc.has">
                  <rs-button variant="secondary-outline" size="sm" class="!p-1 !w-8 !h-8" :title="`Muat Turun`" @click="handleDownload(doc.name)">
                    <Icon name="ph:download" size="1rem" />
                  </rs-button>
                  <rs-button variant="secondary-outline" size="sm" class="!p-1 !w-8 !h-8" :title="`Lihat`" @click="handleView(doc.name)">
                    <Icon name="ph:eye" size="1rem" />
                  </rs-button>
                </div>
              </div>
            </div>
          </div>

          <!-- Eksekutif Review Section -->
          <div v-if="eksekutifReview" class="mb-8">
            <h3 class="text-lg font-semibold mb-4 text-gray-900">Ulasan Eksekutif</h3>
            <div class="p-6 border border-gray-200 rounded-lg">
              <div class="grid grid-cols-2 gap-4">
                <div class="py-2 border-b border-gray-100">
                  <span class="font-medium text-gray-600">Status:</span>
                  <rs-badge :variant="getStatusVariant(eksekutifReview.status)" class="ml-2">
                    {{ eksekutifReview.status }}
                  </rs-badge>
                </div>
                <div class="py-2 border-b border-gray-100">
                  <span class="font-medium text-gray-600">Tarikh Ulasan:</span>
                  <span class="text-gray-900 ml-2">{{ formatDate(eksekutifReview.reviewDate) }}</span>
                </div>
                <div v-if="eksekutifReview.justification" class="py-2 col-span-2">
                  <span class="font-medium text-gray-600">Ulasan:</span>
                  <p class="text-gray-900 mt-1">{{ eksekutifReview.justification }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Keputusan Kelulusan - Ketua Jabatan Section -->
          <div v-if="organisasiData.status === 'Dalam Semakan Pelulus'" class="mb-8">
            <h3 class="text-lg font-semibold mb-4 text-gray-900">Keputusan Kelulusan</h3>
            <div class="p-6 border border-gray-200 rounded-lg bg-orange-50">
              <div class="space-y-4">
                <!-- Status Kelulusan -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Status Kelulusan <span class="text-red-500">*</span>
                  </label>
                  <div class="space-y-2">
                    <label class="flex items-center">
                      <input v-model="approvalData.status" type="radio" value="Diluluskan" class="mr-2 text-green-600 focus:ring-green-500" />
                      <span class="text-sm font-medium text-gray-900">Diluluskan</span>
                    </label>
                    <label class="flex items-center">
                      <input v-model="approvalData.status" type="radio" value="Ditolak" class="mr-2 text-red-600 focus:ring-red-500" />
                      <span class="text-sm font-medium text-gray-900">Ditolak</span>
                    </label>
                  </div>
                  <p v-if="!approvalData.status" class="text-red-500 text-sm mt-1">Status kelulusan adalah wajib</p>
                </div>

                <!-- Ulasan/Justifikasi -->
                <div v-if="approvalData.status === 'Ditolak'">
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Justifikasi Penolakan <span class="text-red-500">*</span>
                  </label>
                  <textarea
                    v-model="approvalData.justification"
                    rows="4"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Masukkan justifikasi penolakan..."
                  ></textarea>
                  <p v-if="approvalData.status === 'Ditolak' && !approvalData.justification" class="text-red-500 text-sm mt-1">
                    Justifikasi penolakan adalah wajib
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Action Buttons - Bottom Right -->
        <div class="flex justify-end gap-3 pt-6 border-t border-gray-200">
          <rs-button variant="secondary" @click="handleBack">
            <Icon name="ph:arrow-left" class="w-4 h-4 mr-1" />
            Kembali
          </rs-button>
          <rs-button 
            v-if="organisasiData.status === 'Dalam Semakan Pelulus'" 
            variant="primary" 
            @click="handleSubmitDecision"
            :disabled="!approvalData.status || (approvalData.status === 'Ditolak' && !approvalData.justification)"
          >
            <Icon name="ph:check" class="w-4 h-4 mr-1" />
            Hantar Keputusan
          </rs-button>
        </div>
      </template>
    </rs-card>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'

definePageMeta({ title: 'Maklumat Organisasi Terperinci - Ketua Jabatan' })

const route = useRoute()
const isLoading = ref(false)
const error = ref(null)

const breadcrumb = ref([
  { name: 'Pengesahan', type: 'link', path: '/BF-PRF/OR/PP' },
  { name: 'Senarai Organisasi', type: 'link', path: '/BF-PRF/OR/PP' },
  { name: 'Maklumat Terperinci', type: 'current', path: `/BF-PRF/OR/PP/view/ketua-jabatan/${route.params.id}` },
])

// Approval data for Ketua Jabatan
const approvalData = ref({
  status: '',
  justification: ''
})

// Eksekutif review data
const eksekutifReview = ref({
  status: 'Disahkan',
  reviewDate: '15-09-2025',
  justification: 'Semua dokumen lengkap dan memenuhi syarat. Organisasi layak untuk diluluskan.'
})

// Mock data structure aligned with current form
const organisasiData = ref({
  noRujukan: '',
  organizationName: '',
  organizationType: '',
  registrationNumber: '',
  registrationStatus: '',
  struktur: '',
  hq: '',
  kariah: '',
  zone: '',
  alamat: {
    addressLine1: '',
    addressLine2: '',
    addressLine3: '',
    postcode: '',
    city: '',
    district: '',
    state: ''
  },
  wakil: [],
  bank: {
    bankSameAsHQ: '',
    bankName: '',
    bankAccountNumber: '',
    penamaBank: '',
    paymentMethod: ''
  },
  registrationCertificate: { name: 'Sijil Pendaftaran Syarikat', filename: 'sijil_pendaftaran_ssm.pdf', size: '2.4 MB' },
  appointmentLetter: { name: 'Surat Perwakilan Kuasa', filename: 'surat_perwakilan_kuasa.pdf', size: '1.8 MB' },
  bankProof: { name: 'Penyata Bank', filename: 'penyata_bank_disember_2024.pdf', size: '1.1 MB' },
  additionalDocuments: null,
  status: '',
  tarikhPermohonan: ''
})

const getStatusVariant = (status) => {
  const variants = {
    'Menunggu Pengesahan': 'warning',
    'Dalam Pembetulan': 'warning',
    'Disahkan': 'success',
    'Perlu Pembetulan': 'warning',
    'Tidak Sah': 'danger',
    'Dalam Semakan Pelulus': 'info',
    'Diluluskan': 'success',
    'Ditolak': 'danger'
  }
  return variants[status] || 'default'
}

const hasDocument = (document) => {
  if (!document) return false
  if (Array.isArray(document) && document.length > 0) return true
  if (typeof document === 'object' && document.name) return true
  return false
}

const getDocumentName = (document) => {
  if (!document) return 'Tiada'
  if (Array.isArray(document) && document.length > 0) return document[0].filename || document[0].name || 'Dilampirkan'
  if (typeof document === 'object' && (document.filename || document.name)) return document.filename || document.name
  return 'Tiada'
}

// Return "name + filename + size" where available, compact
const getDocDisplay = (document) => {
  if (!document) return 'Tiada'
  const first = Array.isArray(document) ? document[0] : document
  const name = first.name || '-'
  const filename = first.filename ? ` (${first.filename})` : ''
  const size = first.size ? ` • ${first.size}` : ''
  return `${name}${filename}${size}`
}

const supportDocuments = computed(() => {
  const docs = []
  const rc = organisasiData.value.registrationCertificate
  const ap = organisasiData.value.appointmentLetter
  const bp = organisasiData.value.bankProof
  const ad = organisasiData.value.additionalDocuments

  docs.push({
    name: 'Sijil Pendaftaran',
    has: hasDocument(rc),
    filename: hasDocument(rc) ? (Array.isArray(rc) ? rc[0].filename || rc[0].name : rc.filename || rc.name) : '',
    size: hasDocument(rc) ? (Array.isArray(rc) ? rc[0].size : rc.size) : ''
  })
  docs.push({
    name: 'Surat Perwakilan Kuasa',
    has: hasDocument(ap),
    filename: hasDocument(ap) ? (Array.isArray(ap) ? ap[0].filename || ap[0].name : ap.filename || ap.name) : '',
    size: hasDocument(ap) ? (Array.isArray(ap) ? ap[0].size : ap.size) : ''
  })
  docs.push({
    name: 'Bukti Bank',
    has: hasDocument(bp),
    filename: hasDocument(bp) ? (Array.isArray(bp) ? bp[0].filename || bp[0].name : bp.filename || bp.name) : '',
    size: hasDocument(bp) ? (Array.isArray(bp) ? bp[0].size : bp.size) : ''
  })
  docs.push({
    name: 'Dokumen Tambahan',
    has: hasDocument(ad),
    filename: hasDocument(ad) ? (Array.isArray(ad) ? ad[0].filename || ad[0].name : ad.filename || ad.name) : '',
    size: hasDocument(ad) ? (Array.isArray(ad) ? ad[0].size : ad.size) : ''
  })

  return docs
})

const handleDownload = (documentType) => {
  alert(`Download ${documentType} - Ini adalah UI mockup prototype untuk presentation kepada client.`)
}

const handleView = (documentType) => {
  alert(`View ${documentType} - Ini adalah UI mockup prototype untuk presentation kepada client.`)
}

const formatDate = (dateString) => {
  if (!dateString) return '-'
  if (typeof dateString === 'string' && !dateString.includes('T')) {
    return dateString
  }
  try {
    return new Date(dateString).toLocaleDateString('ms-MY')
  } catch (error) {
    return dateString
  }
}

const handleSubmitDecision = () => {
  if (!approvalData.value.status) {
    alert('Sila pilih status kelulusan')
    return
  }
  
  if (approvalData.value.status === 'Ditolak' && !approvalData.value.justification) {
    alert('Justifikasi penolakan diperlukan')
    return
  }

  // Simulate API call
  alert(`Keputusan kelulusan telah dihantar: ${approvalData.value.status}`)
  
  // Update status
  organisasiData.value.status = approvalData.value.status
  
  // Navigate back
  handleBack()
}

const loadOrganisasiData = (id) => {
  const dataset = {
    'ORG-202507-0001': {
      noRujukan: 'ORG-202507-0001',
      organizationName: 'Masjid Sultan Salahuddin Abdul Aziz Shah',
      organizationType: 'Masjid',
      registrationNumber: 'PPM-2020-001',
      registrationStatus: 'Berdaftar',
      struktur: 'HQ',
      hq: '',
      kariah: '',
      zone: 'Zon Shah Alam',
      alamat: {
        addressLine1: 'No. 1, Jalan Masjid',
        addressLine2: 'Seksyen 2',
        addressLine3: '',
        postcode: '40000',
        city: 'Shah Alam',
        district: 'Petaling',
        state: 'Selangor'
      },
      wakil: [
        {
          name: 'Ustaz Ahmad bin Abdullah',
          ic: '800123456789',
          phoneNumber: '03-55123456',
          email: 'ahmad@masjidssa.gov.my'
        }
      ],
      bank: {
        bankSameAsHQ: '',
        bankName: 'Bank Islam',
        bankAccountNumber: '1234567890123',
        penamaBank: 'Masjid Sultan Salahuddin Abdul Aziz Shah',
        paymentMethod: 'Bank Transfer'
      },
      registrationCertificate: { name: 'Sijil Pendaftaran ROS', filename: 'sijil_ros_masjid_2020.pdf', size: '2.4 MB' },
      appointmentLetter: { name: 'Surat Perwakilan Kuasa', filename: 'surat_perwakilan_masjid_2025.pdf', size: '1.8 MB' },
      bankProof: { name: 'Penyata Bank', filename: 'bank_statement_masjid_jan_2025.pdf', size: '1.1 MB' },
      additionalDocuments: null,
      status: 'Dalam Semakan Pelulus',
      tarikhPermohonan: '15/7/2025'
    },
    'ORG-202506-0002': {
      noRujukan: 'ORG-202506-0002',
      organizationName: 'Masjid Al-Amin',
      organizationType: 'Masjid',
      registrationNumber: 'PPM-2020-001',
      registrationStatus: 'Berdaftar',
      struktur: 'HQ',
      hq: '',
      kariah: '',
      zone: 'Zon Petaling Jaya',
      alamat: {
        addressLine1: 'No. 456, Jalan Masjid 2/3',
        addressLine2: 'Taman Masjid Jaya',
        addressLine3: '',
        postcode: '47810',
        city: 'Petaling Jaya',
        district: 'Petaling',
        state: 'Selangor'
      },
      wakil: [
        {
          name: 'Ustaz Mohd Zaki bin Hassan',
          ic: '750512123456',
          phoneNumber: '03-55123457',
          email: 'zaki@masjidssa.gov.my'
        }
      ],
      bank: {
        bankSameAsHQ: '',
        bankName: 'Maybank',
        bankAccountNumber: '5123456789012',
        penamaBank: 'Masjid Al-Amin',
        paymentMethod: 'Bank Transfer'
      },
      registrationCertificate: { name: 'Sijil Pendaftaran ROS', filename: 'sijil_ros_masjid_2020.pdf', size: '2.0 MB' },
      appointmentLetter: { name: 'Surat Perwakilan Kuasa', filename: 'surat_perwakilan_cawangan_2025.pdf', size: '1.5 MB' },
      bankProof: { name: 'Surat Pengesahan Bank', filename: 'bank_confirmation_cawangan.pdf', size: '0.9 MB' },
      additionalDocuments: null,
      status: 'Dalam Semakan Pelulus',
      tarikhPermohonan: '16/7/2025'
    },
    'ORG-202505-0003': {
      noRujukan: 'ORG-202505-0003',
      organizationName: 'Masjid Al-Hidayah',
      organizationType: 'Masjid',
      registrationNumber: 'PPM-2020-001',
      registrationStatus: 'Berdaftar',
      struktur: 'HQ',
      hq: '',
      kariah: '',
      zone: 'Zon Klang',
      alamat: {
        addressLine1: 'Lot 789, Jalan Masjid 5/2',
        addressLine2: 'Taman Masjid Klang',
        addressLine3: '',
        postcode: '41000',
        city: 'Klang',
        district: 'Klang',
        state: 'Selangor'
      },
      wakil: [
        {
          name: 'Ustazah Siti Fatimah binti Ali',
          ic: '820315234567',
          phoneNumber: '03-55123458',
          email: 'fatimah@masjidssa.gov.my'
        }
      ],
      bank: {
        bankSameAsHQ: '',
        bankName: 'Bank Islam',
        bankAccountNumber: '2098765432109',
        penamaBank: 'Masjid Al-Hidayah',
        paymentMethod: 'Bank Transfer'
      },
      registrationCertificate: { name: 'Sijil Pendaftaran ROS', filename: 'sijil_ros_masjid_2020.pdf', size: '1.7 MB' },
      appointmentLetter: { name: 'Surat Perwakilan Kuasa', filename: 'surat_perwakilan_cawangan_2025.pdf', size: '1.3 MB' },
      bankProof: { name: 'Surat Bank', filename: 'bank_letter_cawangan_2025.pdf', size: '0.8 MB' },
      additionalDocuments: null,
      status: 'Dalam Semakan Pelulus',
      tarikhPermohonan: '17/7/2025'
    }
  }

  if (dataset[id]) {
    organisasiData.value = { ...organisasiData.value, ...dataset[id] }
  }
}

const handleBack = () => {
  navigateTo('/BF-PRF/OR/PP')
}

const retryLoad = () => {
  error.value = null
  loadData()
}

const loadData = async () => {
  isLoading.value = true
  try {
    await new Promise(resolve => setTimeout(resolve, 1000)) // Simulate API call
    loadOrganisasiData(route.params.id)
  } catch (err) {
    error.value = 'Gagal memuatkan data organisasi'
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  loadData()
})
</script>
