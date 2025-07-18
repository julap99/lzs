<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />

    <rs-card class="mt-4">
      <template #header>
        <div class="flex justify-between items-center">
          <h2 class="text-xl font-semibold">
            Maklumat Aktiviti Mesyuarat/Program
          </h2>
        </div>
      </template>

      <template #body>
        <div class="p-4">
          <!-- Activity Information -->
          <div class="mb-6">
            <h3 class="text-lg font-semibold mb-4">Maklumat Aktiviti</h3>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p class="text-sm text-gray-500">ID Aktiviti</p>
                <p class="font-medium text-blue-600">{{ activityInfo.id }}</p>
              </div>
              <div>
                <p class="text-sm text-gray-500">Nama Aktiviti</p>
                <p class="font-medium">{{ activityInfo.name }}</p>
              </div>
              <div>
                <p class="text-sm text-gray-500">Jenis Aktiviti</p>
                <p class="font-medium">{{ activityInfo.type }}</p>
              </div>
              <div>
                <p class="text-sm text-gray-500">Tarikh</p>
                <p class="font-medium">{{ activityInfo.date }}</p>
              </div>
              <div>
                <p class="text-sm text-gray-500">Lokasi</p>
                <p class="font-medium">{{ activityInfo.location }}</p>
              </div>
              <div>
                <p class="text-sm text-gray-500">Status</p>
                <span
                  class="px-2 py-1 text-xs font-medium rounded-full"
                  :class="getStatusClass(activityInfo.status)"
                >
                  {{ activityInfo.status }}
                </span>
              </div>
            </div>
          </div>

          <!-- Attendance Summary -->
          <div class="mb-6">
            <h3 class="text-lg font-semibold mb-4">Ringkasan Kehadiran</h3>
            
            <div class="bg-blue-50 p-4 rounded-lg">
              <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div class="text-center">
                  <p class="text-sm text-gray-500">Jumlah Diundang</p>
                  <p class="text-2xl font-bold text-blue-600">{{ attendanceSummary.totalInvited }}</p>
                </div>
                <div class="text-center">
                  <p class="text-sm text-gray-500">Jumlah Hadir</p>
                  <p class="text-2xl font-bold text-green-600">{{ attendanceSummary.totalAttended }}</p>
                </div>
                <div class="text-center">
                  <p class="text-sm text-gray-500">Peratusan Kehadiran</p>
                  <p class="text-2xl font-bold text-purple-600">{{ attendanceSummary.attendanceRate }}%</p>
                </div>
                <div class="text-center">
                  <p class="text-sm text-gray-500">Jumlah Elaun</p>
                  <p class="text-2xl font-bold text-orange-600">RM {{ attendanceSummary.totalAllowance }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Penolong Amil Attendance List -->
          <div class="mb-6">
            <h3 class="text-lg font-semibold mb-4">Senarai Kehadiran Penolong Amil</h3>
            
            <div class="overflow-x-auto">
              <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                  <tr>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      No.
                    </th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Nama Penolong Amil
                    </th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status Kehadiran
                    </th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Masa Daftar Masuk
                    </th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Elaun
                    </th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                  <tr v-for="(pa, index) in penolongAmil" :key="pa.id">
                    <td class="px-6 py-4 whitespace-nowrap">
                      {{ index + 1 }}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <a 
                        href="#" 
                        class="text-blue-600 hover:text-blue-800"
                        @click.prevent="navigateTo(`/BF-PA/PE/MP/${activityInfo.id}/PA_Aktiviti/${pa.id}`)"
                      >
                        {{ pa.name }}
                      </a>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <span
                        class="px-2 py-1 text-xs font-medium rounded-full"
                        :class="getAttendanceStatusClass(pa.attended)"
                      >
                        {{ pa.attended ? 'Hadir' : 'Tidak Hadir' }}
                      </span>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      {{ pa.checkInTime || '-' }}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <span :class="pa.attended ? 'text-green-600 font-medium' : 'text-gray-400'">
                        RM {{ pa.attended ? pa.allowanceRate : '0.00' }}
                      </span>
                    </td>
                  </tr>
                </tbody>
                <tfoot class="bg-gray-50">
                  <tr>
                    <td colspan="4" class="px-6 py-4 text-right font-medium">
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

          <!-- Action Buttons -->
          <div class="flex justify-end gap-4 mt-6">
            <rs-button
              variant="primary-outline"
              @click="navigateTo('/BF-PA/PE/MP')"
            >
              Kembali
            </rs-button>
          </div>
        </div>
      </template>
    </rs-card>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const activityId = route.params.id;

definePageMeta({
  title: "Maklumat Aktiviti Mesyuarat/Program",
  description: "Maklumat aktiviti dan kehadiran penolong amil",
});

const breadcrumb = ref([
  {
    name: "Pengurusan Elaun",
    type: "link",
    path: "/BF-PA/PE/MP",
  },
  {
    name: "Maklumat Aktiviti",
    type: "current",
    path: `/BF-PA/PE/MP/${activityId}`,
  },
]);

// Mock activity data - will be loaded based on ID
const activityInfo = ref({
  id: '',
  name: '',
  type: '',
  date: '',
  location: '',
  status: '',
});

// Mock attendance summary
const attendanceSummary = ref({
  totalInvited: 0,
  totalAttended: 0,
  attendanceRate: 0,
  totalAllowance: '0.00',
});

// Mock Penolong Amil data
const penolongAmil = ref([]);

// Mock data for different activity IDs
const activityDataMap = {
  'M001': {
    id: 'M001',
    name: 'Mesyuarat JPPA Bulanan',
    type: 'Mesyuarat',
    date: '15/03/2024',
    location: 'Dewan Mesyuarat JPPA',
    status: 'Menunggu Sokongan JPPA',
    allowanceRate: '50.00',
    penolongAmil: [
      {
        id: 'PA001',
        name: 'Ahmad bin Abdullah',
        attended: true,
        checkInTime: '08:45',
        allowanceRate: '50.00',
      },
      {
        id: 'PA002',
        name: 'Siti Aminah binti Hassan',
        attended: true,
        checkInTime: '09:00',
        allowanceRate: '50.00',
      },
      {
        id: 'PA003',
        name: 'Mohd Razak bin Ibrahim',
        attended: false,
        checkInTime: null,
        allowanceRate: '50.00',
        reason: 'Sakit',
      },
      {
        id: 'PA004',
        name: 'Nurul Aisyah binti Omar',
        attended: true,
        checkInTime: '08:55',
        allowanceRate: '50.00',
      },
      {
        id: 'PA005',
        name: 'Ali bin Hassan',
        attended: true,
        checkInTime: '09:10',
        allowanceRate: '50.00',
      }
    ]
  },
  'MP2024-002': {
    id: 'MP2024-002',
    name: 'Latihan Pengurusan Zakat dan Fitrah',
    type: 'Latihan',
    date: '20/03/2024',
    location: 'Dewan Latihan LZS, Kompleks Zakat Selangor',
    status: 'Belum Dihantar',
    allowanceRate: '50.00',
    penolongAmil: [
      {
        id: 'PA001',
        name: 'Ahmad bin Abdullah',
        attended: true,
        checkInTime: '08:45',
        allowanceRate: '50.00',
      },
      {
        id: 'PA002',
        name: 'Siti Aminah binti Hassan',
        attended: true,
        checkInTime: '09:00',
        allowanceRate: '50.00',
      },
      {
        id: 'PA003',
        name: 'Mohd Razak bin Ibrahim',
        attended: false,
        checkInTime: null,
        allowanceRate: '50.00',
        reason: 'Sakit',
      },
      {
        id: 'PA004',
        name: 'Nurul Aisyah binti Omar',
        attended: true,
        checkInTime: '08:55',
        allowanceRate: '50.00',
      },
      {
        id: 'PA005',
        name: 'Ali bin Hassan',
        attended: true,
        checkInTime: '09:10',
        allowanceRate: '50.00',
      }
    ]
  },
  'MP2024-003': {
    id: 'MP2024-003',
    name: 'Program Khidmat Masyarakat Ramadan',
    type: 'Program',
    date: '25/03/2024',
    location: 'Masjid Al-Hidayah, Shah Alam',
    status: 'Lulus',
    allowanceRate: '75.00',
    penolongAmil: [
      {
        id: 'PA006',
        name: 'Zainab binti Ibrahim',
        attended: true,
        checkInTime: '07:30',
        allowanceRate: '75.00',
      },
      {
        id: 'PA007',
        name: 'Ibrahim bin Ahmad',
        attended: true,
        checkInTime: '07:45',
        allowanceRate: '75.00',
      },
      {
        id: 'PA008',
        name: 'Aminah binti Mohamed',
        attended: true,
        checkInTime: '08:00',
        allowanceRate: '75.00',
      }
    ]
  },
  'MP2024-005': {
    id: 'MP2024-005',
    name: 'Latihan Sistem e-Zakat',
    type: 'Latihan',
    date: '02/04/2024',
    location: 'Bilik Latihan IT, Pejabat Zakat Petaling Jaya',
    status: 'Belum Dihantar',
    allowanceRate: '60.00',
    penolongAmil: [
      {
        id: 'PA009',
        name: 'Hassan bin Omar',
        attended: true,
        checkInTime: '09:00',
        allowanceRate: '60.00',
      },
      {
        id: 'PA010',
        name: 'Mariam binti Ali',
        attended: true,
        checkInTime: '09:15',
        allowanceRate: '60.00',
      }
    ]
  },
  'MP2024-006': {
    id: 'MP2024-006',
    name: 'Program Bantuan Asnaf Bulanan',
    type: 'Program',
    date: '05/04/2024',
    location: 'Dewan Serbaguna Masjid Kg Delek',
    status: 'Ditolak',
    allowanceRate: '50.00',
    penolongAmil: [
      {
        id: 'PA011',
        name: 'Omar bin Hassan',
        attended: true,
        checkInTime: '08:00',
        allowanceRate: '50.00',
      },
      {
        id: 'PA012',
        name: 'Fatimah binti Ahmad',
        attended: true,
        checkInTime: '08:15',
        allowanceRate: '50.00',
      },
      {
        id: 'PA013',
        name: 'Ahmad bin Omar',
        attended: false,
        checkInTime: null,
        allowanceRate: '50.00',
        reason: 'Urusan Keluarga',
      },
      {
        id: 'PA014',
        name: 'Siti binti Hassan',
        attended: true,
        checkInTime: '08:30',
        allowanceRate: '50.00',
      },
      {
        id: 'PA015',
        name: 'Mohamed bin Ali',
        attended: true,
        checkInTime: '08:45',
        allowanceRate: '50.00',
      }
    ]
  },
  'MP2024-007': {
    id: 'MP2024-007',
    name: 'Mesyuarat Perancangan Aktiviti Q2',
    type: 'Mesyuarat',
    date: '10/04/2024',
    location: 'Dewan Mesyuarat JPPA, Pejabat Zakat Kajang',
    status: 'Lulus',
    allowanceRate: '40.00',
    penolongAmil: [
      {
        id: 'PA016',
        name: 'Ali bin Mohamed',
        attended: true,
        checkInTime: '09:00',
        allowanceRate: '40.00',
      },
      {
        id: 'PA017',
        name: 'Nurul binti Omar',
        attended: true,
        checkInTime: '09:15',
        allowanceRate: '40.00',
      }
    ]
  },
  'MP2024-008': {
    id: 'MP2024-008',
    name: 'Latihan Pengurusan Aduan',
    type: 'Latihan',
    date: '12/04/2024',
    location: 'Bilik Latihan, Pejabat Zakat Gombak',
    status: 'Belum Dihantar',
    allowanceRate: '70.00',
    penolongAmil: [
      {
        id: 'PA018',
        name: 'Hassan bin Ibrahim',
        attended: true,
        checkInTime: '09:00',
        allowanceRate: '70.00',
      },
      {
        id: 'PA019',
        name: 'Aminah binti Hassan',
        attended: true,
        checkInTime: '09:15',
        allowanceRate: '70.00',
      }
    ]
  },
  'M002': {
    id: 'M002',
    name: 'Mesyuarat Koordinasi',
    type: 'Mesyuarat',
    date: '28/03/2024',
    location: 'Pejabat Zakat',
    status: 'Menunggu Sokongan JPPA',
    allowanceRate: '50.00',
    penolongAmil: [
      {
        id: 'PA001',
        name: 'Ahmad bin Abdullah',
        attended: true,
        checkInTime: '09:00',
        allowanceRate: '50.00',
      },
      {
        id: 'PA002',
        name: 'Siti Aminah binti Hassan',
        attended: false,
        checkInTime: null,
        allowanceRate: '50.00',
        reason: 'Urusan Keluarga',
      },
      {
        id: 'PA003',
        name: 'Mohd Razak bin Ibrahim',
        attended: true,
        checkInTime: '09:15',
        allowanceRate: '50.00',
      },
      {
        id: 'PA004',
        name: 'Nurul Aisyah binti Omar',
        attended: true,
        checkInTime: '08:50',
        allowanceRate: '50.00',
      }
    ]
  },
  'M003': {
    id: 'M003',
    name: 'Mesyuarat Agung Tahunan',
    type: 'Mesyuarat',
    date: '22/03/2024',
    location: 'Dewan Utama',
    status: 'Menunggu Kelulusan Ketua JPPA',
    allowanceRate: '50.00',
    penolongAmil: [
      {
        id: 'PA001',
        name: 'Ahmad bin Abdullah',
        attended: true,
        checkInTime: '08:30',
        allowanceRate: '50.00',
      },
      {
        id: 'PA002',
        name: 'Siti Aminah binti Hassan',
        attended: true,
        checkInTime: '08:45',
        allowanceRate: '50.00',
      },
      {
        id: 'PA003',
        name: 'Mohd Razak bin Ibrahim',
        attended: true,
        checkInTime: '09:00',
        allowanceRate: '50.00',
      },
      {
        id: 'PA004',
        name: 'Nurul Aisyah binti Omar',
        attended: true,
        checkInTime: '08:40',
        allowanceRate: '50.00',
      },
      {
        id: 'PA005',
        name: 'Ali bin Hassan',
        attended: false,
        checkInTime: null,
        allowanceRate: '50.00',
        reason: 'Urusan Rasmi',
      }
    ]
  },
  'P001': {
    id: 'P001',
    name: 'Program Khidmat Masyarakat',
    type: 'Program',
    date: '20/03/2024',
    location: 'Masjid Al-Hidayah',
    status: 'Menunggu Kelulusan Ketua JPPA',
    allowanceRate: '100.00',
    penolongAmil: [
      {
        id: 'PA001',
        name: 'Ahmad bin Abdullah',
        attended: true,
        checkInTime: '07:30',
        allowanceRate: '100.00',
      },
      {
        id: 'PA002',
        name: 'Siti Aminah binti Hassan',
        attended: true,
        checkInTime: '07:45',
        allowanceRate: '100.00',
      },
      {
        id: 'PA003',
        name: 'Mohd Razak bin Ibrahim',
        attended: true,
        checkInTime: '08:00',
        allowanceRate: '100.00',
      },
      {
        id: 'PA004',
        name: 'Nurul Aisyah binti Omar',
        attended: false,
        checkInTime: null,
        allowanceRate: '100.00',
        reason: 'Urusan Keluarga',
      },
      {
        id: 'PA005',
        name: 'Ali bin Hassan',
        attended: true,
        checkInTime: '07:55',
        allowanceRate: '100.00',
      }
    ]
  },
  'P002': {
    id: 'P002',
    name: 'Program Tazkirah Bulanan',
    type: 'Program',
    date: '18/03/2024',
    location: 'Masjid Al-Hidayah',
    status: 'Menunggu Sokongan JPPA',
    allowanceRate: '100.00',
    penolongAmil: [
      {
        id: 'PA001',
        name: 'Ahmad bin Abdullah',
        attended: true,
        checkInTime: '19:00',
        allowanceRate: '100.00',
      },
      {
        id: 'PA002',
        name: 'Siti Aminah binti Hassan',
        attended: true,
        checkInTime: '19:15',
        allowanceRate: '100.00',
      },
      {
        id: 'PA003',
        name: 'Mohd Razak bin Ibrahim',
        attended: true,
        checkInTime: '19:30',
        allowanceRate: '100.00',
      },
      {
        id: 'PA004',
        name: 'Nurul Aisyah binti Omar',
        attended: true,
        checkInTime: '19:10',
        allowanceRate: '100.00',
      }
    ]
  },
  'L001': {
    id: 'L001',
    name: 'Latihan Pengurusan Zakat',
    type: 'Latihan',
    date: '25/03/2024',
    location: 'Dewan Latihan',
    status: 'Diluluskan',
    allowanceRate: '100.00',
    penolongAmil: [
      {
        id: 'PA001',
        name: 'Ahmad bin Abdullah',
        attended: true,
        checkInTime: '08:00',
        allowanceRate: '100.00',
      },
      {
        id: 'PA002',
        name: 'Siti Aminah binti Hassan',
        attended: true,
        checkInTime: '08:15',
        allowanceRate: '100.00',
      },
      {
        id: 'PA003',
        name: 'Mohd Razak bin Ibrahim',
        attended: true,
        checkInTime: '08:30',
        allowanceRate: '100.00',
      },
      {
        id: 'PA004',
        name: 'Nurul Aisyah binti Omar',
        attended: true,
        checkInTime: '08:45',
        allowanceRate: '100.00',
      },
      {
        id: 'PA005',
        name: 'Ali bin Hassan',
        attended: true,
        checkInTime: '09:00',
        allowanceRate: '100.00',
      },
      {
        id: 'PA006',
        name: 'Fatimah binti Ahmad',
        attended: true,
        checkInTime: '08:20',
        allowanceRate: '100.00',
      }
    ]
  },
  'L002': {
    id: 'L002',
    name: 'Latihan Asas Pengurusan',
    type: 'Latihan',
    date: '27/03/2024',
    location: 'Bilik Latihan',
    status: 'Menunggu Sokongan JPPA',
    allowanceRate: '100.00',
    penolongAmil: [
      {
        id: 'PA001',
        name: 'Ahmad bin Abdullah',
        attended: true,
        checkInTime: '09:00',
        allowanceRate: '100.00',
      },
      {
        id: 'PA002',
        name: 'Siti Aminah binti Hassan',
        attended: false,
        checkInTime: null,
        allowanceRate: '100.00',
        reason: 'Sakit',
      },
      {
        id: 'PA003',
        name: 'Mohd Razak bin Ibrahim',
        attended: true,
        checkInTime: '09:15',
        allowanceRate: '100.00',
      },
      {
        id: 'PA004',
        name: 'Nurul Aisyah binti Omar',
        attended: true,
        checkInTime: '08:45',
        allowanceRate: '100.00',
      }
    ]
  }
};

// Computed properties
const totalAllowance = computed(() => {
  return penolongAmil.value
    .filter(pa => pa.attended)
    .reduce((sum, pa) => sum + parseFloat(pa.allowanceRate), 0)
    .toFixed(2)
    .replace(/\B(?=(\d{3})+(?!\d))/g, ',');
});

// Helper functions
const getStatusClass = (status) => {
  const statusClasses = {
    'Menunggu Sokongan JPPA': 'bg-yellow-100 text-yellow-800',
    'Menunggu Kelulusan Ketua JPPA': 'bg-blue-100 text-blue-800',
    'Diluluskan': 'bg-green-100 text-green-800',
    'Ditolak': 'bg-red-100 text-red-800',
  };
  return statusClasses[status] || 'bg-gray-100 text-gray-800';
};

const getAttendanceStatusClass = (attended) => {
  return attended 
    ? 'bg-green-100 text-green-800' 
    : 'bg-red-100 text-red-800';
};

// Load data based on activity ID
onMounted(() => {
  const activityData = activityDataMap[activityId];
  if (activityData) {
    activityInfo.value = {
      id: activityData.id,
      name: activityData.name,
      type: activityData.type,
      date: activityData.date,
      location: activityData.location,
      status: activityData.status,
    };
    
    penolongAmil.value = activityData.penolongAmil;
    
    // Calculate attendance summary
    const totalInvited = penolongAmil.value.length;
    const totalAttended = penolongAmil.value.filter(pa => pa.attended).length;
    const attendanceRate = Math.round((totalAttended / totalInvited) * 100);
    const totalAllowance = penolongAmil.value
      .filter(pa => pa.attended)
      .reduce((sum, pa) => sum + parseFloat(pa.allowanceRate), 0);
    
    attendanceSummary.value = {
      totalInvited,
      totalAttended,
      attendanceRate,
      totalAllowance: totalAllowance.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ','),
    };
  }
});
</script>

<style scoped>
/* Add any additional styles here */
</style> 