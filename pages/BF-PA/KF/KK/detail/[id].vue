<!-- 
  RTMF SCREEN: PA-KF-KK-01_02 (Detail View)
  PURPOSE: Paparan terperinci maklumat kategori penolong amil
  DESCRIPTION: Detailed view for Penolong Amil category information
  ROUTE: /BF-PA/KF/KK/detail/[id]
-->
<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />

    <!-- Enhanced Header Section -->
    <div class="mb-6">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold text-gray-900 flex items-center">
            <Icon name="ph:file-text" class="w-6 h-6 mr-3 text-primary" />
            Paparan Terperinci Kategori Penolong Amil
          </h1>
          <p class="text-gray-600 mt-1">Maklumat lengkap kategori penolong amil dan status workflow</p>
        </div>
      </div>
    </div>

    <!-- Main Category Information -->
    <rs-card class="mb-6">
      <template #header>
        <h3 class="text-lg font-semibold text-gray-900 flex items-center">
          <Icon name="ph:tag" class="w-5 h-5 mr-2" />
          Maklumat Kategori Penolong Amil
        </h3>
      </template>
      <template #body>
        <div class="p-6">
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Kategori Penolong Amil</label>
              <div class="text-sm text-gray-900 bg-gray-50 px-3 py-2 rounded-md">
                {{ categoryData.kategoriPenolongAmil }}
                <rs-badge v-if="categoryData.isDefault" variant="info" size="sm" class="ml-2">Asas</rs-badge>
              </div>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Kod Singkatan</label>
              <div class="text-sm text-gray-900 bg-gray-50 px-3 py-2 rounded-md font-mono">
                {{ categoryData.kodSingkatan }}
              </div>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <div class="text-sm text-gray-900 bg-gray-50 px-3 py-2 rounded-md">
                <rs-badge :variant="getStatusVariant(categoryData.status)" size="sm">
                  {{ categoryData.status }}
                </rs-badge>
              </div>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Tarikh Kuatkuasa</label>
              <div class="text-sm text-gray-900 bg-gray-50 px-3 py-2 rounded-md">
                {{ categoryData.tarikhKuatkuasa ? formatDate(categoryData.tarikhKuatkuasa) : 'Belum ditetapkan' }}
              </div>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Rujukan</label>
              <div class="text-sm text-gray-900 bg-gray-50 px-3 py-2 rounded-md font-mono">
                {{ categoryData.rujukan }}
              </div>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Jenis Kategori</label>
              <div class="text-sm text-gray-900 bg-gray-50 px-3 py-2 rounded-md">
                <rs-badge :variant="categoryData.isDefault ? 'info' : 'secondary'" size="sm">
                  {{ categoryData.isDefault ? 'Kategori Asas (Dilindungi)' : 'Kategori Kustom' }}
                </rs-badge>
              </div>
            </div>
            <div class="md:col-span-3">
              <label class="block text-sm font-medium text-gray-700 mb-2">Penerangan Kategori</label>
              <div class="text-sm text-gray-900 bg-gray-50 px-3 py-2 rounded-md">
                {{ categoryData.penerangan || 'Tiada penerangan' }}
              </div>
            </div>
          </div>
        </div>
      </template>
    </rs-card>

    <!-- Enhanced Workflow Status -->
    <rs-card class="mb-6">
      <template #header>
        <h3 class="text-lg font-semibold text-gray-900 flex items-center">
          <Icon name="ph:flow-arrow" class="w-5 h-5 mr-2" />
          Status Workflow & Kelulusan
        </h3>
      </template>
      <template #body>
        <div class="p-6">
          <!-- Workflow Timeline -->
          <div class="relative">
            <div class="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200"></div>
            
            <!-- Step 1: Creation -->
            <div class="relative flex items-start mb-6">
              <div class="flex-shrink-0 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                <Icon name="ph:plus" class="w-4 h-4 text-white" />
              </div>
              <div class="ml-4 flex-1">
                <h4 class="font-medium text-gray-900">Kategori Dicipta</h4>
                <p class="text-sm text-gray-600">Oleh: {{ categoryData.maklumatPegawai?.diciptaOleh || 'N/A' }}</p>
                <p class="text-xs text-gray-500">{{ formatDate(categoryData.maklumatPegawai?.tarikhCipta) }}</p>
              </div>
            </div>

            <!-- Step 2: Update/Edit -->
            <div v-if="categoryData.maklumatPegawai?.dikemaskiniBoleh" class="relative flex items-start mb-6">
              <div class="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center"
                   :class="isWorkflowStepActive('edit') ? 'bg-blue-500' : 'bg-gray-400'">
                <Icon name="ph:pencil" class="w-4 h-4 text-white" />
              </div>
              <div class="ml-4 flex-1">
                <h4 class="font-medium text-gray-900">Kategori Dikemaskini</h4>
                <p class="text-sm text-gray-600">Oleh: {{ categoryData.maklumatPegawai?.dikemaskiniBoleh }}</p>
                <p class="text-xs text-gray-500">{{ formatDate(categoryData.maklumatPegawai?.tarikhKemaskini) }}</p>
              </div>
            </div>

            <!-- Step 3: Verification -->
            <div class="relative flex items-start mb-6">
              <div class="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center"
                   :class="isWorkflowStepActive('verify') ? 'bg-yellow-500' : 'bg-gray-400'">
                <Icon name="ph:check" class="w-4 h-4 text-white" />
              </div>
              <div class="ml-4 flex-1">
                <h4 class="font-medium text-gray-900">Pengesahan Ketua Jabatan</h4>
                <p v-if="categoryData.maklumatPegawai?.disahkanOleh" class="text-sm text-gray-600">
                  Oleh: {{ categoryData.maklumatPegawai.disahkanOleh }}
                </p>
                <p v-else class="text-sm text-gray-500">Menunggu pengesahan</p>
                <p v-if="categoryData.maklumatPegawai?.tarikhPengesahan" class="text-xs text-gray-500">
                  {{ formatDate(categoryData.maklumatPegawai.tarikhPengesahan) }}
                </p>
              </div>
            </div>

            <!-- Step 4: Approval -->
            <div class="relative flex items-start">
              <div class="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center"
                   :class="isWorkflowStepActive('approve') ? 'bg-green-500' : 'bg-gray-400'">
                <Icon name="ph:crown" class="w-4 h-4 text-white" />
              </div>
              <div class="ml-4 flex-1">
                <h4 class="font-medium text-gray-900">Kelulusan Ketua Divisyen</h4>
                <p v-if="categoryData.maklumatPegawai?.diluluskanOleh" class="text-sm text-gray-600">
                  Oleh: {{ categoryData.maklumatPegawai.diluluskanOleh }}
                </p>
                <p v-else class="text-sm text-gray-500">Menunggu kelulusan</p>
                <p v-if="categoryData.maklumatPegawai?.tarikhKelulusan" class="text-xs text-gray-500">
                  {{ formatDate(categoryData.maklumatPegawai.tarikhKelulusan) }}
                </p>
              </div>
            </div>
          </div>

          <!-- Current Status Summary -->
          <div class="mt-6 p-4 bg-gray-50 rounded-lg border">
            <div class="flex items-center justify-between">
              <div>
                <h4 class="font-medium text-gray-900">Status Semasa</h4>
                <rs-badge :variant="getStatusVariant(categoryData.status)" class="mt-1">
                  {{ categoryData.status }}
                </rs-badge>
              </div>
              <div class="text-right">
                <p class="text-sm text-gray-600">Rujukan: {{ categoryData.rujukan }}</p>
                <p class="text-xs text-gray-500">Dikemaskini: {{ formatDate(categoryData.maklumatPegawai?.tarikhKemaskini) }}</p>
              </div>
            </div>
          </div>
        </div>
      </template>
    </rs-card>

    <!-- Action Buttons -->
    <div class="flex justify-between mb-8">
      <rs-button
        variant="secondary-outline"
        @click="navigateTo('/BF-PA/KF/KK')"
        class="flex items-center"
      >
        <Icon name="ph:arrow-left" class="w-4 h-4 mr-2" />
        Kembali
      </rs-button>
      
      <div class="flex gap-3">
        <rs-button
          v-if="canEditCategory"
          variant="primary"
          @click="editCategory"
          class="flex items-center"
        >
          <Icon name="ph:pencil" class="w-4 h-4 mr-2" />
          Kemaskini
        </rs-button>
        <rs-button
          v-if="canVerifyCategory"
          variant="warning"
          @click="verifyCategory"
          class="flex items-center"
        >
          <Icon name="ph:check" class="w-4 h-4 mr-2" />
          Sahkan
        </rs-button>
        <rs-button
          v-if="canApproveCategory"
          variant="success"
          @click="approveCategory"
          class="flex items-center"
        >
          <Icon name="ph:crown" class="w-4 h-4 mr-2" />
          Luluskan
        </rs-button>
      </div>
    </div>

    <!-- Jejak Audit (Separate Card - Scroll Down Section) -->
    <rs-card class="mt-8" style="background-color: #f8f9fa; border-color: #e9ecef;">
      <template #header>
        <h3 class="text-lg font-semibold text-gray-600 flex items-center">
          <Icon name="ph:clock-clockwise" class="w-5 h-5 mr-2" />
          Jejak Audit
        </h3>
      </template>
      <template #body>
        <div class="p-6">
          <div class="mb-4">
            <p class="text-sm text-gray-500 italic">Maklumat rujukan sahaja</p>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-600 mb-1">Dicipta Oleh</label>
              <div class="text-sm text-gray-700 bg-gray-100 px-3 py-2 rounded-md">
                {{ categoryData.maklumatPegawai?.diciptaOleh || 'N/A' }}
              </div>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-600 mb-1">Tarikh Cipta</label>
              <div class="text-sm text-gray-700 bg-gray-100 px-3 py-2 rounded-md">
                {{ formatDate(categoryData.maklumatPegawai?.tarikhCipta) }}
              </div>
            </div>
            <div v-if="categoryData.maklumatPegawai?.dikemaskiniBoleh">
              <label class="block text-sm font-medium text-gray-600 mb-1">Dikemaskini Oleh</label>
              <div class="text-sm text-gray-700 bg-gray-100 px-3 py-2 rounded-md">
                {{ categoryData.maklumatPegawai.dikemaskiniBoleh }}
              </div>
            </div>
            <div v-if="categoryData.maklumatPegawai?.tarikhKemaskini">
              <label class="block text-sm font-medium text-gray-600 mb-1">Tarikh Kemaskini</label>
              <div class="text-sm text-gray-700 bg-gray-100 px-3 py-2 rounded-md">
                {{ formatDate(categoryData.maklumatPegawai.tarikhKemaskini) }}
              </div>
            </div>
            <div v-if="categoryData.maklumatPegawai?.disahkanOleh">
              <label class="block text-sm font-medium text-gray-600 mb-1">Disahkan Oleh</label>
              <div class="text-sm text-gray-700 bg-gray-100 px-3 py-2 rounded-md">
                {{ categoryData.maklumatPegawai.disahkanOleh }}
              </div>
            </div>
            <div v-if="categoryData.maklumatPegawai?.tarikhPengesahan">
              <label class="block text-sm font-medium text-gray-600 mb-1">Tarikh Pengesahan</label>
              <div class="text-sm text-gray-700 bg-gray-100 px-3 py-2 rounded-md">
                {{ formatDate(categoryData.maklumatPegawai.tarikhPengesahan) }}
              </div>
            </div>
            <div v-if="categoryData.maklumatPegawai?.diluluskanOleh">
              <label class="block text-sm font-medium text-gray-600 mb-1">Diluluskan Oleh</label>
              <div class="text-sm text-gray-700 bg-gray-100 px-3 py-2 rounded-md">
                {{ categoryData.maklumatPegawai.diluluskanOleh }}
              </div>
            </div>
            <div v-if="categoryData.maklumatPegawai?.tarikhKelulusan">
              <label class="block text-sm font-medium text-gray-600 mb-1">Tarikh Kelulusan</label>
              <div class="text-sm text-gray-700 bg-gray-100 px-3 py-2 rounded-md">
                {{ formatDate(categoryData.maklumatPegawai.tarikhKelulusan) }}
              </div>
            </div>
          </div>
        </div>
      </template>
    </rs-card>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
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
  { label: 'Laman Utama', to: '/' },
  { label: 'Modul BF-PA', to: '/BF-PA' },
  { label: 'Konfigurasi', to: '/BF-PA/KF' },
  { label: 'Maklumat Kategori', to: '/BF-PA/KF/KK' },
  { label: 'Paparan Terperinci', to: null }
]

// Category data
const categoryData = ref({
  kategoriPenolongAmil: '',
  kodSingkatan: '',
  status: '',
  tarikhKuatkuasa: '',
  rujukan: '',
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

// Role-based access control
const canEditCategory = computed(() => {
  return currentRole.value === 'eksekutif' && 
         ['Aktif', 'Tidak Aktif'].includes(categoryData.value.status)
})

const canVerifyCategory = computed(() => {
  return currentRole.value === 'ketua-jabatan' && 
         categoryData.value.status === 'Menunggu Pengesahan'
})

const canApproveCategory = computed(() => {
  return currentRole.value === 'ketua-divisyen' && 
         categoryData.value.status === 'Menunggu Kelulusan'
})

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

// Workflow step status helper
const isWorkflowStepActive = (step) => {
  const status = categoryData.value.status
  switch (step) {
    case 'create':
      return true // Always active since category exists
    case 'edit':
      return ['Menunggu Pengesahan', 'Menunggu Kelulusan', 'Aktif'].includes(status)
    case 'verify':
      return ['Menunggu Kelulusan', 'Aktif'].includes(status)
    case 'approve':
      return status === 'Aktif'
    default:
      return false
  }
}

// Navigation methods
const editCategory = () => {
  navigateTo(`/BF-PA/KF/KK/edit/${route.params.id}`)
}

const verifyCategory = () => {
  navigateTo(`/BF-PA/KF/KK/verify/${route.params.id}`)
}

const approveCategory = () => {
  navigateTo(`/BF-PA/KF/KK/approve/${route.params.id}`)
}

// Load data on mount
onMounted(async () => {
  const categoryId = route.params.id
  
  try {
    // Simulate API call to get category data
    await new Promise(resolve => setTimeout(resolve, 500))
    
    // Mock data based on category ID to test different scenarios
    const categoryMockData = {
      1: { // PAF - Fixed category (Active)
        kategoriPenolongAmil: 'Penolong Amil Fitrah',
        kodSingkatan: 'PAF',
        status: 'Aktif',
        tarikhKuatkuasa: '01-01-2024',
        rujukan: 'KK-2024-001',
        penerangan: 'Kategori untuk menguruskan penolong amil dalam kutipan dan pengagihan zakat fitrah',
        isDefault: true
      },
      2: { // PAP - Fixed category (Active)
        kategoriPenolongAmil: 'Penolong Amil Padi',
        kodSingkatan: 'PAP',
        status: 'Aktif',
        tarikhKuatkuasa: '01-01-2024',
        rujukan: 'KK-2024-002',
        penerangan: 'Kategori untuk menguruskan penolong amil dalam kutipan dan pengagihan zakat padi',
        isDefault: true
      },
      3: { // PAK - Fixed category (Active)
        kategoriPenolongAmil: 'Penolong Amil Kariah',
        kodSingkatan: 'PAK',
        status: 'Aktif',
        tarikhKuatkuasa: '01-01-2024',
        rujukan: 'KK-2024-003',
        penerangan: 'Kategori untuk menguruskan penolong amil di peringkat kariah tempatan',
        isDefault: true
      },
      4: { // PK+ - Fixed category (Active)
        kategoriPenolongAmil: 'Penolong Amil Komuniti',
        kodSingkatan: 'PK+',
        status: 'Aktif',
        tarikhKuatkuasa: '01-01-2024',
        rujukan: 'KK-2024-004',
        penerangan: 'Kategori untuk menguruskan penolong amil yang berkhidmat dalam komuniti tertentu',
        isDefault: true
      },
      5: { // Custom category (Pending approval)
        kategoriPenolongAmil: 'Penolong Amil Wakaf',
        kodSingkatan: 'PAW',
        status: 'Menunggu Kelulusan',
        tarikhKuatkuasa: '01-01-2025',
        rujukan: 'KK-2024-005',
        penerangan: 'Kategori untuk menguruskan penolong amil yang mengendalikan urusan wakaf dan amanah',
        isDefault: false
      }
    }
    
    const selectedCategory = categoryMockData[categoryId] || categoryMockData[1]
    
    categoryData.value = {
      ...selectedCategory,
      maklumatPegawai: {
        diciptaOleh: 'Ahmad Nazri bin Abdullah',
        tarikhCipta: '15-10-2023',
        dikemaskiniBoleh: selectedCategory.status !== 'Aktif' ? 'Siti Aminah binti Hassan' : '',
        tarikhKemaskini: selectedCategory.status !== 'Aktif' ? '22-11-2023' : '',
        disahkanOleh: ['Menunggu Kelulusan', 'Aktif'].includes(selectedCategory.status) ? 'Dr. Muhammad Farid bin Ahmad' : '',
        tarikhPengesahan: ['Menunggu Kelulusan', 'Aktif'].includes(selectedCategory.status) ? '25-11-2023' : '',
        diluluskanOleh: selectedCategory.status === 'Aktif' ? 'Datuk Seri Wan Ahmad bin Wan Omar' : '',
        tarikhKelulusan: selectedCategory.status === 'Aktif' ? '30-11-2023' : ''
      }
    }
  } catch (error) {
    toast.error('Ralat semasa memuat data kategori')
    // Error loading category data
  }
})
</script> 