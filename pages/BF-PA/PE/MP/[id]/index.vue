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
                <p class="font-medium">{{ activityInfo.NamaAktiviti }}</p>
              </div>
              <div>
                <p class="text-sm text-gray-500">Jenis Aktiviti</p>
                <p class="font-medium">{{ activityInfo.type }}</p>
              </div>
              <div>
                <p class="text-sm text-gray-500">Tarikh</p>
                <p class="font-medium">{{ activityInfo.Tarikh }}</p>
              </div>
              <div>
                <p class="text-sm text-gray-500">Lokasi</p>
                <p class="font-medium">{{ activityInfo.Lokasi }}</p>
              </div>
              <div>
                <p class="text-sm text-gray-500">Bilangan Sesi</p>
                <p class="font-medium">{{ activityInfo.sesiDaftar }}</p>
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
          <!-- <div class="mb-6">
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
          </div> -->

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
                       Nama
                     </th>
                     <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                       ID Pengenalan
                     </th>
                     <!-- <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                       Status Kehadiran
                     </th> -->
                     <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                       Sesi Daftar
                     </th>
                     <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                       Masa Daftar
                     </th>
                     <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                       Daerah
                     </th>
                     <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                       Kadar Elaun
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
                       {{ pa.idPengenalan }}
                     </td>
                     <!-- <td class="px-6 py-4 whitespace-nowrap">
                       <span
                         class="px-2 py-1 text-xs font-medium rounded-full"
                         :class="getAttendanceStatusClass(pa.attended)"
                       >
                         {{ pa.attended ? 'Hadir' : 'Tidak Hadir' }}
                       </span>
                     </td> -->
                                           <td class="px-6 py-4 whitespace-nowrap">
                        <div v-if="pa.attended && pa.sesiDaftar">
                          <div v-if="pa.checkInTime && pa.checkInTime.includes(',')" class="space-y-1">
                            <div v-for="(time, index) in pa.checkInTime.split(', ')" :key="index" class="text-sm">
                              <span class="font-medium">Sesi {{ index + 1 }}</span>
                            </div>
                          </div>
                          <div v-else>
                            Sesi {{ pa.sesiDaftar }}
                          </div>
                        </div>
                        <span v-else class="text-gray-400">-</span>
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap">
                        <div v-if="pa.attended && pa.checkInTime">
                          <div v-if="pa.checkInTime.includes(',')" class="space-y-1">
                            <div v-for="time in pa.checkInTime.split(', ')" :key="time" class="text-sm">
                              {{ time }}
                            </div>
                          </div>
                          <div v-else>
                            {{ pa.checkInTime }}
                          </div>
                        </div>
                        <span v-else class="text-gray-400">-</span>
                      </td>
                     <td class="px-6 py-4 whitespace-nowrap">
                       <span
                         v-if="pa.attended"
                         class="px-2 py-1 text-xs font-medium rounded-full"
                         :class="getDaerahClass(pa.daerah)"
                       >
                         {{ pa.daerah }}
                       </span>
                       <span v-else class="text-gray-400">-</span>
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
                     <td colspan="6" class="px-6 py-4 text-right font-medium">
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
             <!-- Eksekutif Role Buttons -->
             <rs-button
               v-if="currentRole === 'eksekutif' && activityInfo.status === 'Belum Disemak'"
               variant="primary"
               @click="handleSokong"
             >
               Sokong
             </rs-button>
             
             <!-- Ketua Jabatan Role Buttons -->
             <rs-button
               v-if="currentRole === 'ketua-jabatan'"
               variant="success"
               :disabled="buttonsDisabled"
               @click="handleLulus"
             >
               Lulus
             </rs-button>
             <rs-button
               v-if="currentRole === 'ketua-jabatan'"
               variant="danger"
               :disabled="buttonsDisabled"
               @click="handleTolakClick"
             >
               Tolak
             </rs-button>
             
             <!-- Ketua Divisyen Role Buttons -->
             <rs-button
               v-if="currentRole === 'ketua-divisyen'"
               variant="success"
               :disabled="ketuaDivisyenButtonsDisabled"
               @click="handleLulusKetuaDivisyen"
             >
               Lulus
             </rs-button>
             <rs-button
               v-if="currentRole === 'ketua-divisyen'"
               variant="danger"
               :disabled="ketuaDivisyenButtonsDisabled"
               @click="handleTolakClickKetuaDivisyen"
             >
               Tolak
             </rs-button>
             
             <!-- Common Button -->
             <rs-button
               variant="primary-outline"
               @click="navigateTo('/BF-PA/PE/MP')"
             >
               Kembali
             </rs-button>
           </div>
           
           <!-- Tolak Form (Inline) -->
           <div v-if="currentRole === 'ketua-jabatan' && showTolakForm" class="mt-6 p-4 bg-gray-50 rounded-lg border">
             <h4 class="text-lg font-semibold mb-4 text-red-600">Ulasan Penolakan</h4>
             <p class="text-gray-600 mb-4">
               Sila berikan ulasan mengapa aktiviti ini ditolak:
             </p>
             <FormKit
               type="form"
               @submit="handleTolak"
               :actions="false"
             >
               <FormKit
                 type="textarea"
                 name="ulasan"
                 label="Ulasan"
                 placeholder="Masukkan ulasan penolakan..."
                 validation="required"
                 rows="4"
               />
               <div class="flex justify-end gap-3 mt-4">
                 <rs-button
                   variant="primary"
                   @click="handleSetSemulaClick"
                 >
                   Set Semula
                 </rs-button>
                 <rs-button
                   type="submit"
                   variant="secondary"
                   @click="handleTolak"
                 >
                   Hantar Ulasan
                 </rs-button>
               </div>
             </FormKit>
           </div>
           
           <!-- Ketua Divisyen Tolak Form (Inline) -->
           <div v-if="currentRole === 'ketua-divisyen' && showKetuaDivisyenTolakForm" class="mt-6 p-4 bg-gray-50 rounded-lg border">
             <h4 class="text-lg font-semibold mb-4 text-red-600">Ulasan Penolakan</h4>
             <p class="text-gray-600 mb-4">
               Sila berikan ulasan mengapa aktiviti ini ditolak:
             </p>
             <FormKit
               type="form"
               @submit="handleTolakKetuaDivisyen"
               :actions="false"
             >
               <FormKit
                 type="textarea"
                 name="ulasan"
                 label="Ulasan"
                 placeholder="Masukkan ulasan penolakan..."
                 validation="required"
                 rows="4"
               />
               <div class="flex justify-end gap-3 mt-4">
                 <rs-button
                   variant="primary"
                   @click="handleSetSemulaClickKetuaDivisyen"
                 >
                   Set Semula
                 </rs-button>
                 <rs-button
                   type="submit"
                   variant="secondary"
                   @click="handleTolakKetuaDivisyen"
                 >
                   Hantar Ulasan
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
import { useRoute } from 'vue-router';
import { navigateTo } from '#app';

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
  NamaAktiviti: '',
  type: '',
  Tarikh: '',
  Lokasi: '',
  status: '',
  sesiDaftar: 0,
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

// Current role from dashboard (read from URL query parameter)
const currentRole = ref('eksekutif'); // Default fallback

// Modal state for Tolak form
const showTolakForm = ref(false);

// State to track if buttons should be disabled
const buttonsDisabled = ref(false);

// State for Ketua Divisyen buttons and form
const ketuaDivisyenButtonsDisabled = ref(false);
const showKetuaDivisyenTolakForm = ref(false);

// Mock data for different activity IDs - Limited to 10 entries
const activityDataMap = {
  'MP2024-001': {
    id: 'MP2024-001',
    NamaAktiviti: 'Program Khidmat Masyarakat',
    type: 'Program',
    Tarikh: '15/04/2024',
    Lokasi: 'Dewan Serbaguna Masjid Kg Delek, Daerah Klang',
    status: 'Diluluskan',
    allowanceRate: '50.00',
    penolongAmil: [
      { id: 'PA001', name: 'Ahmad bin Ismail', idPengenalan: '800101-01-1234', attended: true, sesiDaftar: 1, checkInTime: '09:00 AM', daerah: 'Dalam Daerah', allowanceRate: '50.00' },
      { id: 'PA002', name: 'Sarah binti Hamid', idPengenalan: '850315-05-5678', attended: true, sesiDaftar: 2, checkInTime: '09:10 AM, 02:30 PM', daerah: 'Dalam Daerah', allowanceRate: '50.00' },
      { id: 'PA003', name: 'Mohd Zulkifli bin Abdullah', idPengenalan: '780620-08-9012', attended: true, sesiDaftar: 1, checkInTime: '09:05 AM', daerah: 'Luar Daerah', allowanceRate: '50.00' }
    ]
  },
  'MP2024-002': {
    id: 'MP2024-002',
    NamaAktiviti: 'Mesyuarat Perancangan Bulanan',
    type: 'Mesyuarat',
    Tarikh: '18/04/2024',
    Lokasi: 'Dewan Mesyuarat Eksekutif, Daerah Petaling Jaya',
    status: 'Belum Disemak',
    allowanceRate: '50.00',
    penolongAmil: [
      { id: 'PA001', name: 'Ahmad bin Abdullah', idPengenalan: '820512-03-2345', attended: true, sesiDaftar: 1, checkInTime: '08:45 AM', daerah: 'Dalam Daerah', allowanceRate: '50.00' },
      { id: 'PA002', name: 'Siti Aminah binti Hassan', idPengenalan: '870825-12-6789', attended: true, sesiDaftar: 1, checkInTime: '09:00 AM', daerah: 'Dalam Daerah', allowanceRate: '50.00' },
      // { id: 'PA003', name: 'Mohd Razak bin Ibrahim', idPengenalan: '790330-06-3456', attended: false, sesiDaftar: null, checkInTime: null, daerah: null, allowanceRate: '50.00', reason: 'Sakit' }
    ]
  },
  'MP2024-003': {
    id: 'MP2024-003',
    NamaAktiviti: 'Latihan Pengurusan Zakat',
    type: 'Program',
    Tarikh: '20/04/2024',
    Lokasi: 'Dewan Latihan LZS, Daerah Shah Alam',
    status: 'Belum Disemak',
    allowanceRate: '75.00',
    penolongAmil: [
      { id: 'PA006', name: 'Zainab binti Ibrahim', idPengenalan: '860415-09-4567', attended: true, sesiDaftar: 2, checkInTime: '07:30 AM, 12:45 PM', daerah: 'Dalam Daerah', allowanceRate: '75.00' },
      { id: 'PA007', name: 'Ibrahim bin Ahmad', idPengenalan: '810728-14-7890', attended: true, sesiDaftar: 1, checkInTime: '07:45 AM', daerah: 'Dalam Daerah', allowanceRate: '75.00' },
      { id: 'PA008', name: 'Aminah binti Mohamed', idPengenalan: '880912-07-1234', attended: true, sesiDaftar: 3, checkInTime: '08:00 AM, 01:20 PM, 05:15 PM', daerah: 'Luar Daerah', allowanceRate: '75.00' }
    ]
  },
  'MP2024-004': {
    id: 'MP2024-004',
    NamaAktiviti: 'Mesyuarat Eksekutif Bulanan',
    type: 'Mesyuarat',
    Tarikh: '15/03/2024',
    Lokasi: 'Dewan Mesyuarat Eksekutif, Daerah Petaling Jaya',
    status: 'Belum Disemak',
    allowanceRate: '50.00',
    penolongAmil: [
      { id: 'PA001', name: 'Ahmad bin Abdullah', idPengenalan: '820512-03-2345', attended: true, sesiDaftar: 1, checkInTime: '08:45 AM', daerah: 'Dalam Daerah', allowanceRate: '50.00' },
      { id: 'PA004', name: 'Nurul Aisyah binti Omar', idPengenalan: '860325-14-6789', attended: true, sesiDaftar: 2, checkInTime: '08:55 AM, 02:10 PM', daerah: 'Dalam Daerah', allowanceRate: '50.00' }
    ]
  },
  'MP2024-005': {
    id: 'MP2024-005',
    NamaAktiviti: 'Latihan Pengurusan Zakat dan Fitrah',
    type: 'Program',
    Tarikh: '20/03/2024',
    Lokasi: 'Dewan Latihan LZS, Kompleks Zakat Selangor, Daerah Shah Alam',
    status: 'Diluluskan',
    allowanceRate: '60.00',
    penolongAmil: [
      { id: 'PA009', name: 'Hassan bin Omar', idPengenalan: '810625-08-3456', attended: true, sesiDaftar: 1, checkInTime: '09:00 AM', daerah: 'Dalam Daerah', allowanceRate: '60.00' },
      { id: 'PA010', name: 'Mariam binti Ali', idPengenalan: '870912-14-7890', attended: true, sesiDaftar: 2, checkInTime: '09:15 AM, 01:45 PM', daerah: 'Dalam Daerah', allowanceRate: '60.00' }
    ]
  },
  'MP2024-006': {
    id: 'MP2024-006',
    NamaAktiviti: 'Latihan Sistem e-Zakat',
    type: 'Program',
    Tarikh: '02/04/2024',
    Lokasi: 'Bilik Latihan IT, Pejabat Zakat Petaling Jaya, Daerah Petaling Jaya',
    status: 'Ditolak',
    allowanceRate: '50.00',
    penolongAmil: [
      { id: 'PA011', name: 'Omar bin Hassan', idPengenalan: '820318-11-2345', attended: true, sesiDaftar: 1, checkInTime: '08:00 AM', daerah: 'Dalam Daerah', allowanceRate: '50.00' },
      { id: 'PA012', name: 'Fatimah binti Ahmad', idPengenalan: '860725-09-6789', attended: true, sesiDaftar: 3, checkInTime: '08:15 AM, 12:30 PM, 04:45 PM', daerah: 'Dalam Daerah', allowanceRate: '50.00' }
    ]
  },
  'MP2024-007': {
    id: 'MP2024-007',
    NamaAktiviti: 'Program Khidmat Masyarakat',
    type: 'Program',
    Tarikh: '20/03/2024',
    Lokasi: 'Masjid Al-Hidayah, Daerah Gombak',
    status: 'Diluluskan',
    allowanceRate: '100.00',
    penolongAmil: [
      { id: 'PA016', name: 'Ali bin Mohamed', idPengenalan: '830415-07-1234', attended: true, sesiDaftar: 2, checkInTime: '09:00 AM, 02:00 PM', daerah: 'Luar Daerah', allowanceRate: '100.00' },
      { id: 'PA017', name: 'Nurul binti Omar', idPengenalan: '880625-12-5678', attended: true, sesiDaftar: 1, checkInTime: '09:15 AM', daerah: 'Dalam Daerah', allowanceRate: '100.00' }
    ]
  },
  'MP2024-008': {
    id: 'MP2024-008',
    NamaAktiviti: 'Latihan Pengurusan Aduan',
    type: 'Program',
    Tarikh: '12/04/2024',
    Lokasi: 'Bilik Latihan, Pejabat Zakat Gombak, Daerah Gombak',
    status: 'Diluluskan',
    allowanceRate: '70.00',
    penolongAmil: [
      { id: 'PA018', name: 'Hassan bin Ibrahim', idPengenalan: '810912-05-3456', attended: true, sesiDaftar: 1, checkInTime: '09:00 AM', daerah: 'Dalam Daerah', allowanceRate: '70.00' },
      { id: 'PA019', name: 'Aminah binti Hassan', idPengenalan: '870318-16-7890', attended: true, sesiDaftar: 2, checkInTime: '09:15 AM, 01:30 PM', daerah: 'Dalam Daerah', allowanceRate: '70.00' }
    ]
  },
  'MP2024-009': {
    id: 'MP2024-009',
    NamaAktiviti: 'Latihan Pengurusan Zakat',
    type: 'Program',
    Tarikh: '25/03/2024',
    Lokasi: 'Dewan Latihan, Daerah Shah Alam',
    status: 'Belum Disemak',
    allowanceRate: '100.00',
    penolongAmil: [
      { id: 'PA001', name: 'Ahmad bin Abdullah', idPengenalan: '820512-03-2345', attended: true, sesiDaftar: 1, checkInTime: '08:00 AM', daerah: 'Dalam Daerah', allowanceRate: '100.00' },
      { id: 'PA002', name: 'Siti Aminah binti Hassan', idPengenalan: '870825-12-6789', attended: true, sesiDaftar: 3, checkInTime: '08:15 AM, 12:00 PM, 03:45 PM', daerah: 'Dalam Daerah', allowanceRate: '100.00' }
    ]
  },
  'MP2024-010': {
    id: 'MP2024-010',
    NamaAktiviti: 'Mesyuarat Koordinasi',
    type: 'Mesyuarat',
    Tarikh: '30/03/2024',
    Lokasi: 'Pejabat Zakat, Daerah Petaling Jaya',
    status: 'Diluluskan',
    allowanceRate: '50.00',
    penolongAmil: [
      { id: 'PA021', name: 'Roslan bin Karim', idPengenalan: '820625-14-2345', attended: true, sesiDaftar: 1, checkInTime: '09:10 AM', daerah: 'Dalam Daerah', allowanceRate: '50.00' },
      { id: 'PA022', name: 'Farah binti Zain', idPengenalan: '880912-08-6789', attended: true, sesiDaftar: 2, checkInTime: '09:20 AM, 01:50 PM', daerah: 'Dalam Daerah', allowanceRate: '50.00' }
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
    'Belum Disemak': 'bg-gray-100 text-gray-800',
    'Menunggu Sokongan Eksekutif': 'bg-yellow-100 text-yellow-800',
    'Menunggu Kelulusan Ketua Jabatan': 'bg-blue-100 text-blue-800',
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

const getDaerahClass = (daerah) => {
  return daerah === 'Dalam Daerah' 
    ? 'bg-blue-100 text-blue-800' 
    : 'bg-orange-100 text-orange-800';
};

// Handle Sokong button click
const handleSokong = () => {
  // Here you would implement the logic to approve/support the activity
  // For now, we'll just show a success message and update the status
  if (activityInfo.value.status === 'Belum Disemak') {
    activityInfo.value.status = 'Menunggu Kelulusan Ketua Jabatan';
    // You could also make an API call here to update the backend
    alert('Aktiviti telah disokong dan dihantar untuk kelulusan Ketua Jabatan');
    setTimeout(() => {
    navigateTo('/BF-PA/PE/MP');
  }, 2000); // 1 second delay to show the alert
  }
};

// Handle Lulus button click for Ketua Jabatan
const handleLulus = () => {
  // Update status to approved
  activityInfo.value.status = 'Diluluskan';
  // You could also make an API call here to update the backend
  alert('Aktiviti telah diluluskan oleh Ketua Jabatan');
  // Redirect to dashboard after notification
  setTimeout(() => {
    navigateTo('/BF-PA/PE/MP');
  }, 2000); // 1 second delay to show the alert
};

// Handle Tolak button click for Ketua Jabatan
const handleTolak = (formData) => {
  // Update status to rejected
  activityInfo.value.status = 'Ditolak';
  showTolakForm.value = false;
  // You could also make an API call here to update the backend with the ulasan
  alert(`Aktiviti telah ditolak oleh Ketua Jabatan.\n\nUlasan: ${formData.ulasan}`);
  // Redirect to dashboard after notification
  setTimeout(() => {
    navigateTo('/BF-PA/PE/MP');
  }, 2000); // 1 second delay to show the alert
};

// Handle Tolak button click to show/hide form
const handleTolakClick = () => {
  if (!buttonsDisabled.value) {
    showTolakForm.value = !showTolakForm.value;
    // Disable both Lulus and Tolak buttons when Tolak is clicked
    buttonsDisabled.value = true;
  }
};

// Handle Set Semula button click to re-enable buttons
const handleSetSemulaClick = () => {
  showTolakForm.value = false;
  // Re-enable both Lulus and Tolak buttons
  buttonsDisabled.value = false;
};

// Handle Lulus button click for Ketua Divisyen
const handleLulusKetuaDivisyen = () => {
  // Update status to approved
  activityInfo.value.status = 'Diluluskan';
  // You could also make an API call here to update the backend
  alert('Aktiviti telah diluluskan oleh Ketua Divisyen');
  // Redirect to dashboard after notification
  setTimeout(() => {
    navigateTo('/BF-PA/PE/MP');
  }, 2000); // 1 second delay to show the alert
};

// Handle Tolak button click for Ketua Divisyen
const handleTolakKetuaDivisyen = (formData) => {
  // Update status to rejected
  activityInfo.value.status = 'Ditolak';
  showKetuaDivisyenTolakForm.value = false;
  // You could also make an API call here to update the backend with the ulasan
  alert(`Aktiviti telah ditolak oleh Ketua Divisyen.\n\nUlasan: ${formData.ulasan}`);
  // Redirect to dashboard after notification
  setTimeout(() => {
    navigateTo('/BF-PA/PE/MP');
  }, 2000); // 1 second delay to show the alert
};

// Handle Tolak button click to show/hide form for Ketua Divisyen
const handleTolakClickKetuaDivisyen = () => {
  if (!ketuaDivisyenButtonsDisabled.value) {
    showKetuaDivisyenTolakForm.value = !showKetuaDivisyenTolakForm.value;
    // Disable both Lulus and Tolak buttons when Tolak is clicked
    ketuaDivisyenButtonsDisabled.value = true;
  }
};

// Handle Set Semula button click to re-enable buttons for Ketua Divisyen
const handleSetSemulaClickKetuaDivisyen = () => {
  showKetuaDivisyenTolakForm.value = false;
  // Re-enable both Lulus and Tolak buttons
  ketuaDivisyenButtonsDisabled.value = false;
};

// Load data based on activity ID
onMounted(() => {
  // Read role from URL query parameter
  const roleFromQuery = route.query.role;
  if (roleFromQuery) {
    currentRole.value = roleFromQuery;
  }

  const activityData = activityDataMap[activityId];
  if (activityData) {
    activityInfo.value = {
      id: activityData.id,
      NamaAktiviti: activityData.NamaAktiviti,
      type: activityData.type,
      Tarikh: activityData.Tarikh,
      Lokasi: activityData.Lokasi,
      status: activityData.status,
      sesiDaftar: 0,
    };
    
    penolongAmil.value = activityData.penolongAmil;
    
    // Calculate highest sesiDaftar value
    const highestSesiDaftar = Math.max(...penolongAmil.value
      .filter(pa => pa.attended && pa.sesiDaftar)
      .map(pa => pa.sesiDaftar));
    activityInfo.value.sesiDaftar = highestSesiDaftar || 0;
    
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