<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />

    <div class="mb-8 p-4 bg-gray-50 border border-gray-200 rounded-lg">
      <div class="flex justify-between items-start">
        <div>
          <h3 class="text-lg font-semibold text-gray-900">Status Permohonan</h3>
          <p class="text-sm text-gray-600">Rujukan: {{ applicationData.refNumber }}</p>
          <p class="text-sm text-gray-600">Tarikh Permohonan: {{ applicationData.applicationDate }}</p>
        </div>
        <div class="flex gap-2">
          <rs-badge :variant="getStatusBadgeVariant()">{{ applicationData.status }}</rs-badge>
        </div>
      </div>
    </div>

    <div class="space-y-6">
      <!-- Maklumat Recipient -->
      <rs-card>
        <template #header>
          <h2 class="text-md font-semibold text-gray-900">Maklumat Recipient</h2>
        </template>
        <template #body>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormKit type="text" label="No. Rujukan" v-model="applicationData.refNumber" readonly />
            <FormKit type="text" label="Tarikh Permohonan" v-model="applicationData.applicationDate" readonly />
            <FormKit type="text" label="Jenis Recipient" v-model="applicationData.jenisRecipient" readonly />
            <FormKit v-if="applicationData.jenisRecipient === 'Individu'" type="text" label="Nama Penuh" v-model="applicationData.namaPenuh" readonly />
            <FormKit v-if="applicationData.jenisRecipient === 'Syarikat'" type="text" label="Nama Syarikat" v-model="applicationData.namaSyarikat" readonly />
            <FormKit type="text" label="Jenis Pengenalan" v-model="applicationData.jenisPengenalan" readonly />
            <FormKit v-if="applicationData.jenisPengenalan !== 'ID Syarikat'" type="text" label="ID Pengenalan" v-model="applicationData.idPengenalan" readonly />
            <FormKit v-if="applicationData.jenisPengenalan === 'ID Syarikat'" type="text" label="ID Syarikat" v-model="applicationData.idSyarikat" readonly />
          </div>
        </template>
      </rs-card>

      <!-- Maklumat Akaun Bank -->
      <rs-card>
        <template #header>
          <h2 class="text-md font-semibold text-gray-900">Maklumat Akaun Bank</h2>
        </template>
        <template #body>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormKit type="text" label="Nama Bank" v-model="applicationData.namaBank" readonly />
            <FormKit type="text" label="No Akaun Bank" v-model="applicationData.noAkaunBank" readonly />
            <FormKit type="text" label="Penama Akaun Bank" v-model="applicationData.penamaAkaunBank" readonly />
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
            <div v-for="(doc, index) in applicationData.documents" :key="index" class="p-4 border border-gray-200 rounded-lg flex items-center justify-between">
              <div class="flex items-center">
                <Icon name="mdi:file-document-outline" class="text-blue-600 mr-3" size="1.25rem" />
                <div>
                  <p class="font-medium text-gray-900">{{ doc.name }}</p>
                  <p class="text-sm text-gray-600" v-if="doc.filename">{{ doc.filename }}</p>
                  <p class="text-xs text-gray-500" v-if="doc.size">{{ doc.size }}</p>
                  <rs-badge v-if="!doc.filename && !doc.size" variant="warning">Tiada</rs-badge>
                </div>
              </div>
              <div class="flex items-center gap-2" v-if="doc.filename || doc.size">
                <rs-button variant="secondary-outline" size="sm" class="!p-1 !w-8 !h-8" title="Muat Turun">
                  <Icon name="ph:download" size="1rem" />
                </rs-button>
                <rs-button variant="secondary-outline" size="sm" class="!p-1 !w-8 !h-8" title="Lihat">
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
          <FormKit type="form" :actions="false" @submit.prevent>
            <div class="space-y-2">
              <label class="block text-sm font-medium text-gray-700 mb-2">Status Pengesahan <span class="text-red-500">*</span></label>
              <label class="flex items-center"><input v-model="approvalData.status" type="radio" value="Disahkan" class="mr-2 text-green-600 focus:ring-green-500" /><span class="text-sm font-medium text-gray-900">Disahkan</span></label>
              <label class="flex items-center"><input v-model="approvalData.status" type="radio" value="Perlu Pembetulan" class="mr-2 text-yellow-600 focus:ring-yellow-500" /><span class="text-sm font-medium text-gray-900">Perlu Pembetulan</span></label>
              <label class="flex items-center"><input v-model="approvalData.status" type="radio" value="Tidak Sah" class="mr-2 text-red-600 focus:ring-red-500" /><span class="text-sm font-medium text-gray-900">Tidak Sah</span></label>
              <div v-if="!approvalData.status" class="mt-1 text-sm text-red-600">Status pengesahan adalah wajib</div>
            </div>
            <div v-if="approvalData.status === 'Perlu Pembetulan' || approvalData.status === 'Tidak Sah'" class="mt-4">
              <label class="block text-sm font-medium text-gray-700 mb-2">{{ approvalData.status === 'Perlu Pembetulan' ? 'Ulasan Pembetulan' : 'Justifikasi Penolakan' }} <span class="text-red-500">*</span></label>
              <textarea v-model="approvalData.justification" :placeholder="approvalData.status === 'Perlu Pembetulan' ? 'Sila nyatakan perkara yang perlu diperbetulkan' : 'Sila nyatakan sebab penolakan'" class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 min-h-[100px]"></textarea>
              <div v-if="!approvalData.justification" class="mt-1 text-sm text-red-600">Ulasan diperlukan untuk status ini</div>
            </div>
          </FormKit>
        </template>
      </rs-card>

      <!-- Action Buttons -->
      <div class="flex justify-end gap-3 pt-2">
        <rs-button variant="secondary" @click="handleBack"><Icon name="ph:arrow-left" class="w-4 h-4 mr-1" />Kembali</rs-button>
        <rs-button variant="primary" @click="showConfirmationModal = true" :disabled="processing" class="px-8 py-3">
          <template v-if="processing"><Icon name="eos-icons:loading" class="animate-spin mr-2" size="1rem" /> Memproses...</template>
          <template v-else><Icon name="material-symbols:check-circle" class="mr-2" size="1rem" /> Hantar Keputusan</template>
        </rs-button>
      </div>
    </div>

    <!-- Confirmation Modal -->
    <rs-modal v-model="showConfirmationModal" title="Sahkan Keputusan Pengesahan" size="md">
      <template #body>
        <div class="text-center">
          <h3 class="text-lg font-semibold text-gray-900 mb-2">Adakah anda pasti?</h3>
          <p class="text-gray-600 mb-4">Anda akan menghantar keputusan pengesahan untuk permohonan ini. Tindakan ini tidak boleh dibatalkan.</p>
          <div class="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
            <p class="text-sm text-blue-800"><strong>Keputusan:</strong> {{ approvalData.status || 'Belum dipilih' }}</p>
            <p v-if="approvalData.justification" class="text-sm text-blue-800 mt-1"><strong>Ulasan:</strong> {{ approvalData.justification.substring(0, 100) }}{{ approvalData.justification.length > 100 ? '...' : '' }}</p>
          </div>
        </div>
      </template>
      <template #footer>
        <div class="flex justify-end gap-3">
          <rs-button variant="secondary-outline" @click="showConfirmationModal = false">Batal</rs-button>
          <rs-button variant="primary" @click="confirmSubmit" :loading="processing"><Icon name="ph:check" class="w-4 h-4 mr-2" />Ya, Hantar Keputusan</rs-button>
        </div>
      </template>
    </rs-modal>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useToast } from 'vue-toastification'

definePageMeta({ title: 'Pengesahan Pendaftaran Recipient' })

const route = useRoute()
const toast = useToast()
const processing = ref(false)
const showConfirmationModal = ref(false)

const breadcrumb = ref([
  { name: 'Pengesahan', type: 'link', path: '/BF-PRF/TP/PP' },
  { name: 'Pengesahan Pendaftaran Recipient', type: 'current' },
])

const approvalData = ref({ status: '', justification: '' })

const applicationData = ref({
  refNumber: '',
  applicationDate: '',
  status: 'Menunggu Pengesahan',
  jenisRecipient: '',
  namaPenuh: '',
  namaSyarikat: '',
  jenisPengenalan: '',
  idPengenalan: '',
  idSyarikat: '',
  namaBank: '',
  noAkaunBank: '',
  penamaAkaunBank: '',
  documents: [],
})

const mockData = {
  'RE-202507-0011': {
    refNumber: 'RE-202507-0011',
    applicationDate: '23/7/2025',
    status: 'Menunggu Pengesahan',
    jenisRecipient: 'Individu',
    namaPenuh: 'Ahmad Bin Abdullah',
    jenisPengenalan: 'MyKad',
    idPengenalan: '880101123456',
    namaBank: 'Maybank',
    noAkaunBank: '1234567890123456',
    penamaAkaunBank: 'Ahmad Bin Abdullah',
    documents: [
      { name: 'Dokumen Pengenalan', filename: 'ic_ahmad_abdullah_2025.pdf', size: '0.6 MB' },
      { name: 'Dokumen Sokongan Bank', filename: 'surat_pengesahan_bank_2025.pdf', size: '0.9 MB' },
      { name: 'Dokumen Bank', filename: 'bank_statement_jun_2025.pdf', size: '2.2 MB' },
      { name: 'Dokumen Tambahan' },
    ],
  },
  'RE-202506-0012': {
    refNumber: 'RE-202506-0012',
    applicationDate: '15/6/2025',
    status: 'Disahkan',
    jenisRecipient: 'Syarikat',
    namaSyarikat: 'Pusat Dialisis As-Salam Shah Alam',
    jenisPengenalan: 'ID Syarikat',
    idSyarikat: 'PPM-2021-015',
    namaBank: 'Public Bank',
    noAkaunBank: '9876543210',
    penamaAkaunBank: 'Pusat Dialisis As-Salam Shah Alam',
    documents: [
      { name: 'Sijil SSM', filename: 'sijil_ssm_dialisis.pdf', size: '1.2 MB' },
      { name: 'Dokumen Bank', filename: 'bank_confirmation_dialisis.pdf', size: '0.9 MB' },
    ],
  },
  'RE-202507-0014': {
    refNumber: 'RE-202507-0014',
    applicationDate: '30/7/2025',
    status: 'Perlu Pembetulan',
    jenisRecipient: 'Syarikat',
    namaSyarikat: 'Klinik Kesihatan Al-Ikhlas',
    jenisPengenalan: 'ID Syarikat',
    idSyarikat: 'PPM-2022-008',
    namaBank: 'CIMB Bank',
    noAkaunBank: '8765432109876',
    penamaAkaunBank: 'Klinik Kesihatan Al-Ikhlas',
    documents: [
      { name: 'Sijil SSM', filename: 'sijil_ssm_klinik.pdf', size: '1.2 MB' },
      { name: 'Dokumen Bank', filename: 'bank_confirmation_klinik.pdf', size: '0.9 MB' },
    ],
  },
  'RE-202505-0016': {
    refNumber: 'RE-202505-0016',
    applicationDate: '25/5/2025',
    status: 'Tidak Sah',
    jenisRecipient: 'Syarikat',
    namaSyarikat: 'Pembekal Makanan Halal Al-Amin Sdn Bhd',
    jenisPengenalan: 'ID Syarikat',
    idSyarikat: 'PPM-2022-008',
    namaBank: 'Bank Islam',
    noAkaunBank: '7654321098765',
    penamaAkaunBank: 'Pembekal Makanan Halal Al-Amin Sdn Bhd',
    documents: [
      { name: 'Sijil SSM', filename: 'sijil_ssm_pembekal.pdf', size: '1.2 MB' },
      { name: 'Dokumen Bank', filename: 'bank_confirmation_pembekal.pdf', size: '0.9 MB' },
    ],
  },
}

const getStatusBadgeVariant = () => {
  switch (applicationData.value.status) {
    case 'Disahkan': return 'success'
    case 'Perlu Pembetulan': return 'warning'
    case 'Tidak Sah': return 'danger'
    case 'Menunggu Pengesahan': return 'warning'
    default: return 'info'
  }
}

const confirmSubmit = async () => {
  showConfirmationModal.value = false
  await handleApprovalSubmit()
}

const handleApprovalSubmit = async () => {
  if (!approvalData.value.status) { toast.error('Sila pilih status pengesahan'); return }
  if ((approvalData.value.status === 'Perlu Pembetulan' || approvalData.value.status === 'Tidak Sah') && !approvalData.value.justification) {
    toast.error('Ulasan diperlukan untuk status ini');
    return
  }
  processing.value = true
  await new Promise(r => setTimeout(r, 1000))
  applicationData.value.status = approvalData.value.status
  toast.success('Keputusan telah direkodkan')
  processing.value = false
  handleBack()
}

const handleBack = () => navigateTo('/BF-PRF/TP/PP')

const loadApplicationData = () => {
  const id = route.params.id
  if (mockData[id]) {
    // Direct assignment to ensure data is loaded
    Object.assign(applicationData.value, mockData[id])
  } else {
    applicationData.value.refNumber = id
  }
}

onMounted(() => {
  loadApplicationData()
})

// Watch for route changes
watch(() => route.params.id, (newId) => {
  if (newId) {
    loadApplicationData()
  }
})
</script>


