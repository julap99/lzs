<!-- 
  RTMF SCREEN: PA-KF-KK-01_04 (Create Category Form)
  PURPOSE: Tambah maklumat kategori penolong amil baharu
  DESCRIPTION: Create form for new Penolong Amil category (Eksekutif only)
  ROUTE: /BF-PA/KF/KK/create
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
            <p class="text-gray-600 mb-4">Hanya Eksekutif dibenarkan menambah kategori baharu.</p>
            <rs-button @click="navigateTo('/BF-PA/KF/KK')" variant="secondary">
              Kembali ke Senarai
            </rs-button>
          </div>
        </template>
      </rs-card>
    </div>

    <!-- Main Create Form (Eksekutif Only) -->
    <div v-else>
      <!-- Enhanced Header Section -->
      <div class="mb-6">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-2xl font-bold text-gray-900 flex items-center">
              <Icon name="ph:plus-circle" class="w-6 h-6 mr-3 text-primary" />
              Tambah Kategori Penolong Amil Baharu
            </h1>
            <p class="text-gray-600 mt-1">Cipta kategori baharu untuk sistem penolong amil</p>
          </div>
        </div>
      </div>

      <!-- Information Notice -->
      <rs-card class="mb-6" variant="info">
        <template #body>
          <div class="p-4">
            <div class="flex items-start">
              <Icon name="ph:info" class="w-5 h-5 text-blue-600 mr-3 mt-1" />
              <div class="flex-1">
                <h4 class="font-medium text-blue-900 mb-2">Maklumat Penting</h4>
                <ul class="text-sm text-blue-800 space-y-1">
                  <li>• Kategori baharu akan melalui proses kelulusan (Eksekutif → Ketua Jabatan → Ketua Divisyen)</li>
                  <li>• Status awal kategori adalah "Menunggu Pengesahan"</li>
                  <li>• Nama kategori dan kod singkatan boleh diubah selepas ini (berbeza dengan kategori asas)</li>
                  <li>• Pastikan kod singkatan adalah unik dan mudah difahami</li>
                </ul>
              </div>
            </div>
          </div>
        </template>
      </rs-card>

      <!-- Form -->
      <FormKit
        type="form"
        id="createCategoryForm"
        :actions="false"
        @submit="handleSubmit"
      >
        <!-- Maklumat Kategori Section -->
        <rs-card class="mb-6">
          <template #header>
            <h3 class="text-lg font-semibold text-gray-900 flex items-center">
              <Icon name="ph:tag" class="w-5 h-5 mr-2" />
              Maklumat Kategori Baharu
            </h3>
          </template>
          <template #body>
            <div class="p-6">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormKit
                  type="text"
                  name="kategoriPenolongAmil"
                  label="Kategori Penolong Amil"
                  placeholder="Contoh: Penolong Amil Wakaf"
                  validation="required|length:3,100"
                  :validation-messages="{
                    required: 'Kategori penolong amil diperlukan',
                    length: 'Kategori mestilah antara 3-100 aksara'
                  }"
                  help="Nama kategori yang akan dipaparkan dalam sistem"
                />
                <FormKit
                  type="text"
                  name="kodSingkatan"
                  label="Kod Singkatan"
                  placeholder="Contoh: PAW"
                  validation="required|length:2,10|matches:/^[A-Z0-9+]+$/"
                  :validation-messages="{
                    required: 'Kod singkatan diperlukan',
                    length: 'Kod mestilah antara 2-10 aksara',
                    matches: 'Kod hanya boleh mengandungi huruf besar, nombor dan simbol +'
                  }"
                  help="Kod unik untuk kategori (HURUF BESAR sahaja)"
                  @input="formatKodSingkatan"
                />
                <FormKit
                  type="select"
                  name="status"
                  label="Status Awal"
                  :options="[
                    { label: 'Menunggu Pengesahan', value: 'Menunggu Pengesahan' }
                  ]"
                  validation="required"
                  :validation-messages="{
                    required: 'Status diperlukan',
                  }"
                  value="Menunggu Pengesahan"
                  disabled
                  help="Status akan berubah selepas proses kelulusan"
                />
                <FormKit
                  type="date"
                  name="tarikhKuatkuasa"
                  label="Tarikh Kuatkuasa"
                  disabled
                  value=""
                  help="Akan ditetapkan selepas kelulusan"
                />
                <div class="md:col-span-2">
                  <FormKit
                    type="textarea"
                    name="penerangan"
                    label="Penerangan Kategori"
                    placeholder="Huraian ringkas tentang tujuan dan skop kategori ini..."
                    rows="4"
                    validation="required|length:10,500"
                    :validation-messages="{
                      required: 'Penerangan kategori diperlukan',
                      length: 'Penerangan mestilah antara 10-500 aksara'
                    }"
                    help="Penerangan yang jelas akan memudahkan proses kelulusan"
                  />
                </div>
              </div>
            </div>
          </template>
        </rs-card>

        <!-- Action Buttons -->
        <div class="flex justify-between mb-6">
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
            <Icon name="ph:plus" class="w-4 h-4 mr-2" />
            Cipta Kategori
          </rs-button>
        </div>
      </FormKit>
    </div>

    <!-- Confirmation Modal (Eksekutif Sokongan) -->
    <div v-if="showConfirmModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <div class="flex items-center mb-4">
          <Icon name="ph:question" class="w-6 h-6 text-primary mr-3" />
          <h3 class="text-lg font-semibold">Pengesahan Sokongan</h3>
        </div>
        
        <p class="text-gray-600 mb-4">
          Adakah anda pasti untuk menyokong cipta kategori baharu ini? 
          Tindakan ini akan menghantar kategori untuk pengesahan.
        </p>

        <div class="mb-4 p-3 bg-gray-50 rounded-lg">
          <h4 class="font-medium text-gray-900 mb-2">Ringkasan Kategori:</h4>
          <div class="text-sm text-gray-700 space-y-1">
            <p><span class="font-medium">Kategori:</span> {{ pendingFormData?.kategoriPenolongAmil }}</p>
            <p><span class="font-medium">Kod:</span> {{ pendingFormData?.kodSingkatan }}</p>
            <p><span class="font-medium">Penerangan:</span> {{ pendingFormData?.penerangan?.substring(0, 100) }}{{ pendingFormData?.penerangan?.length > 100 ? '...' : '' }}</p>
          </div>
        </div>

        <div class="mb-4">
          <FormKit
            type="textarea"
            v-model="confirmationData.ulasanSokongan"
            label="Ulasan Sokongan"
            placeholder="Masukkan justifikasi untuk kategori baharu ini..."
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
import { useToast } from 'vue-toastification'

definePageMeta({
  middleware: ['auth']
})

const toast = useToast()

// Current role (from global state/store)
const currentRole = ref('eksekutif') // Mock - should come from actual auth state

// Breadcrumb
const breadcrumb = [
  { label: 'Laman Utama', to: '/' },
  { label: 'Modul BF-PA', to: '/BF-PA' },
  { label: 'Konfigurasi', to: '/BF-PA/KF' },
  { label: 'Maklumat Kategori', to: '/BF-PA/KF/KK' },
  { label: 'Tambah Baharu', to: null }
]

// Confirmation modal state
const showConfirmModal = ref(false)
const pendingFormData = ref(null)
const confirmationData = ref({
  ulasanSokongan: '',
  namaPenyokong: 'Ahmad Nazri bin Abdullah', // Mock - should come from auth
  tarikhSokongan: new Date().toISOString().split('T')[0] // Current date
})

// Utility function to format kod singkatan
const formatKodSingkatan = (event) => {
  // Auto-uppercase the input
  if (event.target) {
    event.target.value = event.target.value.toUpperCase()
  }
}

// Form submission (show confirmation modal first)
const handleSubmit = async (formData) => {
  pendingFormData.value = formData
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
    // Generate unique reference number
    const currentYear = new Date().getFullYear()
    const timestamp = Date.now().toString().slice(-3)
    const rujukan = `KK-${currentYear}-${timestamp}`
    
    // Simulate API call with sokongan data
    const submissionData = {
      ...pendingFormData.value,
      rujukan: rujukan,
      status: 'Menunggu Pengesahan',
      tarikhKuatkuasa: '', // Will be set after approval
      isDefault: false, // Custom category
      tindakan: Date.now(), // Unique identifier for actions
      ulasanSokongan: confirmationData.value.ulasanSokongan,
      namaPenyokong: confirmationData.value.namaPenyokong,
      tarikhSokongan: confirmationData.value.tarikhSokongan,
      maklumatPegawai: {
        diciptaOleh: confirmationData.value.namaPenyokong,
        tarikhCipta: new Date().toISOString().split('T')[0],
        dikemaskiniBoleh: '',
        tarikhKemaskini: '',
        disahkanOleh: '',
        tarikhPengesahan: '',
        diluluskanOleh: '',
        tarikhKelulusan: ''
      }
    }
    
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    showConfirmModal.value = false
    toast.success('Kategori baharu berjaya dicipta dan dihantar untuk pengesahan')
    
    // Navigate back to list
    await navigateTo('/BF-PA/KF/KK')
  } catch (error) {
    toast.error('Ralat semasa mencipta kategori baharu')
    // Error creating category
  }
}

onMounted(() => {
  // Initialize form or fetch any required data
  // Create category page loaded
})
</script> 