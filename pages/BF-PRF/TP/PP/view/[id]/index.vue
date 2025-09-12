<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />

    <!-- Loading State -->
    <div v-if="isLoading" class="mt-4">
      <rs-card>
        <template #body>
          <div class="flex items-center justify-center py-8">
            <Icon name="ph:spinner" class="w-8 h-8 text-blue-600 animate-spin mr-3" />
            <span class="text-gray-600">Memuatkan maklumat recipient...</span>
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
          <h2 class="text-xl font-semibold">Maklumat Recipient Terperinci</h2>
        </div>
      </template>

      <template #body>
        <div class="p-4">
          <!-- Status Summary Card -->
          <div class="mb-8 p-4 bg-gray-50 border border-gray-200 rounded-lg">
            <div class="flex justify-between items-start">
              <div>
                <h3 class="text-lg font-semibold text-gray-900">Status Permohonan</h3>
                <p class="text-sm text-gray-600">Rujukan: {{ recipientData.noRujukan }}</p>
                <p class="text-sm text-gray-600">Tarikh Permohonan: {{ formatDate(recipientData.tarikhPermohonan) }}</p>
              </div>
              <div class="flex gap-2">
                <rs-badge :variant="getStatusVariant(recipientData.status)">
                  {{ recipientData.status }}
                </rs-badge>
              </div>
            </div>
                </div>
                
          <!-- Maklumat Recipient -->
          <h3 class="text-lg font-semibold mb-4 text-gray-900">Maklumat Recipient</h3>
          <div class="mb-8 p-6 border border-gray-200 rounded-lg">
            <div class="grid grid-cols-2 gap-4">
              <div class="py-2 border-b border-gray-100">
                <span class="font-medium text-gray-600">Jenis Recipient:</span>
                <span class="text-gray-900 ml-2 font-semibold">{{ getJenisRecipientLabel(recipientData.jenisRecipient) }}</span>
              </div>
              <div class="py-2 border-b border-gray-100">
                <span class="font-medium text-gray-600">Nama:</span>
                <span class="text-gray-900 ml-2 font-semibold">{{ getNamaLabel(recipientData) }}</span>
              </div>
              <div class="py-2 border-b border-gray-100">
                <span class="font-medium text-gray-600">Jenis Pengenalan:</span>
                <span class="text-gray-900 ml-2 font-semibold">{{ getJenisPengenalanLabel(recipientData.jenisPengenalan) }}</span>
              </div>
              <div class="py-2 border-b border-gray-100">
                <span class="font-medium text-gray-600">ID Pengenalan:</span>
                <span class="text-gray-900 ml-2 font-semibold">{{ getIDPengenalan(recipientData) }}</span>
              </div>
            </div>
          </div>

          <!-- Maklumat Bank -->
          <h3 class="text-lg font-semibold mb-4 text-gray-900">Maklumat Bank</h3>
          <div class="mb-8 p-6 border border-gray-200 rounded-lg">
            <div class="grid grid-cols-2 gap-4">
              <div class="py-2 border-b border-gray-100">
                <span class="font-medium text-gray-600">Nama Bank:</span>
                <span class="text-gray-900 ml-2 font-semibold">{{ recipientData.bank?.bankName || '-' }}</span>
              </div>
              <div class="py-2 border-b border-gray-100">
                <span class="font-medium text-gray-600">No. Akaun Bank:</span>
                <span class="text-gray-900 ml-2 font-semibold">{{ recipientData.bank?.bankAccountNumber || '-' }}</span>
              </div>
              <div class="py-2 border-b border-gray-100">
                <span class="font-medium text-gray-600">Nama Pemegang Akaun:</span>
                <span class="text-gray-900 ml-2 font-semibold">{{ recipientData.bank?.penamaBank || '-' }}</span>
              </div>
              <div class="py-2 border-b border-gray-100">
                <span class="font-medium text-gray-600">Kaedah Pembayaran:</span>
                <span class="text-gray-900 ml-2 font-semibold">{{ recipientData.bank?.paymentMethod || '-' }}</span>
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

definePageMeta({ title: 'Maklumat Recipient Terperinci' })

const route = useRoute()
const isLoading = ref(false)
const error = ref(null)

const breadcrumb = ref([
  { name: 'Pengesahan', type: 'link', path: '/BF-PRF/TP/PP' },
  { name: 'Senarai Recipient', type: 'link', path: '/BF-PRF/TP/PP' },
  { name: 'Maklumat Terperinci', type: 'current', path: `/BF-PRF/TP/PP/view/${route.params.id}` },
])

// Mock data structure aligned with registration form (TP/PP/02)
const recipientData = ref({
  noRujukan: '',
  jenisRecipient: '',
  namaPenuh: '',
  namaSyarikat: '',
  jenisPengenalan: '',
  idPengenalan: '',
  idSyarikat: '',
  bank: {
    bankName: '',
    bankAccountNumber: '',
    penamaBank: '',
    paymentMethod: ''
  },
  identityDocument: null,
  dokumenSokongan: null,
  bankDocument: null,
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

const getJenisRecipientLabel = (jenis) => {
  const labels = {
    'individu': 'Individu',
    'syarikat': 'Syarikat'
  }
  return labels[jenis] || jenis
}

const getNamaLabel = (data) => {
  if (data.jenisRecipient === 'individu') {
    return data.namaPenuh
  } else {
    return data.namaSyarikat
  }
}

const getJenisPengenalanLabel = (jenis) => {
  const labels = {
    'ic': 'Kad Pengenalan',
    'passport': 'Pasport',
    'id_syarikat': 'No. Pendaftaran Syarikat'
  }
  return labels[jenis] || jenis
}

const getIDPengenalan = (data) => {
  if (data.jenisPengenalan === 'id_syarikat') {
    return data.idSyarikat
  } else {
    return data.idPengenalan
  }
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
  const id = recipientData.value.identityDocument
  const ds = recipientData.value.dokumenSokongan
  const bd = recipientData.value.bankDocument
  const ad = recipientData.value.additionalDocuments
  const pick = (d) => (Array.isArray(d) ? d[0] : d) || {}
  const f = (d) => (d && (Array.isArray(d) ? d.length > 0 : true))
  const p1 = pick(id), p2 = pick(ds), p3 = pick(bd), p4 = pick(ad)
  return [
    { name: 'Dokumen Pengenalan', has: f(id), filename: f(id) ? (p1.filename || p1.name) : '', size: p1.size || '' },
    { name: 'Dokumen Sokongan Bank', has: f(ds), filename: f(ds) ? (p2.filename || p2.name) : '', size: p2.size || '' },
    { name: 'Dokumen Bank', has: f(bd), filename: f(bd) ? (p3.filename || p3.name) : '', size: p3.size || '' },
    { name: 'Dokumen Tambahan', has: f(ad), filename: f(ad) ? (p4.filename || p4.name) : '', size: p4.size || '' },
  ]
})

const loadRecipientData = (id) => {
  const dataset = {
    'RE-202507-0011': {
      noRujukan: 'RE-202507-0011',
      jenisRecipient: 'individu',
      namaPenuh: 'Ahmad Bin Abdullah',
      namaSyarikat: '',
      jenisPengenalan: 'ic',
      idPengenalan: '800123456789',
      idSyarikat: '',
      bank: {
        bankName: 'Maybank',
        bankAccountNumber: '5123456789012',
        penamaBank: 'Ahmad Bin Abdullah',
        paymentMethod: 'Bank Transfer'
      },
      identityDocument: { name: 'ic_ahmad_abdullah_2025.pdf' },
      dokumenSokongan: { name: 'dokumen_sokongan_bank_2025.pdf' },
      bankDocument: { name: 'bank_statement_jan_2025.pdf' },
      additionalDocuments: null,
      status: 'Menunggu Pengesahan',
      tarikhPermohonan: '23/7/2025'
    },
    'RE-202506-0012': {
      noRujukan: 'RE-202506-0012',
      jenisRecipient: 'syarikat',
      namaPenuh: '',
      namaSyarikat: 'Pusat Dialisis Al-Falah Sdn Bhd',
      jenisPengenalan: 'id_syarikat',
      idPengenalan: '',
      idSyarikat: '123456-A',
      bank: {
        bankName: 'CIMB Bank',
        bankAccountNumber: '8001234567890',
        penamaBank: 'Pusat Dialisis Al-Falah Sdn Bhd',
        paymentMethod: 'Bank Transfer'
      },
      identityDocument: { name: 'sijil_ssm_2025.pdf' },
      dokumenSokongan: { name: 'surat_pengesahan_bank_2025.pdf' },
      bankDocument: { name: 'bank_confirmation_2025.pdf' },
      additionalDocuments: null,
      status: 'Disahkan',
      tarikhPermohonan: '15/6/2025'
    },
    'RE-202505-0013': {
      noRujukan: 'RE-202505-0013',
      jenisRecipient: 'individu',
      namaPenuh: 'Siti Fatimah Binti Ali',
      namaSyarikat: '',
      jenisPengenalan: 'ic',
      idPengenalan: '820315234567',
      bank: {
        bankName: 'Bank Islam',
        bankAccountNumber: '2098765432109',
        penamaBank: 'Siti Fatimah Binti Ali',
        paymentMethod: 'Bank Transfer'
      },
      identityDocument: { name: 'ic_siti_fatimah_2025.pdf' },
      dokumenSokongan: { name: 'penyata_bank_2025.pdf' },
      bankDocument: { name: 'bank_statement_feb_2025.pdf' },
      additionalDocuments: null,
      status: 'Tidak Sah',
      tarikhPermohonan: '8/5/2025'
    },
    'RE-202507-0014': {
      noRujukan: 'RE-202507-0014',
      jenisRecipient: 'syarikat',
      namaPenuh: '',
      namaSyarikat: 'Klinik Kesihatan Sejahtera',
      jenisPengenalan: 'id_syarikat',
      idPengenalan: '',
      idSyarikat: 'PPM-2023-001',
      bank: {
        bankName: 'RHB Bank',
        bankAccountNumber: '3456789012345',
        penamaBank: 'Klinik Kesihatan Sejahtera',
        paymentMethod: 'Bank Transfer'
      },
      identityDocument: { name: 'sijil_ros_2023.pdf' },
      dokumenSokongan: { name: 'surat_pengesahan_bank_klinik.pdf' },
      bankDocument: { name: 'bank_verification_2025.pdf' },
      additionalDocuments: null,
      status: 'Perlu Pembetulan',
      tarikhPermohonan: '30/7/2025'
    },
    'RE-202506-0015': {
      noRujukan: 'RE-202506-0015',
      jenisRecipient: 'individu',
      namaPenuh: 'Zainab Binti Hassan',
      namaSyarikat: '',
      jenisPengenalan: 'ic',
      idPengenalan: '820315234567',
      idSyarikat: '',
      bank: {
        bankName: 'Public Bank',
        bankAccountNumber: '4567890123456',
        penamaBank: 'Zainab Binti Hassan',
        paymentMethod: 'Bank Transfer'
      },
      identityDocument: { name: 'ic_zainab_hassan_2025.pdf' },
      dokumenSokongan: { name: 'dokumen_sokongan_bank_zainab.pdf' },
      bankDocument: { name: 'bank_statement_feb_2025.pdf' },
      additionalDocuments: null,
      status: 'Disahkan',
      tarikhPermohonan: '12/6/2025'
    },
    'RE-202505-0016': {
      noRujukan: 'RE-202505-0016',
      jenisRecipient: 'syarikat',
      namaPenuh: '',
      namaSyarikat: 'Pembekal Makanan Halal Sdn Bhd',
      jenisPengenalan: 'id_syarikat',
      idPengenalan: '',
      idSyarikat: '987654-B',
      bank: {
        bankName: 'Bank Islam',
        bankAccountNumber: '2098765432109',
        penamaBank: 'Pembekal Makanan Halal Sdn Bhd',
        paymentMethod: 'Bank Transfer'
      },
      identityDocument: { name: 'sijil_ssm_pembekal_2025.pdf' },
      dokumenSokongan: { name: 'surat_pengesahan_bank_pembekal.pdf' },
      bankDocument: { name: 'bank_confirmation_pembekal.pdf' },
      additionalDocuments: null,
      status: 'Tidak Sah',
      tarikhPermohonan: '25/5/2025'
    },
    'RE-202507-0017': {
      noRujukan: 'RE-202507-0017',
      jenisRecipient: 'individu',
      namaPenuh: 'Mohd Zaki bin Hassan',
      namaSyarikat: '',
      jenisPengenalan: 'ic',
      idPengenalan: '750512123456',
      idSyarikat: '',
      bank: {
        bankName: 'AmBank',
        bankAccountNumber: '6789012345678',
        penamaBank: 'Mohd Zaki bin Hassan',
        paymentMethod: 'Bank Transfer'
      },
      identityDocument: { name: 'ic_zaki_hassan_2025.pdf' },
      dokumenSokongan: { name: 'dokumen_sokongan_bank_zaki.pdf' },
      bankDocument: { name: 'bank_statement_jul_2025.pdf' },
      additionalDocuments: null,
      status: 'Dalam Pembetulan',
      tarikhPermohonan: '20/7/2025'
    }
  }

  if (dataset[id]) {
    recipientData.value = { ...recipientData.value, ...dataset[id] }
  }
}

const handleBack = () => {
  navigateTo('/BF-PRF/TP/PP')
}


const retryLoad = () => {
  error.value = null
  loadData()
}

const loadData = async () => {
  isLoading.value = true
  try {
    await new Promise(resolve => setTimeout(resolve, 1000)) // Simulate API call
    loadRecipientData(route.params.id)
  } catch (err) {
    error.value = 'Gagal memuatkan data penerima'
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  loadData()
})
</script> 