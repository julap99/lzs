<!-- 
  RTMF SCREEN: PA-PP-PD-01_02
  PURPOSE: Centralized Detail View - Maklumat Penolong Amil Terperinci
  DESCRIPTION: Role-aware detailed information view for Penolong Amil applications
  ROUTE: /BF-PA/PP/pra-daftar-v3/detail/[rujukan]
-->
<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />

    <!-- Compact Workflow Widget -->
    <div class="mb-4">
      <rs-card>
        <template #header>
          <div class="flex justify-between items-center">
            <h3 class="text-lg font-semibold text-gray-900">
              Proses Verifikasi Calon Penolong Amil
            </h3>
            <rs-badge :variant="getCurrentRoleBadgeVariant()">
              {{ getCurrentRoleLabel() }}
            </rs-badge>
          </div>
        </template>
        <template #body>
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-2">
              <div 
                v-for="(step, index) in workflowSteps" 
                :key="step.key"
                class="flex items-center"
              >
                <div class="flex flex-col items-center">
                  <div 
                    :class="[
                      'w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium',
                      getStepVariant(step.key)
                    ]"
                  >
                    <Icon 
                      v-if="step.icon" 
                      :name="step.icon" 
                      class="w-4 h-4"
                    />
                    <span v-else>{{ index + 1 }}</span>
                  </div>
                  <span class="text-xs mt-1 text-center max-w-16">{{ step.label }}</span>
                </div>
                <div 
                  v-if="index < workflowSteps.length - 1"
                  :class="[
                    'h-1 w-8 mx-1',
                    getStepLineVariant(step.key)
                  ]"
                ></div>
              </div>
            </div>
          </div>
        </template>
      </rs-card>
    </div>

    <rs-card class="mt-4">
      <template #header>
        <div class="flex justify-between items-center">
          <h2 class="text-xl font-semibold">
            Maklumat Terperinci Penolong Amil
          </h2>
          <div class="flex gap-2">
            <rs-button
              variant="secondary-outline"
              @click="handleBack"
            >
              <Icon name="ph:arrow-left" class="w-4 h-4 mr-1" />
              Kembali
            </rs-button>
            <rs-button
              v-if="canEdit"
              variant="primary"
              @click="handleEdit"
            >
              <Icon name="ph:pencil" class="w-4 h-4 mr-1" />
              Kemaskini
            </rs-button>
            <rs-button
              variant="info"
              @click="handleViewProcessTrace"
              title="PA-PP-PD-01_04: Jejak Proses"
            >
              <Icon name="ph:flow-arrow" class="w-4 h-4 mr-1" />
              Jejak Proses
            </rs-button>
          </div>
        </div>
      </template>

      <template #body>
        <div class="p-4">
          <!-- Application Status -->
          <div class="mb-6 p-4 bg-gray-50 border border-gray-200 rounded-lg">
            <div class="flex justify-between items-center">
              <div>
                <h3 class="text-lg font-semibold text-gray-900">
                  Status Permohonan
                </h3>
                <p class="text-sm text-gray-600">
                  Rujukan: {{ application.rujukan }}
                </p>
              </div>
              <div class="flex gap-2">
                <rs-badge :variant="getStatusPendaftaranVariant(application.statusPendaftaran)">
                  {{ application.statusPendaftaran }}
                </rs-badge>
                <rs-badge :variant="getStatusLantikanVariant(application.statusLantikan)">
                  {{ application.statusLantikan }}
                </rs-badge>
              </div>
            </div>
          </div>

          <!-- Personal Information -->
          <div class="mb-6 p-6 border border-gray-200 rounded-lg">
            <h3 class="text-lg font-semibold mb-4 text-gray-900">
              Maklumat Peribadi
            </h3>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Nombor Kad Pengenalan
                </label>
                <p class="text-gray-900">{{ application.noKP }}</p>
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Nama Penuh
                </label>
                <p class="text-gray-900">{{ application.nama }}</p>
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Jantina
                </label>
                <p class="text-gray-900">{{ application.jantina }}</p>
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Bangsa
                </label>
                <p class="text-gray-900">{{ application.bangsa }}</p>
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Tarikh Lahir
                </label>
                <p class="text-gray-900">{{ application.tarikhLahir }}</p>
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Tempat Lahir
                </label>
                <p class="text-gray-900">{{ application.tempatLahir }}</p>
              </div>
            </div>
          </div>

          <!-- Contact Information -->
          <div class="mb-6 p-6 border border-gray-200 rounded-lg">
            <h3 class="text-lg font-semibold mb-4 text-gray-900">
              Maklumat Perhubungan
            </h3>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Alamat Rumah
                </label>
                <p class="text-gray-900">{{ application.alamatRumah }}</p>
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Alamat Pejabat
                </label>
                <p class="text-gray-900">{{ application.alamatPejabat }}</p>
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Nombor Telefon
                </label>
                <p class="text-gray-900">{{ application.nomborTelefon }}</p>
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Alamat E-mel
                </label>
                <p class="text-gray-900">{{ application.alamatEmel }}</p>
              </div>
            </div>
          </div>

          <!-- Professional Information -->
          <div class="mb-6 p-6 border border-gray-200 rounded-lg">
            <h3 class="text-lg font-semibold mb-4 text-gray-900">
              Maklumat Profesional
            </h3>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Kategori Penolong Amil
                </label>
                <p class="text-gray-900">{{ application.kategoriPenolongAmil }}</p>
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Jawatan
                </label>
                <p class="text-gray-900">{{ application.jawatan }}</p>
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Institusi Kariah
                </label>
                <p class="text-gray-900">{{ application.institusiKariah }}</p>
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Sesi Perkhidmatan
                </label>
                <p class="text-gray-900">{{ application.sesiPerkhidmatan }}</p>
              </div>
            </div>
          </div>

          <!-- Documents Section -->
          <div class="mb-6 p-6 border border-gray-200 rounded-lg">
            <h3 class="text-lg font-semibold mb-4 text-gray-900">
              Dokumen Sokongan
            </h3>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <!-- Salinan Kad Pengenalan -->
              <div>
                <h4 class="font-medium mb-3">Salinan Kad Pengenalan</h4>
                <div class="border border-gray-200 rounded-md">
                  <div class="bg-gray-50 p-3 border-b border-gray-200 flex justify-between items-center">
                    <div class="flex items-center">
                      <Icon name="heroicons:document-text" class="text-blue-600 mr-2" size="20" />
                      <span>{{ application.salinanKadPengenalan }}</span>
                    </div>
                    <rs-button size="sm" variant="primary-outline" @click="previewDocument('salinanKadPengenalan')">
                      <Icon name="heroicons:eye" class="mr-1" size="16" />
                      Lihat Dokumen
                    </rs-button>
                  </div>
                  <div class="p-3 bg-gray-50 text-sm text-gray-500">
                    Dimuat naik oleh {{ application.nama }} pada {{ application.uploadDate }}
                  </div>
                </div>
              </div>

              <!-- Surat Sokongan (if exists) -->
              <div v-if="application.suratSokongan">
                <h4 class="font-medium mb-3">Surat Sokongan</h4>
                <div class="border border-gray-200 rounded-md">
                  <div class="bg-gray-50 p-3 border-b border-gray-200 flex justify-between items-center">
                    <div class="flex items-center">
                      <Icon name="heroicons:document-text" class="text-blue-600 mr-2" size="20" />
                      <span>{{ application.suratSokongan }}</span>
                    </div>
                    <rs-button size="sm" variant="primary-outline" @click="previewDocument('suratSokongan')">
                      <Icon name="heroicons:eye" class="mr-1" size="16" />
                      Lihat Dokumen
                    </rs-button>
                  </div>
                  <div class="p-3 bg-gray-50 text-sm text-gray-500">
                    Dimuat naik oleh {{ application.nama }} pada {{ application.uploadDate }}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Role-Specific Actions -->
          <div v-if="showRoleActions" class="mb-6 p-6 border border-gray-200 rounded-lg">
            <h3 class="text-lg font-semibold mb-4 text-gray-900">
              Tindakan {{ getCurrentRoleLabel() }}
            </h3>
            
            <div class="flex gap-3">
              <!-- Eksekutif Pengurusan Risiko Actions -->
              <rs-button
                v-if="currentRole === 'eksekutif-pengurusan-risiko'"
                variant="info"
                @click="handleScreening"
              >
                <Icon name="ph:shield-check" class="w-4 h-4 mr-1" />
                Saringan
              </rs-button>

              <!-- PT Actions -->
              <rs-button
                v-if="currentRole === 'pt'"
                variant="info"
                @click="handleReview"
              >
                <Icon name="ph:clipboard-text" class="w-4 h-4 mr-1" />
                Semak
              </rs-button>

              <!-- Eksekutif Actions -->
              <rs-button
                v-if="currentRole === 'eksekutif'"
                variant="success"
                @click="handleSupport"
              >
                <Icon name="ph:thumbs-up" class="w-4 h-4 mr-1" />
                Sokong
              </rs-button>

              <!-- Ketua Jabatan Actions -->
              <rs-button
                v-if="currentRole === 'ketua-jabatan'"
                variant="success"
                @click="handleConfirm"
              >
                <Icon name="ph:check-circle" class="w-4 h-4 mr-1" />
                Sahkan
              </rs-button>

              <!-- Ketua Divisyen Actions -->
              <rs-button
                v-if="currentRole === 'ketua-divisyen'"
                variant="primary"
                @click="handleApprove"
              >
                <Icon name="ph:check-circle" class="w-4 h-4 mr-1" />
                Lulus
              </rs-button>
            </div>
          </div>

          <!-- Verification History -->
          <div v-if="showVerificationHistory" class="mb-6 p-6 border border-gray-200 rounded-lg">
            <h3 class="text-lg font-semibold mb-4 text-gray-900">
              Sejarah Verifikasi
            </h3>
            
            <div class="space-y-3">
              <div 
                v-for="verification in verificationHistory" 
                :key="verification.id"
                class="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div class="flex items-center">
                  <Icon 
                    :name="verification.icon" 
                    class="w-5 h-5 mr-3"
                    :class="verification.iconColor"
                  />
                  <div>
                    <p class="font-medium">{{ verification.role }}</p>
                    <p class="text-sm text-gray-600">{{ verification.action }}</p>
                  </div>
                </div>
                <div class="text-right">
                  <p class="text-sm text-gray-600">{{ verification.date }}</p>
                  <rs-badge :variant="verification.statusVariant">
                    {{ verification.status }}
                  </rs-badge>
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>
    </rs-card>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";

definePageMeta({
  title: "Maklumat Terperinci Penolong Amil",
  description: "Maklumat terperinci penolong amil dengan verifikasi berperingkat",
});

const route = useRoute();
const currentRole = ref(route.query.role || "pyb"); // Read from query parameter

const breadcrumb = ref([
  {
    name: "Penolong Amil",
    type: "link",
    path: "/BF-PA/PP/PM/01",
  },
  {
    name: "Pendaftaran",
    type: "link",
    path: "/BF-PA/PP/PM/01",
  },
  {
    name: "Pra Daftar V3",
    type: "link",
    path: "/BF-PA/PP/pra-daftar-v3",
  },
  {
    name: "Maklumat Terperinci",
    type: "current",
    path: `/BF-PA/PP/pra-daftar-v3/detail/${route.params.rujukan}`,
  },
]);

// Workflow steps based on role hierarchy
const workflowSteps = computed(() => {
  const steps = [
    { key: 'registration', label: 'Pendaftaran', icon: 'ph:user-plus' },
    { key: 'screening', label: 'Saringan', icon: 'ph:shield-check' },
    { key: 'review', label: 'Semakan PT', icon: 'ph:clipboard-text' },
    { key: 'support', label: 'Sokongan', icon: 'ph:thumbs-up' },
    { key: 'confirmation', label: 'Pengesahan', icon: 'ph:check-circle' },
    { key: 'approval', label: 'Kelulusan', icon: 'ph:check-circle' }
  ];

  // Show only steps up to current role's position
  const roleHierarchy = {
    'pyb': 1,
    'eksekutif-pengurusan-risiko': 2,
    'pt': 3,
    'eksekutif': 4,
    'ketua-jabatan': 5,
    'ketua-divisyen': 6
  };

  const maxSteps = roleHierarchy[currentRole.value] || 1;
  return steps.slice(0, maxSteps);
});

// Mock application data
const application = ref({
  rujukan: route.params.rujukan,
  nama: "Ahmad bin Abdullah",
  noKP: "901231012345",
  jantina: "Lelaki",
  bangsa: "Melayu",
  tarikhLahir: "15/12/1990",
  tempatLahir: "Kuala Lumpur",
  alamatRumah: "No. 123, Jalan Ampang, 68000 Ampang, Selangor",
  alamatPejabat: "No. 456, Jalan Tun Razak, 50400 Kuala Lumpur",
  nomborTelefon: "012-3456789",
  alamatEmel: "ahmad.abdullah@email.com",
  kategoriPenolongAmil: "Fitrah",
  jawatan: "Penolong Amil Fitrah",
  institusiKariah: "Masjid Negeri Selangor",
  sesiPerkhidmatan: "Sesi 1",
  statusPendaftaran: "Telah Disokong",
  statusLantikan: "Menunggu",
  salinanKadPengenalan: "salinan_kp_ahmad.pdf",
  suratSokongan: "surat_sokongan_ahmad.pdf",
  uploadDate: "15/01/2024"
});

// Verification history based on current role
const verificationHistory = computed(() => {
  const history = [
    {
      id: 1,
      role: "PYB Institusi",
      action: "Mendaftar calon",
      date: "15/01/2024",
      status: "Selesai",
      statusVariant: "success",
      icon: "ph:user-plus",
      iconColor: "text-green-500"
    }
  ];

  // Add screening if role can see it
  if (canSeeStep('screening')) {
    history.push({
      id: 2,
      role: "Jabatan Pengurusan Risiko",
      action: "Saringan calon",
      date: "16/01/2024",
      status: "Selesai",
      statusVariant: "success",
      icon: "ph:shield-check",
      iconColor: "text-blue-500"
    });
  }

  // Add PT review if role can see it
  if (canSeeStep('review')) {
    history.push({
      id: 3,
      role: "PT",
      action: "Semakan dokumen",
      date: "17/01/2024",
      status: "Selesai",
      statusVariant: "success",
      icon: "ph:clipboard-text",
      iconColor: "text-purple-500"
    });
  }

  // Add executive support if role can see it
  if (canSeeStep('support')) {
    history.push({
      id: 4,
      role: "Eksekutif",
      action: "Sokongan eksekutif",
      date: "18/01/2024",
      status: "Selesai",
      statusVariant: "success",
      icon: "ph:thumbs-up",
      iconColor: "text-green-500"
    });
  }

  // Add department confirmation if role can see it
  if (canSeeStep('confirmation')) {
    history.push({
      id: 5,
      role: "Ketua Jabatan",
      action: "Pengesahan jabatan",
      date: "19/01/2024",
      status: "Selesai",
      statusVariant: "success",
      icon: "ph:check-circle",
      iconColor: "text-blue-500"
    });
  }

  // Add division approval if role can see it
  if (canSeeStep('approval')) {
    history.push({
      id: 6,
      role: "Ketua Divisyen",
      action: "Kelulusan akhir",
      date: "20/01/2024",
      status: "Dalam Proses",
      statusVariant: "warning",
      icon: "ph:check-circle",
      iconColor: "text-orange-500"
    });
  }

  return history;
});

// Computed properties
const canEdit = computed(() => {
  return currentRole.value === 'pyb' && 
         ['Draf', 'Dihantar'].includes(application.value.statusPendaftaran);
});

const showRoleActions = computed(() => {
  return ['eksekutif-pengurusan-risiko', 'pt', 'eksekutif', 'ketua-jabatan', 'ketua-divisyen'].includes(currentRole.value);
});

const showVerificationHistory = computed(() => {
  return verificationHistory.value.length > 0;
});

// Helper functions
const canSeeStep = (step) => {
  const roleHierarchy = {
    'pyb': ['registration'],
    'eksekutif-pengurusan-risiko': ['registration', 'screening'],
    'pt': ['registration', 'screening', 'review'],
    'eksekutif': ['registration', 'screening', 'review', 'support'],
    'ketua-jabatan': ['registration', 'screening', 'review', 'support', 'confirmation'],
    'ketua-divisyen': ['registration', 'screening', 'review', 'support', 'confirmation', 'approval']
  };

  return roleHierarchy[currentRole.value]?.includes(step) || false;
};

const getStepVariant = (step) => {
  if (canSeeStep(step)) {
    return 'bg-green-100 text-green-800 border-2 border-green-300';
  }
  return 'bg-gray-100 text-gray-400 border-2 border-gray-200';
};

const getStepLineVariant = (step) => {
  if (canSeeStep(step)) {
    return 'bg-green-300';
  }
  return 'bg-gray-200';
};

const getCurrentRoleLabel = () => {
  const roleLabels = {
    'pyb': 'PYB Institusi',
    'eksekutif-pengurusan-risiko': 'Jabatan Pengurusan Risiko',
    'pt': 'PT',
    'eksekutif': 'Eksekutif',
    'ketua-jabatan': 'Ketua Jabatan',
    'ketua-divisyen': 'Ketua Divisyen'
  };
  return roleLabels[currentRole.value] || '';
};

const getCurrentRoleBadgeVariant = () => {
  const badgeVariants = {
    'pyb': 'default',
    'eksekutif-pengurusan-risiko': 'info',
    'pt': 'warning',
    'eksekutif': 'success',
    'ketua-jabatan': 'warning',
    'ketua-divisyen': 'primary'
  };
  return badgeVariants[currentRole.value] || 'default';
};

const getStatusPendaftaranVariant = (status) => {
  const variants = {
    'Draf': 'default',
    'Dihantar': 'warning',
    'Telah Disaring': 'info',
    'Telah Disemak': 'info',
    'Telah Disokong': 'success',
    'Telah Disahkan': 'success',
    'Telah Diluluskan': 'success',
    'Ditolak': 'danger'
  };
  return variants[status] || 'default';
};

const getStatusLantikanVariant = (status) => {
  const variants = {
    'Menunggu': 'warning',
    'Dilantik': 'info',
    'Aktif': 'success',
    'Tidak Aktif': 'secondary',
    'Ditamatkan': 'danger'
  };
  return variants[status] || 'default';
};

// Action handlers with proper navigation
const handleBack = () => {
  // Navigate back to the appropriate dashboard based on role
  const dashboardPaths = {
    'pyb': '/BF-PA/PP/pra-daftar-v3',
    'eksekutif-pengurusan-risiko': '/BF-PA/PP/pra-daftar-v3',
    'pt': '/BF-PA/PP/pra-daftar-v3',
    'eksekutif': '/BF-PA/PP/pra-daftar-v3',
    'ketua-jabatan': '/BF-PA/PP/pra-daftar-v3',
    'ketua-divisyen': '/BF-PA/PP/pra-daftar-v3'
  };
  
  navigateTo(dashboardPaths[currentRole.value] || '/BF-PA/PP/pra-daftar-v3');
};

const handleEdit = () => {
  navigateTo(`/BF-PA/PP/pra-daftar-v3/edit/${route.params.rujukan}`);
};

const handleViewProcessTrace = () => {
  navigateTo(`/BF-PA/PP/pra-daftar-v3/process-trace/${route.params.rujukan}`);
};

const handleScreening = () => {
  navigateTo(`/BF-PA/PP/pra-daftar-v3/jabatan-risiko/detail/${route.params.rujukan}`);
};

const handleReview = () => {
  navigateTo(`/BF-PA/PP/pra-daftar-v3/PT/detail/${route.params.rujukan}`);
};

const handleSupport = () => {
  navigateTo(`/BF-PA/PP/pra-daftar-v3/eksekutif/detail/${route.params.rujukan}`);
};

const handleConfirm = () => {
  navigateTo(`/BF-PA/PP/pra-daftar-v3/ketua-jabatan/detail/${route.params.rujukan}`);
};

const handleApprove = () => {
  navigateTo(`/BF-PA/PP/pra-daftar-v3/ketua-divisyen/detail/${route.params.rujukan}`);
};

const previewDocument = (documentType) => {
  // Simulate document preview
  alert(`Melihat dokumen: ${documentType}`);
};
</script>

<style scoped>
/* Custom styles for RTMF compliance */
</style> 