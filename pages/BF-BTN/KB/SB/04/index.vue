<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />

    <rs-card class="mt-4">
      <template #header>
        <div class="flex justify-between items-center">
          <h2 class="text-xl font-semibold">Maklumat Bantuan</h2>
          <div class="flex gap-2">
            <rs-button variant="primary-outline" @click="navigateBack">
              Kembali
            </rs-button>
          </div>
        </div>
      </template>

      <template #body>
        <!-- Basic Information Section -->
        <div class="space-y-6">
          <h3 class="text-lg font-medium">Maklumat Asas</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700">Nama Bantuan</label>
              <p class="mt-1 text-sm text-gray-900">{{ bantuanDetails.namaBantuan }}</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Kod Bantuan</label>
              <p class="mt-1 text-sm text-gray-900">{{ bantuanDetails.kodBantuan }}</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Aid Product</label>
              <p class="mt-1 text-sm text-gray-900">{{ bantuanDetails.aidProduct }}</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Product Package</label>
              <p class="mt-1 text-sm text-gray-900">{{ bantuanDetails.productPackage }}</p>
            </div>
            <div class="md:col-span-2">
              <label class="block text-sm font-medium text-gray-700">Keterangan Bantuan</label>
              <p class="mt-1 text-sm text-gray-900">{{ bantuanDetails.keteranganBantuan }}</p>
            </div>
          </div>
        </div>

        <!-- Configuration Section -->
        <div class="space-y-6 mt-8">
          <h3 class="text-lg font-medium">Konfigurasi</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700">Mod Siasatan</label>
              <p class="mt-1 text-sm text-gray-900">{{ bantuanDetails.modSiasatan ? 'Ya' : 'Tidak' }}</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Study Profile</label>
              <p class="mt-1 text-sm text-gray-900">{{ bantuanDetails.studyProfile ? 'Ya' : 'Tidak' }}</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Semakan Status Profil</label>
              <p class="mt-1 text-sm text-gray-900">{{ bantuanDetails.semakanStatusProfil ? 'Ya' : 'Tidak' }}</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Auto Renew Bantuan Berkala</label>
              <p class="mt-1 text-sm text-gray-900">{{ bantuanDetails.autoRenewBantuanBerkala ? 'Ya' : 'Tidak' }}</p>
            </div>
          </div>
        </div>

        <!-- Payment Section -->
        <div class="space-y-6 mt-8">
          <h3 class="text-lg font-medium">Maklumat Pembayaran</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700">Mod Pembayaran</label>
              <p class="mt-1 text-sm text-gray-900">{{ bantuanDetails.modPembayaran }}</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Mod Agihan</label>
              <p class="mt-1 text-sm text-gray-900">{{ bantuanDetails.modAgihan }}</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Kaedah Proses</label>
              <p class="mt-1 text-sm text-gray-900">{{ bantuanDetails.kaedahProses }}</p>
            </div>
          </div>
        </div>

        <!-- Frequency Section -->
        <div class="space-y-6 mt-8">
          <h3 class="text-lg font-medium">Frekuensi</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700">Frekuensi Permohonan</label>
              <p class="mt-1 text-sm text-gray-900">{{ bantuanDetails.frekuensiPermohonan }}</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Frekuensi Pembayaran</label>
              <p class="mt-1 text-sm text-gray-900">{{ bantuanDetails.frekuensiPembayaran }}</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Jenis Kekerapan Pembayaran</label>
              <p class="mt-1 text-sm text-gray-900">{{ bantuanDetails.jenisKekerapanPembayaran }}</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Tarikh Mula Pembayaran</label>
              <p class="mt-1 text-sm text-gray-900">{{ bantuanDetails.tarikhMulaPembayaran }}</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Tarikh Tamat Pembayaran</label>
              <p class="mt-1 text-sm text-gray-900">{{ bantuanDetails.tarikhTamatPembayaran }}</p>
            </div>
          </div>
        </div>

        <!-- Category & Type Section -->
        <div class="space-y-6 mt-8">
          <h3 class="text-lg font-medium">Kategori & Jenis Bantuan</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700">Kategori Bantuan</label>
              <p class="mt-1 text-sm text-gray-900">{{ bantuanDetails.kategoriBantuan }}</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Jenis Bantuan</label>
              <p class="mt-1 text-sm text-gray-900">{{ bantuanDetails.jenisBantuan }}</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Kadar Minimum</label>
              <p class="mt-1 text-sm text-gray-900">RM {{ bantuanDetails.kadarMinimum }}</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Kadar Maksimum</label>
              <p class="mt-1 text-sm text-gray-900">RM {{ bantuanDetails.kadarMaksimum }}</p>
            </div>
          </div>
        </div>

        <!-- Taklif Limit Section -->
        <div class="space-y-6 mt-8">
          <h3 class="text-lg font-medium">Penetapan Had Taklif</h3>
          <div class="grid grid-cols-1 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700">Had Maksimum Bantuan</label>
              <p class="mt-1 text-sm text-gray-900">RM {{ bantuanDetails.hadTaklif }}</p>
            </div>
          </div>
        </div>

        <!-- Active Period Section -->
        <div class="space-y-6 mt-8">
          <h3 class="text-lg font-medium">Tempoh Aktif Bantuan</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700">Tarikh Mula Aktif</label>
              <p class="mt-1 text-sm text-gray-900">{{ bantuanDetails.tarikhMulaAktif }}</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Tarikh Tamat Aktif</label>
              <p class="mt-1 text-sm text-gray-900">{{ bantuanDetails.tarikhTamatAktif }}</p>
            </div>
          </div>
        </div>

        <!-- Approval Actions -->
        <div class="mt-8 flex justify-end gap-4">
          <rs-button
            variant="danger"
            @click="rejectBantuan"
            :loading="isSubmitting"
          >
            <Icon name="material-symbols:close" class="mr-1" />
            Tolak
          </rs-button>
          <rs-button
            variant="success"
            @click="approveBantuan"
            :loading="isSubmitting"
          >
            <Icon name="material-symbols:check" class="mr-1" />
            Lulus
          </rs-button>
        </div>
      </template>
    </rs-card>

    <!-- Approval Modal -->
    <rs-modal
      v-model="showApprovalModal"
      :title="approvalAction === 'approve' ? 'Lulus Bantuan' : 'Tolak Bantuan'"
      size="md"
      position="center"
    >
      <template #body>
        <FormKit
          type="form"
          :actions="false"
          @submit="handleApprovalSubmit"
          v-model="approvalForm"
        >
          <FormKit
            type="textarea"
            name="remarks"
            :label="approvalAction === 'approve' ? 'Catatan Kelulusan' : 'Sebab Penolakan'"
            validation="required"
            :validation-messages="{
              required: approvalAction === 'approve' ? 'Catatan kelulusan adalah wajib' : 'Sebab penolakan adalah wajib'
            }"
            :placeholder="approvalAction === 'approve' 
              ? 'Sila masukkan catatan kelulusan' 
              : 'Sila nyatakan sebab penolakan bantuan ini'"
            :help="approvalAction === 'approve' 
              ? 'Masukkan sebarang catatan tambahan untuk kelulusan bantuan ini' 
              : 'Sila nyatakan dengan jelas sebab-sebab penolakan bantuan ini'"
            :rows="4"
          />
        </FormKit>
      </template>
      <template #footer>
        <div class="flex justify-end gap-2">
          <rs-button
            variant="primary-outline"
            @click="showApprovalModal = false"
          >
            Batal
          </rs-button>
          <rs-button
            :variant="approvalAction === 'approve' ? 'success' : 'danger'"
            @click="submitApproval"
            :loading="isSubmitting"
          >
            {{ approvalAction === 'approve' ? 'Lulus' : 'Tolak' }}
          </rs-button>
        </div>
      </template>
    </rs-modal>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useToast } from 'vue-toastification'
import { useRoute, useRouter } from 'vue-router'

definePageMeta({
  title: 'Maklumat Bantuan',
  description: 'Maklumat bantuan yang memerlukan kelulusan'
})

const route = useRoute()
const router = useRouter()
const toast = useToast()

// Breadcrumb
const breadcrumb = ref([
  {
    name: 'Pengurusan Bantuan',
    type: 'link',
    path: '/BF-BTN/KB/SB/01'
  },
  {
    name: 'Maklumat Bantuan',
    type: 'current',
    path: `/BF-BTN/KB/SB/04/${route.params.id}`
  }
])

// Bantuan Details
const bantuanDetails = ref({
  namaBantuan: '',
  kodBantuan: '',
  aidProduct: '',
  productPackage: '',
  keteranganBantuan: '',
  modSiasatan: false,
  studyProfile: false,
  semakanStatusProfil: false,
  autoRenewBantuanBerkala: false,
  autoHitBajet: false,
  tuntutan: false,
  autoCloseOutGL: false,
  modPembayaran: '',
  modAgihan: '',
  kaedahProses: '',
  frekuensiPermohonan: '',
  frekuensiPembayaran: '',
  jenisKekerapanPembayaran: '',
  tarikhMulaPembayaran: '',
  tarikhTamatPembayaran: '',
  kategoriBantuan: '',
  jenisBantuan: '',
  kadarMinimum: '',
  kadarMaksimum: '',
  hadTaklif: '',
  tarikhMulaAktif: '',
  tarikhTamatAktif: '',
  status: 'Menunggu Kelulusan'
})

// Approval Modal
const showApprovalModal = ref(false)
const approvalAction = ref('')
const approvalForm = ref({
  remarks: ''
})
const isSubmitting = ref(false)

// Methods
const navigateBack = () => {
  router.back()
}

const approveBantuan = () => {
  approvalAction.value = 'approve'
  showApprovalModal.value = true
}

const rejectBantuan = () => {
  approvalAction.value = 'reject'
  showApprovalModal.value = true
}

const submitApproval = async () => {
  if (!approvalForm.value.remarks) {
    toast.error('Sila masukkan catatan')
    return
  }

  isSubmitting.value = true

  try {
    // Implement API call here
    await new Promise(resolve => setTimeout(resolve, 1000)) // Mock API call

    toast.success(
      approvalAction.value === 'approve' 
        ? 'Bantuan berjaya diluluskan' 
        : 'Bantuan berjaya ditolak'
    )
    
    showApprovalModal.value = false
    approvalForm.value.remarks = ''
    
    // Navigate back to list
    router.push('/BF-BTN/KB/SB/01')
  } catch (error) {
    toast.error('Ralat telah berlaku')
  } finally {
    isSubmitting.value = false
  }
}

onMounted(async () => {
  try {
    // Implement API call to fetch bantuan details
    // For now using mock data
    bantuanDetails.value = {
      namaBantuan: 'Bantuan Kewangan Bulanan',
      kodBantuan: 'BKB-001',
      aidProduct: 'AID-001',
      productPackage: 'PKG-001',
      keteranganBantuan: 'Bantuan kewangan bulanan untuk asnaf',
      modSiasatan: true,
      studyProfile: true,
      semakanStatusProfil: true,
      autoRenewBantuanBerkala: true,
      autoHitBajet: true,
      tuntutan: true,
      autoCloseOutGL: true,
      modPembayaran: 'Bank',
      modAgihan: 'Individu',
      kaedahProses: 'Auto',
      frekuensiPermohonan: 'Berkala',
      frekuensiPembayaran: 'Berkala',
      jenisKekerapanPembayaran: 'Bulanan',
      tarikhMulaPembayaran: '2024-01-01',
      tarikhTamatPembayaran: '2024-12-31',
      kategoriBantuan: 'Sosial',
      jenisBantuan: 'Individu',
      kadarMinimum: '100',
      kadarMaksimum: '1000',
      hadTaklif: '500',
      tarikhMulaAktif: '2024-01-01',
      tarikhTamatAktif: '2024-12-31',
      status: 'Menunggu Kelulusan'
    }
  } catch (error) {
    toast.error('Ralat semasa memuatkan maklumat bantuan')
  }
})
</script>
