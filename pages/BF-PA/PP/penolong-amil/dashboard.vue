<!-- 
  RTMF SCREEN: PA-PP-PD-09_02
  PURPOSE: Penolong Amil Dashboard - Dashboard untuk Penolong Amil yang telah menerima tawaran
  DESCRIPTION: Dashboard utama untuk Penolong Amil yang telah aktif
  ROUTE: /BF-PA/PP/penolong-amil/dashboard
-->
<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />

    <!-- User Profile Card -->
    <rs-card class="mb-6">
      <template #body>
        <div class="flex items-center justify-between p-4">
          <div class="flex items-center gap-4">
            <div class="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold text-lg">
              A
            </div>
            <div>
              <h2 class="text-lg font-semibold text-gray-900">{{ userProfile.nama }}</h2>
              <p class="text-sm text-gray-600">Penolong Amil Aktif</p>
              <p class="text-xs text-success font-medium">Status: {{ userProfile.status }}</p>
            </div>
          </div>
          <div class="flex gap-2">
            <rs-button size="sm" variant="primary-outline" @click="showKadTauliah = true" title="Kad Tauliah">
              <Icon name="heroicons:identification" size="16" class="mr-2" />
              Kad Tauliah
            </rs-button>
            <rs-button size="sm" variant="primary-outline" @click="showSuratTawaran = true" title="Surat Tawaran">
              <Icon name="heroicons:document-text" size="16" class="mr-2" />
              Surat Tawaran
            </rs-button>
            <rs-button size="sm" variant="primary-outline" @click="showProfile = true">
              <Icon name="ph:user" size="16" class="mr-2" />
              Profil
            </rs-button>
            <rs-button size="sm" variant="secondary-outline" @click="handleLogout">
              <Icon name="ph:sign-out" size="16" class="mr-2" />
              Log Keluar
            </rs-button>
          </div>
        </div>
      </template>
    </rs-card>

    <!-- Quick Stats -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <rs-card>
        <template #body>
          <div class="text-center">
            <div class="text-2xl font-bold text-primary">{{ stats.totalSessions }}</div>
            <div class="text-sm text-gray-600">Sesi Perkhidmatan</div>
          </div>
        </template>
      </rs-card>
      
      <rs-card>
        <template #body>
          <div class="text-center">
            <div class="text-2xl font-bold text-success">{{ stats.totalCollections }}</div>
            <div class="text-sm text-gray-600">Kutipan Zakat</div>
          </div>
        </template>
      </rs-card>
      
      <rs-card>
        <template #body>
          <div class="text-center">
            <div class="text-2xl font-bold text-warning">{{ stats.pendingTasks }}</div>
            <div class="text-sm text-gray-600">Tugasan Tertunda</div>
          </div>
        </template>
      </rs-card>
      
      <rs-card>
        <template #body>
          <div class="text-center">
            <div class="text-2xl font-bold text-info">{{ stats.performanceRating }}</div>
            <div class="text-sm text-gray-600">Penilaian Prestasi</div>
          </div>
        </template>
      </rs-card>
    </div>

    <!-- Main Actions -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
      <rs-card class="cursor-pointer hover:shadow-lg transition-shadow" @click="navigateTo('/BF-PA/PP/pra-daftar-v3/zakat-collection')">
        <template #body>
          <div class="text-center p-4">
            <Icon name="ph:money" class="text-primary mx-auto mb-3" size="48" />
            <h3 class="text-lg font-semibold text-gray-900 mb-2">Kutipan Zakat</h3>
            <p class="text-sm text-gray-600">Urus kutipan zakat dan bayaran</p>
          </div>
        </template>
      </rs-card>

      <rs-card class="cursor-pointer hover:shadow-lg transition-shadow" @click="navigateTo('/BF-PA/PP/pra-daftar-v3/reports')">
        <template #body>
          <div class="text-center p-4">
            <Icon name="ph:chart-bar" class="text-primary mx-auto mb-3" size="48" />
            <h3 class="text-lg font-semibold text-gray-900 mb-2">Laporan</h3>
            <p class="text-sm text-gray-600">Lihat laporan dan statistik</p>
          </div>
        </template>
      </rs-card>

      <rs-card class="cursor-pointer hover:shadow-lg transition-shadow" @click="navigateTo('/BF-PA/PP/pra-daftar-v3/tasks')">
        <template #body>
          <div class="text-center p-4">
            <Icon name="ph:list-checks" class="text-primary mx-auto mb-3" size="48" />
            <h3 class="text-lg font-semibold text-gray-900 mb-2">Tugasan</h3>
            <p class="text-sm text-gray-600">Urus tugasan dan aktiviti</p>
          </div>
        </template>
      </rs-card>

      <rs-card class="cursor-pointer hover:shadow-lg transition-shadow" @click="navigateTo('/BF-PA/PP/pra-daftar-v3/training')">
        <template #body>
          <div class="text-center p-4">
            <Icon name="ph:graduation-cap" class="text-primary mx-auto mb-3" size="48" />
            <h3 class="text-lg font-semibold text-gray-900 mb-2">Latihan</h3>
            <p class="text-sm text-gray-600">Akses modul latihan</p>
          </div>
        </template>
      </rs-card>

      <rs-card class="cursor-pointer hover:shadow-lg transition-shadow" @click="navigateTo('/BF-PA/PP/pra-daftar-v3/communication')">
        <template #body>
          <div class="text-center p-4">
            <Icon name="ph:chat-circle" class="text-primary mx-auto mb-3" size="48" />
            <h3 class="text-lg font-semibold text-gray-900 mb-2">Komunikasi</h3>
            <p class="text-sm text-gray-600">Hubungi penyelia dan rakan sekerja</p>
          </div>
        </template>
      </rs-card>

      <rs-card class="cursor-pointer hover:shadow-lg transition-shadow" @click="navigateTo('/BF-PA/PP/pra-daftar-v3/settings')">
        <template #body>
          <div class="text-center p-4">
            <Icon name="ph:gear" class="text-primary mx-auto mb-3" size="48" />
            <h3 class="text-lg font-semibold text-gray-900 mb-2">Tetapan</h3>
            <p class="text-sm text-gray-600">Urus tetapan akaun</p>
          </div>
        </template>
      </rs-card>
    </div>

    <!-- Recent Activities -->
    <rs-card class="mb-6">
      <template #header>
        <div class="flex items-center justify-between">
          <h3 class="text-lg font-semibold text-gray-900">Aktiviti Terkini</h3>
          <rs-button variant="primary-outline" size="sm" @click="navigateTo('/BF-PA/PP/pra-daftar-v3/activities')">
            Lihat Semua
          </rs-button>
        </div>
      </template>
      <template #body>
        <div class="space-y-4">
          <div v-for="activity in recentActivities" :key="activity.id" class="flex items-start gap-3 p-3 border border-gray-200 rounded-lg">
            <div class="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
              <Icon :name="activity.icon" class="text-primary" size="16" />
            </div>
            <div class="flex-1">
              <h4 class="font-medium text-gray-900">{{ activity.title }}</h4>
              <p class="text-sm text-gray-600">{{ activity.description }}</p>
              <p class="text-xs text-gray-500 mt-1">{{ activity.timestamp }}</p>
            </div>
          </div>
        </div>
      </template>
    </rs-card>

    <!-- Profile Modal -->
    <rs-modal v-model="showProfile" title="Profil Penolong Amil">
      <template #body>
        <div class="space-y-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Nama Penuh</label>
              <p class="text-gray-900">{{ userProfile.nama }}</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">No. KP</label>
              <p class="text-gray-900">{{ userProfile.noKP }}</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Emel</label>
              <p class="text-gray-900">{{ userProfile.emel }}</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Telefon</label>
              <p class="text-gray-900">{{ userProfile.telefon }}</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Kategori</label>
              <p class="text-gray-900">{{ userProfile.kategori }}</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Institusi</label>
              <p class="text-gray-900">{{ userProfile.institusi }}</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Tarikh Lantikan</label>
              <p class="text-gray-900">{{ userProfile.tarikhLantikan }}</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <rs-badge variant="success">{{ userProfile.status }}</rs-badge>
            </div>
          </div>
        </div>
      </template>
      <template #footer>
        <div class="flex justify-end gap-2">
          <rs-button variant="secondary-outline" @click="showProfile = false">
            Tutup
          </rs-button>
          <rs-button variant="primary" @click="navigateTo('/BF-PA/PP/pra-daftar-v3/profile/edit')">
            Kemaskini Profil
          </rs-button>
        </div>
      </template>
    </rs-modal>

    <!-- Kad Tauliah Modal -->
    <rs-modal v-model="showKadTauliah" title="Kad Tauliah Penolong Amil" size="lg" position="center">
      <template #body>
        <div class="space-y-6">
          <!-- Kad Tauliah Design -->
          <div class="bg-gradient-to-br from-primary/10 to-secondary/10 border-2 border-primary/20 rounded-lg p-6">
            <div class="text-center mb-6">
              <img src="https://www.zakatselangor.com.my/wp-content/uploads/2018/10/lzs-logo.png" alt="LZS" class="h-16 mx-auto mb-4" />
              <h2 class="text-xl font-bold text-primary mb-2">KAD TAULIAH</h2>
              <h3 class="text-lg font-semibold text-gray-900">PENOLONG AMIL</h3>
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="space-y-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Nama</label>
                  <p class="text-gray-900 font-semibold">{{ userProfile.nama }}</p>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">No. Kad Pengenalan</label>
                  <p class="text-gray-900">{{ userProfile.noKP }}</p>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Kategori</label>
                  <p class="text-gray-900">{{ userProfile.kategori }}</p>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Institusi</label>
                  <p class="text-gray-900">{{ userProfile.institusi }}</p>
                </div>
              </div>
              
              <div class="space-y-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Tarikh Lantikan</label>
                  <p class="text-gray-900">{{ userProfile.tarikhLantikan }}</p>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <rs-badge variant="success">{{ userProfile.status }}</rs-badge>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Kod Kad</label>
                  <p class="text-gray-900 font-mono">PA-{{ userProfile.noKP.slice(-6) }}</p>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Tempoh Sah</label>
                  <p class="text-gray-900">2024 - 2027</p>
                </div>
              </div>
            </div>
            
            <div class="mt-6 pt-4 border-t border-gray-200">
              <div class="text-center text-sm text-gray-600">
                <p>Kad ini sah sehingga 31 Disember 2027</p>
                <p class="mt-1">Lembaga Zakat Selangor</p>
              </div>
            </div>
          </div>
        </div>
      </template>
      <template #footer>
        <div class="flex justify-end gap-2">
          <rs-button variant="secondary-outline" @click="showKadTauliah = false">
            Tutup
          </rs-button>
          <rs-button variant="primary" @click="downloadKadTauliah">
            <Icon name="ph:download" class="w-4 h-4 mr-2" />
            Muat Turun
          </rs-button>
        </div>
      </template>
    </rs-modal>

    <!-- Surat Tawaran Modal -->
    <rs-modal v-model="showSuratTawaran" title="Surat Tawaran Pelantikan" size="lg" position="center">
      <template #body>
        <div class="space-y-6">
          <!-- Letter Header -->
          <div class="flex justify-between items-start pb-4 border-b">
            <div class="flex-1">
              <img src="https://www.zakatselangor.com.my/wp-content/uploads/2018/10/lzs-logo.png" alt="LZS" class="h-12 mb-4" />
              <div class="text-sm text-gray-600">
                <div class="font-semibold text-gray-900">Lembaga Zakat Selangor</div>
                <div>Majlis Agama Islam Selangor</div>
                <div>Menara Selatan, Bangunan Sultan Idris Shah</div>
                <div>Persiaran Masjid, Seksyen 5</div>
                <div>40000 Shah Alam, Selangor</div>
              </div>
            </div>
            <div class="text-right text-sm text-gray-600">
              <div>Rujukan: LZS/PA/2024/001</div>
              <div>Tarikh: {{ new Date().toLocaleDateString('ms-MY') }}</div>
            </div>
          </div>

          <!-- Letter Content -->
          <div class="space-y-4 text-sm">
            <div>
              <p class="font-semibold text-gray-900 mb-2">Kepada:</p>
              <p class="text-gray-700">{{ userProfile.nama }}</p>
              <p class="text-gray-700">{{ userProfile.noKP }}</p>
            </div>
            
            <div>
              <p class="font-semibold text-gray-900 mb-2">Subjek: Tawaran Pelantikan Sebagai Penolong Amil</p>
            </div>
            
            <div class="space-y-3 text-gray-700">
              <p>Assalamualaikum W.B.T.</p>
              
              <p>
                Dengan hormatnya dimaklumkan bahawa Lembaga Zakat Selangor (LZS) dengan sukacitanya ingin menawarkan 
                jawatan Penolong Amil kepada Tuan/Puan.
              </p>
              
              <p>
                <strong>Butiran Tawaran:</strong>
              </p>
              <ul class="list-disc list-inside space-y-1 ml-4">
                <li>Jawatan: {{ userProfile.kategori }}</li>
                <li>Institusi: {{ userProfile.institusi }}</li>
                <li>Tempoh: 2024 - 2027</li>
                <li>Elaun: RM 500.00 sebulan</li>
              </ul>
              
              <p>
                Tuan/Puan dikehendaki untuk:
              </p>
              <ol class="list-decimal list-inside space-y-1 ml-4">
                <li>Menerima tawaran ini dalam tempoh 14 hari</li>
                <li>Lengkapkan maklumat profil dalam sistem</li>
                <li>Menghadiri sesi orientasi yang akan diatur</li>
                <li>Memulakan tugas pada tarikh yang ditetapkan</li>
              </ol>
              
              <p>
                Sekiranya Tuan/Puan bersetuju dengan tawaran ini, sila log masuk ke sistem dan lengkapkan 
                maklumat profil yang diperlukan.
              </p>
              
              <p>
                Sekian, terima kasih.
              </p>
            </div>
          </div>

          <!-- Signature -->
          <div class="mt-8 pt-4 border-t border-gray-200">
            <div class="text-center">
              <p class="font-semibold text-gray-900">Yang benar,</p>
              <p class="text-gray-700 mt-4">_________________________</p>
              <p class="text-sm text-gray-600">Ketua Eksekutif</p>
              <p class="text-sm text-gray-600">Lembaga Zakat Selangor</p>
            </div>
          </div>
        </div>
      </template>
      <template #footer>
        <div class="flex justify-end gap-2">
          <rs-button variant="secondary-outline" @click="showSuratTawaran = false">
            Tutup
          </rs-button>
          <rs-button variant="primary" @click="downloadSuratTawaran">
            <Icon name="ph:download" class="w-4 h-4 mr-2" />
            Muat Turun
          </rs-button>
        </div>
      </template>
    </rs-modal>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";

definePageMeta({
  title: "Dashboard Penolong Amil",
  description: "Dashboard utama untuk Penolong Amil yang telah aktif",
});

const breadcrumb = ref([
  {
    name: "Penolong Amil",
    type: "link",
    path: "/BF-PA/PP/PM/01",
  },
  {
    name: "Pra Daftar V3",
    type: "link",
    path: "/BF-PA/PP/pra-daftar-v3",
  },
  {
    name: "Dashboard Penolong Amil",
    type: "current",
    path: "/BF-PA/PP/penolong-amil/dashboard",
  },
]);

// User profile data
const userProfile = ref({
  nama: "Ahmad bin Abdullah",
  noKP: "901231012345",
  emel: "ahmad.abdullah@email.com",
  telefon: "0123456789",
  kategori: "Penolong Amil Fitrah",
  institusi: "Masjid Wilayah Persekutuan",
  tarikhLantikan: "2024-01-15",
  status: "Aktif"
});

// Stats data
const stats = ref({
  totalSessions: 24,
  totalCollections: 156,
  pendingTasks: 3,
  performanceRating: "4.8/5"
});

// Recent activities
const recentActivities = ref([
  {
    id: 1,
    title: "Kutipan Zakat Fitrah",
    description: "Berjaya mengutip zakat fitrah sebanyak RM 50.00",
    timestamp: "2 jam yang lalu",
    icon: "ph:money"
  },
  {
    id: 2,
    title: "Laporan Bulanan",
    description: "Menyerahkan laporan kutipan bulanan",
    timestamp: "1 hari yang lalu",
    icon: "ph:chart-bar"
  },
  {
    id: 3,
    title: "Latihan Pengesahan",
    description: "Menghadiri sesi latihan pengesahan dokumen",
    timestamp: "2 hari yang lalu",
    icon: "ph:graduation-cap"
  },
  {
    id: 4,
    title: "Tugasan Baru",
    description: "Menerima tugasan kutipan zakat di kawasan baru",
    timestamp: "3 hari yang lalu",
    icon: "ph:list-checks"
  }
]);

const showProfile = ref(false);
const showKadTauliah = ref(false);
const showSuratTawaran = ref(false);

const handleLogout = () => {
  if (confirm("Adakah anda pasti ingin log keluar?")) {
    // In real implementation, clear session/token
    navigateTo("/BF-PA/PP/penolong-amil/login");
  }
};

const downloadKadTauliah = () => {
  // In real implementation, this would generate and download PDF
  alert('Muat turun Kad Tauliah...');
  showKadTauliah.value = false;
};

const downloadSuratTawaran = () => {
  // In real implementation, this would generate and download PDF
  alert('Muat turun Surat Tawaran...');
  showSuratTawaran.value = false;
};

onMounted(() => {
  // In real implementation, fetch user profile and stats
  console.log("Loading Penolong Amil dashboard");
});
</script>

<style scoped>
/* Custom styles for Penolong Amil dashboard */
</style> 