<!-- 
  RTMF SCREEN: PA-KF-KK-01_03 (Edit Form)
  PURPOSE: Kemaskini maklumat kategori penolong amil
  DESCRIPTION: Edit form for existing Penolong Amil category (Eksekutif only)
  ROUTE: /BF-PA/KF/KK/edit/[id]
-->
<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />

    <!-- Role-Based Access Control -->
    <div v-if="currentRole !== 'eksekutif'" class="mb-6">
      <rs-card variant="warning">
        <template #body>
          <div class="p-4 text-center">
            <Icon name="ph:warning-circle" class="w-8 h-8 mx-auto text-warning mb-2" />
            <h3 class="text-lg font-semibold text-warning mb-2">Akses Tidak Dibenarkan</h3>
            <p class="text-gray-600 mb-4">Hanya Eksekutif dibenarkan mengemaskini maklumat kategori.</p>
            <rs-button @click="navigateTo('/BF-PA/KF/KK')" variant="secondary">
              Kembali ke Senarai
            </rs-button>
          </div>
        </template>
      </rs-card>
    </div>

    <!-- Main Edit Form (Eksekutif Only) -->
    <div v-else>
      <!-- Enhanced Header Section -->
      <div class="mb-6">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-2xl font-bold text-gray-900">
              Kemaskini Kategori Penolong Amil
            </h1>
            <p class="text-gray-600 mt-1">
              Kemaskini maklumat untuk kategori: 
              <span class="font-medium text-gray-800">{{ formData.kategoriPenolongAmil || 'Loading...' }}</span>
              <rs-badge v-if="formData.isDefault" variant="info" size="sm" class="ml-2">Kategori Asas</rs-badge>
            </p>
          </div>
        </div>
      </div>

      <!-- Form -->
      <FormKit
        type="form"
        id="editCategoryForm"
        :actions="false"
        @submit="handleSubmit"
      >
        <!-- Maklumat Kategori Section -->
        <rs-card class="mb-6">
          <template #header>
            <div class="flex items-center justify-between">
              <h3 class="text-lg font-semibold text-gray-900">
                Kemaskini Maklumat Kategori
              </h3>
              <div v-if="formData.isDefault" class="text-sm text-blue-600 flex items-center">
                <Icon name="ph:shield-check" class="w-4 h-4 mr-1" />
                Kategori Asas (Nama & Kod Dilindungi)
              </div>
            </div>
          </template>
          
          <template #body>
            <div class="p-6">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormKit
                  type="text"
                  name="kategoriPenolongAmil"
                  label="Kategori Penolong Amil"
                  placeholder="Contoh: Penolong Amil Wakaf"
                  validation="required"
                  :validation-messages="{
                    required: 'Kategori penolong amil diperlukan',
                  }"
                  :value="formData.kategoriPenolongAmil"
                  :disabled="formData.isDefault"
                  :help="formData.isDefault ? 'Nama kategori asas tidak boleh diubah' : ''"
                />
                <FormKit
                  type="text"
                  name="kodSingkatan"
                  label="Kod Singkatan"
                  placeholder="Contoh: PAW"
                  validation="required"
                  :validation-messages="{
                    required: 'Kod singkatan diperlukan',
                  }"
                  :value="formData.kodSingkatan"
                  :disabled="formData.isDefault"
                  :help="formData.isDefault ? 'Kod singkatan kategori asas tidak boleh diubah' : ''"
                />
                <FormKit
                  type="select"
                  name="status"
                  label="Status"
                  :options="statusOptions"
                  validation="required"
                  :validation-messages="{
                    required: 'Status diperlukan',
                  }"
                  :value="formData.status"
                  help="Status akan berubah kepada 'Menunggu Pengesahan' selepas kemaskini"
                />
                <FormKit
                  type="date"
                  name="tarikhKuatkuasa"
                  label="Tarikh Kuatkuasa"
                  :value="convertToHTMLDateInput(formData.tarikhKuatkuasa)"
                  disabled
                  help="Akan ditetapkan selepas kelulusan"
                />
                <div class="md:col-span-2">
                  <FormKit
                    type="textarea"
                    name="penerangan"
                    label="Penerangan Kategori"
                    placeholder="Huraian ringkas tentang kategori ini..."
                    rows="3"
                    validation="required"
                    :validation-messages="{
                      required: 'Penerangan kategori diperlukan',
                    }"
                    :value="formData.penerangan"
                  />
                </div>
              </div>
            </div>
          </template>
        </rs-card>

        <!-- Action Buttons -->
        <div class="flex justify-between items-center mt-8 pt-6 border-t border-gray-200">
          <rs-button
            variant="secondary-outline"
            @click="navigateTo('/BF-PA/KF/KK')"
            class="flex items-center"
          >
            <Icon name="ph:arrow-left" class="w-4 h-4 mr-2" />
            Kembali
          </rs-button>
          
          <rs-button
            type="submit"
            variant="primary"
            class="flex items-center"
          >
            <Icon name="ph:floppy-disk" class="w-4 h-4 mr-2" />
            Simpan Perubahan
          </rs-button>
        </div>
      </FormKit>
    </div>

    <!-- Jejak Audit (Read-Only Reference Section) -->
    <rs-card class="mt-8 bg-gray-50 border-gray-300">
      <template #header>
        <div class="bg-gray-100 border-b border-gray-300 px-6 py-4">
          <h3 class="text-lg font-medium text-gray-600 flex items-center">
            <Icon name="ph:clock-clockwise" class="w-5 h-5 mr-2 text-gray-500" />
            Jejak Audit
          </h3>
          <p class="text-sm text-gray-500 mt-1">Maklumat rujukan sahaja</p>
        </div>
      </template>
      <template #body>
        <div class="p-6 bg-gray-50">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-500 mb-2">Dicipta Oleh</label>
              <div class="px-3 py-2 bg-gray-100 border border-gray-200 rounded-md text-gray-600">
                {{ formData.maklumatPegawai.diciptaOleh }}
              </div>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-500 mb-2">Tarikh Cipta</label>
              <div class="px-3 py-2 bg-gray-100 border border-gray-200 rounded-md text-gray-600">
                {{ formatDate(formData.maklumatPegawai.tarikhCipta) }}
              </div>
            </div>
            <div v-if="formData.maklumatPegawai.dikemaskiniBoleh">
              <label class="block text-sm font-medium text-gray-500 mb-2">Dikemaskini Oleh</label>
              <div class="px-3 py-2 bg-gray-100 border border-gray-200 rounded-md text-gray-600">
                {{ formData.maklumatPegawai.dikemaskiniBoleh }}
              </div>
            </div>
            <div v-if="formData.maklumatPegawai.tarikhKemaskini">
              <label class="block text-sm font-medium text-gray-500 mb-2">Tarikh Kemaskini</label>
              <div class="px-3 py-2 bg-gray-100 border border-gray-200 rounded-md text-gray-600">
                {{ formatDate(formData.maklumatPegawai.tarikhKemaskini) }}
              </div>
            </div>
            <div v-if="formData.maklumatPegawai.disahkanOleh">
              <label class="block text-sm font-medium text-gray-500 mb-2">Disahkan Oleh</label>
              <div class="px-3 py-2 bg-gray-100 border border-gray-200 rounded-md text-gray-600">
                {{ formData.maklumatPegawai.disahkanOleh }}
              </div>
            </div>
            <div v-if="formData.maklumatPegawai.tarikhPengesahan">
              <label class="block text-sm font-medium text-gray-500 mb-2">Tarikh Pengesahan</label>
              <div class="px-3 py-2 bg-gray-100 border border-gray-200 rounded-md text-gray-600">
                {{ formatDate(formData.maklumatPegawai.tarikhPengesahan) }}
              </div>
            </div>
            <div v-if="formData.maklumatPegawai.diluluskanOleh">
              <label class="block text-sm font-medium text-gray-500 mb-2">Diluluskan Oleh</label>
              <div class="px-3 py-2 bg-gray-100 border border-gray-200 rounded-md text-gray-600">
                {{ formData.maklumatPegawai.diluluskanOleh }}
              </div>
            </div>
            <div v-if="formData.maklumatPegawai.tarikhKelulusan">
              <label class="block text-sm font-medium text-gray-500 mb-2">Tarikh Kelulusan</label>
              <div class="px-3 py-2 bg-gray-100 border border-gray-200 rounded-md text-gray-600">
                {{ formatDate(formData.maklumatPegawai.tarikhKelulusan) }}
              </div>
            </div>
          </div>
        </div>
      </template>
    </rs-card>

    <!-- Confirmation Modal (Eksekutif Sokongan) -->
    <div v-if="showConfirmModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <div class="flex items-center mb-4">
          <Icon name="ph:question" class="w-6 h-6 text-primary mr-3" />
          <h3 class="text-lg font-semibold">Pengesahan Sokongan</h3>
        </div>
        
        <p class="text-gray-600 mb-4">
          Adakah anda pasti untuk menyokong perubahan pada kategori ini? 
          Tindakan ini akan menghantar perubahan untuk pengesahan.
        </p>

        <div class="mb-4">
          <FormKit
            type="textarea"
            v-model="confirmationData.ulasanSokongan"
            label="Ulasan Sokongan"
            placeholder="Masukkan ulasan atau justifikasi untuk perubahan ini..."
            rows="3"
            validation="required"
            :validation-messages="{
              required: 'Ulasan sokongan diperlukan',
            }"
          />
        </div>

        <div class="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Nama Penyokong</label>
            <div class="text-sm text-gray-900 bg-gray-50 px-3 py-2 rounded-md">
              {{ confirmationData.namaPenyokong }}
            </div>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Tarikh Sokongan</label>
            <div class="text-sm text-gray-900 bg-gray-50 px-3 py-2 rounded-md">
              {{ confirmationData.tarikhSokongan }}
            </div>
          </div>
        </div>

        <div class="flex justify-end space-x-3">
          <rs-button
            variant="secondary-outline"
            @click="cancelSubmit"
          >
            Batal
          </rs-button>
          <rs-button
            variant="primary"
            @click="confirmSubmit"
            :disabled="!confirmationData.ulasanSokongan"
          >
            <Icon name="ph:check" class="w-4 h-4 mr-2" />
            Sokong & Hantar
          </rs-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'nuxt/app'
import { useToast } from 'vue-toastification'
import { formatDate } from '~/utils/dateFormatter'

definePageMeta({
  middleware: ['auth']
})

const route = useRoute()
const toast = useToast()

// Current role (from global state/store)
const currentRole = ref('eksekutif') // Mock - should come from actual auth state

// Breadcrumb
const breadcrumb = [
  { name: 'Laman Utama', path: '/' },
  { name: 'Modul BF-PA', path: '/BF-PA' },
  { name: 'Konfigurasi', path: '/BF-PA/KF' },
  { name: 'Maklumat Kategori', path: '/BF-PA/KF/KK' },
  { name: 'Kemaskini', path: null }
]

// Status options for the form
const statusOptions = [
  { label: 'Aktif', value: 'Aktif' },
  { label: 'Tidak Aktif', value: 'Tidak Aktif' }
]

// Form data - for editing ONE specific kategori
const formData = ref({
  kategoriPenolongAmil: '',
  kodSingkatan: '',
  status: 'Aktif',
  tarikhKuatkuasa: '',
  penerangan: '',
  isDefault: false,
  maklumatPegawai: {
    diciptaOleh: '',
    tarikhCipta: '',
    dikemaskiniBoleh: '',
    tarikhKemaskini: '',
    disahkanOleh: '',
    tarikhPengesahan: '',
    diluluskanOleh: '',
    tarikhKelulusan: ''
  }
})

// Confirmation modal state
const showConfirmModal = ref(false)
const pendingFormData = ref(null)
const confirmationData = ref({
  ulasanSokongan: '',
  namaPenyokong: 'Ahmad Nazri bin Abdullah', // Mock - should come from auth
  tarikhSokongan: new Date().toISOString().split('T')[0] // Current date
})

// Utility function for date conversion
const convertToHTMLDateInput = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toISOString().split('T')[0]
}

// Form submission (show confirmation modal first)
const handleSubmit = async (formDataSubmitted) => {
  pendingFormData.value = formDataSubmitted
  showConfirmModal.value = true
}

// Cancel confirmation
const cancelSubmit = () => {
  showConfirmModal.value = false
  pendingFormData.value = null
  confirmationData.value.ulasanSokongan = ''
}

// Confirm and proceed with submission
const confirmSubmit = async () => {
  try {
    // Simulate API call with sokongan data
    const submissionData = {
      ...pendingFormData.value,
      status: 'Menunggu Pengesahan', // Always set to pending after edit
      ulasanSokongan: confirmationData.value.ulasanSokongan,
      namaPenyokong: confirmationData.value.namaPenyokong,
      tarikhSokongan: confirmationData.value.tarikhSokongan,
      maklumatPegawai: {
        ...formData.value.maklumatPegawai,
        dikemaskiniBoleh: confirmationData.value.namaPenyokong,
        tarikhKemaskini: new Date().toISOString().split('T')[0]
      }
    }
    
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    showConfirmModal.value = false
    toast.success('Kategori berjaya dikemaskini dan dihantar untuk pengesahan')
    
    // Navigate back to list
    await navigateTo('/BF-PA/KF/KK')
  } catch (error) {
    toast.error('Ralat semasa mengemaskini kategori')
    // Error updating category
  }
}

// Load data on mount
onMounted(async () => {
  const categoryId = route.params.id
  
  try {
    // Simulate API call to get category data
    await new Promise(resolve => setTimeout(resolve, 500))
    
    // Mock data based on category ID to test different scenarios
    const categoryMockData = {
      1: { // PAF - Fixed category
        kategoriPenolongAmil: 'Penolong Amil Fitrah',
        kodSingkatan: 'PAF',
        status: 'Aktif',
        tarikhKuatkuasa: '01-01-2024',
        penerangan: 'Kategori untuk menguruskan penolong amil dalam kutipan dan pengagihan zakat fitrah',
        isDefault: true
      },
      2: { // PAP - Fixed category  
        kategoriPenolongAmil: 'Penolong Amil Padi',
        kodSingkatan: 'PAP',
        status: 'Aktif',
        tarikhKuatkuasa: '01-01-2024',
        penerangan: 'Kategori untuk menguruskan penolong amil dalam kutipan dan pengagihan zakat padi',
        isDefault: true
      },
      3: { // PAK - Fixed category
        kategoriPenolongAmil: 'Penolong Amil Kariah',
        kodSingkatan: 'PAK',
        status: 'Aktif',
        tarikhKuatkuasa: '01-01-2024',
        penerangan: 'Kategori untuk menguruskan penolong amil di peringkat kariah tempatan',
        isDefault: true
      },
      4: { // PK+ - Fixed category
        kategoriPenolongAmil: 'Penolong Amil Komuniti',
        kodSingkatan: 'PK+',
        status: 'Aktif',
        tarikhKuatkuasa: '01-01-2024',
        penerangan: 'Kategori untuk menguruskan penolong amil yang berkhidmat dalam komuniti tertentu',
        isDefault: true
      },
      5: { // Custom category
        kategoriPenolongAmil: 'Penolong Amil Wakaf',
        kodSingkatan: 'PAW',
        status: 'Menunggu Kelulusan',
        tarikhKuatkuasa: '01-01-2025',
        penerangan: 'Kategori untuk menguruskan penolong amil yang mengendalikan urusan wakaf',
        isDefault: false
      }
    }
    
    const selectedCategory = categoryMockData[categoryId] || categoryMockData[5]
    
    formData.value = {
      ...selectedCategory,
      maklumatPegawai: {
        diciptaOleh: 'Ahmad Nazri bin Abdullah',
        tarikhCipta: '15-10-2023',
        dikemaskiniBoleh: 'Siti Aminah binti Hassan',
        tarikhKemaskini: '22-11-2023',
        disahkanOleh: 'Dr. Muhammad Farid bin Ahmad',
        tarikhPengesahan: '25-11-2023',
        diluluskanOleh: 'Datuk Seri Wan Ahmad bin Wan Omar',
        tarikhKelulusan: '30-11-2023'
      }
    }
  } catch (error) {
    toast.error('Ralat semasa memuat data kategori')
    // Error loading category data
  }
})
</script> 