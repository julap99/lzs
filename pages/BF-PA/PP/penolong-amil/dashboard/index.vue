<!-- 
  RTMF SCREEN: PA-PP-PD-09_02
  PURPOSE: Penolong Amil Dashboard - Dashboard untuk Penolong Amil Kariah (PAK) yang telah menerima tawaran
  DESCRIPTION: Dashboard utama untuk Penolong Amil Kariah yang fokus pada aktiviti agihan
  ROUTE: /BF-PA/PP/penolong-amil/dashboard
-->
<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />

    <!-- Welcome Header -->
    <rs-card class="mb-6 bg-gradient-to-r from-primary/5 to-secondary/5 border-l-4 border-primary">
      <template #body>
        <div class="text-center py-6">
          <h1 class="text-3xl font-bold text-primary mb-2">Selamat Datang ke Dashboard Penolong Amil</h1>
          <p class="text-xl text-gray-700 mb-3">اَلسَلامُ عَلَيْكُم وَرَحْمَةُ اَللهِ وَبَرَكاتُهُ‎</p>
          <p class="text-lg text-gray-600">Selamat menjalankan amanah agihan zakat kepada asnaf</p>
        </div>
      </template>
    </rs-card>

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
              <p class="text-sm text-gray-600">Penolong Amil Kariah (PAK)</p>
              <p class="text-xs text-success font-medium">Status: {{ userProfile.status }}</p>
              <p class="text-xs text-primary font-medium">Kariah: {{ userProfile.kariah }}</p>
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

    <!-- PAK Quick Stats - Focus on Agihan -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <rs-card>
        <template #body>
          <div class="text-center">
            <div class="text-2xl font-bold text-primary">{{ stats.totalAgihan }}</div>
            <div class="text-sm text-gray-600">Jumlah Agihan</div>
            <div class="text-xs text-success mt-1">Bulan Ini</div>
          </div>
        </template>
      </rs-card>
      
      <rs-card>
        <template #body>
          <div class="text-center">
            <div class="text-2xl font-bold text-success">{{ stats.asnafDibantu }}</div>
            <div class="text-sm text-gray-600">Asnaf Dibantu</div>
            <div class="text-xs text-info mt-1">Aktif</div>
          </div>
        </template>
      </rs-card>
      
      <rs-card>
        <template #body>
          <div class="text-center">
            <div class="text-2xl font-bold text-warning">{{ stats.tugasanTertunda }}</div>
            <div class="text-sm text-gray-600">Tugasan Agihan</div>
            <div class="text-xs text-warning mt-1">Tertunda</div>
          </div>
        </template>
      </rs-card>
      
      <rs-card>
        <template #body>
          <div class="text-center">
            <div class="text-2xl font-bold text-info">{{ stats.prestasiAgihan }}</div>
            <div class="text-sm text-gray-600">Prestasi Agihan</div>
            <div class="text-xs text-success mt-1">Cemerlang</div>
          </div>
        </template>
      </rs-card>
    </div>

    <!-- PAK Main Actions - Focus on Agihan -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
      <rs-card class="cursor-pointer hover:shadow-lg transition-shadow" @click="navigateTo('/BF-PA/PP/penolong-amil/agihan-bantuan')">
        <template #body>
          <div class="text-center p-4">
            <Icon name="ph:hand-heart" class="text-primary mx-auto mb-3" size="48" />
            <h3 class="text-lg font-semibold text-gray-900 mb-2">Agihan Bantuan</h3>
            <p class="text-sm text-gray-600">Urus agihan bantuan kepada asnaf</p>
          </div>
        </template>
      </rs-card>

      <rs-card class="cursor-pointer hover:shadow-lg transition-shadow" @click="navigateTo('/BF-PA/PP/penolong-amil/senarai-asnaf')">
        <template #body>
          <div class="text-center p-4">
            <Icon name="ph:users" class="text-primary mx-auto mb-3" size="48" />
            <h3 class="text-lg font-semibold text-gray-900 mb-2">Senarai Asnaf</h3>
            <p class="text-sm text-gray-600">Kelola maklumat asnaf kariah</p>
          </div>
        </template>
      </rs-card>

      <rs-card class="cursor-pointer hover:shadow-lg transition-shadow" @click="navigateTo('/BF-PA/PP/penolong-amil/laporan-agihan')">
        <template #body>
          <div class="text-center p-4">
            <Icon name="ph:chart-bar" class="text-primary mx-auto mb-3" size="48" />
            <h3 class="text-lg font-semibold text-gray-900 mb-2">Laporan Agihan</h3>
            <p class="text-sm text-gray-600">Lihat laporan prestasi agihan</p>
          </div>
        </template>
      </rs-card>

      <rs-card class="cursor-pointer hover:shadow-lg transition-shadow" @click="navigateTo('/BF-PA/PP/penolong-amil/tugasan-agihan')">
        <template #body>
          <div class="text-center p-4">
            <Icon name="ph:list-checks" class="text-primary mx-auto mb-3" size="48" />
            <h3 class="text-lg font-semibold text-gray-900 mb-2">Tugasan Agihan</h3>
            <p class="text-sm text-gray-600">Urus tugasan agihan harian</p>
          </div>
        </template>
      </rs-card>

      <rs-card class="cursor-pointer hover:shadow-lg transition-shadow" @click="navigateTo('/BF-PA/PP/penolong-amil/bancian-asnaf')">
        <template #body>
          <div class="text-center p-4">
            <Icon name="ph:clipboard-text" class="text-primary mx-auto mb-3" size="48" />
            <h3 class="text-lg font-semibold text-gray-900 mb-2">Bancian Asnaf</h3>
            <p class="text-sm text-gray-600">Bancian dan kemaskini asnaf</p>
          </div>
        </template>
      </rs-card>

      <rs-card class="cursor-pointer hover:shadow-lg transition-shadow" @click="navigateTo('/BF-PA/PP/penolong-amil/komunikasi-kariah')">
        <template #body>
          <div class="text-center p-4">
            <Icon name="ph:chat-circle" class="text-primary mx-auto mb-3" size="48" />
            <h3 class="text-lg font-semibold text-gray-900 mb-2">Komunikasi Kariah</h3>
            <p class="text-sm text-gray-600">Hubungi ahli kariah dan asnaf</p>
          </div>
        </template>
      </rs-card>
    </div>

    <!-- Recent Agihan Activities -->
    <rs-card class="mb-6">
      <template #header>
        <div class="flex items-center justify-between">
          <h3 class="text-lg font-semibold text-gray-900">Aktiviti Agihan Terkini</h3>
          <rs-button variant="primary-outline" size="sm" @click="navigateTo('/BF-PA/PP/penolong-amil/aktiviti-agihan')">
            Lihat Semua
          </rs-button>
        </div>
      </template>
      <template #body>
        <div class="space-y-4">
          <div v-for="activity in recentAgihanActivities" :key="activity.id" class="flex items-start gap-3 p-3 border border-gray-200 rounded-lg">
            <div class="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
              <Icon :name="activity.icon" class="text-primary" size="16" />
            </div>
            <div class="flex-1">
              <h4 class="font-medium text-gray-900">{{ activity.title }}</h4>
              <p class="text-sm text-gray-600">{{ activity.description }}</p>
              <div class="flex items-center gap-2 mt-1">
                <p class="text-xs text-gray-500">{{ activity.timestamp }}</p>
                <rs-badge :variant="activity.statusVariant" size="sm">{{ activity.status }}</rs-badge>
              </div>
            </div>
          </div>
        </div>
      </template>
    </rs-card>

    <!-- Kariah Information -->
    <rs-card class="mb-6">
      <template #header>
        <h3 class="text-lg font-semibold text-gray-900">Maklumat Kariah</h3>
      </template>
      <template #body>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div class="text-center p-4 bg-blue-50 rounded-lg">
            <div class="text-2xl font-bold text-blue-600">{{ kariahInfo.totalAhli }}</div>
            <div class="text-sm text-gray-600">Jumlah Ahli Kariah</div>
          </div>
          <div class="text-center p-4 bg-green-50 rounded-lg">
            <div class="text-2xl font-bold text-green-600">{{ kariahInfo.totalAsnaf }}</div>
            <div class="text-sm text-gray-600">Jumlah Asnaf</div>
          </div>
          <div class="text-center p-4 bg-orange-50 rounded-lg">
            <div class="text-2xl font-bold text-orange-600">{{ kariahInfo.kawasanAgihan }}</div>
            <div class="text-sm text-gray-600">Kawasan Agihan</div>
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
              <label class="block text-sm font-medium text-gray-700 mb-1">Kariah</label>
              <p class="text-gray-900">{{ userProfile.kariah }}</p>
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
              <h3 class="text-lg font-semibold text-gray-900">PENOLONG AMIL KARIAH (PAK)</h3>
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
                  <label class="block text-sm font-medium text-gray-700 mb-1">Kariah</label>
                  <p class="text-gray-900">{{ userProfile.kariah }}</p>
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
                  <p class="text-gray-900 font-mono">PAK-{{ userProfile.noKP.slice(-6) }}</p>
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
              <p class="font-semibold text-gray-900 mb-2">Subjek: Tawaran Pelantikan Sebagai Penolong Amil Kariah (PAK)</p>
            </div>
            
            <div class="space-y-3 text-gray-700">
              <p>Assalamualaikum W.B.T.</p>
              
              <p>
                Dengan hormatnya dimaklumkan bahawa Lembaga Zakat Selangor (LZS) dengan sukacitanya ingin menawarkan 
                jawatan Penolong Amil Kariah (PAK) kepada Tuan/Puan.
              </p>
              
              <p>
                <strong>Butiran Tawaran:</strong>
              </p>
              <ul class="list-disc list-inside space-y-1 ml-4">
                <li>Jawatan: {{ userProfile.kategori }}</li>
                <li>Kariah: {{ userProfile.kariah }}</li>
                <li>Institusi: {{ userProfile.institusi }}</li>
                <li>Tempoh: 2024 - 2027</li>
                <li>Elaun: RM 500.00 sebulan</li>
                <li>Skop Tugas: Agihan bantuan kepada asnaf dalam kariah</li>
              </ul>
              
              <p>
                Tuan/Puan dikehendaki untuk:
              </p>
              <ol class="list-decimal list-inside space-y-1 ml-4">
                <li>Menerima tawaran ini dalam tempoh 14 hari</li>
                <li>Lengkapkan maklumat profil dalam sistem</li>
                <li>Menghadiri sesi orientasi yang akan diatur</li>
                <li>Memulakan tugas agihan pada tarikh yang ditetapkan</li>
                <li>Bertanggungjawab terhadap agihan bantuan kepada asnaf dalam kariah</li>
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
  kategori: "Penolong Amil Kariah (PAK)",
  institusi: "Masjid Wilayah Persekutuan",
      tarikhLantikan: "15-01-2024",
  status: "Aktif",
  kariah: "Kariah A"
});

// Stats data - PAK focused on Agihan
const stats = ref({
  totalAgihan: 120,
  asnafDibantu: 80,
  tugasanTertunda: 5,
  prestasiAgihan: "4.9/5"
});

// Recent agihan activities
const recentAgihanActivities = ref([
  {
    id: 1,
    title: "Agihan Zakat Fitrah",
    description: "Berjaya mengagihkan zakat fitrah kepada 50 asnaf",
    timestamp: "2 jam yang lalu",
    icon: "ph:hand-heart",
    status: "Berjaya",
    statusVariant: "success"
  },
  {
    id: 2,
    title: "Laporan Bulanan",
    description: "Menyerahkan laporan agihan bulanan",
    timestamp: "1 hari yang lalu",
    icon: "ph:chart-bar",
    status: "Selesai",
    statusVariant: "success"
  },
  {
    id: 3,
    title: "Tugasan Baru",
    description: "Menerima tugasan agihan zakat di kawasan baru",
    timestamp: "2 hari yang lalu",
    icon: "ph:list-checks",
    status: "Tertunda",
    statusVariant: "warning"
  },
  {
    id: 4,
    title: "Bancian Asnaf",
    description: "Mengemaskini maklumat asnaf kariah",
    timestamp: "3 hari yang lalu",
    icon: "ph:clipboard-text",
    status: "Selesai",
    statusVariant: "success"
  }
]);

// Kariah Information
const kariahInfo = ref({
  totalAhli: 150,
  totalAsnaf: 200,
  kawasanAgihan: "Kawasan A, Kawasan B, Kawasan C"
});

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
  
  // Ensure sidebar is visible by removing menu-hide class
  const vLayout = document.querySelector('.v-layout')
  if (vLayout) {
    vLayout.classList.remove('menu-hide')
  }
  
  // Also ensure menu overlay is not hidden
  const menuOverlay = document.querySelector('.menu-overlay')
  if (menuOverlay) {
    menuOverlay.classList.remove('hide')
  }
});
</script>

<style scoped>
/* Custom styles for Penolong Amil dashboard */
</style> 