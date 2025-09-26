<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />
    <!-- Ketua Jabatan: Kelulusan (Lulus) -->
    <rs-card class="mt-4 p-6">
      <template #body>
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
                    <input v-model="approvalData.status" type="radio" value="Diluluskan" class="mr-2 text-green-600 focus:ring-green-500" />
                    <span class="text-sm font-medium text-gray-900">Diluluskan</span>
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
        <div class="text-center">
          <h3 class="text-lg font-semibold text-gray-900 mb-2">Adakah anda pasti?</h3>
          <p class="text-gray-600 mb-4">Anda akan menghantar keputusan kelulusan (Lulus) untuk permohonan ini.</p>
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
  status: 'Dalam Semakan Pelulus',
  documents: [
    { name: 'Sijil Pendaftaran SSM / ROS', filename: 'ssm_ros.pdf', size: '2.1 MB' },
    { name: 'Bukti Pemilikan Akaun Bank', filename: 'bank_proof.pdf', size: '0.9 MB' },
    { name: 'Surat Perwakilan Kuasa', filename: 'surat_perwakilan.pdf', size: '1.2 MB' },
  ],
})

const getStatusBadgeVariant = () => {
  switch (applicationData.value.status) {
    case 'Diluluskan':
      return 'success'
    case 'Tidak Lulus':
      return 'danger'
    case 'Dalam Semakan Pelulus':
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
    toast.error('Sila pilih keputusan kelulusan')
    return
  }
  if (approvalData.value.status === 'Tidak Lulus' && !approvalData.value.justification) {
    toast.error('Ulasan diperlukan untuk Tidak Lulus')
    return
  }
  processing.value = true
  await new Promise(r => setTimeout(r, 800))
  applicationData.value.status = approvalData.value.status === 'Diluluskan' ? 'Diluluskan' : 'Tidak Lulus'
  toast.success('Keputusan kelulusan telah direkodkan')
  processing.value = false
  goBack()
}

const goBack = () => navigateTo('/BF-PRF/OR/PP')

onMounted(() => {
  const id = route.params.id
  applicationData.value.refNumber = id
})
</script>


