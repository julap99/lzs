<!-- 
  RTMF SCREEN: PA-PE-AB2-06
  PURPOSE: Semakan dan Kelulusan (Ketua Divisyen)
  DESCRIPTION: Final verification and approval by Division Head for assignment allowances
  ROUTE: /BF-PA/PE/AB2/06
-->
<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />

    <rs-card class="mt-4">
      <template #header>
        <div class="flex justify-between items-center">
          <h2 class="text-xl font-semibold">
            Semakan dan Kelulusan (Ketua Divisyen)
          </h2>
          <rs-badge
            v-if="application.status"
            :variant="getStatusVariant(application.status)"
          >
            {{ application.status }}
          </rs-badge>
        </div>
      </template>

      <template #body>
        <div class="p-4">
          <!-- Maklumat Aktiviti -->
          <div class="mb-6">
            <h3 class="text-lg font-semibold mb-4">Maklumat Aktiviti</h3>
            <div class="bg-gray-50 p-4 rounded-lg">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p class="text-sm text-gray-500">No. Rujukan</p>
                  <p class="font-medium">{{ application.referenceNo }}</p>
                </div>
                <div>
                  <p class="text-sm text-gray-500">Nama Aktiviti</p>
                  <p class="font-medium">{{ application.activityName }}</p>
                </div>
                <div>
                  <p class="text-sm text-gray-500">Jenis Aktiviti</p>
                  <p class="font-medium">{{ getActivityTypeLabel(application.activityType) }}</p>
                </div>
                <div>
                  <p class="text-sm text-gray-500">Tarikh Aktiviti</p>
                  <p class="font-medium">{{ application.activityDate }}</p>
                </div>
                <div>
                  <p class="text-sm text-gray-500">Lokasi</p>
                  <p class="font-medium">{{ application.location }}</p>
                </div>
                <div>
                  <p class="text-sm text-gray-500">Status</p>
                  <span
                    class="px-2 py-1 text-xs font-medium rounded-full"
                    :class="getStatusClass(application.status)"
                  >
                    {{ application.status }}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <!-- Maklumat Pengiraan Elaun -->
          <div class="mb-6">
            <h3 class="text-lg font-semibold mb-4">Maklumat Pengiraan Elaun</h3>
            <div class="bg-gray-50 p-4 rounded-lg">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p class="text-sm text-gray-500">Lokasi Kariah</p>
                  <p class="font-medium">{{ application.kariahLocation }}</p>
                </div>
                <div>
                  <p class="text-sm text-gray-500">Tarikh Tugasan Tamat</p>
                  <p class="font-medium">{{ application.assignmentEndDate }}</p>
                </div>
                <div>
                  <p class="text-sm text-gray-500">Jenis Tugasan</p>
                  <p class="font-medium">{{ getAssignmentTypeLabel(application.assignmentType) }}</p>
                </div>
                <div>
                  <p class="text-sm text-gray-500">Jumlah Penolong Amil</p>
                  <p class="font-medium">{{ application.totalPenolongAmil }} orang</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Tables Section -->
          <div class="mb-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <!-- Senarai Penolong Amil -->
              <div>
                <h3 class="text-lg font-semibold mb-4">Senarai Penolong Amil</h3>
                <div class="bg-gray-50 p-4 rounded-lg">
                  <div class="overflow-x-auto">
                    <table class="min-w-full divide-y divide-gray-200">
                      <thead class="bg-white">
                        <tr>
                          <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            No.
                          </th>
                          <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Nama Penolong Amil
                          </th>
                          <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Total Elaun
                          </th>
                        </tr>
                      </thead>
                      <tbody class="bg-white divide-y divide-gray-200">
                        <tr v-for="(pa, index) in penolongAmil" :key="pa.id">
                          <td class="px-6 py-4 whitespace-nowrap">
                            {{ index + 1 }}
                          </td>
                          <td class="px-6 py-4 whitespace-nowrap">
                            {{ pa.name }}
                          </td>
                          <td class="px-6 py-4 whitespace-nowrap font-medium text-blue-600">
                            RM {{ pa.totalAllowance }}
                          </td>
                        </tr>
                      </tbody>
                      <tfoot class="bg-white">
                        <tr>
                          <td colspan="2" class="px-6 py-4 text-right font-medium">
                            Jumlah Keseluruhan:
                          </td>
                          <td class="px-6 py-4 font-medium text-blue-600">
                            RM {{ totalAllowance }}
                          </td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                </div>
              </div>

              <!-- Senarai Aktiviti -->
              <div>
                <h3 class="text-lg font-semibold mb-4">Senarai Aktiviti</h3>
                <div class="bg-gray-50 p-4 rounded-lg">
                  <div class="overflow-x-auto">
                    <table class="min-w-full divide-y divide-gray-200">
                      <thead class="bg-white">
                        <tr>
                          <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Aktiviti
                          </th>
                          <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Kadar Elaun
                          </th>
                        </tr>
                      </thead>
                      <tbody class="bg-white divide-y divide-gray-200">
                        <tr v-for="activity in activities" :key="activity.id">
                          <td class="px-6 py-4 whitespace-nowrap">
                            {{ activity.name }}
                          </td>
                          <td class="px-6 py-4 whitespace-nowrap text-center text-blue-600">
                            RM {{ activity.allowanceRate }}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Approval History -->
          <div class="mb-6">
            <h3 class="text-lg font-semibold mb-4">Sejarah Kelulusan</h3>
            <div class="bg-gray-50 p-4 rounded-lg">
              <div class="space-y-3">
                <div class="flex items-center justify-between p-3 bg-white rounded-lg border">
                  <div class="flex items-center space-x-3">
                    <rs-badge variant="success" size="sm">JPPA</rs-badge>
                    <span class="text-sm font-medium">Sokongan JPPA</span>
                  </div>
                  <div class="text-right">
                    <p class="text-sm text-gray-600">{{ application.jppaApprovalDate }}</p>
                    <p class="text-xs text-gray-500">oleh {{ application.jppaApprover }}</p>
                  </div>
                </div>
                <div class="flex items-center justify-between p-3 bg-white rounded-lg border">
                  <div class="flex items-center space-x-3">
                    <rs-badge variant="warning" size="sm">Ketua Jabatan</rs-badge>
                    <span class="text-sm font-medium">Kelulusan Ketua Jabatan</span>
                  </div>
                  <div class="text-right">
                    <p class="text-sm text-gray-600">{{ application.ketuaJabatanApprovalDate }}</p>
                    <p class="text-xs text-gray-500">oleh {{ application.ketuaJabatanApprover }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Penilaian Ketua Divisyen -->
          <div class="mb-6">
            <FormKit
              type="form"
              id="approvalForm"
              @submit="handleSubmit"
              v-model="approvalData"
            >
              <div class="space-y-4">
                <h3 class="text-lg font-semibold">Penilaian Ketua Divisyen</h3>
                
                <FormKit
                  type="textarea"
                  name="comments"
                  label="Ulasan (Opsional)"
                  placeholder="Masukkan ulasan atau komen jika perlu..."
                  :classes="{
                    input: '!py-2',
                  }"
                />

                <div class="flex items-center space-x-4">
                  <FormKit
                    type="radio"
                    name="decision"
                    label="Keputusan"
                    :options="[
                      { label: 'Lulus', value: 'lulus' },
                      { label: 'Tolak', value: 'tolak' }
                    ]"
                    validation="required"
                    :validation-messages="{
                      required: 'Keputusan diperlukan',
                    }"
                  />
                </div>

                <div v-if="approvalData.decision === 'tolak'" class="mt-4">
                  <FormKit
                    type="textarea"
                    name="rejectionReason"
                    label="Sebab Penolakan"
                    placeholder="Masukkan sebab penolakan..."
                    validation="required"
                    :validation-messages="{
                      required: 'Sebab penolakan diperlukan',
                    }"
                    :classes="{
                      input: '!py-2',
                    }"
                  />
                </div>
              </div>

              <!-- Action Buttons -->
              <div class="flex justify-end gap-4 mt-6">
                <rs-button
                  variant="primary-outline"
                  @click="navigateTo('/BF-PA/PE/AB2')"
                >
                  Kembali
                </rs-button>
                <rs-button
                  type="submit"
                  variant="primary"
                  :disabled="!approvalData.decision"
                >
                  {{ approvalData.decision === 'lulus' ? 'Lulus' : 'Tolak' }}
                </rs-button>
              </div>
            </FormKit>
          </div>
        </div>
      </template>
    </rs-card>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute } from 'nuxt/app';
import { useToast } from 'vue-toastification';

definePageMeta({
  title: "Semakan dan Kelulusan (Ketua Divisyen)",
  description: "Final verification and approval by Division Head",
});

const route = useRoute();
const toast = useToast();

const breadcrumb = ref([
  {
    name: "Pengurusan Elaun",
    type: "link",
    path: "/BF-PA/PE",
  },
  {
    name: "Elaun Tugasan",
    type: "link",
    path: "/BF-PA/PE/AB2",
  },
  {
    name: "Kelulusan Ketua Divisyen",
    type: "current",
    path: "/BF-PA/PE/AB2/06",
  },
]);

// Mock application data
const application = ref({
  referenceNo: 'REF/2024/001',
  activityName: 'Program Khidmat Masyarakat',
  activityType: 'PROGRAM',
  activityDate: '2024-03-15',
  location: 'Masjid Al-Amin, Shah Alam',
  status: 'Menunggu Kelulusan Ketua Divisyen',
  kariahLocation: 'Masjid Al-Amin',
  assignmentEndDate: '2024-03-20',
  assignmentType: 'KARIAH',
  totalPenolongAmil: 5,
  jppaApprovalDate: '2024-03-16',
  jppaApprover: 'Ahmad bin Abdullah',
  ketuaJabatanApprovalDate: '2024-03-17',
  ketuaJabatanApprover: 'Mohd Ali bin Hassan'
});

// Mock penolong amil data
const penolongAmil = ref([
  { id: 1, name: 'Ahmad bin Abdullah', totalAllowance: 500.00 },
  { id: 2, name: 'Mohd Ali bin Hassan', totalAllowance: 500.00 },
  { id: 3, name: 'Siti Fatimah binti Omar', totalAllowance: 500.00 },
  { id: 4, name: 'Abdul Rahman bin Ismail', totalAllowance: 500.00 },
  { id: 5, name: 'Nurul Ain binti Ahmad', totalAllowance: 500.00 }
]);

// Mock activities data
const activities = ref([
  { id: 1, name: 'Program Khidmat Masyarakat', allowanceRate: 100.00 }
]);

// Approval form data
const approvalData = ref({
  decision: '',
  comments: '',
  rejectionReason: ''
});

// Computed properties
const totalAllowance = computed(() => {
  return penolongAmil.value.reduce((total, pa) => total + pa.totalAllowance, 0);
});

// Helper functions
const getActivityTypeLabel = (type) => {
  const types = {
    'PROGRAM': 'Program',
    'MESYUARAT': 'Mesyuarat',
    'TUGASAN': 'Tugasan'
  };
  return types[type] || type;
};

const getAssignmentTypeLabel = (type) => {
  const types = {
    'KARIAH': 'Kariah',
    'FITRAH': 'Fitrah',
    'PADI': 'Padi',
    'WAKAF': 'Wakaf'
  };
  return types[type] || type;
};

const getStatusClass = (status) => {
  switch (status) {
    case 'Menunggu Kelulusan Ketua Divisyen':
      return 'bg-purple-100 text-purple-800'
    case 'Diluluskan':
      return 'bg-green-100 text-green-800'
    case 'Ditolak':
      return 'bg-red-100 text-red-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
};

const getStatusVariant = (status) => {
  switch (status) {
    case 'Menunggu Kelulusan Ketua Divisyen':
      return 'warning'
    case 'Diluluskan':
      return 'success'
    case 'Ditolak':
      return 'danger'
    default:
      return 'secondary'
  }
};

// Form submission
const handleSubmit = async () => {
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (approvalData.value.decision === 'lulus') {
      application.value.status = 'Diluluskan';
      toast.success('Elaun berjaya diluluskan oleh Ketua Divisyen');
      // Navigate to payment advice screen
      navigateTo('/BF-PA/PE/AB2/04');
    } else {
      application.value.status = 'Ditolak';
      toast.success('Elaun telah ditolak oleh Ketua Divisyen');
      // Navigate to rejection screen
      navigateTo('/BF-PA/PE/AB2/07');
    }
  } catch (error) {
    toast.error('Ralat semasa memproses kelulusan');
  }
};

// Load data on mount
onMounted(() => {
  // Load application data based on route params if needed
  console.log('Loading Ketua Divisyen approval screen');
});
</script>

<style scoped>
/* Add any additional styles here */
</style> 