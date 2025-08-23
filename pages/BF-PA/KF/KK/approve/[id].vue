<!-- 
  RTMF SCREEN: PA-KF-KK-01_06 (Approval Form)
  PURPOSE: Kelulusan kategori penolong amil oleh Ketua Divisyen
  DESCRIPTION: Approval form for Penolong Amil category by Ketua Divisyen
  ROUTE: /BF-PA/KF/KK/approve/[id]
-->
<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />

    <!-- Role-Based Access Control -->
    <div v-if="currentRole !== 'ketua-divisyen'" class="mb-6">
      <rs-card variant="warning">
        <template #body>
          <div class="p-4 text-center">
            <Icon name="ph:warning-circle" class="w-8 h-8 mx-auto text-warning mb-2" />
            <h3 class="text-lg font-semibold text-warning mb-2">Akses Tidak Dibenarkan</h3>
            <p class="text-gray-600 mb-4">Hanya Ketua Divisyen dibenarkan meluluskan kategori.</p>
            <rs-button @click="navigateTo('/BF-PA/KF/KK')" variant="secondary">
              Kembali ke Senarai
            </rs-button>
          </div>
        </template>
      </rs-card>
    </div>

    <!-- Main Approval Form (Ketua Divisyen Only) -->
    <div v-else>
      <!-- Enhanced Header Section -->
      <div class="mb-6">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-2xl font-bold text-gray-900 flex items-center">
              <Icon name="ph:clipboard-text" class="w-6 h-6 mr-3 text-primary" />
              Borang Kelulusan Kategori Penolong Amil
            </h1>
            <p class="text-gray-600 mt-1">Kelulusan kategori penolong amil oleh Ketua Divisyen</p>
          </div>
        </div>
      </div>

      <!-- Category Information for Context -->
      <rs-card class="mb-6">
        <template #header>
          <h3 class="text-lg font-semibold text-gray-900 flex items-center">
            <Icon name="ph:tag" class="w-5 h-5 mr-2" />
            Maklumat Kategori untuk Konteks
          </h3>
        </template>
        <template #body>
          <div class="p-6">
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Kategori Penolong Amil</label>
                <div class="text-sm text-gray-900 bg-gray-50 px-3 py-2 rounded-md">
                  {{ categoryData.kategoriPenolongAmil }}
                </div>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Kod Singkatan</label>
                <div class="text-sm text-gray-900 bg-gray-50 px-3 py-2 rounded-md">
                  {{ categoryData.kodSingkatan }}
                </div>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Status Kategori</label>
                <div class="text-sm text-gray-900 bg-gray-50 px-3 py-2 rounded-md">
                  <rs-badge :variant="getStatusVariant(categoryData.status)" size="sm">
                    {{ categoryData.status }}
                  </rs-badge>
                </div>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Rujukan</label>
                <div class="text-sm text-gray-900 bg-gray-50 px-3 py-2 rounded-md">
                  {{ categoryData.rujukan }}
                </div>
              </div>
            </div>
          </div>
        </template>
      </rs-card>

      <!-- Maklumat Perubahan Kategori Yang Dibuat -->
      <rs-card class="mb-6">
        <template #header>
          <h3 class="text-lg font-semibold text-gray-900 flex items-center">
            <Icon name="ph:list-checks" class="w-5 h-5 mr-2" />
            Maklumat Perubahan Kategori Yang Dibuat
          </h3>
        </template>
        <template #body>
          <div class="p-6">
            <div v-if="changeLog.length === 0" class="text-center py-8">
              <Icon name="ph:info" class="w-12 h-12 mx-auto text-gray-400 mb-3" />
              <p class="text-gray-500">Tiada perubahan dibuat pada kategori ini.</p>
            </div>
            <div v-else class="space-y-4">
              <div v-for="(change, index) in changeLog" :key="index" class="border-l-4 pl-4 py-2"
                   :class="{
                     'border-green-500 bg-green-50': change.type === 'added',
                     'border-blue-500 bg-blue-50': change.type === 'modified',
                     'border-red-500 bg-red-50': change.type === 'removed'
                   }">
                <div class="flex items-center mb-2">
                  <Icon :name="change.type === 'added' ? 'ph:plus-circle' : change.type === 'modified' ? 'ph:pencil-circle' : 'ph:minus-circle'" 
                        class="w-5 h-5 mr-2"
                        :class="{
                          'text-green-600': change.type === 'added',
                          'text-blue-600': change.type === 'modified',
                          'text-red-600': change.type === 'removed'
                        }" />
                  <span class="font-medium text-sm"
                        :class="{
                          'text-green-800': change.type === 'added',
                          'text-blue-800': change.type === 'modified',
                          'text-red-800': change.type === 'removed'
                        }">{{ change.field }}</span>
                </div>
                <div class="text-sm text-gray-700 ml-7">
                  <span v-if="change.type === 'modified'">
                    <span class="font-medium">Dari:</span> {{ change.oldValue }} 
                    <span class="mx-2">→</span> 
                    <span class="font-medium">Kepada:</span> {{ change.newValue }}
                  </span>
                  <span v-else-if="change.type === 'added'">
                    <span class="font-medium">Ditambah:</span> {{ change.newValue }}
                  </span>
                  <span v-else-if="change.type === 'removed'">
                    <span class="font-medium">Dibuang:</span> {{ change.oldValue }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </template>
      </rs-card>

      <!-- Review History -->
      <rs-card class="mb-6">
        <template #header>
          <h3 class="text-lg font-semibold text-gray-900 flex items-center">
            <Icon name="ph:clipboard-text" class="w-5 h-5 mr-2" />
            Sejarah Semakan
          </h3>
        </template>
        <template #body>
          <div class="p-6">
            <div class="space-y-4">
              <!-- Eksekutif Review -->
              <div class="flex items-start justify-between p-4">
                <div class="flex items-start">
                  <Icon name="ph:thumbs-up" class="w-5 h-5 mr-3 text-gray-500 mt-1" />
                  <div class="flex-1">
                    <div class="flex items-center justify-between mb-2">
                      <h4 class="font-semibold text-gray-900">Eksekutif</h4>
                      <rs-badge variant="success">Selesai</rs-badge>
                    </div>
                    <p class="text-sm text-gray-700 mb-2">Sokongan eksekutif</p>
                    <div class="text-xs text-gray-600 space-y-1">
                      <p><strong>Disemak oleh:</strong> {{ formData.namaPenyokong }} (Eksekutif)</p>
                      <p><strong>Tarikh:</strong> {{ formatDate(formData.tarikhSokongan) }}</p>
                      <p><strong>Catatan:</strong> {{ formData.ulasanSokongan || 'Tiada ulasan tambahan.' }}</p>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Ketua Jabatan Review -->
              <div class="flex items-start justify-between p-4">
                <div class="flex items-start">
                  <Icon name="ph:check-circle" class="w-5 h-5 mr-3 text-gray-500 mt-1" />
                  <div class="flex-1">
                    <div class="flex items-center justify-between mb-2">
                      <h4 class="font-semibold text-gray-900">Ketua Jabatan</h4>
                      <rs-badge variant="success">Selesai</rs-badge>
                    </div>
                    <p class="text-sm text-gray-700 mb-2">Pengesahan ketua jabatan</p>
                    <div class="text-xs text-gray-600 space-y-1">
                      <p><strong>Disemak oleh:</strong> {{ formData.namaPengesah }} (Ketua Jabatan)</p>
                      <p><strong>Tarikh:</strong> {{ formatDate(formData.tarikhPengesahan) }}</p>
                      <p><strong>Catatan:</strong> {{ formData.ulasanPengesahan || 'Tiada ulasan tambahan.' }}</p>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Ketua Divisyen Review (Current) -->
              <div class="flex items-start justify-between p-4 bg-orange-50 rounded-lg border border-orange-200">
                <div class="flex items-start">
                  <Icon name="ph:star" class="w-5 h-5 mr-3 text-orange-500 mt-1" />
                  <div class="flex-1">
                    <div class="flex items-center justify-between mb-2">
                      <h4 class="font-semibold text-orange-900">Ketua Divisyen</h4>
                      <rs-badge variant="warning">Dalam Proses</rs-badge>
                    </div>
                    <p class="text-sm text-orange-700 mb-2">Kelulusan akhir ketua divisyen</p>
                    <div class="text-xs text-orange-600 space-y-1">
                      <p><strong>Disemak oleh:</strong> {{ currentUser.name }} ({{ currentUser.role }})</p>
                      <p><strong>Tarikh:</strong> {{ currentDate }}</p>
                      <p><strong>Status:</strong> Menunggu keputusan kelulusan akhir</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </template>
      </rs-card>

      <!-- Borang Kelulusan -->
      <FormKit
        type="form"
        id="approvalForm"
        :actions="false"
        @submit="handleSubmit"
      >
        <rs-card class="mb-6">
          <template #header>
            <h3 class="text-lg font-semibold text-gray-900 flex items-center">
              <Icon name="ph:clipboard-text" class="w-5 h-5 mr-2" />
              Borang Kelulusan
            </h3>
          </template>
          <template #body>
            <div class="p-6">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormKit
                  type="select"
                  name="approvalDecision"
                  label="Keputusan Kelulusan"
                  :options="[
                    { label: 'Luluskan - Aktifkan Kategori', value: 'luluskan' },
                    { label: 'Tolak - Tidak Diluluskan', value: 'tolak' }
                  ]"
                  validation="required"
                  :validation-messages="{
                    required: 'Keputusan kelulusan diperlukan',
                  }"
                  v-model="formData.approvalDecision"
                />
                <div></div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Nama Pelulus</label>
                  <div class="text-sm text-gray-900 bg-gray-50 px-3 py-2 rounded-md">
                    {{ formData.namaPelulus }}
                  </div>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Tarikh Kelulusan</label>
                  <div class="text-sm text-gray-900 bg-gray-50 px-3 py-2 rounded-md">
                    {{ formData.approvalDate }}
                  </div>
                </div>
                <div class="md:col-span-2">
                  <FormKit
                    type="textarea"
                    name="ulasanKelulusan"
                    label="Ulasan Kelulusan"
                    placeholder="Masukkan ulasan atau justifikasi untuk keputusan kelulusan..."
                    rows="4"
                    validation="required"
                    :validation-messages="{
                      required: 'Ulasan kelulusan diperlukan',
                    }"
                    v-model="formData.ulasanKelulusan"
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
            <Icon name="ph:check" class="w-4 h-4 mr-2" />
            Hantar Kelulusan
          </rs-button>
        </div>
      </FormKit>
    </div>

    <!-- Confirmation Modal -->
    <div v-if="showConfirmModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <div class="flex items-center mb-4">
          <Icon name="ph:question" class="w-6 h-6 text-primary mr-3" />
          <h3 class="text-lg font-semibold">Pengesahan Tindakan</h3>
        </div>
        
        <p class="text-gray-600 mb-4">
          Adakah anda pasti untuk <strong>{{ formData.approvalDecision === 'luluskan' ? 'meluluskan' : 'menolak' }}</strong> 
          perubahan kategori ini? Tindakan ini tidak boleh dibatalkan.
        </p>

        <div class="flex justify-end space-x-3">
          <rs-button
            variant="secondary-outline"
            @click="cancelConfirmation"
          >
            Batal
          </rs-button>
          <rs-button
            :variant="formData.approvalDecision === 'luluskan' ? 'primary' : 'danger'"
            @click="confirmSubmission"
          >
            <Icon name="ph:check" class="w-4 h-4 mr-2" />
            {{ formData.approvalDecision === 'luluskan' ? 'Luluskan' : 'Tolak' }}
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
const currentRole = ref('ketua-divisyen') // Mock - should come from actual auth state

// Breadcrumb
const breadcrumb = [
  { name: 'Laman Utama', path: '/' },
  { name: 'Modul BF-PA', path: '/BF-PA' },
  { name: 'Konfigurasi', path: '/BF-PA/KF' },
  { name: 'Maklumat Kategori', path: '/BF-PA/KF/KK' },
  { name: 'Kelulusan', path: null }
]

// Category data for context
const categoryData = ref({
  kategoriPenolongAmil: '',
  kodSingkatan: '',
  status: '',
  rujukan: ''
})

// Change log data
const changeLog = ref([])

// Form data
const formData = ref({
  approvalDecision: '',
  ulasanKelulusan: '',
  namaPelulus: 'Datuk Seri Wan Ahmad bin Wan Omar', // Mock - should come from auth
  approvalDate: new Date().toISOString().split('T')[0], // Current date
  // Previous workflow data
  namaPenyokong: '',
  tarikhSokongan: '',
  ulasanSokongan: '',
  namaPengesah: '',
  tarikhPengesahan: '',
  ulasanPengesahan: ''
})

// Confirmation modal state
const showConfirmModal = ref(false)

// Status variant helper
const getStatusVariant = (status) => {
  const variants = {
    'Aktif': 'success',
    'Tidak Aktif': 'danger',
    'Menunggu Pengesahan': 'warning',
    'Menunggu Kelulusan': 'info'
  }
  return variants[status] || 'secondary'
}

// Generate mock change log
const generateChangeLog = () => {
  // Mock change log - in real app, this would come from comparing original vs edited data
  return [
    {
      type: 'modified',
      field: 'Penerangan Kategori',
      oldValue: 'Kategori untuk menguruskan penolong amil wakaf',
      newValue: 'Kategori untuk menguruskan penolong amil yang mengendalikan urusan wakaf dan amanah'
    },
    {
      type: 'modified', 
      field: 'Status',
      oldValue: 'Tidak Aktif',
      newValue: 'Aktif'
    }
  ]
}

// Form submission (show confirmation modal first)
const handleSubmit = async (formDataSubmitted) => {
  formData.value = { ...formData.value, ...formDataSubmitted }
  showConfirmModal.value = true
}

// Cancel confirmation
const cancelConfirmation = () => {
  showConfirmModal.value = false
}

// Confirm and proceed with submission
const confirmSubmission = async () => {
  try {
    // Simulate API call
    const submissionData = {
      ...formData.value,
      categoryId: route.params.id,
      approvalDate: new Date().toISOString().split('T')[0]
    }
    
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    showConfirmModal.value = false
    
    if (formData.value.approvalDecision === 'luluskan') {
      toast.success('Kategori berjaya diluluskan dan telah aktif dalam sistem')
    } else {
      toast.success('Kategori berjaya ditolak')
    }
    
    // Navigate back to list
    await navigateTo('/BF-PA/KF/KK')
  } catch (error) {
    toast.error('Ralat semasa memproses kelulusan')
    // Error processing approval
  }
}

// Load data on mount
onMounted(async () => {
  const categoryId = route.params.id
  
  try {
    // Simulate API call to get category and workflow data
    await new Promise(resolve => setTimeout(resolve, 500))
    
    // Mock category context data
    categoryData.value = {
      kategoriPenolongAmil: 'Penolong Amil Wakaf',
      kodSingkatan: 'PAW',
      status: 'Menunggu Kelulusan',
      rujukan: 'KK-2024-005'
    }
    
    // Mock previous workflow data
    formData.value.namaPenyokong = 'Ahmad Nazri bin Abdullah'
    formData.value.tarikhSokongan = '2024-01-15'
    formData.value.ulasanSokongan = 'Kategori ini diperlukan untuk menguruskan urusan wakaf yang semakin meningkat. Perubahan pada penerangan kategori adalah untuk memberikan skop yang lebih jelas.'
    
    formData.value.namaPengesah = 'Dr. Muhammad Farid bin Ahmad'
    formData.value.tarikhPengesahan = '2024-01-18'
    formData.value.ulasanPengesahan = 'Perubahan yang dicadangkan adalah munasabah dan selaras dengan keperluan semasa. Kategori ini disahkan untuk kelulusan akhir.'
    
    // Generate change log
    changeLog.value = generateChangeLog()
    
  } catch (error) {
    toast.error('Ralat semasa memuat data kategori')
    // Error loading category data
  }
})
</script> 