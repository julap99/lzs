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
          Status Aliran Kerja Kelulusan
        </h3>
      </template>
      <template #body>
        <div class="p-6">
          <div class="space-y-6">
          <!-- Workflow Timeline -->
          <div class="relative">
              <!-- Progress Line -->
              <div class="absolute left-4 top-8 bottom-0 w-0.5 bg-gray-200"></div>
            
              <!-- Step 1: Eksekutif -->
              <div class="relative flex items-start space-x-4 pb-6">
                <div class="flex-shrink-0">
                  <div :class="[
                    'w-8 h-8 rounded-full flex items-center justify-center',
                    getWorkflowStepClass(1)
                  ]">
                    <Icon :name="getWorkflowStepIcon(1)" class="w-4 h-4 text-white" />
                  </div>
                </div>
                <div class="flex-1 min-w-0">
                  <div class="flex items-center justify-between">
                    <div>
                      <p class="text-sm font-medium text-gray-900">Eksekutif - Sokongan</p>
                      <p class="text-sm text-gray-500">{{ getWorkflowStepDescription(1) }}</p>
                    </div>
                    <rs-badge :variant="getWorkflowStepBadge(1)" size="sm">
                      {{ getWorkflowStepStatus(1) }}
                    </rs-badge>
                  </div>
                </div>
              </div>

              <!-- Step 2: Ketua Jabatan -->
              <div class="relative flex items-start space-x-4 pb-6">
                <div class="flex-shrink-0">
                  <div :class="[
                    'w-8 h-8 rounded-full flex items-center justify-center',
                    getWorkflowStepClass(2)
                  ]">
                    <Icon :name="getWorkflowStepIcon(2)" class="w-4 h-4 text-white" />
              </div>
            </div>
                <div class="flex-1 min-w-0">
                  <div class="flex items-center justify-between">
                    <div>
                      <p class="text-sm font-medium text-gray-900">Ketua Jabatan - Pengesahan</p>
                      <p class="text-sm text-gray-500">{{ getWorkflowStepDescription(2) }}</p>
              </div>
                    <rs-badge :variant="getWorkflowStepBadge(2)" size="sm">
                      {{ getWorkflowStepStatus(2) }}
                    </rs-badge>
              </div>
            </div>
              </div>

              <!-- Step 3: Ketua Divisyen -->
              <div class="relative flex items-start space-x-4">
                <div class="flex-shrink-0">
                  <div :class="[
                    'w-8 h-8 rounded-full flex items-center justify-center',
                    getWorkflowStepClass(3)
                  ]">
                    <Icon :name="getWorkflowStepIcon(3)" class="w-4 h-4 text-white" />
              </div>
            </div>
                <div class="flex-1 min-w-0">
                  <div class="flex items-center justify-between">
                    <div>
                      <p class="text-sm font-medium text-gray-900">Ketua Divisyen - Kelulusan Akhir</p>
                      <p class="text-sm text-gray-500">{{ getWorkflowStepDescription(3) }}</p>
                    </div>
                    <rs-badge :variant="getWorkflowStepBadge(3)" size="sm">
                      {{ getWorkflowStepStatus(3) }}
                    </rs-badge>
                  </div>
              </div>
            </div>
          </div>

          <!-- Current Status Summary -->
            <div class="mt-6 p-4 bg-gray-50 border border-gray-200 rounded-lg">
              <div class="flex items-center">
                <Icon name="ph:info" class="w-5 h-5 text-blue-600 mr-3" />
              <div>
                  <p class="text-sm font-medium text-gray-900">Status Semasa</p>
                  <p class="text-sm text-gray-600">{{ getCurrentStatusDescription() }}</p>
              </div>
              </div>
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
          <Icon name="ph:check-circle" class="w-4 h-4 mr-2" />
          Sahkan
        </rs-button>
        <rs-button
          v-if="canApproveCategory"
          variant="success"
          @click="approveCategory"
          class="flex items-center"
        >
          <Icon name="ph:check" class="w-4 h-4 mr-2" />
          Luluskan
        </rs-button>
        <rs-button
          v-if="canRejectCategory"
          variant="danger"
          @click="rejectCategory"
          class="flex items-center"
        >
          <Icon name="ph:x-circle" class="w-4 h-4 mr-2" />
          Tolak
        </rs-button>
      </div>
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
                {{ categoryData.maklumatPegawai?.diciptaOleh || 'N/A' }}
              </div>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-500 mb-2">Tarikh Cipta</label>
              <div class="px-3 py-2 bg-gray-100 border border-gray-200 rounded-md text-gray-600">
                {{ formatDate(categoryData.maklumatPegawai?.tarikhCipta) }}
              </div>
            </div>
            <div v-if="categoryData.maklumatPegawai?.dikemaskiniBoleh">
              <label class="block text-sm font-medium text-gray-500 mb-2">Dikemaskini Oleh</label>
              <div class="px-3 py-2 bg-gray-100 border border-gray-200 rounded-md text-gray-600">
                {{ categoryData.maklumatPegawai.dikemaskiniBoleh }}
              </div>
            </div>
            <div v-if="categoryData.maklumatPegawai?.tarikhKemaskini">
              <label class="block text-sm font-medium text-gray-500 mb-2">Tarikh Kemaskini</label>
              <div class="px-3 py-2 bg-gray-100 border border-gray-200 rounded-md text-gray-600">
                {{ formatDate(categoryData.maklumatPegawai.tarikhKemaskini) }}
              </div>
            </div>
            <div v-if="categoryData.maklumatPegawai?.disahkanOleh">
              <label class="block text-sm font-medium text-gray-500 mb-2">Disahkan Oleh</label>
              <div class="px-3 py-2 bg-gray-100 border border-gray-200 rounded-md text-gray-600">
                {{ categoryData.maklumatPegawai.disahkanOleh }}
              </div>
            </div>
            <div v-if="categoryData.maklumatPegawai?.tarikhPengesahan">
              <label class="block text-sm font-medium text-gray-500 mb-2">Tarikh Pengesahan</label>
              <div class="px-3 py-2 bg-gray-100 border border-gray-200 rounded-md text-gray-600">
                {{ formatDate(categoryData.maklumatPegawai.tarikhPengesahan) }}
              </div>
            </div>
            <div v-if="categoryData.maklumatPegawai?.diluluskanOleh">
              <label class="block text-sm font-medium text-gray-500 mb-2">Diluluskan Oleh</label>
              <div class="px-3 py-2 bg-gray-100 border border-gray-200 rounded-md text-gray-600">
                {{ categoryData.maklumatPegawai.diluluskanOleh }}
              </div>
            </div>
            <div v-if="categoryData.maklumatPegawai?.tarikhKelulusan">
              <label class="block text-sm font-medium text-gray-500 mb-2">Tarikh Kelulusan</label>
              <div class="px-3 py-2 bg-gray-100 border border-gray-200 rounded-md text-gray-600">
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
  { name: 'Laman Utama', path: '/' },
  { name: 'Modul BF-PA', path: '/BF-PA' },
  { name: 'Konfigurasi', path: '/BF-PA/KF' },
  { name: 'Maklumat Kategori', path: '/BF-PA/KF/KK' },
  { name: 'Paparan Terperinci', path: null }
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

const canRejectCategory = computed(() => {
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

const rejectCategory = () => {
  navigateTo(`/BF-PA/KF/KK/reject/${route.params.id}`)
}

// Enhanced workflow visualization helpers
const getWorkflowStepClass = (step) => {
  const status = categoryData.value.status;
  
  switch (step) {
    case 1: // Eksekutif
      return 'bg-green-500'; // Always completed if we can see the data
    case 2: // Ketua Jabatan  
      if (['Menunggu Kelulusan', 'Aktif'].includes(status)) {
        return 'bg-green-500'; // Completed
      } else if (status === 'Menunggu Pengesahan') {
        return 'bg-yellow-500'; // In progress
      } else {
        return 'bg-gray-300'; // Not started
      }
    case 3: // Ketua Divisyen
      if (status === 'Aktif') {
        return 'bg-green-500'; // Completed
      } else if (status === 'Menunggu Kelulusan') {
        return 'bg-blue-500'; // In progress
      } else if (status === 'Tidak Aktif') {
        return 'bg-red-500'; // Rejected
      } else {
        return 'bg-gray-300'; // Not started
      }
    default:
      return 'bg-gray-300';
  }
};

const getWorkflowStepIcon = (step) => {
  const status = categoryData.value.status;
  
  switch (step) {
    case 1:
      return 'ph:check';
    case 2:
      if (['Menunggu Kelulusan', 'Aktif'].includes(status)) {
        return 'ph:check';
      } else if (status === 'Menunggu Pengesahan') {
        return 'ph:clock';
      } else {
        return 'ph:minus';
      }
    case 3:
      if (status === 'Aktif') {
        return 'ph:check';
      } else if (status === 'Menunggu Kelulusan') {
        return 'ph:clock';
      } else if (status === 'Tidak Aktif') {
        return 'ph:x';
      } else {
        return 'ph:minus';
      }
    default:
      return 'ph:minus';
  }
};

const getWorkflowStepStatus = (step) => {
  const status = categoryData.value.status;
  
  switch (step) {
    case 1:
      return 'Selesai';
    case 2:
      if (['Menunggu Kelulusan', 'Aktif'].includes(status)) {
        return 'Selesai';
      } else if (status === 'Menunggu Pengesahan') {
        return 'Dalam Proses';
      } else {
        return 'Belum Mula';
      }
    case 3:
      if (status === 'Aktif') {
        return 'Diluluskan';
      } else if (status === 'Menunggu Kelulusan') {
        return 'Dalam Proses';
      } else if (status === 'Tidak Aktif') {
        return 'Ditolak';
      } else {
        return 'Belum Mula';
      }
    default:
      return 'Tidak Diketahui';
  }
};

const getWorkflowStepBadge = (step) => {
  const status = categoryData.value.status;
  
  switch (step) {
    case 1:
      return 'success';
    case 2:
      if (['Menunggu Kelulusan', 'Aktif'].includes(status)) {
        return 'success';
      } else if (status === 'Menunggu Pengesahan') {
        return 'warning';
      } else {
        return 'secondary';
      }
    case 3:
      if (status === 'Aktif') {
        return 'success';
      } else if (status === 'Menunggu Kelulusan') {
        return 'info';
      } else if (status === 'Tidak Aktif') {
        return 'danger';
      } else {
        return 'secondary';
      }
    default:
      return 'secondary';
  }
};

const getWorkflowStepDescription = (step) => {
  const status = categoryData.value.status;
  
  switch (step) {
    case 1:
      return 'Data telah disokong dan dihantar untuk pengesahan';
    case 2:
      if (['Menunggu Kelulusan', 'Aktif'].includes(status)) {
        return 'Telah disahkan dan dihantar untuk kelulusan';
      } else if (status === 'Menunggu Pengesahan') {
        return 'Menunggu pengesahan dari Ketua Jabatan';
      } else {
        return 'Belum disahkan';
      }
    case 3:
      if (status === 'Aktif') {
        return 'Telah diluluskan dan berkuatkuasa dalam sistem';
      } else if (status === 'Menunggu Kelulusan') {
        return 'Menunggu kelulusan dari Ketua Divisyen';
      } else if (status === 'Tidak Aktif') {
        return 'Telah ditolak oleh Ketua Divisyen';
      } else {
        return 'Belum sampai tahap kelulusan';
      }
    default:
      return '';
  }
};

const getCurrentStatusDescription = () => {
  const status = categoryData.value.status;
  const descriptions = {
    'Aktif': 'Kategori telah diluluskan sepenuhnya dan berkuatkuasa dalam sistem',
    'Menunggu Pengesahan': 'Kategori sedang menunggu pengesahan dari Ketua Jabatan',
    'Menunggu Kelulusan': 'Kategori sedang menunggu kelulusan akhir dari Ketua Divisyen',
    'Tidak Aktif': 'Kategori telah ditolak atau dinyahaktifkan'
  };
  return descriptions[status] || 'Status tidak diketahui';
};

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