<!-- 
  RTMF SCREEN: PA-KF-KE-01_03 (Edit Form)
  PURPOSE: Kemaskini maklumat elaun penolong amil
  DESCRIPTION: Edit form for existing Penolong Amil allowance with table-based interface (Eksekutif only)
  ROUTE: /BF-PA/KF/KE/edit/[id]
-->
<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />

    <!-- Enhanced Header Section -->
    <div class="mb-6">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold text-gray-900 flex items-center">
            <Icon name="ph:pencil" class="w-6 h-6 mr-3 text-primary" />
            Kemaskini Elaun Penolong Amil
          </h1>
          <p class="text-gray-600 mt-1">Kemaskini maklumat elaun untuk kategori: <span class="font-medium text-gray-800">{{ formData.kategoriPenolongAmil || 'Loading...' }}</span></p>
        </div>
      </div>
    </div>

    <!-- Form -->
    <FormKit
      type="form"
      id="editAllowanceForm"
      :actions="false"
      @submit="handleSubmit"
    >
      <!-- Maklumat Elaun Section -->
      <rs-card class="mb-6">
        <template #header>
          <h3 class="text-lg font-semibold text-gray-900">Maklumat Elaun</h3>
        </template>
        <template #body>
          <div class="p-6">
            <!-- Header -->
            <div class="mb-4">
              <h4 class="text-lg font-semibold text-gray-900">Elaun dalam Kategori</h4>
            </div>
            
            <!-- Table for Elaun -->
            <div class="overflow-x-auto">
              <table class="min-w-full divide-y divide-gray-200 border border-gray-200 rounded-lg">
                <thead class="bg-gray-50">
                  <tr>
                    <th class="p-3 border text-left text-sm font-medium text-gray-700">Jenis Elaun</th>
                    <th class="p-3 border text-left text-sm font-medium text-gray-700">Amaun</th>
                    <th class="p-3 border text-left text-sm font-medium text-gray-700">Kod Bajet</th>
                    <th class="p-3 border text-left text-sm font-medium text-gray-700">Status</th>
                    <th class="p-3 border text-left text-sm font-medium text-gray-700">Tarikh Kuatkuasa</th>
                    <th class="p-3 border text-left text-sm font-medium text-gray-700">Tindakan</th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                  <tr v-for="(elaun, index) in formData.maklumatElaun" :key="index">
                    <td class="p-3 border">
                      <input 
                        v-model="elaun.jenis" 
                        class="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Contoh: Bancian Baru: Per Borang Permohonan"
                      />
                    </td>
                    <td class="p-3 border">
                      <input 
                        type="text" 
                        v-model="elaun.amaun" 
                        class="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="0"
                      />
                    </td>
                    <td class="p-3 border">
                      <input 
                        v-model="elaun.kod" 
                        class="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Contoh: B34106"
                      />
                    </td>
                    <td class="p-3 border">
                      <div v-if="!elaun.tarikh" class="w-full px-2 py-1 bg-gray-50 border border-gray-300 rounded text-gray-600 text-sm">
                        TIDAK AKTIF
                      </div>
                      <select 
                        v-else
                        v-model="elaun.status" 
                        class="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="AKTIF">AKTIF</option>
                        <option value="TIDAK AKTIF">TIDAK AKTIF</option>
                      </select>
                    </td>
                    <td class="p-3 border">
                      <div class="w-full px-2 py-1 bg-gray-50 border border-gray-300 rounded text-gray-600 text-sm">
                        {{ elaun.tarikh ? formatDate(elaun.tarikh) : 'Akan ditetapkan selepas kelulusan' }}
                      </div>
                    </td>
                    <td class="p-3 border">
                      <rs-button 
                        variant="danger" 
                        size="sm" 
                        @click="hapusElaun(index)"
                      >
                        <Icon name="ph:trash" class="w-4 h-4" />
                      </rs-button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            
            <!-- Add New Elaun Button -->
            <div class="mt-4 flex justify-end">
              <rs-button 
                variant="success" 
                size="sm" 
                @click="tambahElaun"
                class="flex items-center"
                title="Tambah Elaun Baru"
              >
                <Icon name="ph:plus" class="w-4 h-4" />
              </rs-button>
            </div>

            <!-- Elaun Khas Section -->
            <div class="mt-8">
              <!-- Header -->
              <div class="mb-4">
                <h4 class="text-lg font-semibold text-gray-900">Elaun Khas</h4>
              </div>
              
              <!-- Table for Elaun Khas -->
              <div class="overflow-x-auto">
                <table class="min-w-full divide-y divide-gray-200 border border-gray-200 rounded-lg">
                  <thead class="bg-gray-50">
                    <tr>
                      <th class="p-3 border text-left text-sm font-medium text-gray-700">Jenis Elaun</th>
                      <th class="p-3 border text-left text-sm font-medium text-gray-700">Kategori PA</th>
                      <th class="p-3 border text-left text-sm font-medium text-gray-700">Amaun</th>
                      <th class="p-3 border text-left text-sm font-medium text-gray-700">Kod Bajet</th>
                      <th class="p-3 border text-left text-sm font-medium text-gray-700">Status</th>
                      <th class="p-3 border text-left text-sm font-medium text-gray-700">Tarikh Kuatkuasa</th>
                      <th class="p-3 border text-left text-sm font-medium text-gray-700">Target KPI</th>
                      <th class="p-3 border text-left text-sm font-medium text-gray-700">Tindakan</th>
                    </tr>
                  </thead>
                  <tbody class="bg-white divide-y divide-gray-200">
                    <tr v-for="(elaunKhas, index) in formData.maklumatElaunKhas" :key="index">
                      <td class="p-3 border">
                        <input 
                          v-model="elaunKhas.jenis" 
                          class="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Contoh: KHAS - 48 AKTIVITI/TAHUN"
                        />
                      </td>
                      <td class="p-3 border">
                        <input 
                          v-model="elaunKhas.kategoriPA" 
                          class="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Contoh: PAK+"
                        />
                      </td>
                      <td class="p-3 border">
                        <input 
                          type="number" 
                          v-model="elaunKhas.amaun" 
                          class="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="0"
                        />
                      </td>
                      <td class="p-3 border">
                        <input 
                          v-model="elaunKhas.kod" 
                          class="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Contoh: B31702"
                        />
                      </td>
                      <td class="p-3 border">
                        <div v-if="!elaunKhas.tarikh" class="w-full px-2 py-1 bg-gray-50 border border-gray-300 rounded text-gray-600 text-sm">
                          TIDAK AKTIF
                        </div>
                        <select 
                          v-else
                          v-model="elaunKhas.status" 
                          class="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="AKTIF">AKTIF</option>
                          <option value="TIDAK AKTIF">TIDAK AKTIF</option>
                        </select>
                      </td>
                      <td class="p-3 border">
                        <div class="w-full px-2 py-1 bg-gray-50 border border-gray-300 rounded text-gray-600 text-sm">
                          {{ elaunKhas.tarikh ? formatDate(elaunKhas.tarikh) : 'Akan ditetapkan selepas kelulusan' }}
                        </div>
                      </td>
                      <td class="p-3 border">
                        <input 
                          type="number"
                          v-model="elaunKhas.targetKPI" 
                          class="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="48"
                        />
                      </td>
                      <td class="p-3 border">
                        <rs-button 
                          variant="danger" 
                          size="sm" 
                          @click="hapusElaunKhas(index)"
                        >
                          <Icon name="ph:trash" class="w-4 h-4" />
                        </rs-button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              
              <!-- Add New Elaun Khas Button -->
              <div class="mt-4 flex justify-end">
                <rs-button 
                  variant="success" 
                  size="sm" 
                  @click="tambahElaunKhas"
                  class="flex items-center"
                  title="Tambah Elaun Khas Baru"
                >
                  <Icon name="ph:plus" class="w-4 h-4" />
                </rs-button>
              </div>
            </div>
          </div>
        </template>
      </rs-card>

      <!-- Action Buttons -->
      <div class="mt-6 flex justify-between items-center">
        <rs-button
          variant="secondary-outline"
          @click="navigateTo('/BF-PA/KF/KE')"
          class="flex items-center"
        >
          <Icon name="ph:arrow-left" class="w-4 h-4 mr-2" />
          Kembali
        </rs-button>
        <rs-button
          variant="primary"
          class="flex items-center"
          @click="showConfirmationModal = true"
        >
          <Icon name="ph:check" class="w-4 h-4 mr-2" />
          Simpan Perubahan
        </rs-button>
      </div>
    </FormKit>

    <!-- Jejak Audit (Disabled)
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
              <label class="block text-sm font-medium text-gray-500 mb-1">Dicipta Oleh</label>
              <div class="text-sm text-gray-600 bg-gray-100 px-3 py-2 rounded-md border border-gray-200">
                {{ formData.maklumatPegawai.diciptaOleh }}
              </div>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-500 mb-1">Tarikh Cipta</label>
              <div class="text-sm text-gray-600 bg-gray-100 px-3 py-2 rounded-md border border-gray-200">
                {{ formatDate(formData.maklumatPegawai.tarikhCipta) }}
              </div>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-500 mb-1">Dikemaskini Oleh</label>
              <div class="text-sm text-gray-600 bg-gray-100 px-3 py-2 rounded-md border border-gray-200">
                {{ formData.maklumatPegawai.dikemaskiniBoleh || 'Belum dikemaskini' }}
              </div>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-500 mb-1">Tarikh Kemaskini</label>
              <div class="text-sm text-gray-600 bg-gray-100 px-3 py-2 rounded-md border border-gray-200">
                {{ formData.maklumatPegawai.tarikhKemaskini ? formatDate(formData.maklumatPegawai.tarikhKemaskini) : 'Belum dikemaskini' }}
              </div>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-500 mb-1">Disahkan Oleh</label>
              <div class="text-sm text-gray-600 bg-gray-100 px-3 py-2 rounded-md border border-gray-200">
                {{ formData.maklumatPegawai.disahkanOleh || 'Belum disahkan' }}
              </div>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-500 mb-1">Tarikh Pengesahan</label>
              <div class="text-sm text-gray-600 bg-gray-100 px-3 py-2 rounded-md border border-gray-200">
                {{ formData.maklumatPegawai.tarikhPengesahan ? formatDate(formData.maklumatPegawai.tarikhPengesahan) : 'Belum disahkan' }}
              </div>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-500 mb-1">Diluluskan Oleh</label>
              <div class="text-sm text-gray-600 bg-gray-100 px-3 py-2 rounded-md border border-gray-200">
                {{ formData.maklumatPegawai.diluluskanOleh || 'Belum diluluskan' }}
              </div>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-500 mb-1">Tarikh Kelulusan</label>
              <div class="text-sm text-gray-600 bg-gray-100 px-3 py-2 rounded-md border border-gray-200">
                {{ formData.maklumatPegawai.tarikhKelulusan ? formatDate(formData.maklumatPegawai.tarikhKelulusan) : 'Belum diluluskan' }}
              </div>
            </div>
          </div>
        </div>
      </template>
    </rs-card>
    -->
    
    <!-- Confirmation Modal for Eksekutif -->
    <div v-if="showConfirmationModal" class="fixed inset-0 z-50 overflow-y-auto">
      <div class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div class="fixed inset-0 transition-opacity" aria-hidden="true">
          <div class="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>

        <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div class="sm:flex sm:items-start">
              <div class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 sm:mx-0 sm:h-10 sm:w-10">
                <Icon name="ph:check-circle" class="h-6 w-6 text-blue-600" />
              </div>
              <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                <h3 class="text-lg leading-6 font-medium text-gray-900">
                  Pengesahan Sokongan
                </h3>
                <div class="mt-4">
                  <p class="text-sm text-gray-500 mb-4">
                    Anda akan menyokong perubahan ini dan menghantar untuk pengesahan oleh Ketua Jabatan. Sila berikan ulasan mengenai perubahan yang dibuat.
                  </p>
                  
                  <div class="mb-4">
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                      Ulasan Sokongan <span class="text-red-500">*</span>
                    </label>
                    <textarea
                      v-model="confirmationData.ulasan"
                      rows="4"
                      class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Sila nyatakan alasan atau ulasan mengenai perubahan yang dibuat..."
                      required
                    ></textarea>
                  </div>

                  <div class="mb-4">
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                      Nama
                    </label>
                    <div class="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md text-gray-900">
                      {{ confirmationData.namaPenyokong }}
                    </div>
                  </div>

                  <div class="mb-4">
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                      Tarikh
                    </label>
                    <div class="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md text-gray-900">
                      {{ formatDate(confirmationData.tarikhSokongan) }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <rs-button
              variant="primary"
              class="w-full sm:w-auto sm:ml-3"
              @click="confirmSokongan"
              :disabled="!confirmationData.ulasan.trim()"
            >
              <Icon name="ph:check" class="w-4 h-4 mr-2" />
              Ya, Sokong Perubahan
            </rs-button>
            <rs-button
              variant="secondary-outline"
              class="mt-3 w-full sm:mt-0 sm:w-auto"
              @click="showConfirmationModal = false"
            >
              Batal
            </rs-button>
          </div>
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

// Page metadata
definePageMeta({
  layout: 'default',
  middleware: ['auth']
})

// Composables
const route = useRoute()
const toast = useToast()

// Confirmation modal state
const showConfirmationModal = ref(false)
const confirmationData = ref({
  ulasan: '',
  namaPenyokong: 'Ahmad Bin Abdullah', // Mock current user name
  tarikhSokongan: new Date().toISOString().split('T')[0] // Current date
})

// Breadcrumb
const breadcrumb = [
  { name: 'Laman Utama', path: '/' },
  { name: 'Modul BF-PA', path: '/BF-PA' },
  { name: 'Konfigurasi', path: '/BF-PA/KF' },
  { name: 'Maklumat Elaun', path: '/BF-PA/KF/KE' },
  { name: 'Kemaskini', path: null }
]

// Form data - using exact structure from KF/KJ
const formData = ref({
  kategoriPenolongAmil: '',
  maklumatElaun: [
    {
      jenis: 'Elaun Bancian Baru : per borang permohonan',
      amaun: 30,
      kod: 'B34106',
      status: 'AKTIF',
      tarikh: '2025-01-01'
    },
    {
      jenis: 'Elaun Kemaskini/permohonan bantuan : per borang',
      amaun: 20,
      kod: 'B34106',
      status: 'AKTIF',
      tarikh: '2025-01-01'
    },
    {
      jenis: 'Elaun Tahunan KPAK',
      amaun: 500,
      kod: 'B34107',
      status: 'AKTIF',
      tarikh: '2025-01-01'
    },
    {
      jenis: 'Ketua Penolong Amil Fitrah (KPAF) terbaik,',
      amaun: 450-700,
      kod: 'B34108',
      status: 'TIDAK AKTIF',
      tarikh: '' // Not active yet
    },
    {
      jenis: 'Penolong Amil Fitrah (PAF) terbaik',
      amaun: 450-700,
      kod: 'B34109',
      status: 'TIDAK AKTIF',
      tarikh: '' // Not active yet
    },
    {
      jenis: 'Elaun Tahunan KPAF',
      amaun: 300,
      kod: 'B31702',
      status: 'AKTIF',
      tarikh: '2025-01-01'
    }
  ],
  maklumatElaunKhas: [
    {
      jenis: 'KHAS - 48 AKTIVITI/TAHUN',
      kategoriPA: 'PAF',
      amaun: 400,
      kod: 'B31702',
      status: 'AKTIF',
      tarikh: '2025-01-01',
      targetKPI: 48
    }
  ],
  maklumatPegawai: {
    diciptaOleh: 'Ahmad Bin Abdullah',
    tarikhCipta: '2024-01-15',
    dikemaskiniBoleh: 'Ahmad Bin Abdullah',
    tarikhKemaskini: '2024-01-20',
    disahkanOleh: 'Siti Aminah Binti Omar',
    tarikhPengesahan: '2024-01-21',
    diluluskanOleh: 'Dato\' Muhammad Hassan Bin Abdul Rahman',
    tarikhKelulusan: '2024-01-22'
  }
})

// Methods for managing table data
const tambahElaun = () => {
  formData.value.maklumatElaun.push({
    jenis: '',
    amaun: 0,
    kod: '',
    status: 'TIDAK AKTIF', // Default for new rows
    tarikh: '' // Tarikh Kuatkuasa will be set by Ketua Divisyen upon approval
  })
  
  // Regenerate change log
  changeLog.value = generateChangeLog()
}

const hapusElaun = (index) => {
  formData.value.maklumatElaun.splice(index, 1)
  
  // Regenerate change log
  changeLog.value = generateChangeLog()
}

const tambahElaunKhas = () => {
  formData.value.maklumatElaunKhas.push({
    jenis: '',
    kategoriPA: '',
    amaun: 0,
    kod: '',
    status: 'TIDAK AKTIF', // Default for new rows
    tarikh: '', // Tarikh Kuatkuasa will be set by Ketua Divisyen upon approval
    targetKPI: 0
  })
  
  // Regenerate change log
  changeLog.value = generateChangeLog()
}

const hapusElaunKhas = (index) => {
  formData.value.maklumatElaunKhas.splice(index, 1)
  
  // Regenerate change log
  changeLog.value = generateChangeLog()
}

// Confirmation method for Eksekutif sokongan
const confirmSokongan = async () => {
  try {
    if (!confirmationData.value.ulasan.trim()) {
      toast.error('Sila masukkan ulasan sokongan')
      return
    }

    // Close modal
    showConfirmationModal.value = false
    
    // Simulate API call to save changes and update status
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Save the sokongan data (in real app, this would be sent to API)
    const sokonganData = {
      ...confirmationData.value,
      allowanceId: route.params.id,
      status: 'Menunggu Pengesahan',
      tarikhSokongan: new Date().toISOString(),
      changeLog: changeLog.value, // Include change tracking
      originalData: originalData.value,
      newData: formData.value
    }
    
    // Sokongan data processed
    
    toast.success('Perubahan telah disokong dan dihantar untuk pengesahan oleh Ketua Jabatan')
    
    // Navigate back to list
    await navigateTo('/BF-PA/KF/KE')
  } catch (error) {
    toast.error('Ralat semasa menyokong perubahan')
    // Error supporting changes
  }
}

// Form submission (kept for compatibility but not used with confirmation modal)
const handleSubmit = async (formData) => {
  try {
    // This method is now handled by confirmSokongan
    // Direct form submission - redirecting to confirmation modal
  } catch (error) {
    toast.error('Ralat semasa mengemaskini elaun penolong amil')
    // Error updating allowance
  }
}

// Store original data for change tracking
const originalData = ref({})

// Track changes for approval workflow
const changeLog = ref([])

// Generate change log
const generateChangeLog = () => {
  const changes = []
  
  // Compare maklumatElaun
  const originalElaun = originalData.value.maklumatElaun || []
  const currentElaun = formData.value.maklumatElaun || []
  
  // Check for additions
  currentElaun.forEach((current, index) => {
    const original = originalElaun[index]
    if (!original) {
      changes.push({
        type: 'added',
        section: 'Elaun dalam Kategori',
        description: `Ditambah: ${current.jenis}`,
        newValue: `RM ${current.amaun}`,
        oldValue: null
      })
    } else {
      // Check for modifications
      if (current.jenis !== original.jenis) {
        changes.push({
          type: 'modified',
          section: 'Elaun dalam Kategori',
          description: `Jenis Elaun`,
          oldValue: original.jenis,
          newValue: current.jenis
        })
      }
      if (current.amaun !== original.amaun) {
        changes.push({
          type: 'modified',
          section: 'Elaun dalam Kategori',
          description: `Amaun untuk "${current.jenis}"`,
          oldValue: `RM ${original.amaun}`,
          newValue: `RM ${current.amaun}`
        })
      }
      if (current.kod !== original.kod) {
        changes.push({
          type: 'modified',
          section: 'Elaun dalam Kategori', 
          description: `Kod Bajet untuk "${current.jenis}"`,
          oldValue: original.kod,
          newValue: current.kod
        })
      }
      if (current.status !== original.status) {
        changes.push({
          type: 'modified',
          section: 'Elaun dalam Kategori',
          description: `Status untuk "${current.jenis}"`,
          oldValue: original.status,
          newValue: current.status
        })
      }
    }
  })
  
  // Check for removals
  originalElaun.forEach((original, index) => {
    if (!currentElaun[index]) {
      changes.push({
        type: 'removed',
        section: 'Elaun dalam Kategori',
        description: `Dipadamkan: ${original.jenis}`,
        oldValue: `RM ${original.amaun}`,
        newValue: null
      })
    }
  })
  
  // Similar logic for maklumatElaunKhas
  const originalElaunKhas = originalData.value.maklumatElaunKhas || []
  const currentElaunKhas = formData.value.maklumatElaunKhas || []
  
  currentElaunKhas.forEach((current, index) => {
    const original = originalElaunKhas[index]
    if (!original) {
      changes.push({
        type: 'added',
        section: 'Elaun Khas',
        description: `Ditambah: ${current.jenis}`,
        newValue: `RM ${current.amaun}`,
        oldValue: null
      })
    } else {
      if (current.jenis !== original.jenis) {
        changes.push({
          type: 'modified',
          section: 'Elaun Khas',
          description: `Jenis Elaun Khas`,
          oldValue: original.jenis,
          newValue: current.jenis
        })
      }
      if (current.amaun !== original.amaun) {
        changes.push({
          type: 'modified',
          section: 'Elaun Khas',
          description: `Amaun untuk "${current.jenis}"`,
          oldValue: `RM ${original.amaun}`,
          newValue: `RM ${current.amaun}`
        })
      }
      if (current.kod !== original.kod) {
        changes.push({
          type: 'modified',
          section: 'Elaun Khas',
          description: `Kod Bajet untuk "${current.jenis}"`,
          oldValue: original.kod,
          newValue: current.kod
        })
      }
      if (current.kategoriPA !== original.kategoriPA) {
        changes.push({
          type: 'modified',
          section: 'Elaun Khas',
          description: `Kategori PA untuk "${current.jenis}"`,
          oldValue: original.kategoriPA,
          newValue: current.kategoriPA
        })
      }
      if (current.status !== original.status) {
        changes.push({
          type: 'modified',
          section: 'Elaun Khas',
          description: `Status untuk "${current.jenis}"`,
          oldValue: original.status,
          newValue: current.status
        })
      }
      if (current.targetKPI !== original.targetKPI) {
        changes.push({
          type: 'modified',
          section: 'Elaun Khas',
          description: `Target KPI untuk "${current.jenis}"`,
          oldValue: original.targetKPI,
          newValue: current.targetKPI
        })
      }
    }
  })
  
  originalElaunKhas.forEach((original, index) => {
    if (!currentElaunKhas[index]) {
      changes.push({
        type: 'removed',
        section: 'Elaun Khas',
        description: `Dipadamkan: ${original.jenis}`,
        oldValue: `RM ${original.amaun}`,
        newValue: null
      })
    }
  })
  
  return changes
}

// Load data on mount
onMounted(async () => {
  const allowanceId = route.params.id
  
  try {
    // Simulate API call to get allowance data
    await new Promise(resolve => setTimeout(resolve, 500))
    
    // Mock original data - what was in system before changes
    const loadedData = {
      kategoriPenolongAmil: 'Penolong Amil Kariah',
      maklumatElaun: [
        {
          jenis: 'Elaun Bancian Baru : per borang permohonan',
          amaun: 25, // Changed from 25 to 30
          kod: 'B34106',
          status: 'AKTIF',
          tarikh: '2025-01-01'
        },
        {
          jenis: 'Elaun Kemaskini/permohonan bantuan : per borang',
          amaun: 20,
          kod: 'B34106',
          status: 'AKTIF',
          tarikh: '2025-01-01'
        },
        {
          jenis: 'Elaun Tahunan KPAK',
          amaun: 500,
          kod: 'B34107',
          status: 'AKTIF',
          tarikh: '2025-01-01'
        }
        // Note: Elaun Tahunan KPAF will be added as new item
      ],
      maklumatElaunKhas: [
        {
          jenis: 'KHAS - 48 AKTIVITI/TAHUN',
          kategoriPA: 'PAF',
          amaun: 350, // Changed from 350 to 400
          kod: 'B31702',
          status: 'AKTIF',
          tarikh: '2025-01-01',
          targetKPI: 48
        }
      ],
      maklumatPegawai: {
        diciptaOleh: 'Admin User',
        tarikhCipta: '27-10-2023',
        diluluskanOleh: 'Manager',
        tarikhLulus: '28-10-2023'
      }
    }
    
    // Store original data for comparison
    originalData.value = JSON.parse(JSON.stringify(loadedData))
    
    // Current data with changes applied
    formData.value = {
      kategoriPenolongAmil: 'Penolong Amil Fitrah',
      maklumatElaun: [
        {
          jenis: 'Elaun Bancian Baru : per borang permohonan',
          amaun: 30, // Modified: increased from 25 to 30
          kod: 'B34106',
          status: 'AKTIF',
          tarikh: '2025-01-01'
        },
        {
          jenis: 'Elaun Kemaskini/permohonan bantuan : per borang',
          amaun: 20,
          kod: 'B34106',
          status: 'AKTIF',
          tarikh: '2025-01-01'
        },
        {
          jenis: 'Elaun Tahunan KPAK',
          amaun: 500,
          kod: 'B34107',
          status: 'AKTIF',
          tarikh: '2025-01-01'
        },
        {
          jenis: 'Anugerah Ketua Penolong Amil Terbaik', // Added: new elaun type
          amaun: 400 - 750,
          kod: 'B34108',
          status: 'AKTIF',
          tarikh: '2025-01-01'
        },
         {
          jenis: 'Anugerah Penolong Amil Terbaik', // Added: new elaun type
          amaun: 400 - 750,
          kod: 'B34108',
          status: 'AKTIF',
          tarikh: '2025-01-01'
        }
      ],
      maklumatElaunKhas: [
        {
          jenis: 'Khas - 48 Aktiviti/Tahun',
          kategoriPA: 'PAK',
          amaun: 400, // Modified: increased from 350 to 400
          kod: 'B31702',
          status: 'AKTIF',
          tarikh: '2025-01-01',
          targetKPI: 48
        }
      ],
      maklumatPegawai: {
        diciptaOleh: 'Admin User',
        tarikhCipta: '27-10-2023',
        diluluskanOleh: 'Manager',
        tarikhLulus: '28-10-2023'
      }
    }
    
    // Generate change log
    changeLog.value = generateChangeLog()
    
  } catch (error) {
    toast.error('Ralat semasa memuat data elaun penolong amil')
    // Error loading allowance data
  }
})
</script> 