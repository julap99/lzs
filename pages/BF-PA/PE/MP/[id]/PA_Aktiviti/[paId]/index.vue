<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />

    <rs-card class="mt-4">
      <template #header>
        <div class="flex justify-between items-center">
          <h2 class="text-xl font-semibold">
            Butiran Kehadiran Penolong Amil
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
                <p class="text-sm text-gray-500">Status Aktiviti</p>
                <span
                  class="px-2 py-1 text-xs font-medium rounded-full"
                  :class="getStatusClass(activityInfo.status)"
                >
                  {{ activityInfo.status }}
                </span>
              </div>
            </div>
          </div>

          <!-- Penolong Amil Information -->
          <div class="mb-6">
            <h3 class="text-lg font-semibold mb-4">Maklumat Penolong Amil</h3>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p class="text-sm text-gray-500">ID Penolong Amil</p>
                <p class="font-medium text-blue-600">{{ penolongAmil.id }}</p>
              </div>
              <div>
                <p class="text-sm text-gray-500">Nama Penolong Amil</p>
                <p class="font-medium">{{ penolongAmil.name }}</p>
              </div>
              <div>
                <p class="text-sm text-gray-500">No. Kad Pengenalan</p>
                <p class="font-medium">{{ penolongAmil.icNumber }}</p>
              </div>
              <div>
                <p class="text-sm text-gray-500">No. Telefon</p>
                <p class="font-medium">{{ penolongAmil.phone }}</p>
              </div>
              <div>
                <p class="text-sm text-gray-500">Alamat</p>
                <p class="font-medium">{{ penolongAmil.address }}</p>
              </div>
              <div>
                <p class="text-sm text-gray-500">Kariah</p>
                <p class="font-medium">{{ penolongAmil.kariah }}</p>
              </div>
            </div>
          </div>

          <!-- Attendance Details -->
          <div class="mb-6">
            <h3 class="text-lg font-semibold mb-4">Butiran Kehadiran</h3>
            
            <div class="bg-gray-50 p-4 rounded-lg">
              <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <p class="text-sm text-gray-500">Status Kehadiran</p>
                  <span
                    class="px-3 py-1 text-sm font-medium rounded-full mt-1 inline-block"
                    :class="getAttendanceStatusClass(penolongAmil.attended)"
                  >
                    {{ penolongAmil.attended ? 'Hadir' : 'Tidak Hadir' }}
                  </span>
                </div>
                <div>
                  <p class="text-sm text-gray-500">Masa Daftar Masuk</p>
                  <p class="font-medium mt-1">{{ penolongAmil.checkInTime || 'Tidak Hadir' }}</p>
                </div>
                <div>
                  <p class="text-sm text-gray-500">Masa Daftar Keluar</p>
                  <p class="font-medium mt-1">{{ penolongAmil.checkOutTime || 'Tidak Hadir' }}</p>
                </div>
              </div>
              
              <!-- Reason for absence (if applicable) -->
              <div v-if="!penolongAmil.attended && penolongAmil.reason" class="mt-4">
                <p class="text-sm text-gray-500">Sebab Tidak Hadir</p>
                <p class="font-medium text-red-600 mt-1">{{ penolongAmil.reason }}</p>
              </div>
            </div>
          </div>

          <!-- Allowance Information -->
          <div class="mb-6">
            <h3 class="text-lg font-semibold mb-4">Maklumat Elaun</h3>
            
            <div class="bg-green-50 p-4 rounded-lg">
              <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <p class="text-sm text-gray-500">Kadar Elaun</p>
                  <p class="font-medium text-green-600 mt-1">RM {{ penolongAmil.allowanceRate }}</p>
                </div>
                <div>
                  <p class="text-sm text-gray-500">Status Pembayaran</p>
                  <span
                    class="px-2 py-1 text-xs font-medium rounded-full mt-1 inline-block"
                    :class="getPaymentStatusClass(penolongAmil.paymentStatus)"
                  >
                    {{ penolongAmil.paymentStatus }}
                  </span>
                </div>
                <div>
                  <p class="text-sm text-gray-500">Jumlah Elaun</p>
                  <p class="font-medium text-green-600 mt-1">
                    RM {{ penolongAmil.attended ? penolongAmil.allowanceRate : '0.00' }}
                  </p>
                </div>
              </div>
              
              <!-- Payment details (if applicable) -->
              <div v-if="penolongAmil.paymentStatus === 'Telah Dibayar'" class="mt-4">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p class="text-sm text-gray-500">Payment Advice No:</p>
                    <p class="font-medium">{{ penolongAmil.paymentAdviceNo }}</p>
                  </div>
                  <div>
                    <p class="text-sm text-gray-500">No. Akaun Pembayaran:</p>
                    <p class="font-medium">{{ penolongAmil.accountNumber }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="flex justify-end gap-4 mt-6">
            <rs-button
              variant="primary-outline"
              @click="navigateTo(`/BF-PA/PE/MP/${activityInfo.id}`)"
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
const paId = route.params.paId;

definePageMeta({
  title: "Butiran Kehadiran Penolong Amil",
  description: "Maklumat kehadiran dan elaun penolong amil",
});

const breadcrumb = ref([
  {
    name: "Pengurusan Elaun",
    type: "link",
    path: "/BF-PA/PE/MP",
  },
  {
    name: "Maklumat Aktiviti",
    type: "link",
    path: `/BF-PA/PE/MP/${activityId}`,
  },
  {
    name: "Butiran Penolong Amil",
    type: "current",
    path: `/BF-PA/PE/MP/${activityId}/PA_Aktiviti/${paId}`,
  },
]);

// Mock activity data
const activityInfo = ref({
  id: '',
  name: '',
  type: '',
  date: '',
  location: '',
  status: '',
});

// Mock Penolong Amil data
const penolongAmil = ref({
  id: '',
  name: '',
  icNumber: '',
  phone: '',
  address: '',
  kariah: '',
  attended: false,
  checkInTime: '',
  checkOutTime: '',
  reason: '',
  allowanceRate: '0.00',
  paymentStatus: '',
  paymentAdviceNo: '',
  accountNumber: '',
});

// Mock data for different activity and PA combinations
const paDataMap = {
  'MP2024-001': {
    'PA001': {
      id: 'PA001',
      name: 'Ahmad bin Ismail',
      icNumber: '800101-01-1234',
      phone: '012-3456789',
      address: 'No. 123, Jalan Melati, Taman Seri Indah, 43000 Kajang, Selangor',
      kariah: 'Masjid Al-Hidayah',
      attended: true,
      checkInTime: '09:00',
      checkOutTime: '12:30',
      reason: '',
      allowanceRate: '50.00',
      paymentStatus: 'Belum Dihantar',
      paymentAdviceNo: '',
      accountNumber: '',
    },
    'PA002': {
      id: 'PA002',
      name: 'Sarah binti Hamid',
      icNumber: '850505-05-5678',
      phone: '012-9876543',
      address: 'No. 456, Jalan Mawar, Taman Bunga Raya, 43000 Kajang, Selangor',
      kariah: 'Masjid Al-Hidayah',
      attended: true,
      checkInTime: '09:10',
      checkOutTime: '12:15',
      reason: '',
      allowanceRate: '50.00',
      paymentStatus: 'Belum Dihantar',
      paymentAdviceNo: '',
      accountNumber: '',
    },
    'PA003': {
      id: 'PA003',
      name: 'Mohd Zulkifli bin Abdullah',
      icNumber: '820202-02-9012',
      phone: '012-1122334',
      address: 'No. 789, Jalan Kenanga, Taman Kenanga, 43000 Kajang, Selangor',
      kariah: 'Masjid Al-Hidayah',
      attended: true,
      checkInTime: '09:05',
      checkOutTime: '12:20',
      reason: '',
      allowanceRate: '50.00',
      paymentStatus: 'Belum Dihantar',
      paymentAdviceNo: '',
      accountNumber: '',
    }
  },
  'MP2024-002': {
    'PA001': {
      id: 'PA001',
      name: 'Ahmad bin Abdullah',
      icNumber: '800101-01-1234',
      phone: '012-3456789',
      address: 'No. 123, Jalan Melati, Taman Seri Indah, 43000 Kajang, Selangor',
      kariah: 'Masjid Al-Hidayah',
      attended: true,
      checkInTime: '08:45',
      checkOutTime: '12:30',
      reason: '',
      allowanceRate: '40.00',
      paymentStatus: 'Belum Dihantar',
      paymentAdviceNo: '',
      accountNumber: '',
    },
    'PA002': {
      id: 'PA002',
      name: 'Siti Aminah binti Hassan',
      icNumber: '850505-05-5678',
      phone: '012-9876543',
      address: 'No. 456, Jalan Mawar, Taman Bunga Raya, 43000 Kajang, Selangor',
      kariah: 'Masjid Al-Hidayah',
      attended: true,
      checkInTime: '09:00',
      checkOutTime: '12:15',
      reason: '',
      allowanceRate: '40.00',
      paymentStatus: 'Belum Dihantar',
      paymentAdviceNo: '',
      accountNumber: '',
    },
    'PA003': {
      id: 'PA003',
      name: 'Mohd Razak bin Ibrahim',
      icNumber: '820202-02-9012',
      phone: '012-1122334',
      address: 'No. 789, Jalan Kenanga, Taman Kenanga, 43000 Kajang, Selangor',
      kariah: 'Masjid Al-Hidayah',
      attended: false,
      checkInTime: '',
      checkOutTime: '',
      reason: 'Sakit',
      allowanceRate: '40.00',
      paymentStatus: 'Tidak Layak',
      paymentAdviceNo: '',
      accountNumber: '',
    }
  },
  'MP2024-003': {
    'PA006': {
      id: 'PA006',
      name: 'Zainab binti Ibrahim',
      icNumber: '840404-04-6789',
      phone: '012-4455667',
      address: 'No. 567, Jalan Teratai, Taman Teratai, 43000 Kajang, Selangor',
      kariah: 'Masjid Al-Hidayah',
      attended: true,
      checkInTime: '07:30',
      checkOutTime: '16:00',
      reason: '',
      allowanceRate: '75.00',
      paymentStatus: 'Diluluskan',
      paymentAdviceNo: 'PA-2024-003-001',
      accountNumber: '1234567890',
    },
    'PA007': {
      id: 'PA007',
      name: 'Ibrahim bin Ahmad',
      icNumber: '860606-06-0123',
      phone: '012-6677889',
      address: 'No. 890, Jalan Seroja, Taman Seroja, 43000 Kajang, Selangor',
      kariah: 'Masjid Al-Hidayah',
      attended: true,
      checkInTime: '07:45',
      checkOutTime: '16:15',
      reason: '',
      allowanceRate: '75.00',
      paymentStatus: 'Diluluskan',
      paymentAdviceNo: 'PA-2024-003-002',
      accountNumber: '0987654321',
    },
    'PA008': {
      id: 'PA008',
      name: 'Aminah binti Mohamed',
      icNumber: '890909-09-2345',
      phone: '012-7788990',
      address: 'No. 432, Jalan Kemboja, Taman Kemboja, 43000 Kajang, Selangor',
      kariah: 'Masjid Al-Hidayah',
      attended: true,
      checkInTime: '08:00',
      checkOutTime: '16:30',
      reason: '',
      allowanceRate: '75.00',
      paymentStatus: 'Diluluskan',
      paymentAdviceNo: 'PA-2024-003-003',
      accountNumber: '1122334455',
    }
  },
  'MP2024-004': {
    'PA001': {
      id: 'PA001',
      name: 'Ahmad bin Abdullah',
      icNumber: '800101-01-1234',
      phone: '012-3456789',
      address: 'No. 123, Jalan Melati, Taman Seri Indah, 43000 Kajang, Selangor',
      kariah: 'Masjid Al-Hidayah',
      attended: true,
      checkInTime: '08:45',
      checkOutTime: '12:30',
      reason: '',
      allowanceRate: '50.00',
      paymentStatus: 'Belum Dihantar',
      paymentAdviceNo: '',
      accountNumber: '',
    },
    'PA004': {
      id: 'PA004',
      name: 'Nurul Aisyah binti Omar',
      icNumber: '870707-07-3456',
      phone: '012-5566778',
      address: 'No. 234, Jalan Anggerik, Taman Anggerik, 43000 Kajang, Selangor',
      kariah: 'Masjid Al-Hidayah',
      attended: true,
      checkInTime: '08:55',
      checkOutTime: '12:20',
      reason: '',
      allowanceRate: '50.00',
      paymentStatus: 'Belum Dihantar',
      paymentAdviceNo: '',
      accountNumber: '',
    }
  },
  'MP2024-005': {
    'PA009': {
      id: 'PA009',
      name: 'Hassan bin Omar',
      icNumber: '810101-01-3456',
      phone: '012-8899001',
      address: 'No. 654, Jalan Bunga Raya, Taman Bunga Raya, 43000 Kajang, Selangor',
      kariah: 'Masjid Al-Hidayah',
      attended: true,
      checkInTime: '09:00',
      checkOutTime: '17:00',
      reason: '',
      allowanceRate: '60.00',
      paymentStatus: 'Belum Dihantar',
      paymentAdviceNo: '',
      accountNumber: '',
    },
    'PA010': {
      id: 'PA010',
      name: 'Mariam binti Ali',
      icNumber: '820202-02-5678',
      phone: '012-9900112',
      address: 'No. 876, Jalan Melur, Taman Melur, 43000 Kajang, Selangor',
      kariah: 'Masjid Al-Hidayah',
      attended: true,
      checkInTime: '09:15',
      checkOutTime: '17:15',
      reason: '',
      allowanceRate: '60.00',
      paymentStatus: 'Belum Dihantar',
      paymentAdviceNo: '',
      accountNumber: '',
    }
  },
  'MP2024-006': {
    'PA011': {
      id: 'PA011',
      name: 'Omar bin Hassan',
      icNumber: '830303-03-7890',
      phone: '012-0011223',
      address: 'No. 543, Jalan Cempaka, Taman Cempaka, 43000 Kajang, Selangor',
      kariah: 'Masjid Al-Hidayah',
      attended: true,
      checkInTime: '08:00',
      checkOutTime: '16:00',
      reason: '',
      allowanceRate: '50.00',
      paymentStatus: 'Ditolak',
      paymentAdviceNo: '',
      accountNumber: '',
    },
    'PA012': {
      id: 'PA012',
      name: 'Fatimah binti Ahmad',
      icNumber: '840404-04-0123',
      phone: '012-1122334',
      address: 'No. 765, Jalan Kenanga, Taman Kenanga, 43000 Kajang, Selangor',
      kariah: 'Masjid Al-Hidayah',
      attended: true,
      checkInTime: '08:15',
      checkOutTime: '16:15',
      reason: '',
      allowanceRate: '50.00',
      paymentStatus: 'Ditolak',
      paymentAdviceNo: '',
      accountNumber: '',
    },
    'PA013': {
      id: 'PA013',
      name: 'Ahmad bin Omar',
      icNumber: '850505-05-2345',
      phone: '012-2233445',
      address: 'No. 987, Jalan Anggerik, Taman Anggerik, 43000 Kajang, Selangor',
      kariah: 'Masjid Al-Hidayah',
      attended: false,
      checkInTime: '',
      checkOutTime: '',
      reason: 'Urusan Keluarga',
      allowanceRate: '50.00',
      paymentStatus: 'Tidak Layak',
      paymentAdviceNo: '',
      accountNumber: '',
    }
  },
  'MP2024-007': {
    'PA016': {
      id: 'PA016',
      name: 'Ali bin Mohamed',
      icNumber: '880808-08-8901',
      phone: '012-5566778',
      address: 'No. 654, Jalan Seroja, Taman Seroja, 43000 Kajang, Selangor',
      kariah: 'Masjid Al-Hidayah',
      attended: true,
      checkInTime: '09:00',
      checkOutTime: '12:00',
      reason: '',
      allowanceRate: '100.00',
      paymentStatus: 'Diluluskan',
      paymentAdviceNo: 'PA-2024-007-001',
      accountNumber: '2233445566',
    },
    'PA017': {
      id: 'PA017',
      name: 'Nurul binti Omar',
      icNumber: '890909-09-0123',
      phone: '012-6677889',
      address: 'No. 876, Jalan Kemboja, Taman Kemboja, 43000 Kajang, Selangor',
      kariah: 'Masjid Al-Hidayah',
      attended: true,
      checkInTime: '09:15',
      checkOutTime: '12:15',
      reason: '',
      allowanceRate: '100.00',
      paymentStatus: 'Diluluskan',
      paymentAdviceNo: 'PA-2024-007-002',
      accountNumber: '3344556677',
    }
  },
  'MP2024-008': {
    'PA018': {
      id: 'PA018',
      name: 'Hassan bin Ibrahim',
      icNumber: '900101-01-2345',
      phone: '012-7788990',
      address: 'No. 543, Jalan Bunga Raya, Taman Bunga Raya, 43000 Kajang, Selangor',
      kariah: 'Masjid Al-Hidayah',
      attended: true,
      checkInTime: '09:00',
      checkOutTime: '17:00',
      reason: '',
      allowanceRate: '55.00',
      paymentStatus: 'Belum Dihantar',
      paymentAdviceNo: '',
      accountNumber: '',
    },
    'PA019': {
      id: 'PA019',
      name: 'Aminah binti Hassan',
      icNumber: '910202-02-4567',
      phone: '012-8899001',
      address: 'No. 765, Jalan Melur, Taman Melur, 43000 Kajang, Selangor',
      kariah: 'Masjid Al-Hidayah',
      attended: true,
      checkInTime: '09:15',
      checkOutTime: '17:15',
      reason: '',
      allowanceRate: '55.00',
      paymentStatus: 'Belum Dihantar',
      paymentAdviceNo: '',
      accountNumber: '',
    }
  }
};

// Activity data map
const activityDataMap = {
  'MP2024-001': {
    id: 'MP2024-001',
    name: 'Mesyuarat Perancangan Bulanan',
    type: 'Mesyuarat',
    date: '15-04-2024',
    location: 'Dewan Mesyuarat Eksekutif',
    status: 'Selesai',
    statusVariant: 'success',
    statusLine: 'bg-green-300',
  },
  'MP2024-002': {
    id: 'MP2024-002',
    name: 'Mesyuarat Perancangan Bulanan',
    type: 'Mesyuarat',
    date: '18-04-2024',
    location: 'Dewan Mesyuarat Eksekutif',
    status: 'Selesai',
    statusVariant: 'success',
    statusLine: 'bg-green-300',
  },
  'MP2024-003': {
    id: 'MP2024-003',
    name: 'Program Khidmat Masyarakat Ramadan',
    type: 'Program',
    date: '25-03-2024',
    location: 'Masjid Al-Hidayah, Shah Alam',
    status: 'Diluluskan',
    statusVariant: 'success',
    statusLine: 'bg-green-300',
  },
  'MP2024-004': {
    id: 'MP2024-004',
    name: 'Mesyuarat Eksekutif Bulanan',
    type: 'Mesyuarat',
    date: '15-03-2024',
    location: 'Dewan Mesyuarat Eksekutif',
    status: 'Menunggu Sokongan Eksekutif',
  },
  'MP2024-005': {
    id: 'MP2024-005',
    name: 'Latihan Sistem e-Zakat',
    type: 'Latihan',
    date: '02-04-2024',
    location: 'Bilik Latihan IT, Pejabat Zakat Petaling Jaya',
    status: 'Selesai',
    statusVariant: 'success',
    statusLine: 'bg-green-300',
  },
  'MP2024-006': {
    id: 'MP2024-006',
    name: 'Program Bantuan Asnaf Bulanan',
    type: 'Program',
    date: '05-04-2024',
    location: 'Dewan Serbaguna Masjid Kg Delek',
    status: 'Ditolak',
  },
  'MP2024-007': {
    id: 'MP2024-007',
    name: 'Program Khidmat Masyarakat',
    type: 'Program',
    date: '20-03-2024',
    location: 'Masjid Al-Hidayah',
    status: 'Diluluskan',
    statusVariant: 'success',
    statusLine: 'bg-green-300',
  },
  'MP2024-008': {
    id: 'MP2024-008',
    name: 'Latihan Pengurusan Aduan',
    type: 'Latihan',
    date: '12-04-2024',
    location: 'Bilik Latihan, Pejabat Zakat Gombak',
    status: 'Selesai',
    statusVariant: 'success',
    statusLine: 'bg-green-300',
  }
};

// Helper functions
const getStatusClass = (status) => {
  const statusClasses = {
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

const getPaymentStatusClass = (status) => {
  const statusClasses = {
    'Telah Dibayar': 'bg-green-100 text-green-800',
    'Menunggu Kelulusan Ketua Jabatan': 'bg-blue-100 text-blue-800',
    'Diluluskan': 'bg-green-100 text-green-800',
    'Tidak Layak': 'bg-gray-100 text-gray-800',
    'Telah Ditolak': 'bg-red-100 text-red-800',
  };
  return statusClasses[status] || 'bg-gray-100 text-gray-800';
};

// Load data based on activity ID and PA ID
onMounted(() => {
  // Load activity data from local data map
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
  }
  
  // Load PA data from local data map
  const paDetailedData = paDataMap[activityId];
  const paData = paDetailedData ? paDetailedData[paId] : null;
  if (paData) {
    penolongAmil.value = {
      id: paData.id,
      name: paData.name,
      icNumber: paData.icNumber,
      phone: paData.phone,
      address: paData.address,
      kariah: paData.kariah,
      attended: paData.attended,
      checkInTime: paData.checkInTime,
      checkOutTime: paData.checkOutTime,
      reason: paData.reason,
      allowanceRate: paData.allowanceRate,
      paymentStatus: paData.paymentStatus,
      paymentAdviceNo: paData.paymentAdviceNo,
      accountNumber: paData.accountNumber,
    };
  }
});
</script>

<style scoped>
/* Add any additional styles here */
</style> 