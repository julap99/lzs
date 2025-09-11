<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />

    <!-- Loading State -->
    <div v-if="isLoading" class="mt-4">
      <rs-card>
        <template #body>
          <div class="flex items-center justify-center py-8">
            <Icon name="ph:spinner" class="w-8 h-8 text-blue-600 animate-spin mr-3" />
            <span class="text-gray-600">Memuatkan maklumat cawangan...</span>
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
          <h2 class="text-xl font-semibold">Maklumat Cawangan Terperinci</h2>
        </div>
      </template>

      <template #body>
        <div class="p-4">
          <!-- Status Summary Card -->
          <div class="mb-8 p-4 bg-gray-50 border border-gray-200 rounded-lg">
            <div class="flex justify-between items-start">
              <div>
                <h3 class="text-lg font-semibold text-gray-900">Status Permohonan</h3>
                <p class="text-sm text-gray-600">Rujukan: {{ cawanganData.noRujukan }}</p>
                <p class="text-sm text-gray-600">Tarikh Permohonan: {{ formatDate(cawanganData.tarikhPermohonan) }}</p>
              </div>
              <div class="flex gap-2">
                <rs-badge :variant="getStatusVariant(cawanganData.status)">
                  {{ cawanganData.status }}
                </rs-badge>
              </div>
            </div>
          </div>

          <!-- Maklumat Asas -->
          <h3 class="text-lg font-semibold mb-4 text-gray-900">Maklumat Asas</h3>
          <div class="mb-8 p-6 border border-gray-200 rounded-lg">
            <div class="grid grid-cols-2 gap-4">
              <div class="py-2 border-b border-gray-100">
                <span class="font-medium text-gray-600">Nama Cawangan:</span>
                <span class="text-gray-900 ml-2 font-semibold">{{ cawanganData.namaCawangan }}</span>
              </div>
              <div class="py-2 border-b border-gray-100">
                <span class="font-medium text-gray-600">Nama HQ:</span>
                <span class="text-gray-900 ml-2 font-semibold">{{ cawanganData.namaHQ }}</span>
              </div>
              <div class="py-2 border-b border-gray-100">
                <span class="font-medium text-gray-600">Jenis Organisasi:</span>
                <span class="text-gray-900 ml-2 font-semibold">{{ cawanganData.jenisOrganisasi }}</span>
              </div>
              <div class="py-2 border-b border-gray-100">
                <span class="font-medium text-gray-600">No. Pendaftaran:</span>
                <span class="text-gray-900 ml-2 font-semibold">{{ cawanganData.noPendaftaran }}</span>
              </div>
              <div class="py-2 border-b border-gray-100">
                <span class="font-medium text-gray-600">Status Pendaftaran:</span>
                <span class="text-gray-900 ml-2 font-semibold">{{ cawanganData.statusPendaftaran }}</span>
              </div>
              <div class="py-2 border-b border-gray-100">
                <span class="font-medium text-gray-600">Kariah:</span>
                <span class="text-gray-900 ml-2 font-semibold">{{ cawanganData.kariah }}</span>
              </div>
              <div class="py-2 border-b border-gray-100">
                <span class="font-medium text-gray-600">Kawasan/Zon:</span>
                <span class="text-gray-900 ml-2 font-semibold">{{ cawanganData.zone }}</span>
              </div>
            </div>
          </div>

          <!-- Maklumat Alamat -->
          <h3 class="text-lg font-semibold mb-4 text-gray-900">Maklumat Alamat</h3>
          <div class="mb-8 p-6 border border-gray-200 rounded-lg">
            <div class="grid grid-cols-2 gap-4">
              <div class="py-2 border-b border-gray-100">
                <span class="font-medium text-gray-600">Alamat 1:</span>
                <span class="text-gray-900 ml-2 font-semibold">{{ cawanganData.alamat?.addressLine1 || '-' }}</span>
              </div>
              <div v-if="cawanganData.alamat?.addressLine2" class="py-2 border-b border-gray-100">
                <span class="font-medium text-gray-600">Alamat 2:</span>
                <span class="text-gray-900 ml-2 font-semibold">{{ cawanganData.alamat?.addressLine2 }}</span>
              </div>
              <div v-if="cawanganData.alamat?.addressLine3" class="py-2 border-b border-gray-100">
                <span class="font-medium text-gray-600">Alamat 3:</span>
                <span class="text-gray-900 ml-2 font-semibold">{{ cawanganData.alamat?.addressLine3 }}</span>
              </div>
              <div class="py-2 border-b border-gray-100">
                <span class="font-medium text-gray-600">Poskod:</span>
                <span class="text-gray-900 ml-2 font-semibold">{{ cawanganData.alamat?.postcode || '-' }}</span>
              </div>
              <div class="py-2 border-b border-gray-100">
                <span class="font-medium text-gray-600">Bandar:</span>
                <span class="text-gray-900 ml-2 font-semibold">{{ cawanganData.alamat?.city || '-' }}</span>
              </div>
              <div class="py-2 border-b border-gray-100">
                <span class="font-medium text-gray-600">Daerah:</span>
                <span class="text-gray-900 ml-2 font-semibold">{{ cawanganData.alamat?.district || '-' }}</span>
              </div>
              <div class="py-2 border-b border-gray-100">
                <span class="font-medium text-gray-600">Negeri:</span>
                <span class="text-gray-900 ml-2 font-semibold">{{ cawanganData.alamat?.state || '-' }}</span>
              </div>
            </div>
          </div>

          <!-- Maklumat Perhubungan -->
          <div v-if="cawanganData.wakil && cawanganData.wakil.length > 0">
            <h3 class="text-lg font-semibold mb-4 text-gray-900">Maklumat Perhubungan</h3>
            <div class="mb-8 p-6 border border-gray-200 rounded-lg">
              <div class="space-y-6">
                <div v-for="(wakil, index) in cawanganData.wakil" :key="index" class="p-4 bg-gray-50 rounded-lg">
                  <h4 class="font-medium text-gray-900 mb-3">Wakil {{ index + 1 }}</h4>
                  <div class="grid grid-cols-2 gap-4">
                    <div class="py-2 border-b border-gray-100">
                      <span class="font-medium text-gray-600">Nama:</span>
                      <span class="text-gray-900 ml-2 font-semibold">{{ wakil.name }}</span>
                    </div>
                    <div class="py-2 border-b border-gray-100">
                      <span class="font-medium text-gray-600">No. IC:</span>
                      <span class="text-gray-900 ml-2 font-semibold">{{ wakil.ic }}</span>
                    </div>
                    <div class="py-2 border-b border-gray-100">
                      <span class="font-medium text-gray-600">No. Telefon:</span>
                      <span class="text-gray-900 ml-2 font-semibold">{{ wakil.phoneNumber }}</span>
                    </div>
                    <div class="py-2 border-b border-gray-100">
                      <span class="font-medium text-gray-600">Emel:</span>
                      <span class="text-gray-900 ml-2 font-semibold">{{ wakil.email }}</span>
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
              <div v-if="cawanganData.bank?.bankSameAsHQ" class="py-2 border-b border-gray-100">
                <span class="font-medium text-gray-600">Sama seperti HQ:</span>
                <span class="text-gray-900 ml-2 font-semibold">{{ cawanganData.bank?.bankSameAsHQ === 'ya' ? 'Ya' : 'Tidak' }}</span>
              </div>
              <div class="py-2 border-b border-gray-100">
                <span class="font-medium text-gray-600">Nama Bank:</span>
                <span class="text-gray-900 ml-2 font-semibold">{{ cawanganData.bank?.bankName || '-' }}</span>
              </div>
              <div class="py-2 border-b border-gray-100">
                <span class="font-medium text-gray-600">No. Akaun Bank:</span>
                <span class="text-gray-900 ml-2 font-semibold">{{ cawanganData.bank?.bankAccountNumber || '-' }}</span>
              </div>
              <div class="py-2 border-b border-gray-100">
                <span class="font-medium text-gray-600">Nama Pemegang Akaun:</span>
                <span class="text-gray-900 ml-2 font-semibold">{{ cawanganData.bank?.penamaBank || '-' }}</span>
              </div>
              <div class="py-2 border-b border-gray-100">
                <span class="font-medium text-gray-600">Kaedah Pembayaran:</span>
                <span class="text-gray-900 ml-2 font-semibold">{{ cawanganData.bank?.paymentMethod || '-' }}</span>
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

          <!-- Action Buttons - Bottom Right -->
          <div class="flex justify-end gap-3 pt-6 border-t border-gray-200">
            <rs-button variant="secondary" @click="handleBack">
              <Icon name="ph:arrow-left" class="w-4 h-4 mr-1" />
              Kembali
            </rs-button>
          </div>
        </div>
      </template>
    </rs-card>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'

definePageMeta({ title: 'Maklumat Cawangan Terperinci' })

const route = useRoute()
const isLoading = ref(false)
const error = ref(null)

const breadcrumb = ref([
  { name: 'Pengesahan', type: 'link', path: '/BF-PRF/OR/PB' },
  { name: 'Senarai Cawangan', type: 'link', path: '/BF-PRF/OR/PB' },
  { name: 'Maklumat Terperinci', type: 'current', path: `/BF-PRF/OR/PB/view/${route.params.id}` },
])

// Mock data structure aligned with current form
const cawanganData = ref({
  noRujukan: '',
  namaCawangan: '',
  namaHQ: '',
  jenisOrganisasi: '',
  noPendaftaran: '',
  statusPendaftaran: '',
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
  registrationCertificate: null,
  appointmentLetter: null,
  bankProof: null,
  additionalDocuments: null,
  status: '',
  tarikhPermohonan: ''
})

// User role simulation - for demo purposes
const currentUserRole = ref('Eksekutif')

const getStatusVariant = (status) => {
  const variants = {
    'Menunggu Pengesahan': 'warning',
    'Dalam Pembetulan': 'warning',
    'Disahkan': 'success',
    'Perlu Pembetulan': 'warning',
    'Tidak Sah': 'danger'
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
  if (Array.isArray(document) && document.length > 0) return document[0].name || 'Dilampirkan'
  if (typeof document === 'object' && document.name) return document.name
  return 'Tiada'
}

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

const supportDocuments = computed(() => {
  const rc = cawanganData.value.registrationCertificate
  const ap = cawanganData.value.appointmentLetter
  const bp = cawanganData.value.bankProof
  const ad = cawanganData.value.additionalDocuments
  const pick = (d) => (Array.isArray(d) ? d[0] : d) || {}
  const f = (d) => (d && (Array.isArray(d) ? d.length > 0 : true))
  const p1 = pick(rc), p2 = pick(ap), p3 = pick(bp), p4 = pick(ad)
  return [
    { name: 'Sijil Pendaftaran', has: f(rc), filename: f(rc) ? (p1.filename || p1.name) : '', size: p1.size || '' },
    { name: 'Surat Perwakilan Kuasa', has: f(ap), filename: f(ap) ? (p2.filename || p2.name) : '', size: p2.size || '' },
    { name: 'Bukti Bank', has: f(bp), filename: f(bp) ? (p3.filename || p3.name) : '', size: p3.size || '' },
    { name: 'Dokumen Tambahan', has: f(ad), filename: f(ad) ? (p4.filename || p4.name) : '', size: p4.size || '' },
  ]
})

const loadCawanganData = (id) => {
  const dataset = {
    'CB-240501': {
      noRujukan: 'CB-240501',
      namaCawangan: 'Institut Latihan Kemahiran Malaysia - Cawangan Shah Alam',
      namaHQ: 'ILKM Shah Alam',
      jenisOrganisasi: 'Institut',
      noPendaftaran: 'ILKM-2023-012',
      statusPendaftaran: 'Berdaftar',
      kariah: 'MASJID SHAH ALAM',
      zone: 'Zon Selangor',
      alamat: {
        addressLine1: 'No. 321, Jalan Kemahiran 4/1',
        addressLine2: 'Taman Kemahiran Jaya',
        addressLine3: '',
        postcode: '40000',
        city: 'Shah Alam',
        district: 'Petaling',
        state: 'Selangor'
      },
      wakil: [
        {
          name: 'Encik Mohd Rashid bin Hassan',
          ic: '700301067890',
          phoneNumber: '03-55567890',
          email: 'rashid@ilkm.gov.my'
        }
      ],
      bank: {
        bankSameAsHQ: 'tidak',
        bankName: 'RHB Bank',
        bankAccountNumber: '3456789012345',
        penamaBank: 'Institut Latihan Kemahiran Malaysia',
        paymentMethod: 'Bank Transfer'
      },
      registrationCertificate: { name: 'sijil_ilkm_2023.pdf' },
      appointmentLetter: { name: 'surat_cawangan_2025.pdf' },
      bankProof: { name: 'bank_verification_2025.pdf' },
      additionalDocuments: null,
      status: 'Menunggu Pengesahan',
      tarikhPermohonan: '30/7/2025'
    },
    'CB-240502': {
      noRujukan: 'CB-240502',
      namaCawangan: 'Pertubuhan Amal Iman Malaysia - Cawangan Klang',
      namaHQ: 'Pertubuhan Amal Iman Malaysia',
      jenisOrganisasi: 'NGO',
      noPendaftaran: 'PPM-2023-001',
      statusPendaftaran: 'Berdaftar',
      kariah: 'MASJID KLANG',
      zone: 'Zon Klang',
      alamat: {
        addressLine1: 'No. 789, Jalan Amal 3/2',
        addressLine2: 'Taman Amal Klang',
        addressLine3: '',
        postcode: '41000',
        city: 'Klang',
        district: 'Klang',
        state: 'Selangor'
      },
      wakil: [
        {
          name: 'Ustazah Siti Aisyah binti Mohd',
          ic: '820315234567',
          phoneNumber: '03-55551234',
          email: 'aisyah@amaliman.org'
        }
      ],
      bank: {
        bankSameAsHQ: 'ya',
        bankName: 'Maybank',
        bankAccountNumber: '5123456789012',
        penamaBank: 'Pertubuhan Amal Iman Malaysia',
        paymentMethod: 'Bank Transfer'
      },
      registrationCertificate: { name: 'sijil_ros_2023.pdf' },
      appointmentLetter: { name: 'surat_cawangan_2025.pdf' },
      bankProof: null,
      additionalDocuments: null,
      status: 'Disahkan',
      tarikhPermohonan: '15/6/2025'
    },
    'CB-240503': {
      noRujukan: 'CB-240503',
      namaCawangan: 'Sekolah Menengah Tahfiz Al-Amin - Cawangan Kajang',
      namaHQ: 'Sekolah Menengah Tahfiz Al-Amin',
      jenisOrganisasi: 'IPT',
      noPendaftaran: 'IPT-2023-045',
      statusPendaftaran: 'Berdaftar',
      kariah: 'MASJID AL-AMIN',
      zone: 'Zon Kajang',
      alamat: {
        addressLine1: 'Lot 456, Jalan Pendidikan 3/1',
        addressLine2: 'Taman Pendidikan Islam',
        addressLine3: '',
        postcode: '43000',
        city: 'Kajang',
        district: 'Hulu Langat',
        state: 'Selangor'
      },
      wakil: [
        {
          name: 'Ustaz Mohd Fikri bin Omar',
          ic: '850610089012',
          phoneNumber: '03-80123456',
          email: 'fikri@tahfizalamin.edu.my'
        }
      ],
      bank: {
        bankSameAsHQ: 'tidak',
        bankName: 'Bank Islam',
        bankAccountNumber: '2098765432109',
        penamaBank: 'Sekolah Menengah Tahfiz Al-Amin',
        paymentMethod: 'Bank Transfer'
      },
      registrationCertificate: { name: 'sijil_moe_2023.pdf' },
      appointmentLetter: { name: 'surat_cawangan_2025.pdf' },
      bankProof: { name: 'bank_letter_2025.pdf' },
      additionalDocuments: null,
      status: 'Perlu Pembetulan',
      tarikhPermohonan: '8/5/2025'
    },
    'CB-240504': {
      noRujukan: 'CB-240504',
      namaCawangan: 'Syarikat Teknologi Maju Sdn Bhd - Cawangan Cyberjaya',
      namaHQ: 'Syarikat Teknologi Maju Sdn Bhd',
      jenisOrganisasi: 'Swasta',
      noPendaftaran: '123456-A',
      statusPendaftaran: 'Berdaftar',
      kariah: 'MASJID CYBERJAYA',
      zone: 'Zon Cyberjaya',
      alamat: {
        addressLine1: 'No. 123, Jalan Teknologi 3/1',
        addressLine2: 'Taman Teknologi Malaysia',
        addressLine3: '',
        postcode: '63000',
        city: 'Cyberjaya',
        district: 'Sepang',
        state: 'Selangor'
      },
      wakil: [
        {
          name: 'Encik Ahmad bin Abdullah',
          ic: '800123456789',
          phoneNumber: '03-12345678',
          email: 'ahmad@teknologimaju.com'
        }
      ],
      bank: {
        bankSameAsHQ: 'ya',
        bankName: 'CIMB Bank',
        bankAccountNumber: '8001234567890',
        penamaBank: 'Syarikat Teknologi Maju Sdn Bhd',
        paymentMethod: 'Bank Transfer'
      },
      registrationCertificate: { name: 'sijil_ssm_2025.pdf' },
      appointmentLetter: { name: 'surat_cawangan_2025.pdf' },
      bankProof: null,
      additionalDocuments: null,
      status: 'Tidak Sah',
      tarikhPermohonan: '12/6/2025'
    }
  }

  if (dataset[id]) {
    cawanganData.value = { ...cawanganData.value, ...dataset[id] }
  }
}

const handleBack = () => {
  navigateTo('/BF-PRF/OR/PB')
}


const retryLoad = () => {
  error.value = null
  loadData()
}

const loadData = async () => {
  isLoading.value = true
  try {
    await new Promise(resolve => setTimeout(resolve, 1000)) // Simulate API call
    loadCawanganData(route.params.id)
  } catch (err) {
    error.value = 'Gagal memuatkan data cawangan'
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  loadData()
})
</script>