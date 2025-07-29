<!-- 
  RTMF SCREEN: PA-PP-PD-01_05
  PURPOSE: Service History - Paparan Maklumat Lantikan / Perkhidmatan
  DESCRIPTION: Display service appointment details, history, and performance metrics
  ROUTE: /BF-PA/PP/pra-daftar-v3/service-history/[rujukan]
-->
<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />

    <rs-card class="mt-4">
      <template #header>
        <div class="flex justify-between items-center">
          <h2 class="text-xl font-semibold">
            Maklumat Lantikan & Perkhidmatan Penolong Amil
          </h2>
          <div class="flex gap-2">
            <rs-button
              variant="secondary-outline"
              @click="handleBack"
            >
              <Icon name="ph:arrow-left" class="w-4 h-4 mr-1" />
              Kembali
            </rs-button>
          </div>
        </div>
      </template>

      <template #body>
        <div class="p-4">
          <!-- Current Appointment Header -->
          <div class="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <div class="flex justify-between items-center">
              <div>
                <h3 class="text-lg font-semibold text-green-900">
                  Pelantikan Semasa
                </h3>
                <p class="text-sm text-green-600">
                  ID Penolong Amil: {{ currentAppointment.penolongAmilId }}
                </p>
              </div>
              <div class="flex gap-2">
                <rs-badge variant="success">
                  {{ currentAppointment.status }}
                </rs-badge>
                <rs-badge variant="info">
                  {{ currentAppointment.kategori }}
                </rs-badge>
              </div>
            </div>
          </div>

          <!-- Current Appointment Details -->
          <div class="mb-8 p-6 border border-gray-200 rounded-lg">
            <h3 class="text-lg font-semibold mb-4 text-gray-900">
              Butiran Pelantikan Semasa
            </h3>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Nama Penolong Amil
                </label>
                <p class="text-gray-900 font-semibold">{{ currentAppointment.nama }}</p>
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Nombor Kad Pengenalan
                </label>
                <p class="text-gray-900">{{ currentAppointment.noKP }}</p>
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Kategori Penolong Amil
                </label>
                <p class="text-gray-900">{{ currentAppointment.kategori }}</p>
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Jawatan
                </label>
                <p class="text-gray-900">{{ currentAppointment.jawatan }}</p>
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Institusi/Kariah
                </label>
                <p class="text-gray-900">{{ currentAppointment.institusi }}</p>
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Sesi Perkhidmatan
                </label>
                <p class="text-gray-900">{{ currentAppointment.sesiPerkhidmatan }}</p>
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Tarikh Lantikan
                </label>
                <p class="text-gray-900">{{ currentAppointment.tarikhLantikan }}</p>
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Tarikh Tamat
                </label>
                <p class="text-gray-900">{{ currentAppointment.tarikhTamat }}</p>
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Status Pelantikan
                </label>
                <p class="text-gray-900">{{ currentAppointment.status }}</p>
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Tempoh Perkhidmatan
                </label>
                <p class="text-gray-900">{{ currentAppointment.tempohPerkhidmatan }}</p>
              </div>
            </div>
          </div>

          <!-- Service History -->
          <div class="mb-8">
            <h3 class="text-lg font-semibold mb-4 text-gray-900">
              Sejarah Perkhidmatan
            </h3>
            
            <div class="space-y-4">
              <div v-for="(appointment, index) in serviceHistory" :key="index" 
                   class="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <div class="flex justify-between items-start mb-3">
                  <div>
                    <h4 class="font-semibold text-gray-900">{{ appointment.sesiPerkhidmatan }}</h4>
                    <p class="text-sm text-gray-600">{{ appointment.institusi }}</p>
                  </div>
                  <div class="flex gap-2">
                    <rs-badge :variant="getAppointmentStatusVariant(appointment.status)">
                      {{ appointment.status }}
                    </rs-badge>
                    <rs-badge variant="secondary">
                      {{ appointment.kategori }}
                    </rs-badge>
                  </div>
                </div>
                
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <span class="font-medium text-gray-700">Jawatan:</span>
                    <p class="text-gray-900">{{ appointment.jawatan }}</p>
                  </div>
                  <div>
                    <span class="font-medium text-gray-700">Tarikh Lantikan:</span>
                    <p class="text-gray-900">{{ appointment.tarikhLantikan }}</p>
                  </div>
                  <div>
                    <span class="font-medium text-gray-700">Tarikh Tamat:</span>
                    <p class="text-gray-900">{{ appointment.tarikhTamat }}</p>
                  </div>
                </div>
                
                <div v-if="appointment.notes" class="mt-3 p-3 bg-gray-50 rounded-lg">
                  <p class="text-sm text-gray-700">
                    <span class="font-medium">Catatan:</span> {{ appointment.notes }}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <!-- Performance Metrics -->
          <div class="mb-8 p-6 border border-gray-200 rounded-lg">
            <h3 class="text-lg font-semibold mb-4 text-gray-900">
              Metrik Prestasi
            </h3>
            
            <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div class="text-center p-4 bg-blue-50 rounded-lg">
                <div class="text-2xl font-bold text-blue-600">{{ performanceMetrics.totalSessions }}</div>
                <div class="text-sm text-blue-800">Sesi Perkhidmatan</div>
              </div>
              
              <div class="text-center p-4 bg-green-50 rounded-lg">
                <div class="text-2xl font-bold text-green-600">{{ performanceMetrics.totalYears }}</div>
                <div class="text-sm text-green-800">Tahun Perkhidmatan</div>
              </div>
              
              <div class="text-center p-4 bg-yellow-50 rounded-lg">
                <div class="text-2xl font-bold text-yellow-600">{{ performanceMetrics.attendanceRate }}%</div>
                <div class="text-sm text-yellow-800">Kadar Kehadiran</div>
              </div>
              
              <div class="text-center p-4 bg-purple-50 rounded-lg">
                <div class="text-2xl font-bold text-purple-600">{{ performanceMetrics.satisfactionRating }}/5</div>
                <div class="text-sm text-purple-800">Penilaian Kepuasan</div>
              </div>
            </div>
          </div>

          <!-- Certificates & Awards -->
          <div class="p-6 border border-gray-200 rounded-lg">
            <h3 class="text-lg font-semibold mb-4 text-gray-900">
              Sijil & Anugerah
            </h3>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div v-for="(certificate, index) in certificates" :key="index" 
                   class="p-4 border border-gray-200 rounded-lg">
                <div class="flex items-center mb-2">
                  <Icon name="ph:certificate" class="text-blue-600 mr-2" />
                  <h4 class="font-medium text-gray-900">{{ certificate.name }}</h4>
                </div>
                <p class="text-sm text-gray-600 mb-2">{{ certificate.issuer }}</p>
                <p class="text-sm text-gray-500">{{ certificate.date }}</p>
              </div>
            </div>
          </div>
        </div>
      </template>
    </rs-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";

definePageMeta({
  title: "Maklumat Lantikan & Perkhidmatan",
  description: "Paparan maklumat lantikan dan sejarah perkhidmatan",
});

const route = useRoute();
const rujukan = route.params.rujukan;

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
    name: "Sejarah Perkhidmatan",
    type: "current",
    path: `/BF-PA/PP/pra-daftar-v3/service-history/${rujukan}`,
  },
]);

// Mock current appointment data
const currentAppointment = ref({
  penolongAmilId: "PA-2024-001",
  nama: "Ahmad Bin Abdullah",
  noKP: "901231012345",
  kategori: "PAK (Penolong Amil Kariah)",
  jawatan: "Ketua Penolong Amil",
  institusi: "Masjid Negeri Selangor",
  sesiPerkhidmatan: "Pelantikan Penolong Amil Kariah 2024-2026",
  tarikhLantikan: "2024-01-15",
  tarikhTamat: "2026-01-15",
  status: "Aktif",
  tempohPerkhidmatan: "2 tahun"
});

// Mock service history
const serviceHistory = ref([
  {
    sesiPerkhidmatan: "Pelantikan Penolong Amil Kariah 2022-2024",
    institusi: "Masjid Negeri Selangor",
    kategori: "PAK",
    jawatan: "Penolong Amil",
    tarikhLantikan: "2022-01-15",
    tarikhTamat: "2024-01-15",
    status: "Tamat",
    notes: "Perkhidmatan cemerlang dengan kadar kehadiran 95%"
  },
  {
    sesiPerkhidmatan: "Pelantikan Penolong Amil Kariah 2020-2022",
    institusi: "Masjid Al-Amin",
    kategori: "PAK",
    jawatan: "Penolong Amil",
    tarikhLantikan: "2020-01-15",
    tarikhTamat: "2022-01-15",
    status: "Tamat",
    notes: "Perkhidmatan yang memuaskan"
  }
]);

// Mock performance metrics
const performanceMetrics = ref({
  totalSessions: 8,
  totalYears: 4,
  attendanceRate: 95,
  satisfactionRating: 4.5
});

// Mock certificates
const certificates = ref([
  {
    name: "Sijil Penolong Amil Cemerlang",
    issuer: "Jabatan Agama Islam Selangor",
    date: "2023-12-15"
  },
  {
    name: "Sijil Kursus Pengurusan Zakat",
    issuer: "Institut Latihan Islam Malaysia",
    date: "2022-06-20"
  },
  {
    name: "Anugerah Penolong Amil Terbaik",
    issuer: "Masjid Negeri Selangor",
    date: "2023-01-15"
  }
]);

// Helper functions
const getAppointmentStatusVariant = (status) => {
  const statusVariants = {
    "Aktif": "success",
    "Tamat": "secondary",
    "Ditamatkan": "danger",
    "Dalam Proses": "warning"
  };
  return statusVariants[status] || "default";
};

const handleBack = () => {
  navigateTo("/BF-PA/PP/pra-daftar-v3");
};

onMounted(() => {
  // In real implementation, fetch appointment data based on rujukan
  console.log("Loading service history for:", rujukan);
});
</script>

<style scoped>
/* Custom styles for service history */
</style> 